#!/usr/bin/env bash

NGINX_ROOT=$1
VAGRANT_ROOT=$2
HOST_NAME=$3

usermod -aG www-data vagrant

# todo: в локейшенах захардкожены порты для проксирования

read -d '' NGINX_SITE <<EOF
server {
        listen 80;
        server_name ${HOST_NAME};
        root ${NGINX_ROOT}/${HOST_NAME}/source/gui;

        gzip on;
        gzip_disable "msie6";
        gzip_types text/plain text/css application/json application/x-javascript text/xml
        application/xml application/xml+rss text/javascript application/javascript;

        location ~ /api/ {
                proxy_pass http://localhost:8080;
                add_header Access-Control-Allow-Origin *;
                proxy_set_header Host \$host;
        }

        location ~* /[a-zа-я\d._-]+$/ {
                rewrite /(.*) /api/v1/follow/$1 break;
                proxy_pass http://localhost:8080;
                add_header Access-Control-Allow-Origin *;
                proxy_set_header Host \$host;
        }
}
EOF

# Create site & enable it
echo "${NGINX_SITE}" > /etc/nginx/sites-available/${HOST_NAME}
ln -sf /etc/nginx/sites-available/${HOST_NAME} /etc/nginx/sites-enabled/${HOST_NAME}

# Check enabled sites
egrep "server_name |root " /etc/nginx/sites-available/*

echo ">>> Restarting NGINX"
systemctl restart nginx.service
