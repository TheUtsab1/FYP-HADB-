from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from .views import * 



router = DefaultRouter()
router.register(r"listFood", FoodView, basename="list-food")  # Unique basename
router.register(r'category', FoodCategoryView)
router.register(r'topList', FoodTopView, basename='foodtop')
router.register(r'profile', UserProfileViewSet, basename='profile')
# router.register('feedback', FeedbackViewSet, basename='feedback')

urlpatterns = [
    path("", include(router.urls)),
    # path('register/', RegisterView.as_view()),
    # path('verify/', VerifyEmailView.as_view()),
    # path('login/', LoginView.as_view()),
    # path('token/refresh/', RefreshTokenView.as_view()),
    path('signup/', user_signup, name='signup'),
    path('login/', user_login, name='login'),
    path("api/google-login/", google_login, name="google_login"),
    path('api/submit-booking/', submit_booking, name='submit_booking'),
    path('feedback/', FeedbackApiView.as_view(), name='feedback'),
    path("showCart/<item_id>", showCart.as_view()),
    path("cart/", showCart.as_view()),
    path("cart/update/", updateCartQuantity.as_view()),
    path('cart/<int:item_id>/', remove_cart_item, name='remove_cart_item'),
    path('api/tables/', get_tables, name="get_tables"),
    path('api/tables/request-booking/<int:table_id>/', request_booking, name="request_booking"),
    path('api/tables/update-booking/<int:reservation_id>/', update_booking, name="update_booking"),
    path('verify-payment/', verify_payment, name='verify_payment'),
    # path('profile/', user_profile, name='user_profile'),
    # path('update-profile/', update_profile, name='update_profile'),
    path('chat/', chatbot_reply),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
