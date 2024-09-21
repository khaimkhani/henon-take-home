from rest_framework import serializers
from .models import Table, Header, Row

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ['name', 'created_at', 'id']

class RowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Row
        fields = ['id', 'col1', 'col2', 'col3', 'col4']

class HeaderSerializer(serializers.ModelSerializer):
    col1 = serializers.SerializerMethodField()
    col2 = serializers.SerializerMethodField()
    col3 = serializers.SerializerMethodField()
    col4 = serializers.SerializerMethodField()

    class Meta:
        model = Header
        fields = ['col1', 'col2', 'col3', 'col4']

    def get_col1(self, obj):
        return {"name": obj.name1, "type": obj.type1}
    def get_col2(self, obj):
        return {"name": obj.name2, "type": obj.type2}
    def get_col3(self, obj):
        return {"name": obj.name3, "type": obj.type3}
    def get_col4(self, obj):
        return {"name": obj.name4, "type": obj.type4}
