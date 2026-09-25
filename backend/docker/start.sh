#!/bin/sh

set -e

php artisan config:clear
php artisan migrate --force
php artisan db:seed --force

php-fpm -D

nginx -g "daemon off;"
