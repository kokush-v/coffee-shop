from django.contrib.auth.models import BaseUserManager, AbstractUser, Group, Permission
from django.db import models

class Product(models.Model):
    title = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_src = models.CharField(max_length=255)
    description = models.TextField()
    product_weight = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.title} - ${self.price}"

class OrderProducts(models.Model):
    order = models.ForeignKey('Order', on_delete=models.CASCADE)
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.product} - {self.quantity} шт."

class Order(models.Model):
    DEFAULT_STATUS = 'pending'
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('ready', 'Ready'),
        ('canceled', 'Canceled'),
    ]

    user = models.ForeignKey('ShopUser', on_delete=models.CASCADE)
    products = models.ManyToManyField('Product', through='OrderProducts', blank=True)
    status = models.CharField(
        max_length=255,
        choices=STATUS_CHOICES,
        default=DEFAULT_STATUS,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    note = models.TextField(blank=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    def save(self, *args, **kwargs):
        if not self.pk:
            self.status = self.DEFAULT_STATUS
        
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Order #{self.pk} - {self.user}"




class ShopUserCustomManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, username, password, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        if not username:
            raise ValueError("The Username field must be set")
        if not password:
            raise ValueError('The Password field must be set')

        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, username, password, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email,  username, password, **extra_fields)

    def create_superuser(self, email, username, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, username, password, **extra_fields)


class ShopUser(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(unique=False, max_length=255)

    first_name = None
    last_name = None

    groups = models.ManyToManyField(
        Group,
        related_name="shopuser_groups",  # Вказуємо нове ім'я для зворотного зв'язку
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        Permission,
        # Вказуємо нове ім'я для зворотного зв'язку
        related_name="shopuser_permissions",
        blank=True,
    )

    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = ["username"]

    objects = ShopUserCustomManager()

    class Meta:
        verbose_name = 'shopuser'
        verbose_name_plural = 'shopusers'
