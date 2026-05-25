import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './AboutPage.css';

const VALUES = [
  { icon: '📖', title: 'Self-taught, not textbook', desc: 'Everything we write comes from real training experience — not theory. We learned by doing, failing, and figuring it out.' },
  { icon: '🔬', title: 'Backed by research', desc: 'We cross-reference our experience with actual sports science. If the research disagrees with us, we say so.' },
  { icon: '🚫', title: 'No supplements, no sponsorships', desc: 'We don\'t sell anything. No affiliate deals, no sponsored posts. Just honest information.' },
  { icon: '🆓', title: 'Free, forever', desc: 'Every article, calculator, and guide on this site is completely free. No paywalls, no sign-ups.' },
];

const TOPICS = [
  { icon: '🏋️', label: 'Weightlifting', to: '/category/weightlifting' },
  { icon: '🏃', label: 'Steady-State Cardio', to: '/category/cardio' },
  { icon: '📈', label: 'Body Recomposition', to: '/category/recomp' },
  { icon: '🧮', label: 'Fitness Calculators', to: '/calculators' },
];

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About LiftAndBurn — Hybrid Athlete Training</title>
        <link rel="canonical" href="https://liftandburn.fit/" />
        <meta name="description" content="LiftAndBurn is a free training resource for people who want to lift heavy and stay lean — built by self-taught gym-goers who figured it out the hard way." />
      </Helmet>

      <div className="about-page container">

        {/* ── Hero ──────────────────────────────────────── */}
        <header className="about-hero fade-up">
          <span className="about-eyebrow">Who we are</span>
          <h1 className="about-title">WE FIGURED IT OUT<br />THE HARD WAY.</h1>
          <p className="about-lead">
            LiftAndBurn is a free training resource for people who want to be strong
            and lean — without picking one or the other. No gym science degree required.
          </p>
        </header>

        {/* ── Story ─────────────────────────────────────── */}
        <section className="about-section fade-up-2">
          <div className="about-story">
            <div className="about-story__text">
              <h2>The story</h2>
              <p>
                We started training the way most people do — copying whatever looked
                impressive on the internet, doing too much, recovering too little, and
                wondering why progress stalled after a few months.
              </p>
              <p>
                Over time, through a lot of trial and error (and a lot of reading),
                we landed on something that actually works: heavy compound lifting
                paired with steady-state cardio, progressive overload tracked every
                session, and enough rest to actually adapt.
              </p>
              <p>
                Simple stuff. But nobody explains it plainly. That's why we built this site.
              </p>
              <p>
                LiftAndBurn is what we wish existed when we started — a no-nonsense
                resource covering the intersection of strength training and cardio,
                written by people who actually do it.
              </p>
            </div>
            <div className="about-story__stat-card">
              <div className="about-stat">
                <span className="about-stat__num">100%</span>
                <span className="about-stat__label">Self-taught</span>
              </div>
              <div className="about-stat">
                <span className="about-stat__num">0</span>
                <span className="about-stat__label">Sponsorships</span>
              </div>
              <div className="about-stat">
                <span className="about-stat__num">Free</span>
                <span className="about-stat__label">Always</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── What we cover ─────────────────────────────── */}
        <section className="about-section fade-up-3">
          <h2 className="about-section-title">WHAT WE COVER</h2>
          <div className="about-topics">
            {TOPICS.map((t) => (
              <Link key={t.label} to={t.to} className="about-topic-card">
                <span className="about-topic-icon">{t.icon}</span>
                <span className="about-topic-label">{t.label}</span>
                <span className="about-topic-link">Browse →</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Values ────────────────────────────────────── */}
        <section className="about-section fade-up-4">
          <h2 className="about-section-title">HOW WE DO THINGS</h2>
          <div className="about-values">
            {VALUES.map((v) => (
              <div key={v.title} className="about-value-card">
                <span className="about-value-icon">{v.icon}</span>
                <h3 className="about-value-title">{v.title}</h3>
                <p className="about-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Editorial policy ──────────────────────────── */}
        <section className="about-section">
          <div className="about-policy">
            <h2>Our editorial approach</h2>
            <p>
              Every article on LiftAndBurn is written from personal training experience
              and cross-referenced with published sports science research where available.
              We cite sources when we make specific claims about physiology or research findings.
            </p>
            <p>
              We cover weightlifting, steady-state cardio, and body recomposition —
              the three pillars of hybrid athlete training. We don't cover extreme
              dieting, dangerous training practices, or anything that requires a medical
              professional's supervision.
            </p>
            <p>
              <strong>Health disclaimer:</strong> The content on LiftAndBurn is for
              informational purposes only. It is not a substitute for professional
              medical advice. If you have a health condition or injury, consult a
              qualified professional before starting any training programme.
            </p>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────── */}
        <section className="about-cta">
          <h2 className="about-cta__title">START HERE</h2>
          <p className="about-cta__sub">Not sure where to begin? These are the best starting points.</p>
          <div className="about-cta__links">
            <Link to="/articles/how-to-combine-weightlifting-and-cardio" className="about-cta__card">
              <span>🏋️</span>
              <span>How to combine lifting and cardio</span>
            </Link>
            <Link to="/articles/progressive-overload-for-beginners" className="about-cta__card">
              <span>📈</span>
              <span>Progressive overload for beginners</span>
            </Link>
            <Link to="/articles/best-weekly-schedule-lifting-and-cardio" className="about-cta__card">
              <span>📅</span>
              <span>The best weekly training schedule</span>
            </Link>
            <Link to="/calculators" className="about-cta__card">
              <span>🧮</span>
              <span>Free fitness calculators</span>
            </Link>
          </div>
        </section>

      </div>
    </>
  );
}
