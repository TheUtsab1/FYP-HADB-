from django.contrib import admin
from .models import Food, FoodTaste, FoodType, TabelReservation, Cart, CartItem, Review
# Register your models here.

admin.site.register((Food, FoodTaste, FoodType, Cart, CartItem, Review))

@admin.register(TabelReservation)
class TabelReservationAdmin(admin.ModelAdmin):
    list_display = ('Booking_name', 'email', 'No_of_person', 'Date', 'time', 'status')
    list_filter = ('status', 'Date')
    search_fields = ('Booking_name', 'email')
    actions = ['approve_reservation', 'reject_reservation']

    def approve_reservation(self, request, queryset):
        queryset.update(status='Booked')
        for reservation in queryset:
            reservation.send_booking_confirmation()
        self.message_user(request, "Selected reservations have been approved.")

    def reject_reservation(self, request, queryset):
        queryset.update(status='Rejected')
        for reservation in queryset:
            reservation.send_booking_confirmation()
        self.message_user(request, "Selected reservations have been rejected.")

    approve_reservation.short_description = "Mark selected reservations as Booked"
    reject_reservation.short_description = "Mark selected reservations as Rejected"
