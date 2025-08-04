from django.db import models

class LocationType(models.TextChoices):
    WAREHOUSE = "WAREHOUSE", "Warehouse"
    SITE = "SITE", "Site"
    SUPPLIER = "SUPPLIER", "Supplier"


class Location(models.Model):
    location_type = models.CharField(
        max_length=20,
        choices=LocationType.choices,
        default=LocationType.WAREHOUSE,
    )
    address = models.CharField(max_length=255)
    active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return f"{self.location_type} - {self.address}"
