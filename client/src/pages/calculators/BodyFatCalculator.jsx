import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './CalcPage.css';
import './BodyFatCalculator.css';

// ── Body fat category bands ───────────────────────────────────
const CATEGORIES = {
  male: [
    { max: 6,   label: 'Essential Fat',  colour: '#4a9eff' },
    { max: 14,  label: 'Athletic',       colour: '#4ade80' },
    { max: 18,  label: 'Fitness',        colour: '#a3e635' },
    { max: 25,  label: 'Average',        colour: '#f59e0b' },
    { max: 100, label: 'Obese',          colour: '#ef4444' },
  ],
  female: [
    { max: 14,  label: 'Essential Fat',  colour: '#4a9eff' },
    { max: 21,  label: 'Athletic',       colour: '#4ade80' },
    { max: 25,  label: 'Fitness',        colour: '#a3e635' },
    { max: 32,  label: 'Average',        colour: '#f59e0b' },
    { max: 100, label: 'Obese',          colour: '#ef4444' },
  ],
};

function getCategory(bf, sex) {
  const bands = CATEGORIES[sex] || CATEGORIES.male;
  return bands.find(b => bf <= b.max) || bands[bands.length - 1];
}

// ── Unit helpers ──────────────────────────────────────────────
const cmToIn  = cm  => cm  / 2.54;
const kgToLbs = kg  => kg  * 2.20462;
const lbsToKg = lbs => lbs / 2.20462;
const inToCm  = i   => i   * 2.54;

// ══════════════════════════════════════════════════════════════
// METHOD FORMULAS
// ══════════════════════════════════════════════════════════════

// 1. U.S. Navy Circumference Method
// Male:   %BF = 86.010 × log10(waist − neck) − 70.041 × log10(height) + 36.76
// Female: %BF = 163.205 × log10(waist + hip − neck) − 97.684 × log10(height) − 78.387
function navyMethod({ sex, heightCm, waistCm, neckCm, hipCm }) {
  const h = heightCm, w = waistCm, n = neckCm, hip = hipCm;
  if (!h || !w || !n || (sex === 'female' && !hip)) return null;
  if (sex === 'male') {
    const val = 86.010 * Math.log10(w - n) - 70.041 * Math.log10(h) + 36.76;
    return Math.max(1, Math.round(val * 10) / 10);
  }
  const val = 163.205 * Math.log10(w + hip - n) - 97.684 * Math.log10(h) - 78.387;
  return Math.max(1, Math.round(val * 10) / 10);
}

// 2. YMCA Formula (waist + weight only, no height)
// Male:   %BF = (−98.42 + 4.15 × waistIn − 0.082 × weightLbs) / weightLbs × 100
// Female: %BF = (−76.76 + 4.15 × waistIn − 0.082 × weightLbs) / weightLbs × 100
function ymcaMethod({ sex, waistCm, weightKg }) {
  if (!waistCm || !weightKg) return null;
  const waistIn = cmToIn(waistCm);
  const wLbs    = kgToLbs(weightKg);
  const base    = sex === 'male' ? -98.42 : -76.76;
  const val     = (base + 4.15 * waistIn - 0.082 * wLbs) / wLbs * 100;
  return Math.max(1, Math.round(val * 10) / 10);
}

// 3. Jackson-Pollock 3-Site Skinfold
// Sites male:   chest, abdomen, thigh
// Sites female: tricep, suprailiac, thigh
// Body density → Siri equation %BF = (4.95 / BD − 4.50) × 100
function jpMethod({ sex, age, s1, s2, s3 }) {
  if (!age || !s1 || !s2 || !s3) return null;
  const sum = s1 + s2 + s3;
  let bd;
  if (sex === 'male') {
    bd = 1.10938 - 0.0008267 * sum + 0.0000016 * sum * sum - 0.0002574 * age;
  } else {
    bd = 1.0994921 - 0.0009929 * sum + 0.0000023 * sum * sum - 0.0001392 * age;
  }
  const val = (4.95 / bd - 4.50) * 100;
  return Math.max(1, Math.round(val * 10) / 10);
}

// 4. BMI-Based Estimation (Deurenberg formula)
// %BF = 1.20 × BMI + 0.23 × age − 10.8 × sex(1=male,0=female) − 5.4
function bmiMethod({ sex, age, heightCm, weightKg }) {
  if (!heightCm || !weightKg || !age) return null;
  const hM  = heightCm / 100;
  const bmi = weightKg / (hM * hM);
  const s   = sex === 'male' ? 1 : 0;
  const val = 1.20 * bmi + 0.23 * age - 10.8 * s - 5.4;
  return Math.max(1, Math.round(val * 10) / 10);
}

