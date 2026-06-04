import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './HighProteinFoodsPage.css';
import './ReferencePage.css';

const FOODS = [
  // Legumes
  { name: 'Split Peas (cooked)',       category: 'legumes', fibre: 8.3,  cal: 118,  protein: 8,  carbs: 21, fat: 0.4, emoji: '🫘', note: 'Highest fibre legume' },
  { name: 'Lentils (cooked)',          category: 'legumes', fibre: 7.9,  cal: 116,  protein: 9,  carbs: 20, fat: 0.4, emoji: '🫘' },
  { name: 'Black Beans (cooked)',      category: 'legumes', fibre: 7.5,  cal: 132,  protein: 9,  carbs: 24, fat: 0.5, emoji: '🫘' },
  { name: 'Chickpeas (cooked)',        category: 'legumes', fibre: 6.0,  cal: 164,  protein: 9,  carbs: 27, fat: 3,   emoji: '🫘' },
  { name: 'Kidney Beans (cooked)',     category: 'legumes', fibre: 7.4,  cal: 127,  protein: 9,  carbs: 23, fat: 0.5, emoji: '🫘' },
  { name: 'Edamame (cooked)',          category: 'legumes', fibre: 5.2,  cal: 122,  protein: 11, carbs: 10, fat: 5,   emoji: '🫘' },

  // Vegetables
  { name: 'Artichoke (cooked)',        category: 'vegetables', fibre: 8.6,  cal: 60,   protein: 4,  carbs: 13, fat: 0.2, emoji: '🥬', note: 'Highest fibre vegetable' },
  { name: 'Avocado',                   category: 'vegetables', fibre: 6.7,  cal: 160,  protein: 2,  carbs: 9,  fat: 15,  emoji: '🥑', note: 'Healthy fats too' },
  { name: 'Brussels Sprouts (cooked)', category: 'vegetables', fibre: 3.8,  cal: 43,   protein: 3,  carbs: 9,  fat: 0.3, emoji: '🥦' },
  { name: 'Broccoli (cooked)',         category: 'vegetables', fibre: 3.3,  cal: 35,   protein: 2,  carbs: 7,  fat: 0.4, emoji: '🥦' },
  { name: 'Sweet Potato (cooked)',     category: 'vegetables', fibre: 3.0,  cal: 86,   protein: 2,  carbs: 20, fat: 0.1, emoji: '🍠' },
  { name: 'Carrots (raw)',             category: 'vegetables', fibre: 2.8,  cal: 41,   protein: 1,  carbs: 10, fat: 0.2, emoji: '🥕' },
  { name: 'Kale (cooked)',             category: 'vegetables', fibre: 2.0,  cal: 49,   protein: 4,  carbs: 10, fat: 1,   emoji: '🥬' },
  { name: 'Peas (cooked)',             category: 'vegetables', fibre: 5.5,  cal: 84,   protein: 5,  carbs: 16, fat: 0.2, emoji: '🫛' },

  // Fruits
  { name: 'Raspberries',               category: 'fruits', fibre: 6.5,  cal: 52,   protein: 1,  carbs: 12, fat: 0.7, emoji: '🫐', note: 'Best fruit for fibre' },
  { name: 'Blackberries',              category: 'fruits', fibre: 5.3,  cal: 43,   protein: 1,  carbs: 10, fat: 0.5, emoji: '🫐' },
  { name: 'Pear (with skin)',          category: 'fruits', fibre: 3.1,  cal: 57,   protein: 0.4,carbs: 15, fat: 0.1, emoji: '🍐' },
  { name: 'Apple (with skin)',         category: 'fruits', fibre: 2.4,  cal: 52,   protein: 0.3,carbs: 14, fat: 0.2, emoji: '🍎' },
  { name: 'Banana',                    category: 'fruits', fibre: 2.6,  cal: 89,   protein: 1,  carbs: 23, fat: 0.3, emoji: '🍌' },
  { name: 'Mango',                     category: 'fruits', fibre: 1.6,  cal: 60,   protein: 0.8,carbs: 15, fat: 0.4, emoji: '🥭' },
  { name: 'Figs (dried)',              category: 'fruits', fibre: 9.8,  cal: 249,  protein: 3,  carbs: 64, fat: 1,   emoji: '🍑', note: 'Highest dried fruit' },
  { name: 'Prunes (dried)',            category: 'fruits', fibre: 7.1,  cal: 240,  protein: 2,  carbs: 64, fat: 0.4, emoji: '🍑' },

  // Grains & Cereals
  { name: 'Bran Flakes (cereal)',      category: 'grains', fibre: 13.0, cal: 351,  protein: 10, carbs: 69, fat: 2,   emoji: '🌾', note: 'Highest fibre cereal' },
  { name: 'Oats (dry)',                category: 'grains', fibre: 10.1, cal: 379,  protein: 13, carbs: 68, fat: 7,   emoji: '🌾' },
  { name: 'Wholegrain Bread',          category: 'grains', fibre: 6.8,  cal: 247,  protein: 9,  carbs: 49, fat: 3,   emoji: '🍞' },
  { name: 'Brown Rice (cooked)',       category: 'grains', fibre: 1.8,  cal: 112,  protein: 2,  carbs: 24, fat: 0.9, emoji: '🍚' },
  { name: 'Quinoa (cooked)',           category: 'grains', fibre: 2.8,  cal: 120,  protein: 4,  carbs: 22, fat: 2,   emoji: '🌾' },
  { name: 'Barley (cooked)',           category: 'grains', fibre: 3.8,  cal: 123,  protein: 2,  carbs: 28, fat: 0.4, emoji: '🌾' },

  // Nuts & Seeds
  { name: 'Chia Seeds',                category: 'nuts', fibre: 34.4, cal: 486,  protein: 17, carbs: 42, fat: 31,  emoji: '🌱', note: 'Highest fibre seed' },
  { name: 'Flaxseeds',                 category: 'nuts', fibre: 27.3, cal: 534,  protein: 18, carbs: 29, fat: 42,  emoji: '🌱' },
  { name: 'Almonds',                   category: 'nuts', fibre: 12.5, cal: 579,  protein: 21, carbs: 22, fat: 49,  emoji: '🌰' },
  { name: 'Pumpkin Seeds',             category: 'nuts', fibre: 6.0,  cal: 446,  protein: 19, carbs: 54, fat: 19,  emoji: '🎃' },
  { name: 'Walnuts',                   category: 'nuts', fibre: 6.7,  cal: 654,  protein: 15, carbs: 14, fat: 65,  emoji: '🌰' },
  { name: 'Sunflower Seeds',           category: 'nuts', fibre: 8.6,  cal: 584,  protein: 21, carbs: 20, fat: 51,  emoji: '🌻' },
];

