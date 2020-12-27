FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html
COPY app .

EXPOSE 80
CMD ["/bin/sh", "-c", "exec nginx -g 'daemon off;'"]