import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../api';
import { useFetch } from '../hooks/useFetch';
import ArticleCard from '../components/ArticleCard';
import './ArticlePage.css';

export default function ArticlePage() {
  const { slug } = useParams();

  const { data, loading, error } = useFetch(() => api.articles.bySlug(slug), [slug]);
  const { data: related }        = useFetch(() => api.articles.related(slug), [slug]);

  if (loading) return <div className="article-loading container">Loading article…</div>;
  if (error)   return <div className="article-error container">Article not found.</div>;

  const { article } = data;
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null;

  return (
    <>
      <Helmet>
        <title>{article.title} — LiftAndBurn</title>
        <meta name="description" content={article.description} />
      </Helmet>

      <div className="article-page container">

        {/* ── Header ────────────────────────────────────── */}
        <header className="article-header fade-up">
          <div className="article-header__meta">
            <Link to={`/category/${article.category}`} className="tag accent">
              {article.category}
            </Link>
            {date && <span className="article-header__date">{date}</span>}
            {article.readingTime && (
              <span className="article-header__read">{article.readingTime} min read</span>
            )}
          </div>
          <h1 className="article-header__title">{article.title}</h1>
          {article.description && (
            <p className="article-header__desc">{article.description}</p>
          )}
          {article.tags?.length > 0 && (
            <div className="article-header__tags">
              {article.tags.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          )}
        </header>

        {/* ── AdSense top ───────────────────────────────── */}
        <div className="adsense-slot">AdSense · 728×90</div>

        {/* ── Body ──────────────────────────────────────── */}
        <div className="article-layout">
          <article
            className="article-body fade-up-2"
            dangerouslySetInnerHTML={{ __html: article.html }}
          />

          {/* ── Sidebar ─────────────────────────────────── */}
          <aside className="article-sidebar">
            <div className="sidebar-card">
              <span className="sidebar-card__title">About</span>
              <p className="sidebar-card__text">
                LiftAndBurn covers hybrid athlete training — combining heavy lifting
                with steady-state cardio for strength, endurance, and body recomposition.
              </p>
              <Link to="/articles" className="sidebar-card__link">Browse all articles →</Link>
            </div>

            {/* ── Sidebar AdSense ─────────────────────── */}
            <div className="adsense-slot" style={{ minHeight: 250 }}>
              AdSense · 300×250
            </div>
          </aside>
        </div>

        {/* ── AdSense bottom ────────────────────────────── */}
        <div className="adsense-slot">AdSense · 728×90</div>

        {/* ── Related articles ──────────────────────────── */}
        {related?.articles?.length > 0 && (
          <section className="related">
            <h2 className="related__title">RELATED ARTICLES</h2>
            <div className="article-list">
              {related.articles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
