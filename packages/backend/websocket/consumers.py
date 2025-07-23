from .models import ChatSession
from .services import ChatService, ChatNotificationService
from asgiref.sync import sync_to_async
import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .models import ChatSession, ChatMessage
from shop.models import ShopUser


class NotificationConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.user = self.scope.get('user')
        if not self.user or not self.user.is_authenticated:
            await self.close()
            return

        self.user_group = f'user_{self.user.id}'
        await self.channel_layer.group_add(self.user_group, self.channel_name)

        if self.user.is_staff:
            await self.channel_layer.group_add('admins', self.channel_name)

        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.user_group, self.channel_name)
        if self.user.is_staff:
            await self.channel_layer.group_discard('admins', self.channel_name)

    async def order_event(self, event):
        await self.send_json({
            'order': event.get('order'),
            'sender': event.get('sender'),
            'order_type': event.get('order_type'),
        })

    async def chat_notification(self, event):
        """Handle chat notifications."""
        await self.send_json(event.get('data', {}))


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.customer_id = self.scope['url_route']['kwargs']['session_id']
        self.room_group_name = f"chat_{self.customer_id}"
        self.user = self.scope.get('user')

        # Validate session ID format
        if not ChatService.validate_session_id(self.customer_id):
            await self.close()
            return

        print(f"Connecting to chat session for customer: {self.customer_id}")

        # Ensure session exists
        session_exists = await sync_to_async(ChatSession.objects.filter(customer_id=self.customer_id).exists)()
        if not session_exists:
            await sync_to_async(ChatService.create_chat_session)(customer_id=self.customer_id)

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive_json(self, content):
        """Handle incoming JSON messages."""
        try:
            sender_id = content.get('sender_id')
            message_text = content.get('message', '').strip()

            if not sender_id or not message_text:
                await self.send_json({
                    'error': 'Missing sender_id or message'
                })
                return

            # Get sender user
            try:
                sender = await sync_to_async(ShopUser.objects.get)(id=sender_id)
            except ShopUser.DoesNotExist:
                await self.send_json({
                    'error': 'Invalid sender_id'
                })
                return

            # Send message using service
            message = await sync_to_async(ChatService.send_message)(
                customer_id=self.customer_id,
                sender=sender,
                message=message_text
            )

            # Prepare message data
            message_data = {
                'id': message.id,
                'message': message.message,
                'sender_id': sender.id,
                'sender_name': 'Support Team' if sender.is_staff else sender.username,
                'is_staff': sender.is_staff,
                'timestamp': message.timestamp.isoformat()
            }

            # Send to chat room
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'data': message_data
                }
            )

            # Send notifications to admins if message is from customer
            if not sender.is_staff:
                notification_data = await sync_to_async(
                    ChatNotificationService.get_admin_notification_data
                )(message)

                await self.channel_layer.group_send(
                    'admins',
                    {
                        'type': 'chat_notification',
                        'data': notification_data
                    }
                )

        except Exception as e:
            await self.send_json({
                'error': f'Failed to send message: {str(e)}'
            })

    async def receive(self, text_data):
        """Handle text messages (backwards compatibility)."""
        try:
            data = json.loads(text_data)
            await self.receive_json(data)
        except json.JSONDecodeError:
            await self.send_json({
                'error': 'Invalid JSON format'
            })

    async def chat_message(self, event):
        """Send message to WebSocket."""
        await self.send_json(event.get('data', {}))

    async def chat_notification(self, event):
        """Handle chat notifications in this consumer as well."""
        await self.send_json(event.get('data', {}))
