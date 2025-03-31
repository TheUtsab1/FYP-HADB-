from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# from .serializer import FoodSerializer, FoodTypeSerializer, CartItemSerializer, ReviewSerializer, CateringBookingSerializer

from .models import Food, FoodType, Cart, CartItem, Review
from django.contrib.auth.models import User
from .filter import FoodFilter
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.filters import SearchFilter
from rest_framework.pagination import PageNumberPagination
from django.http import HttpResponse
# from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect
from django.contrib import messages
from django.http import JsonResponse
from django.conf import settings
from django.contrib.auth import logout
from django.core.mail import send_mail
from .models import Feedback
from django.contrib.auth.decorators import login_required
from django.utils.timezone import now
# from django.shortcuts import get_object_or_404
# from .models import Table
from .serializer import *
from .models import *
from django.core.mail import send_mail
from .utils import send_booking_email
from django.shortcuts import get_object_or_404



# from django.conf import settings 
# import razorpay
# from django.utils.decorators import method_decorator
# from django.views.decorators.csrf import csrf_exempt
# from rest_framework import status
# from django.http import JsonResponse

# from rest_framework.parsers import JSONParser
# from django.contrib.auth import authenticate
# from rest_framework_simplejwt.tokens import RefreshToken
# from django.http import JsonResponse


# client = razorpay.Client(auth=(settings.RAZORPAY_API_KEY, settings.RAZORPAY_API_SECRET))
# # Create your views here.


from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from google.oauth2 import id_token
from google.auth.transport import requests



def google_login(request):
    import json
    body = json.loads(request.body)
    token = body.get("token")

    try:
        # Verify token with Google
        google_info = id_token.verify_oauth2_token(token, requests.Request())

        # Check if user exists, otherwise create
        user, created = User.objects.get_or_create(email=google_info["email"], defaults={"username": google_info["name"]})

        return JsonResponse({"message": "Login successful", "user": user.username})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt # Add API View for user signup and login
def user_signup(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            fname = data.get("fname")
            lname = data.get("lname")
            email = data.get("email")
            password1 = data.get("password1")
            password2 = data.get("password2")

            # Check if passwords match
            if password1 != password2:
                return JsonResponse({"success": False, "error": "Passwords do not match"}, status=400)

            # Check if user already exists
            if User.objects.filter(username=username).exists():
                return JsonResponse({"success": False, "error": "Username already taken"}, status=400)

            if User.objects.filter(email=email).exists():
                return JsonResponse({"success": False, "error": "Email already registered"}, status=400)

            # Create the user
            user = User.objects.create_user(username=username, email=email, password=password1, first_name=fname, last_name=lname)
            user.save()

            return JsonResponse({"success": True, "message": "Account created successfully!"}, status=201)

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)
        
# @api_view(['POST'])
# def user_login(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             username = data.get('username')
#             password = data.get('password')

#             user = authenticate(username=username, password=password)

#             if user is not None:
#                 # Create JWT tokens
#                 refresh = RefreshToken.for_user(user)
#                 access_token = str(refresh.access_token)

#                 # You can store the refresh token and send it if needed
#                 return JsonResponse({
#                     "success": True,
#                     "access_token": access_token,  # Send the JWT token to the frontend
#                     "refresh_token": str(refresh),  # Send refresh token if needed
#                     "message": "Login successful"
#                 }, status=200)

#             else:
#                 return JsonResponse({
#                     "success": False,
#                     "error": "Invalid username or password"
#                 }, status=401)

#         except Exception as e:
#             return JsonResponse({
#                 "success": False,
#                 "error": str(e)
#             }, status=500)

@csrf_exempt
def user_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")

            user = authenticate(username=username, password=password)

            if user is not None:
                login(request, user)
                return JsonResponse({"success": True, "token": "dummy-token"}, status=200)  # Token handling is optional
            else:
                return JsonResponse({"success": False, "error": "Invalid credentials"}, status=401)

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)


def handlelogout(request):
    logout(request)
    messages.success(request, "Successfully logged out")
    return redirect('home') 

class FoodPagination(PageNumberPagination):
    page_size = 12
    page_query_param = "page_size"
    max_page_size = 12
    

class FoodView(ModelViewSet):
    queryset = Food.objects.all()
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
    queryset = Food.objects.all()
    serializer_class = FoodSerializer

@api_view(["GET"])
def food_detail(request, food_slug):
    try:
        food = Food.objects.get(food_slug=food_slug)
        serializer = FoodSerializer(food)
        return Response(serializer.data)
    except Food.DoesNotExist:
        return Response({"error": "Food not found"}, status=404)



