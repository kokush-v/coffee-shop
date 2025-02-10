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


class ShopUserCustomManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        if not password:
            raise ValueError('The Password field must be set')

        email = self.normalize_email(email)
        user = self.model(email=email, username=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class ShopUser(AbstractUser):
    email = models.EmailField(unique=True)

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
    REQUIRED_FIELDS = []

    objects = ShopUserCustomManager()

    class Meta:
        verbose_name = 'shopuser'
        verbose_name_plural = 'shopusers'
