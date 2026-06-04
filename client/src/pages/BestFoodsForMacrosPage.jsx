import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './HighProteinFoodsPage.css';
import './ReferencePage.css';

const SECTIONS = [
  {
    macro: 'protein',
    title: 'Best Protein Sources',
    colour: '#D85A30',
    goal: 'Build muscle, stay full, preserve lean mass in a deficit',
    target: '0.7–0.8g per lb bodyweight (1.6–1.8g per kg)',
    foods: [
      { name: 'Chicken Breast',         per100: '32g protein',  cal: 165,  emoji: '🍗', note: 'Leanest meat option' },
      { name: 'Canned Tuna',            per100: '26g protein',  cal: 116,  emoji: '🐟', note: 'Best protein per penny' },
      { name: 'Whey Protein',           per100: '80g protein',  cal: 371,  emoji: '🥤', note: 'Highest concentration' },
      { name: 'Turkey Breast',          per100: '30g protein',  cal: 135,  emoji: '🦃' },
      { name: 'Egg Whites',             per100: '11g protein',  cal: 52,   emoji: '🥚', note: 'Zero fat' },
      { name: 'Greek Yoghurt (0% fat)', per100: '10g protein',  cal: 59,   emoji: '🥛', note: 'Casein + convenience' },
      { name: 'Lean Beef Mince (5%)',   per100: '26g protein',  cal: 153,  emoji: '🥩' },
      { name: 'Salmon',                 per100: '25g protein',  cal: 208,  emoji: '🐟', note: 'High omega-3 too' },
    ],
  },
  {
    macro: 'carbs',
    title: 'Best Carbohydrate Sources',
    colour: '#4a9eff',
    goal: 'Fuel training, replenish glycogen, sustain energy',
    target: 'Varies by goal — higher for muscle gain, lower for fat loss',
    foods: [
      { name: 'White Rice (cooked)',      per100: '28g carbs',  cal: 130,  emoji: '🍚', note: 'Best post-workout carb' },
      { name: 'Oats (dry)',               per100: '68g carbs',  cal: 379,  emoji: '🌾', note: 'Slow-release + fibre' },
      { name: 'Sweet Potato (cooked)',    per100: '20g carbs',  cal: 86,   emoji: '🍠', note: 'Micronutrient-rich' },
      { name: 'Banana',                   per100: '23g carbs',  cal: 89,   emoji: '🍌', note: 'Best pre-workout fruit' },
      { name: 'Brown Rice (cooked)',      per100: '24g carbs',  cal: 112,  emoji: '🍚', note: 'Higher fibre than white' },
      { name: 'Wholegrain Bread',         per100: '49g carbs',  cal: 247,  emoji: '🍞' },
      { name: 'Quinoa (cooked)',          per100: '22g carbs',  cal: 120,  emoji: '🌾', note: 'Complete protein too' },
      { name: 'Dates',                    per100: '75g carbs',  cal: 282,  emoji: '🍑', note: 'Fast energy, pre-workout' },
    ],
  },
  {
    macro: 'fat',
    title: 'Best Fat Sources',
    colour: '#f59e0b',
    goal: 'Hormone production, joint health, fat-soluble vitamins',
    target: '0.3–0.5g per lb bodyweight — never eliminate fat entirely',
    foods: [
      { name: 'Avocado',           per100: '15g fat',  cal: 160,  emoji: '🥑', note: 'Monounsaturated — heart healthy' },
      { name: 'Olive Oil',         per100: '100g fat', cal: 884,  emoji: '🫒', note: 'Best cooking fat for health' },
      { name: 'Salmon',            per100: '13g fat',  cal: 208,  emoji: '🐟', note: 'Omega-3 EPA + DHA' },
      { name: 'Almonds',           per100: '49g fat',  cal: 579,  emoji: '🌰', note: 'Vitamin E + magnesium' },
      { name: 'Walnuts',           per100: '65g fat',  cal: 654,  emoji: '🌰', note: 'Highest omega-3 nut' },
      { name: 'Mackerel',          per100: '16g fat',  cal: 232,  emoji: '🐟', note: 'Very high omega-3' },
      { name: 'Chia Seeds',        per100: '31g fat',  cal: 486,  emoji: '🌱', note: 'Omega-3 + fibre' },
      { name: 'Whole Eggs',        per100: '11g fat',  cal: 155,  emoji: '🥚', note: 'Cholesterol not a concern for most' },
    ],
  },
  {
    macro: 'fibre',
    title: 'Best Fibre Sources',
    colour: '#4ade80',
    goal: 'Gut health, satiety, blood sugar control, cholesterol',
    target: '25g for women, 38g for men per day',
    foods: [
      { name: 'Chia Seeds',             per100: '34g fibre', cal: 486,  emoji: '🌱', note: 'Highest fibre food' },
      { name: 'Bran Flakes',            per100: '13g fibre', cal: 351,  emoji: '🌾' },
      { name: 'Lentils (cooked)',        per100: '7.9g fibre',cal: 116,  emoji: '🫘' },
      { name: 'Artichoke (cooked)',      per100: '8.6g fibre',cal: 60,   emoji: '🥬' },
      { name: 'Raspberries',            per100: '6.5g fibre', cal: 52,   emoji: '🫐' },
      { name: 'Almonds',                per100: '12.5g fibre',cal: 579,  emoji: '🌰' },
      { name: 'Oats (dry)',             per100: '10.1g fibre',cal: 379,  emoji: '🌾' },
      { name: 'Black Beans (cooked)',   per100: '7.5g fibre', cal: 132,  emoji: '🫘' },
    ],
  },
];

