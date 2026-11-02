import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/classify', requireAuth, async (req: Request, res: Response) => {
  const imageUrl = typeof req.body.imageUrl === 'string' ? req.body.imageUrl.trim() : '';
  if (!imageUrl) return res.status(400).json({ error: 'imageUrl is required' });

  const serviceUrl = process.env.AI_SERVICE_URL;
  if (!serviceUrl) return res.status(503).json({ error: 'AI service is not configured' });

  try {
    const response = await fetch(`${serviceUrl.replace(/\/$/, '')}/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl }),
      signal: AbortSignal.timeout(10_000)
    });
    const result = await response.json();
    return res.status(response.ok ? 200 : 503).json(result);
  } catch (error) {
    console.error('AI service error:', error);
    return res.status(503).json({ error: 'AI service is unavailable' });
  }
});

export default router;
