import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './CalcPage.css';
import './RestingHeartRateCalculator.css';

// RHR categories by age group (bpm) — based on general population reference ranges
// [athlete, excellent, good, average, belowAverage, poor]
const RHR_RANGES = {
  '18-25': [[49,55],[56,61],[62,65],[66,73],[74,81],[82,999]],
  '26-35': [[49,54],[55,61],[62,65],[66,73],[74,81],[82,999]],
  '36-45': [[50,56],[57,62],[63,66],[67,74],[75,82],[83,999]],
  '46-55': [[50,57],[58,63],[64,67],[68,75],[76,83],[84,999]],
  '56-65': [[51,56],[57,61],[62,67],[68,75],[76,84],[85,999]],
  '65+':   [[50,55],[56,61],[62,65],[66,73],[74,79],[80,999]],
};
const CATEGORIES = ['Athlete','Excellent','Good','Average','Below Average','Poor'];
const CAT_COLOURS = ['#D85A30','#4ade80','#8bd450','#f59e0b','#fb923c','#e23636'];

const AGE_GROUPS = [
  { id:'18-25', label:'18–25' },
  { id:'26-35', label:'26–35' },
  { id:'36-45', label:'36–45' },
  { id:'46-55', label:'46–55' },
  { id:'56-65', label:'56–65' },
  { id:'65+',   label:'65+' },
];

function getCategory(rhr, ageGroup) {
  const ranges = RHR_RANGES[ageGroup];
  for (let i=0;i<ranges.length;i++){
    if (rhr >= ranges[i][0] && rhr <= ranges[i][1]) return i;
  }
  return rhr < ranges[0][0] ? 0 : ranges.length-1;
}

export default function RestingHeartRateCalculator() {
  const [rhr,      setRhr]      = useState('');
  const [ageGroup, setAgeGroup] = useState('26-35');

  const rhrNum = parseInt(rhr) || 0;
  const valid  = rhrNum >= 30 && rhrNum <= 120;

  const catIdx = valid ? getCategory(rhrNum, ageGroup) : null;
  const ranges = RHR_RANGES[ageGroup];

  return (
    <>
      <Helmet>
        <title>Resting Heart Rate Calculator — What's a Good RHR? | LiftAndBurn</title>
        <meta name="description" content="Check what your resting heart rate means for your fitness and health. Compare your RHR against age-based reference ranges from athlete to poor." />
        <link rel="canonical" href="https://liftandburn.fit/calculators/resting-heart-rate" />
      </Helmet>
      <div className="calc-page container">
        <div className="calc-breadcrumb"><Link to="/calculators">Calculators</Link> › Resting Heart Rate</div>
        <h1 className="calc-page__title">Resting Heart Rate Calculator</h1>

        <div className="calc-layout">
          <div className="calc-main">
            <div className="calc-box">
              <div className="calc-grid">
                <div className="calc-row">
                  <label>Resting heart rate (bpm)</label>
                  <input type="number" min="30" max="120" placeholder="e.g. 62" value={rhr} onChange={e=>setRhr(e.target.value)} />
                </div>
                <div className="calc-row">
                  <label>Age group</label>
                  <select value={ageGroup} onChange={e=>setAgeGroup(e.target.value)}>
                    {AGE_GROUPS.map(a=><option key={a.id} value={a.id}>{a.label}</option>)}
                  </select>
                </div>
              </div>
              <p className="bf-note">Measure your resting heart rate first thing in the morning, before getting out of bed, for the most accurate reading.</p>
            </div>

            {valid && catIdx !== null && (
              <div className="calc-box rhr-results">
                <div className="rhr-category" style={{borderColor:CAT_COLOURS[catIdx],color:CAT_COLOURS[catIdx]}}>
                  {CATEGORIES[catIdx]}
                </div>
                <p className="rhr-value">{rhrNum} bpm</p>

                {/* Scale visualization */}
                <div className="rhr-scale">
                  {CATEGORIES.map((cat,i)=>(
                    <div key={cat} className={`rhr-scale__seg ${i===catIdx?'active':''}`} style={{background:i===catIdx?CAT_COLOURS[i]:'var(--bg-raised)'}}>
                      <span className="rhr-scale__label">{cat}</span>
                      <span className="rhr-scale__range">{ranges[i][1]===999?`${ranges[i][0]}+`:`${ranges[i][0]}–${ranges[i][1]}`}</span>
                    </div>
                  ))}
                </div>

                <p className="rhr-interpretation">
                  {catIdx <= 1 && "A lower resting heart rate generally indicates excellent cardiovascular fitness — your heart pumps more blood per beat, so it doesn't need to beat as often. This is common in well-trained endurance athletes."}
                  {catIdx === 2 && "Your resting heart rate is in a good range, indicating solid cardiovascular fitness. Regular cardio training can lower this further over time."}
                  {catIdx === 3 && "Your resting heart rate is around average. Regular cardiovascular exercise — particularly Zone 2 training — can lower your resting heart rate over weeks and months as your heart becomes more efficient."}
                  {catIdx >= 4 && "A higher resting heart rate can be influenced by fitness level, stress, sleep quality, caffeine, hydration, or underlying health factors. If consistently elevated and unexplained, it's worth discussing with a doctor."}
                </p>
              </div>
            )}

            <div className="calc-instructions">
              <h2>What is resting heart rate?</h2>
              <p>Resting heart rate (RHR) is the number of times your heart beats per minute while at complete rest. It's one of the simplest and most accessible indicators of cardiovascular fitness — no equipment beyond a watch or heart rate monitor is needed.</p>

              <h2>What's a normal resting heart rate?</h2>
              <p>For most adults, a normal resting heart rate falls between 60–100 bpm. However, "normal" and "good for fitness" are different things — well-trained endurance athletes often have resting heart rates in the 40s and 50s, which would be considered unusually low (bradycardia) in a sedentary person but is a sign of excellent cardiovascular efficiency in someone who trains regularly.</p>

              <h2>How to lower your resting heart rate</h2>
              <p>Resting heart rate typically decreases with consistent cardiovascular training over weeks to months. <strong>Zone 2 cardio</strong> — easy, sustained aerobic exercise — is particularly effective for improving the heart's stroke volume (how much blood it pumps per beat), which directly lowers resting heart rate. Other factors that influence RHR include sleep quality, stress levels, hydration, alcohol and caffeine intake, and overall health.</p>

              <h2>When to be concerned</h2>
              <p>A consistently elevated resting heart rate (above 100 bpm at rest, called tachycardia) or a very low one accompanied by symptoms like dizziness or fainting (bradycardia with symptoms) warrants a conversation with a doctor. A single measurement isn't diagnostic — what matters is your trend over time and whether changes are accompanied by other symptoms.</p>

              <div className="calc-links">
                <Link to="/calculators/heart-rate-zones">Heart Rate Zones →</Link>
                <span>|</span>
                <Link to="/calculators/zone2">Zone 2 Heart Rate</Link>
                <span>|</span>
                <Link to="/calculators/tdee">TDEE Calculator</Link>
              </div>
            </div>
          </div>

          <aside className="calc-sidebar">
            <div className="adsense-slot" style={{minHeight:250}}>AdSense · 300×250</div>
            <div className="calc-related">
              <h3>Related Calculators</h3>
              <Link to="/calculators/heart-rate-zones">Heart Rate Zones</Link>
              <Link to="/calculators/zone2">Zone 2 Heart Rate</Link>
              <Link to="/calculators/pace">Pace Calculator</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
