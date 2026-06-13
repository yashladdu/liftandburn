import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './CalcPage.css';

// ACSM metabolic equations (gold standard)
const calcVO2 = (mode, speedMmin, gradeDecimal) => {
  if (mode === 'Walk') {
    return 0.1 * speedMmin + 1.8 * speedMmin * gradeDecimal + 3.5;
  }
  return 0.2 * speedMmin + 0.9 * speedMmin * gradeDecimal + 3.5;
};

const toMmin = (speed, unit) => {
  if (unit === 'mph')   return speed * 26.8224;
  if (unit === 'km/hr') return speed * 16.6667;
  return speed;
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

    let vo2 = calcVO2(mode, speedMmin, gradeDecimal);
    if (energy === 'Net') vo2 = vo2 - 3.5;

    const mets     = vo2 / 3.5;
    const calories = (mets * weightKg * (durationMins / 60));
    const vo2Abs   = (vo2 * weightKg) / 1000;

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
        <title>Treadmill Calorie Calculator — Walk & Run (ACSM Formula) | LiftAndBurn</title>
        <link rel="canonical" href="https://liftandburn.fit/calculators/treadmill-calorie-calculator" />
        <meta name="description" content="Calculate calories, METs, and VO2 burned walking or running on a treadmill at any speed and incline using the ACSM metabolic equations — more accurate than your treadmill display." />
      </Helmet>

      <div className="calc-page container">
        <div className="calc-breadcrumb">
          <Link to="/calculators">Calculators</Link> › Treadmill Calorie Calculator
        </div>

        <h1 className="calc-page__title">Treadmill Calorie Calculator</h1>

        <div className="calc-layout">
          <div className="calc-main">

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

            {/* ── Instructions / SEO content ────────────────── */}
            <div className="calc-instructions">
              <h2>How to use this calculator</h2>
              <p>Select Walk or Run mode and choose Gross (includes resting metabolism) or Net (exercise only) energy. Enter your speed, body weight, treadmill incline (grade), and duration, then click Calculate. The result shows METs, VO2, and total calories burned for that session.</p>

              <h2>Why your treadmill's calorie display is wrong</h2>
              <p>Most treadmill displays are calibrated for a default bodyweight of around 70kg and barely account for incline. If you weigh more or less than that — or you're walking at any meaningful incline — the number on the screen can be off by 20–40% or more. This calculator uses the <strong>ACSM (American College of Sports Medicine) metabolic equations</strong>, the gold standard used in exercise science research, and accounts for your actual weight, speed, and grade.</p>

              <h2>Why incline matters so much</h2>
              <p>Every percentage point of incline significantly increases calorie burn at the same speed — walking at 12% incline burns roughly twice as many calories as walking flat at the same pace. This is the entire premise behind the popular <Link to="/articles/12-3-30-workout-does-it-work">12-3-30 workout</Link> (12% incline, 3mph, 30 minutes), which produces a calorie burn comparable to jogging with a fraction of the joint impact.</p>

              <h2>Gross vs Net calories — which should I use?</h2>
              <p><strong>Gross calories</strong> include the calories you'd burn anyway just by being alive (your resting metabolic rate) during that time. <strong>Net calories</strong> subtract that baseline, showing only the calories burned specifically because of the exercise. For tracking total daily energy expenditure or fitting exercise into a calorie budget, Gross is usually the more useful number — it reflects what actually leaves your "calorie bank" for the day.</p>

              <h2>For accurate results, this calculator assumes:</h2>
              <ul>
                <li>Steady-state submaximal aerobic exercise (constant pace, no sprinting)</li>
                <li>Walking speeds between 1.9–3.7 mph (3–6 km/hr) for the walking equation</li>
                <li>Running at least 3 mph (4.8 km/hr) for the running equation</li>
                <li>Not holding onto the handrails — this can reduce calorie burn by 20–30%</li>
                <li>No wind, sand, snow, or gait abnormalities affecting efficiency</li>
              </ul>
              <p className="calc-note">Calculations use the ACSM metabolic equations exactly as published. Results may differ slightly from textbook examples since no intermediate rounding is applied.</p>

              <div className="calc-links">
                <Link to="/calculators/steps">Steps to Calories Calculator</Link>
                <span>|</span>
                <Link to="/calculators/pace">Pace Calculator</Link>
                <span>|</span>
                <Link to="/calculators/tdee">TDEE Calculator</Link>
                <span>|</span>
                <Link to="/articles/treadmill-incline-walking-burn-calories">The Best Way to Use a Treadmill</Link>
                <span>|</span>
                <Link to="/articles/12-3-30-workout-does-it-work">The 12-3-30 Workout</Link>
                <span>|</span>
                <Link to="/articles/how-to-get-10000-steps-a-day">How to Get 10,000 Steps a Day</Link>
                <span>|</span>
                <Link to="/calculators">All Calculators</Link>
              </div>
            </div>
          </div>

          <aside className="calc-sidebar">
            <div className="adsense-slot" style={{ minHeight: 250 }}>AdSense · 300×250</div>
            <div className="calc-related">
              <h3>Related Calculators</h3>
              <Link to="/calculators/steps">Steps to Calories</Link>
              <Link to="/calculators/pace">Pace Calculator</Link>
              <Link to="/calculators/zone2">Zone 2 Heart Rate</Link>
              <Link to="/calculators/heart-rate-zones">Heart Rate Zones</Link>
              <Link to="/calculators/tdee">TDEE Calculator</Link>
            </div>
            <div className="calc-related">
              <h3>Related Articles</h3>
              <Link to="/articles/treadmill-incline-walking-burn-calories">The Best Way to Use a Treadmill</Link>
              <Link to="/articles/12-3-30-workout-does-it-work">The 12-3-30 Workout</Link>
              <Link to="/articles/how-to-get-10000-steps-a-day">How to Get 10,000 Steps a Day</Link>
              <Link to="/articles/how-to-make-cardio-not-boring">How to Make Cardio Not Boring</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}