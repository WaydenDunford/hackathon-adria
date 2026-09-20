FROM node:22-bookworm-slim AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM php:8.3-apache-bookworm
RUN apt-get update && apt-get install -y --no-install-recommends libpq-dev libonig-dev unzip git \
    && docker-php-ext-install pdo_pgsql mbstring opcache \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
WORKDIR /var/www/html
COPY . .
RUN composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction \
    && chown -R www-data:www-data storage bootstrap/cache
COPY --from=frontend /app/public/build ./public/build
COPY deploy/apache.conf /etc/apache2/sites-available/000-default.conf
COPY deploy/start.sh /usr/local/bin/favia-start
RUN chmod +x /usr/local/bin/favia-start
ENV APP_ENV=production APP_DEBUG=false SESSION_DRIVER=database SESSION_SECURE_COOKIE=true CACHE_STORE=file LOG_CHANNEL=stderr
EXPOSE 80
CMD ["favia-start"]
