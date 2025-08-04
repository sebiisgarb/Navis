from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView
from rest_framework.decorators import action
from django.utils.timezone import now
from rest_framework.response import Response
from .models import Order, Delivery
from .serializers import OrderSerializer, DeliverySerializer
from .permissions import IsSiteManager, IsDriver
from orders.permissions import IsSiteManager, IsDriver
from accounts.models import Roles



class OrderViewSet(ModelViewSet):
    serializer_class = OrderSerializer
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
        Delivery.objects.create(order=order, status="PENDING", offered_at=now())


class DeliveryQueueView(ListAPIView):
    serializer_class = DeliverySerializer
    permission_classes = [IsDriver]

    def get_queryset(self):
        today = now().date()
        if not DriverShift.objects.filter(driver=self.request.user, date=today).exists():
            return Delivery.objects.none()
        return Delivery.objects.filter(status="PENDING").order_by("offered_at")



class DeliveryViewSet(ModelViewSet):
    serializer_class = DeliverySerializer
    permission_classe = [IsDriver]
    queryset = Delivery.objects.select_related("order").all()

    @action(detail=True, methods=["post"], permission_classes=[IsDriver])
    def accept(self, request, pk=None):
        delivery = self.get_object()
        if delivery.status != "PENDING":
            return Response({"detail": "Already accepted or started"}, status=status.HTTP_400_BAD_REQUEST)

        delivery.driver = request.user
        delivery.status = "ACCEPTED"
        delivery.accepted_at = now()
        delivery.order.status = "ASSIGNED"
        delivery.order.save()
        delivery.save()
        return Response(DeliverySerializer(delivery).data, status=status.HTTP_200_OK)
