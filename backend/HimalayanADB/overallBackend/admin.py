from django.contrib import admin
from .models import Food, FoodTaste, FoodType, Cart, CartItem, Review, Feedback, Table, Reservation
from django.contrib import admin


# Register your models here.

admin.site.register((Food, FoodTaste, FoodType, Cart, CartItem, Review))


@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    list_display = ("table_number", "capacity", "status")
    list_filter = ("status",)
    search_fields = ("table_number",)

# @admin.register(Reservation)
# class ReservationAdmin(admin.ModelAdmin):
#     list_display = ("table", "user_email", "phone_number", "status")
#     list_filter = ("status",)
#     search_fields = ("user_email", "table__table_number")
    

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('table', 'status')
    list_filter = ('status',)
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
