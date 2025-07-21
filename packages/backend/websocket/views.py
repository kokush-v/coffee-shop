from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils import timezone

from .models import ChatSession, ChatMessage
from .services import ChatService, ChatNotificationService
from .serializers import (
    ChatSessionSerializer,
    ChatSessionListSerializer,
    ChatMessageSerializer,
    SendMessageSerializer,
    ChatSessionStatsSerializer
)
from api.permissions import IsAdminRole


class ChatSessionPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class ChatSessionListView(APIView):
    """
    API view for listing chat sessions.
    Staff can see all sessions, regular users see only their own.
    """
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = ChatSessionPagination

    def get(self, request):
        """Get list of chat sessions with optional filtering."""
        queryset = ChatSession.objects.prefetch_related(
            'messages__sender').order_by('-created_at')

        # Filter by active status if specified
        is_active = request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')

        # Staff can see all sessions, others see only their own
        if not request.user.is_staff:
            # For regular users, filter by their own sessions
            # This assumes the customer_id is somehow linked to the user
            # You might need to adjust this logic based on your user model
            queryset = queryset.filter(
                messages__sender=request.user).distinct()

        # Search functionality
        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(customer_id__icontains=search) |
                Q(messages__message__icontains=search)
            ).distinct()

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)

        if page is not None:
            serializer = ChatSessionListSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = ChatSessionListSerializer(queryset, many=True)
        return Response(serializer.data)


class ChatSessionDetailView(APIView):
    """
    API view for managing individual chat sessions.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, session_id):
        """Get detailed information about a chat session."""
        session = get_object_or_404(ChatSession, customer_id=session_id)

        # Check permissions - staff can see all, users can see only their own
        if not request.user.is_staff:
            # Check if user has messages in this session
            if not session.messages.filter(sender=request.user).exists():
                return Response(
                    {'error': 'Permission denied'},
                    status=status.HTTP_403_FORBIDDEN
                )

        serializer = ChatSessionSerializer(session)
        return Response(serializer.data)

    def patch(self, request, session_id):
        """Update chat session (e.g., close/activate)."""
        if not request.user.is_staff:
            return Response(
                {'error': 'Only staff can modify sessions'},
                status=status.HTTP_403_FORBIDDEN
            )

        session = get_object_or_404(ChatSession, customer_id=session_id)

        # Only allow updating is_active field
        is_active = request.data.get('is_active')
        if is_active is not None:
            session.is_active = bool(is_active)
            session.save(update_fields=['is_active'])

        serializer = ChatSessionSerializer(session)
        return Response(serializer.data)

    def delete(self, request, session_id):
        """Delete a chat session (staff only)."""
        if not request.user.is_staff:
            return Response(
                {'error': 'Only staff can delete sessions'},
                status=status.HTTP_403_FORBIDDEN
            )

        session = get_object_or_404(ChatSession, customer_id=session_id)
        session.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ChatMessageListView(APIView):
    """
    API view for getting messages in a chat session.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, session_id):
        """Get messages for a specific chat session."""
        session = get_object_or_404(ChatSession, customer_id=session_id)

        # Check permissions
        if not request.user.is_staff:
            if not session.messages.filter(sender=request.user).exists():
                return Response(
                    {'error': 'Permission denied'},
                    status=status.HTTP_403_FORBIDDEN
                )

        # Get query parameters
        limit = request.query_params.get('limit')
        if limit:
            try:
                limit = int(limit)
            except ValueError:
                limit = None

        messages = ChatService.get_session_messages(session_id, limit)
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)


class SendMessageView(APIView):
    """
    API view for sending messages in a chat session.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Send a message in a chat session."""
        serializer = SendMessageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        message_text = serializer.validated_data['message']
        session_id = serializer.validated_data.get('session_id')

        # If no session_id provided, generate one for new session
        if not session_id:
            session_id = ChatService.generate_session_id()

        try:
            message = ChatService.send_message(
                customer_id=session_id,
                sender=request.user,
                message=message_text
            )

            response_data = ChatMessageSerializer(message).data
            response_data['session_id'] = session_id

            return Response(response_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class ChatSessionStatsView(APIView):
    """
    API view for getting chat session statistics.
    """
    permission_classes = [IsAdminRole]

    def get(self, request, session_id):
        """Get statistics for a specific chat session."""
        stats = ChatService.get_session_stats(session_id)
        if not stats:
            return Response(
                {'error': 'Session not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ChatSessionStatsSerializer(stats)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_chat_session(request):
    """
    Create a new chat session.
    """
    customer_id = request.data.get('customer_id')

    try:
        session = ChatService.create_chat_session(
            customer_id=customer_id,
            user=request.user
        )

        serializer = ChatSessionSerializer(session)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([IsAdminRole])
def chat_dashboard_stats(request):
    """
    Get dashboard statistics for chat system (admin only).
    """
    try:
        active_sessions_count = ChatSession.objects.filter(
            is_active=True).count()
        total_sessions_count = ChatSession.objects.count()
        unread_count = ChatService.get_unread_sessions_count()

        # Get recent activity (last 24 hours)
        from datetime import timedelta
        yesterday = timezone.now() - timedelta(hours=24)
        recent_messages_count = ChatMessage.objects.filter(
            timestamp__gte=yesterday
        ).count()

        new_sessions_today = ChatSession.objects.filter(
            created_at__gte=yesterday
        ).count()

        stats = {
            'active_sessions': active_sessions_count,
            'total_sessions': total_sessions_count,
            'unread_sessions': unread_count,
            'recent_messages_24h': recent_messages_count,
            'new_sessions_today': new_sessions_today,
            'timestamp': timezone.now()
        }

        return Response(stats)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAdminRole])
def cleanup_old_sessions(request):
    """
    Clean up old inactive chat sessions (admin only).
    """
    days = request.data.get('days', 30)

    try:
        days = int(days)
        if days < 1:
            return Response(
                {'error': 'Days must be a positive integer'},
                status=status.HTTP_400_BAD_REQUEST
            )

        deleted_count = ChatService.cleanup_old_sessions(days)

        return Response({
            'message': f'Successfully deleted {deleted_count} old sessions',
            'deleted_count': deleted_count
        })

    except ValueError:
        return Response(
            {'error': 'Invalid days parameter'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def search_messages(request):
    """
    Search messages across chat sessions.
    """
    query = request.query_params.get('q', '').strip()
    if not query:
        return Response(
            {'error': 'Search query is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    session_id = request.query_params.get('session_id')

    # Non-staff users can only search their own messages
    if not request.user.is_staff and not session_id:
        return Response(
            {'error': 'Session ID is required for non-staff users'},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        messages = ChatService.search_messages(query, session_id)

        # Filter messages for non-staff users
        if not request.user.is_staff:
            messages = [msg for msg in messages if msg.sender == request.user or
                        msg.session.messages.filter(sender=request.user).exists()]

        serializer = ChatMessageSerializer(messages, many=True)
        return Response({
            'query': query,
            'results_count': len(messages),
            'messages': serializer.data
        })

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
