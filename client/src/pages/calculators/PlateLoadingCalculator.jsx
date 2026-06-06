import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './CalcPage.css';
import './PlateLoadingCalculator.css';

const PLATES_KG  = [25, 20, 15, 10, 5, 2.5, 2, 1.25, 1, 0.5, 0.25];
const PLATES_LBS = [45, 35, 25, 10, 5, 2.5, 1.25];

const BAR_WEIGHTS_KG  = [{ w:20, label:'Standard (20kg)' }, { w:15, label:"Women's (15kg)" }, { w:10, label:'Technique (10kg)' }];
const BAR_WEIGHTS_LBS = [{ w:45, label:'Standard (45lb)' }, { w:35, label:"Women's (35lb)" }, { w:22, label:'Technique (22lb)' }];

function calcPlates(targetKg, barKg, availablePlates) {
  const perSide = (targetKg - barKg) / 2;
  if (perSide < 0) return null;
  let remaining = perSide;
  const result = [];
  for (const plate of availablePlates) {
    const count = Math.floor(remaining / plate + 0.0001);
    if (count > 0) { result.push({ plate, count }); remaining = Math.round((remaining - count*plate)*1000)/1000; }
  }
  if (remaining > 0.1) return null; // can't make exact weight
  return { perSide, plates: result };
}

const PLATE_COLOURS_KG = {25:'#D85A30',20:'#D85A30',15:'#f59e0b',10:'#4a9eff',5:'#4ade80',2.5:'#fff',2:'#888',1.25:'#4ade80',1:'#888',0.5:'#888',0.25:'#888'};
const PLATE_COLOURS_LBS = {45:'#D85A30',35:'#4a9eff',25:'#4ade80',10:'#f59e0b',5:'#fff',2.5:'#888',1.25:'#888'};

