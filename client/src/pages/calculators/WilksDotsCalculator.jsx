import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './CalcPage.css';
import './WilksDotsCalculator.css';

function round2(n){ return Math.round(n*100)/100; }

// Wilks 2 (2020 revised)
const WILKS2_A_MALE   = [-216.0475144, 16.2606339, -0.002388645, -0.00113732, 7.01863E-06, -1.291E-08];
const WILKS2_A_FEMALE = [ 594.31747775582, -27.23842536447, 0.82112226871, -0.00930733913, 4.731582E-05, -9.054E-08];

function wilks2(liftKg, bwKg, sex) {
  const a = sex==='male' ? WILKS2_A_MALE : WILKS2_A_FEMALE;
  const coeff = 600 / (a[0] + a[1]*bwKg + a[2]*bwKg**2 + a[3]*bwKg**3 + a[4]*bwKg**4 + a[5]*bwKg**5);
  return round2(liftKg * coeff);
}

// DOTS formula
const DOTS_A_MALE   = [-307.75076, 24.0900756, -0.1918759221, 0.0007391293, -0.000001093];
const DOTS_A_FEMALE = [-57.96288, 13.6175032, -0.1126655495, 0.0005158568, -0.0000010706];

function dots(liftKg, bwKg, sex) {
  const a = sex==='male' ? DOTS_A_MALE : DOTS_A_FEMALE;
  const denom = a[0] + a[1]*bwKg + a[2]*bwKg**2 + a[3]*bwKg**3 + a[4]*bwKg**4;
  return round2(liftKg * 500 / denom);
}

const STRENGTH_LEVELS = [
  { min:0,   max:80,  label:'Beginner',     colour:'#888' },
  { min:80,  max:120, label:'Intermediate', colour:'#4a9eff' },
  { min:120, max:160, label:'Advanced',     colour:'#4ade80' },
  { min:160, max:200, label:'Elite',        colour:'#f59e0b' },
  { min:200, max:999, label:'World Class',  colour:'#D85A30' },
];
function getLevel(score){ return STRENGTH_LEVELS.find(l=>score>=l.min&&score<l.max)||STRENGTH_LEVELS[0]; }

