// admin/games.ts
import { Router } from 'express';
import { prisma } from '../../db/prisma';
const router = Router();

router.put('/:id/toggle', async (req, res) => {
  const game = await prisma.game.findUnique({ where: { id: req.params.id } });
  if (!game) return res.status(404).json({ error: 'Not found' });
  const updated = await prisma.game.update({ where: { id: req.params.id }, data: { is_active: !game.is_active } });
  await prisma.auditLog.create({ data: { admin_id: req.user!.userId, action: `Toggled game ${game.name} to ${updated.is_active}` } });
  res.json(updated);
});

// Аналогично для bonuses и promos — CRUD с аудитом
export default router;