export default function PlateLoadingCalculator() {
  const [unit,   setUnit]  = useState('metric');
  const [target, setTarget]= useState('');
  const [barIdx, setBarIdx]= useState(0);

  const bars   = unit==='metric' ? BAR_WEIGHTS_KG  : BAR_WEIGHTS_LBS;
  const plates = unit==='metric' ? PLATES_KG        : PLATES_LBS;
  const colours= unit==='metric' ? PLATE_COLOURS_KG : PLATE_COLOURS_LBS;
  const uW     = unit==='metric' ? 'kg' : 'lbs';

  const barW   = bars[barIdx]?.w || (unit==='metric'?20:45);
  const tgt    = parseFloat(target) || 0;
  const result = useMemo(()=> tgt>0 ? calcPlates(tgt, barW, plates) : null, [tgt, barW, plates]);
  const valid  = tgt > 0;
  const exact  = result !== null;

  // Closest achievable weight
  const closest = useMemo(()=>{
    if (!valid||exact) return null;
    for (let delta=0.25; delta<=20; delta+=0.25) {
      const r = calcPlates(tgt-delta, barW, plates);
      if (r) return { weight: tgt-delta, result: r, delta };
    }
    return null;
  },[tgt,barW,plates,valid,exact]);

  const display = result || closest?.result;
  const displayWeight = exact ? tgt : closest?.weight;

  return (
    <>
      <Helmet>
        <title>Plate Loading Calculator — What Plates to Put on the Bar | LiftAndBurn</title>
        <meta name="description" content="Calculate exactly which weight plates to put on each side of the barbell for any target weight. Metric and imperial, with a visual plate diagram." />
        <link rel="canonical" href="https://liftandburn.fit/calculators/plate-loading" />
      </Helmet>
      <div className="calc-page container">
        <div className="calc-breadcrumb"><Link to="/calculators">Calculators</Link> › Plate Loading</div>
        <h1 className="calc-page__title">Plate Loading Calculator</h1>
        <div className="calc-layout">
          <div className="calc-main">
            <div className="lbm-toggle-group" style={{marginBottom:0}}>
              <button className={`cd-toggle ${unit==='metric'?'active':''}`} onClick={()=>{setUnit('metric');setBarIdx(0);}}>kg</button>
              <button className={`cd-toggle ${unit==='imperial'?'active':''}`} onClick={()=>{setUnit('imperial');setBarIdx(0);}}>lbs</button>
            </div>

            <div className="calc-box">
              <div className="calc-grid">
                <div className="calc-row">
                  <label>Target weight ({uW})</label>
                  <input type="number" min="1" step="0.5" placeholder={unit==='metric'?'e.g. 100':'e.g. 225'} value={target} onChange={e=>setTarget(e.target.value)} />
                </div>
                <div className="calc-row">
                  <label>Barbell</label>
                  <select value={barIdx} onChange={e=>setBarIdx(parseInt(e.target.value))}>
                    {bars.map((b,i)=><option key={i} value={i}>{b.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {valid && display && (
              <div className="calc-box pl-results">
                {!exact && <p className="pl-warning">⚠️ {tgt}{uW} can't be made exactly. Showing {displayWeight}{uW} instead (closest possible).</p>}

                <div className="pl-total">
                  <span className="pl-total__val">{displayWeight}{uW}</span>
                  <span className="pl-total__note">Bar: {barW}{uW} + {display.perSide}{uW} per side</span>
                </div>

                {/* Visual barbell */}
                <div className="pl-barbell">
                  <div className="pl-bar-left">
                    {[...display.plates].reverse().map((p,i)=>
                      Array(p.count).fill(null).map((_,j)=>(
                        <div key={`l${i}-${j}`} className="pl-plate" style={{
                          background: colours[p.plate]||'#888',
                          width: Math.max(10, Math.min(40, p.plate*1.5))+'px',
                          opacity: colours[p.plate]==='#fff' ? 1 : 0.9,
                          color: colours[p.plate]==='#fff'?'#000':'#fff',
                        }}>
                          <span>{p.plate}</span>
                        </div>
                      ))
                    ).flat()}
                  </div>
                  <div className="pl-collar"/>
                  <div className="pl-shaft"><span className="pl-bar-label">{barW}{uW}</span></div>
                  <div className="pl-collar"/>
                  <div className="pl-bar-right">
                    {display.plates.map((p,i)=>
                      Array(p.count).fill(null).map((_,j)=>(
                        <div key={`r${i}-${j}`} className="pl-plate" style={{
                          background: colours[p.plate]||'#888',
                          width: Math.max(10, Math.min(40, p.plate*1.5))+'px',
                          opacity: colours[p.plate]==='#fff' ? 1 : 0.9,
                          color: colours[p.plate]==='#fff'?'#000':'#fff',
                        }}>
                          <span>{p.plate}</span>
                        </div>
                      ))
                    ).flat()}
                  </div>
                </div>

                {/* Plate list */}
                <div className="pl-list">
                  <p className="cd-section-label">Per side</p>
                  {display.plates.map(p=>(
                    <div key={p.plate} className="pl-list-row">
                      <div className="pl-list-dot" style={{background:colours[p.plate]||'#888'}}/>
                      <span className="pl-list-plate">{p.plate} {uW}</span>
                      <span className="pl-list-x">×</span>
                      <span className="pl-list-count">{p.count}</span>
                      <span className="pl-list-sub">= {Math.round(p.plate*p.count*100)/100}{uW}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {valid && !display && (
              <div className="calc-box">
                <p style={{color:'var(--text-muted)',fontSize:14}}>Target weight is below bar weight ({barW}{uW}). Choose a higher target.</p>
              </div>
            )}

            <div className="calc-instructions">
              <h2>How to use this calculator</h2>
              <p>Enter your target total weight (including the bar). The calculator works out the most efficient combination of plates for each side using the largest plates first. If the exact weight can't be made with standard plates, it shows the closest achievable weight below your target.</p>
              <h2>Standard plate availability</h2>
              <p>This calculator assumes access to a full set of plates. If your gym has limited plate sizes, the result may suggest plates you don't have. The calculation always uses the fewest plates possible (largest first).</p>
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
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
