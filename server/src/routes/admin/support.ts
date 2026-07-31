import { Router } from 'express';
const router = Router();
router.get('/tickets', (req, res) => res.json([]));
export default router;