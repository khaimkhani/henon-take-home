from django.urls import path

from . import views

urlpatterns = [
    path("get_or_create_user/", views.get_or_create_user, name="get_or_create_user"),
    path("tables/", views.get_tables, name="tables"),
    path("headers/", views.get_headers, name="headers"),
    path("header_from_table/", views.get_header_from_table_id, name="header_from_table"),
    path("add_header/", views.add_header, name="add_header"),
    path("remove_header/", views.remove_header, name="remove_header"),
    path("rows/", views.get_rows, name="rows"),
    path("upload_files/", views.upload_tables, name="upload_tables"),
    path("remove_table/", views.remove_table, name="remove_table"),
]
