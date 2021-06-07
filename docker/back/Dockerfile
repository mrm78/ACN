FROM python:3.8
RUN pip install --upgrade pip
WORKDIR /app
COPY ./ACN_backend_service/requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt
COPY ./ACN_backend_service /app
COPY ./docker/back/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
