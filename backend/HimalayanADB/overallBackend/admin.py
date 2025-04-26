from django.contrib import admin
from .models import *
from django.core.mail import send_mail
from django.conf import settings
from django.utils.html import format_html



# Register your models here.

admin.site.register((Food, FoodTaste, FoodType, Cart, CartItem, ChatMessage, Order))


# from material.admin.sites import MaterialAdminSite

# class MyAdminSite(MaterialAdminSite):
#     site_header = 'Himalayan Asian Dining & Bar Admin'
#     site_title = 'Restaurant Admin'
#     index_title = 'Welcome to the Admin Panel'

# admin.site = MyAdminSite()

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

    # actions = ['approve_reservations', 'reject_reservations']

    # def approve_reservations(self, request, queryset):
    #     for reservation in queryset:
    #         if reservation.table:  # Ensure table is assigned
    #             reservation.status = 'approved'
    #             reservation.table.status = 'occupied'
    #             reservation.table.save()  # Save table update
    #             reservation.save()  # Save reservation update

    # approve_reservations.short_description = "Approve selected reservations and mark tables as occupied"

    # def reject_reservations(self, request, queryset):
    #     queryset.update(status='rejected')

    # reject_reservations.short_description = "Reject selected reservations"
    
    
    
    
    
    
    
    
    
    
    
    
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('food', 'user', 'user_name', 'rating', 'comment_preview', 'created_at')
    list_filter = ('rating', 'created_at', 'food')
    search_fields = ('user__username', 'user_name', 'comment', 'food__food_name')
    date_hierarchy = 'created_at'
    
    def comment_preview(self, obj):
        # Show first 50 characters of comment
        return obj.comment[:50] + "..." if len(obj.comment) > 50 else obj.comment
    
    comment_preview.short_description = 'Comment'

# Use the custom admin class
admin.site.register(Review, ReviewAdmin)
    
    
    
    
    
    
    
    
    
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'

# Customize UserAdmin to include Profile (if applicable)


    
    
    
    
    
    

# @admin.register(TabelReservation)
# class TabelReservationAdmin(admin.ModelAdmin):
#     list_display = ('Booking_name', 'email', 'No_of_person', 'Date', 'time', 'status')
#     list_filter = ('status', 'Date')
#     search_fields = ('Booking_name', 'email')

#     # Add editing functionality for the "status" field
#     def save_model(self, request, obj, form, change):
#         if change and 'status' in form.changed_data and obj.status == 'Booked':
#             # Send success email notification for booked status
#             obj.send_booking_confirmation()
#         super().save_model(request, obj, form, change)
        
        
from django import forms
from django.contrib import admin
from .models import Feedback

class FeedbackAdmin(admin.ModelAdmin):
    # Include the 'user' field in list_display to ensure it shows up in the list view
    list_display = ('id', 'name', 'email', 'rating', 'feedback_type', 'message', 'created_at', 'user')  # Added 'message'
    
    # Allow filtering by 'user' field in the admin
    list_filter = ('rating', 'feedback_type', 'created_at', 'user')  # Added 'user' to filter
    
    # Allow searching by these fields
    search_fields = ('name', 'email', 'message')
    
    # Mark the 'created_at' field as read-only in the admin
    readonly_fields = ('created_at',)
    
    # Enable date-based filtering in the admin
    date_hierarchy = 'created_at'

    # If the user field is not showing correctly, we can manually define the save_model method
    def save_model(self, request, obj, form, change):
        if not obj.user:  # Make sure the user is set if not present
            obj.user = request.user
        super().save_model(request, obj, form, change)

# Register the Feedback model with the custom admin class
admin.site.register(Feedback, FeedbackAdmin)


        
# @admin.register(TableReservations)
# class TableReservationAdmin(admin.ModelAdmin):
#     list_display = ('Booking_name', 'email', 'No_of_person', 'Date', 'time', 'status')
#     list_filter = ('status', 'Date')
#     search_fields = ('Booking_name', 'email')

#     def save_model(self, request, obj, form, change):
#         if change and 'status' in form.changed_data:
#             if obj.status == 'Booked':
#                 obj.send_confirmation_email()
#         super().save_model(request, obj, form, change)

# @admin.register(TabelReservation)
# class TabelReservationAdmin(admin.ModelAdmin):
#     list_display = ('Booking_name', 'email', 'No_of_person', 'Date', 'time', 'status')
#     list_filter = ('status', 'Date')
#     search_fields = ('Booking_name', 'email')
#     actions = ['approve_reservation', 'reject_reservation']

#     def approve_reservation(self, request, queryset):
#         queryset.update(status='Booked')
#         for reservation in queryset:
#             reservation.send_booking_confirmation()
#         self.message_user(request, "Selected reservations have been approved.")

#     def reject_reservation(self, request, queryset):
#         queryset.update(status='Rejected')
#         for reservation in queryset:
#             reservation.send_booking_confirmation()
#         self.message_user(request, "Selected reservations have been rejected.")

#     approve_reservation.short_description = "Mark selected reservations as Booked"
#     reject_reservation.short_description = "Mark selected reservations as Rejected"





@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('payment_id', 'cart_item', 'display_is_paid', 'amount', 'created_at')
    list_filter = ('is_paid', 'created_at')
    search_fields = ('payment_id', 'cart_item__food_item__food_name')
    readonly_fields = ('payment_id', 'created_at', 'updated_at')
    list_per_page = 20
    
    def display_is_paid(self, obj):
        """Display tick or cross for payment status in admin panel"""
        return '✓ Paid' if obj.is_paid == 'paid' else '✗ Unpaid'
    
    display_is_paid.short_description = 'Payment Status'
    
    # Calculate amount based on cart item if not set
    def save_model(self, request, obj, form, change):
        if not obj.amount:
            obj.amount = obj.cart_item.food_item.food_price * obj.cart_item.quantity
        super().save_model(request, obj, form, change)