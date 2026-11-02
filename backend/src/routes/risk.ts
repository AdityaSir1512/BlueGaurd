import { Router, Request, Response } from 'express';
import PollutionReport from '../models/PollutionReport';
import HistoricalPollutionAssessment from '../models/HistoricalPollutionAssessment';

const router = Router();
const verifiedStatuses = ['VERIFIED', 'RESOLVED'];

router.get('/risk', async (req: Request, res: Response) => {
  const latitude = Number(req.query.latitude);
  const longitude = Number(req.query.longitude);
  const radiusMeters = Math.min(Math.max(Number(req.query.radiusMeters) || 25_000, 1_000), 100_000);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return res.status(400).json({ error: 'Valid latitude and longitude are required' });
  }

  try {
    const point = { type: 'Point', coordinates: [longitude, latitude] };
    const radiusRadians = radiusMeters / 6_371_000;
    const [verifiedReports, historicalAssessments] = await Promise.all([
      PollutionReport.countDocuments({ status: { $in: verifiedStatuses }, location: { $geoWithin: { $centerSphere: [[longitude, latitude], radiusRadians] } } }),
      HistoricalPollutionAssessment.countDocuments({ geometry: { $geoIntersects: { $geometry: point } } })
    ]);

    const evidenceCount = verifiedReports + historicalAssessments;
    if (evidenceCount === 0) {
      return res.json({
        status: 'INSUFFICIENT_DATA',
        label: 'Potential Risk',
        riskLevel: null,
        riskScore: null,
        inputs: { latitude, longitude, radiusMeters, verifiedReports, historicalAssessments },
        methodology: 'Verified/resolved user reports within the requested radius plus intersecting EEA historical assessment areas.',
        limitations: ['No qualifying evidence was found for this location.']
      });
    }

    const riskScore = Math.min(100, verifiedReports * 20 + historicalAssessments * 10);
    const riskLevel = riskScore >= 70 ? 'HIGH' : riskScore >= 35 ? 'MEDIUM' : 'LOW';
    return res.json({
      status: 'ESTIMATE',
      label: 'Potential Risk',
      riskLevel,
      riskScore,
      inputs: { latitude, longitude, radiusMeters, verifiedReports, historicalAssessments },
      methodology: 'Verified/resolved user reports within the requested radius plus intersecting EEA historical assessment areas; this is an estimate, not a guaranteed prediction.',
      limitations: ['Historical assessment polygons are contextual evidence, not current user observations.', 'Risk score is a prototype heuristic and has not been scientifically validated.']
    });
  } catch (error) {
    console.error('Risk error:', error);
    return res.status(500).json({ error: 'Unable to calculate potential risk' });
  }
});

export default router;
