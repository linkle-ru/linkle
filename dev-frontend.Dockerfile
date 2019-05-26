FROM node:alpine
WORKDIR /var/www/linkle.ru
COPY . .
RUN npm install
EXPOSE 8080
CMD [ "npm", "run", "dev:client" ]
