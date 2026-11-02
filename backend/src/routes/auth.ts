import bcrypt from 'bcryptjs';
import { Router, Request, Response } from 'express';
import User, { IUser } from '../models/User';
import { createAuthToken, requireAuth } from '../middleware/auth';

const router = Router();

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const publicUser = (user: IUser) => ({
  id: String(user._id),
  email: user.email,
  role: user.role,
  displayName: user.displayName
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const displayName = typeof req.body.displayName === 'string' ? req.body.displayName.trim() : undefined;

    if (!isValidEmail(email)) return res.status(400).json({ error: 'A valid email is required' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

    const existingUser = await User.findOne({ email }).select('+passwordHash');
    if (existingUser) return res.status(409).json({ error: 'An account with this email already exists' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash, displayName });
    const token = createAuthToken(user.id, user.role);

    return res.status(201).json({ token, user: publicUser(user) });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Unable to create account' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const user = await User.findOne({ email }).select('+passwordHash');
    const passwordMatches = user ? await bcrypt.compare(password, user.passwordHash) : false;

    if (!user || !passwordMatches) return res.status(401).json({ error: 'Invalid email or password' });

    const token = createAuthToken(user.id, user.role);
    return res.json({ token, user: publicUser(user) });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Unable to log in' });
  }
});

router.get('/me', requireAuth, async (_req: Request, res: Response) => {
  try {
    const user = await User.findById(res.locals.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ user: publicUser(user) });
  } catch (error) {
    console.error('Profile error:', error);
    return res.status(500).json({ error: 'Unable to load profile' });
  }
});

export default router;
