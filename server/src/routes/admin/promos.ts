import { Router } from 'express';
import { prisma } from '../../db/prisma';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '..', '..', '..', 'uploads', 'banners')),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${uuidv4()}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

const router = Router();

// Все баннеры
router.get('/', async (req, res) => {
  const banners = await prisma.promoBanner.findMany({ orderBy: { sort_order: 'asc' } });
  res.json(banners);
});

// Загрузить новый баннер
router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

  const imageUrl = `/uploads/banners/${req.file.filename}`;
  const { title, description, link_type, link_url, is_active, sort_order } = req.body;

  const banner = await prisma.promoBanner.create({
    data: {
      image_url: imageUrl,
      title,
      description,
      link_type: link_type || 'internal',
      link_url,
      is_active: is_active === 'true' || is_active === true,
      sort_order: Number(sort_order) || 0,
    },
  });

  await prisma.auditLog.create({
    data: {
      admin_id: req.user!.userId,
      action: `Created promo banner "${title}"`,
      entity_type: 'promo_banner',
      entity_id: banner.id,
    },
  });

  res.json(banner);
});

// Обновить баннер
router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const updateData: any = { ...req.body };

  if (req.file) {
    updateData.image_url = `/uploads/banners/${req.file.filename}`;
  }

  if (updateData.is_active !== undefined) {
    updateData.is_active = updateData.is_active === 'true' || updateData.is_active === true;
  }

  const banner = await prisma.promoBanner.update({ where: { id }, data: updateData });

  await prisma.auditLog.create({
    data: {
      admin_id: req.user!.userId,
      action: `Updated promo banner "${banner.title}"`,
      entity_type: 'promo_banner',
      entity_id: id,
    },
  });

  res.json(banner);
});

// Удалить баннер
router.delete('/:id', async (req, res) => {
  const banner = await prisma.promoBanner.delete({ where: { id: req.params.id } });

  await prisma.auditLog.create({
    data: {
      admin_id: req.user!.userId,
      action: `Deleted promo banner "${banner.title}"`,
      entity_type: 'promo_banner',
      entity_id: req.params.id,
    },
  });

  res.json({ success: true });
});

export default router;