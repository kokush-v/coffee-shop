
from django.db.models.signals import post_save
from django.dispatch import receiver
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from shop.serializers import OrderSerializer
from shop.models import Order


@receiver(post_save, sender=Order)
def order_status_changed(sender, instance, created, *args,**kwargs,):
    if created:
        return
    
    order = OrderSerializer(instance).data
    
    print(order)
    
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{instance.user.id}",
        {
            'type': 'order_event',
            'order': order,
        }
    )
