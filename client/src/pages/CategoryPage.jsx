import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../api';
import { useFetch } from '../hooks/useFetch';
import ArticleCard from '../components/ArticleCard';
import './ListPage.css';

const META = {
  weightlifting: {
    icon:     '🏋️',
    title:    'Weightlifting',
    seoTitle: 'Weightlifting Articles — Strength Training & Progressive Overload',
    desc:     'Progressive overload, compound lifts, and strength programming for hybrid athletes.',
  },
  cardio: {
    icon:     '🏃',
    title:    'Cardio',
    seoTitle: 'Cardio Articles — Zone 2, Fat Loss & Endurance Training',
    desc:     'Zone 2 training, steady-state cardio, and endurance without killing your gains.',
  },
  recomp: {
    icon:     '📈',
    title:    'Body Recomp',
    seoTitle: 'Body Recomp Articles — Lose Fat and Build Muscle',
    desc:     'Lose fat and build muscle simultaneously — the body recomposition guide.',
  },
  nutrition: {
    icon:     '🥩',
    title:    'Nutrition',
    seoTitle: 'Nutrition Articles — Protein, Macros & Diet for Training',
    desc:     'Fuelling your training: protein, macros, calorie targets, and everything in between.',
  },
  mindset: {
    icon:     '🧠',
    title:    'Mind & Habits',
    seoTitle: 'Mind & Habits — Consistency, Discipline & Mental Performance',
    desc:     'Building habits that stick, staying consistent, and the psychology of long-term progress.',
  },
  sleep: {
    icon:     '😴',
    title:    'Sleep & Recovery',
    seoTitle: 'Sleep & Recovery Articles — Rest, Recovery & Performance',
    desc:     'How sleep and recovery affect muscle growth, fat loss, and training performance.',
  },
  lifestyle: {
    icon:     '⚡',
    title:    'Lifestyle',
    seoTitle: 'Lifestyle Articles — Self-Improvement, Discipline & Daily Habits',
    desc:     'Applying the principles of good training to the rest of your life — discipline, habits, and self-improvement.',
  },
};

export default function CategoryPage() {
  const { name } = useParams();
  const meta = META[name] || {
    icon:     '📄',
    title:    name ? name.charAt(0).toUpperCase() + name.slice(1) : '',
    seoTitle: name ? `${name.charAt(0).toUpperCase() + name.slice(1)} — LiftAndBurn` : 'LiftAndBurn',
    desc:     '',
  };

  const { data, loading, error } = useFetch(
    () => api.categories.byName(name), [name]
  );

  const articleCount = data?.articles?.length ?? 0;

  return (
    <>
      <Helmet>
        <title>{`${meta.seoTitle} | LiftAndBurn`}</title>
        <meta name="description" content={meta.desc} />
        <link rel="canonical" href={`https://liftandburn.fit/category/${name}`} />
      </Helmet>

      <div className="list-page container">
        <header className="list-header fade-up">
          <span className="list-header__icon">{meta.icon}</span>
          <span className="list-header__eyebrow">Category</span>
          <h1 className="list-header__title">{meta.title.toUpperCase()}</h1>
          <p className="list-header__sub">{meta.desc}</p>
          {!loading && articleCount > 0 && (
            <span className="list-header__count">{articleCount} articles</span>
          )}
        </header>

        <div className="adsense-slot">AdSense · 728×90</div>

        {loading && (
          <div className="skeleton-list">
            {[1,2,3].map(i => <div key={i} className="skeleton-card" />)}
          </div>
        )}
        {error && <p className="list-empty">Category not found.</p>}
        {!loading && !error && (
          <div className="article-list">
            {data?.articles?.length === 0 && (
              <p className="list-empty">No articles yet — check back soon.</p>
            )}
            {data?.articles?.map(a => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}