from .models import ChatSession
from asgiref.sync import sync_to_async
import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .models import ChatSession, ChatMessage
from shop.models import ShopUser
import re


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


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.customer_id = self.scope['url_route']['kwargs']['session_id']
        self.room_group_name = f"chat_{self.customer_id}"

        if not re.fullmatch(r'[0-9a-fA-F]{32}', self.customer_id):
            await self.close()
            return

        print(f"Connecting to chat session for customer: {self.customer_id}")

        session_exists = await sync_to_async(ChatSession.objects.filter(customer_id=self.customer_id).exists)()
        if not session_exists:
            await sync_to_async(ChatSession.objects.create)(customer_id=self.customer_id)

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

    async def receive(self, text_data):
        data = json.loads(text_data)
        sender_id = data.get('sender_id', 'anonymous')
        message = data.get('message', '')

        # Save message
        session = await sync_to_async(ChatSession.objects.get)(id=self.customer_id)
        sender = await sync_to_async(ShopUser.objects.get)(id=sender_id)
        await sync_to_async(ChatMessage.objects.create)(
            session=session, sender=sender, message=message
        )

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender_id': sender_id,
            }
        )

    async def chat_message(self, event):
        await self.send_json({
            'message': event['message'],
            'sender_id': event['sender_id'],
        })
