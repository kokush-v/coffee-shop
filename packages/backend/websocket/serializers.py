
from rest_framework import serializers
from .models import ChatSession, ChatMessage
from shop.serializers import ShopUserSerializer


class ChatMessageSerializer(serializers.ModelSerializer):
    sender = ShopUserSerializer(read_only=True)
    sender_name = serializers.SerializerMethodField()
    is_staff_message = serializers.SerializerMethodField()

    class Meta:
        model = ChatMessage
        fields = [
            'id', 'message', 'timestamp', 'sender',
            'sender_name', 'is_staff_message'
        ]
        read_only_fields = ['id', 'timestamp', 'sender']

    def get_sender_name(self, obj):
        """Get display name for the sender."""
        if obj.sender.is_staff:
            return 'Support Team'
        return obj.sender.username

    def get_is_staff_message(self, obj):
        """Check if message is from staff."""
        return obj.sender.is_staff


class ChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)
    message_count = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    last_activity = serializers.SerializerMethodField()

    class Meta:
        model = ChatSession
        fields = [
            'id', 'customer_id', 'created_at', 'is_active',
            'messages', 'message_count', 'last_message', 'last_activity'
        ]
        read_only_fields = ['id', 'created_at']

    def get_message_count(self, obj):
        """Get total number of messages in the session."""
        return obj.messages.count()

    def get_last_message(self, obj):
        """Get the last message in the session."""
        last_message = obj.messages.order_by('-timestamp').first()
        if last_message:
            return ChatMessageSerializer(last_message).data
        return None

    def get_last_activity(self, obj):
        """Get timestamp of last activity in the session."""
        last_message = obj.messages.order_by('-timestamp').first()
        return last_message.timestamp if last_message else obj.created_at


class ChatSessionListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing chat sessions."""
    message_count = serializers.SerializerMethodField()
    last_message_preview = serializers.SerializerMethodField()
    last_activity = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = ChatSession
        fields = [
            'id', 'customer_id', 'created_at', 'is_active',
            'message_count', 'last_message_preview', 'last_activity', 'unread_count'
        ]

    def get_message_count(self, obj):
        """Get total number of messages in the session."""
        return obj.messages.count()

    def get_last_message_preview(self, obj):
        """Get preview of the last message."""
        last_message = obj.messages.order_by('-timestamp').first()
        if last_message:
            preview = last_message.message[:50]
            if len(last_message.message) > 50:
                preview += "..."
            return {
                'preview': preview,
                'sender_name': 'Support Team' if last_message.sender.is_staff else last_message.sender.username,
                'is_staff': last_message.sender.is_staff,
                'timestamp': last_message.timestamp
            }
        return None

    def get_last_activity(self, obj):
        """Get timestamp of last activity in the session."""
        last_message = obj.messages.order_by('-timestamp').first()
        return last_message.timestamp if last_message else obj.created_at

    def get_unread_count(self, obj):
        """Get count of unread messages (placeholder for future implementation)."""
        # This would require a proper read tracking system
        # For now, return 0 as placeholder
        return 0


class SendMessageSerializer(serializers.Serializer):
    """Serializer for sending messages."""
    message = serializers.CharField(max_length=1000, allow_blank=False)
    session_id = serializers.CharField(max_length=32, required=False)

    def validate_message(self, value):
        """Validate message content."""
        if not value.strip():
            raise serializers.ValidationError("Message cannot be empty.")
        return value.strip()

    def validate_session_id(self, value):
        """Validate session ID format."""
        import re
        if value and not re.fullmatch(r'[0-9a-fA-F]{32}', value):
            raise serializers.ValidationError("Invalid session ID format.")
        return value


class ChatSessionStatsSerializer(serializers.Serializer):
    """Serializer for chat session statistics."""
    session_id = serializers.CharField()
    created_at = serializers.DateTimeField()
    is_active = serializers.BooleanField()
    total_messages = serializers.IntegerField()
    customer_messages = serializers.IntegerField()
    staff_messages = serializers.IntegerField()
    last_message_at = serializers.DateTimeField(allow_null=True)
    first_message_at = serializers.DateTimeField(allow_null=True)
    duration_minutes = serializers.FloatField(allow_null=True)
