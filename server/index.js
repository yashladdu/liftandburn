import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import articlesRouter from './routes/articles.js';
import categoriesRouter from './routes/categories.js';
import searchRouter from './routes/search.js';

const app = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(morgan('dev'));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────
app.use('/api/articles', articlesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/search', searchRouter);

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 handler ───────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global error handler ──────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🏋️  LiftAndBurn API running on http://localhost:${PORT}`);
});
