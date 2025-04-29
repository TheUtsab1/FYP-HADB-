from django.contrib import admin
from .models import *
from django.core.mail import send_mail
from django.conf import settings


admin.site.register((Food, FoodTaste, FoodType, Cart, CartItem))


@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    list_display = ("table_number", "capacity", "status")
    list_filter = ("status",)
    search_fields = ("table_number",)


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('table', 'user', 'status')
    list_filter = ('status',)
    search_fields = ('user__email', 'table__table_number')
    
    # Override save_model to send an email when the status is updated
    def save_model(self, request, obj, form, change):
        # Check if status is updated to 'approved' or 'rejected'
        if obj.status == 'approved':
            subject = f'Booking Approved'
            message = (
                f"Dear {obj.user.username},\n\n"
                f"Your table booking for Table {obj.table.table_number} has been approved!\n\n"
                f"Table Number: {obj.table.table_number}\n"
                f"Seats: {obj.table.capacity}\n"
                f"Status: {obj.status}\n\n"
                "Thank you for choosing our restaurant. We look forward to serving you!"
            )
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [obj.user.email],
                fail_silently=False,
            )
        
        elif obj.status == 'rejected':
            subject = f'Booking Rejected'
            message = (
                f"Dear {obj.user.username},\n\n"
                f"Your table booking for Table {obj.table.table_number} has been rejected.\n\n"
                "We apologize for any inconvenience. Please feel free to book another available table."
            )
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [obj.user.email],
                fail_silently=False,
            )

        # After sending the email, save the model
        super().save_model(request, obj, form, change)
        

@admin.register(CateringBooking)
class CateringBookingAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'phone', 'event_type', 'date', 'time')
    search_fields = ('first_name', 'last_name', 'email', 'phone')
    list_filter = ('event_type', 'date')

    
    
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('food', 'user', 'user_name', 'rating', 'comment_preview')
    list_filter = ('rating', 'created_at', 'food')
    search_fields = ('user__username', 'user_name', 'comment', 'food__food_name')
    
    def comment_preview(self, obj):
        # Show first 50 characters of comment
        return obj.comment[:50] + "..." if len(obj.comment) > 50 else obj.comment
    
    comment_preview.short_description = 'Comment'

admin.site.register(Review, ReviewAdmin)
   
  
    
    
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'
        
        
class FeedbackAdmin(admin.ModelAdmin):
    # Include the 'user' field in list_display to ensure it shows up in the list view
    list_display = ('id', 'name', 'email', 'rating', 'feedback_type', 'message',  'user')  # Added 'message'
    
    # Allow filtering by 'user' field in the admin
    list_filter = ('rating', 'feedback_type', 'user')  # Added 'user' to filter
    
    # Allow searching by these fields
    search_fields = ('name', 'email', 'message')
    

    # If the user field is not showing correctly, we can manually define the save_model method
    def save_model(self, request, obj, form, change):
        if not obj.user:  # Make sure the user is set if not present
            obj.user = request.user
        super().save_model(request, obj, form, change)

# Register the Feedback model with the custom admin class
admin.site.register(Feedback, FeedbackAdmin)


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('food_name', 'payment_method', 'display_is_paid', 'amount', 'created_at', 'stripe_session_id')
    list_filter = ('is_paid', 'payment_method', 'created_at')
    search_fields = ('payment_id', 'cart_item__food_item__food_name', 'stripe_session_id')
    readonly_fields = ('payment_id', 'created_at', 'updated_at', 'stripe_session_id')
    list_per_page = 20
    
    def food_name(self, obj):
        return obj.cart_item.food_item.food_name
    
    food_name.short_description = 'Food Name'
    
    def display_is_paid(self, obj):
        return '✓ Paid' if obj.is_paid == 'paid' else '✗ Unpaid'
    
    display_is_paid.short_description = 'Is Paid'
    
    def save_model(self, request, obj, form, change):
        if not obj.amount:
            obj.amount = obj.cart_item.food_item.food_price * obj.cart_item.quantity
        super().save_model(request, obj, form, change)