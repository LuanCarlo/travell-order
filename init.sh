#!/usr/bin/env bash
set -e

# Build e subir os containers
docker compose build --no-cache
docker compose up -d

echo "Aguardando banco iniciar..."
sleep 15

# Gerar .env, key e migrar (ajuste se já existir .env)
docker cp travell-order-api/.env.example travell-order-php:/var/www/.env
docker exec -it travell-order-php bash -lc "php artisan key:generate"
docker exec -it travell-order-php bash -lc "php artisan jwt:secret"
docker exec -it travell-order-php bash -lc "php artisan migrate --force"