import { Router } from 'express';
import { prisma } from '../../db/prisma';

const router = Router();

// Все бонусы
router.get('/', async (req, res) => {
  const bonuses = await prisma.bonus.findMany({
    include: { user_bonuses: { include: { user: { select: { username: true } } } } },
  });
  res.json(bonuses);
});

// Создать новый бонус
router.post('/', async (req, res) => {
  const { title, description, type, amount, percent, conditions, is_active, starts_at, ends_at } = req.body;

  const bonus = await prisma.bonus.create({
    data: { title, description, type, amount, percent, conditions, is_active, starts_at, ends_at },
  });

  await prisma.auditLog.create({
    data: {
      admin_id: req.user!.userId,
      action: `Created bonus "${title}"`,
      entity_type: 'bonus',
      entity_id: bonus.id,
    },
  });

  res.json(bonus);
});

// Обновить бонус
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const bonus = await prisma.bonus.update({ where: { id }, data });

  await prisma.auditLog.create({
    data: {
      admin_id: req.user!.userId,
      action: `Updated bonus "${bonus.title}"`,
      entity_type: 'bonus',
      entity_id: id,
    },
  });

  res.json(bonus);
});

// Удалить бонус
router.delete('/:id', async (req, res) => {
  const bonus = await prisma.bonus.delete({ where: { id: req.params.id } });

  await prisma.auditLog.create({
    data: {
      admin_id: req.user!.userId,
      action: `Deleted bonus "${bonus.title}"`,
      entity_type: 'bonus',
      entity_id: req.params.id,
    },
  });

  res.json({ success: true });
});

export default router;