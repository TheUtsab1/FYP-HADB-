import django_filters
from .models import Food

class FoodFilter(django_filters.FilterSet):
    food_type = django_filters.CharFilter(field_name = "food_type__food_type", lookup_expr="icontains" )
    taste = django_filters.CharFilter(field_name = "taste__taste_type", lookup_expr="excat" )
    class Meta:
        model = Food
        fields = ["food_type", "taste"]