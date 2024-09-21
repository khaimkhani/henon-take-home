## henon-take-home

# Installation
This can be installed on any UNIX based machine or WSL within Windows.
## Server

Ensure that postgres is not running locally:
```
$ sudo systemctl stop postgresql
```
Run the docker server and database containers
```
cd backend/ob
docker compose up
// or docker-compose up
```
The server will run on localhost:8001

## Web
```
cd frontend/obfe
```
Install dependencies
```
npm install
```
Start web server
```
npm start
```
The server will run on localhost:3000


