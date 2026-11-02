import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { Router, Request, Response } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth';

export const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, UPLOADS_DIR),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${crypto.randomUUID()}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    callback(null, allowedTypes.includes(file.mimetype));
  }
});

const router = Router();

router.post('/', requireAuth, (req: Request, res: Response) => {
  upload.single('image')(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ error: error.code === 'LIMIT_FILE_SIZE' ? 'Image must be 5 MB or smaller' : error.message });
    }
    if (error) return res.status(400).json({ error: 'Only JPEG, PNG, and WebP images are accepted' });
    if (!req.file) return res.status(400).json({ error: 'An image file is required' });

    return res.status(201).json({
      imageUrl: `/uploads/${req.file.filename}`,
      originalName: req.file.originalname,
      contentType: req.file.mimetype,
      size: req.file.size,
      storage: 'local-development'
    });
  });
});

export default router;
