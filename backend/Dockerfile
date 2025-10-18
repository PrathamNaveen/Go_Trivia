FROM golang:1.25-alpine

WORKDIR /app

COPY go.mod ./
RUN go mod tidy

COPY . .

RUN go build -o trivia-backend ./...

EXPOSE 8080

CMD ["./trivia-backend"]