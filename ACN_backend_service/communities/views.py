from communities.models import *
from communities.serializers import *
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
import json


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
        return Response({'status':'success'})


class tags(APIView):
    def get(self, req):
        tags = Tag.objects.all()
        tags = TagSerializer(tags, many=True)
        return Response(tags.data) 
        
            
class all_community(APIView):
    def get(self, req):
        communities = Community.objects.all()
        communities = CommunitySerializer(communities, many=True)
        return Response(communities.data)


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
        # create event
        event = Event.objects.create(
            title=req.POST['title'],
            description=req.POST['description'],
            creator=req.user,
            community=community[0]
        )
        return Response({'status':'success'})
        

class events(APIView):
    def get(self, req):
        community = Community.objects.filter(id=req.GET['community_id'])
        if not community:
            return Response({'status':'failed', 'error':'invalid community id'})
        c_events = Event.objects.filter(community=community[0])
        c_events = EventSerializer(c_events, many=True)
        return Response(c_events.data)