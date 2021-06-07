from django.db import models

class Message(models.Model):
    text = models.TextField()
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    community = models.ForeignKey('communities.Community', on_delete=models.CASCADE)
    reply_to = models.ForeignKey('chats.Message',blank=True, null=True, on_delete=models.SET_NULL, related_name='replies_in')
    date = models.DateTimeField(auto_now=True)
    image = models.TextField(default='')
