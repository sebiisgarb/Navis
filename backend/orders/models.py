from django.conf import settings
from django.db import models
from locations.models import Location  # sau importă corect, dacă Location e în alt app


class Order(models.Model):
    STATUS_CHOICES = [
        ("NEW", "New"),
        ("ASSIGNED", "Assigned"),
        ("ON_ROUTE", "On route"),
        ("DONE", "Done"),
    ]

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders"
    )
    description = models.TextField()
    source_loc = models.ForeignKey(
        Location, on_delete=models.PROTECT, related_name="source_orders"
    )
    destination_loc = models.ForeignKey(
        Location, on_delete=models.PROTECT, related_name="destination_orders"
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="NEW")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.pk} – {self.status}"


class Delivery(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("ACCEPTED", "Accepted"),
        ("STARTED", "Started"),
        ("FINISHED", "Finished"),
    ]

    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    driver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="deliveries",
        limit_choices_to={"role": "DRIVER"},
    )
    car = models.ForeignKey("logistics.Car", on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="PENDING")
    offered_at = models.DateTimeField(auto_now_add=True)
    accepted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Delivery {self.pk} – {self.status}"
