import { Router } from 'express';
import { getAllArticles } from '../middleware/articleParser.js';

const router = Router();

// GET /api/categories
// Returns all categories with article counts
router.get('/', async (_req, res) => {
  try {
    const articles = await getAllArticles();

    const categoryMap = articles.reduce((acc, article) => {
      const cat = article.category;
      if (!acc[cat]) acc[cat] = { name: cat, count: 0, tags: new Set() };
      acc[cat].count += 1;
      article.tags.forEach((t) => acc[cat].tags.add(t));
      return acc;
    }, {});

    const categories = Object.values(categoryMap).map((c) => ({
      ...c,
      tags: [...c.tags],
    }));

    res.json({ categories });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load categories' });
  }
});

// GET /api/categories/:name
// Returns articles belonging to a category
router.get('/:name', async (req, res) => {
  try {
    const articles = await getAllArticles();
    const name = req.params.name.toLowerCase();

    const filtered = articles
      .filter((a) => a.category.toLowerCase() === name)
      .map(({ html, content, ...rest }) => rest);

    if (filtered.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ category: name, articles: filtered });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load category' });
  }
});

export default router;
