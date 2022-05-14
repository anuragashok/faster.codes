FROM golang:bullseye as builder
WORKDIR /app 
COPY . .
RUN go build ./cmd/executor
RUN go build ./cmd/executor-api

FROM ghcr.io/anuragashok/faster.codes/executor-base:latest as executor-api
WORKDIR /app
COPY --from=builder /app/executor-api /usr/bin/
RUN chmod +x /usr/bin/executor-api
CMD ["executor-api"]

FROM ghcr.io/anuragashok/faster.codes/executor-runner-base:latest  as executor
WORKDIR /app
COPY --from=builder /app/executor /usr/bin/
RUN chmod +x /usr/bin/executor
CMD ["executor"]