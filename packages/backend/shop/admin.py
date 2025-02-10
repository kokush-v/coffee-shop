import email
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from . import models


@admin.register(models.ShopUser)
class MyUserAdmin(UserAdmin):
    model = models.ShopUser
    filter_horizontal = ()
    fieldsets = UserAdmin.fieldsets
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )


admin.site.register(models.Product)
