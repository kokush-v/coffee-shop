from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from shop.models import ShopUser
from django.forms.models import model_to_dict


class RegisterShopUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(min_length=8)
    username = serializers.CharField(min_length=2)

    class Meta:
        model = ShopUser
        fields = ['email', 'username', 'password']

    def create(self, validated_data):
        user = ShopUser.objects.create_user(**validated_data)
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        token['is_staff'] = user.is_staff
        
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)

        user_dict = model_to_dict(
            self.user, fields=['id', 'email', 'username', 'is_staff'])

        data['user'] = user_dict
        return {'token': data['access'], 'user': user_dict}
