from rest_framework import serializers
from .models import Food, FoodTaste, FoodType, Cart, CartItem, CateringBooking, Table, Reservation, Feedback
from django.contrib.auth.models import User

# class TabelReservationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = TabelReservation
#         fields = "__all__"
        
# class TableReservationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = TableReservations
#         fields = '__all__'

#     def validate(self, data):
#         if data['Date'] < models.datetime.date.today():
#             raise serializers.ValidationError("The reservation date cannot be in the past.")
#         return data

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