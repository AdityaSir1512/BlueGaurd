import { Router, Request, Response } from 'express';

const router = Router();

const awarenessItems = [
  {
    id: 'plastic-pollution',
    title: 'Plastic pollution and marine life',
    summary: 'Plastic debris can injure marine animals, be ingested, and break down into smaller particles that persist in marine environments.',
    source: 'United Nations Environment Programme',
    sourceUrl: 'https://www.unep.org/interactives/beat-plastic-pollution/'
  },
  {
    id: 'marine-litter-prevention',
    title: 'Preventing marine litter',
    summary: 'Reducing single-use materials, disposing of waste responsibly, and joining verified local actions can reduce the flow of litter into waterways.',
    source: 'European Environment Agency',
    sourceUrl: 'https://www.eea.europa.eu/en/topics/in-depth/marine-litter'
  },
  {
    id: 'sdg-14',
    title: 'SDG 14: Life Below Water',
    summary: 'BlueGuard supports awareness and data collection related to conserving oceans and marine resources, without claiming to clean the ocean physically.',
    source: 'United Nations Sustainable Development Goals',
    sourceUrl: 'https://sdgs.un.org/goals/goal14'
  }
];

router.get('/awareness', (_req: Request, res: Response) => {
  return res.json({ source: 'reviewed_public_sources', items: awarenessItems });
});

router.get('/conservation', (_req: Request, res: Response) => {
  return res.json({
    source: 'verified_blueguard_activities',
    activities: [],
    message: 'No verified conservation activities are configured yet. BlueGuard does not invent events or partnerships.'
  });
});

export default router;
