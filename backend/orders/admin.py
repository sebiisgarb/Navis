from django.contrib import admin
from .models import Order, Delivery

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "description", "status", "created_by", "created_at")
    list_filter = ("status", "created_by")
    search_fields = ("description",)

@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "status", "driver", "offered_at", "accepted_at")
    list_filter = ("status",)
