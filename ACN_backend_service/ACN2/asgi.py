import os, django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ACN2.settings")
django.setup()

from chats.middleware.CustomAuth import TokenAuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import chats.routing


application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  "websocket": TokenAuthMiddlewareStack(
        URLRouter(
            chats.routing.websocket_urlpatterns
        )
    ),
})