export default function BestFoodsForMacrosPage() {
  const [active, setActive] = useState('protein');
  const section = SECTIONS.find(s => s.macro === active);

  return (
    <>
      <Helmet>
        <title>Best Foods for Each Macro — Protein, Carbs, Fat & Fibre | LiftAndBurn</title>
        <meta name="description" content="The best foods for protein, carbohydrates, fat, and fibre — with targets, goals, and top food picks for each macronutrient." />
        <link rel="canonical" href="https://liftandburn.fit/best-foods-for-each-macro" />
      </Helmet>
      <div className="hp-page container">
        <header className="hp-header fade-up">
          <div className="calc-breadcrumb"><Link to="/articles">Articles</Link> › Best Foods by Macro</div>
          <span className="hp-eyebrow">Nutrition Reference</span>
          <h1 className="hp-title">BEST FOODS FOR EACH MACRO</h1>
          <p className="hp-subtitle">Top food sources for protein, carbohydrates, fat, and fibre — with targets and goals for each.</p>
        </header>

        {/* Macro selector */}
        <div className="macro-selector">
          {SECTIONS.map(s => (
            <button
              key={s.macro}
              className={`macro-selector__btn ${active === s.macro ? 'active' : ''}`}
              style={{ '--macro-colour': s.colour }}
              onClick={() => setActive(s.macro)}
            >
              <span className="macro-selector__label">{s.title.split(' ')[1]}</span>
            </button>
          ))}
        </div>

        {/* Section */}
        <div className="macro-section">
          <div className="macro-section__header" style={{ borderColor: section.colour }}>
            <h2 style={{ color: section.colour }}>{section.title}</h2>
            <div className="macro-section__meta">
              <div className="macro-meta-item">
                <span className="macro-meta-label">Why you need it</span>
                <span className="macro-meta-val">{section.goal}</span>
              </div>
              <div className="macro-meta-item">
                <span className="macro-meta-label">Daily target</span>
                <span className="macro-meta-val">{section.target}</span>
              </div>
            </div>
          </div>

          <div className="macro-food-grid">
            {section.foods.map((food, i) => (
              <div key={food.name} className="macro-food-card" style={{ '--macro-colour': section.colour }}>
                <div className="macro-food-card__rank">#{i + 1}</div>
                <div className="macro-food-card__emoji">{food.emoji}</div>
                <div className="macro-food-card__info">
                  <span className="macro-food-card__name">{food.name}</span>
                  {food.note && <span className="macro-food-card__note">{food.note}</span>}
                </div>
                <div className="macro-food-card__stats">
                  <span className="macro-food-card__macro" style={{ color: section.colour }}>{food.per100}</span>
                  <span className="macro-food-card__cal">{food.cal} kcal</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hp-content">
          <h2>How to use this page</h2>
          <p>Each macro tab shows the top food sources for that nutrient per 100g. Use this as a quick reference when planning meals or grocery shopping. The goal is to build each meal around a primary protein source, then add carbohydrates based on your training demands and fill the remaining calories with healthy fats.</p>

          <h2>Balancing your macros</h2>
          <p><strong>Protein</strong> is the non-negotiable. Hit 0.7–0.8g per pound of bodyweight first. Everything else is flexible around that target.</p>
          <p><strong>Carbohydrates</strong> should be higher on training days (they fuel your sessions) and lower on rest days. Complex, slower-digesting sources like oats, sweet potato, and brown rice are preferred over refined sources for most meals.</p>
          <p><strong>Fat</strong> should never drop below 0.3g per pound of bodyweight. Dietary fat is essential for hormone production including testosterone. Prioritise unsaturated fats (avocado, olive oil, oily fish, nuts) over saturated fats.</p>
          <p><strong>Fibre</strong> is technically a carbohydrate but deserves separate attention. Most people eat half the recommended amount. Build fibre intake around legumes, oats, vegetables, and seeds.</p>

          <div className="hp-links">
            <Link to="/calculators/macros">Macro Calculator →</Link>
            <span>·</span>
            <Link to="/calculators/tdee">TDEE Calculator</Link>
            <span>·</span>
            <Link to="/high-protein-foods">Full Protein List</Link>
            <span>·</span>
            <Link to="/high-fibre-foods">Full Fibre List</Link>
          </div>
        </div>
      </div>
    </>
  );
}
