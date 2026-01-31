#!/bin/sh
set -e

# Esperar a que Postgres acepte conexiones (redundante con depends_on, pero útil si se arranca solo el app)
until php -r "
  try {
    \$pdo = new PDO(
      'pgsql:host=${DB_HOST};port=${DB_PORT};dbname=${DB_DATABASE}',
      '${DB_USERNAME}',
      '${DB_PASSWORD}',
      [PDO::ATTR_TIMEOUT => 2]
    );
    exit(0);
  } catch (Throwable \$e) {
    exit(1);
  }
" 2>/dev/null; do
  echo "Esperando PostgreSQL..."
  sleep 2
done

cd /var/www/html
# Generar APP_KEY si no existe (persiste en .env montado)
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "base64:" ]; then
  php artisan key:generate --force --no-interaction
fi
php artisan config:cache --no-interaction || true
php artisan route:cache --no-interaction || true
php artisan view:cache --no-interaction || true
php artisan migrate --force --no-interaction

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
