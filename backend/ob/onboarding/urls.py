from django.urls import path

from . import views

urlpatterns = [
    path("get_or_create_user/", views.get_or_create_user, name="get_or_create_user"),
]
