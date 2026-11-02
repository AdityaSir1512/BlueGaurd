import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface AuthTokenPayload {
  sub: string;
  role: 'USER' | 'ADMIN';
}

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is required in backend/.env');
  return secret;
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.header('Authorization');
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined;

  if (!token) return res.status(401).json({ error: 'Authentication required' });

  try {
    const payload = jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
    if (!payload.sub || !payload.role) return res.status(401).json({ error: 'Invalid authentication token' });
    res.locals.userId = payload.sub;
    res.locals.userRole = payload.role;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  requireAuth(req, res, () => {
    if (res.locals.userRole !== 'ADMIN') return res.status(403).json({ error: 'Admin access required' });
    next();
  });
};

export const createAuthToken = (userId: string, role: 'USER' | 'ADMIN') =>
  jwt.sign({ role }, getJwtSecret(), { subject: userId, expiresIn: '7d' });
