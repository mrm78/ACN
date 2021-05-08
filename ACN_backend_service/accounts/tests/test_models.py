from rest_framework.test import APITestCase
from accounts.models import User

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

    def test_user_str(self):
        user = User.objects.get(username='testuser')
        self.assertEqual(user.__str__(), user.username)

    def test_pretty_gender(self):
        user = User.objects.get(username='testuser')
        user.gender = True
        user.save()
        self.assertEqual(user.pretty_gender(), 'male')
        user.gender = False
        user.save()
        self.assertEqual(user.pretty_gender(), 'female')