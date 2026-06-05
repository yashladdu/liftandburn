import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../calculators/CalcPage.css';
import './IdealWeightCalculator.css';

// ── Formulas (all return kg, input height in cm, sex) ─────────
const cmToIn = cm => cm / 2.54;

// Devine (1974) — most widely used clinically
// Male:   50 + 2.3 × (height_in − 60)
// Female: 45.5 + 2.3 × (height_in − 60)
function devine(heightCm, sex) {
  const base = sex === 'male' ? 50 : 45.5;
  return base + 2.3 * (cmToIn(heightCm) - 60);
}

// Robinson (1983)
// Male:   52 + 1.9 × (height_in − 60)
// Female: 49 + 1.7 × (height_in − 60)
function robinson(heightCm, sex) {
  const [base, mult] = sex === 'male' ? [52, 1.9] : [49, 1.7];
  return base + mult * (cmToIn(heightCm) - 60);
}

// Miller (1983)
// Male:   56.2 + 1.41 × (height_in − 60)
// Female: 53.1 + 1.36 × (height_in − 60)
function miller(heightCm, sex) {
  const [base, mult] = sex === 'male' ? [56.2, 1.41] : [53.1, 1.36];
  return base + mult * (cmToIn(heightCm) - 60);
}

// Hamwi (1964) — oldest, still used in clinical settings
// Male:   48 + 2.7 × (height_in − 60)
// Female: 45.4 + 2.3 × (height_in − 60)
function hamwi(heightCm, sex) {
  const [base, mult] = sex === 'male' ? [48, 2.7] : [45.4, 2.3];
  return base + mult * (cmToIn(heightCm) - 60);
}

const FORMULAS = [
  { id: 'devine',   label: 'Devine',   year: 1974, fn: devine,   note: 'Most widely used — standard for medication dosing' },
  { id: 'robinson', label: 'Robinson', year: 1983, fn: robinson, note: 'Refined update to Devine' },
  { id: 'miller',   label: 'Miller',   year: 1983, fn: miller,   note: 'Tends to give lower estimates' },
  { id: 'hamwi',    label: 'Hamwi',    year: 1964, fn: hamwi,    note: 'Oldest formula, still used clinically' },
];

function round1(n) { return Math.round(n * 10) / 10; }
function kgToLbs(kg) { return Math.round(kg * 2.205 * 10) / 10; }

// ── Range bar ─────────────────────────────────────────────────
function RangeBar({ results, avg, unit }) {
  if (!results.length) return null;
  const vals  = results.map(r => r.kg);
  const min   = Math.min(...vals);
  const max   = Math.max(...vals);
  const span  = max - min;
  const floor = min - 5;
  const ceil  = max + 5;
  const total = ceil - floor;
  const toPct = v => ((v - floor) / total) * 100;

  return (
    <div className="ibw-rangebar">
      <div className="ibw-rangebar__track">
        {/* Filled range band */}
        <div className="ibw-rangebar__band"
          style={{ left: `${toPct(min)}%`, width: `${toPct(max) - toPct(min)}%` }} />
        {/* Individual formula needles */}
        {results.map(r => (
          <div key={r.id} className="ibw-rangebar__needle"
            style={{ left: `${toPct(r.kg)}%` }}
            title={`${r.label}: ${unit === 'kg' ? r.kg + ' kg' : kgToLbs(r.kg) + ' lbs'}`}
          />
        ))}
        {/* Average marker */}
        <div className="ibw-rangebar__avg" style={{ left: `${toPct(avg)}%` }}>
          <div className="ibw-rangebar__avg-line" />
          <div className="ibw-rangebar__avg-label">avg</div>
        </div>
      </div>
      <div className="ibw-rangebar__ends">
        <span>{unit === 'kg' ? `${round1(min)} kg` : `${kgToLbs(min)} lbs`}</span>
        <span>{unit === 'kg' ? `${round1(max)} kg` : `${kgToLbs(max)} lbs`}</span>
      </div>
    </div>
  );
}

