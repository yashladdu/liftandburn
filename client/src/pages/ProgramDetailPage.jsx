import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../api';
import { useFetch } from '../hooks/useFetch';
import './ProgramsPage.css';

const DIFFICULTY_COLOUR = {
  beginner:     '#4ade80',
  intermediate: '#f59e0b',
  advanced:     '#ef4444',
};

function BuyButton({ gumroadUrl, price }) {
  return (
    <div className="buy-box">
      <div className="buy-box__text">
        <h3 className="buy-box__title">Get the Full 12-Week Program</h3>
        <ul className="buy-box__list">
          <li>✓ Full 12-week rotation — all four sessions every week</li>
          <li>✓ Warm-up protocol for every session</li>
          <li>✓ Complete superset guide — finish in under 1 hour</li>
          <li>✓ Progressive overload guidelines week by week</li>
          <li>✓ Nutrition guide — protein, calories, meal timing</li>
          <li>✓ Progress tracking templates for all four sessions</li>
          <li>✓ Instant PDF download · Yours forever</li>
        </ul>
      </div>
      <div className="buy-box__action">
        <span className="buy-box__price">${price}</span>
        <span className="buy-box__price-note">one-time · instant download</span>
        <a
          href={gumroadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="buy-box__btn"
        >
          Buy Now — ${price} →
        </a>
        <span className="buy-box__guarantee">30-day money-back guarantee</span>
      </div>
    </div>
  );
}

export default function ProgramDetailPage() {
  const { slug } = useParams();
  const { data, loading, error } = useFetch(() => api.programs.bySlug(slug), [slug]);

  if (loading) return <div className="article-loading container">Loading program…</div>;
  if (error)   return <div className="article-error container">Program not found.</div>;

  const { program } = data;
  const colour = DIFFICULTY_COLOUR[program.difficulty] || '#888';

  return (
    <>
      <Helmet>
        <title>{program.title} — LiftAndBurn</title>
        <meta name="description" content={program.description} />
        <link rel="canonical" href={`https://liftandburn.fit/programs/${program.slug}`} />
      </Helmet>

      <div className="program-detail container">

        {/* ── Header ──────────────────────────────────── */}
        <header className="program-detail__header fade-up">
          <div className="calc-breadcrumb">
            <Link to="/programs">Programs</Link> › {program.title}
          </div>

          <div className="program-detail__badges">
            <span className="program-card__difficulty" style={{ borderColor: colour, color: colour }}>
              {program.difficulty}
            </span>
            <span className="tag">{program.category}</span>
            <span className="tag">📅 {program.duration} weeks</span>
            <span className="tag">💪 {program.daysPerWeek} days/week</span>
          </div>

          <h1 className="program-detail__title">{program.title}</h1>
          <p className="program-detail__desc">{program.description}</p>

          {program.equipment?.length > 0 && (
            <div className="program-detail__equipment">
              <span className="program-detail__equipment-label">Equipment needed:</span>
              {program.equipment.map(e => <span key={e} className="tag">{e}</span>)}
            </div>
          )}

          {program.highlights?.length > 0 && (
            <ul className="program-detail__highlights">
              {program.highlights.map((h, i) => (
                <li key={i}><span>✓</span>{h}</li>
              ))}
            </ul>
          )}
        </header>

        {/* ── AdSense ─────────────────────────────────── */}
        <div className="adsense-slot">AdSense · 728×90</div>

        {/* ── Preview content (overview + philosophy) ──── */}
        <div
          className="article-body program-body"
          dangerouslySetInnerHTML={{ __html: program.previewHtml }}
        />

        {/* ── Buy box ──────────────────────────────────── */}
        <BuyButton gumroadUrl={program.gumroadUrl} price={program.price} />

        {/* ── Locked content blur ──────────────────────── */}
        {program.hasLockedContent && (
          <div className="program-locked">
            <div
              className="program-locked__content article-body"
              dangerouslySetInnerHTML={{ __html: program.lockedHtml }}
            />
            <div className="program-locked__overlay">
              <div className="program-locked__cta">
                <span className="program-locked__icon">🔒</span>
                <h3>The full program is in the PDF</h3>
                <p>All four sessions in full, the complete 12-week schedule, superset guide, warm-up protocols, nutrition guide, and progress tracking templates.</p>
                <a
                  href={program.gumroadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="buy-box__btn"
                  style={{ display: 'inline-block', marginTop: 16 }}
                >
                  Get Full Program — ${program.price} →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── Bottom AdSense ───────────────────────────── */}
        <div className="adsense-slot">AdSense · 728×90</div>

      </div>
    </>
  );
}