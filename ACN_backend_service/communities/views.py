from rest_framework import response
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
        communities = CommunitySerializer(communities, many=True).data
        communities = check_community_membership(communities, req.user, many=True)
        return Response(communities)

class my_communities(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, req):
        communities = list(Community.objects.filter(creator=req.user))
        communities.extend(list(req.user.joined_communities.all()))
        communities = CommunitySerializer(communities, many=True).data
        communities = check_community_membership(communities, req.user, many=True)
        return Response(communities)

class community_info(APIView):
    def get(self, req):
        community = Community.objects.filter(id=req.GET['id'])
        if not community:
            return Response({'status':'failed', 'error':'invalid community id'})
        community = CommunitySerializer(community[0]).data
        # add membership and administrator status
        community = check_community_membership(community, req.user)
        return Response(community)


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
        if (not req.user in community[0].participants.all()) and (req.user != community[0].creator):
            return Response({'status':'failed', 'error':'permission denied'})
        # check begin_time format
        try:
            begin_time = timezone.datetime.strptime(req.POST['begin_time'], "%Y-%m-%dT%H:%M").replace(tzinfo=pytz.timezone('UTC'))
            print(begin_time,'!!!!!!!!!!!!!')
        except Exception as e:
            return Response({'status':'failed', 'error':'invalid begin time format', 'a':str(e)})
        # create event
        event = Event.objects.create(
            title=req.POST['title'],
            description=req.POST['description'],
            creator=req.user,
            image=req.FILES.get('image'),
            community=community[0],
            begin_time=begin_time
        )
        return Response({'status':'success', 'id':event.id})

class event_info(APIView):
    def get(self, req):
        event = Event.objects.filter(id=req.GET['event_id'])
        if not event:
            return Response({'status':'failed', 'error':'invalid event id'})
        event = EventSerializer(event[0]).data
        return Response(event)
        

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


class join_community(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, req):
        community = Community.objects.filter(id=req.POST['community_id'])
        if not community:
            return Response({'status':'failed', 'error':'invalid community id'})
        if (req.user in community[0].participants.all()) or (req.user == community[0].creator):
            return Response({'status':'failed', 'error':'already a member'})
        community[0].participants.add(req.user)
        return Response({'status':'success'})

class leave_community(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, req):
        community = Community.objects.filter(id=req.POST['community_id'])
        if not community:
            return Response({'status':'failed', 'error':'invalid community id'})
        if not req.user in community[0].participants.all():
            return Response({'status':'failed', 'error':'not already a member'})
        community[0].participants.remove(req.user)
        return Response({'status':'success'})

class join_event(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, req):
        event = Event.objects.filter(id=req.POST['event_id'])
        if not event:
            return Response({'status':'failed', 'error':'invalid event id'})
        if req.user not in event[0].community.participants.all() and req.user != event[0].community.creator:
            return Response({'status':'failed', 'error':'permission denied'})
        if (req.user in event[0].participants.all()) or (req.user == event[0].creator):
            return Response({'status':'failed', 'error':'already a member'})
        event[0].participants.add(req.user)
        return Response({'status':'success'})

class create_post(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, req):
        community = Community.objects.filter(id=req.POST['community_id'])
        if not community:
            return Response({'status':'failed', 'error':'invalid community id'})
        if req.user not in community[0].participants.all() and req.user != community[0].creator:
             return Response({'status':'failed', 'error':'permission denied'})
        if not req.FILES.get('image'):
            return Response({'status':'failed', 'error':'no image'})
        post = Post.objects.create(
            caption=req.POST['caption'],
            image = req.FILES.get('image'),
            user = req.user,
            community = community[0]
        )
        return Response({'status':'success', 'id':post.id})

class community_posts(APIView):
    def get(self, req):
        community = Community.objects.filter(id=req.GET['community_id'])
        if not community:
            return Response({'status':'failed', 'error':'invalid community id'})
        posts = community[0].post_set.all()
        posts = PostSerializer(posts, many=True).data
        posts = check_post_like(posts, req.user)
        return Response(posts)
        
        
