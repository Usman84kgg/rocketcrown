import { prisma } from '../db/prisma';
import { createFinTransaction } from './balanceService';
import crypto from 'crypto';

interface GameModule {
  slug: string;
  minBet: number;
  maxBet: number;
  execute(bet: number, seed: string, params?: any): Promise<{ multiplier: number; winAmount: number; resultData: object }>;
}

const gameModules = new Map<string, GameModule>();

export function registerGame(module: GameModule) {
  gameModules.set(module.slug, module);
}

export async function playRound(userId: string, gameSlug: string, bet: number, params?: any) {
  const game = await prisma.game.findUnique({ where: { slug: gameSlug } });
  if (!game || !game.is_active) throw new Error('Game not found or disabled');

  const module = gameModules.get(gameSlug);
  if (!module) throw new Error('Game engine not found');

  if (bet < Number(game.min_bet) || bet > Number(game.max_bet)) throw new Error('Bet out of range');

  // Списываем ставку
  await createFinTransaction({
    userId,
    type: 'bet',
    amount: -bet,
    currency: 'TON',
  });

  const seed = crypto.randomBytes(32).toString('hex');
  const { multiplier, winAmount, resultData } = await module.execute(bet, seed, params);

  // Начисление выигрыша
  if (winAmount > 0) {
    await createFinTransaction({
      userId,
      type: 'win',
      amount: winAmount,
      currency: 'TON',
    });
  }

  // Запись раунда
  const round = await prisma.gameRound.create({
    data: {
      game_id: game.id,
      user_id: userId,
      bet_amount: bet,
      multiplier,
      win_amount: winAmount,
      result_data: resultData,
      status: 'completed',
      completed_at: new Date(),
    },
  });

  // Лента активности
  if (winAmount > 0) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    await prisma.activityFeed.create({
      data: {
        user_id: userId,
        username_display: user?.username || 'Anon',
        game_name: game.name,
        win_amount: winAmount,
        currency: 'TON',
      },
    });
  }

  return { roundId: round.id, multiplier, winAmount, resultData };
}

// Пример игры CRASH
registerGame({
  slug: 'crash',
  minBet: 0.1,
  maxBet: 1000,
  async execute(bet, seed) {
    const hash = crypto.createHash('sha256').update(seed).digest('hex');
    const r = parseInt(hash.substring(0, 8), 16) / 0xffffffff;
    // Крэш-точка от 1 до бесконечности с вероятностным распределением
    const crashPoint = Math.max(1, Math.floor((1 / (1 - r * 0.99)) * 100) / 100);
    const multiplier = crashPoint >= 1 ? crashPoint : 0;
    const winAmount = bet * multiplier;
    return { multiplier, winAmount, resultData: { crashPoint } };
  },
});

// MINES
registerGame({
  slug: 'mines',
  minBet: 0.1,
  maxBet: 500,
  async execute(bet, seed) {
    // упрощённо: 3 мины из 25 клеток, открыта 1 клетка
    const winAmount = bet * 1.2; // placeholder
    return { multiplier: 1.2, winAmount, resultData: { selected: [0], mines: [3,7,12] } };
  },
});