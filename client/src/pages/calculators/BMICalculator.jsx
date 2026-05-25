import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './CalcPage.css';

const BMI_CATEGORIES = [
  { label: 'Severely Underweight', range: '< 16.0',    min: 0,    max: 16,   color: '#6366f1' },
  { label: 'Underweight',          range: '16.0–18.4', min: 16,   max: 18.5, color: '#4a9eff' },
  { label: 'Normal weight',        range: '18.5–24.9', min: 18.5, max: 25,   color: '#4ade80' },
  { label: 'Overweight',           range: '25.0–29.9', min: 25,   max: 30,   color: '#f59e0b' },
  { label: 'Obese (Class I)',       range: '30.0–34.9', min: 30,   max: 35,   color: '#f97316' },
  { label: 'Obese (Class II)',      range: '35.0–39.9', min: 35,   max: 40,   color: '#ef4444' },
  { label: 'Obese (Class III)',     range: '≥ 40.0',    min: 40,   max: 999,  color: '#991b1b' },
];

const getCategory = (bmi) => BMI_CATEGORIES.find(c => bmi >= c.min && bmi < c.max);

// Healthy weight range for a given height (BMI 18.5–24.9)
const healthyRange = (heightCm) => {
  const h = heightCm / 100;
  return {
    min: Math.round(18.5 * h * h * 10) / 10,
    max: Math.round(24.9 * h * h * 10) / 10,
  };
};

const toKg  = (w, u) => u === 'lbs' ? w * 0.453592 : w;
const toLbs = (kg)   => Math.round(kg * 2.20462 * 10) / 10;

