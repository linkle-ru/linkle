FROM node:10.15.3-alpine AS base
WORKDIR /var/www/linkle.ru
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD node source/server.js

FROM node:10.15.3-alpine AS inspect
WORKDIR /var/www/linkle.ru
COPY --from=base /var/www/linkle.ru/ ./
RUN npm install nodemon -g
EXPOSE 9229
CMD nodemon --inspect=0.0.0.0 --watch source source/server.js

FROM nginx:1.16.0-alpine as nginx
COPY nginx/default.conf /etc/nginx/conf.d/
COPY --from=base /var/www/linkle.ru/source/gui /var/www/linkle.ru/source/gui
