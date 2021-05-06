from django.db import models

class Community(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField()
    tags = models.ManyToManyField('communities.Tag')
    participants = models.ManyToManyField('accounts.User', related_name='joined_communities')
    creator = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='created_communities')
    creation_date = models.DateTimeField(auto_now=True)


class Tag(models.Model):
    name = models.CharField(max_length=20)


class Event(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField()
    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    creator = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='created_events')
    participants = models.ManyToManyField('accounts.User', related_name='joined_events')
    creation_date = models.DateTimeField(auto_now=True)


class Post(models.Model):
    image = models.ImageField(upload_to='posts')
    caption = models.TextField()
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now=True)
