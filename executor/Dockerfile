FROM golang:bullseye as builder
WORKDIR /app 
COPY . .
RUN go build ./cmd/executor
RUN go build ./cmd/executor-api

FROM ghcr.io/anuragashok/faster.codes/executor-base:latest as executor-api
COPY --from=builder /app/executor-api /usr/bin/
RUN chmod +x /usr/bin/executor-api
CMD ["executor-api"]

FROM ghcr.io/anuragashok/faster.codes/executor-base:latest  as executor
# openjdk11 / golang
RUN apt-get install -y openjdk-11-jdk golang
WORKDIR /app
COPY --from=builder /app/executor /usr/bin/
RUN chmod +x /usr/bin/executor
CMD ["executor"]

