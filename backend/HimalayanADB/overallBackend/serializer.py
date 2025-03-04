from rest_framework import serializers
from .models import Food, FoodTaste, FoodType, TabelReservation, Cart, CartItem, Review, CateringBooking
from django.contrib.auth.models import User

class TabelReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TabelReservation
        fields = "__all__"

class CartSerializer(serializers.ModelSerializer):
    class Meta :
        model = Cart
        fields = ["user"]


class FoodTasteSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodTaste
        fields = ["taste_type"]


class FoodTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodType
        fields = ["food_type"]


class FoodSerializer(serializers.ModelSerializer):
    food_type = FoodTypeSerializer()
    taste = FoodTasteSerializer()

    class Meta:
        model = Food
        fields = "__all__"


class CartItemSerializer(serializers.ModelSerializer):
    cart = CartSerializer(read_only = True)
    food_item_id = serializers.PrimaryKeyRelatedField(queryset= Food.objects.all(), write_only = True, source= "food_item")
    food_item = FoodSerializer(read_only = True)
    class Meta:
        model = CartItem
        fields = "__all__"

class UserSerializer(serializers.ModelSerializer):
    class Meta :
        model = User
        fields = ["username"]


class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Review
        fields = "__all__"

class CateringBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CateringBooking
        fields = '__all__'