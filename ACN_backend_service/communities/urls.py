from django.urls import path
from .views import *

urlpatterns = [
    path('tags', tags.as_view()),
    path('create_community', create_community.as_view()),
    path('all_communities', all_communities.as_view()),
    path('my_communities', my_communities.as_view()),
    path('community_info', community_info.as_view()),
    path('create_event', create_event.as_view()),
    path('event_info', event_info.as_view()),
    path('community_events', community_events.as_view()),
    path('community_participants', community_participants.as_view()),
    path('join_community', join_community.as_view()),
    path('leave_community', leave_community.as_view()),
    path('join_event', join_event.as_view()),
    path('create_post', create_post.as_view()),
    path('community_posts', community_posts.as_view()),
    path('post_comment', post_comment.as_view()),
    path('post_comments', post_comments.as_view()),
    path('like_post', like_post.as_view()),
    path('unlike_post', unlike_post.as_view()),
]