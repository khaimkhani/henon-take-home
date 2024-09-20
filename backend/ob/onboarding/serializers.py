from rest_framework import serializers
from .models import Table, Header, Row

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ['name', 'created_at', 'id']

class RowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Row
        fields = ['col1', 'col2', 'col3', 'col4']

class HeaderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Header
        fields = ['col1', 'col2', 'col3', 'col4']

    def get_col1(self, obj):
        return {"name1": obj.name1, "type1": obj.type1}
    def get_col2(self, obj):
        return {"name2": obj.name2, "type1": obj.type2}
    def get_col3(self, obj):
        return {"name3": obj.name3, "type3": obj.type3}
    def get_col4(self, obj):
        return {"name4": obj.name4, "type4": obj.type4}
