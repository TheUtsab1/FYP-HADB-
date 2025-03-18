
# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import * 
# from rest_framework.routers import DefaultRouter
# from django.conf.urls.static import static


# router = DefaultRouter()
# router.register(r"listFood", FoodView)
# router.register(r'category', FoodCategoryView)
# router.register(r'topList', FoodTopView, basename='foodtop')
# router.register(r'food', FoodView, basename='food')

# urlpatterns = [
#     path("", include(router.urls)),
#     path("signup/", user_signup, name="signup"),
#     path("login/", user_login, name="login"),
#     path('api/submit-booking/', submit_booking, name='submit_booking'),
#     # path('logout', handlelogout, name='handleslogout'),
#     path('accounts/', include('allauth.urls')),
#     # path("register", Registerview.as_view()),
#     # path("reservation", TabelReservationView.as_view()),
#     # path("reservation", TableReservationView.as_view()),
#     path('api/reservations/', TabelReservationView.as_view(), name='table_reservations'),
#     path("showCart", showCart.as_view()),
#     path("showCart/<item_id>", showCart.as_view()),
#     path("cart/updateQuantity", updateCartQuantity.as_view()),
#     # path("order", create_order.as_view()),
#     # path("verify-payment", verifyPayment.as_view()),
#     path("food-rating/<foodId>", ReviewFood.as_view()),
    
#     path("clear-cart", CartClear.as_view())
# ]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from .views import * 

router = DefaultRouter()
router.register(r"listFood", FoodView, basename="list-food")  # Unique basename
router.register(r'category', FoodCategoryView)
router.register(r'topList', FoodTopView, basename='foodtop')

urlpatterns = [
    path("", include(router.urls)),
    path("signup/", user_signup, name="signup"),
    path("login/", user_login, name="login"),
    path('api/submit-booking/', submit_booking, name='submit_booking'),
    path('accounts/', include('allauth.urls')),
    path('api/reservations/', TabelReservationView.as_view(), name='table_reservations'),
    path("showCart", showCart.as_view()),
    path("showCart/<item_id>", showCart.as_view()),
    path("cart/updateQuantity", updateCartQuantity.as_view()),
    path("food-rating/<foodId>", ReviewFood.as_view()),
    path("clear-cart", CartClear.as_view())
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
