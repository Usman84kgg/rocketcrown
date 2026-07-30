import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { prisma } from '../db/prisma';

const router = Router();

// Создать тикет
router.post('/tickets', authenticate, async (req, res) => {
  const { subject, message } = req.body;
  const ticket = await prisma.supportTicket.create({
    data: { user_id: req.user!.userId, subject, status: 'open' },
  });
  await prisma.supportMessage.create({
    data: { ticket_id: ticket.id, sender_id: req.user!.userId, sender_type: 'user', message },
  });
  res.json(ticket);
});

// Список тикетов пользователя
router.get('/tickets', authenticate, async (req, res) => {
  const tickets = await prisma.supportTicket.findMany({
    where: { user_id: req.user!.userId },
    orderBy: { created_at: 'desc' },
    include: { messages: { take: 1, orderBy: { created_at: 'desc' } } },
  });
  res.json(tickets);
});

// Сообщения тикета
router.get('/tickets/:id/messages', authenticate, async (req, res) => {
  const { id } = req.params;
  const ticket = await prisma.supportTicket.findFirst({
    where: { id, user_id: req.user!.userId },
  });
  if (!ticket) return res.status(404).json({ error: 'Not found' });
  const messages = await prisma.supportMessage.findMany({
    where: { ticket_id: id },
    orderBy: { created_at: 'asc' },
  });
  res.json(messages);
});

// Отправить сообщение
router.post('/tickets/:id/messages', authenticate, async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  const ticket = await prisma.supportTicket.findFirst({
    where: { id, user_id: req.user!.userId },
  });
  if (!ticket || ticket.status === 'closed') return res.status(400).json({ error: 'Cannot reply' });
  const msg = await prisma.supportMessage.create({
    data: { ticket_id: id, sender_id: req.user!.userId, sender_type: 'user', message },
  });
  res.json(msg);
});

export default router;