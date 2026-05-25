import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../api';
import { useFetch } from '../hooks/useFetch';
import ArticleCard from '../components/ArticleCard';
import './ListPage.css';

const META = {
  weightlifting: { icon: '🏋️', desc: 'Progressive overload, compound lifts, and strength programming for hybrid athletes.' },
  cardio:        { icon: '🏃', desc: 'Zone 2 training, steady-state cardio, and endurance without killing your gains.' },
  recomp:        { icon: '📈', desc: 'Lose fat and build muscle simultaneously — the body recomposition guide.' },
  nutrition:     { icon: '🥩', desc: 'Fuelling your training: protein, carbs, and everything in between.' },
};

export default function CategoryPage() {
  const { name } = useParams();
  const meta = META[name] || { icon: '📄', desc: '' };

  const { data, loading, error } = useFetch(
    () => api.categories.byName(name), [name]
  );

  const title = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <>
      <Helmet>
        <title>{title} — LiftAndBurn</title>
        <link rel="canonical" href="https://liftandburn.fit/" />
        <meta name="description" content={meta.desc} />
      </Helmet>

      <div className="list-page container">
        <header className="list-header fade-up">
          <span className="list-header__icon">{meta.icon}</span>
          <span className="list-header__eyebrow">Category</span>
          <h1 className="list-header__title">{title.toUpperCase()}</h1>
          <p className="list-header__sub">{meta.desc}</p>
        </header>

        <div className="adsense-slot">AdSense · 728×90</div>

        {loading && (
          <div className="skeleton-list">
            {[1,2,3].map((i) => <div key={i} className="skeleton-card" />)}
          </div>
        )}
        {error && <p className="list-empty">Category not found.</p>}
        {!loading && !error && (
          <div className="article-list">
            {data?.articles?.length === 0 && (
              <p className="list-empty">No articles yet — check back soon.</p>
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
