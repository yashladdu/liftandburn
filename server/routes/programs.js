import { Router } from 'express';
import { getAllPrograms, getProgramBySlug } from '../middleware/programParser.js';

const router = Router();

// GET /api/programs
router.get('/', async (_req, res) => {
  try {
    const programs = await getAllPrograms();
    // Strip HTML from list view
    const summaries = programs.map(({ previewHtml, lockedHtml, ...rest }) => rest);
    res.json({ programs: summaries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load programs' });
  }
});

// GET /api/programs/featured
router.get('/featured', async (_req, res) => {
  try {
    const programs = await getAllPrograms();
    const featured = programs
      .filter(p => p.featured)
      .map(({ previewHtml, lockedHtml, ...rest }) => rest);
    res.json({ programs: featured });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load featured programs' });
  }
});

// GET /api/programs/:slug
router.get('/:slug', async (req, res) => {
  try {
    const program = await getProgramBySlug(req.params.slug);
    if (!program) return res.status(404).json({ error: 'Program not found' });
    res.json({ program });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load program' });
  }
});

export default router;
