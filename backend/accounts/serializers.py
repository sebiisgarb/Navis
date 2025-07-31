from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils.translation import gettext_lazy as _

class PhoneTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "phone_number"

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        return token
