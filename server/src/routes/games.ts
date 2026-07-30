import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { prisma } from '../db/prisma';
import { playRound } from '../services/gameEngine';

const router = Router();

// Список игр (с фильтрами)
router.get('/', async (req, res) => {
  const { category, search, is_active } = req.query;
  const where: any = {};
  if (category) where.category = category;
  if (is_active !== undefined) where.is_active = is_active === 'true';
  if (search && typeof search === 'string') {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const games = await prisma.game.findMany({
    where,
    select: {
      id: true, name: true, slug: true, category: true,
      image_url: true, min_bet: true, max_bet: true, is_active: true,
    },
  });
  res.json(games);
});

// Запуск игры
router.post('/:slug/play', authenticate, async (req, res) => {
  const { slug } = req.params;
  const { bet } = req.body;

  try {
    const result = await playRound(req.user!.userId, slug, Number(bet));
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;