#!/bin/bash
set -e

echo "=============================="
echo "  Rocket Crown — веб-запуск"
echo "=============================="

# 1. База данных
echo ""
echo "Скопируй и вставь DATABASE_URL из Neon.tech:"
read -r DATABASE_URL

# JWT секрет генерируем сами
JWT_SECRET=$(openssl rand -hex 32)
BOT_TOKEN="test_token"

# 2. .env сервера
cat > server/.env << ENVEOF
DATABASE_URL="${DATABASE_URL}"
JWT_SECRET="${JWT_SECRET}"
BOT_TOKEN="${BOT_TOKEN}"
CLIENT_URL="*"
PORT=3001
ENVEOF

# 3. .env клиента
cat > client/.env << ENVEOF
VITE_API_URL=/api
VITE_WS_URL=/
ENVEOF

echo ""
echo "✅ .env файлы созданы"

# 4. Сервер
echo "⏳ Устанавливаю сервер..."
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
cd ..

# 5. Клиент
echo "⏳ Устанавливаю клиент..."
cd client
npm install
cd ..

# 6. Запуск сервера
echo "🚀 Сервер (порт 3001)..."
cd server
nohup npm run dev > /tmp/server.log 2>&1 &
cd ..

# 7. Запуск клиента
echo "🎮 Клиент (порт 5173)..."
cd client
nohup npm run dev -- --host 0.0.0.0 > /tmp/client.log 2>&1 &
cd ..

echo ""
echo "==================================="
echo "  ГОТОВО! Действия:"
echo "==================================="
echo ""
echo "1. Открой вкладку PORTS"
echo "2. Нажми на порт 5173 → сделай Public"
echo "3. Скопируй URL и открой в браузере"
echo "4. Логин владельца:"
echo "   Email: admin@rocketcrown.com"
echo "   Пароль: admin123"
echo ""
echo "Или зарегистрируй нового пользователя прямо на сайте."
echo "==================================="