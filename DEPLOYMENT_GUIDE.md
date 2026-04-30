# Полная инструкция по деплою Next.js приложения

## 📋 Что нужно сделать

### Шаг 1: Подготовка сервера (делается один раз)

1. **Подключитесь к серверу**:
```bash
ssh root@149.154.71.226
```

2. **Установите необходимое ПО**:
```bash
# Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# PM2
npm install -g pm2

# Nginx
apt install -y nginx

# GitLab Runner (если используете GitLab CI/CD)
curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | bash
apt install gitlab-runner
```

3. **Настройте Nginx**:
```bash
# Запустите скрипт настройки с вашего компьютера
./setup-nginx.bat
# ИЛИ вручную:
# 1. Загрузите nginx.conf на сервер: scp nginx.conf root@149.154.71.226:/tmp/
# 2. На сервере: cp /tmp/nginx.conf /etc/nginx/sites-available/moon-flowers
# 3. ln -s /etc/nginx/sites-available/moon-flowers /etc/nginx/sites-enabled/
# 4. nginx -t && systemctl restart nginx
```

4. **Настройте PM2 автозапуск**:
```bash
pm2 startup
pm2 save
```

### Шаг 2: Деплой приложения

#### Способ A: Ручной деплой
```bash
# 1. Сборка проекта
npm run build

# 2. Создание архива
tar -czf deploy.tar.gz .next public package.json package-lock.json next.config.ts .env.production

# 3. Загрузка на сервер
scp deploy.tar.gz root@149.154.71.226:/tmp/

# 4. На сервере
ssh root@149.154.71.226
cd /tmp
mkdir -p /var/www/moon-flowers
tar -xzf deploy.tar.gz -C /var/www/moon-flowers
cd /var/www/moon-flowers
npm ci --production
pm2 restart moon-flowers || pm2 start npm --name moon-flowers -- start
pm2 save
```

#### Способ B: GitLab CI/CD (рекомендуется)
1. Настройте `.gitlab-ci.yml` в проекте
2. Зарегистрируйте GitLab Runner на сервере:
```bash
gitlab-runner register
# URL: https://gitlab.com/
# Token: из Settings → CI/CD → Runners
# Tags: clever-runner
# Executor: shell
```

3. Делайте push в ветку `main`:
```bash
git push origin main
```

### Шаг 3: Проверка работы

1. **Проверьте статус PM2**:
```bash
pm2 status
pm2 logs moon-flowers
```

2. **Проверьте Nginx**:
```bash
systemctl status nginx
nginx -t
```

3. **Откройте в браузере**:
```
http://149.154.71.226
```

## 🌐 Подключение домена (опционально)

1. **Купите домен** на reg.ru, nic.ru и т.д.
2. **Настройте DNS** в панели регистратора:
   - Добавьте A-запись: `@` → `149.154.71.226`
   - Добавьте A-запись: `www` → `149.154.71.226`
3. **Обновите nginx.conf**:
```nginx
server_name ваш-домен.ru www.ваш-домен.ru 149.154.71.226;
```
4. **Настройте SSL** (рекомендуется):
```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru
```

## 🔧 Полезные команды

### PM2
```bash
pm2 list                    # Список процессов
pm2 logs moon-flowers       # Логи приложения
pm2 restart moon-flowers    # Перезапуск
pm2 stop moon-flowers       # Остановка
pm2 delete moon-flowers     # Удаление процесса
```

### Nginx
```bash
systemctl status nginx      # Статус
systemctl restart nginx     # Перезапуск
nginx -t                    # Проверка конфигурации
tail -f /var/log/nginx/error.log  # Логи ошибок
```

## 🚨 Troubleshooting

### Приложение не запускается
```bash
pm2 logs moon-flowers --lines 100
```

### Nginx показывает 502 Bad Gateway
```bash
# Проверьте, запущено ли приложение
pm2 status

# Проверьте порт
netstat -tulpn | grep 3000
```

### Нет доступа к серверу
```bash
# Проверьте SSH
ssh -v root@149.154.71.226

# Проверьте firewall
ufw status
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
```

## 🔒 Безопасность (рекомендации)

1. **Смените пароль root**:
```bash
passwd
```

2. **Создайте отдельного пользователя**:
```bash
adduser deploy
usermod -aG sudo deploy
```

3. **Настройте firewall**:
```bash
ufw enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
```

4. **Отключите вход по паролю** (после настройки SSH ключей):
```bash
nano /etc/ssh/sshd_config
# PasswordAuthentication no
systemctl restart sshd
```