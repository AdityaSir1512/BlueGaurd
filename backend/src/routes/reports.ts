import { Router, Request, Response } from 'express';
import { Types } from 'mongoose';
import PollutionReport from '../models/PollutionReport';
import { requireAuth } from '../middleware/auth';

const router = Router();
const publicStatuses = ['VERIFIED', 'RESOLVED'];

const getReportId = (req: Request) => (typeof req.params.id === 'string' ? req.params.id : '');

const parseLimit = (value: unknown, fallback = 100, maximum = 500) => {
  const parsed = Number.parseInt(String(value ?? fallback), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, 1), maximum);
};

const hasValidLocation = (location: unknown): location is { type: 'Point'; coordinates: [number, number] } => {
  if (!location || typeof location !== 'object') return false;
  const candidate = location as { type?: unknown; coordinates?: unknown };
  if (candidate.type !== 'Point' || !Array.isArray(candidate.coordinates) || candidate.coordinates.length !== 2) return false;
  const [longitude, latitude] = candidate.coordinates;
  return (
    typeof longitude === 'number' &&
    typeof latitude === 'number' &&
    longitude >= -180 &&
    longitude <= 180 &&
    latitude >= -90 &&
    latitude <= 90
  );
};

const publicQuery = (req: Request) => {
  const query: Record<string, unknown> = { status: { $in: publicStatuses } };
  if (typeof req.query.pollutionType === 'string' && req.query.pollutionType.trim()) {
    query.pollutionType = req.query.pollutionType.trim();
  }
  if (typeof req.query.severity === 'string' && ['LOW', 'MEDIUM', 'HIGH'].includes(req.query.severity)) {
    query.severity = req.query.severity;
  }
  return query;
};

// Public discovery endpoint: pending and rejected reports are not exposed.
router.get('/', async (req: Request, res: Response) => {
  try {
    const reports = await PollutionReport.find(publicQuery(req))
      .select('-userId -moderationNote')
      .sort({ createdAt: -1 })
      .limit(parseLimit(req.query.limit));
    return res.json(reports);
  } catch (error) {
    console.error('Public reports error:', error);
    return res.status(500).json({ error: 'Unable to load pollution reports' });
  }
});

router.get('/map', async (req: Request, res: Response) => {
  try {
    const reports = await PollutionReport.find(publicQuery(req))
      .select('_id pollutionType userConfirmedType severity location status createdAt')
      .sort({ createdAt: -1 })
      .limit(parseLimit(req.query.limit, 500, 500));
    return res.json(reports);
  } catch (error) {
    console.error('Map reports error:', error);
    return res.status(500).json({ error: 'Unable to load map reports' });
  }
});

router.get('/my', requireAuth, async (_req: Request, res: Response) => {
  try {
    const reports = await PollutionReport.find({ userId: res.locals.userId })
      .sort({ createdAt: -1 })
      .limit(500);
    return res.json(reports);
  } catch (error) {
    console.error('User reports error:', error);
    return res.status(500).json({ error: 'Unable to load your reports' });
  }
});

router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { imageUrl, pollutionType, userConfirmedType, severity, description, location } = req.body;
    if (typeof imageUrl !== 'string' || !imageUrl.trim()) {
      return res.status(400).json({ error: 'imageUrl is required until image storage is configured' });
    }
    if (typeof pollutionType !== 'string' || !pollutionType.trim()) {
      return res.status(400).json({ error: 'pollutionType is required' });
    }
    if (!['LOW', 'MEDIUM', 'HIGH'].includes(severity)) {
      return res.status(400).json({ error: 'severity must be LOW, MEDIUM, or HIGH' });
    }
    if (!hasValidLocation(location)) {
      return res.status(400).json({ error: 'location must be a valid GeoJSON Point' });
    }

    const report = await PollutionReport.create({
      userId: new Types.ObjectId(res.locals.userId),
      imageUrl: imageUrl.trim(),
      pollutionType: pollutionType.trim(),
      userConfirmedType:
        typeof userConfirmedType === 'string' && userConfirmedType.trim()
          ? userConfirmedType.trim()
          : pollutionType.trim(),
      severity,
      description: typeof description === 'string' ? description.trim() : undefined,
      location,
      source: 'USER_REPORT'
    });

    return res.status(201).json(report);
  } catch (error) {
    console.error('Create report error:', error);
    return res.status(500).json({ error: 'Unable to create pollution report' });
  }
});

router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  const reportId = getReportId(req);
  if (!Types.ObjectId.isValid(reportId)) return res.status(400).json({ error: 'Invalid report id' });

  const report = await PollutionReport.findOne({ _id: reportId, userId: res.locals.userId });
  if (!report) return res.status(404).json({ error: 'Report not found' });
  return res.json(report);
});

router.patch('/:id', requireAuth, async (req: Request, res: Response) => {
  const reportId = getReportId(req);
  if (!Types.ObjectId.isValid(reportId)) return res.status(400).json({ error: 'Invalid report id' });

  const report = await PollutionReport.findOne({
    _id: reportId,
    userId: res.locals.userId,
    status: 'PENDING'
  });
  if (!report) return res.status(404).json({ error: 'Pending report not found' });

  const allowedFields = ['pollutionType', 'userConfirmedType', 'severity', 'description', 'location'];
  for (const field of allowedFields) {
    if (field in req.body) (report as unknown as Record<string, unknown>)[field] = req.body[field];
  }

  if (req.body.location !== undefined && !hasValidLocation(req.body.location)) {
    return res.status(400).json({ error: 'location must be a valid GeoJSON Point' });
  }
  if (req.body.severity !== undefined && !['LOW', 'MEDIUM', 'HIGH'].includes(req.body.severity)) {
    return res.status(400).json({ error: 'severity must be LOW, MEDIUM, or HIGH' });
  }

  await report.save();
  return res.json(report);
});

export default router;
