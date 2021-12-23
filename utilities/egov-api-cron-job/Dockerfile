FROM python:3.9.0a3-alpine3.10
WORKDIR /app/cron/
COPY requirements.txt .
RUN pip3 install -r requirements.txt
COPY cronJobAPIConfig.py cronJobAPIConfig.py
