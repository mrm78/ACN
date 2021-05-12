from communities.models import *
from communities.serializers import *
from accounts.serializers import *
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
import json, pytz
from django.utils import timezone


class tags(APIView):
    def get(self, req):
        tags = Tag.objects.all()
        tags = TagSerializer(tags, many=True)
        return Response(tags.data) 


class create_community(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, req):
        # check title
        if not req.POST['title']:
            return Response({'status':'failed', 'error':'empty title'})
        # create community
        community = Community.objects.create(
            title=req.POST['title'], 
            description=req.POST['description'],
            creator=req.user,
            )
        # add tags to community
        for tag_id in json.loads(req.POST['tags']):
            try:
                tag = Tag.objects.get(id=tag_id)
                community.tags.add(tag)
            except:
                community.delete()
                return Response({'status':'failed', 'error':'invalid tag id'})
        # add image
        image = req.FILES.get('image')
        if image and image.size < 4000000:
            community.image = image
            community.save()
        return Response({'status':'success', 'id':community.id})
        
            
class all_communities(APIView):
    def get(self, req):
        communities = Community.objects.all()
        communities = CommunitySerializer(communities, many=True)
        return Response(communities.data)

class my_communities(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, req):
        communities = Community.objects.filter(creator=req.user)
        communities = CommunitySerializer(communities, many=True)
        return Response(communities.data)

class community_info(APIView):
    def get(self, req):
        community = Community.objects.filter(id=req.GET['id'])
        if not community:
            return Response({'status':'failed', 'error':'invalid community id'})
        community = CommunitySerializer(community[0])
        return Response(community.data)


class create_event(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, req):
        # check title
        if not req.POST['title']:
            return Response({'status':'failed', 'error':'empty title'})
        # check community id
        community = Community.objects.filter(id=req.POST['community_id'])
        if not community:
            return Response({'status':'failed', 'error':'invalid community id'})
        # check begin_time format
        try:
            begin_time = timezone.datetime.strptime(req.POST['begin_time'], "%m %d %Y %H:%M:%S").replace(tzinfo=pytz.timezone('UTC'))
        except:
            return Response({'status':'failed', 'error':'invalid begin time format'})
        # create event
        event = Event.objects.create(
            title=req.POST['title'],
            description=req.POST['description'],
            creator=req.user,
            community=community[0],
            begin_time=begin_time
        )
        return Response({'status':'success', 'id':event.id})
        

class community_events(APIView):
    def get(self, req):
        community = Community.objects.filter(id=req.GET['community_id'])
        if not community:
            return Response({'status':'failed', 'error':'invalid community id'})
        c_events = Event.objects.filter(community=community[0])
        c_events = EventSerializer(c_events, many=True)
        return Response(c_events.data)

class community_participants(APIView):
    def get(self, req):
        community = Community.objects.filter(id=req.GET['community_id'])
        if not community:
            return Response({'status':'failed', 'error':'invalid community id'})
        users = list(community[0].participants.all())
        users.append(community[0].creator)
        users = OtherUserSerializer(users, many=True)
        return Response(users.data)