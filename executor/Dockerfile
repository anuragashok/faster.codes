FROM golang:bullseye as builder
WORKDIR /app 
COPY . .
RUN go build ./cmd/executor
RUN go build ./cmd/api

FROM ubuntu:impish
RUN apt-get update
# openjdk11 / golang
RUN apt-get install -y openjdk-11-jdk golang
WORKDIR /app
COPY --from=builder /app/executor /usr/bin/
RUN chmod +x /usr/bin/executor
CMD ["executor"]
