from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializer import FoodSerializer, FoodTypeSerializer, TabelReservationSerializer, CartItemSerializer, ReviewSerializer
from .models import Food, FoodType, Cart, CartItem, Review
from django.contrib.auth.models import User
from .filter import FoodFilter
from rest_framework.decorators import api_view
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.filters import SearchFilter
from rest_framework.pagination import PageNumberPagination
# from django.conf import settings 
# import razorpay
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt


# client = razorpay.Client(auth=(settings.RAZORPAY_API_KEY, settings.RAZORPAY_API_SECRET))
# # Create your views here.

class FoodPagination(PageNumberPagination):
    page_size = 6
    page_query_param = "page_size"
    max_page_size = 10


class FoodView(ModelViewSet):
    queryset = Food.objects.all().order_by("?")
    serializer_class = FoodSerializer
    lookup_field = "food_slug"
    filter_backends = [DjangoFilterBackend, SearchFilter]
    # filterset_class = FoodFilter
    pagination_class = FoodPagination
    search_fields = ["food_name", "taste__taste_type", "food_type__food_type"]


class FoodCategoryView(ModelViewSet):
    queryset = FoodType.objects.all()
    serializer_class = FoodTypeSerializer

class FoodTopView(ModelViewSet):
    queryset = Food.objects.all().order_by("-view")[0:3]
    serializer_class = FoodSerializer



class showCart(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        queryset = CartItem.objects.all()
        serializer = CartItemSerializer(queryset, many=True)
        return Response(serializer.data)
    
    
    def post(self, request):
        
        queryset = CartItem.objects.all()
        data = request.data
        cart, create = Cart.objects.get_or_create(user = request.user)
        
        ItemExist = CartItem.objects.filter(cart__user = request.user, food_item_id= data.get("food_item_id")).exists()
        if ItemExist:
            return Response({"msg" : "Item Already exist"})
        
        serializer = CartItemSerializer(data=data)

        if serializer.is_valid():
            serializer.save(cart = cart)
            return Response({"message": "completed"})
        else:
            return Response({"msg": "not completed", "err": serializer.errors})
    
    def delete(self, request, item_id):
        print("item_id", item_id)
        try:
            cart_item = CartItem.objects.get(cart__user = request.user, id = item_id)
            cart_item.delete()
            return Response({"msg" : "item removed"})

        except:
            return Response({"msg" : "Something error"})
    
class updateCartQuantity(APIView):
    def patch(self, request):
        id = request.data.get("id")
        newQuantity = request.data.get("quantity")
        updateCart = CartItem.objects.get(id= id)
        if(updateCart):
            updateCart.quantity = newQuantity
            updateCart.save()
            return Response({"msg": f"quantity Updated {newQuantity},{id},{updateCart.quantity}"})
        return Response({"msg" : "there is problem in backend"})


class Registerview(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = User.objects.create_user(username= username, password= password)
        user.save()
        return Response({"message": "User Created Succuessfully"})


class TabelReservationView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data.copy()
        print(request.user.id)
        data["Booked_by"] = request.user.id
        serializer = TabelReservationSerializer(data= data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message" : "data Saved Successfully", "data": data})
        return Response({"message" : "Error in saving data", "error": serializer.errors})
    

# class create_order(APIView):
#     def post(self, request):
#         try:
#             amount = request.data.get("amount")
#             currency = "INR"
#             client = razorpay.Client(auth=(settings.RAZORPAY_API_KEY, settings.RAZORPAY_API_SECRET))
#             razorpay_order = client.order.create({'amount': amount, 'currency': currency, 'payment_capture': '1'})
            
#             data = {
#                 "order_id": razorpay_order['id'],
#                 "amount": amount,
#                 "currency": currency,
#                 "razorpay_key_id": settings.RAZORPAY_API_KEY,
#             }
#             return Response(data)

#         except Exception as e:
#             return Response({"msg" : e})

# @method_decorator(csrf_exempt, name="dispatch")
# class verifyPayment(APIView):
#     def post(self, request):

#         try:
#             payment_id = request.data.get('paymentId', '')
#             razorpay_order_id = request.data.get('orderId', '')
#             signature = request.data.get('signature', '')
#             params_dict = {
#                 'razorpay_order_id': razorpay_order_id,
#                 'razorpay_payment_id': payment_id,
#                 'razorpay_signature': signature
#             }
#             # verify the payment signature.
#             result = client.utility.verify_payment_signature(
#                 params_dict)
#             if result is not None:
#                 return Response({"msg" : "payment donew"})
#             else:

#                 # if signature verification fails.
#                return Response({"msg" : "payment not done"})
#         except Exception as e:

#             # if we don't find the required parameters in POST data
#             return Response({"msg" : f"not find  Request {e}"})
        

class ReviewFood(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, foodId):
        user =  request.user 
        rating = request.data.get("rating")
        comment = request.data.get("comment")
        if not(1 <= int(rating) <= 5):
            return Response({"err" : "rate between 1 to 5"})
        try:
            food = Food.objects.get(id = foodId)
        except:
            return Response({"err" : "Food item you want to rate does not exist"})
        
        review , created = Review.objects.get_or_create(user= user, food_item = food)

        if created:
            food.food_rating_sum += int(rating)
            food.food_rating_count += 1
            food.save()
            print("********* creted", review)
        else:
            food.food_rating_sum = food.food_rating_sum - review.rating + rating
            food.save()
            print("********* existing", )

        review.rating = rating
        review.comment = comment
        review.save()
        food.updateAverage()
        return Response({"msg": "done review"})
    
    def get(self, request, foodId):
        queryset = Review.objects.filter(food_item__id = foodId)
        serializer = ReviewSerializer(queryset, many=True)
        return Response(serializer.data)


class CartClear(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def delete(self, request):
        try:
            allCart = Cart.objects.filter(user = request.user)
            allCart.delete()
            return Response({"msg" : "Cart Cleared"})
        
        except Exception as e: 
            return Response({"msg" : "Cart not Cleared"})

