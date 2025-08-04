from rest_framework import serializers
from .models import Order, Delivery


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"
        read_only_fields = ("id", "created_by", "status", "created_at")


class DeliverySerializer(serializers.ModelSerializer):
    order = OrderSerializer(read_only=True)
    driver_name = serializers.CharField(source="driver.phone_number", read_only=True)

    class Meta:
        model = Delivery
        fields = "__all__"
        read_only_fields = ("id", "offered_at", "accepted_at", "status", "driver")
