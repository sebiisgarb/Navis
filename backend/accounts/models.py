from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
import re


PHONE_REGEX = re.compile(r"^0[7-9]\d{8}$")

class Roles(models.TextChoices):
    SITE_MANAGER = 'SITE_MANAGER', 'Site Manager'
    DRIVER = 'DRIVER', 'Driver'


class UserManager(BaseUserManager):
    def create_user(self, phone_number: str, password=None, **extra):
        if not phone_number or not PHONE_REGEX.match(phone_number):
            raise ValueError("Nr de telefon gresit")
        if password is None:
            raise ValueError("Password is required")

        user = self.model(phone_number=phone_number, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number: str, password: str, **extra):
        extra.setdefault('is_staff', True)
        extra.setdefault('is_superuser', True)

        if extra.get("is_staff") is not True or extra.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_staff=True and is_superuser=True")
        if password is None:
            raise ValueError("Superusers must have a password")

        return self.create_user(phone_number, password, **extra)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    phone_number = models.CharField(max_length=15, unique=True, default="0712345678")
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    role = models.CharField(max_length=15, choices=Roles.choices, default=Roles.DRIVER)

    USERNAME_FIELD = "phone_number"
    REQUIRED_FIELDS: list[str] = []

    objects = UserManager()

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"

    def __str__(self):
        return self.phone_number
