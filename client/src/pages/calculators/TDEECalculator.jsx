import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './CalcPage.css';

// ── BMR Equations ─────────────────────────────────────────────
// All return BMR in kcal/day

// Mifflin-St Jeor (1990) — most validated for general population
const mifflinStJeor = (weightKg, heightCm, age, sex) => {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
};

// Harris-Benedict Revised (Roza & Shizgal, 1984)
const harrisBenedict = (weightKg, heightCm, age, sex) => {
  if (sex === 'male') {
    return 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age;
  }
  return 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.330 * age;
};

// Katch-McArdle — most accurate if lean body mass is known
// Requires body fat % input
const katchMcArdle = (weightKg, bodyFatPct) => {
  const lbm = weightKg * (1 - bodyFatPct / 100);
  return 370 + 21.6 * lbm;
};

// Cunningham — similar to Katch-McArdle, favoured for athletes
const cunningham = (weightKg, bodyFatPct) => {
  const lbm = weightKg * (1 - bodyFatPct / 100);
  return 500 + 22 * lbm;
};

// ── Activity multipliers (PAL) ────────────────────────────────
// Based on FAO/WHO/UNU activity level definitions
const ACTIVITY_LEVELS = [
  {
    id: 'sedentary',
    label: 'Sedentary',
    desc: 'Desk job, little or no exercise',
    multiplier: 1.2,
  },
  {
    id: 'light',
    label: 'Lightly Active',
    desc: 'Light exercise 1–3 days/week',
    multiplier: 1.375,
  },
  {
    id: 'moderate',
    label: 'Moderately Active',
    desc: 'Moderate exercise 3–5 days/week',
    multiplier: 1.55,
  },
  {
    id: 'active',
    label: 'Very Active',
    desc: 'Hard exercise 6–7 days/week',
    multiplier: 1.725,
  },
  {
    id: 'extra',
    label: 'Extremely Active',
    desc: 'Hard daily exercise + physical job',
    multiplier: 1.9,
  },
];

// ── Goal calorie adjustments ──────────────────────────────────
const GOALS = [
  { id: 'lose_fast',   label: 'Lose weight fast',    desc: '~1kg/week',    adjustment: -1000 },
  { id: 'lose',        label: 'Lose weight',          desc: '~0.5kg/week',  adjustment: -500  },
  { id: 'lose_slow',   label: 'Lose weight slowly',   desc: '~0.25kg/week', adjustment: -250  },
  { id: 'maintain',    label: 'Maintain weight',       desc: 'TDEE',         adjustment: 0     },
  { id: 'gain_slow',   label: 'Gain muscle slowly',   desc: '+0.25kg/week', adjustment: 250   },
  { id: 'gain',        label: 'Gain muscle',           desc: '+0.5kg/week',  adjustment: 500   },
];

// ── Macro split presets ───────────────────────────────────────
const MACRO_PRESETS = {
  balanced:    { protein: 0.30, fat: 0.30, carbs: 0.40, label: 'Balanced' },
  highProtein: { protein: 0.35, fat: 0.25, carbs: 0.40, label: 'High Protein' },
  lowCarb:     { protein: 0.35, fat: 0.45, carbs: 0.20, label: 'Low Carb' },
  performance: { protein: 0.25, fat: 0.25, carbs: 0.50, label: 'Performance' },
};

const toKg = (w, unit) => unit === 'lbs' ? w * 0.453592 : w;
const toCm = (h, unit) => unit === 'ft' ? h * 30.48 : h;  // assumes feet decimal input
const toFtIn = (cm) => {
  const totalIn = cm / 2.54;
  return `${Math.floor(totalIn / 12)}'${Math.round(totalIn % 12)}"`;
};

