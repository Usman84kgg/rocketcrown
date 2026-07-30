#!/bin/bash
set -e

echo "=============================="
echo "  Rocket Crown — автостарт"
echo "=============================="

# секреты
JWT_SECRET="auto-generated-key-$(date +%s)"
BOT_TOKEN="test_bot_token"

# .env сервера
cat > server/.env << EOF
DATABASE_URL="${DATABASE_URL}"
JWT_SECRET="${JWT_SECRET}"
BOT_TOKEN="${BOT_TOKEN}"
CLIENT_URL="*"
PORT=3001
EOF

# .env клиента
cat > client/.env << EOF
VITE_API_URL=/api
VITE_WS_URL=/
EOF

echo "✅ .env созданы"

# сервер
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init || echo "Миграции уже есть"
npm run seed
nohup npm run dev > /tmp/server.log 2>&1 &

# клиент
cd ../client
npm install
nohup npm run dev -- --host 0.0.0.0 > /tmp/client.log 2>&1 &

echo ""
echo "==================================="
echo "  ГОТОВО!"
echo "==================================="
echo "Порт 5173 уже открыт публично."
echo "Скопируй URL из вкладки PORTS и открой в браузере."