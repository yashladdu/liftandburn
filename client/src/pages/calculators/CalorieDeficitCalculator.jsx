import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './CalcPage.css';
import './CalorieDeficitCalculator.css';

function round1(n) { return Math.round(n * 10) / 10; }

export default function CalorieDeficitCalculator() {
  const [unit,    setUnit]    = useState('metric');
  const [weight,  setWeight]  = useState('');
  const [goal,    setGoal]    = useState('');
  const [deficit, setDeficit] = useState('500');

  const toKg   = v => unit === 'metric' ? parseFloat(v) : parseFloat(v) / 2.205;
  const fromKg = v => unit === 'metric' ? v : v * 2.205;
  const uW     = unit === 'metric' ? 'kg' : 'lbs';

  const currentKg = toKg(weight) || 0;
  const goalKg    = toKg(goal)   || 0;
  const defNum    = parseInt(deficit) || 500;

  const kgToLose   = currentKg - goalKg;
  const valid      = kgToLose > 0 && defNum > 0;
  const kcalPerKg  = 7700;
  const totalKcal  = kgToLose * kcalPerKg;
  const days       = valid ? Math.round(totalKcal / defNum)       : 0;
  const weeks      = valid ? round1(days / 7)                      : 0;
  const months     = valid ? round1(days / 30.44)                  : 0;
  const goalDate   = valid ? new Date(Date.now() + days * 86400000) : null;
  const dateStr    = goalDate ? goalDate.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }) : '';
  const weeklyLoss = valid ? round1((defNum * 7) / kcalPerKg)      : 0;

  const PRESETS = [
    { label: 'Aggressive', val: '750',  note: '~0.68kg/week' },
    { label: 'Moderate',   val: '500',  note: '~0.45kg/week' },
    { label: 'Mild',       val: '300',  note: '~0.27kg/week' },
    { label: 'Slow',       val: '200',  note: '~0.18kg/week' },
  ];

  return (
    <>
      <Helmet>
        <title>Calorie Deficit Calculator — How Long to Lose Weight | LiftAndBurn</title>
        <meta name="description" content="Calculate exactly how long it will take to reach your goal weight based on your daily calorie deficit. Shows weeks, months, and your target date." />
        <link rel="canonical" href="https://liftandburn.fit/calculators/calorie-deficit" />
      </Helmet>
      <div className="calc-page container">
        <div className="calc-breadcrumb"><Link to="/calculators">Calculators</Link> › Calorie Deficit</div>
        <h1 className="calc-page__title">Calorie Deficit Calculator</h1>
        <div className="calc-layout">
          <div className="calc-main">
            {/* Unit toggle */}
            <div className="cd-toggle-row">
              <button className={`cd-toggle ${unit==='metric'?'active':''}`} onClick={()=>setUnit('metric')}>kg</button>
              <button className={`cd-toggle ${unit==='imperial'?'active':''}`} onClick={()=>setUnit('imperial')}>lbs</button>
            </div>

            <div className="calc-box">
              <div className="calc-grid">
                <div className="calc-row">
                  <label>Current weight ({uW})</label>
                  <input type="number" min="1" placeholder={unit==='metric'?'e.g. 85':'e.g. 187'} value={weight} onChange={e=>setWeight(e.target.value)} />
                </div>
                <div className="calc-row">
                  <label>Goal weight ({uW})</label>
                  <input type="number" min="1" placeholder={unit==='metric'?'e.g. 75':'e.g. 165'} value={goal} onChange={e=>setGoal(e.target.value)} />
                </div>
              </div>

              <p className="cd-section-label">Daily calorie deficit</p>
              <div className="cd-presets">
                {PRESETS.map(p=>(
                  <button key={p.val} className={`cd-preset ${deficit===p.val?'active':''}`} onClick={()=>setDeficit(p.val)}>
                    <span className="cd-preset__label">{p.label}</span>
                    <span className="cd-preset__val">{p.val} kcal</span>
                    <span className="cd-preset__note">{p.note}</span>
                  </button>
                ))}
              </div>
              <div className="calc-row" style={{marginTop:12,maxWidth:200}}>
                <label>Custom deficit (kcal/day)</label>
                <input type="number" min="50" max="1500" value={deficit} onChange={e=>setDeficit(e.target.value)} />
              </div>
              {weight && goal && goalKg >= currentKg && currentKg > 0 && (
                <p className="calc-error">Goal weight must be less than current weight.</p>
              )}
            </div>

            {valid && (
              <div className="calc-box cd-results">
                <div className="cd-primary">
                  <div className="cd-primary__item">
                    <span className="cd-primary__val">{weeks}</span>
                    <span className="cd-primary__unit">weeks</span>
                  </div>
                  <div className="cd-primary__divider"/>
                  <div className="cd-primary__item">
                    <span className="cd-primary__val cd-accent">{months}</span>
                    <span className="cd-primary__unit">months</span>
                  </div>
                  <div className="cd-primary__divider"/>
                  <div className="cd-primary__item">
                    <span className="cd-primary__val">{days}</span>
                    <span className="cd-primary__unit">days</span>
                  </div>
                </div>
                <div className="cd-meta-grid">
                  <div className="cd-meta-item">
                    <span className="cd-meta-label">To lose</span>
                    <span className="cd-meta-val">{round1(fromKg(kgToLose))} {uW}</span>
                  </div>
                  <div className="cd-meta-item">
                    <span className="cd-meta-label">Weekly loss</span>
                    <span className="cd-meta-val">{unit==='metric'?weeklyLoss:round1(weeklyLoss*2.205)} {uW}/week</span>
                  </div>
                  <div className="cd-meta-item">
                    <span className="cd-meta-label">Total calories</span>
                    <span className="cd-meta-val">{Math.round(totalKcal).toLocaleString()} kcal</span>
                  </div>
                  <div className="cd-meta-item">
                    <span className="cd-meta-label">Target date</span>
                    <span className="cd-meta-val cd-accent">{dateStr}</span>
                  </div>
                </div>
                {defNum > 1000 && (
                  <p className="cd-warning">⚠️ A deficit over 1,000 kcal/day is aggressive. Muscle loss and fatigue become significant above this level. 500–750 kcal is more sustainable for most people.</p>
                )}
              </div>
            )}

            <div className="calc-instructions">
              <h2>How this is calculated</h2>
              <p>Fat loss is driven by a calorie deficit — consuming fewer calories than your body burns. The widely used estimate is that 1 kg of body fat contains approximately 7,700 kcal. A daily deficit of 500 kcal therefore burns roughly 0.45 kg per week (500 × 7 ÷ 7,700).</p>
              <p>This calculator multiplies your total weight-to-lose by 7,700 to find the total calorie deficit required, then divides by your daily deficit to get days.</p>
              <h2>Choosing your deficit</h2>
              <p><strong>200–300 kcal:</strong> Very mild. Best for minimising muscle loss, ideal if you're lean and already training hard.</p>
              <p><strong>500 kcal:</strong> The standard recommendation. ~0.45 kg/week, sustainable for most people.</p>
              <p><strong>750 kcal:</strong> Aggressive but manageable for most people with a lot to lose. High protein intake becomes critical.</p>
              <p><strong>1,000+ kcal:</strong> Very aggressive. Higher muscle loss risk. Not recommended for extended periods.</p>
              <div className="calc-links">
                <Link to="/calculators/tdee">Find your TDEE →</Link>
                <span>|</span>
                <Link to="/calculators/macros">Macro Calculator</Link>
                <span>|</span>
                <Link to="/articles/why-the-scale-lies-measure-fat-loss">Why the Scale Lies</Link>
              </div>
            </div>
          </div>
          <aside className="calc-sidebar">
            <div className="adsense-slot" style={{minHeight:250}}>AdSense · 300×250</div>
            <div className="calc-related">
              <h3>Related Calculators</h3>
              <Link to="/calculators/tdee">TDEE Calculator</Link>
              <Link to="/calculators/macros">Macro Calculator</Link>
              <Link to="/calculators/body-fat">Body Fat Calculator</Link>
              <Link to="/calculators/ideal-weight">Ideal Body Weight</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
