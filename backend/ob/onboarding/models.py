from django.db import models

# Create your models here.

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)


class Header(models.Model):

    # name mapping
    name1 = models.CharField(max_length=32)
    name2 = models.CharField(max_length=32)
    name3 = models.CharField(max_length=32)
    name4 = models.CharField(max_length=32)

    # type mapping
    type1 = models.CharField(max_length=32)
    type2 = models.CharField(max_length=32)
    type3 = models.CharField(max_length=32)
    type4 = models.CharField(max_length=32)

    # temp
    created_at = models.DateTimeField(auto_now_add=True)

class Table(models.Model):
    name = models.CharField(max_length=100)
    owned_by = models.ForeignKey("User", on_delete=models.CASCADE)
    file = models.FileField(upload_to="uploads/")
    created_at = models.DateTimeField(auto_now_add=True)
    header = models.ForeignKey("Header", null=True, blank=True, on_delete=models.SET_NULL, related_name="header_tables")


class Row(models.Model):
    table = models.ForeignKey("Table", on_delete=models.CASCADE, related_name="table_rows")
    col1 = models.CharField(max_length=100)
    col2 = models.CharField(max_length=100)
    col3 = models.CharField(max_length=100)
    col4 = models.CharField(max_length=100)
