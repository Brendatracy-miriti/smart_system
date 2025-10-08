from rest_framework import serializers
from .models import Alert, AlertAcknowledgement, AlertTemplate
from accounts.serializers import UserProfileSerializer, StudentProfileSerializer

class AlertAcknowledgementSerializer(serializers.ModelSerializer):
    user_details = UserProfileSerializer(source='user', read_only=True)
    
    class Meta:
        model = AlertAcknowledgement
        fields = ['id', 'user', 'user_details', 'acknowledged_at', 'notes']
        read_only_fields = ['id', 'acknowledged_at']

class AlertSerializer(serializers.ModelSerializer):
    created_by_details = UserProfileSerializer(source='created_by', read_only=True)
    student_details = StudentProfileSerializer(source='student', read_only=True)
    acknowledgements = AlertAcknowledgementSerializer(many=True, read_only=True)
    is_acknowledged = serializers.SerializerMethodField()
    is_expired = serializers.SerializerMethodField()
    
    class Meta:
        model = Alert
        fields = [
            'id', 'title', 'message', 'alert_type', 'priority', 'status',
            'target_users', 'target_user_types', 'student', 'student_details',
            'created_by', 'created_by_details', 'created_at', 'updated_at',
            'expires_at', 'action_required', 'action_url', 'action_text',
            'acknowledgements', 'is_acknowledged', 'is_expired'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'acknowledgements']
    
    def get_is_acknowledged(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.acknowledgements.filter(user=request.user).exists()
        return False
    
    def get_is_expired(self, obj):
        return obj.is_expired()

class AlertCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = [
            'title', 'message', 'alert_type', 'priority', 'target_users',
            'target_user_types', 'student', 'expires_at', 'action_required',
            'action_url', 'action_text'
        ]
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

class AlertTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertTemplate
        fields = '__all__'

class AcknowledgeAlertSerializer(serializers.Serializer):
    notes = serializers.CharField(required=False, allow_blank=True)