from django.urls import path
from . import views

app_name = 'websocket'

urlpatterns = [
    # Chat Session Management
    path('chat/sessions/', views.ChatSessionListView.as_view(),
         name='chat-session-list'),
    path('chat/sessions/create/', views.create_chat_session,
         name='chat-session-create'),
    path('chat/sessions/<str:session_id>/',
         views.ChatSessionDetailView.as_view(), name='chat-session-detail'),
    path('chat/sessions/<str:session_id>/stats/',
         views.ChatSessionStatsView.as_view(), name='chat-session-stats'),

    # Chat Messages
    path('chat/sessions/<str:session_id>/messages/',
         views.ChatMessageListView.as_view(), name='chat-messages'),
    path('chat/messages/send/', views.SendMessageView.as_view(), name='send-message'),
    path('chat/messages/search/', views.search_messages, name='search-messages'),

    # Admin Dashboard & Management
    path('chat/dashboard/stats/', views.chat_dashboard_stats,
         name='chat-dashboard-stats'),
    path('chat/admin/cleanup/', views.cleanup_old_sessions,
         name='cleanup-old-sessions'),
]
