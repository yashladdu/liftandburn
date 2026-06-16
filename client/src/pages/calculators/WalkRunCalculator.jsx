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
    const fatGrams = (calories / 7700) * 1000;

    setResult({
      mets:      Math.round(mets * 10) / 10,
      vo2:       Math.round(vo2 * 10) / 10,
      vo2Abs:    Math.round(vo2Abs * 100) / 100,
      calories:  Math.round(calories),
      speedMmin: Math.round(speedMmin),
      fatGrams:  Math.round(fatGrams * 10) / 10,
    });
  };

  const reset = () => {
    setSpeed(''); setWeight(''); setDuration('');
    setGrade('0'); setResult(null); setError('');
  };

  return (
    <>
      <Helmet>
        <title>Treadmill Calorie Calculator</title>
        <link rel="canonical" href="https://liftandburn.fit/calculators/treadmill-calorie-calculator" />
        <meta name="description" content="Calculate calories, METs, and VO2 burned walking or running on a treadmill at any speed and incline using the ACSM metabolic equations — more accurate than your treadmill display." />
      </Helmet>

      <div className="calc-page container">
        <div className="calc-breadcrumb">
          <Link to="/calculators">Calculators</Link> › Treadmill Calorie Calculator
        </div>

        <h1 className="calc-page__title">Treadmill Calorie Calculator</h1>

        <p className="calc-page__intro">
          Calculate calories, METs, and oxygen burned walking or running on a treadmill at any speed and incline.
        </p>

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
                <div className="calc-result-grid" style={{ marginTop: 10 }}>
                  <div className="calc-result-item">
                    <span className="calc-result-val">{result.vo2Abs}</span>
                    <span className="calc-result-label">VO2 (L/min)</span>
                  </div>
                  <div className="calc-result-item">
                    <span className="calc-result-val">{result.fatGrams}g</span>
                    <span className="calc-result-label">Fat equivalent</span>
                  </div>
                  <div className="calc-result-item">
                    <span className="calc-result-val">{result.speedMmin}</span>
                    <span className="calc-result-label">Speed (m/min)</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── Instructions / authoritative SEO content ────────────────── */}
            <div className="calc-instructions">
              <h2>Introduction</h2>
              <p>This calculator predicts how many calories and how much fat-equivalent energy you burn on a treadmill, accounting for your speed, incline, body weight, and session duration. It works for both walking and running and covers the full range of inclines most treadmills support.</p>
              <p>Treadmills are used across nearly every type of training — a warm-up or cool-down around a lifting session, a standalone cardio workout, a low-impact option during injury recovery, or simply a reliable alternative to outdoor running when the weather doesn't cooperate. Whatever the context, knowing roughly how many calories a session burns is genuinely useful: it lets you plan nutrition around longer or harder sessions and keep an accurate sense of your daily energy balance, whether the goal is fat loss, muscle gain, or maintenance.</p>

              <h2>What this calculator does</h2>
              <p>This calculator predicts calories burned, METs, and oxygen consumption (VO2) for a treadmill walking or running session of any speed, incline, body weight, and duration. It's built on the ACSM (American College of Sports Medicine) metabolic equations for walking and running — the same formulas used in exercise physiology labs and research studies, rather than the simplified, often inaccurate algorithm built into most treadmill consoles.</p>
              <p>Treadmills are used across almost every type of training — as a warm-up before lifting, a standalone cardio session, low-impact rehab after injury, or a controlled alternative to outdoor running in bad weather. Whatever the context, knowing roughly how many calories a session burns is useful for managing a calorie deficit, surplus, or maintenance, and for planning nutrition around longer or harder sessions.</p>

              <h2>Why your treadmill's built-in calorie counter is wrong</h2>
              <p>Most treadmill consoles are calibrated for a default bodyweight of around 70kg and barely account for incline. If you weigh more or less than that — or you're walking at any meaningful grade — the number on the screen can be off by 20–40% or more, sometimes considerably more at higher inclines. This calculator instead uses your actual weight, speed, and grade, run through the published ACSM equations, to give a far more individualised estimate.</p>

              <h2>How the calculation works</h2>
              <p>The starting point is METs — Metabolic Equivalents of Task. One MET represents the energy cost of sitting quietly. An activity with a MET value of 6 burns roughly six times as much energy as sitting still. The ACSM walking and running equations calculate a MET value (via VO2, oxygen consumption in millilitres per kilogram per minute) based on your speed and the treadmill's grade, then convert that into calories using your bodyweight and session duration:</p>
              <p style={{fontFamily:'monospace', background:'var(--bg-raised)', padding:'10px 14px', borderRadius:'var(--radius-sm)', fontSize:13}}>Calories = METs × bodyweight (kg) × duration (hours)</p>
              <p>For walking, the ACSM equation is: <em>VO2 = 0.1 × speed + 1.8 × speed × grade + 3.5</em>. For running, it's: <em>VO2 = 0.2 × speed + 0.9 × speed × grade + 3.5</em> (speed in metres per minute, grade as a decimal). The running equation reflects the higher vertical oscillation and energy cost of running compared to walking at any given horizontal speed.</p>

              <h2>Why incline changes everything</h2>
              <p>Grade (incline) has a disproportionately large effect on calorie burn. Every percentage point of incline increases the energy cost of each stride, because part of your effort now goes into climbing rather than just moving forward. Walking at 12% incline burns roughly twice as many calories as walking flat at the same speed — which is the entire premise behind the popular <Link to="/articles/12-3-30-workout-does-it-work">12-3-30 workout</Link> (12% incline, 3mph, 30 minutes): a session that produces a calorie burn and cardiovascular demand comparable to jogging, with a fraction of the impact on your joints.</p>
              <p>This is also why two people walking at the same speed but different inclines can have wildly different calorie burns for the "same" workout — speed alone tells you very little without knowing the grade.</p>

              <h2>Gross vs Net calories — which should you use?</h2>
              <p><strong>Gross calories</strong> include the calories you'd burn anyway just by being alive during that time (your resting metabolic rate). <strong>Net calories</strong> subtract that baseline, isolating only the calories burned specifically because of the exercise. For tracking total daily energy expenditure or fitting a session into a calorie budget, Gross is generally the more useful figure — it reflects what actually leaves your "calorie bank" for the day, since your body would have burned the resting portion regardless of whether you exercised.</p>

              <h2>Treadmill vs outdoor — why they're not quite the same</h2>
              <p>Treadmill walking and running are generally slightly easier than the outdoor equivalent at the same speed, for a few consistent reasons: there's no wind resistance to push against, the belt assists the backward leg drive slightly, the surface is flat and perfectly consistent rather than cambered or uneven, and there's no need to navigate obstacles, traffic, or changing terrain. A commonly used rule of thumb is that running on a treadmill at a 1% incline roughly matches the energy cost of running outdoors on the flat — which is why many runners default to a 1% grade on the treadmill to better simulate outdoor conditions.</p>

              <h2>For accurate results, this calculator assumes:</h2>
              <ul>
                <li>Steady-state submaximal aerobic exercise (a constant pace, not sprint intervals)</li>
                <li>Walking speeds between roughly 1.9–3.7 mph (3–6 km/hr) for the walking equation</li>
                <li>Running at least 3 mph (4.8 km/hr) for the running equation</li>
                <li>Not holding onto the handrails — doing so can reduce calorie burn by 20–30% by taking load off your legs</li>
                <li>No wind, sand, snow, or gait abnormalities affecting movement efficiency</li>
              </ul>
              <p className="calc-note">Calculations use the ACSM metabolic equations exactly as published. Results may differ slightly from textbook examples since no intermediate rounding is applied during calculation.</p>

              <div className="calc-links">
                <Link to="/calculators/steps-to-calories">Steps to Calories Calculator</Link>
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
              <Link to="/calculators/steps-to-calories">Steps to Calories</Link>
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