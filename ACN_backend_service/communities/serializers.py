from rest_framework import serializers
from .models import *

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class CommunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Community
        fields = ['id', 'title', 'description', 'number_of_participants', 'creation_date', 'image', 'creator_info', 'tags_info']

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


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'number_of_participants', 'community','image', 'creation_date', 'begin_time', 'creator_info']

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'caption', 'image', 'date', 'creator_info']