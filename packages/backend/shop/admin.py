import email
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from . import models





@admin.register(models.ShopUser)
class MyUserAdmin(UserAdmin):
    model = models.ShopUser
    filter_horizontal = ()

    list_display = ('id', 'email', 'username', 'is_staff')

    fieldsets = (
        (None, {'fields': ('email', 'password',  'username')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
    )


admin.site.register(models.Product)
