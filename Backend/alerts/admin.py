from django.contrib import admin
from .models import Alert, AlertAcknowledgement, AlertTemplate

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ('title', 'alert_type', 'priority', 'status', 'student', 'created_at', 'is_expired')
    list_filter = ('alert_type', 'priority', 'status', 'created_at')
    search_fields = ('title', 'message', 'student__user__username')
    readonly_fields = ('created_at', 'updated_at')
    filter_horizontal = ('target_users',)
    actions = ['mark_as_resolved', 'mark_as_expired']
    
    def is_expired(self, obj):
        return obj.is_expired()
    is_expired.boolean = True
    is_expired.short_description = 'Expired'
    
    def mark_as_resolved(self, request, queryset):
        queryset.update(status='resolved')
    mark_as_resolved.short_description = "Mark selected alerts as resolved"
    
    def mark_as_expired(self, request, queryset):
        queryset.update(status='expired')
    mark_as_expired.short_description = "Mark selected alerts as expired"

@admin.register(AlertAcknowledgement)
class AlertAcknowledgementAdmin(admin.ModelAdmin):
    list_display = ('alert', 'user', 'acknowledged_at')
    list_filter = ('acknowledged_at',)
    search_fields = ('alert__title', 'user__username')
    readonly_fields = ('acknowledged_at',)

@admin.register(AlertTemplate)
class AlertTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'alert_type', 'default_priority', 'default_expiry_hours')
    list_filter = ('alert_type', 'default_priority')
    search_fields = ('name', 'title_template')