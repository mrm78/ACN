from rest_framework import response
from accounts.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.contrib import auth
from django.core.mail import send_mail
from django.conf import settings
import re, random
from django.utils import timezone
from .serializers import *



class register(APIView):
    def post(self, req):
        #check email
        if not re.search("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", req.POST.get('email')):
            return Response({'status':'failed', 'error':'invalid email'})
        #check username if it's not available or not verified before
        user = User.objects.filter(username=req.POST.get('username'))
        if user:
            if user[0].verified_email:
                return Response({'status':'failed', 'error':'not available username'})
            user[0].delete()
        #check email if it's not available or not verified before
        user = User.objects.filter(email=req.POST.get('email'))
        if user:
            if user[0].verified_email:
                return Response({'status':'failed', 'error':'not available email'})
            user[0].delete()
        #create a new user
        user = User.objects.create_user(req.POST.get('username'), req.POST.get('email'), req.POST.get('name'), req.POST.get('password'))
        user.verification_code = random.randint(10000, 99999)
        user.verification_code_time = timezone.now()
        user.save()
        send_mail(
            subject='A Cool Name account verification',
            message=f'your code to verify email : {user.verification_code}',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
        )
        return Response({'status':'success'})
    

class verify_code(APIView):
    def post(self, req):
        #if user enter email
        if '@' in req.POST['username']:
            user = User.objects.filter(email=req.POST['username'])
        #if user enter username
        else:
            user = User.objects.filter(username=req.POST['username'])
        if not user:
            return Response({'status':'failed', 'error':'invalid username'})
        #check verification code and its passed time
        if str(user[0].verification_code) == req.POST.get('verification_code'): #and (timezone.now()-user[0].verification_code_time).total_seconds()<120:
            user[0].verified_email = True
            user[0].save()
            auth.login(req, user[0])
            Token.objects.filter(user=user[0]).delete()
            token = Token.objects.create(user=user[0])
            return Response({'status':'success', 'token':f'Token {token.key}'})
        return Response({'status':'failed', 'error':'invalid code'})

    

class login(APIView):
    def post(self, req):
        #if user enter email
        if '@' in req.POST['username']:
            user = User.objects.filter(email=req.POST['username'])
        #if user enter username
        else:
            user = User.objects.filter(username=req.POST['username'])
        if user and user[0].verified_email and user[0].check_password(req.POST['password']):
            auth.login(req, user[0])
            token = Token.objects.get(user=user[0])
            return Response({'status':'success', 'token':f'Token {token.key}'})
        return Response({'status':'failed', 'error':'not found'})

    
class resend_verification_code(APIView):
    def post(self, req):
        user = User.objects.filter(username=req.POST['username'])
        if not user:
            return Response({'status':'failed', 'error':'invalid username'})
        user[0].verification_code = random.randint(10000, 99999)
        user[0].verification_code_time = timezone.now()
        user[0].save()
        send_mail(
        subject='A Cool Name account verification',
        message=f'your code to verify email : {user[0].verification_code}',
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[user[0].email],
        )
        return Response({'status':'success'})


class is_login(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, req):
        return Response({'status':'yes'})


class myself_info(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, req):
        user = SelfUserSerializer(req.user)
        return Response(user.data)

class user_info(APIView):
    def get(self, req):
        user = User.objects.filter(username=req.GET.get('username'))
        if not user:
            return JsonResponse({'status':'failed', 'error':'invalid username'})
        user = SelfUserSerializer(user[0])
        return Response(user.data)



class update_user_info(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, req):
        user = req.user
        #checking username
        if req.POST.get('username'):
            if req.user.username != req.POST.get('username'):
                check_user = User.objects.filter(username=req.POST.get('username'))
                if check_user:
                    if check_user[0].verified_email:
                        return JsonResponse({'status':'failed', 'error':'not available username'})
                    check_user[0].delete()
            user.username = req.POST.get('username')
        #checking email
        if req.POST.get('email'):
            if req.user.email != req.POST.get('email'):
                check_user = User.objects.filter(email=req.POST.get('email'))
                if check_user:
                    if check_user[0].verified_email:
                        return JsonResponse({'status':'failed', 'error':'not available email'})
                    check_user[0].delete()
            user.email = req.POST.get('email')
        #checking password
        if req.POST.get('old_password'):
            if user.check_password(req.POST.get('old_password')):
                if req.POST.get('new_password'):
                    user.set_password(req.POST.get('new_password'))
                else:
                    return JsonResponse({'status':'failed', 'error':'invalid new password'})
            else:
                return JsonResponse({'status':'failed', 'error':'invalid old password'})
        if req.POST.get('name'):
            user.name = req.POST.get('name')
        if req.POST.get('avatar') == 'delete':
            user.avatar = None
        if req.FILES.get('avatar'):
            user.avatar = req.FILES.get('avatar')
        if req.POST.get('age'):
            try:
                user.age = int(req.POST.get('age'))
            except:
                pass
        if req.POST.get('gender'):
            user.gender = req.POST.get('gender') == 'male'
        if req.POST.get('bio'):
            user.bio = req.POST.get('bio')
        user.save()
        user_info = SelfUserSerializer(user)
        return Response(user_info.data)