FROM adoptopenjdk:11
WORKDIR /app
COPY run.py .
RUN chmod +x run.py
CMD ["sh","-c","javac /data/Main.java && ./run.py java Main"]