export default function BMICalculator() {
  const [weight,     setWeight]     = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [heightCm,   setHeightCm]   = useState('');
  const [heightFt,   setHeightFt]   = useState('');
  const [heightIn,   setHeightIn]   = useState('');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [result,     setResult]     = useState(null);
  const [error,      setError]      = useState('');

  const getHeightCm = () => {
    if (heightUnit === 'cm') return parseFloat(heightCm);
    const ft   = parseFloat(heightFt) || 0;
    const inch = parseFloat(heightIn) || 0;
    return (ft * 12 + inch) * 2.54;
  };

  const calculate = () => {
    setError('');
    const w  = parseFloat(weight);
    const hCm = getHeightCm();

    if (!w || w <= 0)      return setError('Enter a valid body weight.');
    if (!hCm || hCm < 100) return setError('Enter a valid height.');

    const weightKg = toKg(w, weightUnit);
    const h        = hCm / 100;
    const bmi      = Math.round((weightKg / (h * h)) * 10) / 10;
    const category = getCategory(bmi);
    const healthy  = healthyRange(hCm);

    // How much to lose/gain to reach normal BMI
    const targetMidKg  = 21.7 * h * h; // midpoint of normal range
    const diffKg       = Math.round((weightKg - targetMidKg) * 10) / 10;

    setResult({ bmi, category, healthy, weightKg: Math.round(weightKg * 10) / 10, heightCm: Math.round(hCm), diffKg });
  };

  const reset = () => {
    setWeight(''); setHeightCm(''); setHeightFt(''); setHeightIn('');
    setResult(null); setError('');
  };

  // Needle position on scale (BMI 10–45 mapped to 0–100%)
  const needlePos = result ? Math.min(Math.max(((result.bmi - 10) / 35) * 100, 0), 100) : null;

  return (
    <>
      <Helmet>
        <title>BMI Calculator — Body Mass Index | LiftAndBurn</title>
        <link rel="canonical" href="https://liftandburn.fit/" />
        <meta name="description" content="Calculate your BMI (Body Mass Index) instantly. Includes healthy weight range, category breakdown, and why BMI has limitations for muscular and athletic people." />
      </Helmet>

      <div className="calc-page container">
        <div className="calc-breadcrumb">
          <Link to="/calculators">Calculators</Link> › BMI Calculator
        </div>

        <h1 className="calc-page__title">BMI Calculator</h1>

        <div className="calc-layout">
          <div className="calc-main">

            {/* ── Inputs ──────────────────────────────────── */}
            <div className="calc-box">
              <div className="calc-grid">

                <div className="calc-row">
                  <label>Body Weight</label>
                  <div className="calc-input-pair">
                    <input
                      type="number" placeholder="e.g. 80"
                      value={weight} min="20"
                      onChange={e => setWeight(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && calculate()}
                    />
                    <select value={weightUnit} onChange={e => setWeightUnit(e.target.value)}>
                      <option value="kg">kg</option>
                      <option value="lbs">lbs</option>
                    </select>
                  </div>
                </div>

                <div className="calc-row">
                  <label>Height</label>
                  {heightUnit === 'cm' ? (
                    <div className="calc-input-pair">
                      <input
                        type="number" placeholder="e.g. 178"
                        value={heightCm} min="100"
                        onChange={e => setHeightCm(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && calculate()}
                      />
                      <select value={heightUnit} onChange={e => setHeightUnit(e.target.value)}>
                        <option value="cm">cm</option>
                        <option value="ft">ft / in</option>
                      </select>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input type="number" placeholder="ft" min="3" max="8"
                        value={heightFt} onChange={e => setHeightFt(e.target.value)}
                        style={{ width: 64, background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 10px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none' }}
                      />
                      <input type="number" placeholder="in" min="0" max="11"
                        value={heightIn} onChange={e => setHeightIn(e.target.value)}
                        style={{ width: 64, background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 10px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none' }}
                      />
                      <select value={heightUnit} onChange={e => setHeightUnit(e.target.value)}
                        style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 10px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none' }}
                      >
                        <option value="cm">cm</option>
                        <option value="ft">ft / in</option>
                      </select>
                    </div>
                  )}
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

                {/* BMI number + category */}
                <div className="bmi-primary">
                  <div className="bmi-number" style={{ color: result.category.color }}>
                    {result.bmi}
                  </div>
                  <div className="bmi-category" style={{ color: result.category.color }}>
                    {result.category.label}
                  </div>
                  <div className="bmi-subtitle">
                    {result.weightUnit === 'lbs'
                      ? `${result.weightKg} kg · ${result.heightCm} cm`
                      : `${result.weightKg} kg · ${result.heightCm} cm`}
                  </div>
                </div>

                {/* Visual gauge */}
                <div className="bmi-gauge">
                  <div className="bmi-gauge-bar">
                    {BMI_CATEGORIES.map(c => (
                      <div
                        key={c.label}
                        style={{ flex: Math.min(c.max, 45) - Math.max(c.min, 10), background: c.color, opacity: 0.8 }}
                        title={`${c.label}: ${c.range}`}
                      />
                    ))}
                    {needlePos !== null && (
                      <div className="bmi-needle" style={{ left: `${needlePos}%` }}>
                        <div className="bmi-needle-line" />
                        <div className="bmi-needle-label">{result.bmi}</div>
                      </div>
                    )}
                  </div>
                  <div className="bmi-gauge-labels">
                    <span>10</span><span>16</span><span>18.5</span>
                    <span>25</span><span>30</span><span>35</span><span>40+</span>
                  </div>
                </div>

                {/* Healthy weight range */}
                <div className="bmi-healthy-range">
                  <span className="bmi-healthy-label">Healthy weight range for your height ({result.heightCm} cm)</span>
                  <span className="bmi-healthy-vals">
                    {result.healthy.min} kg – {result.healthy.max} kg
                    <span style={{ color: 'var(--text-faint)', fontSize: 12, marginLeft: 8 }}>
                      ({toLbs(result.healthy.min)} – {toLbs(result.healthy.max)} lbs)
                    </span>
                  </span>
                  {result.diffKg !== 0 && (
                    <span className="bmi-healthy-diff" style={{ color: result.diffKg > 0 ? '#f59e0b' : '#4a9eff' }}>
                      {result.diffKg > 0
                        ? `${result.diffKg} kg above the midpoint of the healthy range`
                        : `${Math.abs(result.diffKg)} kg below the midpoint of the healthy range`}
                    </span>
                  )}
                </div>

                {/* Full category table */}
                <div className="bmi-table">
                  {BMI_CATEGORIES.map(c => (
                    <div
                      key={c.label}
                      className={`bmi-table-row ${result.category.label === c.label ? 'active' : ''}`}
                    >
                      <span className="bmi-table-dot" style={{ background: c.color }} />
                      <span className="bmi-table-label">{c.label}</span>
                      <span className="bmi-table-range">{c.range}</span>
                    </div>
                  ))}
                </div>

                {/* Limitation warning */}
                <div className="bmi-warning">
                  <span className="bmi-warning-icon">⚠️</span>
                  <div>
                    <strong>BMI has significant limitations for muscular people.</strong> BMI does not distinguish between muscle and fat. A lean, muscular person at 90kg and 180cm has a BMI of 27.8 — classified as "overweight" despite having low body fat. If you lift weights or have above-average muscle mass, your BMI will overestimate your health risk. Waist circumference and body fat percentage are more meaningful measures for athletes.
                  </div>
                </div>

              </div>
            )}

            {/* ── Instructions ────────────────────────────── */}
            <div className="calc-instructions">
              <h2>What is BMI?</h2>
              <p>BMI (Body Mass Index) is a simple calculation — weight in kilograms divided by height in metres squared (kg/m²). It was developed by Belgian mathematician Adolphe Quetelet in the 1830s as a population-level statistical tool, not as an individual health measure.</p>
              <p>BMI is widely used in medicine and public health because it requires only two measurements and correlates reasonably well with body fat percentage across large populations. It is a useful screening tool — nothing more.</p>

              <h2>Why BMI is misleading for lifters</h2>
              <p>BMI has one fundamental flaw: it measures weight relative to height but cannot distinguish between muscle mass and fat mass. Muscle is significantly denser than fat — a kilogram of muscle takes up less space than a kilogram of fat.</p>
              <p>As a result, muscular individuals are routinely classified as overweight or obese by BMI despite having low body fat and excellent cardiovascular health. Many professional athletes and serious lifters have BMIs in the "overweight" range while carrying very little excess fat.</p>
              <p>For anyone who trains consistently with weights, <strong>body fat percentage and waist circumference are far more meaningful measures</strong> of health and body composition than BMI.</p>

              <p className="calc-note">BMI is a screening tool, not a diagnosis. It should be interpreted alongside other measures including waist circumference, body fat percentage, blood pressure, and blood work.</p>

              <div className="calc-links">
                <Link to="/calculators/tdee">TDEE Calculator →</Link>
                <span>|</span>
                <Link to="/articles/why-the-scale-lies-measure-fat-loss">How to Track Fat Loss →</Link>
                <span>|</span>
                <Link to="/articles/body-recomposition-lose-fat-build-muscle">Body Recomposition Guide →</Link>
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
              <Link to="/calculators/tdee">TDEE / Calorie Calculator</Link>
              <Link to="/calculators/calories">Calories Burned</Link>
              <Link to="/calculators/zone2">Zone 2 Heart Rate</Link>
              <Link to="/calculators/one-rep-max">One Rep Max</Link>
            </div>
            <div className="calc-related">
              <h3>Related Articles</h3>
              <Link to="/articles/why-the-scale-lies-measure-fat-loss">Why the Scale Lies</Link>
              <Link to="/articles/body-recomposition-lose-fat-build-muscle">Body Recomposition Guide</Link>
              <Link to="/articles/how-much-protein-to-build-muscle">How Much Protein Do You Need?</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
