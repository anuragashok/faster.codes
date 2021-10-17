FROM adoptopenjdk:11
WORKDIR /app
COPY run.py .
RUN chmod +x run.py
RUN apt-get update && apt-get install -y python3-pip && rm -rf /var/lib/apt/lists/*``
RUN pip3 install psutil
CMD ["sh","-c","cd /data && javac Main.java && python3 /app/run.py java Main > /data/server.log 2>&1"]
