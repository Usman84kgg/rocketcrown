import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { prisma } from '../db/prisma';
import { createFinTransaction } from '../services/balanceService';

const router = Router();

// Заявка на вывод
router.post('/request', authenticate, async (req, res) => {
  const { currency, walletAddress, amount } = req.body;

  const crypto = await prisma.cryptoCurrency.findUnique({ where: { code: currency } });
  if (!crypto) return res.status(400).json({ error: 'Currency not supported' });
  if (Number(amount) < Number(crypto.min_withdrawal)) {
    return res.status(400).json({ error: `Minimum withdrawal: ${crypto.min_withdrawal}` });
  }

  // Проверка баланса
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user || Number(user.balance) < Number(amount) + 0.01) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }

  // Списываем сумму сразу (или после подтверждения — зависит от политики)
  // Здесь списываем сразу, а в админке владелец подтверждает отправку.
  await createFinTransaction({
    userId: req.user!.userId,
    type: 'withdrawal',
    amount: -Number(amount),
    currency,
    description: 'Withdrawal request',
  });

  const withdrawal = await prisma.withdrawalRequest.create({
    data: {
      user_id: req.user!.userId,
      currency,
      network: crypto.network,
      wallet_address: walletAddress,
      amount: Number(amount),
      status: 'pending',
    },
  });

  res.json({ success: true, withdrawal_id: withdrawal.id });
});

// История выводов
router.get('/history', authenticate, async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const withdrawals = await prisma.withdrawalRequest.findMany({
    where: { user_id: req.user!.userId },
    orderBy: { created_at: 'desc' },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });
  const total = await prisma.withdrawalRequest.count({ where: { user_id: req.user!.userId } });
  res.json({ data: withdrawals, total, page: Number(page), limit: Number(limit) });
});

export default router;