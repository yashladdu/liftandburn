import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { api } from '../api';
import { useFetch } from '../hooks/useFetch';
import ArticleCard from '../components/ArticleCard';
import './ListPage.css';

const CATEGORIES = ['all', 'weightlifting', 'cardio', 'recomp', 'nutrition'];

export default function ArticlesListPage() {
  const [active, setActive] = useState('all');

  const { data, loading } = useFetch(
    () => api.articles.list(active !== 'all' ? { category: active, limit: 50 } : { limit: 50 }),
    [active]
  );

  return (
    <>
      <Helmet>
        <title>All Articles — LiftAndBurn</title>
        <link rel="canonical" href="https://liftandburn.fit/" />
        <meta name="description" content="Browse all training articles on weightlifting, cardio, and body recomp." />
      </Helmet>

      <div className="list-page container">
        <header className="list-header fade-up">
          <span className="list-header__eyebrow">LiftAndBurn</span>
          <h1 className="list-header__title">ALL ARTICLES</h1>
          <p className="list-header__sub">
            {data?.pagination?.total ?? '—'} articles on strength, endurance, and everything in between.
          </p>
        </header>

        <div className="adsense-slot">AdSense · 728×90</div>

        <div className="list-filters">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`filter-btn ${active === c ? 'active' : ''}`}
              onClick={() => setActive(c)}
            >
              {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="skeleton-list">
            {[1,2,3,4,5].map((i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : (
          <div className="article-list">
            {data?.articles?.length === 0 && (
              <p className="list-empty">No articles in this category yet.</p>
            )}
            {data?.articles?.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
