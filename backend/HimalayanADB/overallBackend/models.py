from django.db import models
from autoslug import AutoSlugField
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.core.validators import MinValueValidator


class FoodType(models.Model):
    type_name = [
        ("BREAKFAST", "Breakfast"),
        ("BRUNCH", "Brunch"),
        ("LUNCH", "Lunch"),
        ("DINNER", "Dinner"),
        ("BEVRAGE", "Bevrage"),
        ("DESSERT", "Dessert"),
        ("APPETIZERS", "Appetizers"),
        ("SNACKS", "Snacks"),
        ("BUFFET", "Buffet"),
        ("SMOOTIES", "Smooties"),

    ]
    food_type = models.CharField(choices=type_name, max_length=40)

    def __str__(self):
        return f"{self.food_type}"
    
class FoodTaste(models.Model):
    taste_type = [
        ("VEG", "veg"),
        ("NON-VEG", "non-veg"),
    ]
    taste_type = models.CharField(choices=taste_type, max_length=40)

    def __str__(self):
        return f"{self.taste_type}"
    


class Food(models.Model):
    food_name = models.CharField(max_length=500, null=False)
    food_content = models.CharField(max_length=500, null=False)
    # food_slug = models.SlugField(max_length=500, null=True, blank=True)
    food_slug = AutoSlugField(populate_from = "food_name", unique=True, null=True)
    food_img_url = models.ImageField(upload_to='products/', null=True, blank=True)
    food_price = models.IntegerField(null=False, validators=[MinValueValidator(0)]) 
    food_type = models.ForeignKey(FoodType, on_delete=models.CASCADE, null=True)
    taste = models.ForeignKey(FoodTaste, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f"{self.food_name}"
    
    def save(self, *args, **kwargs):
        if not self.food_slug:
            self.food_slug = AutoSlugField(populate_from='food_name', unique=True)
        super(Food, self).save(*args, **kwargs)






class Table(models.Model):
    STATUS_AVAILABLE = "available"
    STATUS_OCCUPIED = "occupied"

    STATUS_CHOICES = [
        (STATUS_AVAILABLE, "Available"),
        (STATUS_OCCUPIED, "Occupied"),
    ]
    table_number = models.CharField(max_length=10, unique=True)
    capacity = models.PositiveIntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="available")

    def __str__(self):
        return f"Table {self.table_number} ({self.capacity} seats)"


class Reservation(models.Model):
    STATUS_PENDING = "pending"
    STATUS_APPROVED = "approved"
    STATUS_REJECTED = "rejected"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_APPROVED, "Approved"),
        (STATUS_REJECTED, "Rejected"),
    ]
    table = models.ForeignKey(Table, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    
    def save(self, *args, **kwargs):
        if self.status == self.STATUS_APPROVED:
            self.table.status = Table.STATUS_OCCUPIED
            self.table.save()
        else:
            self.table.status = Table.STATUS_AVAILABLE
            self.table.save()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Reservation for {self.table} - {self.status}"
    
    
    

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user_cart')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    food_item = models.ForeignKey(Food, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.quantity} x {self.food_item.food_name} by {self.cart.user.username}"



    

class CateringBooking(models.Model):
    first_name = models.CharField(max_length=100 , null=False)
    last_name = models.CharField(max_length=100, null=False)
    email = models.EmailField()
    phone = models.CharField(max_length=15, null=False)
    event_type = models.CharField(max_length=50, null=False, default="other")
    guests = models.IntegerField()
    date = models.DateField()
    time = models.CharField(max_length=20, null=False, default="other")
    menu_preference = models.CharField(max_length=50, null=False, default="other")
    special_requests = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Booking by {self.first_name} {self.last_name} on {self.date}"




class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE) 
    name = models.CharField(max_length=100)
    email = models.EmailField()
    rating = models.IntegerField()
    feedback_type = models.CharField(max_length=50)
    message = models.TextField()
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.feedback_type}"