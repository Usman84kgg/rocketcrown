# Rocket Crown Casino — Telegram Mini App + Web

Премиум крипто-казино с поддержкой Telegram Mini Apps, веб-версией и админ-панелью.

## Стек

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Telegram WebApp SDK
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, Socket.IO
- **База:** PostgreSQL 15
- **Кэш:** Redis (опционально, можно без)
- **Депозиты/Выводы:** ручное подтверждение владельцем (BTC, LTC, TRX, BNB, TON, SOL, USDT TRC20/ERC20/BEP20/TON)

## Установка и запуск

### 1. Клонировать

\`\`\`bash
git clone https://github.com/your-username/rocket-crown.git
cd rocket-crown
\`\`\`

### 2. Настроить переменные окружения

Создать `server/.env` (см. [.env.example](#env))

### 3. Установить зависимости

\`\`\`bash
# сервер
cd server
npm install
npx prisma migrate dev --name init
npm run seed  # заполнить начальные данные

# клиент
cd ../client
npm install
\`\`\`

### 4. Запустить

\`\`\`bash
# сервер (http://localhost:3001)
cd server
npm run dev

# клиент (http://localhost:5173)
cd client
npm run dev
\`\`\`

Telegram Mini App смотрит на ваш URL (настройте бота на этот адрес).

## Структура

\`\`\`
rocket-crown/
├── client/        # React SPA (Telegram Mini App + Web)
├── server/        # Express API + Prisma + Socket.IO
├── .gitignore
└── README.md
\`\`\`

## Telegram Mini App

1. Создайте бота в @BotFather
2. В настройках бота укажите Mini App URL (ваш домен или ngrok)
3. В `client/.env` укажите `VITE_BOT_USERNAME` и `VITE_API_URL`

## Админ-панель

Владелец (`role='owner'`) заходит по тому же URL, но видит расширенное меню и панель управления.
Поддержка (`role='support'`) видит только чат и тикеты.
Владелец создаётся seed-скриптом; остальные роли назначает владелец через админку.

## API документация

Вся документация по эндпоинтам доступна после запуска по адресу `/api/docs` (Swagger).

## Лицензия

Проприетарная. Все права защищены.