export default function TDEECalculator() {
  const [age,          setAge]          = useState('');
  const [sex,          setSex]          = useState('male');
  const [weight,       setWeight]       = useState('');
  const [weightUnit,   setWeightUnit]   = useState('kg');
  const [heightCm,     setHeightCm]     = useState('');
  const [heightFt,     setHeightFt]     = useState('');
  const [heightIn,     setHeightIn]     = useState('');
  const [heightUnit,   setHeightUnit]   = useState('cm');
  const [bodyFat,      setBodyFat]      = useState('');
  const [activityId,   setActivityId]   = useState('moderate');
  const [goalId,       setGoalId]       = useState('maintain');
  const [macroPreset,  setMacroPreset]  = useState('balanced');
  const [result,       setResult]       = useState(null);
  const [error,        setError]        = useState('');

  const calculate = () => {
    setError('');

    const a = parseInt(age);
    const w = parseFloat(weight);
    const bf = parseFloat(bodyFat);

    // Height handling
    let hCm;
    if (heightUnit === 'cm') {
      hCm = parseFloat(heightCm);
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      hCm = (ft * 12 + inch) * 2.54;
    }

    if (!a || a < 15 || a > 100) return setError('Enter a valid age (15–100).');
    if (!w || w <= 0)             return setError('Enter a valid body weight.');
    if (!hCm || hCm < 100)       return setError('Enter a valid height.');

    const weightKg  = toKg(w, weightUnit);
    const activity  = ACTIVITY_LEVELS.find(l => l.id === activityId);
    const goal      = GOALS.find(g => g.id === goalId);
    const preset    = MACRO_PRESETS[macroPreset];

    // Calculate BMR with all applicable equations
    const bmrMifflin = Math.round(mifflinStJeor(weightKg, hCm, a, sex));
    const bmrHarris  = Math.round(harrisBenedict(weightKg, hCm, a, sex));

    let bmrKatch = null;
    let bmrCunningham = null;
    if (!isNaN(bf) && bf > 3 && bf < 60) {
      bmrKatch      = Math.round(katchMcArdle(weightKg, bf));
      bmrCunningham = Math.round(cunningham(weightKg, bf));
    }

    // Primary BMR — use Katch-McArdle if body fat provided (more accurate),
    // otherwise Mifflin-St Jeor (most validated general equation)
    const primaryBMR = bmrKatch || bmrMifflin;

    const tdee        = Math.round(primaryBMR * activity.multiplier);
    const targetCals  = tdee + goal.adjustment;

    // Protein target: 0.8g per lb of bodyweight (our site's recommendation)
    const weightLbs   = weightKg * 2.20462;
    const proteinG    = Math.round(weightLbs * 0.8);
    const proteinCals = proteinG * 4;

    // Remaining calories split between fat and carbs
    const remainingCals = Math.max(targetCals - proteinCals, 0);
    // Fat: ~30% of total target, carbs: remainder
    const fatCals       = Math.round(targetCals * preset.fat);
    const carbCals      = Math.max(targetCals - proteinCals - fatCals, 0);
    const fatG          = Math.round(fatCals / 9);
    const carbG         = Math.round(carbCals / 4);

    // LBM if body fat provided
    const lbm = (!isNaN(bf) && bf > 0) ? Math.round(weightKg * (1 - bf / 100) * 10) / 10 : null;

    setResult({
      bmrMifflin,
      bmrHarris,
      bmrKatch,
      bmrCunningham,
      primaryBMR,
      tdee,
      targetCals,
      activity,
      goal,
      proteinG,
      fatG,
      carbG,
      lbm,
      weightKg: Math.round(weightKg * 10) / 10,
      heightCm: Math.round(hCm),
    });
  };

  const reset = () => {
    setAge(''); setWeight(''); setHeightCm(''); setHeightFt('');
    setHeightIn(''); setBodyFat(''); setResult(null); setError('');
  };

  const activityLevel = ACTIVITY_LEVELS.find(l => l.id === activityId);

  return (
    <>
      <Helmet>
        <title>TDEE Calculator — Total Daily Energy Expenditure | LiftAndBurn</title>
        <meta name="description" content="Calculate your TDEE (Total Daily Energy Expenditure) and daily calorie needs using Mifflin-St Jeor, Harris-Benedict, and Katch-McArdle equations. Includes macro breakdown." />
      </Helmet>

      <div className="calc-page container">
        <div className="calc-breadcrumb">
          <Link to="/calculators">Calculators</Link> › TDEE Calculator
        </div>

        <h1 className="calc-page__title">TDEE / Calorie Calculator</h1>

        <div className="calc-layout">
          <div className="calc-main">

            {/* ── Inputs ──────────────────────────────────── */}
            <div className="calc-box">
              <div className="calc-grid">

                {/* Sex */}
                <div className="calc-row">
                  <label>Biological Sex</label>
                  <div className="tdee-toggle">
                    <button
                      className={`tdee-toggle-btn ${sex === 'male' ? 'active' : ''}`}
                      onClick={() => setSex('male')}
                    >Male</button>
                    <button
                      className={`tdee-toggle-btn ${sex === 'female' ? 'active' : ''}`}
                      onClick={() => setSex('female')}
                    >Female</button>
                  </div>
                </div>

                {/* Age */}
                <div className="calc-row">
                  <label>Age</label>
                  <input
                    type="number" placeholder="e.g. 30"
                    value={age} min="15" max="100"
                    onChange={e => setAge(e.target.value)}
                  />
                </div>

                {/* Weight */}
                <div className="calc-row">
                  <label>Body Weight</label>
                  <div className="calc-input-pair">
                    <input
                      type="number" placeholder="e.g. 80"
                      value={weight} min="30"
                      onChange={e => setWeight(e.target.value)}
                    />
                    <select value={weightUnit} onChange={e => setWeightUnit(e.target.value)}>
                      <option value="kg">kg</option>
                      <option value="lbs">lbs</option>
                    </select>
                  </div>
                </div>

                {/* Height */}
                <div className="calc-row">
                  <label>Height</label>
                  {heightUnit === 'cm' ? (
                    <div className="calc-input-pair">
                      <input
                        type="number" placeholder="e.g. 178"
                        value={heightCm} min="100"
                        onChange={e => setHeightCm(e.target.value)}
                      />
                      <select value={heightUnit} onChange={e => setHeightUnit(e.target.value)}>
                        <option value="cm">cm</option>
                        <option value="ft">ft / in</option>
                      </select>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        type="number" placeholder="ft" min="3" max="8"
                        value={heightFt}
                        onChange={e => setHeightFt(e.target.value)}
                        style={{ width: 60, background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 10px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none' }}
                      />
                      <input
                        type="number" placeholder="in" min="0" max="11"
                        value={heightIn}
                        onChange={e => setHeightIn(e.target.value)}
                        style={{ width: 60, background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 10px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none' }}
                      />
                      <select
                        value={heightUnit}
                        onChange={e => setHeightUnit(e.target.value)}
                        style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 10px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none' }}
                      >
                        <option value="cm">cm</option>
                        <option value="ft">ft / in</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Body fat % — optional */}
                <div className="calc-row" style={{ gridColumn: '1 / -1' }}>
                  <label>Body Fat % <span style={{ color: 'var(--text-faint)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional — enables Katch-McArdle equation, most accurate for athletes)</span></label>
                  <input
                    type="number" placeholder="e.g. 18"
                    value={bodyFat} min="3" max="60" step="0.5"
                    onChange={e => setBodyFat(e.target.value)}
                    style={{ maxWidth: 200 }}
                  />
                </div>

              </div>

              {/* Activity level */}
              <div style={{ marginBottom: 16 }}>
                <label className="tdee-section-label">Activity Level</label>
                <div className="tdee-activity-grid">
                  {ACTIVITY_LEVELS.map(level => (
                    <button
                      key={level.id}
                      className={`tdee-activity-btn ${activityId === level.id ? 'active' : ''}`}
                      onClick={() => setActivityId(level.id)}
                    >
                      <span className="tdee-activity-label">{level.label}</span>
                      <span className="tdee-activity-desc">{level.desc}</span>
                      <span className="tdee-activity-multiplier">×{level.multiplier}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal */}
              <div style={{ marginBottom: 20 }}>
                <label className="tdee-section-label">Goal</label>
                <div className="tdee-goal-grid">
                  {GOALS.map(g => (
                    <button
                      key={g.id}
                      className={`tdee-goal-btn ${goalId === g.id ? 'active' : ''}`}
                      onClick={() => setGoalId(g.id)}
                    >
                      <span className="tdee-goal-label">{g.label}</span>
                      <span className="tdee-goal-desc">{g.desc}</span>
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

                {/* Primary result */}
                <div className="tdee-primary">
                  <div className="tdee-primary-item">
                    <span className="tdee-primary-label">BMR</span>
                    <span className="tdee-primary-val">{result.primaryBMR}</span>
                    <span className="tdee-primary-unit">kcal/day at rest</span>
                  </div>
                  <div className="tdee-divider" />
                  <div className="tdee-primary-item">
                    <span className="tdee-primary-label">TDEE</span>
                    <span className="tdee-primary-val tdee-accent">{result.tdee}</span>
                    <span className="tdee-primary-unit">kcal/day maintenance</span>
                  </div>
                  <div className="tdee-divider" />
                  <div className="tdee-primary-item">
                    <span className="tdee-primary-label">Target</span>
                    <span className="tdee-primary-val">{result.targetCals}</span>
                    <span className="tdee-primary-unit">kcal/day for {result.goal.label.toLowerCase()}</span>
                  </div>
                </div>

                {/* Macro breakdown — live, reacts to preset changes without recalculating */}
                {(() => {
                  const preset    = MACRO_PRESETS[macroPreset];
                  const weightLbs = result.weightKg * 2.20462;
                  const proteinG  = Math.round(weightLbs * 0.8);
                  const fatG      = Math.round((result.targetCals * preset.fat) / 9);
                  const carbG     = Math.max(Math.round((result.targetCals - proteinG * 4 - fatG * 9) / 4), 0);
                  return (
                    <div style={{ marginTop: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span className="tdee-section-label" style={{ margin: 0 }}>Macro Breakdown</span>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {Object.entries(MACRO_PRESETS).map(([key, val]) => (
                            <button
                              key={key}
                              onClick={() => setMacroPreset(key)}
                              style={{
                                padding: '4px 10px',
                                fontSize: 11,
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border)',
                                background: macroPreset === key ? 'var(--accent)' : 'var(--bg-raised)',
                                color: macroPreset === key ? '#fff' : 'var(--text-muted)',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-body)',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              {val.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="tdee-macro-grid">
                        <div className="tdee-macro-item tdee-macro-protein">
                          <span className="tdee-macro-g">{proteinG}g</span>
                          <span className="tdee-macro-name">Protein</span>
                          <span className="tdee-macro-cal">{proteinG * 4} kcal</span>
                          <span className="tdee-macro-note">0.8g per lb bodyweight</span>
                        </div>
                        <div className="tdee-macro-item tdee-macro-carbs">
                          <span className="tdee-macro-g">{carbG}g</span>
                          <span className="tdee-macro-name">Carbohydrates</span>
                          <span className="tdee-macro-cal">{carbG * 4} kcal</span>
                          <span className="tdee-macro-note">Fuel for training</span>
                        </div>
                        <div className="tdee-macro-item tdee-macro-fat">
                          <span className="tdee-macro-g">{fatG}g</span>
                          <span className="tdee-macro-name">Fat</span>
                          <span className="tdee-macro-cal">{fatG * 9} kcal</span>
                          <span className="tdee-macro-note">Hormones & health</span>
                        </div>
                      </div>

                      <div className="tdee-macro-bar">
                        <div style={{ flex: proteinG * 4, background: '#D85A30' }} />
                        <div style={{ flex: carbG * 4,    background: '#4a9eff' }} />
                        <div style={{ flex: fatG * 9,     background: '#f59e0b' }} />
                      </div>
                      <div className="tdee-macro-bar-legend">
                        <span><span style={{ background: '#D85A30' }} />Protein</span>
                        <span><span style={{ background: '#4a9eff' }} />Carbs</span>
                        <span><span style={{ background: '#f59e0b' }} />Fat</span>
                      </div>
                    </div>
                  );
                })()}

                {/* BMR equation comparison */}
                <div className="tdee-equations">
                  <span className="tdee-section-label">BMR Equation Comparison</span>
                  <div className="tdee-eq-grid">
                    <div className={`tdee-eq-item ${!result.bmrKatch ? 'tdee-eq-primary' : ''}`}>
                      <span className="tdee-eq-val">{result.bmrMifflin} kcal</span>
                      <span className="tdee-eq-name">Mifflin-St Jeor</span>
                      <span className="tdee-eq-note">Best for general population</span>
                    </div>
                    <div className="tdee-eq-item">
                      <span className="tdee-eq-val">{result.bmrHarris} kcal</span>
                      <span className="tdee-eq-name">Harris-Benedict</span>
                      <span className="tdee-eq-note">Revised 1984</span>
                    </div>
                    {result.bmrKatch && (
                      <div className="tdee-eq-item tdee-eq-primary">
                        <span className="tdee-eq-val">{result.bmrKatch} kcal</span>
                        <span className="tdee-eq-name">Katch-McArdle</span>
                        <span className="tdee-eq-note">Most accurate for athletes</span>
                      </div>
                    )}
                    {result.bmrCunningham && (
                      <div className="tdee-eq-item">
                        <span className="tdee-eq-val">{result.bmrCunningham} kcal</span>
                        <span className="tdee-eq-name">Cunningham</span>
                        <span className="tdee-eq-note">Athlete-optimised</span>
                      </div>
                    )}
                  </div>
                  {result.lbm && (
                    <p style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 8 }}>
                      Lean body mass: {result.lbm} kg · Body fat: {bodyFat}%
                    </p>
                  )}
                </div>

                {/* TDEE by activity level */}
                <div className="tdee-activity-comparison">
                  <span className="tdee-section-label">TDEE Across Activity Levels</span>
                  <div className="tdee-act-table">
                    {ACTIVITY_LEVELS.map(level => {
                      const val = Math.round(result.primaryBMR * level.multiplier);
                      const isActive = level.id === activityId;
                      return (
                        <div key={level.id} className={`tdee-act-row ${isActive ? 'active' : ''}`}>
                          <span className="tdee-act-label">{level.label}</span>
                          <span className="tdee-act-desc">{level.desc}</span>
                          <span className="tdee-act-val">{val} kcal</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* ── Instructions ────────────────────────────── */}
            <div className="calc-instructions">
              <h2>How TDEE is calculated</h2>
              <p>TDEE (Total Daily Energy Expenditure) is the total number of calories your body burns in a day, including exercise and daily activity. It is calculated in two steps.</p>
              <p><strong>Step 1 — BMR (Basal Metabolic Rate):</strong> the calories your body burns at complete rest to maintain basic functions. Calculated using validated equations based on weight, height, age, and sex.</p>
              <p><strong>Step 2 — Activity multiplier:</strong> BMR is multiplied by a Physical Activity Level (PAL) factor to account for exercise and daily movement.</p>

              <h2>Which equation is most accurate?</h2>
              <p><strong>Mifflin-St Jeor (1990)</strong> is the most validated equation for the general population and is recommended by the Academy of Nutrition and Dietetics. It is used as the primary equation when no body fat percentage is entered.</p>
              <p><strong>Katch-McArdle</strong> is the most accurate for athletes and lean individuals because it accounts for lean body mass directly, bypassing the limitations of weight-based equations. It requires a body fat percentage estimate to use. When body fat is provided, this equation is used as the primary result.</p>
              <p><strong>Harris-Benedict (Revised 1984)</strong> is the classic equation, updated by Roza and Shizgal. Slightly less accurate than Mifflin-St Jeor for most people but still widely used.</p>
              <p><strong>Cunningham</strong> is similar to Katch-McArdle and favoured for competitive athletes. Requires body fat percentage.</p>

              <p className="calc-note">TDEE calculators provide estimates. Individual metabolism varies by up to ±10%. Use these numbers as a starting point and adjust based on 2–4 weeks of real-world results. Track your weight and waist weekly to confirm whether your intake is producing the expected results.</p>

              <div className="calc-links">
                <Link to="/articles/body-recomposition-lose-fat-build-muscle">Body Recomposition Guide →</Link>
                <span>|</span>
                <Link to="/articles/how-much-protein-to-build-muscle">Protein Requirements →</Link>
                <span>|</span>
                <Link to="/articles/why-the-scale-lies-measure-fat-loss">Tracking Progress →</Link>
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
              <Link to="/calculators/calories">Calories Burned</Link>
              <Link to="/calculators/zone2">Zone 2 Heart Rate</Link>
              <Link to="/calculators/treadmill-calorie-calculator">Walk / Run Metabolic</Link>
              <Link to="/calculators/one-rep-max">One Rep Max</Link>
            </div>
            <div className="calc-related">
              <h3>Related Articles</h3>
              <Link to="/articles/how-much-protein-to-build-muscle">How Much Protein Do You Need?</Link>
              <Link to="/articles/body-recomposition-lose-fat-build-muscle">Body Recomposition Guide</Link>
              <Link to="/articles/why-the-scale-lies-measure-fat-loss">Why the Scale Lies</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
