import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './HighProteinFoodsPage.css';
import './ReferencePage.css';

const FOODS = [
  // Vegetables
  { name: 'Cucumber',                 category: 'vegetables', cal: 15,  protein: 0.7, fibre: 0.5, fat: 0.1, serving: '100g', emoji: '🥒', note: 'Best hunger filler' },
  { name: 'Lettuce (iceberg)',        category: 'vegetables', cal: 14,  protein: 0.9, fibre: 1.2, fat: 0.1, serving: '100g', emoji: '🥬' },
  { name: 'Celery',                   category: 'vegetables', cal: 16,  protein: 0.7, fibre: 1.6, fat: 0.2, serving: '100g', emoji: '🌿', note: 'Essentially zero calorie' },
  { name: 'Radishes',                 category: 'vegetables', cal: 16,  protein: 0.7, fibre: 1.6, fat: 0.1, serving: '100g', emoji: '🌿' },
  { name: 'Courgette / Zucchini',     category: 'vegetables', cal: 17,  protein: 1.2, fibre: 1.1, fat: 0.3, serving: '100g', emoji: '🥒' },
  { name: 'Spinach (raw)',            category: 'vegetables', cal: 23,  protein: 2.9, fibre: 2.2, fat: 0.4, serving: '100g', emoji: '🥬', note: 'Nutrient-dense' },
  { name: 'Tomatoes',                 category: 'vegetables', cal: 18,  protein: 0.9, fibre: 1.2, fat: 0.2, serving: '100g', emoji: '🍅' },
  { name: 'Mushrooms',                category: 'vegetables', cal: 22,  protein: 3.1, fibre: 1.0, fat: 0.3, serving: '100g', emoji: '🍄', note: 'High protein for calories' },
  { name: 'Asparagus',                category: 'vegetables', cal: 20,  protein: 2.2, fibre: 2.1, fat: 0.1, serving: '100g', emoji: '🌿' },
  { name: 'Cauliflower',              category: 'vegetables', cal: 25,  protein: 1.9, fibre: 2.0, fat: 0.3, serving: '100g', emoji: '🥦' },
  { name: 'Cabbage',                  category: 'vegetables', cal: 25,  protein: 1.3, fibre: 2.5, fat: 0.1, serving: '100g', emoji: '🥬' },
  { name: 'Bell Pepper',              category: 'vegetables', cal: 31,  protein: 1.0, fibre: 2.1, fat: 0.3, serving: '100g', emoji: '🫑' },
  { name: 'Broccoli',                 category: 'vegetables', cal: 35,  protein: 2.4, fibre: 3.3, fat: 0.4, serving: '100g', emoji: '🥦' },
  { name: 'Kale (raw)',               category: 'vegetables', cal: 35,  protein: 2.9, fibre: 4.1, fat: 0.5, serving: '100g', emoji: '🥬' },

  // Fruits
  { name: 'Watermelon',               category: 'fruits', cal: 30,  protein: 0.6, fibre: 0.4, fat: 0.2, serving: '100g', emoji: '🍉', note: '92% water' },
  { name: 'Strawberries',             category: 'fruits', cal: 32,  protein: 0.7, fibre: 2.0, fat: 0.3, serving: '100g', emoji: '🍓' },
  { name: 'Raspberries',              category: 'fruits', cal: 52,  protein: 1.2, fibre: 6.5, fat: 0.7, serving: '100g', emoji: '🫐', note: 'High fibre too' },
  { name: 'Grapefruit',               category: 'fruits', cal: 42,  protein: 0.8, fibre: 1.6, fat: 0.1, serving: '100g', emoji: '🍊' },
  { name: 'Cantaloupe Melon',         category: 'fruits', cal: 34,  protein: 0.8, fibre: 0.9, fat: 0.2, serving: '100g', emoji: '🍈' },
  { name: 'Blueberries',              category: 'fruits', cal: 57,  protein: 0.7, fibre: 2.4, fat: 0.3, serving: '100g', emoji: '🫐' },
  { name: 'Peach',                    category: 'fruits', cal: 39,  protein: 0.9, fibre: 1.5, fat: 0.3, serving: '100g', emoji: '🍑' },

  // Protein sources (low cal)
  { name: 'Prawns / Shrimp',          category: 'protein', cal: 99,  protein: 24, fibre: 0,   fat: 1,   serving: '100g', emoji: '🦐', note: 'Best lean protein' },
  { name: 'Egg Whites',               category: 'protein', cal: 52,  protein: 11, fibre: 0,   fat: 0,   serving: '100g', emoji: '🥚', note: 'Pure protein, no fat' },
  { name: 'Cod (cooked)',             category: 'protein', cal: 105, protein: 23, fibre: 0,   fat: 1,   serving: '100g', emoji: '🐟' },
  { name: 'Canned Tuna (in water)',   category: 'protein', cal: 116, protein: 26, fibre: 0,   fat: 1,   serving: '100g', emoji: '🐟' },
  { name: 'Greek Yoghurt (0% fat)',   category: 'protein', cal: 59,  protein: 10, fibre: 0,   fat: 0,   serving: '100g', emoji: '🥛' },
  { name: 'Cottage Cheese (low fat)', category: 'protein', cal: 72,  protein: 12, fibre: 0,   fat: 1,   serving: '100g', emoji: '🧀' },
  { name: 'Turkey Breast (cooked)',   category: 'protein', cal: 135, protein: 30, fibre: 0,   fat: 1.2, serving: '100g', emoji: '🦃' },

  // Drinks & Other
  { name: 'Black Coffee',             category: 'other', cal: 2,   protein: 0.3, fibre: 0, fat: 0,   serving: '240ml', emoji: '☕', note: 'Essentially zero calories' },
  { name: 'Green Tea',                category: 'other', cal: 2,   protein: 0,   fibre: 0, fat: 0,   serving: '240ml', emoji: '🍵' },
  { name: 'Diet / Zero Soda',         category: 'other', cal: 1,   protein: 0,   fibre: 0, fat: 0,   serving: '330ml', emoji: '🥤', note: 'Zero calorie sweet fix' },
  { name: 'Chicken Broth',            category: 'other', cal: 15,  protein: 1,   fibre: 0, fat: 0.5, serving: '240ml', emoji: '🍲', note: 'Filling and warming' },
];

