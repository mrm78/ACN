from rest_framework.test import APITestCase
from accounts.models import User
from rest_framework.authtoken.models import Token



#create user for tests
def create_user(username='testuser', email='testuser@acn.com', password='123456'):
    user = User.objects.create_user(
        name='testuser',
        username=username,
        email=email,
        password=password,
    )
    token = Token.objects.create(user=user)
    return token

class UserTest(APITestCase):

    def test_register(self):
        data = {
            'username': 'testuser',
            'name': 'test',
            'password': '123456789',
            'email': 'testuser@acn.com'
        }
        response = self.client.post('/account/register', data=data)

        # test url accessibility
        self.assertEqual(response.status_code, 200)

        # test success status
        response = response.json()
        self.assertEqual(response['status'], 'success')

        # test override a non verified user with repeated username
        response = self.client.post('/account/register', data=data).json()
        self.assertEqual(response['status'], 'success')

        # test override a non verified user with repeated email
        data['username'] = 'testuser2'
        response = self.client.post('/account/register', data=data).json()
        self.assertEqual(response['status'], 'success')

        # verify testuser email
        data['username'] = 'testuser'
        response = self.client.post('/account/register', data=data)
        testuser = User.objects.get(username='testuser')
        testuser.verified_email = True
        testuser.save()

        # test "not available email" status
        data['username'] = 'testuser2'
        response = self.client.post('/account/register', data=data).json()
        self.assertEqual(response.get('error'), 'not available email')

        # test "not available username" status
        data['username'] = 'testuser'
        response = self.client.post('/account/register', data=data).json()
        self.assertEqual(response.get('error'), 'not available username')

        # test "invalid email"
        data['email'] = 'invalid'
        response = self.client.post('/account/register', data=data).json()
        self.assertEqual(response.get('error'), 'invalid email')



    def test_login(self):
        # create user
        user = User.objects.create_user(
            username='testuser',
            email='testuser@acn.com',
            name='test',
            password='123456789'
        )
        user.verified_email = True
        user.save()
        token = Token.objects.create(user=user)

        # test login with username
        response = self.client.post('/account/login', data={'username':'testuser', 'password':'123456789'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get('token'), f'Token {token.key}')

        # test login with email
        response = self.client.post('/account/login', data={'username':'testuser@acn.com', 'password':'123456789'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get('token'), f'Token {token.key}')

        # test invalid username
        response = self.client.post('/account/login', data={'username':'invalid', 'password':'123456789'}).json()
        self.assertEqual(response.get('error'), 'not found')

        # test invalid password
        response = self.client.post('/account/login', data={'username':'testuser', 'password':'987654321'}).json()
        self.assertEqual(response.get('error'), 'not found')



    def test_is_login(self):
        # create user
        user = User.objects.create_user(
            username='testuser',
            email='testuser@acn.com',
            name='test',
            password='123456789'
        )
        user.verified_email = True
        user.save()
        token = Token.objects.create(user=user)

        # test authentication
        response = self.client.get('/account/is_login', HTTP_AUTHORIZATION=f'Token {token.key}')
        self.assertEqual(response.status_code, 200)


    def test_verify_code(self):
        # create user
        user = User.objects.create_user(
            username='testuser',
            email='testuser@acn.com',
            name='test',
            password='123456789',
        )
        user.verification_code = 65432
        user.save()

        # test invalid username
        response = self.client.post('/account/verify_code', data={'username':'invalid', 'verification_code':'65432'}).json()
        self.assertEqual(response.get('error'), 'invalid username')

        # test invalid code
        response = self.client.post('/account/verify_code', data={'username':'testuser', 'verification_code':'00000'}).json()
        self.assertEqual(response.get('error'), 'invalid code')

        # test verification code with email
        response = self.client.post('/account/verify_code', data={'username':'testuser@acn.com', 'verification_code':'65432'}).json()
        self.assertEqual(response.get('status'), 'success')
        user.refresh_from_db()
        self.assertEqual(user.verified_email, True)

        # test verification code with username
        user.verified_email = False
        user.save()
        response = self.client.post('/account/verify_code', data={'username':'testuser', 'verification_code':'65432'}).json()
        self.assertEqual(response.get('status'), 'success')
        user.refresh_from_db()
        self.assertEqual(user.verified_email, True)


    def test_resend_verification_code(self):
        # create user
        user = User.objects.create_user(
            username='testuser',
            email='testuser@acn.com',
            name='test',
            password='123456789',
        )
        user.verification_code = 65432
        user.save()

        # test success sent
        response = self.client.post('/account/resend_verification_code', data={'username':'testuser'}).json()
        self.assertEqual(response.get('status'), 'success')

        # test invalid username
        response = self.client.post('/account/resend_verification_code', data={'username':'invalid'}).json()
        self.assertEqual(response.get('error'), 'invalid username')

    def test_myself_info(self):
        # create user
        user = User.objects.create_user(
            username='testuser',
            email='testuser@acn.com',
            name='test',
            password='123456789',
        )
        user.gender = True
        user.age = 20
        user.save()
        token = Token.objects.create(user=user)

        # test user_info
        response = self.client.get('/account/myself_info', HTTP_AUTHORIZATION=f'Token {token.key}').json()
        self.assertEqual(response.get('username'), 'testuser')
        self.assertEqual(response.get('name'), 'test')
        self.assertEqual(response.get('email'), 'testuser@acn.com')
        self.assertEqual(response.get('pretty_gender'), 'male')
        self.assertEqual(response.get('age'), 20)

    def test_user_info(self):
        # create user
        user = User.objects.create_user(
            username='testuser',
            email='testuser@acn.com',
            name='test',
            password='123456789',
        )
        user.gender = True
        user.age = 20
        user.save()
        token = Token.objects.create(user=user)

        # test invalid username
        response = self.client.get('/account/user_info', data={'username':''}, HTTP_AUTHORIZATION=f'Token {token.key}').json()
        self.assertEqual(response.get('error'), 'invalid username')

        # test user_info
        response = self.client.get('/account/user_info', data={'username':'testuser'}, HTTP_AUTHORIZATION=f'Token {token.key}').json()
        self.assertEqual(response.get('username'), 'testuser')
        self.assertEqual(response.get('name'), 'test')
        self.assertEqual(response.get('email'), 'testuser@acn.com')
        self.assertEqual(response.get('pretty_gender'), 'male')
        self.assertEqual(response.get('age'), 20)
        

    def test_update_user_info(self):
        # create user
        token1 = create_user()
        token2 = create_user(username='testuser2', email='testuser2@acn.com')
        user2 = token2.user
        user2.verified_email = True
        user2.save()

        # test not available username
        data = {'username':'testuser2', 'email':'testuser2@acn.com'}
        response = self.client.post('/account/update_user_info', data=data, HTTP_AUTHORIZATION=f'Token {token1.key}').json()
        self.assertEqual(response.get('error'), 'not available username')

        # test not available email
        data['username'] = 'testuser3'
        response = self.client.post('/account/update_user_info', data=data, HTTP_AUTHORIZATION=f'Token {token1.key}').json()
        self.assertEqual(response.get('error'), 'not available email')

        # test invalid old password
        data['email'] = 'estuser3@acn.com'
        data['old_password'] = '1234567'
        response = self.client.post('/account/update_user_info', data=data, HTTP_AUTHORIZATION=f'Token {token1.key}').json()
        self.assertEqual(response.get('error'), 'invalid old password')

        # test invalid new password
        data['old_password'] = '123456'
        data['new_password'] = ''
        response = self.client.post('/account/update_user_info', data=data, HTTP_AUTHORIZATION=f'Token {token1.key}').json()
        self.assertEqual(response.get('error'), 'invalid new password')

        # test success status
        user2.verified_email = False
        user2.save()
        data = {
            'username': 'testuser2', 'email': 'testuser2@acn.com',
            'new_password': '1234567', 'old_password': '123456',
            'name': 'ali', 'age': 22, 'gender': 'female', 
            'bio': 'hiiiii', 'avatar':'delete', 'avatar':open('manage.py')
        }
        response = self.client.post('/account/update_user_info', data=data, HTTP_AUTHORIZATION=f'Token {token1.key}').json()
        self.assertEqual(response.get('name'), 'ali')
        self.assertEqual(response.get('pretty_gender'), 'female')
        self.assertEqual(response.get('username'), 'testuser2')
        self.assertEqual(response.get('email'), 'testuser2@acn.com')

        # test success status 2
        token2 = create_user(username='testuser3', email='testuser3@acn.com')
        user2 = token2.user
        data = {
            'email': 'testuser3@acn.com',
            'new_password': '1234567', 'old_password': '1234567',
            'name': 'ali', 'age': 22, 'gender': 'female', 
            'bio': 'hiiiii', 'avatar':'delete'
        }
        response = self.client.post('/account/update_user_info', data=data, HTTP_AUTHORIZATION=f'Token {token1.key}').json()
        self.assertEqual(response.get('name'), 'ali')
        self.assertEqual(response.get('pretty_gender'), 'female')
        self.assertEqual(response.get('username'), 'testuser2')
        self.assertEqual(response.get('email'), 'testuser3@acn.com')







