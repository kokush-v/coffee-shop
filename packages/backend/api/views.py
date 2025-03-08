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
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter

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
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status', 'created_at']
    ordering_fields = ['created_at', 'updated_at']

    def get_queryset(self):
        queryset = Order.objects.all().order_by("-created_at")

        status = self.request.query_params.get('status')
        staff_orders = self.request.query_params.get('staff_orders', False)
        
        if status:
            queryset = queryset.filter(status=status)

        if not self.request.user.is_staff or staff_orders:
            queryset = queryset.filter(user=self.request.user)

        return queryset

    def perform_update(self, serializer):
        allowed_fields = {"status"}
        
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
