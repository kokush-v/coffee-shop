from django.db import models
from shop.models import ShopUser


class ChatSession(models.Model):
    customer_id = models.CharField(
        max_length=255, unique=True, default="anonymous")
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)


class ChatMessage(models.Model):
    session = models.ForeignKey(
        ChatSession, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(ShopUser, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
