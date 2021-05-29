from django.db import models

class Community(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField()
    tags = models.ManyToManyField('communities.Tag')
    image = models.ImageField(upload_to='communities', null=True, blank=True)
    participants = models.ManyToManyField('accounts.User', related_name='joined_communities')
    creator = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='created_communities')
    creation_date = models.DateTimeField(auto_now_add=True)
    rate = models.FloatField(default=0)

    def creator_info(self):
        return self.creator.short_info()

    def tags_info(self):
        return [tag.info() for tag in self.tags.all()]

    def number_of_participants(self):
        return self.participants.count() + 1

    def update_rate(self):
        rates =  [rate.value for rate in self.rates.all()]
        if rates:
            self.rate = sum(rates) / len(rates)
            self.save()



class Tag(models.Model):
    name = models.CharField(max_length=20)

    def info(self):
        return {'id':self.id, 'name':self.name}


class Event(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField()
    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='events', null=True, blank=True)
    creator = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='created_events')
    participants = models.ManyToManyField('accounts.User', related_name='joined_events')
    begin_time = models.DateTimeField()
    creation_date = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)

    def creator_info(self):
        return self.creator.short_info()

    def number_of_participants(self):
        return self.participants.count() + 1


class Post(models.Model):
    image = models.ImageField(upload_to='posts')
    caption = models.TextField()
    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='created_posts')
    date = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField('accounts.User', related_name='liked_posts')

    def creator_info(self):
        return self.user.short_info()

    def number_of_likes(self):
        return self.likes.count()

    def number_of_comments(self):
        return self.post_comment_set.count()


class Post_comment(models.Model):
    text = models.TextField()
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

    def creator_info(self):
        return self.user.short_info()


class Community_rate(models.Model):
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='rates')
    value = models.FloatField()