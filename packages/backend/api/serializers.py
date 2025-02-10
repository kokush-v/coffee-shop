from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from shop.models import Product, ShopUser
from django.forms.models import model_to_dict


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class RegisterShopUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(min_length=8)
    first_name = serializers.CharField(min_length=2)
    last_name = serializers.CharField(min_length=2)

    class Meta:
        model = ShopUser
        fields = ['email', 'first_name', 'last_name', 'password']

    def create(self, validated_data):
        user = ShopUser.objects.create_user(**validated_data)
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        user_dict = model_to_dict(
            self.user, fields=['id', 'email', 'first_name', 'last_name'])

        data['user'] = user_dict
        return {'token': data['access'], 'user': user_dict}
