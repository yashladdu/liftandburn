import { Router } from 'express';
import { getAllArticles, getArticleBySlug } from '../middleware/articleParser.js';

const router = Router();

// GET /api/articles
// Query params: category, tag, limit, page
router.get('/', async (req, res) => {
  try {
    let articles = await getAllArticles();

    const { category, tag, limit = 10, page = 1 } = req.query;

    // Filter by category
    if (category) {
      articles = articles.filter(
        (a) => a.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by tag
    if (tag) {
      articles = articles.filter((a) =>
        a.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
      );
    }

    // Pagination
    const total = articles.length;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const start = (pageNum - 1) * limitNum;
    const paginated = articles.slice(start, start + limitNum);

    // Strip full HTML/content from list view (send summary only)
    const summaries = paginated.map(({ html, content, ...rest }) => rest);

    res.json({
      articles: summaries,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load articles' });
  }
});

// GET /api/articles/featured
router.get('/featured', async (req, res) => {
  try {
    const all = await getAllArticles();
    const featured = all
      .filter((a) => a.featured)
      .slice(0, 3)
      .map(({ html, content, ...rest }) => rest);

    res.json({ articles: featured });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load featured articles' });
  }
});

// GET /api/articles/:slug
router.get('/:slug', async (req, res) => {
  try {
    const article = await getArticleBySlug(req.params.slug);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Don't send raw markdown to client — only rendered HTML
    const { content, ...articleData } = article;

    res.json({ article: articleData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load article' });
  }
});

// GET /api/articles/:slug/related
// Returns up to 3 articles in the same category, excluding the current one
router.get('/:slug/related', async (req, res) => {
  try {
    const article = await getArticleBySlug(req.params.slug);
    if (!article) return res.status(404).json({ error: 'Article not found' });

    const all = await getAllArticles();
    const related = all
      .filter((a) => a.category === article.category && a.slug !== article.slug)
      .slice(0, 3)
      .map(({ html, content, ...rest }) => rest);

    res.json({ articles: related });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load related articles' });
  }
});

export default router;
