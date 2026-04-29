# Инструкция по деплою на VPS сервер

## Данные сервера

- **IP**: 149.154.71.226
- **Пользователь**: root
- **Пароль**: b$4~O%QK_w

## Способ 1: GitLab CI/CD (рекомендуется)

### Подготовка сервера

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

# GitLab Runner
curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | bash
apt install gitlab-runner
```

3. **Зарегистрируйте GitLab Runner**:

```bash
gitlab-runner register
```

- URL: https://gitlab.com/
- Token: (из Settings → CI/CD → Runners)
- Tags: `clever-runner`
- Executor: `shell`

4. **Настройте Nginx**:

```bash
# Скопируйте nginx.conf на сервер
nano /etc/nginx/sites-available/moon-flowers
# Вставьте содержимое из nginx.conf

ln -s /etc/nginx/sites-available/moon-flowers /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

5. **Настройте PM2 автозапуск**:

```bash
pm2 startup
pm2 save
```

### Деплой через GitLab

После настройки просто делайте push в ветку `main`:

```bash
git push origin main
```

GitLab автоматически соберет и задеплоит приложение.

---

## Способ 2: Ручной деплой через SSH

### Подготовка

1. **Сделайте скрипт исполняемым**:

```bash
chmod +x deploy.sh
```

2. **Настройте SSH ключи** (опционально, для деплоя без пароля):

```bash
ssh-keygen -t rsa -b 4096
ssh-copy-id root@149.154.71.226
```

### Деплой

Запустите скрипт:

```bash
./deploy.sh
```

Скрипт автоматически:

- Соберет проект
- Создаст архив
- Загрузит на сервер
- Установит зависимости
- Перезапустит приложение

---

## Способ 3: Ручной деплой (пошагово)

### На локальной машине:

```bash
# 1. Сборка
npm run build

# 2. Создание архива
tar -czf deploy.tar.gz .next public package.json package-lock.json next.config.ts .env.production

# 3. Загрузка на сервер
scp deploy.tar.gz root@149.154.71.226:/tmp/
```

### На сервере:

```bash
# 1. Подключение
ssh root@149.154.71.226

# 2. Распаковка
cd /tmp
mkdir -p /var/www/moon-flowers
tar -xzf deploy.tar.gz -C /var/www/moon-flowers

# 3. Установка зависимостей
cd /var/www/moon-flowers
npm ci --production

# 4. Запуск/перезапуск
pm2 restart moon-flowers || pm2 start npm --name moon-flowers -- start
pm2 save
```

---

## Проверка работы

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

---

## Настройка домена (опционально)

Если у вас есть домен:

1. **Добавьте A-запись** в DNS:

```
A  @  149.154.71.226
```

2. **Обновите nginx.conf**:

```nginx
server_name ваш-домен.ru www.ваш-домен.ru;
```

3. **Установите SSL (Let's Encrypt)**:

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru
```

---

## Полезные команды

### PM2

```bash
pm2 list                    # Список процессов
pm2 logs moon-flowers       # Логи приложения
pm2 restart moon-flowers    # Перезапуск
pm2 stop moon-flowers       # Остановка
pm2 delete moon-flowers     # Удаление процесса
pm2 monit                   # Мониторинг
```

### Nginx

```bash
systemctl status nginx      # Статус
systemctl restart nginx     # Перезапуск
nginx -t                    # Проверка конфигурации
tail -f /var/log/nginx/error.log  # Логи ошибок
```

### Системные ресурсы

```bash
htop                        # Мониторинг системы
df -h                       # Дисковое пространство
free -h                     # Память
```

---

## Troubleshooting

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

---

## Безопасность

### Рекомендации:

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

5. **Настройте автообновления**:

```bash
apt install unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades
```
