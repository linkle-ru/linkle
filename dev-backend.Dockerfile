FROM node:alpine
RUN npm install nodemon -g
WORKDIR /var/www/linkle.ru
COPY package.json .
RUN npm install
COPY . .
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait
EXPOSE 8000
CMD /wait && nodemon --watch source source/server.js
