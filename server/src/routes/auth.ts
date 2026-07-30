import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../db/prisma';
import { verifyTelegramInitData, parseTelegramUser } from '../services/telegramService';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Telegram Mini App вход/регистрация
router.post('/telegram', async (req, res) => {
  const { initData } = req.body;
  if (!initData) return res.status(400).json({ error: 'No initData' });

  if (!verifyTelegramInitData(initData, process.env.BOT_TOKEN!)) {
    return res.status(403).json({ error: 'Invalid Telegram data' });
  }

  const tgUser = parseTelegramUser(initData);
  if (!tgUser) return res.status(400).json({ error: 'No user data' });

  let user = await prisma.user.findUnique({ where: { telegram_id: tgUser.id } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        telegram_id: tgUser.id,
        username: tgUser.username || `user_${tgUser.id}`,
        first_name: tgUser.first_name || '',
        last_name: tgUser.last_name || '',
        avatar_url: tgUser.photo_url || '',
        last_login: new Date(),
      },
    });
    await prisma.userRole.create({ data: { user_id: user.id, role: 'user' } });
    // welcome bonus
    const welcomeBonus = await prisma.bonus.findFirst({ where: { type: 'welcome', is_active: true } });
    if (welcomeBonus) {
      await prisma.userBonus.create({
        data: { user_id: user.id, bonus_id: welcomeBonus.id, status: 'active' },
      });
    }
  } else {
    await prisma.user.update({ where: { id: user.id }, data: { last_login: new Date() } });
  }

  const token = jwt.sign({ userId: user.id, role: 'user' }, process.env.JWT_SECRET!, { expiresIn: '7d' });

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      avatar_url: user.avatar_url,
      balance: user.balance,
      first_name: user.first_name,
      last_name: user.last_name,
    },
  });
});

// Веб-регистрация
router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: 'Email already exists' });

  const password_hash = bcrypt.hashSync(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password_hash,
      username: username || email,
      last_login: new Date(),
    },
  });
  await prisma.userRole.create({ data: { user_id: user.id, role: 'user' } });

  const token = jwt.sign({ userId: user.id, role: 'user' }, process.env.JWT_SECRET!, { expiresIn: '7d' });

  res.json({ token, user: { id: user.id, username: user.username, balance: user.balance } });
});

// Веб-вход
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password_hash || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  if (user.status === 'blocked') return res.status(403).json({ error: 'Account blocked' });

  await prisma.user.update({ where: { id: user.id }, data: { last_login: new Date() } });

  const role = (await prisma.userRole.findUnique({ where: { user_id: user.id } }))?.role || 'user';
  const token = jwt.sign({ userId: user.id, role }, process.env.JWT_SECRET!, { expiresIn: '7d' });

  res.json({ token, user: { id: user.id, username: user.username, balance: user.balance, role } });
});

// Проверка токена
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.status(401).json({ error: 'User not found' });
    const role = decoded.role;
    res.json({ user: { id: user.id, username: user.username, balance: user.balance, role } });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;