FROM golang:bullseye as builder
WORKDIR /app 
COPY . .
RUN go build ./cmd/executor
RUN go build ./cmd/executor-api

FROM ubuntu:impish as executor-api
RUN apt-get update
RUN apt-get install -y ca-certificates
COPY --from=builder /app/executor-api /usr/bin/
RUN chmod +x /usr/bin/executor-api
CMD ["executor-api"]

FROM ubuntu:impish as executor
RUN apt-get update
# openjdk11 / golang
RUN apt-get install -y ca-certificates openjdk-11-jdk golang
WORKDIR /app
COPY --from=builder /app/executor /usr/bin/
RUN chmod +x /usr/bin/executor
CMD ["executor"]

