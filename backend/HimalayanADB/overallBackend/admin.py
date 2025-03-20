from django.contrib import admin
from .models import Food, FoodTaste, FoodType, TabelReservation, Cart, CartItem, Review, Feedback
from django.contrib import admin

# Register your models here.

admin.site.register((Food, FoodTaste, FoodType, Cart, CartItem, Review))


@admin.register(TabelReservation)
class TabelReservationAdmin(admin.ModelAdmin):
    list_display = ('Booking_name', 'email', 'No_of_person', 'Date', 'time', 'status')
    list_filter = ('status', 'Date')
    search_fields = ('Booking_name', 'email')

    # Add editing functionality for the "status" field
    def save_model(self, request, obj, form, change):
        if change and 'status' in form.changed_data and obj.status == 'Booked':
            # Send success email notification for booked status
            obj.send_booking_confirmation()
        super().save_model(request, obj, form, change)
        
        
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'rating', 'feedback_type', 'created_at')
    search_fields = ('name', 'email', 'feedback_type')
    list_filter = ('rating', 'feedback_type', 'created_at')

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
