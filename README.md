# Installation
This can be installed on any UNIX based machine or WSL within Windows.
## Server

Ensure that postgres is not running locally on port 5432:
```
$ sudo systemctl stop postgresql
```
Run the docker server and database containers
```
$ cd backend/ob
$ docker compose up
$ // or docker-compose up
```
The server will run on localhost:8001 with the admin on http://localhost:8001/admin

You can run migrations by doing the following:
```
$ docker exec -it ob-web-1 bash
docker> python manage.py migrate  
```

## Web
```
$ cd frontend/obfe
```
Install dependencies
```
$ npm install
```
Start web server
```
$ npm start
```
You can now go to http://localhost:3000 and use the application


