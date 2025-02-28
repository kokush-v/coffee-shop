from channels.generic.websocket import AsyncWebsocketConsumer
import json


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']

        if not self.user.is_authenticated:
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
        await self.send(text_data=json.dumps({
            'order': event['order'],
            'sender': event['sender'],
            'order_type': event['order_type']
        }, ensure_ascii=False))
