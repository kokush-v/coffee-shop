from django.db import models


class Product(models.Model):
    title = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_src = models.CharField(max_length=255)
    description = models.TextField()
    product_weight = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.title} - ${self.price}"
