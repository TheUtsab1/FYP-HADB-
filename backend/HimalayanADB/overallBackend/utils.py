from django.core.mail import send_mail
from django.core.signing import TimestampSigner
from django.conf import settings

signer = TimestampSigner()

def send_booking_email(subject, message, recipient_email):
    send_mail(
        subject,
        message,
        "utsabmessi6@gmail.com",
        [recipient_email],
        fail_silently=False,
    )
    
  

def send_verification_email(user):
    token = signer.sign(user.pk)
    verify_link = f"{settings.FRONTEND_URL}/verify/{token}"
    subject = "Verify Your Account"
    message = f"Click the link to verify your account: {verify_link}"
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
