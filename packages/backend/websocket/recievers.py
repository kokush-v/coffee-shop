
from django.db.models.signals import post_save
from django.dispatch import receiver
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from shop.serializers import OrderSerializer
from shop.models import Order


@receiver(post_save, sender=Order)
def order_status_changed(sender, instance, created, *args, **kwargs,):
    order = OrderSerializer(instance).data
    channel_layer = get_channel_layer()

    if created:
        return

    async_to_sync(channel_layer.group_send)(
        "admins",
        {
            "type": "order_event",
            "order": order,
            "sender": order['user']['username'],
            "user_id": order['user']['id'],
        }
    )

    async_to_sync(channel_layer.group_send)(
        f"user_{order['user']['id']}",
        {
            "type": "order_event",
            "order": order,
            "sender": "Система",
        }
    )
