from django.urls import path

from . import views

urlpatterns = [
    path("get_or_create_user/", views.get_or_create_user, name="get_or_create_user"),
    path("tables/", views.get_tables, name="tables"),
    path("headers/", views.get_headers, name="headers"),
    path("rows/", views.get_rows, name="rows"),
    path("upload_files/", views.upload_tables, name="upload_tables"),
]