export default function IdealWeightCalculator() {
  const [unit,   setUnit]   = useState('metric');
  const [sex,    setSex]    = useState('male');
  const [height, setHeight] = useState('');

  // Convert to cm for formulas
  const heightCm = unit === 'metric'
    ? parseFloat(height) || 0
    : (parseFloat(height) || 0) * 2.54;

  const valid = heightCm >= 140 && heightCm <= 220;

  const results = valid ? FORMULAS.map(f => ({
    id:    f.id,
    label: f.label,
    year:  f.year,
    note:  f.note,
    kg:    round1(f.fn(heightCm, sex)),
  })) : [];

  const avg = results.length
    ? round1(results.reduce((s, r) => s + r.kg, 0) / results.length)
    : 0;

  const minR = results.length ? Math.min(...results.map(r => r.kg)) : 0;
  const maxR = results.length ? Math.max(...results.map(r => r.kg)) : 0;

  const display = v => unit === 'metric' ? `${v} kg` : `${kgToLbs(v)} lbs`;
  const uL = unit === 'metric' ? 'cm' : 'in';

  return (
    <>
      <Helmet>
        <title>Ideal Body Weight Calculator — 4 Formula Comparison | LiftAndBurn</title>
        <meta name="description" content="Calculate your ideal body weight using all four major formulas — Devine, Robinson, Miller, and Hamwi. See how they compare and why the result has real limitations." />
        <link rel="canonical" href="https://liftandburn.fit/calculators/ideal-weight" />
      </Helmet>

      <div className="calc-page container">
        <div className="calc-breadcrumb">
          <Link to="/calculators">Calculators</Link> › Ideal Body Weight
        </div>
        <h1 className="calc-page__title">Ideal Body Weight Calculator</h1>

        <div className="calc-layout">
          <div className="calc-main">

            {/* ── Toggles ─────────────────────────────────── */}
            <div className="ibw-toggles">
              <div className="ibw-toggle-group">
                <button className={`ibw-toggle ${unit === 'metric' ? 'active' : ''}`} onClick={() => { setUnit('metric'); setHeight(''); }}>Metric (cm)</button>
                <button className={`ibw-toggle ${unit === 'imperial' ? 'active' : ''}`} onClick={() => { setUnit('imperial'); setHeight(''); }}>Imperial (in)</button>
              </div>
              <div className="ibw-toggle-group">
                <button className={`ibw-toggle ${sex === 'male' ? 'active' : ''}`} onClick={() => setSex('male')}>Male</button>
                <button className={`ibw-toggle ${sex === 'female' ? 'active' : ''}`} onClick={() => setSex('female')}>Female</button>
              </div>
            </div>

            {/* ── Input ───────────────────────────────────── */}
            <div className="calc-box">
              <div className="calc-grid" style={{ gridTemplateColumns: '1fr', maxWidth: 280 }}>
                <div className="calc-row">
                  <label>Height ({uL})</label>
                  <input
                    type="number" min="1"
                    placeholder={unit === 'metric' ? 'e.g. 178' : 'e.g. 70'}
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                  />
                </div>
              </div>
              {height && !valid && (
                <p className="ibw-error">Please enter a height between {unit === 'metric' ? '140–220 cm' : '55–87 in'}.</p>
              )}
            </div>

            {/* ── Results ─────────────────────────────────── */}
            {valid && results.length > 0 && (
              <>
                {/* Primary — average */}
                <div className="calc-box ibw-primary">
                  <div className="ibw-primary__label">Average across 4 formulas</div>
                  <div className="ibw-primary__value">{display(avg)}</div>
                  <div className="ibw-primary__range">
                    Range: {display(minR)} — {display(maxR)}
                  </div>
                  <RangeBar results={results} avg={avg} unit={unit === 'metric' ? 'kg' : 'lbs'} />
                </div>

                {/* Formula breakdown */}
                <div className="calc-box">
                  <p className="ibw-section-label">Formula breakdown</p>
                  <div className="ibw-formula-grid">
                    {results.map(r => (
                      <div key={r.id} className="ibw-formula-card">
                        <div className="ibw-formula-card__top">
                          <span className="ibw-formula-card__name">{r.label}</span>
                          <span className="ibw-formula-card__year">{r.year}</span>
                        </div>
                        <div className="ibw-formula-card__value">{display(r.kg)}</div>
                        <div className="ibw-formula-card__note">{r.note}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Honest context box */}
                <div className="ibw-context-box">
                  <div className="ibw-context-box__icon">⚠️</div>
                  <div>
                    <strong>These are clinical estimates, not fitness targets.</strong>
                    <p>These formulas were derived from population studies in the 1960s–80s and are primarily used for drug dosing in clinical settings. They only account for height and sex — not muscle mass, body frame, age, or body composition.</p>
                    <p>A lean, muscular person at "above ideal" weight by these formulas may be in far better condition than a sedentary person at exactly "ideal" weight. For fitness goals, <strong>body fat percentage</strong> is a more meaningful target than scale weight alone.</p>
                    <div className="ibw-context-box__links">
                      <Link to="/calculators/body-fat">Body Fat Calculator →</Link>
                      <Link to="/calculators/bmi">BMI Calculator</Link>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── SEO content ─────────────────────────────── */}
            <div className="calc-instructions">
              <h2>What is ideal body weight?</h2>
              <p>Ideal body weight (IBW) is a clinically derived estimate of the weight at which a person of a given height is expected to have optimal health outcomes. The formulas were not designed as fitness goals — they were created to standardise drug dosing, since many medications are dosed by weight and require a standardised reference rather than a patient's actual (possibly obese) weight.</p>

              <h2>The four formulas explained</h2>
              <p><strong>Devine (1974)</strong> is the most widely used formula and remains the standard reference in clinical pharmacology. It was developed by Dr B.J. Devine from a sample of men and women of varying heights.</p>
              <p><strong>Robinson (1983)</strong> is a slight refinement of Devine, developed to correct for what some researchers felt was a slight overestimate at shorter heights.</p>
              <p><strong>Miller (1983)</strong> was developed alongside Robinson and tends to produce the lowest estimates of the four — more conservative in what it considers "ideal."</p>
              <p><strong>Hamwi (1964)</strong> is the oldest formula still in regular clinical use. It was developed at the American Diabetes Association and remains common in dietetics practice. The Hamwi formula tends to give slightly higher estimates than the others.</p>

              <h2>Why they disagree</h2>
              <p>The four formulas were derived from different populations at different times, using slightly different methodological approaches. For a 178cm male, the results span roughly 5–6 kg across all four. None of them is objectively more correct than the others — they are all estimates based on population averages from decades ago.</p>

              <h2>The limitations you should know</h2>
              <p>Ideal body weight formulas have been criticised in the medical literature for several decades. Key limitations: they do not account for muscle mass (a bodybuilder will be classified as overweight), body frame size (a large-framed person will be underestimated), age (older adults naturally carry more body fat at the same weight), or ethnicity (the formulas were derived primarily from Western populations).</p>
              <p>For anyone training seriously, body fat percentage is a far more meaningful metric. Two people can weigh exactly the same and have completely different body compositions — one lean and muscular, one sedentary and overfat. The scale weight alone tells you nothing about this difference.</p>

              <div className="calc-links">
                <Link to="/calculators/body-fat">Body Fat Calculator →</Link>
                <span>|</span>
                <Link to="/calculators/bmi">BMI Calculator</Link>
                <span>|</span>
                <Link to="/calculators/tdee">TDEE Calculator</Link>
                <span>|</span>
                <Link to="/calculators">All Calculators</Link>
              </div>
            </div>

          </div>

          {/* ── Sidebar ──────────────────────────────────── */}
          <aside className="calc-sidebar">
            <div className="adsense-slot" style={{ minHeight: 250 }}>AdSense · 300×250</div>
            <div className="calc-related">
              <h3>Related Calculators</h3>
              <Link to="/calculators/body-fat">Body Fat Calculator</Link>
              <Link to="/calculators/bmi">BMI Calculator</Link>
              <Link to="/calculators/tdee">TDEE Calculator</Link>
              <Link to="/calculators/macros">Macro Calculator</Link>
            </div>
            <div className="calc-related">
              <h3>Related Articles</h3>
              <Link to="/articles/why-the-scale-lies-measure-fat-loss">Why the Scale Lies</Link>
              <Link to="/articles/how-much-protein-to-build-muscle">How Much Protein Do You Need?</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
