from os import name
from django.urls import include, path
from rest_framework import routers

from .views import CustomTokenObtainPairView, GetUserView, ProductViewSet, RegisterShopUserView

router = routers.DefaultRouter()
router.register('products', ProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', CustomTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('register/', RegisterShopUserView.as_view(), name='register'),
    path('user/', GetUserView.as_view(), name='user'),

]
