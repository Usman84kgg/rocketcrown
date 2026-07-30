import express from 'express';
import cors from 'cors';
import path from 'path';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import balanceRoutes from './routes/balance';
import depositRoutes from './routes/deposits';
import withdrawalRoutes from './routes/withdrawals';
import gameRoutes from './routes/games';
import bonusRoutes from './routes/bonuses';
import promoRoutes from './routes/promos';
import supportRoutes from './routes/support';
import activityRoutes from './routes/activity';
import adminRoutes from './routes/admin/index';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api/deposit', depositRoutes);
app.use('/api/withdraw', withdrawalRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/bonuses', bonusRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/admin', adminRoutes);

export default app;