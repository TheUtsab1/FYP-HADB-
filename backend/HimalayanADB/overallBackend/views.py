from datetime import timezone
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

class SignupView(APIView):
    permission_classes = [AllowAny]  # Allow anyone to access this endpoint

    def post(self, request):
        try:
            username = request.data.get("username")
            fname = request.data.get("fname")
            lname = request.data.get("lname")
            email = request.data.get("email")
            password1 = request.data.get("password1")
            password2 = request.data.get("password2")

            # Check if passwords match
            if password1 != password2:
                return Response({"success": False, "error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

            # Check if user already exists
            if User.objects.filter(username=username).exists():
                return Response({"success": False, "error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

            if User.objects.filter(email=email).exists():
                return Response({"success": False, "error": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

            # Create the user (inactive until verified)
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password1,
                first_name=fname,
                last_name=lname,
                is_active=False  # User is inactive until email is verified
            )
            user.save()

            # Generate verification token
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            # Create verification link
            verification_link = f"http://localhost:3000/verify-email/{uid}/{token}/"

            # Send verification email
            subject = "Verify Your Email Address"
            message = (
                f"Hi {user.username},\n\n"
                f"Thank you for signing up! Please verify your email by clicking the link below:\n\n"
                f"{verification_link}\n\n"
                "If you didn’t register, please ignore this email.\n\n"
                "Thanks,\nYour Team"
            )
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )

            return Response(
                {"success": True, "message": "Account created! Please check your email to verify your account."},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class LoginView(APIView):
    permission_classes = [AllowAny]  # Allow anyone to access this endpoint

    def post(self, request):
        try:
            username = request.data.get("username")
            password = request.data.get("password")

            user = authenticate(username=username, password=password)

            if user is not None:
                if not user.is_active:
                    return Response(
                        {"success": False, "error": "Please verify your email before logging in."},
                        status=status.HTTP_403_FORBIDDEN
                    )
                login(request, user)
                return Response({"success": True, "token": "dummy-token"}, status=status.HTTP_200_OK)  # Token handling is optional
            else:
                return Response({"success": False, "error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def handlelogout(request):
    logout(request)
    messages.success(request, "Successfully logged out")
    return redirect('home') 


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        print(f"Received UID: {uidb64}, Token: {token}")
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            print(f"Decoded UID: {uid}")
            user = User.objects.get(pk=uid)
            print(f"Found User: {user.username}")
        except (TypeError, ValueError, OverflowError, User.DoesNotExist) as e:
            print(f"Error decoding UID or finding user: {str(e)}")
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            print("Token is valid")
            if not user.is_active:
                user.is_active = True
                user.save()
                return Response(
                    {"message": "Email verified successfully! You can now log in."},
                    status=status.HTTP_200_OK
                )
            else:
                return Response({"message": "Email already verified."}, status=status.HTTP_200_OK)
        else:
            print("Token validation failed or user not found")
            return Response({"error": "Invalid or expired verification link"}, status=status.HTTP_400_BAD_REQUEST)



# views.py
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
import json

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            data = json.loads(request.body)
            email = data.get("email")

            if not email:
                return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"error": "No user found with this email"}, status=status.HTTP_404_NOT_FOUND)

            # Generate reset token
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            # Create reset link
            reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"  # Adjust URL for your frontend

            # Send email
            subject = "Password Reset Request"
            message = (
                f"Hi {user.username},\n\n"
                f"You requested a password reset. Click the link below to reset your password:\n\n"
                f"{reset_link}\n\n"
                "If you didn’t request this, please ignore this email.\n\n"
                "Thanks,\nYour Team"
            )
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )

            return Response({"message": "Password reset link sent to your email"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
        
# views.py
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            new_password = request.data.get("new_password")
            confirm_password = request.data.get("confirm_password")

            if not new_password or not confirm_password:
                return Response({"error": "New password and confirmation are required"}, status=status.HTTP_400_BAD_REQUEST)

            if new_password != confirm_password:
                return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()
            return Response({"message": "Password reset successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid token or user"}, status=status.HTTP_400_BAD_REQUEST)




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


from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .serializer import UserProfileSerializer

class UserProfileViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    
    def get_queryset(self):
        # Only return the current user's data
        return User.objects.filter(id=self.request.user.id)
    
    def list(self, request, *args, **kwargs):
        # Return current user data
        serializer = self.serializer_class(request.user)
        return Response(serializer.data)
    
    def update(self, request, *args, **kwargs):
        # Update current user
        user = request.user
        serializer = self.serializer_class(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk=None, *args, **kwargs):
        # Prevent retrieving other users' profiles
        if pk and int(pk) != request.user.id:
            return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.serializer_class(request.user)
        return Response(serializer.data)



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


# @api_view(['DELETE'])
# @permission_classes([IsAuthenticated])
# def remove_cart_item(request, item_id):
#     try:
#         cart = Cart.objects.get(user=request.user)
#         CartItem.objects.filter(cart=cart).delete()
#         logger.info(f"Cart items cleared for user: {request.user.username}")
#         return Response({'message': 'Cart cleared successfully'})
#     except Cart.DoesNotExist:
#         logger.warning(f"No cart found for user: {request.user.username}")
#         return Response({'message': 'No cart to clear'})
#     except Exception as e:
#         logger.error(f"Error clearing cart: {str(e)}")
#         return Response({'error': str(e)}, status=400)




@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_Cart(request):
    try:
        cart = Cart.objects.get(user=request.user)
        cart.delete()  # This will delete the cart and all associated items
        return Response({"message": "Cart cleared successfully"}, status=status.HTTP_200_OK)
    except Cart.DoesNotExist:
        return Response({"error": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)
        
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
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        # Parse JSON data from request body
        data = json.loads(request.body)
        token = data.get('token')
        amount = data.get('amount')
        
        if not token or not amount:
            return JsonResponse({'error': 'Token and amount are required'}, status=400)
        
        # Khalti verification URL
        url = "https://khalti.com/api/v2/payment/verify/"
        
        # Get the secret key from settings
        secret_key = settings.KHALTI_SECRET_KEY
        if not secret_key:
            return JsonResponse({'error': 'Khalti secret key is missing'}, status=500)
        
        payload = {
            "token": token,
            "amount": amount
        }
        
        headers = {
            "Authorization": f"Key {secret_key}",
            "Content-Type": "application/json"
        }
        
        # Make the verification request to Khalti
        response = requests.post(url, json=payload, headers=headers)
        
        # Return Khalti's response
        return JsonResponse(response.json())
    
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)








import os
import logging
from xml.etree import ElementTree
import requests
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Cart, CartItem, PendingOrder, Order
from django.conf import settings

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_pending_order(request):
    """Save pending order details before eSewa payment"""
    try:
        transaction_id = request.data.get('transactionId')
        amount = request.data.get('amount')
        special_instructions = request.data.get('specialInstructions', '')
        items = request.data.get('items')

        if not all([transaction_id, amount, items]):
            return Response({
                'success': False,
                'message': 'Missing required parameters'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Validate amount against cart
        user = request.user
        cart = Cart.objects.get(user=user)
        cart_items = CartItem.objects.filter(cart=cart)
        cart_total = sum(item.food_item.food_price * item.quantity for item in cart_items)
        
        if float(amount) != float(cart_total):
            return Response({
                'success': False,
                'message': 'Amount mismatch with cart total'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Save pending order
        PendingOrder.objects.create(
            user=user,
            transaction_id=transaction_id,
            amount=amount,
            special_instructions=special_instructions,
            items=items
        )

        return Response({
            'success': True,
            'message': 'Pending order saved successfully',
            'transaction_id': transaction_id
        })
    except Exception as e:
        logger.error(f"Error saving pending order: {str(e)}", exc_info=True)
        return Response({
            'success': False,
            'message': 'An error occurred while saving pending order',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    """Verify eSewa payment after redirect"""
    try:
        transaction_id = request.data.get('oid')
        amount = request.data.get('amt')
        ref_id = request.data.get('refId')

        if not all([transaction_id, amount, ref_id]):
            return Response({
                'success': False,
                'message': 'Missing required parameters'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Validate pending order
        try:
            pending_order = PendingOrder.objects.get(
                transaction_id=transaction_id,
                user=request.user
            )
            if float(amount) != float(pending_order.amount):
                return Response({
                    'success': False,
                    'message': 'Amount mismatch with pending order'
                }, status=status.HTTP_400_BAD_REQUEST)
        except PendingOrder.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Invalid transaction ID'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Verify payment with eSewa
        verification_url = os.getenv('ESEWA_VERIFICATION_URL', 'https://esewa.com.np/epay/transrec')
        payload = {
            'amt': amount,
            'rid': ref_id,
            'pid': transaction_id,
            'scd': os.getenv('ESEWA_MERCHANT_CODE', 'EPAYTEST')
        }

        response = requests.post(verification_url, payload)
        try:
            root = ElementTree.fromstring(response.text)
            response_code = root.find('response_code').text
        except ElementTree.ParseError:
            logger.error(f"Invalid XML response from eSewa: {response.text}")
            return Response({
                'success': False,
                'message': 'Invalid response from eSewa'
            }, status=status.HTTP_400_BAD_REQUEST)

        if response_code == 'Success':
            user = request.user
            cart = Cart.objects.get(user=user)
            cart_items = CartItem.objects.filter(cart=cart)

            # Create order
            order = Order.objects.create(
                user=user,
                transaction_id=transaction_id,
                amount=amount,
                payment_method='esewa',
                status='completed',
                special_instructions=pending_order.special_instructions
            )

            # Clear cart and pending order
            cart_items.delete()
            pending_order.delete()

            return Response({
                'success': True,
                'message': 'Payment verified successfully',
                'transaction_id': transaction_id,
                'order_id': order.id
            })
        else:
            logger.warning(f"eSewa verification failed: {response.text}")
            return Response({
                'success': False,
                'message': 'Payment verification failed',
                'response': response.text
            }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.error(f"Error verifying eSewa payment: {str(e)}", exc_info=True)
        return Response({
            'success': False,
            'message': 'An error occurred while verifying payment',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





from django.db import IntegrityError


@api_view(['GET'])
def get_food_reviews(request, food_slug):
    """Get all reviews for a specific food item."""
    food = get_object_or_404(Food, food_slug=food_slug)
    reviews = Review.objects.filter(food=food)
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_food_review(request, food_slug):
    """Create a new review for a food item (authenticated user)."""
    food = get_object_or_404(Food, food_slug=food_slug)
    
    # Create review data with food and user
    data = request.data.copy()
    
    # Prepare data for serializer
    serializer = ReviewSerializer(data=data)
    if serializer.is_valid():
        try:
            # Try to save with food and user association
            serializer.save(food=food, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except IntegrityError:
            # This happens if user already reviewed this food (unique_together constraint)
            return Response(
                {"detail": "You have already reviewed this item. You can edit your review instead."},
                status=status.HTTP_400_BAD_REQUEST
            )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_anonymous_review(request, food_slug):
    """Create a new anonymous review for a food item."""
    food = get_object_or_404(Food, food_slug=food_slug)
    
    # Create data for anonymous review
    data = request.data.copy()
    
    # Ensure user_name is set or default to Anonymous
    if not data.get('user_name'):
        data['user_name'] = 'Anonymous'
    
    serializer = ReviewSerializer(data=data)
    if serializer.is_valid():
        # Save review with food but no user (anonymous)
        serializer.save(food=food, user=None)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def update_delete_review(request, food_slug, review_id):
    """Update or delete a review."""
    food = get_object_or_404(Food, food_slug=food_slug)
    review = get_object_or_404(Review, id=review_id, food=food)
    
    # Only allow users to update/delete their own reviews
    if review.user != request.user:
        return Response(
            {"detail": "You don't have permission to edit this review."},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if request.method == 'PUT':
        serializer = ReviewSerializer(review, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)






# Add to your views.py file
import json
import stripe
from django.conf import settings
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# Set your secret key
stripe.api_key = "sk_test_51RGzEPEEI2zN8avgfwL5EM7hpXXCzYVF3P2Fn84f27CjjP5Ag2L6MoAEXcNas5SKksZ71nxeU7gfGqJEarOnfip300nqKCkKk0"

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    try:
        data = json.loads(request.body)
        amount = data.get('amount')
        currency = data.get('currency', 'npr')
        items = data.get('items', [])
        special_instructions = data.get('special_instructions', '')
        
        # Create metadata for reference
        metadata = {
            'user_id': str(request.user.id),
            'special_instructions': special_instructions[:500],  # Limit metadata size
            'item_count': str(len(items))
        }
        
        # Create line items for Stripe
        line_items = []
        for idx, item in enumerate(items):
            line_items.append({
                'price_data': {
                    'currency': currency,
                    'product_data': {
                        'name': item['name'],
                        'metadata': {
                            'food_item_id': str(item['id'])
                        }
                    },
                    'unit_amount': int(item['price'] * 100),  # Convert to cents
                },
                'quantity': item['quantity'],
            })
            
            # Add some item details to metadata
            if idx < 5:  # Limit to first 5 items to prevent metadata size issues
                metadata[f'item_{idx}'] = f"{item['name']} x{item['quantity']}"
        
        # Create Stripe checkout session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            metadata=metadata,
            # success_url=f"{request.build_absolute_uri('/').rstrip('/')}/cart?payment=success&session_id={{CHECKOUT_SESSION_ID}}",
            success_url="http://localhost:3000/cart?payment=success&session_id={CHECKOUT_SESSION_ID}",
            cancel_url="http://localhost:3000/cart?payment=canceled",
            # cancel_url=f"{request.build_absolute_uri('/').rstrip('/')}/cart?payment=canceled",
        )
        
        return JsonResponse({'id': checkout_session.id})
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)




from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
import stripe
import json

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User
from .models import Cart  # Ensure Cart model is imported
import stripe
import json
import requests
import logging

# Set up logging
logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_success(request):
    session_id = request.GET.get('session_id')
    
    try:
        # Retrieve the session to verify payment
        session = stripe.checkout.Session.retrieve(session_id)
        
        # Check if payment was successful
        if session.payment_status == 'paid':
            user = request.user
            logger.info(f"Processing payment success for user: {user.username}, session_id: {session_id}")
            
            # Retrieve metadata
            metadata = session.metadata
            special_instructions = metadata.get('special_instructions', '')
            item_count = int(metadata.get('item_count', 0))
            
            # Create order
            order_data = {
                'payment_method': 'stripe',
                'payment_details': json.dumps({
                    'session_id': session_id,
                    'payment_intent': session.payment_intent,
                    'amount': session.amount_total / 100,
                    'currency': session.currency,
                }),
                'special_instructions': special_instructions,
            }
            
            # Call the order creation endpoint
            order_response = requests.post(
                'http://127.0.0.1:8000/orders/create/',
                json=order_data,
                headers={
                    'Authorization': f'JWT {request.auth}',
                    'Content-Type': 'application/json',
                }
            )
            
            if order_response.status_code != 201:
                logger.error(f"Failed to create order: {order_response.text}")
                return Response({
                    'success': False,
                    'message': 'Failed to create order. Payment was successful, please contact support.'
                }, status=400)
            
            # Clear the user's cart
            try:
                cart_items = Cart.objects.filter(user=user)
                logger.info(f"Found {cart_items.count()} cart items for user: {user.username}")
                cart_items.delete()
                logger.info(f"Cart cleared for user: {user.username}")
            except Exception as e:
                logger.error(f"Error clearing cart for user {user.username}: {str(e)}")
                return Response({
                    'success': False,
                    'message': f'Error clearing cart: {str(e)}'
                }, status=400)
            
            # Prepare invoice data
            items = []
            for i in range(item_count):
                item_key = f'item_{i}'
                if item_key in metadata:
                    items.append(metadata[item_key])
            
            return Response({
                'success': True,
                'message': 'Payment successful! Your order has been placed.',
                'invoice': {
                    'order_id': f"ORD-{session_id[-8:]}",
                    'order_date': timezone.now().strftime('%Y-%m-%d'),
                    'items': items,
                    'total': session.amount_total / 100,
                    'currency': session.currency,
                    'special_instructions': special_instructions,
                    'customer_name': user.get_full_name() or user.username,
                    'customer_email': user.email,
                }
            })
        else:
            logger.warning(f"Payment not completed for session_id: {session_id}")
            return Response({
                'success': False,
                'message': 'Payment not completed. Please try again.'
            }, status=400)
            
    except Exception as e:
        logger.error(f"Error in payment_success: {str(e)}")
        return Response({
            'success': False,
            'message': f'Error verifying payment: {str(e)}'
        }, status=400)
        




