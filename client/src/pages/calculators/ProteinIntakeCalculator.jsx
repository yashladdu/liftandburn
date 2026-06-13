import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './CalcPage.css';
import './ProteinIntakeCalculator.css';

const GOALS = [
  { id:'maintain', label:'Maintain',     mult:0.7,  desc:'General health' },
  { id:'lose',     label:'Lose Fat',     mult:0.8,  desc:'Preserve muscle in a deficit' },
  { id:'build',    label:'Build Muscle', mult:0.8,  desc:'Maximise muscle growth' },
  { id:'athlete',  label:'Athlete',      mult:0.9,  desc:'High training volume' },
];

function round0(n){ return Math.round(n); }

export default function ProteinIntakeCalculator() {
  const [unit,   setUnit]   = useState('metric');
  const [weight, setWeight] = useState('');
  const [goal,   setGoal]   = useState('build');

  const toLbs = v => unit==='metric' ? (parseFloat(v)||0)*2.205 : (parseFloat(v)||0);
  const lbs = toLbs(weight);
  const valid = lbs > 0;

  const goalObj = GOALS.find(g=>g.id===goal) || GOALS[2];
  const proteinLow  = valid ? round0(lbs * (goalObj.mult - 0.1)) : 0;
  const proteinMid  = valid ? round0(lbs * goalObj.mult)         : 0;
  const proteinHigh = valid ? round0(lbs * (goalObj.mult + 0.1)) : 0;

  const proteinCals = proteinMid * 4;

  // Per-meal breakdown (3 meals + 1 snack)
  const perMeal = valid ? round0(proteinMid / 4) : 0;

  return (
    <>
      <Helmet>
        <title>Protein Intake Calculator — How Much Protein Do You Need? | LiftAndBurn</title>
        <meta name="description" content="Calculate exactly how much protein you need per day based on your bodyweight and goal — muscle building, fat loss, maintenance, or athletic performance." />
        <link rel="canonical" href="https://liftandburn.fit/calculators/protein-intake" />
      </Helmet>
      <div className="calc-page container">
        <div className="calc-breadcrumb"><Link to="/calculators">Calculators</Link> › Protein Intake</div>
        <h1 className="calc-page__title">Protein Intake Calculator</h1>

        <div className="calc-layout">
          <div className="calc-main">
            <div className="lbm-toggle-group">
              <button className={`cd-toggle ${unit==='metric'?'active':''}`} onClick={()=>setUnit('metric')}>kg</button>
              <button className={`cd-toggle ${unit==='imperial'?'active':''}`} onClick={()=>setUnit('imperial')}>lbs</button>
            </div>

            <div className="calc-box">
              <div className="calc-grid" style={{gridTemplateColumns:'1fr',maxWidth:240}}>
                <div className="calc-row">
                  <label>Body weight ({unit==='metric'?'kg':'lbs'})</label>
                  <input type="number" min="1" placeholder={unit==='metric'?'e.g. 75':'e.g. 165'} value={weight} onChange={e=>setWeight(e.target.value)} />
                </div>
              </div>

              <p className="cd-section-label" style={{marginTop:20}}>Goal</p>
              <div className="pi-goal-grid">
                {GOALS.map(g=>(
                  <button key={g.id} className={`pi-goal ${goal===g.id?'active':''}`} onClick={()=>setGoal(g.id)}>
                    <span className="pi-goal__label">{g.label}</span>
                    <span className="pi-goal__desc">{g.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {valid && (
              <div className="calc-box pi-results">
                <div className="pi-primary">
                  <span className="pi-primary__val">{proteinMid}</span>
                  <span className="pi-primary__unit">g protein / day</span>
                </div>
                <div className="pi-range">
                  Range: {proteinLow}g – {proteinHigh}g
                </div>
                <div className="pc-meta-grid" style={{marginTop:16}}>
                  <div className="cd-meta-item"><span className="cd-meta-label">From protein</span><span className="cd-meta-val">{proteinCals} kcal</span></div>
                  <div className="cd-meta-item"><span className="cd-meta-label">Per meal (÷4)</span><span className="cd-meta-val">{perMeal}g</span></div>
                </div>
              </div>
            )}

            <div className="calc-instructions">
              <h2>How much protein do you actually need?</h2>
              <p>The widely cited range for resistance-trained individuals is <strong>0.7–1.0g of protein per pound of bodyweight</strong> (roughly 1.6–2.2g per kg). Within that range:</p>
              <p><strong>0.7g/lb</strong> is sufficient for general health and maintenance — adequate for muscle preservation without active training goals.</p>
              <p><strong>0.8g/lb</strong> is the sweet spot for muscle building and fat loss. Higher protein during a calorie deficit helps preserve lean mass while losing fat.</p>
              <p><strong>0.9–1.0g/lb</strong> suits athletes with high training volume or those who respond well to higher protein intakes — there's minimal downside to slightly more, just diminishing returns.</p>

              <h2>Does eating more than this help?</h2>
              <p>Research shows diminishing returns above roughly 0.8g per pound for muscle protein synthesis. Eating significantly more than your target won't accelerate muscle growth further — the excess is simply used for energy like any other macronutrient.</p>

              <h2>How to hit your protein target</h2>
              <p>Spreading protein across 3–4 meals (roughly 25–40g per meal) appears to be more effective for muscle protein synthesis than consuming it all in one or two large meals. Good sources include chicken breast, eggs, Greek yogurt, whey protein, fish, and lean beef.</p>

              <div className="calc-links">
                <Link to="/high-protein-foods">High Protein Foods →</Link>
                <span>|</span>
                <Link to="/calculators/macros">Macro Calculator</Link>
                <span>|</span>
                <Link to="/cheapest-protein-sources">Cheapest Protein Sources</Link>
              </div>
            </div>
          </div>

          <aside className="calc-sidebar">
            <div className="adsense-slot" style={{minHeight:250}}>AdSense · 300×250</div>
            <div className="calc-related">
              <h3>Related Calculators</h3>
              <Link to="/calculators/macros">Macro Calculator</Link>
              <Link to="/calculators/tdee">TDEE Calculator</Link>
              <Link to="/calculators/lean-body-mass">Lean Body Mass</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
