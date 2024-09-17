# Use the official Python image from the Docker Hub
FROM python:3.9-slim-buster

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /code

# Copy requirements.txt into the container
COPY requirements.txt /code/

# Install dependencies
RUN pip install -r requirements.txt

# Copy the rest of the Django project files into the container
COPY . /code/
