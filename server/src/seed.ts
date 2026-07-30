import { prisma } from './db/prisma';
import bcrypt from 'bcryptjs';

async function seed() {
  // Создать владельца
  const owner = await prisma.user.create({
    data: {
      username: 'owner',
      email: 'admin@rocketcrown.com',
      password_hash: bcrypt.hashSync('admin123', 10),
      balance: 0,
      first_name: 'Admin',
      last_name: 'Owner',
    },
  });
  await prisma.userRole.create({ data: { user_id: owner.id, role: 'owner' } });

  // Создать пару игр
  await prisma.game.createMany({
    data: [
      { name: 'CRASH', slug: 'crash', category: 'crash', is_active: true, min_bet: 0.1, max_bet: 1000, image_url: '/games/crash.png' },
      { name: 'MINES', slug: 'mines', category: 'mini', is_active: true, min_bet: 0.1, max_bet: 500, image_url: '/games/mines.png' },
      { name: 'PLINKO', slug: 'plinko', category: 'mini', is_active: true, min_bet: 0.1, max_bet: 300, image_url: '/games/plinko.png' },
    ],
  });

  // Валюты
  await prisma.cryptoCurrency.createMany({
    data: [
      { code: 'TON', name: 'Toncoin', network: 'TON', address: 'TON_ADDRESS_PLACEHOLDER', min_deposit: 0.2, min_withdrawal: 0.2, bonus_percent: 7 },
      { code: 'USDT', name: 'Tether TRC20', network: 'TRC20', address: 'USDT_TRC20_ADDRESS', min_deposit: 10, min_withdrawal: 10, bonus_percent: 5 },
      { code: 'USDT', name: 'Tether BEP20', network: 'BEP20', address: 'USDT_BEP20_ADDRESS', min_deposit: 10, min_withdrawal: 10, bonus_percent: 5 },
      { code: 'BTC', name: 'Bitcoin', network: 'BTC', address: 'BTC_ADDRESS', min_deposit: 0.001, min_withdrawal: 0.001, bonus_percent: 5 },
    ],
  });

  // Бонусы
  await prisma.bonus.create({
    data: {
      title: 'Welcome Bonus',
      description: '250 FS за регистрацию',
      type: 'welcome',
      amount: 0,
      is_active: true,
    },
  });

  console.log('Seed completed');
}

seed().catch(e => console.error(e)).finally(() => prisma.$disconnect());