class post_comment(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, req):
        post = Post.objects.filter(id=req.POST['post_id'])
        if not post:
            return Response({'status':'failed', 'error':'invalid post id'})
        if req.user not in post[0].community.participants.all() and req.user != post[0].community.creator:
            return Response({'status':'failed', 'error':'permission denied'})
        if not req.POST.get('text'):
            return Response({'status':'failed', 'error':'empty text'})
        comment = Post_comment.objects.create(
            text=req.POST.get('text'),
            post = post[0],
            user=req.user
            )
        return Response({'status':'success', 'id':comment.id})


class post_comments(APIView):
    def get(self, req):
        post = Post.objects.filter(id=req.GET['post_id'])
        if not post:
            return Response({'status':'failed', 'error':'invalid post id'})
        comments = Post_comment.objects.filter(post=post[0])
        comments = CommentSerializer(comments, many=True)
        return Response(comments.data)


class like_post(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, req):
        post = Post.objects.filter(id=req.POST['post_id'])
        if not post:
            return Response({'status':'failed', 'error':'invalid post id'})
        if req.user not in post[0].community.participants.all() and req.user != post[0].community.creator:
            return Response({'status':'failed', 'error':'permission denied'})
        if req.user in post[0].likes.all():
            return Response({'status':'failed', 'error':'liked before'})
        post[0].likes.add(req.user)
        return Response({'status':'success'})

class unlike_post(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, req):
        post = Post.objects.filter(id=req.POST['post_id'])
        if not post:
            return Response({'status':'failed', 'error':'invalid post id'})
        if req.user not in post[0].community.participants.all() and req.user != post[0].community.creator:
            return Response({'status':'failed', 'error':'permission denied'})
        if not req.user in post[0].likes.all():
            return Response({'status':'failed', 'error':'not liked before'})
        post[0].likes.remove(req.user)
        return Response({'status':'success'})
        

class edit_community(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, req):
        # check community id
        community = Community.objects.filter(id=req.POST['community_id'])
        if not community:
            return Response({'status':'failed', 'error':'invalid community id'})
        community = community[0]
        # check permission
        if req.user != community.creator:
            return Response({'status':'failed', 'error':'permission denied'})
        # change title
        if req.POST.get('title'):
            community.title = req.POST.get('title')
        # change description
        if req.POST.get('description'):
            community.description = req.POST.get('description')
        # change tags
        if req.POST.get('tags'):
            community.tags.clear()
            for tag_id in json.loads(req.POST['tags']):
                try:
                    tag = Tag.objects.get(id=tag_id)
                    community.tags.add(tag)
                except Exception as e:
                    pass
        # change image
        image = req.FILES.get('image')
        if image and image.size < 4000000:
            community.image = image
        community.save()
        return Response({'status':'success'})


class stories(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, req):
        # get joined_communities and created_communities of user
        communities = list(req.user.joined_communities.all())
        communities.extend(list(req.user.created_communities.all()))
        # get related events that are not passed
        events = []
        for com in communities:
            events.extend(list(com.event_set.filter(active=True, begin_time__gt=timezone.now())))
        events = EventSerializer(events, many=True).data
        return Response(events)


class rate_community(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, req):
        # check community id
        community = Community.objects.filter(id=req.POST['community_id'])
        if not community:
            return Response({'status':'failed', 'error':'invalid community id'})
        community = community[0]
        # check permission
        if req.user not in community.participants.all() and req.user != community.creator:
            return Response({'status':'failed', 'error':'permission denied'})
        # check rate value
        if float(req.POST['value']) < 0 or float(req.POST['value']) > 5:
            return Response({'status':'failed', 'error':'invalid value'})
        # check duplicated rate
        rate = Community_rate.objects.filter(user=req.user, community=community)
        if rate:
            rate[0].value = float(req.POST['value'])
            rate[0].save()
        else:
            Community_rate(user=req.user, community=community, value=float(req.POST['value'])).save()
        community.update_rate()
        return Response({'status':'success', 'average_rate':community.rate})