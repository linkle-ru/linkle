#!/usr/bin/env bash

PROJECT_ROOT=$1
DB_NAME=$2

apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
echo "deb http://repo.mongodb.org/apt/debian stretch/mongodb-org/4.0 main" | tee /etc/apt/sources.list.d/mongodb-org-4.0.list
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
