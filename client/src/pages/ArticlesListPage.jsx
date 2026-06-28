import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { api } from '../api';
import { useFetch } from '../hooks/useFetch';
import ArticleCard from '../components/ArticleCard';
import './ListPage.css';

const CATEGORIES = [
  { id: 'all',          label: 'All' },
  { id: 'weightlifting', label: 'Weightlifting' },
  { id: 'cardio',       label: 'Cardio' },
  { id: 'recomp',       label: 'Body Recomp' },
  { id: 'nutrition',    label: 'Nutrition' },
  { id: 'mindset',      label: 'Mind & Habits' },
  { id: 'sleep',        label: 'Sleep & Recovery' },
  { id: 'lifestyle',    label: 'Lifestyle' },
];

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
        <link rel="canonical" href="https://liftandburn.fit/articles" />
        <meta name="description" content="Browse all articles on strength, cardio, nutrition, habits, sleep, and self-improvement." />
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
              key={c.id}
              className={`filter-btn ${active === c.id ? 'active' : ''}`}
              onClick={() => setActive(c.id)}
            >
              {c.label}
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