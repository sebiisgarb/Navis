from orders.permissions import IsDriver
from logistics.serializers import CarSerializer, DriverShiftSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from rest_framework import status
from logistics.models import Car, DriverShift
from django.shortcuts import get_object_or_404
from rest_framework.generics import ListAPIView


class AvailableCarsView(ListAPIView):
    serializer_class = CarSerializer
    permission_classes = [IsDriver]

    def get_queryset(self):
        today = timezone.now().date()
        busy = DriverShift.objects.filter(date=today).values_list('car', flat=True)
        return Car.objects.filter(active=True).exclude(id__in=busy)

class StartShiftView(APIView):
    permission_classes = [IsDriver]

    def post(self, request, car_id):
        today = timezone.now().date()
        if DriverShift.objects.filter(driver=request.user, date=today).exists():
            return Response({"detail": "You already have an active shift for today."}, status=status.HTTP_400_BAD_REQUEST)
        car = get_object_or_404(Car, pk=car_id, active=True)
        if DriverShift.objects.filter(car=car, date=today).exists():
            return Response({"detail": "This car is already assigned to another driver for today."}, status=status.HTTP_400_BAD_REQUEST)
        DriverShift.objects.create(driver=request.user, car=car, date=today)
        return Response({"detail": "Shift started successfully."}, status=status.HTTP_201_CREATED)
