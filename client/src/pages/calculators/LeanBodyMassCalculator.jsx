import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './CalcPage.css';
import './LeanBodyMassCalculator.css';

function round1(n){ return Math.round(n*10)/10; }

// Boer formula (most accurate)
// Male:   LBM = 0.407×W + 0.267×H − 19.2
// Female: LBM = 0.252×W + 0.473×H − 48.3
function boer(wKg, hCm, sex){
  return sex==='male'
    ? 0.407*wKg + 0.267*hCm - 19.2
    : 0.252*wKg + 0.473*hCm - 48.3;
}
// James formula
// Male:   LBM = 1.1×W − 128×(W/H)²
// Female: LBM = 1.07×W − 148×(W/H)²
function james(wKg, hCm, sex){
  const r = (wKg / hCm);
  return sex==='male'
    ? 1.1*wKg - 128*(r*r)
    : 1.07*wKg - 148*(r*r);
}
// Hume formula
// Male:   LBM = 0.3281×W + 0.3393×H − 29.5336
// Female: LBM = 0.29569×W + 0.41813×H − 43.2933
function hume(wKg, hCm, sex){
  return sex==='male'
    ? 0.3281*wKg + 0.3393*hCm - 29.5336
    : 0.29569*wKg + 0.41813*hCm - 43.2933;
}

