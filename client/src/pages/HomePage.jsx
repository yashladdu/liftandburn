import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useFetch } from '../hooks/useFetch';
import { api } from '../api';
import ArticleCard from '../components/ArticleCard';
import './HomePage.css';

function Skeleton() {
  return (
    <div className="skeleton-list">
      {[1,2,3].map(i => <div key={i} className="skeleton-card" />)}
    </div>
  );
}

// ── What the site covers ──────────────────────────────────────
const PILLARS = [
  {
    to:    '/category/weightlifting',
    icon:  '🏋️',
    label: 'Strength Training',
    desc:  'Progressive overload, low volume high intensity, compound lifts. Build strength that lasts.',
    colour: '#D85A30',
  },
  {
    to:    '/category/cardio',
    icon:  '🏃',
    label: 'Cardio & Fat Loss',
    desc:  'Zone 2, incline walking, 12-3-30. Burn fat without destroying your recovery.',
    colour: '#4a9eff',
  },
  {
    to:    '/category/recomp',
    icon:  '📈',
    label: 'Nutrition & Recomp',
    desc:  'Protein, macros, calorie deficits. The science of changing your body composition.',
    colour: '#4ade80',
  },
];

// ── Tools promo ───────────────────────────────────────────────
const TOOLS = [
  { to: '/calculators/tdee',    icon: '🍽️', label: 'TDEE',          desc: 'Daily calorie target' },
  { to: '/calculators/macros',  icon: '🥩', label: 'Macros',         desc: 'Grams to calories' },
  { to: '/calculators/body-fat',icon: '📐', label: 'Body Fat',        desc: '4-method estimator' },
  { to: '/calculators/treadmill-calorie-calculator', icon: '🏃', label: 'Treadmill', desc: 'Calories burned' },
  { to: '/calculators/bmi',     icon: '⚖️', label: 'BMI',            desc: 'Body Mass Index' },
  { to: '/calculators/zone2',   icon: '💓', label: 'Zone 2',         desc: 'Heart rate zones' },
  { to: '/calculators/one-rep-max', icon: '🏋️', label: '1 Rep Max',  desc: 'Strength percentages' },
  { to: '/calculators/ideal-weight', icon: '🎯', label: 'Ideal Weight', desc: '4 formula comparison' },
];

// ── Nutrition reference quick links ───────────────────────────
const REFERENCE = [
  { to: '/high-protein-foods',           icon: '🍗', label: 'High Protein Foods' },
  { to: '/high-fibre-foods',             icon: '🫘', label: 'High Fibre Foods' },
  { to: '/low-calorie-high-volume-foods',icon: '🥦', label: 'Low Calorie Foods' },
  { to: '/cheapest-protein-sources',     icon: '💰', label: 'Cheapest Protein' },
  { to: '/best-foods-for-each-macro',    icon: '📊', label: 'Best Foods by Macro' },
];