export default function WilksDotsCalculator() {
  const [unit,   setUnit]  = useState('metric');
  const [sex,    setSex]   = useState('male');
  const [bw,     setBw]    = useState('');
  const [squat,  setSquat] = useState('');
  const [bench,  setBench] = useState('');
  const [dead,   setDead]  = useState('');

  const toKg = v => unit==='metric'?parseFloat(v)||0:(parseFloat(v)||0)*0.453592;
  const uW = unit==='metric'?'kg':'lbs';

  const bwKg    = toKg(bw);
  const sqKg    = toKg(squat);
  const bpKg    = toKg(bench);
  const dlKg    = toKg(dead);
  const totalKg = sqKg + bpKg + dlKg;
  const valid   = bwKg >= 40 && totalKg > 0;

  const wilksTotal = valid ? wilks2(totalKg, bwKg, sex) : 0;
  const dotsTotal  = valid ? dots(totalKg, bwKg, sex)  : 0;
  const wilksSq    = sqKg>0&&valid ? wilks2(sqKg, bwKg, sex) : null;
  const wilksBp    = bpKg>0&&valid ? wilks2(bpKg, bwKg, sex) : null;
  const wilksDl    = dlKg>0&&valid ? wilks2(dlKg, bwKg, sex) : null;

  const level = valid ? getLevel(dotsTotal) : null;

  return (
    <>
      <Helmet>
        <title>Wilks & DOTS Calculator — Powerlifting Strength Score | LiftAndBurn</title>
        <meta name="description" content="Calculate your Wilks 2 and DOTS score for powerlifting. Compare your strength relative to bodyweight and see how you stack up across weight classes." />
        <link rel="canonical" href="https://liftandburn.fit/calculators/wilks-dots" />
      </Helmet>
      <div className="calc-page container">
        <div className="calc-breadcrumb"><Link to="/calculators">Calculators</Link> › Wilks / DOTS</div>
        <h1 className="calc-page__title">Wilks & DOTS Calculator</h1>
        <div className="calc-layout">
          <div className="calc-main">
            <div className="wd-toggles">
              <div className="lbm-toggle-group">
                <button className={`cd-toggle ${unit==='metric'?'active':''}`} onClick={()=>setUnit('metric')}>kg</button>
                <button className={`cd-toggle ${unit==='imperial'?'active':''}`} onClick={()=>setUnit('imperial')}>lbs</button>
              </div>
              <div className="lbm-toggle-group">
                <button className={`cd-toggle ${sex==='male'?'active':''}`} onClick={()=>setSex('male')}>Male</button>
                <button className={`cd-toggle ${sex==='female'?'active':''}`} onClick={()=>setSex('female')}>Female</button>
              </div>
            </div>

            <div className="calc-box">
              <div className="calc-grid">
                <div className="calc-row">
                  <label>Bodyweight ({uW})</label>
                  <input type="number" min="1" placeholder={unit==='metric'?'e.g. 83':'e.g. 183'} value={bw} onChange={e=>setBw(e.target.value)} />
                </div>
                <div className="calc-row">
                  <label>Squat ({uW}) <span className="bf-tip">optional</span></label>
                  <input type="number" min="1" placeholder={unit==='metric'?'e.g. 180':'e.g. 396'} value={squat} onChange={e=>setSquat(e.target.value)} />
                </div>
                <div className="calc-row">
                  <label>Bench Press ({uW}) <span className="bf-tip">optional</span></label>
                  <input type="number" min="1" placeholder={unit==='metric'?'e.g. 120':'e.g. 264'} value={bench} onChange={e=>setBench(e.target.value)} />
                </div>
                <div className="calc-row">
                  <label>Deadlift ({uW}) <span className="bf-tip">optional</span></label>
                  <input type="number" min="1" placeholder={unit==='metric'?'e.g. 220':'e.g. 485'} value={dead} onChange={e=>setDead(e.target.value)} />
                </div>
              </div>
              <p className="bf-note">Enter any combination of lifts. For full powerlifting total, enter all three.</p>
            </div>

            {valid && (
              <div className="calc-box wd-results">
                {level && (
                  <div className="wd-level" style={{borderColor:level.colour,color:level.colour}}>
                    {level.label}
                  </div>
                )}
                <div className="wd-scores">
                  <div className="wd-score">
                    <span className="wd-score__label">DOTS Score</span>
                    <span className="wd-score__val" style={{color:'var(--accent)'}}>{dotsTotal}</span>
                    <span className="wd-score__note">Current IPF standard</span>
                  </div>
                  <div className="wd-score">
                    <span className="wd-score__label">Wilks 2 Score</span>
                    <span className="wd-score__val">{wilksTotal}</span>
                    <span className="wd-score__note">Revised 2020</span>
                  </div>
                </div>

                {(wilksSq||wilksBp||wilksDl) && (
                  <div className="wd-breakdown">
                    <p className="cd-section-label">Individual lift scores (Wilks)</p>
                    <div className="wd-lift-row">
                      {wilksSq&&<div className="wd-lift"><span>Squat</span><span>{wilksSq}</span></div>}
                      {wilksBp&&<div className="wd-lift"><span>Bench</span><span>{wilksBp}</span></div>}
                      {wilksDl&&<div className="wd-lift"><span>Deadlift</span><span>{wilksDl}</span></div>}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="calc-instructions">
              <h2>What are Wilks and DOTS scores?</h2>
              <p>Both are formulas that adjust your powerlifting total for bodyweight, allowing fair comparison between lifters of different sizes. Without adjustment, heavier lifters always lift more in absolute terms — these formulas level the playing field.</p>
              <p><strong>DOTS</strong> is the current standard used by the International Powerlifting Federation (IPF). It replaced the original Wilks formula in 2020 and is considered more accurate across all weight classes.</p>
              <p><strong>Wilks 2</strong> is the 2020 revision of the original Wilks coefficient. Both are widely used and worth knowing.</p>
              <h2>Strength level guide (DOTS)</h2>
              {STRENGTH_LEVELS.map(l=>(
                <p key={l.label}><strong style={{color:l.colour}}>{l.label}:</strong> {l.min}–{l.max === 999 ? '200+' : l.max} points</p>
              ))}
              <div className="calc-links">
                <Link to="/calculators/one-rep-max">One Rep Max Calculator →</Link>
                <span>|</span>
                <Link to="/calculators">All Calculators</Link>
              </div>
            </div>
          </div>
          <aside className="calc-sidebar">
            <div className="adsense-slot" style={{minHeight:250}}>AdSense · 300×250</div>
            <div className="calc-related">
              <h3>Related Calculators</h3>
              <Link to="/calculators/one-rep-max">One Rep Max</Link>
              <Link to="/calculators/lean-body-mass">Lean Body Mass</Link>
              <Link to="/calculators/body-fat">Body Fat Calculator</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
