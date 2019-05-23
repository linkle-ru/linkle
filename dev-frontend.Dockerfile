FROM node:alpine
WORKDIR /var/www/linkle.ru
COPY package.json .
RUN npm install
COPY . .
CMD [ "npm", "run", "dev:client" ]
