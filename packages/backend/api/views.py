from django.forms import model_to_dict
from shop.models import Product
from rest_framework import viewsets
from .serializers import CustomTokenObtainPairSerializer, ProductSerializer, RegisterShopUserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView


class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    http_method_names = ['get']


class RegisterShopUserView(generics.CreateAPIView):
    serializer_class = RegisterShopUserSerializer
    permission_classes = [AllowAny]


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class GetUserView(generics.RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        user = model_to_dict(
            request.user, fields=['id', 'email', 'username'])

        return Response(user)
