from django.urls import path
from .views import *

urlpatterns = [
    path('register', register.as_view()),
    path('verify_code', verify_code.as_view()),
    path('login', login.as_view()),
    path('resend_verification_code', resend_verification_code.as_view()),
    path('is_login', is_login.as_view()),
    path('myself_info', myself_info.as_view()),
    path('update_user_info', update_user_info.as_view()),
]