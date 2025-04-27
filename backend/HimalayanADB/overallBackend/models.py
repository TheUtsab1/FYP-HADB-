import uuid
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
        ("VEG", "VEG"),
        ("NON-VEG", "NON-VEG"),
        ("DRINKS", "DRINKS"),     
        ("SNACKS", "SNACKS"),   
    ]
    taste_type = models.CharField(choices=taste_type, max_length=40)

    def __str__(self):
        return f"{self.taste_type}"
    


class Food(models.Model):
    food_name = models.CharField(max_length=500, null=False)
    food_content = models.CharField(max_length=500, null=False)
    food_slug = AutoSlugField(populate_from="food_name", unique=True, null=True)
    food_img_url = models.ImageField(upload_to='products/', null=True, blank=True)
    food_price = models.IntegerField(null=False, validators=[MinValueValidator(0)]) 
    food_type = models.ForeignKey(FoodType, on_delete=models.CASCADE, null=True)
    taste = models.ForeignKey(FoodTaste, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f"{self.food_name}"


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    food = models.ForeignKey(Food, related_name='reviews', on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1)])
    comment = models.TextField(blank=True)
    user_name = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        # Prevent multiple reviews from the same user for the same food item
        unique_together = ('user', 'food')

    def __str__(self):
        return f"Review by {self.user_name or 'Anonymous'} for {self.food.food_name}"

    def save(self, *args, **kwargs):
        # If a user is provided but no user_name, use the username
        if self.user and not self.user_name:
            self.user_name = self.user.username
        super(Review, self).save(*args, **kwargs)


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
    

    
    
    
    
    
    
    
class PendingOrder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    transaction_id = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    special_instructions = models.TextField(blank=True)
    items = models.JSONField()  # Store cart items as JSON
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"PendingOrder {self.transaction_id}"

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    transaction_id = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)
    status = models.CharField(max_length=20, default='pending')
    special_instructions = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.transaction_id}"
    

from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

    
class Payment(models.Model):
    STATUS_CHOICES = (
        ('paid', 'Paid'),
        ('unpaid', 'Unpaid'),
    )
    
    PAYMENT_METHOD_CHOICES = (
        ('stripe', 'Stripe'),
        ('cash', 'Cash on Delivery'),
    )
    
    cart_item = models.ForeignKey('CartItem', on_delete=models.CASCADE, related_name='payments')
    payment_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        default='cash',
        help_text="Method used for payment"
    )
    is_paid = models.CharField(
        max_length=6,
        choices=STATUS_CHOICES,
        default='unpaid',
        help_text="Indicates if the payment has been completed"
    )
    amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(0)],
        help_text="Payment amount in NPR"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    stripe_session_id = models.CharField(max_length=100, null=True, blank=True)  # Add to track Stripe session

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Payment"
        verbose_name_plural = "Payments"

    def __str__(self):
        status = '✓' if self.is_paid == 'paid' else '✗'
        return f"Payment {self.payment_id} - {status} for {self.cart_item.food_item.food_name}"