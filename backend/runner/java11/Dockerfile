FROM adoptopenjdk:11
WORKDIR /app
COPY run.py .
RUN chmod +x run.py
RUN apt-get update \
  && apt-get install -y python3-pip python3-dev \
  && cd /usr/local/bin \
  && ln -s /usr/bin/python3 python \
  && pip3 --no-cache-dir install --upgrade pip \
  && rm -rf /var/lib/apt/lists/*
RUN pip3 install psutil
CMD ["sh","-c","javac /data/Main.java && python3 run.py java Main"]
