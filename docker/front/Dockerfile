FROM node:14-alpine as build
WORKDIR /app
COPY ./ACN_frontend_service/package.json ./
COPY ./ACN_frontend_service/package-lock.json ./
RUN npm install
RUN npm install react-scripts -g
COPY ./ACN_frontend_service ./
