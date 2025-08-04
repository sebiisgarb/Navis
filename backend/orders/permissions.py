# orders/permissions.py

from rest_framework.permissions import BasePermission, SAFE_METHODS
from accounts.models import Roles

class IsSiteManager(BasePermission):
    """Permite doar utilizatorilor autentificați cu role=SITE_MANAGER."""
    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and user.role == Roles.SITE_MANAGER
        )

class IsDriver(BasePermission):
    """Permite doar utilizatorilor autentificați cu role=DRIVER."""
    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and user.role == Roles.DRIVER
        )

class IsDriverOrReadOnly(BasePermission):
    """
    - SITE_MANAGER: full access
    - DRIVER: doar SAFE_METHODS (GET, HEAD, OPTIONS) la list/create
    - object-level: DRIVER poate accesa doar propriile obiecte
    """
    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        if user.role == Roles.SITE_MANAGER:
            return True
        if user.role == Roles.DRIVER and request.method in SAFE_METHODS:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        if user.role == Roles.SITE_MANAGER:
            return True
        if user.role == Roles.DRIVER:
            # presupunem că modelul are atribut `driver` (FK) sau `driver_id`
            return getattr(obj, "driver_id", None) == user.id
        return False
