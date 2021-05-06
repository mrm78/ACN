from django.urls import path
from .views import *

urlpatterns = [
    path('create_community', create_community.as_view()),
    path('tags', tags.as_view()),
    path('create_event', create_event.as_view()),
    path('all_community', all_community.as_view()),
    path('events', events.as_view()),
]