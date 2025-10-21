#!/bin/bash

echo "Starting Go Trivia App in Local"

# Start the backend server
go mod tidy
go build -o go-trivia-backend ./...

./go-trivia-backend