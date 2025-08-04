from django.db import models
from accounts.models import CustomUser
from django.utils.translation import gettext_lazy as _


class Car(models.Model):
    registration_number = models.CharField(max_length=15, unique=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.registration_number


class DriverShift(models.Model):
    driver = models.ForeignKey(CustomUser, limit_choices_to={"role": "DRIVER"}, on_delete=models.CASCADE)
    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    date = models.DateField()

    class Meta:
        unique_together = [('driver', 'date')]


    def __str__(self):
        return f"{self.driver.first_name} - {self.car.registration_number} on {self.date}"
