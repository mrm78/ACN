from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone


class UserManager(BaseUserManager):
    use_in_migrations = True
    def create_user(self, username, email, name, password):
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, name=name, date_joined=timezone.now())
        user.set_password(password)
        user.save(using=self._db)
        return user


class User(AbstractUser):
    email = models.EmailField(unique=True)
    verified_email = models.BooleanField(default=False)
    verification_code = models.IntegerField(null=True, blank=True)
    verification_code_time = models.DateTimeField(null=True, blank=True)
    date_joined = models.DateTimeField()
    avatar = models.ImageField(upload_to='avatars', null=True, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    gender = models.BooleanField(choices=((True, 'male'), (False, 'female')), null=True)
    name = models.CharField(max_length=30)
    bio = models.TextField(null=True)
    first_name = None
    last_name = None
    objects = UserManager()
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username

    def short_info(self):
        return {'username':self.username, 'avatar':self.avatar.url if self.avatar else None}

    def pretty_gender(self):
        return 'male' if self.gender else 'female'