from rest_framework.test import APITestCase
from communities.models import *
from communities.views import *
from accounts.models import User
from rest_framework.authtoken.models import Token
from django.test.client import RequestFactory
import json


# use request factory instead of client
def request(method, url, view, data, **headers):
    factory = RequestFactory()
    if method == 'post':
        request = factory.post(url, data=data, **headers)
    elif method == 'get':
        request = factory.get(url, data=data, **headers)
    response = view(request)
    response.render()
    return json.loads(response.content.decode())

#create user for tests
def create_user(username='testuser', email='testuser@acn.com'):
    user = User.objects.create_user(
        name='testuser',
        username=username,
        email=email,
        password='123456',
    )
    token = Token.objects.create(user=user)
    return token

#create tags for tests
def create_tags():
    for i in range(10):
        Tag.objects.create(name=f'tag{i}')
    return Tag.objects.all()

#create community for tests
def build_community(username='testuser'):
    return Community.objects.create(
        title='test community',
        description='It is a test community',
        creator=User.objects.get(username=username)
    )


#create community for tests
def build_event(community_id):
    return Event.objects.create(
        title='test community',
        description='It is a test community',
        creator=User.objects.get(username='testuser'),
        community=Community.objects.get(id=community_id)
    )



class CommunityTest(APITestCase):

    #create post for tests   
    def build_post(self, community_id, token):
        self.client.post('/community/create_post',data={'community_id':community_id, 'caption':'sdf', 'image':open('manage.py')}, HTTP_AUTHORIZATION=f'Token {token.key}')
        return Post.objects.last()

    def test_create_community(self):
        token = create_user()
        tag = create_tags()[0]
        view = create_community.as_view()
        data = {
            'image': open('manage.py'),
            'title': 'test community',
            'description': 'It is a test community',
            'tags': f'[{tag.id}, {tag.id+1}]',
        }

        # test success status
        response = request('post', '/community/create_community', view, data, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['status'], 'success')

        # test empty title 
        data['title'] = ''
        response = request('post', '/community/create_community', view, data, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['error'], 'empty title')

        # test invalid tags 
        data['title'] = 'test community'
        data['tags'] = '[1,2,12000]'
        response = request('post', '/community/create_community', view, data, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['error'], 'invalid tag id')


    def test_all_communities(self):
        view = all_communities.as_view()
        create_user()
        community = build_community()
        tag = create_tags()[0]
        community.tags.add(tag)
        response = request('get', '/community/all_communities', view, None)[0]
        self.assertEqual(response['id'], community.id)
        self.assertEqual(response['title'], community.title)
        self.assertEqual(response['description'], community.description)


    def test_my_communities(self):
        view = my_communities.as_view()
        create_user()
        community = build_community()
        token = Token.objects.get()
        response = request('get', '/community/my_communities', view, None, HTTP_AUTHORIZATION=f'Token {token.key}')[0]
        self.assertEqual(response['id'], community.id)
        self.assertEqual(response['title'], community.title)
        self.assertEqual(response['description'], community.description)


    def test_tags(self):
        all_tags = create_tags()
        view = tags.as_view()
        response = request('get', '/community/tags', view, None)
        for tag in all_tags:
            self.assertIn({'id':tag.id, 'name':tag.name}, response)


    def test_community_info(self):
        create_user()
        community = build_community()
        view = community_info.as_view()

        # test invalid community id
        response = request('get', '/community/community_info', view, {'id':100})
        self.assertEqual(response['error'], 'invalid community id')

        # test success status
        response = request('get', '/community/community_info', view, {'id':community.id})[0]
        self.assertEqual(response['id'], community.id)
        self.assertEqual(response['title'], community.title)
        self.assertEqual(response['description'], community.description)

    
    def test_community_participants(self):
        token = create_user()
        community = build_community()
        view = community_participants.as_view()
        
        # test invalid community id
        response = request('get', '/community/community_participants', view, {'community_id':100})
        self.assertEqual(response['error'], 'invalid community id')

        # test success status
        response = request('get', '/community/community_participants', view, {'community_id':community.id})[0]
        self.assertEqual(response['id'], token.user.id)
        self.assertEqual(response['username'], token.user.username)


    def test_join_community(self):
        token = create_user()
        token2 = create_user(username='testuser2', email='testuser2@acn.com')
        community = build_community()
        view = join_community.as_view()

        # test invalid community id
        response = request('post', '/community/join_community', view, {'community_id':100}, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['error'], 'invalid community id')

        # test success status
        response = request('post', '/community/join_community', view, {'community_id':community.id}, HTTP_AUTHORIZATION=f'Token {token2.key}')
        self.assertEqual(response['status'], 'success')

        # test already a member
        response = request('post', '/community/join_community', view, {'community_id':community.id}, HTTP_AUTHORIZATION=f'Token {token2.key}')
        self.assertEqual(response['error'], 'already a member')


    def test_leave_community(self):
        token = create_user()
        token2 = create_user(username='testuser2', email='testuser2@acn.com')
        community = build_community()
        view = leave_community.as_view()

        # test invalid community id
        response = request('post', '/community/leave_community', view, {'community_id':100}, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['error'], 'invalid community id')

        # test not already a member
        response = request('post', '/community/leave_community', view, {'community_id':community.id}, HTTP_AUTHORIZATION=f'Token {token2.key}')
        self.assertEqual(response['error'], 'not already a member')

        # test success status
        community.participants.add(token2.user)
        response = request('post', '/community/leave_community', view, {'community_id':community.id}, HTTP_AUTHORIZATION=f'Token {token2.key}')
        self.assertEqual(response['status'], 'success')


    def test_create_post(self):
        token = create_user()
        token2 = create_user(username='testuser2', email='testuser2@acn.com')
        community = build_community()
        view = create_post.as_view()

        # test invalid community id
        response = request('post', '/community/create_post', view, {'community_id':100}, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['error'], 'invalid community id')

        # test permission denied
        response = request('post', '/community/create_post', view, {'community_id':community.id}, HTTP_AUTHORIZATION=f'Token {token2.key}')
        self.assertEqual(response['error'], 'permission denied')

        # test no image
        response = request('post', '/community/create_post', view, {'community_id':community.id}, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['error'], 'no image')

        # test success status
        data = {'caption':'aa', 'community_id':community.id, 'image':open('manage.py')}
        response = request('post', '/community/create_post', view, data, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['status'], 'success')


    def test_community_posts(self):
        token = create_user()
        community = build_community()
        view = community_posts.as_view()

        # test invalid community id
        response = request('get', '/community/community_posts', view, {'community_id':100})
        self.assertEqual(response['error'], 'invalid community id')

        # test success status
        response = request('get', '/community/community_posts', view, {'community_id':community.id})
        self.assertEqual(len(response), 0)

    
    def test_post_comment(self):
        token = create_user()
        token2 = create_user(username='testuser2', email='testuser2@acn.com')
        community = build_community()
        post = self.build_post(community.id, token)
        view = post_comment.as_view()

        # test invalid post id
        response = request('post', '/community/post_comment', view, {'post_id':100}, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['error'], 'invalid post id')

        # test permission denied
        response = request('post', '/community/post_comment', view, {'post_id':post.id}, HTTP_AUTHORIZATION=f'Token {token2.key}')
        self.assertEqual(response['error'], 'permission denied')

        # test empty text
        response = request('post', '/community/post_comment', view, {'post_id':post.id}, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['error'], 'empty text')

        # test success status
        data = {'text':'aa', 'post_id':post.id}
        response = request('post', '/community/post_comment', view, data, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['status'], 'success')


    def test_post_comments(self):
        token = create_user()
        community = build_community()
        post = self.build_post(community.id, token)
        view = post_comments.as_view()

        # test invalid post id
        response = request('get', '/community/post_comments', view, {'post_id':100})
        self.assertEqual(response['error'], 'invalid post id')

        # test success status
        response = request('get', '/community/post_comments', view, {'post_id':post.id})
        self.assertEqual(len(response), 0)


    def test_like_post(self):
        token = create_user()
        token2 = create_user(username='testuser2', email='testuser2@acn.com')
        community = build_community()
        post = self.build_post(community.id, token)
        view = like_post.as_view()

        # test invalid post id
        response = request('post', '/community/like_post', view, {'post_id':100}, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['error'], 'invalid post id')

        # test permission denied
        response = request('post', '/community/like_post', view, {'post_id':post.id}, HTTP_AUTHORIZATION=f'Token {token2.key}')
        self.assertEqual(response['error'], 'permission denied')

        # test success status
        response = request('post', '/community/like_post', view, {'post_id':post.id}, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['status'], 'success')

        # test liked before
        response = request('post', '/community/like_post', view, {'post_id':post.id}, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['error'], 'liked before')

    
    def test_unlike_post(self):
        token = create_user()
        token2 = create_user(username='testuser2', email='testuser2@acn.com')
        community = build_community()
        post = self.build_post(community.id, token)
        view = unlike_post.as_view()

        # test invalid post id
        response = request('post', '/community/unlike_post', view, {'post_id':100}, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['error'], 'invalid post id')

        # test permission denied
        response = request('post', '/community/unlike_post', view, {'post_id':post.id}, HTTP_AUTHORIZATION=f'Token {token2.key}')
        self.assertEqual(response['error'], 'permission denied')

        # test not liked before
        response = request('post', '/community/unlike_post', view, {'post_id':post.id}, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['error'], 'not liked before')

        # test success status
        post.likes.add(token.user)
        response = request('post', '/community/unlike_post', view, {'post_id':post.id}, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['status'], 'success')


    def test_edit_community(self):
        token = create_user()
        token2 = create_user(username='testuser2', email='testuser2@acn.com')
        community = build_community()
        tag = create_tags()[0]
        view = edit_community.as_view()

        # test invalid community id
        response = request('post', '/community/edit_community', view, {'community_id':1000}, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['error'], 'invalid community id')

        # test permission denied
        response = request('post', '/community/edit_community', view, {'community_id':community.id}, HTTP_AUTHORIZATION=f'Token {token2.key}')
        self.assertEqual(response['error'], 'permission denied')

        # test empty data
        response = request('post', '/community/edit_community', view, {'community_id':community.id}, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['status'], 'success')

        # test success status
        data = {
            'community_id': community.id,
            'image': open('manage.py'),
            'title': 'test community2',
            'description': 'It is a test community2',
            'tags': f'[{tag.id}, {tag.id+1}, 1000]',
        }
        response = request('post', '/community/edit_community', view, data, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['status'], 'success')
        community.refresh_from_db()
        self.assertEqual(community.title, 'test community2')
        self.assertEqual(community.description, 'It is a test community2')


        





