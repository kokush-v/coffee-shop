from rest_framework import serializers
from .models import ShopUser, Product, Order, OrderProducts


# Serializer for ShopUser model
class ShopUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopUser
        fields = ['id', 'email', 'username']
        
        
# Serializers for Order and Product models
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'image_src', 'description', 'product_weight']


class OrderSerializer(serializers.ModelSerializer):
    products = serializers.SerializerMethodField()
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    user = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = ["id", "user", "products", "status", "created_at", "note", "total_price"]

    def validate(self, attrs):
        attrs["user"] = self.context["request"].user
        
        return super().validate(attrs)

    def get_products(self, obj):
        order_products = OrderProducts.objects.filter(order=obj)
        return OrderProductDetailSerializer(order_products, many=True).data

    def get_user(self, obj):
        return ShopUserSerializer(obj.user).data

    def create(self, validated_data):
        products_data = self.initial_data.get("products", []) 
        order = Order.objects.create(**validated_data)

        total_price = 0  
        for product_data in products_data:
            product = Product.objects.get(id=product_data["product_id"])
            quantity = product_data["quantity"]
            total_price += product.price * quantity  

            OrderProducts.objects.create(order=order, product=product, quantity=quantity)

        order.total_price = total_price
        order.save()

        return order
    
    def update(self, instance, validated_data):
        instance.status = validated_data.get("status", instance.status)
        instance.save()

        return instance


# Additional serializer for OrderProducts model
class OrderProductDetailSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = OrderProducts
        fields = ["product", "quantity"] 


class OrderProductSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source="product"
    )

    class Meta:
        model = OrderProducts
        fields = ["product_id", "quantity"]