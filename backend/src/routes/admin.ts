import { Router, Request, Response } from 'express';
import { Types } from 'mongoose';
import PollutionReport from '../models/PollutionReport';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.use(requireAdmin);

router.get('/reports', async (req: Request, res: Response) => {
  try {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const query = status && ['PENDING', 'VERIFIED', 'REJECTED', 'RESOLVED'].includes(status) ? { status } : {};
    const reports = await PollutionReport.find(query).sort({ createdAt: -1 }).limit(500);
    return res.json(reports);
  } catch (error) {
    console.error('Admin reports error:', error);
    return res.status(500).json({ error: 'Unable to load admin reports' });
  }
});

const updateStatus = async (req: Request, res: Response, status: 'VERIFIED' | 'REJECTED' | 'RESOLVED') => {
  const reportId = typeof req.params.id === 'string' ? req.params.id : '';
  if (!Types.ObjectId.isValid(reportId)) return res.status(400).json({ error: 'Invalid report id' });

  const report = await PollutionReport.findById(reportId);
  if (!report) return res.status(404).json({ error: 'Report not found' });
  if (status === 'RESOLVED' && report.status !== 'VERIFIED') {
    return res.status(409).json({ error: 'Only verified reports can be resolved' });
  }
  if (status !== 'RESOLVED' && report.status !== 'PENDING') {
    return res.status(409).json({ error: 'Only pending reports can be verified or rejected' });
  }

  report.status = status;
  report.verifiedBy = new Types.ObjectId(res.locals.userId);
  report.verifiedAt = new Date();
  report.moderationNote = typeof req.body.note === 'string' ? req.body.note.trim() : undefined;
  await report.save();
  return res.json(report);
};

router.patch('/reports/:id/verify', (req: Request, res: Response) => updateStatus(req, res, 'VERIFIED'));
router.patch('/reports/:id/reject', (req: Request, res: Response) => updateStatus(req, res, 'REJECTED'));
router.patch('/reports/:id/resolve', (req: Request, res: Response) => updateStatus(req, res, 'RESOLVED'));

export default router;
