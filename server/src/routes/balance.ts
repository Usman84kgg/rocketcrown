import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { prisma } from '../db/prisma';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { balance: true, display_currency: true },
  });
  res.json(user);
});

export default router;