import { Router } from 'express';
import { getAllArticles } from '../middleware/articleParser.js';

const router = Router();

// GET /api/search?q=zone+2+cardio
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters' });
    }

    const query = q.toLowerCase().trim();
    const articles = await getAllArticles();

    const results = articles
      .map((article) => {
        // Score each article based on where the query matches
        let score = 0;
        if (article.title.toLowerCase().includes(query)) score += 10;
        if (article.description.toLowerCase().includes(query)) score += 5;
        if (article.tags.some((t) => t.toLowerCase().includes(query))) score += 4;
        if (article.category.toLowerCase().includes(query)) score += 3;
        if (article.content.toLowerCase().includes(query)) score += 1;

        return { score, article };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ article }) => {
        const { html, content, ...rest } = article;
        return rest;
      });

    res.json({ query: q, results, total: results.length });
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
