"""
URL configuration for core project.
NOTĂ GENERALĂ PENTRU MOBILE:
- Toate endpoint-urile sunt prefixate cu /api/
- Header obligatoriu (după login): Authorization: Bearer <access>
- Format: JSON; toate rutele se termină cu slash (/)
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import PhoneTokenObtainPairView
from orders.views import OrderViewSet, DeliveryViewSet, DeliveryQueueView
from logistics.views import AvailableCarsView, StartShiftView
from locations.views import LocationViewSet

router = DefaultRouter()

# ──────────────────────────────────────────────────────────────────────────────
# /api/orders/  (Site Manager)
# 1) GET  /api/orders/
#    - returnează DOAR comenzile create de Site Manager-ul logat
#    - 200: [
#        {"id": 34, "description": "10 saci ciment", "source_loc": 1,
#         "destination_loc": 2, "status": "NEW", "created_at": "...", "created_by": 7},
#        ...
#      ]
#
# 2) POST /api/orders/
#    Body:
#      { "description": "10 saci ciment", "source_loc": 1, "destination_loc": 2 }
#    - 201: obiectul Order creat (se creează automat și Delivery cu status PENDING)
#
# 3) GET  /api/orders/{id}/
#    - 200: obiect Order
#
# 4) PATCH /api/orders/{id}/      (opțional în app: editezi description / locații)
#    Body (ex.): { "description": "..." }
#    - 200: obiect Order actualizat
#
# 5) DELETE /api/orders/{id}/     (dacă păstrați behavior-ul default al ModelViewSet)
#    - 204: fără conținut
#
# Autorizare: Site Manager (Authorization: Bearer <access>)
# ──────────────────────────────────────────────────────────────────────────────
router.register(r"orders", OrderViewSet, basename="orders")

# ──────────────────────────────────────────────────────────────────────────────
# /api/deliveries/  (Driver)
# 1) GET  /api/deliveries/
#    - lista livrărilor șoferului logat (de regulă cele ACCEPTED/STARTED/FINISHED)
#    - 200: [
#        {"id": 12, "status": "ACCEPTED", "order": {"id": 34, "description": "..."},
#         "offered_at": "...", "accepted_at": "...", "driver": "07xxxxxxx"},
#        ...
#      ]
#
# 2) GET  /api/deliveries/{id}/
#    - 200: obiect Delivery
#
# 3) POST /api/deliveries/{id}/accept/   (custom action definit pe ViewSet)
#    Body: (gol)
#    - 200: Delivery actualizat:
#      {"id": 12, "status": "ACCEPTED", "accepted_at": "...",
#       "order": {"id": 34, "status": "ASSIGNED", "description": "..."}}
#    - 400: { "detail": "Already accepted or started" }
#
# Autorizare: Driver (Authorization: Bearer <access>)
# ──────────────────────────────────────────────────────────────────────────────
router.register(r"deliveries", DeliveryViewSet, basename="deliveries")

# ──────────────────────────────────────────────────────────────────────────────
# /api/locations/  (toți userii AUTENTIFICAȚI)
# 1) GET  /api/locations/
#    - 200: [
#        {"id": 1, "address": "Depozit A, Str...", "location_type": "WAREHOUSE", "active": true},
#        {"id": 2, "address": "Șantier X, Str...", "location_type": "SITE", "active": true}
#      ]
#
# 2) GET  /api/locations/{id}/
#    - 200: obiect Location
#
# Autorizare: orice utilizator autentificat (Authorization: Bearer <access>)
# ──────────────────────────────────────────────────────────────────────────────
router.register(r"locations", LocationViewSet, basename="locations")


urlpatterns = [
    # ───────────────────────────────────────────────────────────────────────────
    # ADMIN (NU pentru mobile)
    # ───────────────────────────────────────────────────────────────────────────
    path('api/admin/', admin.site.urls),

    # ───────────────────────────────────────────────────────────────────────────
    # AUTH (JWT)
    # ───────────────────────────────────────────────────────────────────────────
    # POST /api/token/
    # Body:
    #   { "phone_number": "07xxxxxxxx", "password": "..." }
    # Răspuns 200:
    #   { "access": "<jwt>", "refresh": "<jwt>" }
    # Notă: payload-ul "access" conține `role` (SITE_MANAGER / DRIVER / ADMIN).
    path('api/token/', PhoneTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # POST /api/token/refresh/
    # Body:
    #   { "refresh": "<jwt_refresh>" }
    # Răspuns 200:
    #   { "access": "<jwt_nou>" }
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ───────────────────────────────────────────────────────────────────────────
    # DELIVERIES – COADĂ PENTRU ȘOFERI (OFERTE)
    # ───────────────────────────────────────────────────────────────────────────
    # GET /api/deliveries/queue/
    # Header:
    #   Authorization: Bearer <access>   (rol DRIVER) + shift activ azi
    # Răspuns 200: [ { "id": 12, "status": "PENDING", "offered_at": "...",
    #                  "order": { "id": 34, "description": "..." } }, ... ]
    # Răspuns 403: dacă driverul NU are shift pornit azi
    # Răspuns 401: dacă lipsește/expiră token-ul
    path("api/deliveries/queue/", DeliveryQueueView.as_view(), name="delivery-queue"),

    # ───────────────────────────────────────────────────────────────────────────
    # LOGISTICS – MAȘINI & SHIFT
    # ───────────────────────────────────────────────────────────────────────────
    # GET /api/cars/available/
    # Header: Authorization: Bearer <access> (rol DRIVER)
    # Răspuns 200: [ { "id": 1, "registration_no": "B-99-ABC", "active": true }, ... ]
    path("api/cars/available/", AvailableCarsView.as_view(), name="available-cars"),

    # POST /api/shifts/start/<car_id>/
    # Header: Authorization: Bearer <access> (rol DRIVER)
    # Body: (gol)
    # Răspuns 201: { "detail": "Shift started" }
    # Erori 400: deja are shift / mașina e luată
    path("api/shifts/start/<int:car_id>/", StartShiftView.as_view(), name="start-shift"),

    # ───────────────────────────────────────────────────────────────────────────
    # ROUTER DRF – REST standard pentru:
    #   /api/orders/        (Site Manager)
    #   /api/deliveries/    (Driver)
    #   /api/locations/     (User autenticat)
    # ───────────────────────────────────────────────────────────────────────────
    path("api/", include(router.urls)),
]
