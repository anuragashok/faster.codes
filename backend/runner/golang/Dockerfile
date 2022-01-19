FROM golang:1.17.6-alpine3.15
WORKDIR /app
COPY run.py .
RUN chmod +x run.py
RUN apt-get update && apt-get install -y python3-pip && rm -rf /var/lib/apt/lists/*``
RUN pip3 install psutil
CMD ["sh","-c","cd /data && go build main.go && python3 /app/run.py ./main > /data/server.log 2>&1"]
