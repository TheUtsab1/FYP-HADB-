from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from .views import * 
from . import views



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
    path('auth/password/reset/', views.PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('auth/password/reset/confirm/<uidb64>/<token>/', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path("api/google-login/", google_login, name="google_login"),
    path('api/submit-booking/', submit_booking, name='submit_booking'),
    path('feedback/', FeedbackApiView.as_view(), name='feedback'),
    path("showCart/<item_id>", showCart.as_view()),
    path("cart/", showCart.as_view()),
    path("cart/update/", updateCartQuantity.as_view()),
    path('cart/<int:item_id>/', remove_cart_item, name='remove_cart_item'),
    path('cart/delete/', clear_Cart, name='clear_cart'),
    # path('')
    path('api/tables/', get_tables, name="get_tables"),
    path('api/tables/request-booking/<int:table_id>/', request_booking, name="request_booking"),
    path('api/tables/update-booking/<int:reservation_id>/', update_booking, name="update_booking"),
    path('verify-payment/', verify_payment, name='verify_payment'),
    path('orders/pending/', save_pending_order, name='save_pending_order'),
    path('food/<str:food_slug>/reviews/', views.get_food_reviews, name='get-food-reviews'),
    path('food/<str:food_slug>/reviews/create/', views.create_food_review, name='create-food-review'),
    path('food/<str:food_slug>/reviews/anonymous/', views.create_anonymous_review, name='create-anonymous-review'),
    path('food/<str:food_slug>/reviews/<int:review_id>/', views.update_delete_review, name='update-delete-review'),
    path('create-checkout-session/', create_checkout_session, name='create-checkout-session'),
    path('payment-success/', payment_success, name='payment-success'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