// ── Result gauge ──────────────────────────────────────────────
function BFGauge({ value, sex }) {
  if (!value) return null;
  const cat   = getCategory(value, sex);
  const clamp = Math.min(Math.max(value, 2), 45);
  const pct   = ((clamp - 2) / (45 - 2)) * 100;

  return (
    <div className="bf-gauge">
      <div className="bf-gauge__track">
        <div className="bf-gauge__fill" style={{ width: `${pct}%`, background: cat.colour }} />
        <div className="bf-gauge__needle" style={{ left: `${pct}%` }} />
      </div>
      <div className="bf-gauge__labels">
        <span>2%</span>
        <span>45%</span>
      </div>
    </div>
  );
}

// ── Result card ───────────────────────────────────────────────
function ResultCard({ method, value, sex, note }) {
  if (!value) return null;
  const cat = getCategory(value, sex);
  return (
    <div className="bf-result-card">
      <div className="bf-result-card__method">{method}</div>
      <div className="bf-result-card__value" style={{ color: cat.colour }}>
        {value}<span className="bf-result-card__unit">%</span>
      </div>
      <div className="bf-result-card__cat" style={{ color: cat.colour }}>{cat.label}</div>
      {note && <div className="bf-result-card__note">{note}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function BodyFatCalculator() {
  const [unit,   setUnit]   = useState('metric'); // metric | imperial
  const [sex,    setSex]    = useState('male');
  const [age,    setAge]    = useState('');

  // Shared measurements
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [waist,  setWaist]  = useState('');
  const [neck,   setNeck]   = useState('');
  const [hip,    setHip]    = useState('');

  // JP skinfold sites
  const [s1, setS1] = useState(''); // male: chest  / female: tricep
  const [s2, setS2] = useState(''); // male: abdomen / female: suprailiac
  const [s3, setS3] = useState(''); // male: thigh   / female: thigh

  // ── Convert all inputs to metric for formulas ────────────────
  const toKg = v => unit === 'metric' ? parseFloat(v) : lbsToKg(parseFloat(v));
  const toCm = v => unit === 'metric' ? parseFloat(v) : inToCm(parseFloat(v));

  const params = {
    sex,
    age:      parseFloat(age)    || 0,
    heightCm: toCm(height)       || 0,
    weightKg: toKg(weight)       || 0,
    waistCm:  toCm(waist)        || 0,
    neckCm:   toCm(neck)         || 0,
    hipCm:    toCm(hip)          || 0,
    s1: parseFloat(s1) || 0,
    s2: parseFloat(s2) || 0,
    s3: parseFloat(s3) || 0,
  };

  const navyBF = navyMethod(params);
  const ymcaBF = ymcaMethod(params);
  const jpBF   = jpMethod(params);
  const bmiBF  = bmiMethod(params);

  const hasAnyResult = navyBF || ymcaBF || jpBF || bmiBF;

  const uL = unit === 'metric' ? 'cm' : 'in';
  const uW = unit === 'metric' ? 'kg' : 'lbs';

  return (
    <>
      <Helmet>
        <title>Body Fat Percentage Calculator — Navy, YMCA, Skinfold | LiftAndBurn</title>
        <meta name="description" content="Calculate your body fat percentage using four methods: U.S. Navy, YMCA, Jackson-Pollock 3-site skinfold, and BMI-based. Instant results with category classification." />
        <link rel="canonical" href="https://liftandburn.fit/calculators/body-fat" />
      </Helmet>

      <div className="calc-page container">
        <div className="calc-breadcrumb">
          <Link to="/calculators">Calculators</Link> › Body Fat Calculator
        </div>
        <h1 className="calc-page__title">Body Fat Percentage Calculator</h1>

        <div className="calc-layout">
          <div className="calc-main">

            {/* ── Unit + Sex toggles ──────────────────────── */}
            <div className="bf-toggles">
              <div className="bf-toggle-group">
                <button className={`bf-toggle ${unit === 'metric' ? 'active' : ''}`} onClick={() => setUnit('metric')}>Metric (cm / kg)</button>
                <button className={`bf-toggle ${unit === 'imperial' ? 'active' : ''}`} onClick={() => setUnit('imperial')}>Imperial (in / lbs)</button>
              </div>
              <div className="bf-toggle-group">
                <button className={`bf-toggle ${sex === 'male' ? 'active' : ''}`} onClick={() => setSex('male')}>Male</button>
                <button className={`bf-toggle ${sex === 'female' ? 'active' : ''}`} onClick={() => setSex('female')}>Female</button>
              </div>
            </div>

            {/* ── Shared inputs ───────────────────────────── */}
            <div className="calc-box">
              <p className="bf-section-label">Basic measurements — used by all methods</p>
              <div className="calc-grid">
                <div className="calc-row">
                  <label>Age</label>
                  <input type="number" min="15" max="80" placeholder="e.g. 30" value={age} onChange={e => setAge(e.target.value)} />
                </div>
                <div className="calc-row">
                  <label>Height ({uL})</label>
                  <input type="number" min="1" placeholder={unit === 'metric' ? 'e.g. 178' : 'e.g. 70'} value={height} onChange={e => setHeight(e.target.value)} />
                </div>
                <div className="calc-row">
                  <label>Body Weight ({uW})</label>
                  <input type="number" min="1" placeholder={unit === 'metric' ? 'e.g. 80' : 'e.g. 176'} value={weight} onChange={e => setWeight(e.target.value)} />
                </div>
                <div className="calc-row">
                  <label>Waist ({uL}) <span className="bf-tip">at navel</span></label>
                  <input type="number" min="1" placeholder={unit === 'metric' ? 'e.g. 85' : 'e.g. 33'} value={waist} onChange={e => setWaist(e.target.value)} />
                </div>
                <div className="calc-row">
                  <label>Neck ({uL}) <span className="bf-tip">below larynx</span></label>
                  <input type="number" min="1" placeholder={unit === 'metric' ? 'e.g. 38' : 'e.g. 15'} value={neck} onChange={e => setNeck(e.target.value)} />
                </div>
                {sex === 'female' && (
                  <div className="calc-row">
                    <label>Hip ({uL}) <span className="bf-tip">widest point</span></label>
                    <input type="number" min="1" placeholder={unit === 'metric' ? 'e.g. 95' : 'e.g. 37'} value={hip} onChange={e => setHip(e.target.value)} />
                  </div>
                )}
              </div>
            </div>

            {/* ── Jackson-Pollock skinfold inputs ─────────── */}
            <div className="calc-box">
              <p className="bf-section-label">
                Skinfold measurements ({uL === 'in' ? 'mm' : 'mm'}) —
                <span className="bf-tip"> optional · for Jackson-Pollock 3-site method only</span>
              </p>
              <div className="calc-grid">
                <div className="calc-row">
                  <label>{sex === 'male' ? 'Chest (mm)' : 'Tricep (mm)'}</label>
                  <input type="number" min="1" placeholder="e.g. 12" value={s1} onChange={e => setS1(e.target.value)} />
                </div>
                <div className="calc-row">
                  <label>{sex === 'male' ? 'Abdomen (mm)' : 'Suprailiac (mm)'}</label>
                  <input type="number" min="1" placeholder="e.g. 20" value={s2} onChange={e => setS2(e.target.value)} />
                </div>
                <div className="calc-row">
                  <label>Thigh (mm)</label>
                  <input type="number" min="1" placeholder="e.g. 15" value={s3} onChange={e => setS3(e.target.value)} />
                </div>
              </div>
              <p className="bf-note">Skinfold calipers measure pinched skin thickness in mm. Measurements are the same unit regardless of your cm/in preference above.</p>
            </div>

            {/* ── Results ─────────────────────────────────── */}
            {hasAnyResult && (
              <div className="calc-box bf-results">
                <p className="bf-section-label">Your results</p>

                {/* Primary result — Navy (most widely used) */}
                {navyBF && (
                  <div className="bf-primary">
                    <div className="bf-primary__label">U.S. Navy Method</div>
                    <div className="bf-primary__value" style={{ color: getCategory(navyBF, sex).colour }}>
                      {navyBF}<span>%</span>
                    </div>
                    <div className="bf-primary__cat" style={{ color: getCategory(navyBF, sex).colour }}>
                      {getCategory(navyBF, sex).label}
                    </div>
                    <BFGauge value={navyBF} sex={sex} />
                  </div>
                )}

                {/* Other method cards */}
                <div className="bf-method-cards">
                  {ymcaBF && <ResultCard method="YMCA"            value={ymcaBF} sex={sex} note="Tape measure only" />}
                  {jpBF   && <ResultCard method="Jackson-Pollock" value={jpBF}   sex={sex} note="3-site skinfold" />}
                  {bmiBF  && <ResultCard method="BMI-Based"       value={bmiBF}  sex={sex} note="Least accurate" />}
                </div>

                {/* Category legend */}
                <div className="bf-legend">
                  {CATEGORIES[sex].map(c => (
                    <div key={c.label} className="bf-legend__item">
                      <span className="bf-legend__dot" style={{ background: c.colour }} />
                      <span className="bf-legend__label">{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SEO instructions ────────────────────────── */}
            <div className="calc-instructions">
              <h2>Which method is most accurate?</h2>
              <p>Accuracy depends on the method and who is measuring. From most to least accurate for home use:</p>
              <p><strong>Jackson-Pollock 3-site skinfold</strong> is the gold standard among non-lab methods when performed consistently by a trained person using quality calipers. Skinfold measurements pinch subcutaneous fat directly, making this more accurate than circumference methods for most people.</p>
              <p><strong>U.S. Navy circumference method</strong> is the most practical for self-measurement. It requires only a flexible measuring tape, is well-validated by research, and is accurate to within 3–4% for most people. Best for tracking trends over time.</p>
              <p><strong>YMCA formula</strong> requires only waist and weight — the simplest measurement set. Slightly less accurate than Navy because it omits neck and height, but useful if you have limited measurements available.</p>
              <p><strong>BMI-based estimation</strong> (Deurenberg formula) is the least accurate because BMI conflates fat mass with muscle mass. A lean, muscular person may get a high body fat estimate using this method. Use it only as a rough baseline.</p>

              <h2>How to measure correctly</h2>
              <p><strong>Waist:</strong> Measure horizontally at the level of your navel, relaxed breath (not sucked in). Stand straight, feet together.</p>
              <p><strong>Neck:</strong> Measure just below the larynx (Adam's apple), sloping slightly downward toward the front. Do not compress the tape.</p>
              <p><strong>Hip (women only):</strong> Measure at the widest point of the hips and buttocks.</p>
              <p><strong>Skinfolds:</strong> Pinch the skin firmly between thumb and forefinger, pulling the fold away from the muscle. Apply caliper jaws about 1 cm from your fingers, wait 2 seconds, then read. Take three measurements per site and use the average.</p>

              <h2>Body fat categories</h2>
              <table className="bf-table">
                <thead>
                  <tr><th>Category</th><th>Men</th><th>Women</th></tr>
                </thead>
                <tbody>
                  <tr><td>Essential Fat</td><td>2–5%</td><td>10–13%</td></tr>
                  <tr><td>Athletic</td><td>6–13%</td><td>14–20%</td></tr>
                  <tr><td>Fitness</td><td>14–17%</td><td>21–24%</td></tr>
                  <tr><td>Average</td><td>18–24%</td><td>25–31%</td></tr>
                  <tr><td>Obese</td><td>25%+</td><td>32%+</td></tr>
                </tbody>
              </table>

              <h2>Body fat vs BMI — what's the difference?</h2>
              <p>BMI (Body Mass Index) measures the ratio of weight to height — it has no idea whether that weight is muscle or fat. A bodybuilder with 10% body fat can have a "obese" BMI. Body fat percentage directly measures the proportion of your body weight that is fat tissue, making it a far more useful measure of health and body composition. See our <Link to="/calculators/bmi">BMI calculator</Link> for a full explanation of why BMI is misleading.</p>

              <div className="calc-links">
                <Link to="/calculators/bmi">BMI Calculator →</Link>
                <span>|</span>
                <Link to="/calculators/tdee">TDEE Calculator</Link>
                <span>|</span>
                <Link to="/calculators/macros">Macro Calculator</Link>
                <span>|</span>
                <Link to="/calculators">All Calculators</Link>
              </div>
            </div>

          </div>

          {/* ── Sidebar ──────────────────────────────────── */}
          <aside className="calc-sidebar">
            <div className="adsense-slot" style={{ minHeight: 250 }}>AdSense · 300×250</div>
            <div className="calc-related">
              <h3>Related Calculators</h3>
              <Link to="/calculators/bmi">BMI Calculator</Link>
              <Link to="/calculators/tdee">TDEE Calculator</Link>
              <Link to="/calculators/macros">Macro Calculator</Link>
              <Link to="/calculators/one-rep-max">One Rep Max</Link>
            </div>
            <div className="calc-related">
              <h3>Related Articles</h3>
              <Link to="/articles/why-the-scale-lies-measure-fat-loss">Why the Scale Lies</Link>
              <Link to="/articles/how-much-protein-to-build-muscle">How Much Protein Do You Need?</Link>
              <Link to="/articles/junk-volume-too-many-sets">Junk Volume</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
