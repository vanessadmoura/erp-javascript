from django.urls import path

from companies.views.employees import Employees, EmployeeDetail
from companies.views.groups import Groups, GroupDetail
from companies.views.permissions import PermissionDetail
from companies.views.tasks import Tasks, TaskDetail

urlpatterns = [
    path('employees', Employees.as_view(), name='employees'),
    path('employees/<int:employee_id>', EmployeeDetail.as_view()),

    path('groups', Groups.as_view(), name='groups'),
    path('groups/<int:group_id>', GroupDetail.as_view()),
    path('permissions', PermissionDetail.as_view()),

    path('tasks', Tasks.as_view(), name='tasks'),
    path('tasks/<int:task_id>', TaskDetail.as_view()),

]