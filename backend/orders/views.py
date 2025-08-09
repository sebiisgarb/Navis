from django.utils.timezone import now
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from accounts.models import Roles
from logistics.models import DriverShift
from .models import Order, Delivery
from .serializers import OrderSerializer, DeliverySerializer
from .permissions import IsSiteManager, IsDriver


class OrderViewSet(ModelViewSet):
    serializer_class   = OrderSerializer
    permission_classes = [IsSiteManager]

    def get_queryset(self):
        user = self.request.user

        if user.role == Roles.SITE_MANAGER:
            return Order.objects.filter(created_by=user).order_by("-created_at")
        elif user.role == Roles.DRIVER:
            return Order.objects.filter(delivery__driver=user).order_by("-created_at")

        return Order.objects.all()

    def perform_create(self, serializer):
        order = serializer.save(created_by=self.request.user)
        # create a pending delivery offer, stamped now()
        Delivery.objects.create(order=order, status="PENDING", offered_at=now())


class DeliveryQueueView(ListAPIView):
    """
    GET /api/deliveries/queue/
    Only drivers who have started a shift today will see pending offers.
    """
    serializer_class   = DeliverySerializer
    permission_classes = [IsDriver]

    def get_queryset(self):
        today = now().date()
        # if driver has no shift today, show nothing
        if not DriverShift.objects.filter(driver=self.request.user, date=today).exists():
            return Delivery.objects.none()
        # otherwise show all pending
        return Delivery.objects.filter(status="PENDING").order_by("offered_at")


class DeliveryViewSet(ModelViewSet):
    """
    Handles GET /api/deliveries/ and POST /api/deliveries/{pk}/accept/
    """
    serializer_class   = DeliverySerializer
    permission_classes = [IsDriver]
    queryset           = Delivery.objects.select_related("order").all()

    @action(detail=True, methods=["post"], permission_classes=[IsDriver])
    def accept(self, request, pk=None):
        delivery = self.get_object()

        # only pending offers can be accepted
        if delivery.status != "PENDING":
            return Response(
                {"detail": "Already accepted or started"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # assign driver and update statuses
        delivery.driver = request.user
        delivery.status = "ACCEPTED"
        delivery.accepted_at = now()

        # also mark the order as assigned
        order = delivery.order
        order.status = "ASSIGNED"
        order.save(update_fields=["status"])

        # save delivery fields
        delivery.save(update_fields=["driver", "status", "accepted_at"])

        # return serialized delivery (with nested order if your serializer does)
        return Response(self.get_serializer(delivery).data, status=status.HTTP_200_OK)
