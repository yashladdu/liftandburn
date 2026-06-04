import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './CalcPage.css';

// ACSM metabolic equations (gold standard)
// Walk VO2 (ml/kg/min) = 0.1×speed + 1.8×speed×grade + 3.5   (speed in m/min)
// Run  VO2 (ml/kg/min) = 0.2×speed + 0.9×speed×grade + 3.5   (speed in m/min)
const calcVO2 = (mode, speedMmin, gradeDecimal) => {
  if (mode === 'Walk') {
    return 0.1 * speedMmin + 1.8 * speedMmin * gradeDecimal + 3.5;
  }
  return 0.2 * speedMmin + 0.9 * speedMmin * gradeDecimal + 3.5;
};

const toMmin = (speed, unit) => {
  if (unit === 'mph')   return speed * 26.8224;
  if (unit === 'km/hr') return speed * 16.6667;
  return speed; // already m/min
};

const SPEED_UNITS = ['mph', 'km/hr', 'm/min'];
const WEIGHT_UNITS = ['lbs', 'kg'];
const ENERGY_TYPES = ['Gross', 'Net'];
const DURATION_UNITS = ['minutes', 'hours', 'seconds'];
const MODES = ['Walk', 'Run'];

const toKg = (w, unit) => unit === 'lbs' ? w * 0.453592 : w;
const toMinutes = (d, unit) => {
  if (unit === 'hours')   return d * 60;
  if (unit === 'seconds') return d / 60;
  return d;
};

