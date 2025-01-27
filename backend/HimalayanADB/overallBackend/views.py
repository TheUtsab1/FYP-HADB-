# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from django.contrib.auth import authenticate, login, logout
# from .models import Customer
# from .serializers import SignupSerializer, CustomerSerializer

# class SignupView(APIView):
#     def post(self, request):
#         serializer = SignupSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.create(serializer.validated_data)
#             return Response({"message": "Registration successful!"}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class LoginView(APIView):
#     def post(self, request):
#         username = request.data.get('uname')
#         password = request.data.get('password')

#         user = authenticate(request, username=username, password=password)
#         if user is not None:
#             login(request, user)
#             user_data = CustomerSerializer(user).data
#             return Response({"message": "Login successful!", "user": user_data}, status=status.HTTP_200_OK)
#         return Response({"error": "Invalid username or password!"}, status=status.HTTP_400_BAD_REQUEST)

# class LogoutView(APIView):
#     def post(self, request):
#         logout(request)
#         return Response({"message": "Logged out successfully!"}, status=status.HTTP_200_OK)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
