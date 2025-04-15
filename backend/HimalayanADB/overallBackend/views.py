from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.filters import SearchFilter
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import redirect
from django.contrib import messages
from django.http import JsonResponse
from django.conf import settings
from django.contrib.auth import logout
from .serializer import *
from .models import *
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
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




# User = get_user_model()

# class RegisterView(APIView):
#     def post(self, request):
#         username = request.data.get("username")
#         email = request.data.get("email")
#         password = request.data.get("password")
        
#         if User.objects.filter(email=email).exists():
#             return Response({"error": "Email already in use"}, status=400)
        
#         user = User.objects.create_user(username=username, email=email, password=password, is_active=False)
#         verification_code = get_random_string(length=6, allowed_chars='0123456789')
#         cache.set(email, verification_code, timeout=600)

#         send_mail(
#             'Verify Your Email',
#             f'Your verification code is: {verification_code}',
#             settings.DEFAULT_FROM_EMAIL,
#             [email],
#             fail_silently=False,
#         )
#         return Response({"message": "Verification code sent"}, status=201)

# class VerifyEmailView(APIView):
#     def post(self, request):
#         email = request.data.get("email")
#         code = request.data.get("code")
#         real_code = cache.get(email)

#         if code == real_code:
#             try:
#                 user = User.objects.get(email=email)
#                 user.is_active = True
#                 user.save()
#                 return Response({"message": "Email verified successfully"})
#             except User.DoesNotExist:
#                 return Response({"error": "User not found"}, status=404)
#         return Response({"error": "Invalid or expired code"}, status=400)

# class LoginView(APIView):
#     def post(self, request):
#         email = request.data.get("email")
#         password = request.data.get("password")
#         try:
#             user = User.objects.get(email=email)
#         except User.DoesNotExist:
#             return Response({"error": "Invalid credentials"}, status=401)

#         if not user.is_active:
#             return Response({"error": "Email not verified"}, status=403)

#         user = authenticate(request, username=user.username, password=password)
#         if user:
#             refresh = RefreshToken.for_user(user)
#             return Response({
#                 "access": str(refresh.access_token),
#                 "refresh": str(refresh),
#                 "username": user.username
#             })
#         return Response({"error": "Invalid credentials"}, status=401)

# class RefreshTokenView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         try:
#             refresh_token = request.data.get("refresh")
#             token = RefreshToken(refresh_token)
#             access_token = str(token.access_token)
#             return Response({"access": access_token})
#         except Exception as e:
#             return Response({"error": "Token is invalid or expired"}, status=401)
        
# class LogoutAPIView(APIView):
#     def post(self, request):
#         logout(request)
#         return Response({"success": True, "message": "Logged out successfully."})

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

# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def user_profile(request):
#     user = request.user
#     return Response({
#         "username": user.username,
#         "first_name": user.first_name,
#         "last_name": user.last_name,
#         "email": user.email,
#     })

# @api_view(['PUT'])
# @permission_classes([IsAuthenticated])
# def update_profile(request):
#     user = request.user
    
#     # Update user fields from request data with proper validation
#     username = request.data.get('username')
#     first_name = request.data.get('first_name')
#     last_name = request.data.get('last_name')
    
#     if username:
#         user.username = username
    
#     if first_name is not None:  # Allow empty string
#         user.first_name = first_name
        
#     if last_name is not None:  # Allow empty string
#         user.last_name = last_name
    
#     # Save the updated user
#     user.save()
    
#     # Return updated user data
#     return Response({
#         'username': user.username,
#         'first_name': user.first_name,
#         'last_name': user.last_name,
#         'email': user.email,
#     })


class UserProfileViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    
    def list(self, request):
        # Return current user data
        serializer = self.serializer_class(request.user)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        # Update current user
        serializer = self.serializer_class(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)



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


@api_view(['GET'])
def get_tables(request):
    tables = Table.objects.all()
    serializer = TableSerializer(tables, many=True)
    return Response(serializer.data)  # DRF auto-sets renderer


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



# class ReviewFood(APIView):
#     authentication_classes = [JWTAuthentication]
#     permission_classes = [IsAuthenticated]

#     def post(self, request, foodId):
#         user =  request.user 
#         rating = request.data.get("rating")
#         comment = request.data.get("comment")
#         if not(1 <= int(rating) <= 5):
#             return Response({"err" : "rate between 1 to 5"})
#         try:
#             food = Food.objects.get(id = foodId)
#         except:
#             return Response({"err" : "Food item you want to rate does not exist"})
        
#         review , created = Review.objects.get_or_create(user= user, food_item = food)

#         if created:
#             food.food_rating_sum += int(rating)
#             food.food_rating_count += 1
#             food.save()
#             print("********* creted", review)
#         else:
#             food.food_rating_sum = food.food_rating_sum - review.rating + rating
#             food.save()
#             print("********* existing", )

#         review.rating = rating
#         review.comment = comment
#         review.save()
#         food.updateAverage()
#         return Response({"msg": "done review"})
    
#     def get(self, request, foodId):
#         queryset = Review.objects.filter(food_item__id = foodId)
#         serializer = ReviewSerializer(queryset, many=True)
#         return Response(serializer.data)



        
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_cart_item(request, item_id):
    try:
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

class FeedbackViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Feedback.objects.all();
    serializer_class = FeedbackSerializer
    
    
class FeedbackApiView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = FeedbackSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Feedback submitted successfully!"}, status=201)
        return Response(serializer.errors, status=400)
    
def verify_payment(request):
    token = request.POST.get('token')
    amount = request.POST.get('amount')
    url = "https://khalti.com/api/v2/payment/verify/"

    payload = {
        "token": token,
        "amount": amount
    }
    headers = {
        "Authorization": f"Key {settings.KHALTI_SECRET_KEY}"
    }

    response = requests.post(url, data=payload, headers=headers)
    return JsonResponse(response.json())

GEMINI_API_KEY = "AIzaSyDC7NCsXpXlOkfEMekZ_O8ViTobUt7zLqI"

@api_view(['POST'])
def chatbot_reply(request):
    user_message = request.data.get('message', '')

    ChatMessage.objects.create(sender='user', message=user_message)

    bot_reply = get_gemini_reply(user_message)

    ChatMessage.objects.create(sender='bot', message=bot_reply)

    return Response({'reply': bot_reply})


def get_gemini_reply(user_message):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GEMINI_API_KEY}"

    headers = {
        "Content-Type": "application/json",
    }

    body = {
        "contents": [
            {
                "parts": [{"text": user_message}]
            }
        ]
    }

    try:
        # Here is the POST method to call the Gemini API
        response = requests.post(url, headers=headers, json=body)  # POST request to Gemini API
        response.raise_for_status()
        data = response.json()
        reply = data["candidates"][0]["content"]["parts"][0]["text"]
        return reply
    except Exception as e:
        return "Sorry, I'm having trouble responding right now."
