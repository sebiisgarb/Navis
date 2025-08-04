from django.shortcuts import render
from rest_framework.viewsets import ReadOnlyModelViewSet
from orders.permissions import IsSiteManager
from rest_framework.permissions import IsAuthenticated
from .models import Location
from .serializers import LocationSerializer


class LocationViewSet(ReadOnlyModelViewSet):
    queryset = Location.objects.filter(active=True)
    serializer_class = LocationSerializer
    permission_classes = [IsAuthenticated]
