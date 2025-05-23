"""
Django settings for HimalayanADB project.

Generated by 'django-admin startproject' using Django 5.1.5.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')



SITE_ID = 1

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-@3w_#5f!eqajzl5cq&w3gj%ia)p&ut^k7a0u)lpg1fb9t5b!mk'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'jazzmin',
    # 'material.admin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    "django.contrib.sites",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    'overallBackend',
    'djoser',
    'drf_spectacular',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],  # Corrected key name
}

AUTHENTICATION_BACKENDS = (
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
)

SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "SCOPE": ["email", "profile"],
        "AUTH_PARAMS": {"access_type": "online"},
    }
}

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = '219385369763-kgepco7akv2founom70opk4lrfp5o0pd.apps.googleusercontent.com'
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = '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'


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware', 
    'allauth.account.middleware.AccountMiddleware',  
]

CORS_ALLOW_ALL_ORIGINS = True

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

CORS_ALLOW_CREDENTIALS = True


EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'utsabmessi6@gmail.com'
EMAIL_HOST_PASSWORD = 'ytzg btbr uqgw srtb'

DEFAULT_FROM_EMAIL = 'utsabmessi6@gmail.com'


ROOT_URLCONF = 'HimalayanADB.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [ ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'HimalayanADB.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

from datetime import timedelta

SIMPLE_JWT = {
    'AUTH_HEADER_TYPES': ('JWT',),
    'ACCESS_TOKEN_LIFETIME': timedelta(days=15),  # Access token expires in 15 minutes
    'REFRESH_TOKEN_LIFETIME': timedelta(days=20),     # Refresh token expires in 7 days
    'ROTATE_REFRESH_TOKENS': False,                  # If True, issue new refresh token with each access token refresh
    'BLACKLIST_AFTER_ROTATION': False,               # If True, blacklist refresh tokens after use
    'UPDATE_LAST_LOGIN': False,                      # Updates the last login time of the user upon refresh
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'Himalayan Asian Dining & Bar',
    'DESCRIPTION': 'API documentation for Himalayan Asian Dining & Bar',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}

# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = "/static/"



# STATIC_URL = '/static/'

# STATICFILES_DIRS = [
#     BASE_DIR / "static",
# ]


# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


SESSION_ENGINE = 'django.contrib.sessions.backends.db'

SESSION_COOKIE_AGE = 30 * 24 * 60 * 60  # 30 days in seconds

SESSION_COOKIE_SECURE = True
SESSION_SAVE_EVERY_REQUEST = True

# Ensure sessions are persistent (not expiring when the browser is closed)
SESSION_EXPIRE_AT_BROWSER_CLOSE = False



# RAZORPAY_API_KEY = "rzp_test_UMgkOOx558UEJQ"
# RAZORPAY_API_SECRET = "cOrHiQIi6bFZW4xg1K3owvXh"




# AUTH_USER_MODEL = 'overallBackend.User'  



JAZZMIN_SETTINGS = {
    
    "site_title": "Himalayan ADB",
    "site_header": "Himalayan Asian Dining & Bar",
    "site_brand": "Himalayan ADB",
    "site_logo": "../media/logo.png",
    "welcome_sign": "Welcome to Himalayan Admin Portal",
    "copyright": "© 2025 Himalayan",

    "site_logo_classes": "img-circle",

    
    "site_icon": "../media/logo.png",
    
    "topmenu_links": [
        {"name": "Home", "url": "admin:index", "permissions": ["auth.view_user"]},
    ],


    "show_sidebar": True,
    "custom_css": None,
"custom_js": None,

"changeform_format": "horizontal_tabs",
"changeform_format_overrides": {"auth.user": "collapsible", "auth.group": "vertical_tabs"},

"related_modal_active": True,
"use_google_fonts_cdn": True,
"navigation_expanded": True,

"order_with_respect_to": ["auth", "overallBackend"],
"icons": {
    "auth": "fas fa-users-cog",
    "your_order_model": "fas fa-receipt",  # Update this key to your actual model
},

"ui_tweaks": {
    "navbar": "navbar-dark bg-primary",
    "accent": "accent-info",
    "body": "hold-transition",
    "brand_small_text": "HADB",
    "brand_text_align": "center",
    "brand_colour": "navbar-navy",
    "sidebar": "sidebar-dark-primary",
    "theme": "minty",
    "dark_mode_theme": "slate",
},

}

# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'debug.log',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        '': {
            'handlers': ['file', 'console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}