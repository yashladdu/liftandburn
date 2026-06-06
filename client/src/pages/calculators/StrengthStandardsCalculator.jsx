import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './CalcPage.css';
import './StrengthStandardsCalculator.css';

// Strength standards as multiples of bodyweight (approximate, based on ExRx and community standards)
// [beginner, novice, intermediate, advanced, elite]
const STANDARDS = {
  male: {
    squat:    [0.75, 1.25, 1.5,  2.0,  2.75],
    bench:    [0.5,  0.75, 1.0,  1.5,  2.0 ],
    deadlift: [1.0,  1.5,  2.0,  2.5,  3.0 ],
    ohp:      [0.35, 0.55, 0.75, 1.0,  1.35],
    pullups:  [1,    3,    8,    15,   20   ], // reps
    grip:     [35,   45,   52,   58,   65   ], // kg (dominant hand dynamometer)
  },
  female: {
    squat:    [0.5,  0.75, 1.0,  1.5,  2.0 ],
    bench:    [0.25, 0.5,  0.65, 1.0,  1.35],
    deadlift: [0.75, 1.0,  1.25, 1.75, 2.25],
    ohp:      [0.2,  0.35, 0.5,  0.75, 1.0 ],
    pullups:  [0,    1,    3,    8,    15   ],
    grip:     [20,   27,   33,   38,   44   ],
  },
};
const LEVELS = ['Beginner','Novice','Intermediate','Advanced','Elite'];
const LEVEL_COLOURS = ['#888','#4a9eff','#4ade80','#f59e0b','#D85A30'];

const LIFTS = [
  { id:'squat',    label:'Squat',            unit:'weight', icon:'🏋️' },
  { id:'bench',    label:'Bench Press',       unit:'weight', icon:'💪' },
  { id:'deadlift', label:'Deadlift',          unit:'weight', icon:'🔩' },
  { id:'ohp',      label:'Overhead Press',    unit:'weight', icon:'⬆️' },
  { id:'pullups',  label:'Pull-ups',          unit:'reps',   icon:'🤸' },
  { id:'grip',     label:'Grip Strength',     unit:'kg',     icon:'🤜' },
];

function getLevel(value, standards, bw, unit) {
  if (!value || value <= 0) return null;
  const vals = unit==='weight' ? standards.map(s=>s*bw) : unit==='reps' ? standards : standards;
  let level = 0;
  for (let i=0;i<vals.length;i++) { if (value >= vals[i]) level = i; }
  return { index: level, label: LEVELS[level], colour: LEVEL_COLOURS[level], next: vals[level+1]||null };
}

function LevelBar({ levelIdx }) {
  return (
    <div className="ss-levelbar">
      {LEVELS.map((l,i)=>(
        <div key={l} className={`ss-levelbar__seg ${i<=levelIdx?'active':''}`}
          style={{ background: i<=levelIdx?LEVEL_COLOURS[i]:'var(--bg-raised)' }}
          title={l}
        />
      ))}
    </div>
  );
}

