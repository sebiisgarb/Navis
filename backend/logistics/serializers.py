from rest_framework import serializers
from .models import Car, DriverShift

class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = "__all__"

class DriverShiftSerializer(serializers.ModelSerializer):
    driver = serializers.StringRelatedField()
    class Meta:
        model = DriverShift
        fields = "__all__"
