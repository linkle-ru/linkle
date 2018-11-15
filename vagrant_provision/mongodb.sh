#!/usr/bin/env bash

PROJECT_ROOT=$1
DB_NAME=$2

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
apt-get update
apt-get install -y mongodb-org

# меняем стандартный порт на нестандартный т.к. мы его пробрасываем
# наружу и чтобы не было конфликов с монгой на основной машине
sed -i "s/bindIp:.*/bindIp: 0.0.0.0/" /etc/mongod.conf

mkdir -p /data/db
chown vagrant /data/db

systemctl enable mongod.service
systemctl restart mongod
systemctl status mongod

#mongoimport --port=27017 --db ${DB_NAME} --collection patient --drop --file ${PROJECT_ROOT}/data/initial-patient.json