const CATEGORIES = [
  { id: 'all',        label: 'All Foods',     emoji: '🍽️' },
  { id: 'legumes',    label: 'Legumes',       emoji: '🫘' },
  { id: 'vegetables', label: 'Vegetables',    emoji: '🥦' },
  { id: 'fruits',     label: 'Fruits',        emoji: '🍎' },
  { id: 'grains',     label: 'Grains',        emoji: '🌾' },
  { id: 'nuts',       label: 'Nuts & Seeds',  emoji: '🌰' },
];

function FibreBar({ fibre }) {
  const pct = Math.min((fibre / 15) * 100, 100);
  const colour = fibre >= 8 ? '#4ade80' : fibre >= 4 ? '#D85A30' : '#f59e0b';
  return (
    <div className="hp-bar-track">
      <div className="hp-bar-fill" style={{ width: `${pct}%`, background: colour }} />
    </div>
  );
}

export default function HighFibreFoodsPage() {
  const [category, setCategory] = useState('all');
  const [sort,     setSort]     = useState('fibre_desc');
  const [search,   setSearch]   = useState('');

  const filtered = useMemo(() => {
    let list = FOODS;
    if (category !== 'all') list = list.filter(f => f.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(f => f.name.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      if (sort === 'fibre_desc') return b.fibre - a.fibre;
      if (sort === 'fibre_asc')  return a.fibre - b.fibre;
      if (sort === 'cal_asc')    return a.cal - b.cal;
      return 0;
    });
  }, [category, sort, search]);

  return (
    <>
      <Helmet>
        <title>High Fibre Foods List — Complete Reference | LiftAndBurn</title>
        <meta name="description" content="Complete list of high fibre foods sorted by fibre content per 100g. Legumes, vegetables, fruits, grains, nuts and seeds with full nutrition data." />
        <link rel="canonical" href="https://liftandburn.fit/high-fibre-foods" />
      </Helmet>
      <div className="hp-page container">
        <header className="hp-header fade-up">
          <div className="calc-breadcrumb"><Link to="/articles">Articles</Link> › High Fibre Foods</div>
          <span className="hp-eyebrow">Nutrition Reference</span>
          <h1 className="hp-title">HIGH FIBRE FOODS</h1>
          <p className="hp-subtitle">{FOODS.length} foods ranked by fibre content per 100g. Most people eat half the fibre they need — this fixes that.</p>
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
              <option value="fibre_desc">Fibre ↓</option>
              <option value="fibre_asc">Fibre ↑</option>
              <option value="cal_asc">Calories ↑</option>
            </select>
          </div>
        </div>

        <div className="hp-stats">
          <span className="hp-stats__count"><strong>{filtered.length}</strong> foods</span>
          {filtered.length > 0 && <><span className="hp-stats__divider">·</span><span className="hp-stats__best">Highest: <strong>{filtered[0].name}</strong> ({filtered[0].fibre}g fibre)</span></>}
        </div>

        <div className="hp-table">
          <div className="hp-table__head">
            <span className="hp-col-name">Food</span>
            <span className="hp-col-protein">Fibre</span>
            <span className="hp-col-bar"></span>
            <span className="hp-col-cal">Calories</span>
            <span className="hp-col-carbs">Protein</span>
            <span className="hp-col-fat">Carbs</span>
          </div>
          {filtered.length === 0 && <div className="hp-empty">No foods match your search.</div>}
          {filtered.map((food, i) => (
            <div key={food.name} className={`hp-row ${i % 2 === 0 ? 'hp-row--even' : ''}`}>
              <div className="hp-col-name">
                <span className="hp-row__emoji">{food.emoji}</span>
                <span className="hp-row__name">{food.name}</span>
                {food.note && <span className="hp-row__note">{food.note}</span>}
              </div>
              <div className="hp-col-protein"><span className="hp-protein-val">{food.fibre}g</span></div>
              <div className="hp-col-bar"><FibreBar fibre={food.fibre} /></div>
              <div className="hp-col-cal hp-muted">{food.cal}</div>
              <div className="hp-col-carbs hp-muted">{food.protein}g</div>
              <div className="hp-col-fat hp-muted">{food.carbs}g</div>
            </div>
          ))}
        </div>
        <p className="hp-footnote">All values per 100g. Fibre, protein, and carbs in grams. Figures are approximate.</p>

        <div className="hp-content">
          <h2>Why fibre matters</h2>
          <p>Fibre is the most underrated nutrient in modern diets. The average person eats 15g per day — roughly half the 25–38g recommended. That gap costs you in multiple ways: slower digestion, worse blood sugar control, higher cholesterol, increased hunger, and a less healthy gut microbiome.</p>
          <p>Fibre is not digested or absorbed. Instead it slows the passage of food through your gut, feeds beneficial gut bacteria, blunts blood sugar spikes, and adds bulk to meals without adding significant calories. The result: you feel fuller, longer, on fewer calories. For fat loss, fibre is one of the most practical tools available.</p>

          <h2>Soluble vs insoluble fibre</h2>
          <p><strong>Soluble fibre</strong> dissolves in water and forms a gel that slows digestion, steadies blood sugar, and lowers LDL cholesterol. Found in oats, beans, lentils, apples, and psyllium.</p>
          <p><strong>Insoluble fibre</strong> does not dissolve. It adds bulk and keeps digestion moving — preventing constipation and supporting colon health. Found in wholegrains, nuts, seeds, and vegetable skins.</p>
          <p>Most whole plant foods contain both. Focus on variety rather than tracking types separately.</p>

          <h2>Easiest ways to increase fibre intake</h2>
          <p>The highest-leverage changes: switch white bread to wholegrain, add a portion of legumes to your lunch or dinner 3–4 times per week, eat fruit with the skin on, and add chia or flaxseeds to your breakfast. Those four changes alone can take most people from 15g to 30g+ per day.</p>
          <p>Increase fibre gradually over 1–2 weeks. A sudden large increase causes bloating and discomfort. Drink more water as you increase fibre — it needs water to do its job.</p>

          <div className="hp-links">
            <Link to="/articles/dietary-fiber-complete-guide">Full Fibre Guide →</Link>
            <span>·</span>
            <Link to="/high-protein-foods">High Protein Foods</Link>
            <span>·</span>
            <Link to="/calculators/tdee">TDEE Calculator</Link>
          </div>
        </div>
      </div>
    </>
  );
}
