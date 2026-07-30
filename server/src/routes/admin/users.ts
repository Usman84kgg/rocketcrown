import { Router } from 'express';
import { prisma } from '../../db/prisma';
import { createFinTransaction } from '../../services/balanceService';

const router = Router();

// Все пользователи
router.get('/', async (req, res) => {
  const { page = 1, limit = 50, search } = req.query;
  const where: any = {};
  if (search && typeof search === 'string') {
    where.OR = [
      { username: { contains: search, mode: 'insensitive' } },
      { first_name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }
  const users = await prisma.user.findMany({
    where,
    select: {
      id: true, telegram_id: true, username: true, first_name: true, last_name: true,
      email: true, balance: true, status: true, registered_at: true, last_login: true,
    },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    orderBy: { registered_at: 'desc' },
  });
  const total = await prisma.user.count({ where });
  res.json({ data: users, total });
});

// Ручное изменение баланса
router.put('/:id/balance', async (req, res) => {
  const { id } = req.params;
  const { amount, reason } = req.body; // amount может быть отрицательным

  await createFinTransaction({
    userId: id,
    type: 'manual_adjustment',
    amount: Number(amount),
    currency: 'TON',
    description: `Admin adjustment: ${reason || 'manual'}`,
  });

  await prisma.auditLog.create({
    data: {
      admin_id: req.user!.userId,
      action: `Balance adjustment ${amount} for user ${id}`,
      entity_type: 'user',
      entity_id: id,
      details: { reason },
    },
  });

  res.json({ success: true });
});

// Блокировка/разблокировка
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'active' or 'blocked'
  await prisma.user.update({ where: { id }, data: { status } });
  await prisma.auditLog.create({
    data: { admin_id: req.user!.userId, action: `User ${id} status changed to ${status}`, entity_type: 'user', entity_id: id },
  });
  res.json({ success: true });
});

// Профиль пользователя (подробный)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      transactions: { orderBy: { created_at: 'desc' }, take: 50 },
      deposit_requests: { orderBy: { created_at: 'desc' }, take: 20 },
      withdrawal_requests: { orderBy: { created_at: 'desc' }, take: 20 },
      roles: true,
    },
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

export default router;