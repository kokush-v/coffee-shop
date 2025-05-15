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

class OrderProductsInline(admin.TabularInline):
    model = models.OrderProducts
    extra = 1  # How many empty forms to show by default


@admin.register(models.Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderProductsInline]
    list_display = ('id', 'user', 'status', 'created_at', 'total_price')
    list_filter = ('status', 'created_at')
    search_fields = ('user__email', 'user__username')
    
    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        form.instance.update_total_price()
