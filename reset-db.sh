#!/usr/bin/env bash
# Use this script to replace the database with a fresh one

DB_CONTAINER_NAME="ask-god-mysql"

if ! [ -x "$(command -v docker)" ]; then
    echo -e "Docker is not installed. Please install docker and try again.\nDocker install guide: https://docs.docker.com/engine/install/"
    exit 1
fi

if ! docker info > /dev/null 2>&1; then
    echo "Starting Docker Desktop..."
    "C:\Program Files\Docker\Docker\Docker Desktop.exe"
fi

while ! docker system info > /dev/null 2>&1; do
    echo "Waiting for Docker to start..."
    sleep 1
done

if docker ps -a -q | grep -q "$CONTAINER_NAME"; then
    echo "Stopping container: "
    docker stop "$DB_CONTAINER_NAME"

    echo "Removing container: "
    docker rm "$DB_CONTAINER_NAME"
fi

echo "Starting database container:"
./start-database.sh

while ! docker exec -i "$DB_CONTAINER_NAME" mysqladmin ping -h"localhost" --silent; do
    echo "Waiting for database to start..."
    sleep 1
done

sleep 3

echo "Pushing database schema and seeding data..."
npm run db:push
npm run db:seed