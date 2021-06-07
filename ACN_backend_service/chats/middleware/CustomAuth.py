from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from communities.models import Community
from rest_framework.authtoken.models import Token
from accounts.models import User


@database_sync_to_async
def get_user(token):
    try:
        token = token.replace('Token%20', '')
        token = Token.objects.get(key=token)
        return token.user
    except Exception as e:
        return AnonymousUser()

@database_sync_to_async
def get_community(community_id):
    try:
        return Community.objects.get(id=community_id)
    except:
        return ''

        
class QueryAuthMiddleware:  
    def __init__(self, app):
        self.app = app
        
    async def __call__(self, scope, receive, send):
        token, community_id = scope["query_string"].decode().split(';')
        scope['user'] = await get_user(token)
        scope['community'] = await get_community(community_id)
        
        return await self.app(scope, receive, send)

TokenAuthMiddlewareStack = lambda inner: QueryAuthMiddleware(AuthMiddlewareStack(inner)) 