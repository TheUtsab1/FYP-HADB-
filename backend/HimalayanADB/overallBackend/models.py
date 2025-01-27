from django.db import models
from django.contrib.auth.models import AbstractUser

    
class Users(AbstractUser):
    username = models.CharField(max_length=150, unique=True)
    full_name = models.CharField(max_length=255)
    contact_no = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.username
