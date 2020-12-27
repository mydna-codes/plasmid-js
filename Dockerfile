FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html
COPY app .

EXPOSE 4200
CMD ["/bin/sh", "-c", "exec nginx -g 'daemon off;'"]