import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './HighProteinFoodsPage.css';

// ── Food database ─────────────────────────────────────────────
// protein / carbs / fat / calories all per 100g
const FOODS = [
  // Meat & Poultry
  { name: 'Chicken Breast (cooked)',   category: 'meat',    protein: 32, carbs: 0,  fat: 3.6, cal: 165,  emoji: '🍗', note: 'Leanest poultry option' },
  { name: 'Turkey Breast (cooked)',    category: 'meat',    protein: 30, carbs: 0,  fat: 1.2, cal: 135,  emoji: '🦃' },
  { name: 'Lean Beef Mince (5% fat)',  category: 'meat',    protein: 26, carbs: 0,  fat: 5,   cal: 153,  emoji: '🥩' },
  { name: 'Beef Steak (sirloin)',      category: 'meat',    protein: 27, carbs: 0,  fat: 8,   cal: 180,  emoji: '🥩' },
  { name: 'Pork Tenderloin',           category: 'meat',    protein: 26, carbs: 0,  fat: 3,   cal: 143,  emoji: '🐷' },
  { name: 'Lamb Leg (lean)',           category: 'meat',    protein: 25, carbs: 0,  fat: 8,   cal: 172,  emoji: '🐑' },
  { name: 'Chicken Thigh (no skin)',   category: 'meat',    protein: 24, carbs: 0,  fat: 5,   cal: 140,  emoji: '🍗' },
  { name: 'Venison',                   category: 'meat',    protein: 30, carbs: 0,  fat: 3,   cal: 149,  emoji: '🦌' },

  // Fish & Seafood
  { name: 'Canned Tuna (in water)',    category: 'fish',    protein: 26, carbs: 0,  fat: 1,   cal: 116,  emoji: '🐟', note: 'Best protein-per-penny food' },
  { name: 'Salmon (cooked)',           category: 'fish',    protein: 25, carbs: 0,  fat: 13,  cal: 208,  emoji: '🐟', note: 'High omega-3' },
  { name: 'Cod (cooked)',              category: 'fish',    protein: 23, carbs: 0,  fat: 1,   cal: 105,  emoji: '🐟' },
  { name: 'Tilapia (cooked)',          category: 'fish',    protein: 26, carbs: 0,  fat: 3,   cal: 128,  emoji: '🐟' },
  { name: 'Prawns / Shrimp (cooked)',  category: 'fish',    protein: 24, carbs: 1,  fat: 1,   cal: 99,   emoji: '🦐', note: 'Very low calorie' },
  { name: 'Sardines (canned)',         category: 'fish',    protein: 25, carbs: 0,  fat: 11,  cal: 208,  emoji: '🐟', note: 'Cheap, high omega-3' },
  { name: 'Tuna Steak (cooked)',       category: 'fish',    protein: 30, carbs: 0,  fat: 6,   cal: 184,  emoji: '🐟' },
  { name: 'Mackerel (cooked)',         category: 'fish',    protein: 22, carbs: 0,  fat: 16,  cal: 232,  emoji: '🐟', note: 'High omega-3' },

  // Eggs & Dairy
  { name: 'Egg Whites',                category: 'dairy',   protein: 11, carbs: 1,  fat: 0,   cal: 52,   emoji: '🥚', note: 'Pure protein, no fat' },
  { name: 'Whole Eggs',                category: 'dairy',   protein: 13, carbs: 1,  fat: 11,  cal: 155,  emoji: '🥚' },
  { name: 'Greek Yoghurt (0% fat)',    category: 'dairy',   protein: 10, carbs: 4,  fat: 0,   cal: 59,   emoji: '🥛', note: 'High protein per calorie' },
  { name: 'Cottage Cheese (low fat)',  category: 'dairy',   protein: 12, carbs: 3,  fat: 1,   cal: 72,   emoji: '🧀', note: 'Slow-digesting casein' },
  { name: 'Skyr (Icelandic yoghurt)',  category: 'dairy',   protein: 11, carbs: 4,  fat: 0,   cal: 60,   emoji: '🥛', note: 'Higher protein than Greek yoghurt' },
  { name: 'Ricotta (part skim)',       category: 'dairy',   protein: 11, carbs: 4,  fat: 6,   cal: 136,  emoji: '🧀' },
  { name: 'Parmesan',                  category: 'dairy',   protein: 36, carbs: 3,  fat: 26,  cal: 392,  emoji: '🧀', note: 'Highest protein cheese' },
  { name: 'Cheddar',                   category: 'dairy',   protein: 25, carbs: 1,  fat: 33,  cal: 403,  emoji: '🧀' },

  // Protein Supplements
  { name: 'Whey Protein Powder',       category: 'supplements', protein: 80, carbs: 5, fat: 3, cal: 371, emoji: '🥤', note: 'Fast-absorbing, post-workout' },
  { name: 'Casein Protein Powder',     category: 'supplements', protein: 78, carbs: 5, fat: 2, cal: 350, emoji: '🥤', note: 'Slow-digesting, before bed' },
  { name: 'Pea Protein Powder',        category: 'supplements', protein: 75, carbs: 7, fat: 4, cal: 360, emoji: '🥤', note: 'Best plant-based protein' },

  // Legumes & Plant
  { name: 'Edamame (cooked)',          category: 'plant',   protein: 11, carbs: 8,  fat: 5,   cal: 122,  emoji: '🫘', note: 'Complete plant protein' },
  { name: 'Lentils (cooked)',          category: 'plant',   protein: 9,  carbs: 20, fat: 0.4, cal: 116,  emoji: '🫘', note: 'High fibre too' },
  { name: 'Black Beans (cooked)',      category: 'plant',   protein: 9,  carbs: 23, fat: 0.5, cal: 132,  emoji: '🫘' },
  { name: 'Chickpeas (cooked)',        category: 'plant',   protein: 9,  carbs: 27, fat: 3,   cal: 164,  emoji: '🫘' },
  { name: 'Tofu (firm)',               category: 'plant',   protein: 17, carbs: 2,  fat: 9,   cal: 144,  emoji: '🌱', note: 'Complete protein' },
  { name: 'Tempeh',                    category: 'plant',   protein: 19, carbs: 9,  fat: 11,  cal: 195,  emoji: '🌱', note: 'Fermented, more bioavailable' },
  { name: 'Seitan',                    category: 'plant',   protein: 25, carbs: 14, fat: 2,   cal: 370,  emoji: '🌱', note: 'Highest plant protein' },

  // Nuts & Seeds
  { name: 'Hemp Seeds',                category: 'nuts',    protein: 32, carbs: 8,  fat: 49,  cal: 553,  emoji: '🌱', note: 'Complete amino acid profile' },
  { name: 'Pumpkin Seeds',             category: 'nuts',    protein: 19, carbs: 54, fat: 19,  cal: 446,  emoji: '🎃' },
  { name: 'Peanuts',                   category: 'nuts',    protein: 26, carbs: 16, fat: 49,  cal: 567,  emoji: '🥜' },
  { name: 'Peanut Butter (natural)',   category: 'nuts',    protein: 25, carbs: 20, fat: 50,  cal: 588,  emoji: '🥜', note: 'Easy calories + protein' },
  { name: 'Almonds',                   category: 'nuts',    protein: 21, carbs: 22, fat: 49,  cal: 579,  emoji: '🌰' },
  { name: 'Sunflower Seeds',           category: 'nuts',    protein: 21, carbs: 20, fat: 51,  cal: 584,  emoji: '🌻' },
];