export default function HomePage() {
  const { data: featured, loading: fLoad } = useFetch(api.articles.featured, []);
  const { data: latest,   loading: lLoad } = useFetch(() => api.articles.list({ limit: 4 }), []);

  return (
    <>
      <Helmet>
        <title>LiftAndBurn — Training, Nutrition & Fat Loss</title>
        <meta name="description" content="Science-backed training guides, free fitness calculators, and nutrition reference pages. Strength training, cardio, macros, and fat loss — no fluff." />
        <link rel="canonical" href="https://liftandburn.fit/" />
      </Helmet>

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="hero">
        <div className="container hero__inner">

          <div className="hero__content">
            <div className="hero__eyebrow fade-up">No fluff. No junk volume. Just what works.</div>
            <h1 className="hero__title fade-up-2">
              TRAIN SMARTER.<br />
              <span className="hero__title-accent">EAT BETTER.</span><br />
              GET RESULTS.
            </h1>
            <p className="hero__sub fade-up-3">
              Science-backed guides, free calculators, and nutrition references
              for anyone who wants to get stronger, leaner, and fitter.
            </p>
            <div className="hero__actions fade-up-4">
              <Link to="/articles" className="btn-primary">Read the Articles →</Link>
              <Link to="/calculators" className="btn-ghost">Free Calculators</Link>
            </div>
          </div>

          {/* Floating stat cards */}
          <div className="hero__cards fade-up-3">
            <div className="hero__card">
              <span className="hero__card-icon">📚</span>
              <span className="hero__card-num">20+</span>
              <span className="hero__card-label">Articles</span>
            </div>
            <div className="hero__card hero__card--accent">
              <span className="hero__card-icon">🧮</span>
              <span className="hero__card-num">10+</span>
              <span className="hero__card-label">Calculators</span>
            </div>
            <div className="hero__card">
              <span className="hero__card-icon">🥗</span>
              <span className="hero__card-num">5</span>
              <span className="hero__card-label">Food References</span>
            </div>
            <div className="hero__card hero__card--accent">
              <span className="hero__card-icon">📄</span>
              <span className="hero__card-num">2</span>
              <span className="hero__card-label">PDF Guides</span>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          WHAT WE COVER
      ══════════════════════════════════════════════════ */}
      <section className="section section--pillars">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Three pillars</span>
            <h2 className="section-title">WHAT WE COVER</h2>
          </div>
          <div className="pillars-grid">
            {PILLARS.map(p => (
              <Link key={p.to} to={p.to} className="pillar-card" style={{ '--pillar-colour': p.colour }}>
                <div className="pillar-card__top">
                  <span className="pillar-card__icon">{p.icon}</span>
                  <span className="pillar-card__arrow">→</span>
                </div>
                <span className="pillar-card__label">{p.label}</span>
                <span className="pillar-card__desc">{p.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURED ARTICLES
      ══════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Start here</span>
            <h2 className="section-title">FEATURED ARTICLES</h2>
            <Link to="/articles" className="section-view-all">All articles →</Link>
          </div>
          {fLoad ? <Skeleton /> : (
            <div className="article-list">
              {featured?.articles?.map(a => <ArticleCard key={a.slug} article={a} featured />)}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CALCULATORS
      ══════════════════════════════════════════════════ */}
      <section className="section section--tools">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Free tools</span>
            <h2 className="section-title">FITNESS CALCULATORS</h2>
            <Link to="/calculators" className="section-view-all">All calculators →</Link>
          </div>
          <div className="tools-grid">
            {TOOLS.map(t => (
              <Link key={t.to} to={t.to} className="tool-card">
                <span className="tool-card__icon">{t.icon}</span>
                <span className="tool-card__label">{t.label}</span>
                <span className="tool-card__desc">{t.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        <div className="adsense-slot">AdSense · 728×90</div>
      </div>

      {/* ══════════════════════════════════════════════════
          NUTRITION REFERENCE
      ══════════════════════════════════════════════════ */}
      <section className="section section--reference">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Nutrition reference</span>
            <h2 className="section-title">FOOD DATABASES</h2>
          </div>
          <div className="reference-strip">
            {REFERENCE.map(r => (
              <Link key={r.to} to={r.to} className="reference-card">
                <span className="reference-card__icon">{r.icon}</span>
                <span className="reference-card__label">{r.label}</span>
                <span className="reference-card__arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          STORE PROMO
      ══════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div className="store-banner">
            <div className="store-banner__text">
              <span className="section-eyebrow">Training programs & guides</span>
              <h2 className="store-banner__title">TAKE IT FURTHER</h2>
              <p className="store-banner__desc">
                The Torso & Limbs 12-Week Program and Walk Your Way Lean guide —
                structured PDF programs built around the same principles as everything on this site.
                No junk volume. No fluff.
              </p>
              <Link to="/programs" className="btn-primary" style={{ marginTop: 16, display: 'inline-block' }}>
                Visit the Store →
              </Link>
            </div>
            <div className="store-banner__products">
              <Link to="/programs/torso-limbs-12-week" className="store-product-card">
                <span className="store-product-card__tag">$15 · PDF</span>
                <span className="store-product-card__title">Torso & Limbs<br />12-Week Program</span>
                <span className="store-product-card__detail">4 days/week · All levels · Under 1 hour</span>
              </Link>
              <Link to="/programs/walk-your-way-lean" className="store-product-card">
                <span className="store-product-card__tag">$9 · PDF</span>
                <span className="store-product-card__title">Walk Your<br />Way Lean</span>
                <span className="store-product-card__detail">12-3-30 · Zone 2 · 8-week plan</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          LATEST ARTICLES
      ══════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Fresh content</span>
            <h2 className="section-title">LATEST ARTICLES</h2>
            <Link to="/articles" className="section-view-all">View all →</Link>
          </div>
          {lLoad ? <Skeleton /> : (
            <div className="article-list">
              {latest?.articles?.map(a => <ArticleCard key={a.slug} article={a} />)}
            </div>
          )}
        </div>
      </section>

      <div className="container">
        <div className="adsense-slot">AdSense · 728×90</div>
      </div>

    </>
  );
}