import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import biodiversityRouter from './routes/biodiversity';
import authRouter from './routes/auth';
import reportsRouter from './routes/reports';
import aiRouter from './routes/ai';
import uploadsRouter, { UPLOADS_DIR } from './routes/uploads';
import analyticsRouter from './routes/analytics';
import adminRouter from './routes/admin';
import contentRouter from './routes/content';
import historicalRouter from './routes/historical';
import riskRouter from './routes/risk';

const app = express();
const corsOrigins = process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()).filter(Boolean);
const authLimiter = rateLimit({
  windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  limit: Number(process.env.AUTH_RATE_LIMIT_MAX || 20),
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Try again later.' }
});

app.use(helmet());
app.use(cors(corsOrigins?.length ? { origin: corsOrigins } : undefined));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));

app.get('/', (_req, res) => {
  res.json({ message: 'BlueGuard Backend API is running!' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/biodiversity', biodiversityRouter);
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api', analyticsRouter);
app.use('/api/admin', adminRouter);
app.use('/api', contentRouter);
app.use('/api', historicalRouter);
app.use('/api', riskRouter);

app.use((error: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error && typeof error === 'object' && 'type' in error && error.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request body is too large' });
  }
  if (res.headersSent) return next(error);
  console.error('Unhandled request error:', error);
  return res.status(500).json({ error: 'Internal server error' });
});

export default app;