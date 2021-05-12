from django.urls import path
from .views import *

urlpatterns = [
    path('tags', tags.as_view()),
    path('create_community', create_community.as_view()),
    path('all_communities', all_communities.as_view()),
    path('my_communities', my_communities.as_view()),
    path('community_info', community_info.as_view()),
    path('create_event', create_event.as_view()),
    path('community_events', community_events.as_view()),
    path('community_participants', community_participants.as_view()),
]