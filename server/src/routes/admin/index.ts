import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth';
import usersRouter from './users';
import depositsRouter from './deposits';
import withdrawalsRouter from './withdrawals';
import walletsRouter from './wallets';
import gamesRouter from './games';
import bonusesRouter from './bonuses';
import promosRouter from './promos';

const router = Router();

router.use(authenticate);

// Владелец — полный доступ
router.use('/users', requireRole('owner'), usersRouter);
router.use('/deposits', requireRole('owner'), depositsRouter);
router.use('/withdrawals', requireRole('owner'), withdrawalsRouter);
router.use('/wallets', requireRole('owner'), walletsRouter);
router.use('/games', requireRole('owner'), gamesRouter);
router.use('/bonuses', requireRole('owner'), bonusesRouter);
router.use('/promos', requireRole('owner'), promosRouter);
// Поддержка — только тикеты (в отдельном файле)
router.use('/support', requireRole('owner', 'support'), (await import('./support')).default);

export default router;