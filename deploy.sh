#!/bin/bash

# Конфигурация
SERVER_IP="149.154.71.226"
SERVER_USER="root"
APP_DIR="/var/www/moon-flowers"
APP_NAME="moon-flowers"

echo "🚀 Starting deployment to $SERVER_IP..."

# 1. Сборка проекта локально
echo "📦 Building project..."
npm run build

# 2. Создание архива
echo "📦 Creating archive..."
tar -czf deploy.tar.gz .next public package.json package-lock.json next.config.ts .env.production

# 3. Копирование на сервер
echo "📤 Uploading to server..."
scp deploy.tar.gz $SERVER_USER@$SERVER_IP:/tmp/

# 4. Деплой на сервере
echo "🔧 Deploying on server..."
ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'
cd /tmp
mkdir -p /var/www/moon-flowers
tar -xzf deploy.tar.gz -C /var/www/moon-flowers
cd /var/www/moon-flowers
npm ci --production
pm2 restart moon-flowers || pm2 start npm --name moon-flowers -- start
pm2 save
rm /tmp/deploy.tar.gz
ENDSSH

# 5. Очистка
echo "🧹 Cleaning up..."
rm deploy.tar.gz

echo "✅ Deployment completed successfully!"
echo "🌐 Your app is running at http://$SERVER_IP"
