FROM --platform=linux/amd64 nginx:1.25

COPY ./conf.d /etc/nginx/conf.d

COPY ./frontend /usr/share/nginx/html

WORKDIR /app
