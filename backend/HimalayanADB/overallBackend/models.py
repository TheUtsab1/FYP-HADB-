from django.db import models
from autoslug import AutoSlugField
from django.contrib.auth.models import User
from django.core.mail import send_mail

# Create your models here.

class FoodType(models.Model):
    type_name = [
        ("BREAKFAST", "Breakfast"),
        ("LUNCH", "Lunch"),
        ("DINNER", "Dinner"),
        ("BEVRAGE", "Bevrage"),
        ("DESSERT", "Dissert"),

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
    food_slug = models.SlugField(max_length=500, null=True, blank=True)
    food_img_url = models.ImageField(upload_to='products/', null=True, blank=True)
    food_price = models.IntegerField( null=False)
    food_type = models.ForeignKey(FoodType, on_delete=models.CASCADE, null=True)
    taste = models.ForeignKey(FoodTaste, on_delete=models.CASCADE, null=True)


    def __str__(self):
        return f"{self.food_name}"
    
    def save(self, *args, **kwargs):
        if not self.food_slug:
            self.food_slug = AutoSlugField(populate_from='food_name', unique=True)
        super(Food, self).save(*args, **kwargs)

    
class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    food_item = models.ForeignKey(Food, on_delete=models.CASCADE, related_name="reviews")
    rating = models.PositiveIntegerField(default=0)
    comment = models.CharField(max_length=500)


class TabelReservation(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Booked', 'Booked'),
        ('Rejected', 'Rejected'),
    ]

    Booked_by = models.ForeignKey(User, on_delete=models.CASCADE)
    Booking_name = models.CharField(max_length=100, null=False)
    email = models.CharField(max_length=100, null=False)
    No_of_person = models.CharField(max_length=20, null=False)
    Date = models.DateField(null=False)
    time = models.TimeField(null=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

    def __str__(self):
        return self.Booking_name

    def send_booking_confirmation(self):
        subject = "Table Reservation Update"
        message = f"""
        Hello {self.Booking_name},

        Your reservation on {self.Date} at {self.time} has been {self.status}.

        Thank you for choosing us!

        Best regards,
        Himalayan Asian Dining and Bar Team
        """
        send_mail(subject, message, 'your_email@example.com', [self.email])

    

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return f"Cart of {self.user.username}"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    food_item = models.ForeignKey(Food, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def _str_(self):
        return f"{self.quantity} x {self.food_item.food_name} in {self.cart.user.username}'"
    
class CateringBooking(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    date = models.DateField()
    time = models.TimeField()
    guests = models.IntegerField()
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Booking by {self.first_name} {self.last_name} on {self.date}"

class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Ensures only logged-in users can submit
    name = models.CharField(max_length=100)
    email = models.EmailField()
    rating = models.IntegerField()
    feedback_type = models.CharField(max_length=50)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.feedback_type}"

# from django.db import models
# from django.contrib.auth.models import User
# from django.core.mail import send_mail

# class TableReservations(models.Model):
#     STATUS_CHOICES = [
#         ('Pending', 'Pending'),
#         ('Booked', 'Booked'),
#         ('Cancelled', 'Cancelled'),
#     ]

#     Booked_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="table_reservations")
#     Booking_name = models.CharField(max_length=100, null=False)
#     email = models.EmailField(max_length=100, null=False)
#     No_of_person = models.PositiveIntegerField(null=False)
#     Date = models.DateField(null=False)
#     time = models.TimeField(null=False)
#     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

#     def __str__(self):
#         return f"{self.Booking_name} - {self.status}"

#     def send_confirmation_email(self):
#         if self.status == 'Booked':
#             subject = "Table Reservation Confirmed"
#             message = f"""
#             Hello {self.Booking_name},

#             Your table reservation is confirmed!

#             Details:
#             - Date: {self.Date}
#             - Time: {self.time}
#             - Number of Persons: {self.No_of_person}

#             Thank you for choosing us!

#             Regards,
#             Restaurant Team
#             """
#             send_mail(
#                 subject,
#                 message,
#                 'your_email@example.com',  # Replace with your email
#                 [self.email],
#                 fail_silently=False,
#             )
