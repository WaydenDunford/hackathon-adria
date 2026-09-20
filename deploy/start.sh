#!/bin/sh
set -eu
: "${APP_KEY:?Set a persistent Laravel APP_KEY before starting}"
: "${APP_URL:?Set APP_URL to the production HTTPS URL}"
: "${DB_HOST:?Set DB_HOST to the PostgreSQL host}"
if [ "${APP_DEBUG:-false}" != "false" ]; then
    echo "APP_DEBUG must be false in production" >&2
    exit 1
fi
if [ "${PORT:-80}" != "80" ]; then
    sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
    sed -i "s/\*:80/*:${PORT}/" /etc/apache2/sites-available/000-default.conf
fi
php artisan config:cache
php artisan route:cache
exec apache2-foreground
