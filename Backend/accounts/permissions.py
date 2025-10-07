from rest_framework import permissions

class IsStudent(permissions.BasePermission):
    """
    Permission check for Student users.
    Grants access only to users with user_type = 'student'
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.user_type == 'student'
        )

class IsTeacher(permissions.BasePermission):
    """
    Permission check for Teacher users.
    Grants access only to users with user_type = 'teacher'
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.user_type == 'teacher'
        )

class IsParent(permissions.BasePermission):
    """
    Permission check for Parent users.
    Grants access only to users with user_type = 'parent'
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.user_type == 'parent'
        )

class IsAdmin(permissions.BasePermission):
    """
    Permission check for Admin users.
    Grants access only to users with user_type = 'admin'
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.user_type == 'admin'
        )

class CanViewFinancials(permissions.BasePermission):
    """
    Permission check for financial record access.
    Addresses: Financial transparency requirements
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
            
        user_type = request.user.user_type
        
        # Admins and Teachers can always view financials
        if user_type in ['admin', 'teacher']:
            return True
            
        # Parents can only view if explicitly permitted
        elif user_type == 'parent':
            return hasattr(request.user, 'parent') and \
                   request.user.parent.can_view_financial_reports
                   
        return False

class CanManageTransport(permissions.BasePermission):
    """
    Permission check for transport management.
    Addresses: Transport safety accountability
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
            
        # Only admins with transport management permission
        if request.user.user_type == 'admin':
            return hasattr(request.user, 'admin') and \
                   request.user.admin.can_manage_transport
                   
        return False

class CanViewRiskReports(permissions.BasePermission):
    """
    Permission check for risk assessment reports.
    Addresses: Dropout prevention system access
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
            
        user_type = request.user.user_type
        
        # Admins and Teachers can view all risk reports
        if user_type in ['admin', 'teacher']:
            return True
            
        # Parents can view their children's risk reports
        elif user_type == 'parent':
            return hasattr(request.user, 'parent')
            
        return False

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Write permissions are only allowed to the owner
        return obj.owner == request.user