from channels.generic.websocket import AsyncWebsocketConsumer
import json


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope.get('user')
        print(self.user)

        if self.user and self.user.is_authenticated:
            self.group_name = f"user_{self.user.id}"
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            await self.accept()
        else:
            print("User is not authenticated, closing connection.")
            await self.close()

    async def disconnect(self, close_code):
        print(f"User {self.user} is disconnecting...")

    async def order_event(self, event):
        await self.send(text_data=json.dumps(event['order'], ensure_ascii=False))
