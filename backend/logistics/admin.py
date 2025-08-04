from django.contrib import admin
from .models import Car, DriverShift

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('registration_number', 'active')
    search_fields = ('registration_number',)
    list_filter = ('active',)
    ordering = ('registration_number',)


@admin.register(DriverShift)
class DriverShiftAdmin(admin.ModelAdmin):
    list_display = ('driver', 'car', 'date')
    list_filter = ('date', 'car')
    ordering = ('-date',)
