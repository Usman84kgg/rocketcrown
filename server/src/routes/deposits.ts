import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { prisma } from '../db/prisma';
import QRCode from 'qrcode';

const router = Router();

// Доступные валюты
router.get('/currencies', async (req, res) => {
  const currencies = await prisma.cryptoCurrency.findMany({
    where: { deposit_enabled: true },
    select: {
      id: true, code: true, name: true, network: true,
      min_deposit: true, bonus_percent: true, address: false,
    },
  });
  res.json(currencies);
});

// Создать заявку / показать адрес + QR
router.post('/request', authenticate, async (req, res) => {
  const { currency: currencyCode } = req.body;
  const crypto = await prisma.cryptoCurrency.findUnique({ where: { code: currencyCode } });
  if (!crypto || !crypto.deposit_enabled) {
    return res.status(400).json({ error: 'Currency not available' });
  }

  let qrBase64 = crypto.qr_code;
  if (!qrBase64 && crypto.address) {
    qrBase64 = await QRCode.toDataURL(crypto.address);
    await prisma.cryptoCurrency.update({ where: { id: crypto.id }, data: { qr_code: qrBase64 } });
  }

  const deposit = await prisma.depositRequest.create({
    data: {
      user_id: req.user!.userId,
      currency: crypto.code,
      network: crypto.network,
      wallet_address: crypto.address,
      status: 'created',
    },
  });

  res.json({
    deposit_id: deposit.id,
    currency: crypto.code,
    network: crypto.network,
    wallet_address: crypto.address,
    qr_code: qrBase64,
    min_deposit: crypto.min_deposit,
  });
});

// «Я оплатил»
router.post('/confirm-payment', authenticate, async (req, res) => {
  const { depositId } = req.body;
  const deposit = await prisma.depositRequest.findFirst({
    where: { id: depositId, user_id: req.user!.userId },
  });
  if (!deposit || deposit.status !== 'created') {
    return res.status(400).json({ error: 'Invalid deposit' });
  }
  await prisma.depositRequest.update({ where: { id: depositId }, data: { status: 'pending' } });
  res.json({ success: true });
});

// История депозитов
router.get('/history', authenticate, async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const deposits = await prisma.depositRequest.findMany({
    where: { user_id: req.user!.userId },
    orderBy: { created_at: 'desc' },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });
  const total = await prisma.depositRequest.count({ where: { user_id: req.user!.userId } });
  res.json({ data: deposits, total, page: Number(page), limit: Number(limit) });
});

export default router;