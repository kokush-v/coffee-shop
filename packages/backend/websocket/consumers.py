from channels.generic.websocket import AsyncWebsocketConsumer
import json


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']

        print(self.user.username)

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

    async def receive(self, text_data):
        data = json.loads(text_data)
        order = data["order"]

        if self.user.is_staff:
            recipient_id = data.get("recipient_id")
            if recipient_id:
                group_name = f"user_{recipient_id}"

                await self.channel_layer.group_send(group_name, {
                    "type": "order_event",
                    "order": order,
                    "sender": self.user.username
                })
        else:
            await self.channel_layer.group_send("admins", {
                "type": "order_event",
                "message": order,
                "sender": self.user.username,
                "user_id": self.user.id
            })

    async def order_event(self, event):
        await self.send(text_data=json.dumps({
            'order': event['order'],
            'sender': event['sender']
        }, ensure_ascii=False))
