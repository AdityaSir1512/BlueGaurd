import { Router, Request, Response } from 'express';
import HistoricalPollutionAssessment from '../models/HistoricalPollutionAssessment';

const router = Router();

router.get('/historical-assessments', async (req: Request, res: Response) => {
  try {
    const query: Record<string, unknown> = {};
    if (typeof req.query.assessmentClass === 'string' && req.query.assessmentClass.trim()) {
      query.assessmentClass = req.query.assessmentClass.trim();
    }
    const requestedLimit = Number.parseInt(String(req.query.limit || '100'), 10);
    const limit = Math.min(Math.max(Number.isFinite(requestedLimit) ? requestedLimit : 100, 1), 500);
    const assessments = await HistoricalPollutionAssessment.find(query)
      .select('-_id -sourceChecksum -geometry.coordinates')
      .sort({ assessmentClass: 1, originalObjectId: 1 })
      .limit(limit);

    return res.json({
      source: 'European Environment Agency',
      dataset: 'Assessment of marine litter in all four regional seas, 2010-2021',
      dataType: 'Historical / External Assessment Areas',
      records: assessments
    });
  } catch (error) {
    console.error('Historical assessment error:', error);
    return res.status(500).json({ error: 'Unable to load historical assessment data' });
  }
});

export default router;
