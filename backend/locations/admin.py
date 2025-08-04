from django.contrib import admin
from .models import Location


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ("id", "location_type", "address", "active")
    list_filter = ("location_type", "active")
    search_fields = ("address",)
