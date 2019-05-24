FROM node:alpine
WORKDIR /var/www/linkle.ru
COPY package.json .
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "npm", "run", "dev:client" ]
