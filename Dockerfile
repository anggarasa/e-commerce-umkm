# Stage 1: Build assets (needs both PHP and Node.js for wayfinder plugin)
FROM php:8.4-cli-alpine AS asset-builder

# Install Node.js and npm
RUN apk add --no-cache nodejs npm

# Install PHP extensions needed for artisan commands
RUN apk add --no-cache \
    libzip-dev \
    icu-dev \
    oniguruma-dev \
    && docker-php-ext-install \
    pdo_mysql \
    mbstring \
    intl \
    zip \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd


# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy composer files and install dependencies first
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copy package files and install npm dependencies
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Run composer autoload
RUN composer dump-autoload --optimize

# Build assets with SSR (now PHP is available for wayfinder plugin)
RUN npm run build:ssr

# Stage 2: Production image
FROM php:8.4-fpm-alpine

# Install system dependencies including Node.js for SSR
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    icu-dev \
    oniguruma-dev \
    libxml2-dev \
    curl-dev \
    linux-headers \
    nodejs

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        intl \
        opcache \
        xml \
        curl

# Install Redis extension
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

# Configure PHP
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Copy PHP configuration
COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/opcache.ini
COPY docker/php/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY docker/php/www.conf /usr/local/etc/php-fpm.d/www.conf

# Copy nginx configuration
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf

# Copy supervisor configuration
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Set working directory
WORKDIR /var/www/html

# Copy application files from asset-builder
COPY --from=asset-builder /app/vendor ./vendor
COPY --from=asset-builder /app/public/build ./public/build
COPY --from=asset-builder /app/bootstrap/ssr ./bootstrap/ssr
COPY . .

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Create necessary directories
RUN mkdir -p /var/log/supervisor /run/nginx

# Copy and setup entrypoint script
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Healthcheck using simple PHP file (doesn't require Laravel bootstrap)
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl --silent --fail http://127.0.0.1:80/health.php || exit 1

# Expose port
EXPOSE 80

# Use entrypoint for runtime setup, then start supervisor
ENTRYPOINT ["/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
