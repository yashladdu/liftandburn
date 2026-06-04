import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './CalcPage.css';

// Calories from steps using MET-based approach
// Average step = ~0.75m for walking, speed ~5 km/h, MET ~3.5
// Calories = MET × weight(kg) × duration(hours)
// Duration estimated from steps: steps / cadence (steps/min) / 60
// Average walking cadence: ~100 steps/min
// More accurate: calories per step = MET × weight × (1/cadence) / 60
// We use pace-adjusted MET values

const PACE_OPTIONS = [
  { label: 'Slow (< 80 steps/min)',     cadence: 70,  met: 2.5,  speed: '~3 km/h'  },
  { label: 'Normal (80–100 steps/min)', cadence: 90,  met: 3.5,  speed: '~5 km/h'  },
  { label: 'Brisk (100–120 steps/min)', cadence: 110, met: 4.3,  speed: '~6 km/h'  },
  { label: 'Fast (> 120 steps/min)',    cadence: 130, met: 5.0,  speed: '~7 km/h'  },
];

const WEIGHT_UNITS = ['kg', 'lbs'];
const toKg = (w, u) => u === 'lbs' ? w * 0.453592 : w;

// Distance estimation: stride length ≈ 0.413 × height(m)
// If no height, use average stride of 0.762m (avg adult)
const stepsToDistance = (steps, heightCm) => {
  const h = heightCm ? heightCm / 100 : 1.75;
  const stride = 0.413 * h;
  return steps * stride;
};

const STEP_GOALS = [2000, 5000, 7500, 10000, 12500, 15000, 20000];