export default function LeanBodyMassCalculator() {
  const [unit,   setUnit]  = useState('metric');
  const [sex,    setSex]   = useState('male');
  const [weight, setWeight]= useState('');
  const [height, setHeight]= useState('');
  const [bf,     setBf]    = useState('');  // optional body fat %

  const toKg = v => unit==='metric'?parseFloat(v)||0:(parseFloat(v)||0)/2.205;
  const toCm = v => unit==='metric'?parseFloat(v)||0:(parseFloat(v)||0)*2.54;
  const fromKg = v => unit==='metric'?v:v*2.205;

  const wKg = toKg(weight);
  const hCm = toCm(height);
  const valid = wKg >= 30 && hCm >= 100;

  const bfVal = parseFloat(bf)||0;
  const hasBf = bfVal > 0 && bfVal < 70;

  // Direct from BF%
  const lbmFromBf = hasBf ? round1(wKg * (1 - bfVal/100)) : null;
  const fatFromBf = hasBf ? round1(wKg - lbmFromBf) : null;

  // Formula estimates
  const boerVal  = valid ? round1(boer(wKg, hCm, sex))  : null;
  const jamesVal = valid ? round1(james(wKg, hCm, sex)) : null;
  const humeVal  = valid ? round1(hume(wKg, hCm, sex))  : null;
  const avgLbm   = valid ? round1((boerVal+jamesVal+humeVal)/3) : null;
  const avgFat   = valid ? round1(wKg - avgLbm) : null;
  const avgBfPct = valid ? round1((avgFat/wKg)*100) : null;

  const primary  = hasBf ? lbmFromBf : avgLbm;
  const uW = unit==='metric'?'kg':'lbs';

  return (
    <>
      <Helmet>
        <title>Lean Body Mass Calculator — LBM & Fat Mass | LiftAndBurn</title>
        <meta name="description" content="Calculate your lean body mass (LBM) and fat mass using the Boer, James, and Hume formulas, or enter your body fat percentage for a direct calculation." />
        <link rel="canonical" href="https://liftandburn.fit/calculators/lean-body-mass" />
      </Helmet>
      <div className="calc-page container">
        <div className="calc-breadcrumb"><Link to="/calculators">Calculators</Link> › Lean Body Mass</div>
        <h1 className="calc-page__title">Lean Body Mass Calculator</h1>
        <div className="calc-layout">
          <div className="calc-main">
            <div className="lbm-toggles">
              <div className="lbm-toggle-group">
                <button className={`cd-toggle ${unit==='metric'?'active':''}`} onClick={()=>setUnit('metric')}>Metric</button>
                <button className={`cd-toggle ${unit==='imperial'?'active':''}`} onClick={()=>setUnit('imperial')}>Imperial</button>
              </div>
              <div className="lbm-toggle-group">
                <button className={`cd-toggle ${sex==='male'?'active':''}`} onClick={()=>setSex('male')}>Male</button>
                <button className={`cd-toggle ${sex==='female'?'active':''}`} onClick={()=>setSex('female')}>Female</button>
              </div>
            </div>

            <div className="calc-box">
              <div className="calc-grid">
                <div className="calc-row">
                  <label>Body weight ({uW})</label>
                  <input type="number" min="1" placeholder={unit==='metric'?'e.g. 80':'e.g. 176'} value={weight} onChange={e=>setWeight(e.target.value)} />
                </div>
                <div className="calc-row">
                  <label>Height ({unit==='metric'?'cm':'in'})</label>
                  <input type="number" min="1" placeholder={unit==='metric'?'e.g. 178':'e.g. 70'} value={height} onChange={e=>setHeight(e.target.value)} />
                </div>
                <div className="calc-row">
                  <label>Body fat % <span style={{color:'var(--text-faint)',fontWeight:400}}>(optional — most accurate)</span></label>
                  <input type="number" min="1" max="70" placeholder="e.g. 18" value={bf} onChange={e=>setBf(e.target.value)} />
                </div>
              </div>
            </div>

            {(valid || (hasBf && wKg>0)) && primary > 0 && (
              <div className="calc-box lbm-results">
                <div className="lbm-split">
                  <div className="lbm-split__item lbm-split--lean">
                    <span className="lbm-split__label">Lean Body Mass</span>
                    <span className="lbm-split__val">{round1(fromKg(primary))}</span>
                    <span className="lbm-split__unit">{uW}</span>
                  </div>
                  <div className="lbm-split__divider"/>
                  <div className="lbm-split__item lbm-split--fat">
                    <span className="lbm-split__label">Fat Mass</span>
                    <span className="lbm-split__val">{round1(fromKg(hasBf?fatFromBf:avgFat))}</span>
                    <span className="lbm-split__unit">{uW}</span>
                  </div>
                  {!hasBf && avgBfPct && (
                    <>
                    <div className="lbm-split__divider"/>
                    <div className="lbm-split__item">
                      <span className="lbm-split__label">Est. Body Fat</span>
                      <span className="lbm-split__val">{avgBfPct}</span>
                      <span className="lbm-split__unit">%</span>
                    </div>
                    </>
                  )}
                </div>

                {/* Visual bar */}
                <div className="lbm-bar-wrap">
                  <div className="lbm-bar">
                    <div className="lbm-bar__lean" style={{flex:primary}}/>
                    <div className="lbm-bar__fat" style={{flex:hasBf?fatFromBf:avgFat}}/>
                  </div>
                  <div className="lbm-bar__legend">
                    <span><span className="lbm-dot lbm-dot--lean"/>Lean</span>
                    <span><span className="lbm-dot lbm-dot--fat"/>Fat</span>
                  </div>
                </div>

                {valid && !hasBf && (
                  <div className="lbm-formula-row">
                    <div className="lbm-formula"><span>Boer</span><span>{round1(fromKg(boerVal))} {uW}</span></div>
                    <div className="lbm-formula"><span>James</span><span>{round1(fromKg(jamesVal))} {uW}</span></div>
                    <div className="lbm-formula"><span>Hume</span><span>{round1(fromKg(humeVal))} {uW}</span></div>
                  </div>
                )}
                {hasBf && <p className="lbm-note">Calculated directly from your body fat % — more accurate than formula estimates.</p>}
              </div>
            )}

            <div className="calc-instructions">
              <h2>What is lean body mass?</h2>
              <p>Lean body mass (LBM) is everything in your body that isn't fat — muscles, bones, organs, blood, and water. It's the foundation of your metabolic rate: a higher LBM means more calories burned at rest. When losing fat, preserving LBM is the goal — losing scale weight that is mostly fat while keeping muscle.</p>
              <h2>Which method is most accurate?</h2>
              <p>If you know your body fat percentage (from calipers, DEXA, or our body fat calculator), entering it gives the most accurate result. The formula estimates (Boer, James, Hume) are derived from population studies and are useful approximations when you don't have a body fat measurement.</p>
              <div className="calc-links">
                <Link to="/calculators/body-fat">Body Fat Calculator →</Link>
                <span>|</span>
                <Link to="/calculators/tdee">TDEE Calculator</Link>
                <span>|</span>
                <Link to="/calculators/ideal-weight">Ideal Body Weight</Link>
              </div>
            </div>
          </div>
          <aside className="calc-sidebar">
            <div className="adsense-slot" style={{minHeight:250}}>AdSense · 300×250</div>
            <div className="calc-related">
              <h3>Related Calculators</h3>
              <Link to="/calculators/body-fat">Body Fat Calculator</Link>
              <Link to="/calculators/bmi">BMI Calculator</Link>
              <Link to="/calculators/tdee">TDEE Calculator</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
