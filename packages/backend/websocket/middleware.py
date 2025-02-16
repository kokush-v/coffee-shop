import jwt
from shop.models import ShopUser
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken


class JWTAuthMiddleware:
    """Middleware для аутентификации WebSocket через JWT"""

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        token = scope['query_string'].decode().split('=')[1]

        scope["user"] = await self.get_user_from_token(token)
        return await self.inner(scope, receive, send)

    @database_sync_to_async
    def get_user_from_token(self, token):

        if not token:
            return AnonymousUser()
        try:
            access_token = AccessToken(token)
            user = ShopUser.objects.get(id=access_token["user_id"])
            return user
        except (jwt.ExpiredSignatureError, jwt.DecodeError, ShopUser.DoesNotExist):
            return AnonymousUser()


def JWTAuthMiddlewareStack(inner):
    return JWTAuthMiddleware(inner)
