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
        headers = dict(scope["headers"])
        token = None


        if b"authorization" in headers:
            auth_header = headers[b"authorization"].decode("utf-8")
            if auth_header.startswith("Bearer "):
                token = auth_header.split("Bearer ")[1]


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
