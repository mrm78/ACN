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
        print(url)
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
def build_community():
    return Community.objects.create(
        title='test community',
        description='It is a test community',
        creator=User.objects.get(username='testuser')
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
    def test_create_community(self):
        token = create_user()
        tag = create_tags()[0]
        view = create_community.as_view()
        data = {
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


    def test_tags(self):
        all_tags = create_tags()
        view = tags.as_view()
        response = request('get', '/community/tags', view, None)
        for tag in all_tags:
            self.assertIn({'id':tag.id, 'name':tag.name}, response)


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

        
