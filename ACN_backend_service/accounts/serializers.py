from rest_framework import serializers
from .models import *


class SelfUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'username', 'email', 'bio', 'pretty_gender', 'age', 'avatar']