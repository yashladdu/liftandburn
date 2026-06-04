import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './CalcPage.css';
import './MacroCalculator.css';

// ── Calorie constants ─────────────────────────────────────────
const KCAL_PER_G = { protein: 4, carbs: 4, fat: 9 };

// ── Preset macro splits ───────────────────────────────────────
const PRESETS = [
  { id: 'balanced',  label: 'Balanced',        desc: 'General health',        protein: 30, carbs: 40, fat: 30 },
  { id: 'muscle',    label: 'Muscle Gain',      desc: 'High protein + carbs',  protein: 35, carbs: 45, fat: 20 },
  { id: 'cut',       label: 'Fat Loss',         desc: 'High protein, low carb',protein: 40, carbs: 30, fat: 30 },
  { id: 'keto',      label: 'Keto',             desc: 'Very low carb',         protein: 25, carbs: 5,  fat: 70 },
  { id: 'athlete',   label: 'Endurance',        desc: 'Carb-heavy for energy', protein: 20, carbs: 55, fat: 25 },
  { id: 'custom',    label: 'Custom',           desc: 'Set your own split',    protein: 30, carbs: 40, fat: 30 },
];

export default function MacroCalculator() {
  // ── Mode toggle ──────────────────────────────────────────────
  const [mode, setMode] = useState('macros'); // 'macros' | 'calories'

  // ── Mode A: enter grams → get calories ──────────────────────
  const [protein, setProtein] = useState('');
  const [carbs,   setCarbs]   = useState('');
  const [fat,     setFat]     = useState('');

  // ── Mode B: enter calories → get grams ──────────────────────
  const [calories,      setCalories]      = useState('');
  const [selectedPreset, setSelectedPreset] = useState('balanced');
  const [customProtein,  setCustomProtein]  = useState(30);
  const [customCarbs,    setCustomCarbs]    = useState(40);
  const [customFat,      setCustomFat]      = useState(30);

  // ── Mode A calculations ──────────────────────────────────────
  const proteinKcal = (parseFloat(protein) || 0) * KCAL_PER_G.protein;
  const carbsKcal   = (parseFloat(carbs)   || 0) * KCAL_PER_G.carbs;
  const fatKcal     = (parseFloat(fat)     || 0) * KCAL_PER_G.fat;
  const totalKcal   = proteinKcal + carbsKcal + fatKcal;

  const proteinPct = totalKcal > 0 ? (proteinKcal / totalKcal) * 100 : 0;
  const carbsPct   = totalKcal > 0 ? (carbsKcal   / totalKcal) * 100 : 0;
  const fatPct     = totalKcal > 0 ? (fatKcal     / totalKcal) * 100 : 0;

  const hasGramResult = (parseFloat(protein) || 0) + (parseFloat(carbs) || 0) + (parseFloat(fat) || 0) > 0;

  // ── Mode B calculations ──────────────────────────────────────
  const preset = PRESETS.find(p => p.id === selectedPreset) || PRESETS[0];
  const split = selectedPreset === 'custom'
    ? { protein: customProtein, carbs: customCarbs, fat: customFat }
    : { protein: preset.protein, carbs: preset.carbs, fat: preset.fat };

  const customTotal = customProtein + customCarbs + customFat;

  const cal = parseFloat(calories) || 0;
  const proteinGrams = cal > 0 ? Math.round((cal * split.protein / 100) / KCAL_PER_G.protein) : 0;
  const carbsGrams   = cal > 0 ? Math.round((cal * split.carbs   / 100) / KCAL_PER_G.carbs)   : 0;
  const fatGrams     = cal > 0 ? Math.round((cal * split.fat     / 100) / KCAL_PER_G.fat)     : 0;

  const hasCalResult = cal > 0;

  // ── Custom split handler ─────────────────────────────────────
  const handleCustom = (field, val) => {
    const n = Math.max(0, Math.min(100, parseInt(val) || 0));
    if (field === 'protein') setCustomProtein(n);
    if (field === 'carbs')   setCustomCarbs(n);
    if (field === 'fat')     setCustomFat(n);
  };

  return (
    <>
      <Helmet>
        <title>Macro Calculator — Calories from Protein, Carbs & Fat | LiftAndBurn</title>
        <meta name="description" content="Calculate total calories from your macros, or find out how many grams of protein, carbs, and fat you need for any calorie target. Free macro calculator." />
        <link rel="canonical" href="https://liftandburn.fit/calculators/macros" />
      </Helmet>

      <div className="calc-page container">
        <div className="calc-breadcrumb">
          <Link to="/calculators">Calculators</Link> › Macro Calculator
        </div>
        <h1 className="calc-page__title">Macro Calculator</h1>

        <div className="calc-layout">
          <div className="calc-main">

            {/* ── Mode toggle ─────────────────────────────── */}
            <div className="macro-toggle">
              <button
                className={`macro-toggle__btn ${mode === 'macros' ? 'active' : ''}`}
                onClick={() => setMode('macros')}
              >
                Grams → Calories
              </button>
              <button
                className={`macro-toggle__btn ${mode === 'calories' ? 'active' : ''}`}
                onClick={() => setMode('calories')}
              >
                Calories → Grams
              </button>
            </div>

            {/* ══════════════════════════════════════════════
                MODE A — enter macros, get calories
            ══════════════════════════════════════════════ */}
            {mode === 'macros' && (
              <>
                <div className="calc-box">
                  <div className="calc-grid macro-grid">
                    <div className="calc-row">
                      <label>Protein (g)</label>
                      <input
                        type="number" min="0" placeholder="e.g. 150"
                        value={protein}
                        onChange={e => setProtein(e.target.value)}
                      />
                    </div>
                    <div className="calc-row">
                      <label>Carbohydrates (g)</label>
                      <input
                        type="number" min="0" placeholder="e.g. 200"
                        value={carbs}
                        onChange={e => setCarbs(e.target.value)}
                      />
                    </div>
                    <div className="calc-row">
                      <label>Fat (g)</label>
                      <input
                        type="number" min="0" placeholder="e.g. 70"
                        value={fat}
                        onChange={e => setFat(e.target.value)}
                      />
                    </div>
                  </div>
                  <p className="macro-hint">
                    Protein = 4 kcal/g · Carbs = 4 kcal/g · Fat = 9 kcal/g
                  </p>
                </div>

                {/* Results */}
                <div className={`calc-box macro-results ${hasGramResult ? 'visible' : ''}`}>
                  <div className="macro-total">
                    <span className="macro-total__label">Total Calories</span>
                    <span className="macro-total__value">{Math.round(totalKcal)}</span>
                    <span className="macro-total__unit">kcal</span>
                  </div>

                  {hasGramResult && (
                    <>
                      {/* Stacked bar */}
                      <div className="macro-bar" role="img" aria-label="Macro split bar chart">
                        <div className="macro-bar__segment macro-bar__protein" style={{ width: `${proteinPct}%` }} />
                        <div className="macro-bar__segment macro-bar__carbs"   style={{ width: `${carbsPct}%` }} />
                        <div className="macro-bar__segment macro-bar__fat"     style={{ width: `${fatPct}%` }} />
                      </div>

                      {/* Breakdown cards */}
                      <div className="macro-cards">
                        <div className="macro-card macro-card--protein">
                          <span className="macro-card__label">Protein</span>
                          <span className="macro-card__kcal">{Math.round(proteinKcal)} kcal</span>
                          <span className="macro-card__pct">{Math.round(proteinPct)}%</span>
                        </div>
                        <div className="macro-card macro-card--carbs">
                          <span className="macro-card__label">Carbs</span>
                          <span className="macro-card__kcal">{Math.round(carbsKcal)} kcal</span>
                          <span className="macro-card__pct">{Math.round(carbsPct)}%</span>
                        </div>
                        <div className="macro-card macro-card--fat">
                          <span className="macro-card__label">Fat</span>
                          <span className="macro-card__kcal">{Math.round(fatKcal)} kcal</span>
                          <span className="macro-card__pct">{Math.round(fatPct)}%</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {/* ══════════════════════════════════════════════
                MODE B — enter calories, get grams
            ══════════════════════════════════════════════ */}
            {mode === 'calories' && (
              <>
                <div className="calc-box">
                  <div className="calc-grid" style={{ gridTemplateColumns: '1fr', maxWidth: 280 }}>
                    <div className="calc-row">
                      <label>Daily Calorie Target</label>
                      <input
                        type="number" min="0" placeholder="e.g. 2200"
                        value={calories}
                        onChange={e => setCalories(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Preset pills */}
                  <div className="macro-presets">
                    <span className="macro-presets__label">Macro split</span>
                    <div className="macro-presets__grid">
                      {PRESETS.map(p => (
                        <button
                          key={p.id}
                          className={`macro-preset ${selectedPreset === p.id ? 'active' : ''}`}
                          onClick={() => setSelectedPreset(p.id)}
                        >
                          <span className="macro-preset__name">{p.label}</span>
                          <span className="macro-preset__desc">{p.desc}</span>
                          {p.id !== 'custom' && (
                            <span className="macro-preset__split">
                              P{p.protein} · C{p.carbs} · F{p.fat}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom split inputs */}
                  {selectedPreset === 'custom' && (
                    <div className="macro-custom">
                      <p className={`macro-custom__warning ${customTotal !== 100 ? 'show' : ''}`}>
                        Percentages must add up to 100% (currently {customTotal}%)
                      </p>
                      <div className="calc-grid">
                        <div className="calc-row">
                          <label>Protein %</label>
                          <input type="number" min="0" max="100" value={customProtein}
                            onChange={e => handleCustom('protein', e.target.value)} />
                        </div>
                        <div className="calc-row">
                          <label>Carbs %</label>
                          <input type="number" min="0" max="100" value={customCarbs}
                            onChange={e => handleCustom('carbs', e.target.value)} />
                        </div>
                        <div className="calc-row">
                          <label>Fat %</label>
                          <input type="number" min="0" max="100" value={customFat}
                            onChange={e => handleCustom('fat', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Results */}
                <div className={`calc-box macro-results ${hasCalResult ? 'visible' : ''}`}>
                  <div className="macro-split-label">
                    {selectedPreset !== 'custom'
                      ? `${preset.label} split — P${split.protein}% · C${split.carbs}% · F${split.fat}%`
                      : `Custom split — P${split.protein}% · C${split.carbs}% · F${split.fat}%`
                    }
                  </div>

                  <div className="macro-cards">
                    <div className="macro-card macro-card--protein">
                      <span className="macro-card__label">Protein</span>
                      <span className="macro-card__grams">{proteinGrams}g</span>
                      <span className="macro-card__kcal">{Math.round(cal * split.protein / 100)} kcal</span>
                    </div>
                    <div className="macro-card macro-card--carbs">
                      <span className="macro-card__label">Carbs</span>
                      <span className="macro-card__grams">{carbsGrams}g</span>
                      <span className="macro-card__kcal">{Math.round(cal * split.carbs / 100)} kcal</span>
                    </div>
                    <div className="macro-card macro-card--fat">
                      <span className="macro-card__label">Fat</span>
                      <span className="macro-card__grams">{fatGrams}g</span>
                      <span className="macro-card__kcal">{Math.round(cal * split.fat / 100)} kcal</span>
                    </div>
                  </div>

                  {hasCalResult && (
                    <div className="macro-bar" role="img" aria-label="Macro split bar chart">
                      <div className="macro-bar__segment macro-bar__protein" style={{ width: `${split.protein}%` }} />
                      <div className="macro-bar__segment macro-bar__carbs"   style={{ width: `${split.carbs}%` }} />
                      <div className="macro-bar__segment macro-bar__fat"     style={{ width: `${split.fat}%` }} />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── SEO content ─────────────────────────────── */}
            <div className="calc-instructions">
              <h2>What are macros?</h2>
              <p>Macros — short for macronutrients — are the three main nutrients that make up the calories in your food: protein, carbohydrates, and fat. Every calorie you consume comes from one of these three sources. Understanding your macros tells you not just how much you're eating, but what you're eating — and that distinction drives the difference between losing fat, maintaining weight, and building muscle.</p>

              <h2>How many calories are in each macro?</h2>
              <p>Protein and carbohydrates each contain 4 calories per gram. Fat contains 9 calories per gram — more than twice as much. This is why fat-dense foods are so calorie-dense even in small portions, and why high-protein diets tend to be more filling: you get more volume and more grams of food per calorie.</p>

              <h2>Grams to calories</h2>
              <p>Use the first mode to see the exact calorie breakdown of any meal or day of eating. Enter how many grams of protein, carbs, and fat you consumed and the calculator shows your total calories plus the percentage each macro contributes. This is useful for tracking a specific meal, understanding a food label, or auditing your diet without an app.</p>

              <h2>Calories to grams — choosing a macro split</h2>
              <p>Use the second mode when you know your calorie target (from the TDEE calculator) and want to know what that means in grams. Choose a preset split or set your own percentages.</p>
              <p><strong>Balanced (30/40/30):</strong> A sensible general-health split for most people.</p>
              <p><strong>Muscle Gain (35/45/20):</strong> Higher protein to support muscle protein synthesis, higher carbs to fuel training sessions.</p>
              <p><strong>Fat Loss (40/30/30):</strong> High protein protects muscle during a calorie deficit and maximises satiety. Moderate carbs and fat.</p>
              <p><strong>Keto (25/5/70):</strong> Very low carbohydrate forces the body into ketosis, using fat as primary fuel.</p>
              <p><strong>Endurance (20/55/25):</strong> Carbohydrate-heavy for athletes who need sustained energy output across long training sessions.</p>

              <h2>How to use this with your TDEE</h2>
              <p>First, calculate your Total Daily Energy Expenditure to find your calorie maintenance level, then apply a deficit (for fat loss) or surplus (for muscle gain). Then use this macro calculator to translate that calorie target into specific gram targets for protein, carbs, and fat you can track daily.</p>

              <div className="calc-links">
                <Link to="/calculators/tdee">TDEE Calculator →</Link>
                <span>|</span>
                <Link to="/articles/how-much-protein-to-build-muscle">How Much Protein Do You Need?</Link>
                <span>|</span>
                <Link to="/articles/does-protein-burn-more-calories">Thermic Effect of Protein</Link>
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
              <Link to="/calculators/tdee">TDEE Calculator</Link>
              <Link to="/calculators/bmi">BMI Calculator</Link>
              <Link to="/calculators/calories">Calories Burned</Link>
              <Link to="/calculators/steps">Steps to Calories</Link>
            </div>
            <div className="calc-related">
              <h3>Related Articles</h3>
              <Link to="/articles/how-much-protein-to-build-muscle">How Much Protein Do You Need?</Link>
              <Link to="/articles/does-protein-burn-more-calories">Does Protein Burn More Calories?</Link>
              <Link to="/articles/dietary-fiber-complete-guide">Dietary Fiber Guide</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
