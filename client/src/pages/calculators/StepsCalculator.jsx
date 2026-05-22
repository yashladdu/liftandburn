import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './CalcPage.css';

// ACSM Stepping equation:
// VO2 (ml/kg/min) = 0.2×steps/min + 1.33×1.8×step_height(m)×steps/min + 3.5
// step_height in meters, steps/min = steps per minute
const calcStepVO2 = (stepsPerMin, stepHeightM) => {
  return 0.2 * stepsPerMin + 1.33 * 1.8 * stepHeightM * stepsPerMin + 3.5;
};

const HEIGHT_UNITS = ['inches', 'cm'];
const WEIGHT_UNITS = ['lbs', 'kg'];
const ENERGY_TYPES = ['Gross', 'Net'];
const DURATION_UNITS = ['minutes', 'hours', 'seconds'];

const toKg = (w, unit) => unit === 'lbs' ? w * 0.453592 : w;
const toMeters = (h, unit) => unit === 'inches' ? h * 0.0254 : h / 100;
const toMinutes = (d, unit) => {
  if (unit === 'hours')   return d * 60;
  if (unit === 'seconds') return d / 60;
  return d;
};

export default function StepsCalculator() {
  const [steps,        setSteps]        = useState('');
  const [stepHeight,   setStepHeight]   = useState('');
  const [heightUnit,   setHeightUnit]   = useState('inches');
  const [energy,       setEnergy]       = useState('Gross');
  const [weight,       setWeight]       = useState('');
  const [weightUnit,   setWeightUnit]   = useState('lbs');
  const [duration,     setDuration]     = useState('');
  const [durationUnit, setDurationUnit] = useState('minutes');
  const [result,       setResult]       = useState(null);
  const [error,        setError]        = useState('');

  const calculate = () => {
    setError('');
    const s = parseFloat(steps);
    const h = parseFloat(stepHeight);
    const w = parseFloat(weight);
    const d = parseFloat(duration);

    if (!s || s < 12 || s > 30) return setError('Step rate must be between 12 and 30 steps/minute.');
    if (!h || h <= 0)            return setError('Enter a valid step height.');
    if (!w || w <= 0)            return setError('Enter a valid body weight.');
    if (!d || d <= 0)            return setError('Enter a valid duration.');

    const heightM      = toMeters(h, heightUnit);
    const weightKg     = toKg(w, weightUnit);
    const durationMins = toMinutes(d, durationUnit);

    if (heightM < 0.04 || heightM > 0.40)
      return setError('Step height must be between 4 and 40 cm (1.6–15.7 inches).');

    let vo2 = calcStepVO2(s, heightM);
    if (energy === 'Net') vo2 = vo2 - 3.5;

    const mets    = vo2 / 3.5;
    const calories = mets * weightKg * (durationMins / 60);

    setResult({
      mets:     Math.round(mets * 10) / 10,
      vo2:      Math.round(vo2 * 10) / 10,
      calories: Math.round(calories),
    });
  };

  const reset = () => {
    setSteps(''); setStepHeight(''); setWeight(''); setDuration('');
    setResult(null); setError('');
  };

  return (
    <>
      <Helmet>
        <title>Step Metabolic Calculator — LiftAndBurn</title>
        <meta name="description" content="Calculate METs, VO2, and calories burned during step exercise using the ACSM stepping metabolic equation. Enter step rate, step height, weight and duration." />
      </Helmet>

      <div className="calc-page container">
        <div className="calc-breadcrumb">
          <Link to="/calculators">Calculators</Link> › Step Metabolic
        </div>

        <h1 className="calc-page__title">Step Metabolic Calculator</h1>

        <div className="calc-layout">
          <div className="calc-main">

            {/* ── Inputs ──────────────────────────────────── */}
            <div className="calc-box">
              <div className="calc-grid">

                <div className="calc-row">
                  <label>Steps / minute</label>
                  <input type="number" value={steps} min="12" max="30"
                    placeholder="e.g. 24" onChange={e => setSteps(e.target.value)} />
                </div>

                <div className="calc-row">
                  <label>Energy</label>
                  <select value={energy} onChange={e => setEnergy(e.target.value)}>
                    {ENERGY_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div className="calc-row">
                  <label>Step Height</label>
                  <div className="calc-input-pair">
                    <input type="number" value={stepHeight} min="0" step="0.5"
                      placeholder="e.g. 8" onChange={e => setStepHeight(e.target.value)} />
                    <select value={heightUnit} onChange={e => setHeightUnit(e.target.value)}>
                      {HEIGHT_UNITS.map(u => <option key={u}>{u}</option>)}
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
              <p>Enter steps per minute, step height, body weight, and duration. Select Gross energy (includes resting metabolism) or Net (exercise only).</p>
              <p><strong>Accurate requirements:</strong></p>
              <ul>
                <li>Step rate between 12 and 30 steps per minute</li>
                <li>Step height between 4 and 40 cm (1.6–15.7 inches)</li>
                <li>One step equals a complete up and down cycle</li>
              </ul>

              <div className="calc-method-grid">
                <div className="calc-method">
                  <h4>Traditional method</h4>
                  <ol>
                    <li>Lift first leg onto box or fixed object</li>
                    <li>Raise body and second leg onto the box</li>
                    <li>Lower body with first leg to floor</li>
                    <li>Return second leg down to floor</li>
                    <li>Repeat</li>
                  </ol>
                </div>
                <div className="calc-method">
                  <h4>Modified method</h4>
                  <ol>
                    <li>Lift first leg onto box or fixed object</li>
                    <li>Raise body and second leg onto box</li>
                    <li>Lower body by stepping down with second leg</li>
                    <li>Return first leg down to floor</li>
                    <li>Repeat alternating first steps between legs</li>
                  </ol>
                </div>
              </div>

              <p className="calc-note">Calculations use the ACSM stepping metabolic equation. Results may differ slightly from textbook examples as no intermediate rounding is applied.</p>
              <div className="calc-links">
                <Link to="/calculators/walk-run">Walk / Run Calculator</Link>
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
              <Link to="/calculators/walk-run">Walk / Run Metabolic</Link>
              <Link to="/calculators/zone2">Zone 2 Heart Rate</Link>
              <Link to="/calculators/one-rep-max">One Rep Max</Link>
              <Link to="/calculators/calories">Calories Burned</Link>
            </div>
            <div className="calc-related">
              <h3>Related Articles</h3>
              <Link to="/articles/zone-2-cardio-beginners-guide">Zone 2 Cardio: The Complete Guide</Link>
              <Link to="/articles/best-weekly-schedule-lifting-and-cardio">Best Weekly Training Schedule</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
