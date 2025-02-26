from django.forms import model_to_dict
from shop.serializers import OrderSerializer, ProductSerializer
from shop.models import Order, Product
from rest_framework import viewsets
from .serializers import CustomTokenObtainPairSerializer, RegisterShopUserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.exceptions import ValidationError

class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    http_method_names = ['get']


class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    http_method_names = ['get', 'post', 'put']
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all().order_by("-created_at")
        
        
        return Order.objects.filter(user=self.request.user).order_by("-created_at")
    
    def perform_update(self, serializer):
        allowed_fields = {"products", "status", 'note'}
        
        if not self.request.user.is_staff:         
            if serializer.validated_data.get("status") == "ready":
                raise ValidationError({"status": "You can’t set status 'ready'."})
               
            for field in list(serializer.validated_data.keys()):
                if field not in allowed_fields:
                    serializer.validated_data.pop(field, None)
        
        serializer.save()


class RegisterShopUserView(generics.CreateAPIView):
    serializer_class = RegisterShopUserSerializer
    permission_classes = [AllowAny]


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class GetUserView(generics.RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        user = model_to_dict(
            request.user, fields=['id', 'email', 'username', 'is_staff'])

        return Response(user)
