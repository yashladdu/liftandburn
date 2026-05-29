import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../api';
import { useFetch } from '../hooks/useFetch';
import './ProgramsPage.css';

const DIFFICULTY_COLOUR = {
  beginner:     '#4ade80',
  intermediate: '#f59e0b',
  advanced:     '#ef4444',
};

const CATEGORY_ICONS = {
  hybrid:        '⚡',
  weightlifting: '🏋️',
  cardio:        '🚶',
  recomp:        '📈',
};

function ProgramCard({ program }) {
  const colour = DIFFICULTY_COLOUR[program.difficulty] || '#888';
  const icon   = CATEGORY_ICONS[program.category]      || '📋';

  return (
    <Link to={`/programs/${program.slug}`} className="program-card">
      <div className="program-card__header">
        <span className="program-card__icon">{icon}</span>
        <div className="program-card__badges">
          <span className="program-card__difficulty" style={{ borderColor: colour, color: colour }}>
            {program.difficulty}
          </span>
          <span className="program-card__price">${program.price}</span>
        </div>
      </div>

      <h3 className="program-card__title">{program.title}</h3>
      <p className="program-card__desc">{program.description}</p>

      <div className="program-card__meta">
        <span>📅 {program.duration} weeks</span>
        <span>💪 {program.daysPerWeek} days/week</span>
      </div>

      {program.highlights?.length > 0 && (
        <ul className="program-card__highlights">
          {program.highlights.slice(0, 3).map((h, i) => (
            <li key={i}>✓ {h}</li>
          ))}
        </ul>
      )}

      <div className="program-card__footer">
        <span className="program-card__preview">
          {program.category === 'cardio' ? 'Free preview inside' : 'Week 1 free preview'}
        </span>
        <span className="program-card__cta">
          {program.category === 'cardio' ? 'View Guide →' : 'View Program →'}
        </span>
      </div>
    </Link>
  );
}

export default function ProgramsPage() {
  const { data, loading } = useFetch(api.programs.list, []);

  return (
    <>
      <Helmet>
        <title>Training Programs — LiftAndBurn</title>
        <meta name="description" content="Structured training programs for hybrid athletes — weightlifting, cardio, and hybrid programs with full progressive overload built in." />
        <link rel="canonical" href="https://liftandburn.fit/programs" />
      </Helmet>

      <div className="programs-page container">
        <header className="programs-header fade-up">
          <span className="programs-eyebrow">Programs &amp; Guides</span>
          <h1 className="programs-title">STORE</h1>
          <p className="programs-sub">
            Training programs and fat loss guides. Week 1 of every program is always free — buy the full PDF when you're ready to commit.
          </p>
        </header>

        <div className="adsense-slot">AdSense · 728×90</div>

        {loading ? (
          <div className="programs-skeleton">
            {[1, 2, 3].map(i => <div key={i} className="program-card-skeleton" />)}
          </div>
        ) : (
          <div className="programs-grid">
            {data?.programs?.map(p => <ProgramCard key={p.slug} program={p} />)}
          </div>
        )}

        {/* What's included explainer */}
        <div className="programs-explainer">
          <h2 className="programs-explainer__title">HOW IT WORKS</h2>
          <div className="programs-explainer__grid">
            <div className="programs-explainer__item">
              <span>👁️</span>
              <h3>Free Week 1 Preview</h3>
              <p>Every program shows Week 1 in full — all exercises, sets, reps, and rest periods. No sign-up required.</p>
            </div>
            <div className="programs-explainer__item">
              <span>📄</span>
              <h3>PDF Download</h3>
              <p>Buy the full program and get an instant PDF download via Gumroad. Print it, save it, use it in the gym.</p>
            </div>
            <div className="programs-explainer__item">
              <span>📈</span>
              <h3>Progressive Overload Built In</h3>
              <p>Every program has week-by-week progression built in. You never have to guess what to do next.</p>
            </div>
            <div className="programs-explainer__item">
              <span>♾️</span>
              <h3>Yours Forever</h3>
              <p>One payment, yours to keep. No subscription, no expiry. Run it multiple times as you get stronger.</p>
            </div>
          </div>
        </div>

        <div className="adsense-slot">AdSense · 728×90</div>
      </div>
    </>
  );
}
