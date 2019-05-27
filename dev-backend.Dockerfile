FROM node:alpine
WORKDIR /var/www/linkle.ru
COPY . .
RUN npm install
RUN npm install nodemon -g
EXPOSE 8000
CMD nodemon --inspect=0.0.0.0 --watch source source/server.js