export default function StrengthStandardsCalculator() {
  const [unit,  setUnit]  = useState('metric');
  const [sex,   setSex]   = useState('male');
  const [bw,    setBw]    = useState('');
  const [lifts, setLifts] = useState({});

  const toKg = v => unit==='metric'?parseFloat(v)||0:(parseFloat(v)||0)/2.205;
  const bwKg = toKg(bw);
  const uW   = unit==='metric'?'kg':'lbs';
  const std  = STANDARDS[sex];

  const handleLift = (id, val) => setLifts(prev=>({...prev,[id]:val}));

  const results = LIFTS.map(lift=>{
    const raw = parseFloat(lifts[lift.id])||0;
    const kg  = lift.unit==='weight' ? toKg(raw) : raw;
    const lvl = bwKg>0&&kg>0 ? getLevel(kg, std[lift.id], bwKg, lift.unit) : null;
    return { ...lift, value:raw, kg, level:lvl };
  }).filter(r=>r.value>0&&r.level);

  return (
    <>
      <Helmet>
        <title>Strength Standards Calculator — How Strong Are You? | LiftAndBurn</title>
        <meta name="description" content="Find out where your lifts rank — beginner to elite. Strength standards for squat, bench, deadlift, overhead press, pull-ups, and grip strength relative to bodyweight." />
        <link rel="canonical" href="https://liftandburn.fit/calculators/strength-standards" />
      </Helmet>
      <div className="calc-page container">
        <div className="calc-breadcrumb"><Link to="/calculators">Calculators</Link> › Strength Standards</div>
        <h1 className="calc-page__title">Strength Standards Calculator</h1>
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
              <div className="calc-grid" style={{gridTemplateColumns:'1fr',maxWidth:240}}>
                <div className="calc-row">
                  <label>Bodyweight ({uW})</label>
                  <input type="number" min="1" placeholder={unit==='metric'?'e.g. 80':'e.g. 176'} value={bw} onChange={e=>setBw(e.target.value)} />
                </div>
              </div>
              <p className="cd-section-label" style={{marginTop:16}}>Your lifts (1RM for weighted, reps for pull-ups, kg for grip)</p>
              <div className="calc-grid">
                {LIFTS.map(lift=>(
                  <div key={lift.id} className="calc-row">
                    <label>{lift.icon} {lift.label} {lift.unit==='weight'?`(${uW})`:lift.unit==='reps'?'(reps)':'(kg)'}</label>
                    <input type="number" min="0" placeholder="optional" value={lifts[lift.id]||''} onChange={e=>handleLift(lift.id,e.target.value)} />
                  </div>
                ))}
              </div>
            </div>

            {results.length > 0 && (
              <div className="calc-box">
                <p className="cd-section-label">Your results</p>
                <div className="ss-results">
                  {results.map(r=>(
                    <div key={r.id} className="ss-result-row">
                      <div className="ss-result-left">
                        <span className="ss-result-icon">{r.icon}</span>
                        <span className="ss-result-name">{r.label}</span>
                      </div>
                      <div className="ss-result-mid">
                        <LevelBar levelIdx={r.level.index} />
                      </div>
                      <div className="ss-result-right">
                        <span className="ss-result-level" style={{color:r.level.colour}}>{r.level.label}</span>
                        {r.level.next && (
                          <span className="ss-result-next">
                            Next: {r.unit==='weight'?`${Math.round(r.level.next*(unit==='metric'?1:2.205))}${uW}`:r.unit==='reps'?`${r.level.next} reps`:`${r.level.next}kg`}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reference table */}
                <div className="ss-table-wrap">
                  <p className="cd-section-label" style={{marginTop:16}}>Full standards table</p>
                  <table className="bf-table">
                    <thead>
                      <tr>
                        <th>Lift</th>
                        {LEVELS.map((l,i)=><th key={l} style={{color:LEVEL_COLOURS[i]}}>{l}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {LIFTS.map(lift=>{
                        const s = std[lift.id];
                        return (
                          <tr key={lift.id}>
                            <td>{lift.label}</td>
                            {s.map((v,i)=>{
                              const display = lift.unit==='weight'&&bwKg>0
                                ? `${Math.round(v*bwKg*(unit==='metric'?1:2.205))}${uW}`
                                : lift.unit==='reps' ? `${v} reps`
                                : `${v}kg`;
                              return <td key={i}>{bwKg>0||lift.unit!=='weight'?display:`×${v}`}</td>;
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="calc-instructions">
              <h2>How strength standards work</h2>
              <p>Strength standards express lift performance as a multiple of bodyweight, allowing fair comparison between people of different sizes. A 1.5× bodyweight squat means squatting 1.5 times your own bodyweight for one rep.</p>
              <p>Standards vary between sources. These are based on widely used community benchmarks and ExRx data. They're useful as orientation, not as hard targets — context matters (training age, lifting style, individual leverages).</p>
              <h2>Pull-ups and grip strength</h2>
              <p>Pull-ups are expressed as reps at bodyweight. Grip strength is measured with a hand dynamometer in kilograms — a useful health and longevity marker. Grip strength correlates strongly with overall health outcomes in long-term studies.</p>
              <div className="calc-links">
                <Link to="/calculators/one-rep-max">One Rep Max →</Link>
                <span>|</span>
                <Link to="/calculators/wilks-dots">Wilks / DOTS</Link>
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
              <Link to="/calculators/wilks-dots">Wilks / DOTS</Link>
              <Link to="/calculators/lean-body-mass">Lean Body Mass</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