class showCart(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = CartItem.objects.filter(cart__user=request.user)  # Filter by logged-in user
        serializer = CartItemSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        cart, created = Cart.objects.get_or_create(user=request.user)

        try:
            cart_item = CartItem.objects.get(cart=cart, food_item_id=data.get("food_item_id"))
            cart_item.quantity += int(data.get("quantity", 1))  # Increment quantity
            cart_item.save()
            return Response({"msg": "Item quantity updated!"})
        except CartItem.DoesNotExist:
            serializer = CartItemSerializer(data=data)
            if serializer.is_valid():
                serializer.save(cart=cart)
                return Response({"msg": "Item added to cart!"})
            return Response({"msg": "Error", "err": serializer.errors})

    def delete(self, request, item_id):
        try:
            cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
            cart_item.delete()
            return Response({"msg": "Item removed"})
        except CartItem.DoesNotExist:
            return Response({"msg": "Item not found"})


    
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


# class TabelReservationView(APIView):
#     authentication_classes = [JWTAuthentication]
#     permission_classes = [IsAuthenticated]
#     serializer_class = TabelReservationSerializer  # Add this

#     def post(self, request):
#         data = request.data.copy()
#         data["Booked_by"] = request.user.id
#         serializer = self.serializer_class(data=data)  # Use self.serializer_class

#         if serializer.is_valid():
#             reservation = serializer.save()
#             reservation.send_confirmation_email()  
#             return Response({"message": "Reservation successfully saved!", "data": serializer.data}, status=201)

#         return Response({"message": "Error in saving reservation", "errors": serializer.errors}, status=400)



# @api_view(['GET'])
# def get_tables(request):
#     tables = Table.objects.all()
#     serializer = TableSerializer(tables, many=True)
#     return JsonResponse(serializer.data, safe=False)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def reserve_table(request, table_id):
#     table = get_object_or_404(Table, id=table_id)

#     if table.status == 'occupied':
#         return JsonResponse({"error": "Table is already occupied"}, status=400)

#     table.status = 'occupied'
#     table.reserved_by = request.user
#     table.reserved_at = now()
#     table.save()
    
#     return JsonResponse({"message": "Table reserved successfully!"})

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def release_table(request, table_id):
#     table = get_object_or_404(Table, id=table_id)

#     if table.status == 'available':
#         return JsonResponse({"error": "Table is already available"}, status=400)

#     table.status = 'available'
#     table.reserved_by = None
#     table.reserved_at = None
#     table.save()
    
#     return JsonResponse({"message": "Table released successfully!"})


@api_view(['GET'])
def get_tables(request):
    tables = Table.objects.all()
    serializer = TableSerializer(tables, many=True)
    return Response(serializer.data)  # DRF auto-sets renderer


from django.core.mail import send_mail

from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Table, Reservation

@api_view(['POST'])
def request_booking(request, table_id):
    try:
        print(request.user)
        table = Table.objects.get(id=table_id, status="available")
        reservation = Reservation.objects.create(table=table, user=request.user)

        # Email to Admin
        admin_subject = "New Table Booking Request"
        admin_message = (
            f"A new booking request has been made for Table {table.table_number}.\n\n"
            f"User: {request.user.username}\n"
            f"Email: {request.user.email}\n"
            f"Table Number: {table.table_number}\n"
            f"Seats: {table.capacity}\n"
            f"Status: {reservation.status}"
        )
        send_mail(
            admin_subject,
            admin_message,
            from_email='utsabmessi6@gmail.com',
            recipient_list=['utsabmessi6@gmail.com'],  # Replace with your admin email
            fail_silently=False,
        )

        # Email to User
        user_subject = "Table Booking Request Submitted"
        user_message = (
            f"Dear {request.user.username},\n\n"
            f"Your table booking request has been successfully submitted!\n\n"
            f"Table Number: {table.table_number}\n"
            f"Seats: {table.capacity}\n"
            f"Status: {reservation.status}\n\n"
            "You will be notified once the booking is approved by the admin."
        )
        send_mail(
            user_subject,
            user_message,
            from_email='utsabmessi6@gmail.com',
            recipient_list=[request.user.email],  # Send to the user's email
            fail_silently=False,
        )

        return Response({"message": "Booking requested!"}, status=status.HTTP_201_CREATED)

    except Table.DoesNotExist:
        return Response({"error": "Table not available"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print("Error while booking:", str(e))
        return Response({"error": "Failed to book table. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['PATCH'])
def update_booking(request, reservation_id):
    try:
        reservation = Reservation.objects.get(id=reservation_id)
        status = request.data.get('status')
        
        if status not in ['approved', 'rejected']:
            return Response(
                {"error": "Invalid status"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reservation.status = status
        reservation.save()

        # Send email to the user about the approval or rejection
        subject = f'Booking {status.capitalize()}'
        message = (
            f"Dear {reservation.user.username},\n\n"
            f"Your table booking for Table {reservation.table.table_number} has been {status}.\n\n"
            f"Table Number: {reservation.table.table_number}\n"
            f"Seats: {reservation.table.capacity}\n"
            f"Status: {reservation.status}\n\n"
            "Thank you for choosing our restaurant."
        )
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [reservation.user.email],
            fail_silently=False,
        )
        
        if status == 'approved':
            reservation.table.status = 'occupied'
            reservation.table.save()

        return Response(
            {"message": "Reservation updated successfully"},
            status=status.HTTP_200_OK
        )
        
    except Reservation.DoesNotExist:
        return Response(
            {"error": "Reservation not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )


# Correct the models in approve and reject functions:
def approve_booking(request, booking_id):
    try:
        booking = get_object_or_404(Reservation, id=booking_id)  # Use Reservation, not TableBooking

        # Update booking status to approved
        booking.status = 'approved'
        booking.save()

        # Send approval email to the user
        subject = 'Booking Approved'
        message = (
            f"Dear {booking.user.username},\n\n"
            f"Your table booking for Table {booking.table.table_number} has been approved!\n\n"
            f"Table Number: {booking.table.table_number}\n"
            f"Seats: {booking.table.capacity}\n"
            f"Status: {booking.status}\n\n"
            "Thank you for choosing our restaurant. We look forward to serving you!"
        )
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [booking.user.email],
            fail_silently=False,
        )

        return JsonResponse({'message': 'Booking approved!'})

    except Exception as e:
        print("Error approving booking:", str(e))
        return JsonResponse({'error': 'Failed to approve booking. Please try again later.'}, status=500)


def reject_booking(request, booking_id):
    try:
        booking = get_object_or_404(Reservation, id=booking_id)  # Use Reservation, not TableBooking

        # Update booking status to rejected
        booking.status = 'rejected'
        booking.save()

        # Send rejection email to the user
        subject = 'Booking Rejected'
        message = (
            f"Dear {booking.user.username},\n\n"
            f"Your table booking for Table {booking.table.table_number} has been rejected.\n\n"
            "We apologize for any inconvenience. Please feel free to book another available table."
        )
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [booking.user.email],
            fail_silently=False,
        )

        return JsonResponse({'message': 'Booking rejected!'})

    except Exception as e:
        print("Error rejecting booking:", str(e))
        return JsonResponse({'error': 'Failed to reject booking. Please try again later.'}, status=500)




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


# class CartClear(APIView):
#     permission_classes = [IsAuthenticated]
#     authentication_classes = [JWTAuthentication]
#     def delete(self, request):
#         try:
#             allCart = Cart.objects.filter(user = request.user)
#             allCart.delete()
#             return Response({"msg" : "Cart Cleared"})
        
#         except Exception as e: 
#             return Response({"msg" : "Cart not Cleared"})
        
        
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_cart_item(request, item_id):
    try:
        # print("-------------------------------------------------", item_id)
        cart = Cart.objects.get(user=request.user)
        cart_item = CartItem.objects.get(id=item_id, cart=cart)
        cart_item.delete()
        return Response({"message": "Item removed from cart"}, status=status.HTTP_200_OK)
    except CartItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def submit_booking(request):
    if request.method == 'POST':
        serializer = CateringBookingSerializer(data=request.data)
        if serializer.is_valid():
            booking = serializer.save()

            # Send email to admin
            admin_email = 'utsabmessi6@gmail.com'  # Replace with actual admin email
            subject = f"New Catering Booking: {booking.first_name} {booking.last_name}"
            message = f"""
            You have received a new catering booking:

            Name: {booking.first_name} {booking.last_name}
            Email: {booking.email}
            Phone: {booking.phone}
            Event Type: {booking.event_type}
            Date: {booking.date}
            Time: {booking.time}
            Guests: {booking.guests}
            Menu Preference: {booking.menu_preference}
            Special Requests: {booking.special_requests}
            """
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [admin_email])

            # Send confirmation email to the user
            subject_user = "Catering Booking Confirmation"
            message_user = f"""
            Dear {booking.first_name} {booking.last_name},

            Your catering booking has been successfully submitted. Here are the details:

            Event Type: {booking.event_type}
            Date: {booking.date}
            Time: {booking.time}
            Number of Guests: {booking.guests}
            Menu Preference: {booking.menu_preference}
            Special Requests: {booking.special_requests}

            Thank you for choosing our catering service!

            Best regards,
            Himalayan Asian Dining and Bar Team
            """
            send_mail(subject_user, message_user, settings.DEFAULT_FROM_EMAIL, [booking.email])

            return Response({"message": "Booking submitted successfully!"}, status=201)
        
        return Response(serializer.errors, status=400)
    
    
    
# @csrf_exempt
# @login_required
# def submit_feedback(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)
            
#             # Validate required fields
#             required_fields = ['name', 'email', 'rating', 'feedbackType', 'message']
#             if not all(field in data for field in required_fields):
#                 return JsonResponse({"error": "Missing required fields"}, status=400)
            
#             # Create feedback
#             feedback = Feedback.objects.create(
#                 user=request.user,
#                 name=data['name'],
#                 email=data['email'],
#                 rating=int(data['rating']),
#                 feedback_type=data['feedbackType'],
#                 message=data['message'],
#             )
            
#             return JsonResponse({
#                 "message": "Feedback submitted successfully!",
#                 "id": feedback.id
#             }, status=201)
            
#         except ValueError as e:
#             return JsonResponse({"error": "Invalid data format", "details": str(e)}, status=400)
#         except Exception as e:
#             return JsonResponse({"error": "Failed to save feedback", "details": str(e)}, status=500)

#     return JsonResponse({"error": "Invalid request method"}, status=405)

class FeedbackViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Feedback.objects.all();
    serializer_class = FeedbackSerializer