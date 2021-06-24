from rest_framework import serializers
from .models import *

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class CommunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Community
        fields = ['id', 'title', 'description', 'number_of_participants', 'creation_date', 'image', 'rate', 'creator_info', 'tags_info']


class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'image', 'community_info']


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'number_of_participants', 'community_info','image', 'creation_date', 'begin_time', 'creator_info']

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'caption', 'image', 'date', 'number_of_likes', 'number_of_comments', 'creator_info']


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post_comment
        fields = ['id', 'text', 'creator_info', 'date', 'post']



def check_community_membership(communities_data, user, many=False):
    if not many:
        communities_data = [communities_data]
    if user.is_authenticated:
        joined_communities = [com.id for com in user.joined_communities.all()]
        created_communities = [com.id for com in user.created_communities.all()]
    else:
        joined_communities = []
        created_communities = []
    for community in communities_data:
        community['is_joined'] = 'true' if community['id'] in joined_communities else 'false'
        community['is_admin'] = 'true' if community['id'] in created_communities else 'false'
    return communities_data


def check_post_like(posts_data, user):
    for post_data in posts_data:
        post = Post.objects.get(id=post_data['id'])
        post_data['liked'] = 'true' if user in post.likes.all() else 'false'
    return posts_data
    

def check_stories_seen(events_data, user):
    seen_events, unseen_events = [], []
    for event_data in events_data:
        event = Event.objects.get(id=event_data['id'])
        if user in event.seen.all():
            event_data['is_seen'] = 'true'
        else:
            event_data['is_seen'] = 'false'
    events_data = sorted(events_data,key = lambda event: event['is_seen'])
    return events_data


def check_is_admin(users_data, community):
    for data in users_data:
        if community.creator.id == data['id']:
            data['is_admin'] = True
        else:
            data['is_admin'] = False
    return users_data