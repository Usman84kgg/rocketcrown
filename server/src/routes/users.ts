import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { prisma } from '../db/prisma';

const router = Router();

router.get('/me', authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      id: true,
      telegram_id: true,
      username: true,
      first_name: true,
      last_name: true,
      avatar_url: true,
      phone: true,
      email: true,
      balance: true,
      display_currency: true,
      status: true,
      registered_at: true,
      last_login: true,
    },
  });
  res.json(user);
});

router.put('/me/phone', authenticate, async (req, res) => {
  const { phone } = req.body;
  await prisma.user.update({ where: { id: req.user!.userId }, data: { phone } });
  res.json({ success: true });
});

router.put('/me/password', authenticate, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user || !user.password_hash || !bcrypt.compareSync(oldPassword, user.password_hash)) {
    return res.status(400).json({ error: 'Invalid old password' });
  }
  await prisma.user.update({
    where: { id: req.user!.userId },
    data: { password_hash: bcrypt.hashSync(newPassword, 10) },
  });
  res.json({ success: true });
});

router.get('/me/transactions', authenticate, async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const transactions = await prisma.finTransaction.findMany({
    where: { user_id: req.user!.userId },
    orderBy: { created_at: 'desc' },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });
  const total = await prisma.finTransaction.count({ where: { user_id: req.user!.userId } });
  res.json({ data: transactions, total, page: Number(page), limit: Number(limit) });
});

router.get('/me/bonuses', authenticate, async (req, res) => {
  const bonuses = await prisma.userBonus.findMany({
    where: { user_id: req.user!.userId },
    include: { bonus: true },
  });
  res.json(bonuses);
});

export default router;