export default function StepsCalculator() {
  const [steps,      setSteps]      = useState('');
  const [weight,     setWeight]     = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [paceIdx,    setPaceIdx]    = useState(1); // Normal by default
  const [heightCm,   setHeightCm]   = useState('');
  const [result,     setResult]     = useState(null);
  const [error,      setError]      = useState('');

  const calculate = () => {
    setError('');
    const s = parseInt(steps);
    const w = parseFloat(weight);
    if (!s || s <= 0)  return setError('Enter a valid step count.');
    if (!w || w <= 0)  return setError('Enter a valid body weight.');

    const weightKg  = toKg(w, weightUnit);
    const pace      = PACE_OPTIONS[paceIdx];
    const durationH = s / pace.cadence / 60;
    const calories  = Math.round(pace.met * weightKg * durationH);
    const distanceM = stepsToDistance(s, parseFloat(heightCm) || 0);
    const distanceKm = Math.round(distanceM / 10) / 100;
    const distanceMi = Math.round((distanceM / 1609.34) * 100) / 100;
    const durationMin = Math.round(durationH * 60);
    const fatGrams  = Math.round((calories / 7700) * 1000) / 10;

    // How far from common goals
    const nextGoal = STEP_GOALS.find(g => g > s);
    const stepsToGoal = nextGoal ? nextGoal - s : null;

    // Calories per 1000 steps
    const cPer1k = Math.round(pace.met * weightKg * (1000 / pace.cadence / 60));

    setResult({
      calories, distanceKm, distanceMi,
      durationMin, fatGrams, cPer1k,
      nextGoal, stepsToGoal,
      stepsForGoal: Math.round(7700 * 100 / (pace.met * weightKg * (1000 / pace.cadence / 60))) * 1000 / 100,
    });
  };

  const reset = () => {
    setSteps(''); setWeight(''); setHeightCm('');
    setResult(null); setError('');
  };

  return (
    <>
      <Helmet>
        <title>Steps to Calories Calculator — How Many Calories Do Steps Burn? | LiftAndBurn</title>
        <link rel="canonical" href="https://liftandburn.fit/calculators/steps" />
        <meta name="description" content="Calculate how many calories you burn walking based on your step count, body weight, and pace. Includes distance, duration, and fat burned." />
      </Helmet>

      <div className="calc-page container">
        <div className="calc-breadcrumb">
          <Link to="/calculators">Calculators</Link> › Steps to Calories
        </div>

        <h1 className="calc-page__title">Steps to Calories Calculator</h1>

        <div className="calc-layout">
          <div className="calc-main">

            <div className="calc-box">
              <div className="calc-grid">

                <div className="calc-row">
                  <label>Step count</label>
                  <input
                    type="number" placeholder="e.g. 10000"
                    value={steps} min="1"
                    onChange={e => setSteps(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && calculate()}
                  />
                </div>

                <div className="calc-row">
                  <label>Body weight</label>
                  <div className="calc-input-pair">
                    <input
                      type="number" placeholder="e.g. 75"
                      value={weight} min="30"
                      onChange={e => setWeight(e.target.value)}
                    />
                    <select value={weightUnit} onChange={e => setWeightUnit(e.target.value)}>
                      {WEIGHT_UNITS.map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                </div>

                <div className="calc-row" style={{ gridColumn: '1 / -1' }}>
                  <label>Height <span style={{ color: 'var(--text-faint)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional — improves distance accuracy)</span></label>
                  <div className="calc-input-pair" style={{ maxWidth: 200 }}>
                    <input
                      type="number" placeholder="e.g. 175"
                      value={heightCm} min="100" max="220"
                      onChange={e => setHeightCm(e.target.value)}
                    />
                    <span style={{ padding: '0 12px', display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: 13 }}>cm</span>
                  </div>
                </div>

              </div>

              {/* Pace selector */}
              <div style={{ marginBottom: 20 }}>
                <label className="tdee-section-label" style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--text-faint)', fontWeight: 500, marginBottom: 10 }}>Walking Pace</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                  {PACE_OPTIONS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setPaceIdx(i)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                        padding: '10px 8px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                        fontFamily: 'var(--font-body)', textAlign: 'center',
                        background: paceIdx === i ? 'rgba(216,90,48,0.1)' : 'var(--bg-raised)',
                        border: `1px solid ${paceIdx === i ? 'var(--accent)' : 'var(--border)'}`,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{p.label.split(' (')[0]}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-faint)' }}>{p.speed}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick step goal buttons */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--text-faint)', fontWeight: 500, marginBottom: 10 }}>Quick select</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {STEP_GOALS.map(g => (
                    <button
                      key={g}
                      onClick={() => setSteps(g.toString())}
                      style={{
                        padding: '6px 14px', fontSize: 12, borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${steps === g.toString() ? 'var(--accent)' : 'var(--border)'}`,
                        background: steps === g.toString() ? 'var(--accent)' : 'var(--bg-raised)',
                        color: steps === g.toString() ? '#fff' : 'var(--text-muted)',
                        cursor: 'pointer', fontFamily: 'var(--font-body)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {g.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="calc-error">{error}</p>}

              <div className="calc-actions">
                <button className="calc-btn-primary" onClick={calculate}>Calculate →</button>
                <button className="calc-btn-reset" onClick={reset}>Reset</button>
              </div>
            </div>

            {/* ── Results ─────────────────────────────────── */}
            {result && (
              <div className="calc-results fade-up">
                <div className="calc-result-grid">
                  <div className="calc-result-item highlight">
                    <span className="calc-result-val">{result.calories}</span>
                    <span className="calc-result-label">Calories burned</span>
                  </div>
                  <div className="calc-result-item">
                    <span className="calc-result-val">{result.distanceKm}</span>
                    <span className="calc-result-label">km walked</span>
                  </div>
                  <div className="calc-result-item">
                    <span className="calc-result-val">{result.durationMin}</span>
                    <span className="calc-result-label">minutes</span>
                  </div>
                </div>

                <div className="calc-result-grid" style={{ marginTop: 10 }}>
                  <div className="calc-result-item">
                    <span className="calc-result-val">{result.fatGrams}g</span>
                    <span className="calc-result-label">Fat burned</span>
                  </div>
                  <div className="calc-result-item">
                    <span className="calc-result-val">{result.distanceMi}</span>
                    <span className="calc-result-label">miles walked</span>
                  </div>
                  <div className="calc-result-item">
                    <span className="calc-result-val">{result.cPer1k}</span>
                    <span className="calc-result-label">kcal per 1,000 steps</span>
                  </div>
                </div>

                {/* Next goal nudge */}
                {result.nextGoal && (
                  <div style={{
                    marginTop: 14, padding: '12px 16px', borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-raised)', borderLeft: '3px solid var(--accent)',
                    fontSize: 13, color: 'var(--text-muted)',
                  }}>
                    <strong style={{ color: 'var(--text)' }}>
                      {result.stepsToGoal.toLocaleString()} more steps
                    </strong> to reach the {result.nextGoal.toLocaleString()} step goal.
                    That burns approximately <strong style={{ color: 'var(--accent)' }}>
                      {Math.round(result.cPer1k * result.stepsToGoal / 1000)} extra calories.
                    </strong>
                  </div>
                )}
              </div>
            )}

            {/* ── Instructions ────────────────────────────── */}
            <div className="calc-instructions">
              <h2>How steps to calories is calculated</h2>
              <p>This calculator uses MET (Metabolic Equivalent of Task) values adjusted for walking pace. The formula is: <strong>Calories = MET × weight (kg) × duration (hours)</strong>. Duration is estimated from your step count and typical cadence for the selected pace.</p>

              <h2>Why body weight matters</h2>
              <p>Heavier people burn more calories for the same number of steps because they are moving more mass over the same distance. A 100kg person burns roughly 40% more calories per step than a 70kg person at the same pace.</p>

              <h2>Does 10,000 steps a day make a difference?</h2>
              <p>For a 75kg person walking at a normal pace, 10,000 steps burns approximately 300–400 calories. Done daily, that is 2,100–2,800 calories per week — roughly equivalent to losing 0.25–0.35kg of fat per week from walking alone, without any dietary changes.</p>
              <p>Combined with a modest calorie reduction, daily step targets are one of the most sustainable fat loss tools available — because walking requires no recovery time and can be done every day indefinitely.</p>

              <p className="calc-note">Calorie estimates are approximate. Individual metabolism, terrain, gradient, and walking efficiency all affect actual calorie burn.</p>

              <div className="calc-links">
                <Link to="/calculators/treadmill-calorie-calculator">Walk / Run Metabolic Calculator</Link>
                <span>|</span>
                <Link to="/articles/treadmill-incline-walking-burn-calories">Treadmill Incline Walking Guide →</Link>
                <span>|</span>
                <Link to="/articles/12-3-30-workout-does-it-work">12-3-30 Workout Guide →</Link>
                <span>|</span>
                <Link to="/calculators">All Calculators</Link>
              </div>
            </div>

          </div>

          {/* ── Sidebar ─────────────────────────────────── */}
          <aside className="calc-sidebar">
            <div className="adsense-slot" style={{ minHeight: 250 }}>AdSense · 300×250</div>
            <div className="calc-related">
              <h3>Related Calculators</h3>
              <Link to="/calculators/treadmill-calorie-calculator">Walk / Run Metabolic</Link>
              <Link to="/calculators/calories">Calories Burned</Link>
              <Link to="/calculators/tdee">TDEE Calculator</Link>
              <Link to="/calculators/zone2">Zone 2 Heart Rate</Link>
            </div>
            <div className="calc-related">
              <h3>Related Articles</h3>
              <Link to="/articles/treadmill-incline-walking-burn-calories">Treadmill Incline Walking</Link>
              <Link to="/articles/12-3-30-workout-does-it-work">The 12-3-30 Workout</Link>
              <Link to="/articles/why-the-scale-lies-measure-fat-loss">Tracking Fat Loss Progress</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
