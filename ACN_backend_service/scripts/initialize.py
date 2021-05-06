from communities.models import *

# initialize tags
tags = ['cinema', 'game', 'politics', 'education', 'industry']
for tag in tags:
    if not Tag.objects.filter(name=tag):
        Tag.objects.create(name=tag)