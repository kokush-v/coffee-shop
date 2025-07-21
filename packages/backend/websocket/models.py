from django.db import models
from django.utils import timezone
from shop.models import ShopUser


class ChatSession(models.Model):
    customer_id = models.CharField(
        max_length=255, unique=True, default="anonymous")
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Chat Session: {self.customer_id}"

    @property
    def last_message(self):
        """Get the last message in this session."""
        return self.messages.order_by('-timestamp').first()

    @property
    def message_count(self):
        """Get total number of messages in this session."""
        return self.messages.count()

    @property
    def customer_message_count(self):
        """Get number of messages from customers (non-staff)."""
        return self.messages.filter(sender__is_staff=False).count()

    @property
    def staff_message_count(self):
        """Get number of messages from staff."""
        return self.messages.filter(sender__is_staff=True).count()

    def get_session_duration(self):
        """Get session duration in minutes."""
        if self.is_active:
            return (timezone.now() - self.created_at).total_seconds() / 60
        last_message = self.last_message
        if last_message:
            return (last_message.timestamp - self.created_at).total_seconds() / 60
        return 0

    class Meta:
        ordering = ['-created_at']


class ChatMessage(models.Model):
    session = models.ForeignKey(
        ChatSession, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(ShopUser, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        sender_name = "Support" if self.sender.is_staff else "Customer"
        return f"{sender_name}: {self.message[:50]}..."

    @property
    def is_staff_message(self):
        """Check if message is from staff."""
        return self.sender.is_staff

    @property
    def sender_display_name(self):
        """Get display name for the sender."""
        if self.sender.is_staff:
            return 'Support Team'
        return self.sender.get_full_name() or self.sender.username

    class Meta:
        ordering = ['timestamp']
