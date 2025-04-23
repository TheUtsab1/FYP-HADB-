from rest_framework import serializers
from .models import Food, FoodTaste, FoodType, Cart, CartItem, CateringBooking, Table, Reservation, Feedback, Review
from django.contrib.auth.models import User

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    username = serializers.SerializerMethodField()
    
    class Meta:
        model = Review
        fields = ['id', 'user', 'username', 'food', 'rating', 'comment', 'user_name', 'created_at']
        read_only_fields = ['user', 'created_at']
    
    def get_username(self, obj):
        if obj.user:
            return obj.user.username
        return obj.user_name or "Anonymous"

# Your existing serializers below
class CartSerializer(serializers.ModelSerializer):
    class Meta:
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
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Food
        fields = "__all__"
    
    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews.exists():
            return sum(review.rating for review in reviews) / reviews.count()
        return 0
    
    def get_review_count(self, obj):
        return obj.reviews.count()


class CartItemSerializer(serializers.ModelSerializer):
    cart = CartSerializer(read_only=True)
    food_item_id = serializers.PrimaryKeyRelatedField(queryset=Food.objects.all(), write_only=True, source="food_item")
    food_item = FoodSerializer(read_only=True)
    class Meta:
        model = CartItem
        fields = "__all__"

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username"]


class CateringBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CateringBooking
        fields = '__all__'
        

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = '__all__'
        
class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'

class FeedbackSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Feedback
        fields = '__all__'
        
    def create(self, validated_data):
        user = self.context['request'].user
        feedback = Feedback.objects.create(user=user, **validated_data)
        return feedback
    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']
        read_only_fields = ['email']  # Make email read-only as requested

    def update(self, instance, validated_data):
        # Update user fields
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()
        return instance