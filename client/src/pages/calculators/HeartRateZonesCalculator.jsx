import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './CalcPage.css';
import './HeartRateZonesCalculator.css';

const ZONES = [
  { id:1, name:'Zone 1', label:'Recovery',       range:[0.50,0.60], colour:'#4ade80', desc:'Very light activity. Active recovery, warm-up, cool-down.' },
  { id:2, name:'Zone 2', label:'Aerobic Base',    range:[0.60,0.70], colour:'#4a9eff', desc:'Easy, conversational pace. Builds aerobic base and fat-burning efficiency.' },
  { id:3, name:'Zone 3', label:'Tempo',           range:[0.70,0.80], colour:'#f59e0b', desc:'Moderate effort. Improves aerobic capacity, harder to sustain long periods.' },
  { id:4, name:'Zone 4', label:'Threshold',       range:[0.80,0.90], colour:'#D85A30', desc:'Hard effort, near lactate threshold. Improves speed and stamina.' },
  { id:5, name:'Zone 5', label:'Max Effort',      range:[0.90,1.00], colour:'#e23636', desc:'All-out effort. Short bursts only — improves max power and speed.' },
];

// Tanaka formula: 208 - 0.7 × age (more accurate than 220-age)
function maxHrTanaka(age){ return 208 - 0.7*age; }
function maxHrTraditional(age){ return 220 - age; }

function round0(n){ return Math.round(n); }

export default function HeartRateZonesCalculator() {
  const [age,    setAge]    = useState('');
  const [formula, setFormula] = useState('tanaka');
  const [rhr,    setRhr]    = useState(''); // optional, for Karvonen

  const ageNum = parseInt(age) || 0;
  const valid  = ageNum > 0 && ageNum < 100;

  const maxHr = valid
    ? (formula==='tanaka' ? maxHrTanaka(ageNum) : maxHrTraditional(ageNum))
    : 0;

  const rhrNum = parseInt(rhr) || 0;
  const useKarvonen = rhrNum > 0 && rhrNum < maxHr;
  const hrReserve = maxHr - rhrNum;

  const getZoneRange = (low, high) => {
    if (useKarvonen) {
      return [round0(rhrNum + hrReserve*low), round0(rhrNum + hrReserve*high)];
    }
    return [round0(maxHr*low), round0(maxHr*high)];
  };

  return (
    <>
      <Helmet>
        <title>Heart Rate Zone Calculator — All 5 Training Zones | LiftAndBurn</title>
        <meta name="description" content="Calculate all 5 heart rate training zones based on your age — recovery, aerobic base, tempo, threshold, and max effort. Uses the Tanaka formula for accuracy." />
        <link rel="canonical" href="https://liftandburn.fit/calculators/heart-rate-zones" />
      </Helmet>
      <div className="calc-page container">
        <div className="calc-breadcrumb"><Link to="/calculators">Calculators</Link> › Heart Rate Zones</div>
        <h1 className="calc-page__title">Heart Rate Zone Calculator</h1>

        <div className="calc-layout">
          <div className="calc-main">
            <div className="calc-box">
              <div className="calc-grid">
                <div className="calc-row">
                  <label>Age</label>
                  <input type="number" min="10" max="99" placeholder="e.g. 30" value={age} onChange={e=>setAge(e.target.value)} />
                </div>
                <div className="calc-row">
                  <label>Resting heart rate <span className="bf-tip">optional, more accurate</span></label>
                  <input type="number" min="30" max="100" placeholder="e.g. 60" value={rhr} onChange={e=>setRhr(e.target.value)} />
                </div>
              </div>

              <p className="cd-section-label" style={{marginTop:16}}>Max HR formula</p>
              <div className="lbm-toggle-group">
                <button className={`cd-toggle ${formula==='tanaka'?'active':''}`} onClick={()=>setFormula('tanaka')}>Tanaka (208 − 0.7×age)</button>
                <button className={`cd-toggle ${formula==='traditional'?'active':''}`} onClick={()=>setFormula('traditional')}>Traditional (220 − age)</button>
              </div>
            </div>

            {valid && (
              <div className="calc-box hrz-results">
                <div className="hrz-maxhr">
                  <span className="hrz-maxhr__label">Estimated Max Heart Rate</span>
                  <span className="hrz-maxhr__val">{round0(maxHr)} bpm</span>
                  {useKarvonen && <span className="hrz-maxhr__note">Using Karvonen method (with resting HR)</span>}
                </div>

                <div className="hrz-zones">
                  {ZONES.map(z=>{
                    const [lo, hi] = getZoneRange(z.range[0], z.range[1]);
                    return (
                      <div key={z.id} className="hrz-zone" style={{borderLeftColor:z.colour}}>
                        <div className="hrz-zone__header">
                          <span className="hrz-zone__name" style={{color:z.colour}}>{z.name} — {z.label}</span>
                          <span className="hrz-zone__range">{lo}–{hi} bpm</span>
                        </div>
                        <p className="hrz-zone__desc">{z.desc}</p>
                        <div className="hrz-zone__bar">
                          <div className="hrz-zone__fill" style={{background:z.colour, width: `${z.range[1]*100}%`}} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="calc-instructions">
              <h2>What are heart rate zones?</h2>
              <p>Heart rate zones divide your training intensity into five bands based on percentage of your maximum heart rate. Each zone trains your cardiovascular system differently — from easy recovery work in Zone 1 to maximal efforts in Zone 5. Training across different zones (rather than always at the same intensity) produces more well-rounded fitness adaptations.</p>

              <h2>Tanaka vs the traditional 220-age formula</h2>
              <p>The traditional "220 minus age" formula has been used for decades but has been shown to be inaccurate, particularly for older adults — it tends to overestimate max heart rate in younger people and underestimate it in older people. The Tanaka formula (208 − 0.7 × age), developed from a meta-analysis of over 18,000 people, is more accurate across age ranges and is increasingly the preferred formula.</p>

              <h2>The Karvonen method</h2>
              <p>If you know your resting heart rate, the Karvonen method calculates your "heart rate reserve" (max HR minus resting HR) and bases zones on that, rather than a flat percentage of max HR alone. This accounts for individual cardiovascular fitness — two people with the same max HR but very different resting heart rates will get different (more accurate) zone ranges with this method.</p>

              <h2>Which zone should you train in?</h2>
              <p><strong>Zone 2</strong> should make up the majority of your cardio volume — it builds your aerobic base efficiently with low fatigue cost, allowing high weekly volume. <strong>Zone 4-5</strong> work should be limited to 1-2 short sessions per week — these are highly effective but also highly fatiguing. Most recreational exercisers benefit from an 80/20 split: roughly 80% easy (Zone 1-2) and 20% hard (Zone 4-5), with Zone 3 used sparingly.</p>

              <div className="calc-links">
                <Link to="/calculators/zone2">Zone 2 Heart Rate Calculator →</Link>
                <span>|</span>
                <Link to="/calculators/resting-heart-rate">Resting Heart Rate Interpreter</Link>
                <span>|</span>
                <Link to="/calculators/pace">Pace Calculator</Link>
              </div>
            </div>
          </div>

          <aside className="calc-sidebar">
            <div className="adsense-slot" style={{minHeight:250}}>AdSense · 300×250</div>
            <div className="calc-related">
              <h3>Related Calculators</h3>
              <Link to="/calculators/zone2">Zone 2 Heart Rate</Link>
              <Link to="/calculators/resting-heart-rate">Resting Heart Rate</Link>
              <Link to="/calculators/pace">Pace Calculator</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
