from rest_framework.response import Response
from rest_framework import status
from .models import Table, Row, Header

def LoginUser(request):
    name = request.body.get("name", None)
    email = request.body.get("email", None)

    return Response()


def index(request):
    return Response()


def get_tables(request):

    tables_qs = Table.objects.filter(owned_by_id=request.user.id)

    return Response(data=tables_qs)


def get_headers(request):

    user_id = request.body.get("user", None)

    if not user_id:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    headers_qs = Header.objects.prefetch_related("header_tables").filter(header_tables__owned_by_id=user_id)

    return Response(data=headers_qs)

def get_rows(request):
    # get the header first, then send out data as the int type
    table_id = request.body.get("table_id", None)
    if not table_id:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # check if owned by user
    rows = Row.objects.select_related("table").filter(table_id=table_id)

    return Response(data=rows)
