import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './CalcPage.css';
import './PaceCalculator.css';

// ── Helpers ───────────────────────────────────────────────────
const DISTANCES = [
  { id: '5k',       label: '5K',          km: 5 },
  { id: '10k',      label: '10K',         km: 10 },
  { id: 'half',     label: 'Half Marathon', km: 21.0975 },
  { id: 'marathon', label: 'Marathon',    km: 42.195 },
  { id: 'custom',   label: 'Custom',      km: null },
];

function secToTime(totalSec) {
  if (!isFinite(totalSec) || totalSec <= 0) return '–';
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.round(totalSec % 60);
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${m}:${String(s).padStart(2,'0')}`;
}
function timeToSec(h, m, s) {
  return (parseInt(h)||0)*3600 + (parseInt(m)||0)*60 + (parseInt(s)||0);
}

export default function PaceCalculator() {
  const [mode,   setMode]   = useState('pace'); // 'pace' | 'time' | 'distance'
  const [unit,   setUnit]   = useState('km');   // km | mi

  // Distance
  const [distId,   setDistId]   = useState('5k');
  const [customKm, setCustomKm] = useState('');

  // Time inputs
  const [hh, setHh] = useState('');
  const [mm, setMm] = useState('');
  const [ss, setSs] = useState('');

  // Pace inputs (min/sec per unit)
  const [pMin, setPMin] = useState('');
  const [pSec, setPSec] = useState('');

  const distKm = distId === 'custom'
    ? (parseFloat(customKm) || 0)
    : (DISTANCES.find(d=>d.id===distId)?.km || 0);

  const distInUnit = unit === 'km' ? distKm : distKm * 0.621371;

  const totalTimeSec = timeToSec(hh, mm, ss);
  const paceSecPerUnit = timeToSec(0, pMin, pSec);

  // ── Calculations ──────────────────────────────────────────
  let resultTime = null, resultPace = null, resultSpeed = null;

  if (mode === 'pace' && totalTimeSec > 0 && distInUnit > 0) {
    // time + distance -> pace
    resultPace = totalTimeSec / distInUnit;
    resultSpeed = distInUnit / (totalTimeSec/3600);
  }
  if (mode === 'time' && paceSecPerUnit > 0 && distInUnit > 0) {
    // pace + distance -> time
    resultTime = paceSecPerUnit * distInUnit;
    resultSpeed = 3600 / paceSecPerUnit;
  }
  if (mode === 'distance' && paceSecPerUnit > 0 && totalTimeSec > 0) {
    // pace + time -> distance
    const dist = totalTimeSec / paceSecPerUnit;
    resultTime = dist; // repurpose: store distance here
    resultSpeed = 3600 / paceSecPerUnit;
  }

  const uLabel = unit === 'km' ? 'km' : 'mi';

  return (
    <>
      <Helmet>
        <title>Pace Calculator — Running & Walking Pace, Time, Distance | LiftAndBurn</title>
        <meta name="description" content="Free pace calculator for runners and walkers. Calculate your pace per km or mile, predict finish times for 5K, 10K, half marathon and marathon, or find distance from pace and time." />
        <link rel="canonical" href="https://liftandburn.fit/calculators/pace" />
      </Helmet>
      <div className="calc-page container">
        <div className="calc-breadcrumb"><Link to="/calculators">Calculators</Link> › Pace Calculator</div>
        <h1 className="calc-page__title">Pace Calculator</h1>

        <div className="calc-layout">
          <div className="calc-main">

            {/* Mode + unit toggles */}
            <div className="pc-toggles">
              <div className="pc-toggle-group">
                <button className={`cd-toggle ${mode==='pace'?'active':''}`}     onClick={()=>setMode('pace')}>Find Pace</button>
                <button className={`cd-toggle ${mode==='time'?'active':''}`}     onClick={()=>setMode('time')}>Predict Time</button>
                <button className={`cd-toggle ${mode==='distance'?'active':''}`} onClick={()=>setMode('distance')}>Find Distance</button>
              </div>
              <div className="pc-toggle-group">
                <button className={`cd-toggle ${unit==='km'?'active':''}`} onClick={()=>setUnit('km')}>km</button>
                <button className={`cd-toggle ${unit==='mi'?'active':''}`} onClick={()=>setUnit('mi')}>mi</button>
              </div>
            </div>

            <div className="calc-box">
              {/* Distance picker — shown unless finding distance */}
              {mode !== 'distance' && (
                <>
                  <p className="cd-section-label">Distance</p>
                  <div className="pc-dist-pills">
                    {DISTANCES.map(d=>(
                      <button key={d.id} className={`pc-pill ${distId===d.id?'active':''}`} onClick={()=>setDistId(d.id)}>
                        {d.label}
                      </button>
                    ))}
                  </div>
                  {distId==='custom' && (
                    <div className="calc-row" style={{maxWidth:160,marginTop:10}}>
                      <label>Distance ({uLabel})</label>
                      <input type="number" min="0.1" step="0.01" placeholder={unit==='km'?'e.g. 8':'e.g. 5'} value={customKm} onChange={e=>setCustomKm(unit==='km'?e.target.value:(parseFloat(e.target.value)*1.60934).toString())} />
                    </div>
                  )}
                  {distId!=='custom' && (
                    <p className="pc-dist-display">{round2(distInUnit)} {uLabel}</p>
                  )}
                </>
              )}

              {/* Time input — shown for pace mode and distance mode */}
              {(mode === 'pace' || mode === 'distance') && (
                <>
                  <p className="cd-section-label" style={{marginTop:16}}>Time</p>
                  <div className="pc-time-row">
                    <div className="pc-time-field"><input type="number" min="0" placeholder="HH" value={hh} onChange={e=>setHh(e.target.value)} /><span>h</span></div>
                    <div className="pc-time-field"><input type="number" min="0" max="59" placeholder="MM" value={mm} onChange={e=>setMm(e.target.value)} /><span>m</span></div>
                    <div className="pc-time-field"><input type="number" min="0" max="59" placeholder="SS" value={ss} onChange={e=>setSs(e.target.value)} /><span>s</span></div>
                  </div>
                </>
              )}

              {/* Pace input — shown for time mode and distance mode */}
              {(mode === 'time' || mode === 'distance') && (
                <>
                  <p className="cd-section-label" style={{marginTop:16}}>Pace (per {uLabel})</p>
                  <div className="pc-time-row">
                    <div className="pc-time-field"><input type="number" min="0" placeholder="MM" value={pMin} onChange={e=>setPMin(e.target.value)} /><span>min</span></div>
                    <div className="pc-time-field"><input type="number" min="0" max="59" placeholder="SS" value={pSec} onChange={e=>setPSec(e.target.value)} /><span>sec</span></div>
                  </div>
                </>
              )}
            </div>

            {/* Results */}
            {((mode==='pace' && resultPace) || (mode==='time' && resultTime) || (mode==='distance' && resultTime)) && (
              <div className="calc-box pc-results">
                {mode==='pace' && (
                  <>
                    <div className="pc-primary">
                      <span className="pc-primary__val">{secToTime(resultPace)}</span>
                      <span className="pc-primary__unit">min/{uLabel}</span>
                    </div>
                    <div className="pc-meta-grid">
                      <div className="cd-meta-item"><span className="cd-meta-label">Speed</span><span className="cd-meta-val">{round2(resultSpeed)} {uLabel}/h</span></div>
                      <div className="cd-meta-item"><span className="cd-meta-label">Pace per {uLabel==='km'?'mile':'km'}</span><span className="cd-meta-val">{secToTime(resultPace * (uLabel==='km'?1.60934:0.621371))}</span></div>
                    </div>
                  </>
                )}
                {mode==='time' && (
                  <>
                    <div className="pc-primary">
                      <span className="pc-primary__val">{secToTime(resultTime)}</span>
                      <span className="pc-primary__unit">finish time</span>
                    </div>
                    <div className="pc-meta-grid">
                      <div className="cd-meta-item"><span className="cd-meta-label">Speed</span><span className="cd-meta-val">{round2(resultSpeed)} {uLabel}/h</span></div>
                      <div className="cd-meta-item"><span className="cd-meta-label">Distance</span><span className="cd-meta-val">{round2(distInUnit)} {uLabel}</span></div>
                    </div>
                  </>
                )}
                {mode==='distance' && (
                  <>
                    <div className="pc-primary">
                      <span className="pc-primary__val">{round2(resultTime)}</span>
                      <span className="pc-primary__unit">{uLabel} covered</span>
                    </div>
                    <div className="pc-meta-grid">
                      <div className="cd-meta-item"><span className="cd-meta-label">Speed</span><span className="cd-meta-val">{round2(resultSpeed)} {uLabel}/h</span></div>
                    </div>
                  </>
                )}

                {/* Race time predictions table — only in pace mode */}
                {mode==='pace' && resultPace && (
                  <div className="pc-predictions">
                    <p className="cd-section-label" style={{marginTop:16}}>Predicted times at this pace</p>
                    <div className="pc-pred-grid">
                      {DISTANCES.filter(d=>d.id!=='custom').map(d=>{
                        const dKm = d.km;
                        const dInUnit = unit==='km'?dKm:dKm*0.621371;
                        const t = resultPace * dInUnit;
                        return (
                          <div key={d.id} className="pc-pred-item">
                            <span className="pc-pred-label">{d.label}</span>
                            <span className="pc-pred-val">{secToTime(t)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SEO content */}
            <div className="calc-instructions">
              <h2>How to use the pace calculator</h2>
              <p><strong>Find Pace:</strong> enter your finish time and the distance — get your pace per km or mile, your average speed, and predicted finish times for other common race distances at that same pace.</p>
              <p><strong>Predict Time:</strong> enter a target pace and distance to see your projected finish time. Useful for race planning — if you know you can hold a certain pace, this tells you what finish time to expect.</p>
              <p><strong>Find Distance:</strong> enter a pace and a time duration to see how far you'd cover. Useful for planning training runs around a time budget.</p>

              <h2>What is a good running pace?</h2>
              <p>Pace varies enormously by fitness level and goal. As a rough guide for 5K pace: beginners often run 7:00–9:00 min/km, intermediate runners 5:30–6:30 min/km, and competitive runners under 5:00 min/km. Walking pace for fitness purposes is typically 10:00–15:00 min/km depending on intensity.</p>

              <h2>Pace vs speed</h2>
              <p>Pace is time per unit of distance (minutes per km or mile) — lower is faster. Speed is distance per unit of time (km/h or mph) — higher is faster. Runners typically think in pace; cyclists and treadmill displays typically use speed. This calculator converts between both.</p>

              <div className="calc-links">
                <Link to="/calculators/treadmill-calorie-calculator">Treadmill Calorie Calculator →</Link>
                <span>|</span>
                <Link to="/calculators/heart-rate-zones">Heart Rate Zones</Link>
                <span>|</span>
                <Link to="/calculators/steps">Steps to Calories</Link>
              </div>
            </div>
          </div>

          <aside className="calc-sidebar">
            <div className="adsense-slot" style={{minHeight:250}}>AdSense · 300×250</div>
            <div className="calc-related">
              <h3>Related Calculators</h3>
              <Link to="/calculators/treadmill-calorie-calculator">Treadmill Calorie Calculator</Link>
              <Link to="/calculators/heart-rate-zones">Heart Rate Zones</Link>
              <Link to="/calculators/zone2">Zone 2 Heart Rate</Link>
              <Link to="/calculators/steps">Steps to Calories</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

function round2(n){ return Math.round(n*100)/100; }
