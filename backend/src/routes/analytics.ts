import { Router, Request, Response } from 'express';
import PollutionReport from '../models/PollutionReport';

const router = Router();
const verifiedStatuses = ['VERIFIED', 'RESOLVED'];

router.get('/statistics', async (_req: Request, res: Response) => {
  try {
    const [summary] = await PollutionReport.aggregate([
      { $match: { status: { $in: verifiedStatuses } } },
      {
        $facet: {
          totals: [{ $count: 'count' }],
          byType: [{ $group: { _id: '$userConfirmedType', count: { $sum: 1 } } }, { $sort: { count: -1 } }],
          bySeverity: [{ $group: { _id: '$severity', count: { $sum: 1 } } }, { $sort: { _id: 1 } }],
          byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }, { $sort: { _id: 1 } }],
          byMonth: [
            { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
          ]
        }
      }
    ]);

    return res.json({
      source: 'verified_blueguard_reports',
      totalVerifiedReports: summary?.totals?.[0]?.count || 0,
      byType: summary?.byType || [],
      bySeverity: summary?.bySeverity || [],
      byStatus: summary?.byStatus || [],
      byMonth: summary?.byMonth || []
    });
  } catch (error) {
    console.error('Statistics error:', error);
    return res.status(500).json({ error: 'Unable to calculate pollution statistics' });
  }
});

router.get('/hotspots', async (req: Request, res: Response) => {
  try {
    const minimumReports = Math.max(Number.parseInt(String(req.query.minimumReports || '3'), 10) || 3, 1);
    const hotspots = await PollutionReport.aggregate([
      { $match: { status: { $in: verifiedStatuses } } },
      {
        $project: {
          severity: 1,
          pollutionType: '$userConfirmedType',
          longitude: { $arrayElemAt: ['$location.coordinates', 0] },
          latitude: { $arrayElemAt: ['$location.coordinates', 1] }
        }
      },
      {
        $group: {
          _id: {
            longitude: { $round: [{ $divide: ['$longitude', 0.1] }, 0] },
            latitude: { $round: [{ $divide: ['$latitude', 0.1] }, 0] }
          },
          reportCount: { $sum: 1 },
          highSeverityCount: { $sum: { $cond: [{ $eq: ['$severity', 'HIGH'] }, 1, 0] } },
          types: { $addToSet: '$pollutionType' }
        }
      },
      { $match: { reportCount: { $gte: minimumReports } } },
      { $sort: { reportCount: -1 } },
      { $limit: 100 }
    ]);

    return res.json({
      source: 'verified_blueguard_reports',
      methodology: '0.1 degree grid cells; a hotspot requires the requested minimum verified/resolved report count',
      minimumReports,
      hotspots: hotspots.map((hotspot) => ({
        latitude: hotspot._id.latitude * 0.1,
        longitude: hotspot._id.longitude * 0.1,
        reportCount: hotspot.reportCount,
        highSeverityCount: hotspot.highSeverityCount,
        pollutionTypes: hotspot.types,
        level: hotspot.reportCount >= 10 ? 'HIGH' : hotspot.reportCount >= 5 ? 'MEDIUM' : 'LOW'
      }))
    });
  } catch (error) {
    console.error('Hotspot error:', error);
    return res.status(500).json({ error: 'Unable to calculate pollution hotspots' });
  }
});

export default router;