const CATEGORIES = [
  { id: 'all',        label: 'All Foods',  emoji: '🍽️' },
  { id: 'vegetables', label: 'Vegetables', emoji: '🥦' },
  { id: 'fruits',     label: 'Fruits',     emoji: '🍓' },
  { id: 'protein',    label: 'Protein',    emoji: '🍗' },
  { id: 'other',      label: 'Drinks',     emoji: '☕' },
];

function CalBar({ cal }) {
  const pct = Math.min((cal / 140) * 100, 100);
  const colour = cal <= 30 ? '#4ade80' : cal <= 70 ? '#D85A30' : '#f59e0b';
  return (
    <div className="hp-bar-track">
      <div className="hp-bar-fill" style={{ width: `${pct}%`, background: colour }} />
    </div>
  );
}

export default function LowCalorieFoodsPage() {
  const [category, setCategory] = useState('all');
  const [sort,     setSort]     = useState('cal_asc');
  const [search,   setSearch]   = useState('');

  const filtered = useMemo(() => {
    let list = FOODS;
    if (category !== 'all') list = list.filter(f => f.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(f => f.name.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      if (sort === 'cal_asc')      return a.cal - b.cal;
      if (sort === 'cal_desc')     return b.cal - a.cal;
      if (sort === 'protein_desc') return b.protein - a.protein;
      return 0;
    });
  }, [category, sort, search]);

  return (
    <>
      <Helmet>
        <title>Low Calorie High Volume Foods — Cutting Food List | LiftAndBurn</title>
        <meta name="description" content="The best low calorie high volume foods for cutting and fat loss. Eat more, weigh less — vegetables, fruits, and lean proteins ranked by calorie density." />
        <link rel="canonical" href="https://liftandburn.fit/low-calorie-high-volume-foods" />
      </Helmet>
      <div className="hp-page container">
        <header className="hp-header fade-up">
          <div className="calc-breadcrumb"><Link to="/articles">Articles</Link> › Low Calorie Foods</div>
          <span className="hp-eyebrow">Nutrition Reference</span>
          <h1 className="hp-title">LOW CALORIE HIGH VOLUME FOODS</h1>
          <p className="hp-subtitle">{FOODS.length} foods for cutting — eat large portions without blowing your calorie budget.</p>
        </header>

        <div className="hp-controls">
          <div className="hp-cats">
            {CATEGORIES.map(c => (
              <button key={c.id} className={`hp-cat ${category === c.id ? 'active' : ''}`} onClick={() => setCategory(c.id)}>
                <span className="hp-cat__emoji">{c.emoji}</span>
                <span className="hp-cat__label">{c.label}</span>
              </button>
            ))}
          </div>
          <div className="hp-toolbar">
            <div className="hp-search-wrap">
              <svg className="hp-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input className="hp-search" type="text" placeholder="Search foods…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="hp-sort" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="cal_asc">Calories ↑</option>
              <option value="cal_desc">Calories ↓</option>
              <option value="protein_desc">Protein ↓</option>
            </select>
          </div>
        </div>

        <div className="hp-stats">
          <span className="hp-stats__count"><strong>{filtered.length}</strong> foods</span>
          {filtered.length > 0 && <><span className="hp-stats__divider">·</span><span className="hp-stats__best">Lowest: <strong>{filtered[0].name}</strong> ({filtered[0].cal} kcal per {filtered[0].serving})</span></>}
        </div>

        <div className="hp-table">
          <div className="hp-table__head">
            <span className="hp-col-name">Food</span>
            <span className="hp-col-protein">Calories</span>
            <span className="hp-col-bar"></span>
            <span className="hp-col-cal">Protein</span>
            <span className="hp-col-carbs">Fibre</span>
            <span className="hp-col-fat">Fat</span>
          </div>
          {filtered.length === 0 && <div className="hp-empty">No foods match your search.</div>}
          {filtered.map((food, i) => (
            <div key={food.name} className={`hp-row ${i % 2 === 0 ? 'hp-row--even' : ''}`}>
              <div className="hp-col-name">
                <span className="hp-row__emoji">{food.emoji}</span>
                <span className="hp-row__name">{food.name}</span>
                {food.note && <span className="hp-row__note">{food.note}</span>}
              </div>
              <div className="hp-col-protein"><span className="hp-protein-val">{food.cal}</span></div>
              <div className="hp-col-bar"><CalBar cal={food.cal} /></div>
              <div className="hp-col-cal hp-muted">{food.protein}g</div>
              <div className="hp-col-carbs hp-muted">{food.fibre}g</div>
              <div className="hp-col-fat hp-muted">{food.fat}g</div>
            </div>
          ))}
        </div>
        <p className="hp-footnote">Calories per 100g unless serving size noted. Figures are approximate.</p>

        <div className="hp-content">
          <h2>What is calorie density?</h2>
          <p>Calorie density is the number of calories per gram of food. Low calorie density foods let you eat large portions — feeling physically full — while staying within your calorie budget. This is the core principle behind successful cutting diets: prioritise foods that are high in volume but low in calories.</p>
          <p>Water and fibre both add volume without adding calories. That's why vegetables and fruits dominate this list — they're mostly water and fibre. 500g of cucumber is only 75 calories. 500g of broccoli is 175 calories. Compare that to 100g of peanut butter at 588 calories.</p>

          <h2>Building a cutting diet around volume</h2>
          <p>The practical strategy is to fill half your plate with low-calorie, high-volume vegetables at every meal before adding your protein and carbohydrate sources. This keeps portion sizes large and hunger manageable without significantly increasing calories. Pair low-calorie volume foods with high-protein sources (chicken, fish, eggs) to stay full and preserve muscle during a deficit.</p>
          <p>Calculate your deficit starting point with our <Link to="/calculators/tdee">TDEE calculator</Link>, then use the <Link to="/calculators/macros">macro calculator</Link> to set protein targets. High-volume, low-calorie foods fill in the remaining space in your diet.</p>

          <div className="hp-links">
            <Link to="/calculators/tdee">TDEE Calculator →</Link>
            <span>·</span>
            <Link to="/high-protein-foods">High Protein Foods</Link>
            <span>·</span>
            <Link to="/articles/why-the-scale-lies-measure-fat-loss">Why the Scale Lies</Link>
          </div>
        </div>
      </div>
    </>
  );
}
