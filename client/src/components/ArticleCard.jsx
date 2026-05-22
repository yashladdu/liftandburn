import { Link } from 'react-router-dom';
import './ArticleCard.css';

const CATEGORY_ICONS = {
  weightlifting: '🏋️',
  cardio:        '🏃',
  recomp:        '📈',
  nutrition:     '🥩',
  general:       '📄',
};

export default function ArticleCard({ article, featured = false }) {
  const icon = CATEGORY_ICONS[article.category] || '📄';
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : null;

  return (
    <Link
      to={`/articles/${article.slug}`}
      className={`article-card ${featured ? 'article-card--featured' : ''}`}
    >
      <div className="article-card__icon-wrap">
        <span className="article-card__icon">{icon}</span>
      </div>

      <div className="article-card__body">
        <div className="article-card__meta">
          <span className="tag">{article.category}</span>
          {article.readingTime && (
            <span className="article-card__read">{article.readingTime} min read</span>
          )}
        </div>
        <h3 className="article-card__title">{article.title}</h3>
        {article.description && (
          <p className="article-card__desc">{article.description}</p>
        )}
        <div className="article-card__footer">
          {date && <span className="article-card__date">{date}</span>}
          <span className="article-card__cta">Read →</span>
        </div>
      </div>
    </Link>
  );
}
