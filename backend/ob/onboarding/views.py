from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

from .models import Table, Row, Header, User
from .serializers import TableSerializer, RowSerializer, HeaderSerializer

from .utils import get_file_rows


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
    user_id = request.headers.get("Authorization", None)

    if not user_id:
        return Response({"error": "No user associated with this ID"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "user does not exist"}, status=status.HTTP_400_BAD_REQUEST)

    files = request.FILES.getlist("files[]")
    col_names = request.POST.getlist("colNames[]")
    col_types = request.POST.getlist("colTypes[]")

    if not files:
        return Response(data={"error": "No files sent"}, status=status.HTTP_400_BAD_REQUEST)

    tables = []

    # all files have same header
    header = Header.objects.get_or_create(name1=col_names[0],
                                          name2=col_names[1],
                                          name3=col_names[2],
                                          name4=col_names[3],
                                          type1=col_types[0],
                                          type2=col_types[1],
                                          type3=col_types[2],
                                          type4=col_types[3],
                                          owner=user,
                                          )[0]
    # this includes all rows from the table
    rows = []
    for file in files:
        table = Table(name=file.name, file=file, header=header, owned_by_id=user_id)
        tables.append(table)
        for row in get_file_rows(file):
            col1, col2, col3, col4 = row
            rows.append(Row(col1=col1, col2=col2, col3=col3, col4=col4, table=table))

    Table.objects.bulk_create(tables)
    Row.objects.bulk_create(rows)
    return Response()


@api_view(['GET'])
def get_tables(request):
    user_id = request.headers.get("Authorization", None)
    if not user_id:
        return Response(data={"error": "No user attached to query"}, status=status.HTTP_400_BAD_REQUEST)
    tables_qs = Table.objects.filter(owned_by_id=user_id)

    return Response(TableSerializer(tables_qs, many=True).data)


@api_view(['POST'])
def remove_table(request):

    user_id = request.headers.get("Authorization", None)
    if not user_id:
        return Response(data={"error": "No user attached to query"}, status=status.HTTP_400_BAD_REQUEST)
    table_id = request.data.get("table_id", None)
    if not table_id:
        return Response(data={"error": "No table attached to query"}, status=status.HTTP_400_BAD_REQUEST)

    deleted = Table.objects.get(id=table_id, owned_by_id=user_id).delete()

    return Response() if deleted else Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_headers(request):
    user_id = request.headers.get("Authorization", None)
    if not user_id:
        return Response(data={"error": "No user attached to query"}, status=status.HTTP_400_BAD_REQUEST)

    headers_qs = Header.objects.filter(owner_id=user_id)

    return Response(HeaderSerializer(headers_qs, many=True).data)


@api_view(['GET'])
def get_header_from_table_id(request):
    user_id = request.headers.get("Authorization", None)
    if not user_id:
        return Response(data={"error": "No user attached to query"}, status=status.HTTP_400_BAD_REQUEST)

    table_id = request.query_params.get("table_id", None)
    if not table_id:
        return Response(data={"error": "No table attached to query"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        table = Table.objects.only('header').get(id=table_id)
    except Table.DoesNotExist:
        return Response({"error": "Table not found"}, status=status.HTTP_400_BAD_REQUEST)

    header = table.header
    return Response(HeaderSerializer(header).data)


@api_view(['POST'])
def add_header(request):
    user_id = request.headers.get("Authorization", None)
    if not user_id:
        return Response({"error": "No user associated with this ID"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "user does not exist"}, status=status.HTTP_400_BAD_REQUEST)

    name1 = request.data[0].get("name", None)
    type1 = request.data[0].get("type", None)
    name2 = request.data[1].get("name", None)
    type2 = request.data[1].get("type", None)
    name3 = request.data[2].get("name", None)
    type3 = request.data[2].get("type", None)
    name4 = request.data[3].get("name", None)
    type4 = request.data[3].get("type", None)

    header, created = Header.objects.get_or_create(
        name1=name1,
        name2=name2,
        name3=name3,
        name4=name4,
        type1=type1,
        type2=type2,
        type3=type3,
        type4=type4,
        owner=user
    )

    if not created:
        return Response({"data": "Header already exists"})
    return Response({"data": "Created header"})


@api_view(['POST'])
def remove_header(request):

    user_id = request.headers.get("Authorization", None)
    if not user_id:
        return Response({"error": "No user associated with this ID"}, status=status.HTTP_400_BAD_REQUEST)

    name1 = request.data[0].get("name", None)
    type1 = request.data[0].get("type", None)
    name2 = request.data[1].get("name", None)
    type2 = request.data[1].get("type", None)
    name3 = request.data[2].get("name", None)
    type3 = request.data[2].get("type", None)
    name4 = request.data[3].get("name", None)
    type4 = request.data[3].get("type", None)

    deleted, _ = Header.objects.filter(
        name1=name1,
        name2=name2,
        name3=name3,
        name4=name4,
        type1=type1,
        type2=type2,
        type3=type3,
        type4=type4,
        owner_id=user_id
    ).delete()

    return Response() if deleted else Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_rows(request):
    user_id = request.headers.get("Authorization", None)
    if not user_id:
        return Response({"error": "No user associated with this ID"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "user does not exist"}, status=status.HTTP_400_BAD_REQUEST)

    table_id = request.query_params.get("table_id", None)
    if not table_id:
        return Response(status=status.HTTP_404_NOT_FOUND)

    table = Table.objects.get(id=table_id, owned_by=user)
    rows = Row.objects.filter(table_id=table_id)
    headers = Header.objects.prefetch_related("header_tables").filter(header_tables=table).values()

    return Response({"rows": RowSerializer(rows, many=True).data,
                     "headers": headers[0] if headers else None
                     })
