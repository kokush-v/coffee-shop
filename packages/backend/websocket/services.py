from typing import Optional, List, Dict, Any
from django.db import transaction
from django.db.models import Q, Prefetch
from django.utils import timezone
from django.core.exceptions import ValidationError
import uuid
import re

from .models import ChatSession, ChatMessage
from shop.models import ShopUser


class ChatService:
    """
    Service class for handling chat operations including sessions and messages.
    """

    @staticmethod
    def generate_session_id() -> str:
        """Generate a unique session ID for anonymous users."""
        return uuid.uuid4().hex

    @staticmethod
    def validate_session_id(session_id: str) -> bool:
        """Validate session ID format."""
        return bool(re.fullmatch(r'[0-9a-fA-F]{32}', session_id))

    @classmethod
    def create_chat_session(cls, customer_id: Optional[str] = None, user: Optional[ShopUser] = None) -> ChatSession:
        """
        Create a new chat session.

        Args:
            customer_id: Custom customer ID (if None, generates one)
            user: Associated user (optional for anonymous chats)

        Returns:
            ChatSession: Created chat session
        """
        if not customer_id:
            customer_id = cls.generate_session_id()

        if not cls.validate_session_id(customer_id):
            raise ValidationError("Invalid session ID format")

        with transaction.atomic():
            session, created = ChatSession.objects.get_or_create(
                customer_id=customer_id,
                defaults={
                    'is_active': True,
                    'created_at': timezone.now()
                }
            )

            if not created and not session.is_active:
                session.is_active = True
                session.save(update_fields=['is_active'])

        return session

    @classmethod
    def get_chat_session(cls, customer_id: str) -> Optional[ChatSession]:
        """
        Get chat session by customer ID.

        Args:
            customer_id: Customer session ID

        Returns:
            ChatSession or None
        """
        try:
            return ChatSession.objects.get(customer_id=customer_id, is_active=True)
        except ChatSession.DoesNotExist:
            return None

    @classmethod
    def get_active_sessions(cls, include_messages: bool = False) -> List[ChatSession]:
        """
        Get all active chat sessions.

        Args:
            include_messages: Whether to prefetch messages

        Returns:
            List of active ChatSession objects
        """
        queryset = ChatSession.objects.filter(
            is_active=True).order_by('-created_at')

        if include_messages:
            queryset = queryset.prefetch_related(
                Prefetch(
                    'messages',
                    queryset=ChatMessage.objects.select_related(
                        'sender').order_by('timestamp')
                )
            )

        return list(queryset)

    @classmethod
    def close_chat_session(cls, customer_id: str) -> bool:
        """
        Close a chat session.

        Args:
            customer_id: Customer session ID

        Returns:
            bool: True if session was closed, False if not found
        """
        try:
            session = ChatSession.objects.get(customer_id=customer_id)
            session.is_active = False
            session.save(update_fields=['is_active'])
            return True
        except ChatSession.DoesNotExist:
            return False

    @classmethod
    def send_message(cls, customer_id: str, sender: ShopUser, message: str) -> Optional[ChatMessage]:
        """
        Send a message in a chat session.

        Args:
            customer_id: Customer session ID
            sender: User sending the message
            message: Message content

        Returns:
            ChatMessage or None if session not found
        """
        session = cls.get_chat_session(customer_id)
        if not session:
            # Auto-create session if it doesn't exist
            session = cls.create_chat_session(customer_id)

        if not message.strip():
            raise ValidationError("Message cannot be empty")

        with transaction.atomic():
            chat_message = ChatMessage.objects.create(
                session=session,
                sender=sender,
                message=message.strip()
            )

        return chat_message

    @classmethod
    def get_session_messages(cls, customer_id: str, limit: Optional[int] = None) -> List[ChatMessage]:
        """
        Get messages for a chat session.

        Args:
            customer_id: Customer session ID
            limit: Maximum number of messages to return (newest first)

        Returns:
            List of ChatMessage objects
        """
        session = cls.get_chat_session(customer_id)
        if not session:
            return []

        queryset = ChatMessage.objects.filter(
            session=session).select_related('sender').order_by('-timestamp')

        if limit:
            queryset = queryset[:limit]

        return list(reversed(list(queryset)))  # Return in chronological order

    @classmethod
    def get_unread_sessions_count(cls) -> int:
        """
        Get count of sessions with unread messages from customers.
        This could be enhanced with a proper read/unread tracking system.

        Returns:
            int: Count of sessions with recent customer messages
        """
        # For now, return count of active sessions with messages in last 24 hours
        from datetime import timedelta
        cutoff_time = timezone.now() - timedelta(hours=24)

        return ChatSession.objects.filter(
            is_active=True,
            messages__timestamp__gte=cutoff_time
        ).distinct().count()

    @classmethod
    def search_messages(cls, query: str, customer_id: Optional[str] = None) -> List[ChatMessage]:
        """
        Search messages by content.

        Args:
            query: Search query
            customer_id: Optional customer ID to limit search to specific session

        Returns:
            List of matching ChatMessage objects
        """
        queryset = ChatMessage.objects.select_related('sender', 'session')

        if customer_id:
            queryset = queryset.filter(session__customer_id=customer_id)

        queryset = queryset.filter(
            Q(message__icontains=query)
        ).order_by('-timestamp')

        return list(queryset)

    @classmethod
    def get_session_stats(cls, customer_id: str) -> Dict[str, Any]:
        """
        Get statistics for a chat session.

        Args:
            customer_id: Customer session ID

        Returns:
            Dict with session statistics
        """
        session = cls.get_chat_session(customer_id)
        if not session:
            return {}

        messages = ChatMessage.objects.filter(session=session)

        total_messages = messages.count()
        customer_messages = messages.filter(sender__is_staff=False).count()
        staff_messages = messages.filter(sender__is_staff=True).count()

        last_message = messages.order_by('-timestamp').first()
        first_message = messages.order_by('timestamp').first()

        return {
            'session_id': customer_id,
            'created_at': session.created_at,
            'is_active': session.is_active,
            'total_messages': total_messages,
            'customer_messages': customer_messages,
            'staff_messages': staff_messages,
            'last_message_at': last_message.timestamp if last_message else None,
            'first_message_at': first_message.timestamp if first_message else None,
            'duration_minutes': (
                (timezone.now() - session.created_at).total_seconds() / 60
                if session.is_active else None
            )
        }

    @classmethod
    def cleanup_old_sessions(cls, days: int = 30) -> int:
        """
        Clean up old inactive sessions.

        Args:
            days: Number of days to keep inactive sessions

        Returns:
            int: Number of sessions deleted
        """
        from datetime import timedelta
        cutoff_date = timezone.now() - timedelta(days=days)

        with transaction.atomic():
            # First, delete associated messages
            old_sessions = ChatSession.objects.filter(
                is_active=False,
                created_at__lt=cutoff_date
            )

            sessions_to_delete = list(
                old_sessions.values_list('id', flat=True))

            if sessions_to_delete:
                ChatMessage.objects.filter(
                    session_id__in=sessions_to_delete).delete()
                deleted_count = old_sessions.delete()[0]
                return deleted_count

        return 0


class ChatNotificationService:
    """
    Service for handling chat notifications and real-time updates.
    """

    @staticmethod
    def get_admin_notification_data(message: ChatMessage) -> Dict[str, Any]:
        """
        Prepare notification data for admins when a new customer message arrives.

        Args:
            message: ChatMessage instance

        Returns:
            Dict with notification data
        """
        return {
            'type': 'new_chat_message',
            'session_id': message.session.customer_id,
            'message': message.message,
            'sender_name': message.sender.get_full_name() or message.sender.username,
            'sender_id': message.sender.id,
            'timestamp': message.timestamp.isoformat(),
            'is_customer': not message.sender.is_staff
        }

    @staticmethod
    def get_customer_notification_data(message: ChatMessage) -> Dict[str, Any]:
        """
        Prepare notification data for customers when a staff member replies.

        Args:
            message: ChatMessage instance

        Returns:
            Dict with notification data
        """
        return {
            'type': 'chat_reply',
            'message': message.message,
            'sender_name': 'Support Team',
            'sender_id': message.sender.id,
            'timestamp': message.timestamp.isoformat(),
            'is_staff': message.sender.is_staff
        }
