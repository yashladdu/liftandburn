import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './CalcPage.css';
import './WaterIntakeCalculator.css';

function round1(n){ return Math.round(n*10)/10; }

const ACTIVITY = [
  { id:'sedentary', label:'Sedentary',   mult:1.0,  desc:'Little/no exercise' },
  { id:'light',     label:'Light',       mult:1.12, desc:'1–3x/week' },
  { id:'moderate',  label:'Moderate',    mult:1.25, desc:'3–5x/week' },
  { id:'active',    label:'Active',      mult:1.38, desc:'6–7x/week' },
  { id:'very',      label:'Very Active', mult:1.5,  desc:'Hard daily training' },
];
const CLIMATE = [
  { id:'cool',     label:'Cool / Indoor', extra:0 },
  { id:'moderate', label:'Moderate',      extra:0.3 },
  { id:'hot',      label:'Hot / Humid',   extra:0.6 },
];

export default function WaterIntakeCalculator() {
  const [unit,     setUnit]    = useState('metric');
  const [weight,   setWeight]  = useState('');
  const [activity, setActivity]= useState('moderate');
  const [climate,  setClimate] = useState('moderate');

  const toKg = v => unit==='metric' ? parseFloat(v)||0 : (parseFloat(v)||0)/2.205;
  const kg   = toKg(weight);
  const valid = kg >= 30;

  const actMult  = ACTIVITY.find(a=>a.id===activity)?.mult || 1.25;
  const climExtra= CLIMATE.find(c=>c.id===climate)?.extra || 0.3;

  // Base: 35ml per kg, adjusted for activity and climate
  const baseL   = kg * 0.035;
  const totalL  = valid ? round1(baseL * actMult + climExtra) : 0;
  const totalMl = Math.round(totalL * 1000);
  const cups    = Math.round(totalL / 0.237);
  const flOz    = Math.round(totalL * 33.814);

  const glasses8oz = Math.round(flOz / 8);

  return (
    <>
      <Helmet>
        <title>Water Intake Calculator — Daily Hydration Guide | LiftAndBurn</title>
        <meta name="description" content="Calculate your daily water intake based on body weight, activity level, and climate. Get personalised hydration targets in litres, ml, and cups." />
        <link rel="canonical" href="https://liftandburn.fit/calculators/water-intake" />
      </Helmet>
      <div className="calc-page container">
        <div className="calc-breadcrumb"><Link to="/calculators">Calculators</Link> › Water Intake</div>
        <h1 className="calc-page__title">Water Intake Calculator</h1>
        <div className="calc-layout">
          <div className="calc-main">
            <div className="calc-box">
              <div className="wi-toggle-row">
                <button className={`cd-toggle ${unit==='metric'?'active':''}`} onClick={()=>setUnit('metric')}>kg</button>
                <button className={`cd-toggle ${unit==='imperial'?'active':''}`} onClick={()=>setUnit('imperial')}>lbs</button>
              </div>
              <div className="calc-grid" style={{gridTemplateColumns:'1fr',maxWidth:240,marginTop:16}}>
                <div className="calc-row">
                  <label>Body weight ({unit==='metric'?'kg':'lbs'})</label>
                  <input type="number" min="1" placeholder={unit==='metric'?'e.g. 80':'e.g. 176'} value={weight} onChange={e=>setWeight(e.target.value)} />
                </div>
              </div>

              <p className="cd-section-label" style={{marginTop:20}}>Activity level</p>
              <div className="wi-activity-grid">
                {ACTIVITY.map(a=>(
                  <button key={a.id} className={`wi-activity ${activity===a.id?'active':''}`} onClick={()=>setActivity(a.id)}>
                    <span className="wi-activity__label">{a.label}</span>
                    <span className="wi-activity__desc">{a.desc}</span>
                  </button>
                ))}
              </div>

              <p className="cd-section-label" style={{marginTop:20}}>Climate</p>
              <div className="wi-climate-row">
                {CLIMATE.map(c=>(
                  <button key={c.id} className={`wi-climate ${climate===c.id?'active':''}`} onClick={()=>setClimate(c.id)}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {valid && (
              <div className="calc-box wi-results">
                <div className="wi-primary">
                  <span className="wi-primary__val">{totalL}</span>
                  <span className="wi-primary__unit">litres / day</span>
                </div>
                <div className="wi-conversions">
                  <div className="wi-conv"><span className="wi-conv__val">{totalMl}</span><span className="wi-conv__label">ml</span></div>
                  <div className="wi-conv"><span className="wi-conv__val">{flOz}</span><span className="wi-conv__label">fl oz</span></div>
                  <div className="wi-conv"><span className="wi-conv__val">{glasses8oz}</span><span className="wi-conv__label">× 8oz glasses</span></div>
                  <div className="wi-conv"><span className="wi-conv__val">{cups}</span><span className="wi-conv__label">cups (240ml)</span></div>
                </div>
                <p className="wi-note">This is your total fluid intake target — including water from food (roughly 20% of daily intake) and all beverages. Pure water intake is approximately {round1(totalL * 0.8)}L.</p>
              </div>
            )}

            <div className="calc-instructions">
              <h2>How daily water intake is calculated</h2>
              <p>The base formula is 35ml per kg of bodyweight — the standard clinical starting point. This is then adjusted upward for physical activity (which increases sweat loss) and hot or humid climates (which further increase fluid needs).</p>
              <h2>Signs of dehydration during training</h2>
              <p>A 2% drop in body water is enough to impair exercise performance measurably. Signs include darker urine, thirst (which lags actual dehydration), headaches, reduced endurance, and decreased strength. Aim to drink consistently throughout the day rather than large amounts at once.</p>
              <div className="calc-links">
                <Link to="/calculators/tdee">TDEE Calculator →</Link>
                <span>|</span>
                <Link to="/calculators">All Calculators</Link>
              </div>
            </div>
          </div>
          <aside className="calc-sidebar">
            <div className="adsense-slot" style={{minHeight:250}}>AdSense · 300×250</div>
            <div className="calc-related">
              <h3>Related Calculators</h3>
              <Link to="/calculators/tdee">TDEE Calculator</Link>
              <Link to="/calculators/calorie-deficit">Calorie Deficit</Link>
              <Link to="/calculators/macros">Macro Calculator</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
