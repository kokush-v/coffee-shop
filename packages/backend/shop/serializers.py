from rest_framework import serializers
from .models import ShopUser, Product, Order, OrderProducts


class ShopUserSerializer(serializers.ModelSerializer):
    """Serializer для моделі ShopUser."""
    class Meta:
        model = ShopUser
        fields = ['id', 'email', 'username']


class ProductSerializer(serializers.ModelSerializer):
    """Serializer для моделі Product."""
    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'image_src',
                  'description', 'product_weight']


class OrderProductDetailSerializer(serializers.ModelSerializer):
    """Детальний serializer для моделі OrderProducts, включає інформацію про продукт."""
    product = ProductSerializer()

    class Meta:
        model = OrderProducts
        fields = ['product', 'quantity']


class OrderProductSerializer(serializers.ModelSerializer):
    """Serializer для створення записів OrderProducts із зазначенням product_id."""
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source="product"
    )

    class Meta:
        model = OrderProducts
        fields = ['product_id', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    """Serializer для моделі Order із вкладеними даними про продукти та користувача."""
    products = serializers.SerializerMethodField()
    total_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)
    user = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'user', 'products', 'status',
                  'created_at', 'note', 'total_price']

    def validate(self, attrs):
        # Додаємо поточного користувача до validated_data
        attrs["user"] = self.context["request"].user
        return super().validate(attrs)

    def get_products(self, obj):
        # Повертаємо список продуктів замовлення із детальною інформацією
        order_products = OrderProducts.objects.filter(order=obj)
        return OrderProductDetailSerializer(order_products, many=True).data

    def get_user(self, obj):
        # Повертаємо інформацію про користувача
        return ShopUserSerializer(obj.user).data

    def create(self, validated_data):
        # Отримуємо список продуктів із початкових даних
        products_data = self.initial_data.get("products", [])
        order = Order.objects.create(**validated_data)

        total_price = 0
        order_products_list = []
        for product_data in products_data:
            product_id = product_data.get("product_id")
            quantity = product_data.get("quantity", 1)
            product = Product.objects.get(id=product_id)
            total_price += product.price * quantity
            order_products_list.append(OrderProducts(
                order=order, product=product, quantity=quantity))

        if order_products_list:
            OrderProducts.objects.bulk_create(order_products_list)

        order.total_price = total_price
        order.save()

        return order

    def update(self, instance, validated_data):
        instance.status = validated_data.get("status", instance.status)
        instance.save()
        return instance
