FROM httpd:2.4.59-alpine
WORKDIR /usr/local/apache2/htdocs/
COPY . .
EXPOSE 80
