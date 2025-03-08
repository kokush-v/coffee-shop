from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('shop', '0006_orderproducts_alter_order_products'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='products',
        ),
    ]
