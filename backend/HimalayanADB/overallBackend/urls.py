from django.urls import path
from .views import RegisterView

urlpatterns = [
    path('api/signup/', RegisterView.as_view(), name='signup'),
]
