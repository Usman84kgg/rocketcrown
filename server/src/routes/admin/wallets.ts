import { Router } from 'express';
import { prisma } from '../../db/prisma';
import QRCode from 'qrcode';

const router = Router();

router.get('/', async (req, res) => {
  const wallets = await prisma.cryptoCurrency.findMany();
  res.json(wallets);
});

router.post('/', async (req, res) => {
  const { code, name, network, address, min_deposit, min_withdrawal, bonus_percent, deposit_enabled } = req.body;
  const qr = await QRCode.toDataURL(address);
  const wallet = await prisma.cryptoCurrency.create({
    data: {
      code, name, network, address, qr_code: qr,
      min_deposit, min_withdrawal, bonus_percent, deposit_enabled,
    },
  });
  await prisma.auditLog.create({
    data: { admin_id: req.user!.userId, action: `Added wallet ${code}`, entity_type: 'crypto_currency', entity_id: wallet.id },
  });
  res.json(wallet);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updateData: any = { ...req.body };
  if (updateData.address) {
    updateData.qr_code = await QRCode.toDataURL(updateData.address);
  }
  const wallet = await prisma.cryptoCurrency.update({ where: { id }, data: updateData });
  await prisma.auditLog.create({
    data: { admin_id: req.user!.userId, action: `Updated wallet ${wallet.code}`, entity_type: 'crypto_currency', entity_id: id },
  });
  res.json(wallet);
});

router.delete('/:id', async (req, res) => {
  await prisma.cryptoCurrency.delete({ where: { id: req.params.id } });
  await prisma.auditLog.create({
    data: { admin_id: req.user!.userId, action: `Deleted wallet`, entity_type: 'crypto_currency', entity_id: req.params.id },
  });
  res.json({ success: true });
});

export default router;