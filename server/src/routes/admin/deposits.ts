import { Router } from 'express';
import { prisma } from '../../db/prisma';
import { createFinTransaction } from '../../services/balanceService';

const router = Router();

// Список заявок на депозит
router.get('/', async (req, res) => {
  const { status, page = 1, limit = 50 } = req.query;
  const where: any = {};
  if (status) where.status = status;
  const deposits = await prisma.depositRequest.findMany({
    where,
    include: { user: { select: { id: true, username: true } } },
    orderBy: { created_at: 'desc' },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });
  const total = await prisma.depositRequest.count({ where });
  res.json({ data: deposits, total });
});

// Подтвердить/отклонить
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status, adminNote } = req.body; // 'confirmed' or 'rejected'

  const deposit = await prisma.depositRequest.findUnique({ where: { id } });
  if (!deposit || deposit.status !== 'pending') {
    return res.status(400).json({ error: 'Invalid deposit' });
  }

  await prisma.$transaction(async (tx) => {
    await prisma.depositRequest.update({
      where: { id },
      data: { status, admin_id: req.user!.userId, admin_note: adminNote, confirmed_at: new Date() },
    });

    if (status === 'confirmed' && deposit.amount) {
      await createFinTransaction({
        userId: deposit.user_id,
        type: 'deposit',
        amount: Number(deposit.amount),
        currency: deposit.currency,
        referenceType: 'deposit_request',
        referenceId: id,
        description: `Deposit confirmed: ${deposit.amount} ${deposit.currency}`,
      });

      // Apply deposit bonus
      const crypto = await prisma.cryptoCurrency.findUnique({ where: { code: deposit.currency } });
      if (crypto && Number(crypto.bonus_percent) > 0) {
        const bonusAmount = Number(deposit.amount) * Number(crypto.bonus_percent) / 100;
        await createFinTransaction({
          userId: deposit.user_id,
          type: 'bonus',
          amount: bonusAmount,
          currency: deposit.currency,
          description: `Deposit bonus ${crypto.bonus_percent}%`,
        });
      }
    }

    await prisma.auditLog.create({
      data: {
        admin_id: req.user!.userId,
        action: `Deposit ${status}`,
        entity_type: 'deposit_request',
        entity_id: id,
        details: { note: adminNote },
      },
    });
  });

  res.json({ success: true });
});

export default router;