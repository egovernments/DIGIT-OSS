FROM python:3-alpine

ARG WORK_DIR
WORKDIR /app
COPY ${WORK_DIR}/requirements.txt .
RUN \
 apk add --no-cache postgresql-libs && \
 apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
 python3 -m pip install -r requirements.txt --no-cache-dir && \
 apk --purge del .build-deps

COPY ${WORK_DIR}/src /app
CMD ["sh", "-c", "python3 /app/check_${CHECK_NAME}.py"]
