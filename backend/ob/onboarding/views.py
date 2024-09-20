from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .models import Table, Row, Header, User
from .serializers import TableSerializer, RowSerializer, HeaderSerializer

from pprint import pprint

# utils
from .utils import get_file_rows
import json


@api_view(['POST'])
def get_or_create_user(request):
    """
    Ideally want to go through auth.contrib for proper authentication and authorization
    """
    name = request.data.get("name", None)
    email = request.data.get("email", None)

    if not (name and email):
        return Response(data={"error": "Please provide a name or email"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create(name=name, email=email)
    return Response(data={"user_id": user.id})


@api_view(['POST'])
def upload_tables(request):
    files = request.FILES.getlist("files[]")

    if not files:
        return Response(data={"error": "No files sent"}, status=status.HTTP_400_BAD_REQUEST)

    user_id = request.headers.get("Authorization", None)

    tables = []

    # this includes all rows from the table
    rows = []
    for file in files:
        # TODO add header
        table = Table(name=file.name, file=file, owned_by_id=user_id)
        tables.append(table)
        for row in get_file_rows(file):
            col1, col2, col3, col4 = row
            rows.append(Row(col1=col1, col2=col2, col3=col3, col4=col4, table=table))

    Table.objects.bulk_create(tables)
    Row.objects.bulk_create(rows)
    return Response()

@api_view(['GET'])
def get_tables(request):
    user_id = request.query_params.get("user_id", None)
    pprint(request.headers)
    if not user_id:
        return Response(data={"error": "No user attached to query"}, status=status.HTTP_400_BAD_REQUEST)
    tables_qs = Table.objects.filter(owned_by_id=user_id)

    return Response(TableSerializer(tables_qs, many=True).data)


@ api_view(['GET'])
def get_headers(request):

    # get from middleware pls
    user_id = request.query_params.get("user_id", None)
    if not user_id:
        return Response(data={"error": "No user attached to query"}, status=status.HTTP_400_BAD_REQUEST)

    user_id = request.body.get("user", None)

    headers_qs = Header.objects.filter(owned_by_id=user_id)

    if not user_id:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    # should change this so that headers is not only dependant on tables
    headers_qs = Header.objects.prefetch_related("header_tables").filter(header_tables__owner_id=user_id)

    return Response(HeaderSerializer(headers_qs, many=True).data)

@api_view(['POST'])
def add_header(request):
    name1 = request.data.get("name1", None)
    name2 = request.data.get("name2", None)
    name3 = request.data.get("name3", None)
    name4 = request.data.get("name4", None)
    type1 = request.data.get("type1", None)
    type2 = request.data.get("type2", None)
    type3 = request.data.get("type3", None)
    type4 = request.data.get("type4", None)

    Header.objects.create(name1=name1,
                          name2=name2,
                          name3=name3,
                          name4=name4,
                          type1=type1,
                          type2=type2,
                          type3=type3,
                          type4=type4,)

    # make nice message
    return Response()

@ api_view(['GET'])
def get_rows(request):
    table_id = request.query_params.get("table_id", None)
    if not table_id:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # check if owned by user
    rows = Row.objects.select_related("table").filter(table_id=table_id)

    return Response(RowSerializer(rows, many=True).data)