const CATEGORIES = [
  { id: 'all',          label: 'All Foods',    emoji: '🍽️' },
  { id: 'meat',         label: 'Meat',         emoji: '🥩' },
  { id: 'fish',         label: 'Fish',         emoji: '🐟' },
  { id: 'dairy',        label: 'Eggs & Dairy', emoji: '🥛' },
  { id: 'plant',        label: 'Plant-Based',  emoji: '🌱' },
  { id: 'nuts',         label: 'Nuts & Seeds', emoji: '🥜' },
  { id: 'supplements',  label: 'Supplements',  emoji: '🥤' },
];

const SORT_OPTIONS = [
  { id: 'protein_desc', label: 'Protein ↓' },
  { id: 'protein_asc',  label: 'Protein ↑' },
  { id: 'cal_asc',      label: 'Calories ↑' },
  { id: 'ratio',        label: 'Protein / Cal' },
];

function ProteinBar({ protein }) {
  const pct = Math.min((protein / 35) * 100, 100);
  const colour = protein >= 25 ? '#4ade80' : protein >= 15 ? '#D85A30' : '#f59e0b';
  return (
    <div className="hp-bar-track">
      <div className="hp-bar-fill" style={{ width: `${pct}%`, background: colour }} />
    </div>
  );
}

export default function HighProteinFoodsPage() {
  const [category, setCategory] = useState('all');
  const [sort,     setSort]     = useState('protein_desc');
  const [search,   setSearch]   = useState('');
  const [unit,     setUnit]     = useState('100g'); // 100g | serving

  const filtered = useMemo(() => {
    let list = FOODS;
    if (category !== 'all') list = list.filter(f => f.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(f => f.name.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      if (sort === 'protein_desc') return b.protein - a.protein;
      if (sort === 'protein_asc')  return a.protein - b.protein;
      if (sort === 'cal_asc')      return a.cal - b.cal;
      if (sort === 'ratio')        return (b.protein / b.cal * 100) - (a.protein / a.cal * 100);
      return 0;
    });
  }, [category, sort, search]);

  return (
    <>
      <Helmet>
        <title>High Protein Foods List — Complete Reference | LiftAndBurn</title>
        <meta name="description" content="Complete list of high protein foods sorted by protein content per 100g. Meat, fish, dairy, eggs, plant-based, and supplements — with calories, carbs, and fat." />
        <link rel="canonical" href="https://liftandburn.fit/high-protein-foods" />
      </Helmet>

      <div className="hp-page container">

        {/* ── Header ─────────────────────────────────────── */}
        <header className="hp-header fade-up">
          <div className="calc-breadcrumb">
            <Link to="/articles">Articles</Link> › High Protein Foods
          </div>
          <span className="hp-eyebrow">Nutrition Reference</span>
          <h1 className="hp-title">HIGH PROTEIN FOODS</h1>
          <p className="hp-subtitle">
            {FOODS.length} foods ranked by protein content per 100g.
            Filter by category, sort by protein or calories, or search for a specific food.
          </p>
        </header>

        {/* ── Controls ───────────────────────────────────── */}
        <div className="hp-controls">
          {/* Category filter */}
          <div className="hp-cats">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                className={`hp-cat ${category === c.id ? 'active' : ''}`}
                onClick={() => setCategory(c.id)}
              >
                <span className="hp-cat__emoji">{c.emoji}</span>
                <span className="hp-cat__label">{c.label}</span>
              </button>
            ))}
          </div>

          {/* Search + sort row */}
          <div className="hp-toolbar">
            <div className="hp-search-wrap">
              <svg className="hp-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className="hp-search"
                type="text"
                placeholder="Search foods…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="hp-sort" value={sort} onChange={e => setSort(e.target.value)}>
              {SORT_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* ── Stats bar ──────────────────────────────────── */}
        <div className="hp-stats">
          <span className="hp-stats__count">
            <strong>{filtered.length}</strong> foods
          </span>
          {filtered.length > 0 && (
            <>
              <span className="hp-stats__divider">·</span>
              <span className="hp-stats__best">
                Highest: <strong>{filtered[0].name}</strong> ({filtered[0].protein}g protein)
              </span>
            </>
          )}
        </div>

        {/* ── Table header ───────────────────────────────── */}
        <div className="hp-table">
          <div className="hp-table__head">
            <span className="hp-col-name">Food</span>
            <span className="hp-col-protein">Protein</span>
            <span className="hp-col-bar"></span>
            <span className="hp-col-cal">Calories</span>
            <span className="hp-col-carbs">Carbs</span>
            <span className="hp-col-fat">Fat</span>
          </div>

          {filtered.length === 0 && (
            <div className="hp-empty">No foods match your search.</div>
          )}

          {filtered.map((food, i) => (
            <div
              key={food.name}
              className={`hp-row ${i % 2 === 0 ? 'hp-row--even' : ''}`}
            >
              <div className="hp-col-name">
                <span className="hp-row__emoji">{food.emoji}</span>
                <span className="hp-row__name">{food.name}</span>
                {food.note && <span className="hp-row__note">{food.note}</span>}
              </div>
              <div className="hp-col-protein">
                <span className="hp-protein-val">{food.protein}g</span>
              </div>
              <div className="hp-col-bar">
                <ProteinBar protein={food.protein} />
              </div>
              <div className="hp-col-cal hp-muted">{food.cal}</div>
              <div className="hp-col-carbs hp-muted">{food.carbs}g</div>
              <div className="hp-col-fat hp-muted">{food.fat}g</div>
            </div>
          ))}
        </div>

        <p className="hp-footnote">All values per 100g cooked/prepared unless otherwise noted. Figures are approximate and vary by brand and preparation method.</p>

        {/* ── SEO content ────────────────────────────────── */}
        <div className="hp-content">
          <h2>Why protein matters</h2>
          <p>Protein is the only macronutrient your body uses to build and repair muscle tissue. Without enough protein, your body cannot recover properly from training, preserve muscle during a calorie deficit, or build new muscle in a surplus. Every other aspect of your diet can be perfect — but if you're undereating protein, your results in the gym will plateau.</p>
          <p>The research consensus is clear: aim for around 0.7–0.8g of protein per pound of bodyweight (1.6–1.8g per kg) per day. For an 80kg person, that's roughly 130–145g daily. Use our <Link to="/calculators/tdee">TDEE calculator</Link> to find your calorie target, then use the <Link to="/calculators/macros">macro calculator</Link> to split it by protein, carbs, and fat.</p>

          <h2>Best high protein foods by category</h2>

          <h3>Meat & Poultry</h3>
          <p>Chicken breast is the gold standard for lean protein — 32g per 100g with minimal fat. Turkey breast is similarly lean. If you eat red meat, lean beef mince (5% fat) and sirloin steak both deliver around 26–27g per 100g. All meat is a complete protein source, meaning it contains all nine essential amino acids.</p>

          <h3>Fish & Seafood</h3>
          <p>Canned tuna in water is arguably the best protein-per-penny food available — 26g of protein per 100g, nearly zero fat, and extremely cheap. Prawns and shrimp offer 24g of protein per 100g at under 100 calories — exceptionally lean. Salmon and mackerel are slightly lower in protein but very high in omega-3 fatty acids, making them excellent for overall health despite the higher calorie count.</p>

          <h3>Eggs & Dairy</h3>
          <p>Eggs are a complete protein and one of the most bioavailable protein sources available. Egg whites are pure protein with no fat at all. Greek yoghurt and skyr are underrated — around 10–11g of protein per 100g with very few calories, and they double as a source of casein (slow-digesting protein, ideal before bed). Cottage cheese is similarly high in casein. Parmesan has the highest protein of any common cheese at 36g per 100g, though the fat content is high too.</p>

          <h3>Plant-Based Sources</h3>
          <p>Seitan (wheat gluten) leads plant proteins at 25g per 100g, but it's not suitable for people with gluten intolerance. Tempeh and firm tofu are both complete proteins and offer 17–19g per 100g. Legumes like lentils, chickpeas, and black beans provide 9g per 100g — lower than animal sources but combined with their fibre content and low cost, they are excellent additions to any diet. Edamame is the standout legume at 11g per 100g with a complete amino acid profile.</p>

          <h3>Supplements</h3>
          <p>Whey protein powder delivers around 80g of protein per 100g — unmatched by any whole food. It is fast-absorbing, making it ideal post-workout. Casein powder is slower-digesting and better suited to a last meal of the day. For plant-based diets, pea protein is the most complete and best-tolerated option. Supplements are not necessary if you're hitting your protein targets through food, but they are a convenient and cost-effective way to close the gap.</p>

          <h2>How to hit your protein target daily</h2>
          <p>The most practical strategy is to anchor every meal around a protein source. Build the meal around the protein first, then add carbohydrates and fats around it. This makes hitting 140g+ per day straightforward:</p>
          <p>A rough daily example for an 80kg person targeting 140g protein: three eggs at breakfast (18g), a 150g chicken breast at lunch (48g), a 200g Greek yoghurt snack (20g), and a 200g portion of salmon at dinner (50g). That hits 136g from four meals without supplements.</p>
          <p>Track your protein for a week when you first start. Most people significantly overestimate how much protein they eat, and the awareness of actually logging it is often enough to close the gap.</p>

          <div className="hp-links">
            <Link to="/calculators/macros">Macro Calculator →</Link>
            <span>·</span>
            <Link to="/calculators/tdee">TDEE Calculator</Link>
            <span>·</span>
            <Link to="/articles/how-much-protein-to-build-muscle">How Much Protein Do You Need?</Link>
            <span>·</span>
            <Link to="/articles/does-protein-burn-more-calories">Thermic Effect of Protein</Link>
          </div>
        </div>

      </div>
    </>
  );
}
