from django.core.mail import send_mail

def send_booking_email(subject, message, recipient_email):
    send_mail(
        subject,
        message,
        "utsabmessi6@gmail.com",  # Change this to your actual sender email
        [recipient_email],
        fail_silently=False,
    )