export default function WalkRunCalculator() {
  const [mode,         setMode]         = useState('Walk');
  const [speed,        setSpeed]        = useState('');
  const [speedUnit,    setSpeedUnit]    = useState('km/hr');
  const [grade,        setGrade]        = useState('0');
  const [energy,       setEnergy]       = useState('Gross');
  const [weight,       setWeight]       = useState('');
  const [weightUnit,   setWeightUnit]   = useState('kg');
  const [duration,     setDuration]     = useState('');
  const [durationUnit, setDurationUnit] = useState('minutes');
  const [result,       setResult]       = useState(null);
  const [error,        setError]        = useState('');

  const calculate = () => {
    setError('');
    const s = parseFloat(speed);
    const w = parseFloat(weight);
    const d = parseFloat(duration);
    const g = parseFloat(grade) || 0;

    if (!s || s <= 0) return setError('Enter a valid speed.');
    if (!w || w <= 0) return setError('Enter a valid body weight.');
    if (!d || d <= 0) return setError('Enter a valid duration.');

    const speedMmin    = toMmin(s, speedUnit);
    const weightKg     = toKg(w, weightUnit);
    const durationMins = toMinutes(d, durationUnit);
    const gradeDecimal = g / 100;

    let vo2 = calcVO2(mode, speedMmin, gradeDecimal); // ml/kg/min (Gross)
    if (energy === 'Net') vo2 = vo2 - 3.5;            // subtract resting VO2

    const mets     = vo2 / 3.5;
    const calories = (mets * weightKg * (durationMins / 60)); // kcal
    const vo2Abs   = (vo2 * weightKg) / 1000;                 // L/min

    setResult({
      mets:      Math.round(mets * 10) / 10,
      vo2:       Math.round(vo2 * 10) / 10,
      vo2Abs:    Math.round(vo2Abs * 100) / 100,
      calories:  Math.round(calories),
      speedMmin: Math.round(speedMmin),
    });
  };

  const reset = () => {
    setSpeed(''); setWeight(''); setDuration('');
    setGrade('0'); setResult(null); setError('');
  };

  return (
    <>
      <Helmet>
        <title>Treadmill Calorie Calculator — LiftAndBurn</title>
        <link rel="canonical" href="https://liftandburn.fit/calculators/treadmill-calorie-calculator" />
        <meta name="description" content="Calculate METs, VO2, and calories burned walking or running using ACSM metabolic equations. Enter speed, grade, body weight and duration." />
      </Helmet>

      <div className="calc-page container">
        <div className="calc-breadcrumb">
          <Link to="/calculators">Calculators</Link> › Treadmill Calorie Calculator
        </div>

        <h1 className="calc-page__title">Treadmill Calorie Calculator</h1>

        <div className="calc-layout">
          <div className="calc-main">

            {/* ── Inputs ──────────────────────────────────── */}
            <div className="calc-box">
              <div className="calc-grid">

                <div className="calc-row">
                  <label>Mode</label>
                  <select value={mode} onChange={e => setMode(e.target.value)}>
                    {MODES.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>

                <div className="calc-row">
                  <label>Energy</label>
                  <select value={energy} onChange={e => setEnergy(e.target.value)}>
                    {ENERGY_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div className="calc-row">
                  <label>Speed</label>
                  <div className="calc-input-pair">
                    <input type="number" value={speed} min="0" step="0.1"
                      placeholder="e.g. 6" onChange={e => setSpeed(e.target.value)} />
                    <select value={speedUnit} onChange={e => setSpeedUnit(e.target.value)}>
                      {SPEED_UNITS.map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                </div>

                <div className="calc-row">
                  <label>Body Weight</label>
                  <div className="calc-input-pair">
                    <input type="number" value={weight} min="0"
                      placeholder="e.g. 70" onChange={e => setWeight(e.target.value)} />
                    <select value={weightUnit} onChange={e => setWeightUnit(e.target.value)}>
                      {WEIGHT_UNITS.map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                </div>

                <div className="calc-row">
                  <label>Grade (%)</label>
                  <input type="number" value={grade} min="0" max="40" step="0.5"
                    placeholder="0" onChange={e => setGrade(e.target.value)} />
                </div>

                <div className="calc-row">
                  <label>Duration</label>
                  <div className="calc-input-pair">
                    <input type="number" value={duration} min="0"
                      placeholder="e.g. 30" onChange={e => setDuration(e.target.value)} />
                    <select value={durationUnit} onChange={e => setDurationUnit(e.target.value)}>
                      {DURATION_UNITS.map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                </div>

              </div>

              {error && <p className="calc-error">{error}</p>}

              <div className="calc-actions">
                <button className="calc-btn-primary" onClick={calculate}>Calculate</button>
                <button className="calc-btn-reset" onClick={reset}>Reset</button>
              </div>
            </div>

            {/* ── Results ─────────────────────────────────── */}
            {result && (
              <div className="calc-results fade-up">
                <div className="calc-result-grid">
                  <div className="calc-result-item">
                    <span className="calc-result-val">{result.mets}</span>
                    <span className="calc-result-label">METs</span>
                  </div>
                  <div className="calc-result-item">
                    <span className="calc-result-val">{result.vo2}</span>
                    <span className="calc-result-label">VO2 (ml/kg/min)</span>
                  </div>
                  <div className="calc-result-item highlight">
                    <span className="calc-result-val">{result.calories}</span>
                    <span className="calc-result-label">Calories (kcal)</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── Instructions ────────────────────────────── */}
            <div className="calc-instructions">
              <h2>Instructions</h2>
              <p>Select mode (Walk or Run) and energy type (Gross includes resting metabolism; Net excludes it). Enter speed, body weight, treadmill grade, and duration, then click Calculate.</p>
              <p><strong>Accurate requirements:</strong></p>
              <ul>
                <li>Steady-state submaximal aerobic exercise</li>
                <li>Walking speeds between 50–100 m/min (1.9–3.7 mph / 3–6 km/hr)</li>
                <li>Running at least 80 m/min (3 mph / 4.8 km/hr)</li>
                <li>Not holding onto the handrail</li>
                <li>Exercise unaffected by wind, snow, sand, or gait abnormalities</li>
              </ul>
              <p className="calc-note">Calculations use ACSM metabolic equations. Results may differ slightly from textbook examples as no intermediate rounding is applied.</p>
              <div className="calc-links">
                <Link to="/calculators/steps">Step Metabolic Calculator</Link>
                <span>|</span>
                <Link to="/articles/zone-2-cardio-beginners-guide">Zone 2 Cardio Guide</Link>
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
              <Link to="/calculators/steps">Step Metabolic Calculator</Link>
              <Link to="/calculators/zone2">Zone 2 Heart Rate</Link>
              <Link to="/calculators/one-rep-max">One Rep Max</Link>
              <Link to="/calculators/calories">Calories Burned</Link>
            </div>
            <div className="calc-related">
              <h3>Related Articles</h3>
              <Link to="/articles/zone-2-cardio-beginners-guide">Zone 2 Cardio: The Complete Guide</Link>
              <Link to="/articles/how-to-combine-weightlifting-and-cardio">Combining Lifting & Cardio</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