class EventTest(APITestCase):
    def test_create_event(self):
        create_user()
        token = create_user(username='testuser2', email='testuser2@acn.com')
        view = create_event.as_view()
        community = build_community()
        data = {
            'title': 'test event',
            'description': 'It is a test event',
            'community_id': community.id,
            'begin_time': '2 2 2021 12:25:5'
        }
        # test permission denied
        response = request('post', '/community/create_event', view, data, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['error'], 'permission denied')
        community.participants.add(token.user)

        # test invalid begin time format
        data['begin_time'] = ''
        response = request('post', '/community/create_event', view, data, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['error'], 'invalid begin time format')
        data['begin_time'] = '2021-05-25T23:14'

        # test success status
        response = request('post', '/community/create_event', view, data, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['status'], 'success')

        # test empty title 
        data['title'] = ''
        response = request('post', '/community/create_event', view, data, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['error'], 'empty title')

        # test invalid community id 
        data['title'] = 'test event'
        data['community_id'] = 0
        response = request('post', '/community/create_event', view, data, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['error'], 'invalid community id')


    def test_community_events(self):
        create_user()
        community = build_community()
        event = build_event(community.id)
        view = community_events.as_view()

        # test invalid community id
        response = request('get', '/community/community_events', view, {'community_id':0})
        self.assertEqual(response['error'], 'invalid community id')

        # test success status
        response = request('get', '/community/events', view, {'community_id':community.id})[0]
        self.assertEqual(response['id'], event.id)
        self.assertEqual(response['title'], event.title)
        self.assertEqual(response['description'], event.description)
        self.assertEqual(response['community'], community.id)

          
    def test_event_info(self):
        # test invalid event id
        view = event_info.as_view()
        response = request('get', '/community/event_info', view, {'event_id':10})
        self.assertEqual(response['error'], 'invalid event id')

        # test success status
        token = create_user()
        community = build_community()
        event = build_event(community.id)
        response = request('get', '/community/event_info', view, {'event_id':event.id})
        self.assertEqual(response['id'], event.id)
        self.assertEqual(response['title'], event.title)
        self.assertEqual(response['description'], event.description)


    def test_join_event(self):
        token = create_user()
        token2 = create_user(username='testuser2', email='testuser2@acn.com')
        community = build_community()
        event = build_event(community.id)
        view = join_event.as_view()

        # test invalid event id
        response = request('post', '/community/join_event', view, {'event_id':100}, HTTP_AUTHORIZATION=f'Token {token2.key}')
        self.assertEqual(response['error'], 'invalid event id')

        # test permission denied
        response = request('post', '/community/join_event', view, {'event_id':event.id}, HTTP_AUTHORIZATION=f'Token {token2.key}')
        self.assertEqual(response['error'], 'permission denied')

        # test already a member
        response = request('post', '/community/join_event', view, {'event_id':event.id}, HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response['error'], 'already a member')

        # test success status
        community.participants.add(token2.user)
        response = request('post', '/community/join_event', view, {'event_id':event.id}, HTTP_AUTHORIZATION=f'Token {token2.key}')
        self.assertEqual(response['status'], 'success')