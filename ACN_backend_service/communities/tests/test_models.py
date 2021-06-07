from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from communities.models import *
from accounts.models import *


class UserModelTest(APITestCase):

    def setUp(self):
        # create user
        user = User.objects.create_user(
            username='testuser',
            email='testuser@acn.com',
            name='test',
            password='123456789'
        )
        user.save()

        # create token
        token = Token.objects.create(user=user)

        #create community for tests
        community = Community.objects.create(
        title='test community',
        description='It is a test community',
        creator=User.objects.get(username='testuser'))

        #create post
        self.client.post('/community/create_post',data={'community_id':community.id, 'caption':'sdf', 'image':open('manage.py')}, HTTP_AUTHORIZATION=f'Token {token.key}')

    def test_post_creator_info(self):
        post = Post.objects.get()
        user = User.objects.get()
        self.assertEqual(post.creator_info(), user.short_info())

    def test_post_comment(self):
        user = User.objects.get()
        comment = Post_comment.objects.create(text='aa', user=user, post=Post.objects.get())
        self.assertEqual(comment.creator_info(), user.short_info())