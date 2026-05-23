import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import { useFetch } from '../hooks/useFetch';
import ArticleCard from '../components/ArticleCard';
import './HomePage.css';

function Skeleton() {
  return (
    <div className="skeleton-list">
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton-card" />
      ))}
    </div>
  );
}

// Animated counting number
function CountUp({ target, suffix = '', duration = 1200 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function HomePage() {
  const { data: featured, loading: fLoad } = useFetch(api.articles.featured, []);
  const { data: latest,   loading: lLoad } = useFetch(
    () => api.articles.list({ limit: 6 }), []
  );
  const { data: cats } = useFetch(api.categories.list, []);
  const articleCount = latest?.pagination?.total || 0;

  return (
    <>
      <Helmet>
        <title>LiftAndBurn — Hybrid Athlete Training</title>
        <meta name="description" content="Science-backed guides for building strength and endurance. Weightlifting, steady-state cardio, and body recomp for hybrid athletes." />
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__content">
            <div className="hero__eyebrow fade-up">Hybrid Athlete Training</div>
            <h1 className="hero__title fade-up-2">
              LIFT HEAVY.<br />RUN LEAN.
            </h1>
            <p className="hero__sub fade-up-3">
              Science-backed guides for building strength and endurance —
              without sacrificing either. For people serious about both.
            </p>
            <div className="hero__actions fade-up-4">
              <Link to="/articles" className="btn-primary">Browse All Articles →</Link>
              <Link to="/category/weightlifting" className="btn-ghost">Start Lifting</Link>
            </div>
          </div>

          <div className="hero__stats fade-up-3">
            <div className="hero__stat">
              <span className="hero__stat-num">
                <CountUp target={articleCount} suffix="+" duration={1000} />
              </span>
              <span className="hero__stat-label">Articles</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-num">
                <CountUp target={3} duration={600} />
              </span>
              <span className="hero__stat-label">Topics</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-num">Free</span>
              <span className="hero__stat-label">Always</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── AdSense top banner ─────────────────────────── */}
      <div className="container">
        <div className="adsense-slot">AdSense · 728×90</div>
      </div>

      {/* ── Categories ────────────────────────────────────── */}
      {cats?.categories && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Browse by topic</span>
              <h2 className="section-title">WHAT WE COVER</h2>
            </div>
            <div className="cat-grid">
              {[
                { name: 'weightlifting', icon: '🏋️', label: 'Weightlifting', desc: 'Progressive overload, compound lifts, and strength programming.' },
                { name: 'cardio',        icon: '🏃', label: 'Steady-State Cardio', desc: 'Zone 2 training, fat-burning, and endurance without killing your gains.' },
                { name: 'recomp',        icon: '📈', label: 'Body Recomp', desc: 'Lose fat and build muscle simultaneously — the hybrid way.' },
              ].map((c) => (
                <Link key={c.name} to={`/category/${c.name}`} className="cat-card">
                  <span className="cat-card__icon">{c.icon}</span>
                  <span className="cat-card__label">{c.label}</span>
                  <span className="cat-card__desc">{c.desc}</span>
                  <span className="cat-card__link">Explore →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured ──────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Editor's picks</span>
            <h2 className="section-title">FEATURED ARTICLES</h2>
          </div>
          {fLoad ? <Skeleton /> : (
            <div className="article-list">
              {featured?.articles?.map((a) => (
                <ArticleCard key={a.slug} article={a} featured />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── AdSense mid ───────────────────────────────────── */}
      <div className="container">
        <div className="adsense-slot">AdSense · 728×90</div>
      </div>

      {/* ── Latest ────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Fresh content</span>
            <h2 className="section-title">LATEST ARTICLES</h2>
            <Link to="/articles" className="section-view-all">View all →</Link>
          </div>
          {lLoad ? <Skeleton /> : (
            <div className="article-list">
              {latest?.articles?.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Newsletter (commented out until Mailchimp is set up) ──
      <section className="container">
        <div className="newsletter">
          <div className="newsletter__text">
            <h3 className="newsletter__title">JOIN THE GRIND</h3>
            <p className="newsletter__sub">Weekly training tips. No spam, just gains.</p>
          </div>
          <div className="newsletter__form">
            <input type="email" placeholder="your@email.com" />
            <button className="btn-primary">Subscribe</button>
          </div>
        </div>
      </section>
      ── */}
    </>
  );
}
