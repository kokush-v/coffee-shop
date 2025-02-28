
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from shop.serializers import OrderSerializer
from shop.models import Order


@receiver(pre_save, sender=Order)
def get_old_order_data(sender, instance, **kwargs):
        instance._old_order = sender.objects.filter(pk=instance.pk).first() if instance.pk else None

@receiver(post_save, sender=Order)
def order_status_changed(sender, instance, created, **kwargs):
    if created:
        return  

    order_type = "changed_order" if instance._old_order.status != instance.status is not None else "new_order"

    order = OrderSerializer(instance).data
    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        "admins",
        {
            "type": "order_event",
            "order": order,
            "sender": order['user']['username'],
            "user_id": order['user']['id'],
            'order_type': order_type
        }
    )
    
    async_to_sync(channel_layer.group_send)(
        f"user_{order['user']['id']}",
        {
            "type": "order_event",
            "order": order,
            "sender": "Система",
            'order_type': order_type
        }
    )