import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './HighProteinFoodsPage.css';
import './ReferencePage.css';

// Prices are approximate UK/global averages. Users can use as a comparison guide.
const FOODS = [
  { name: 'Canned Tuna (in water)',    category: 'fish',    protein: 26, priceKg: 3.50,  cal: 116, fat: 1,   emoji: '🐟', note: 'Best value protein overall' },
  { name: 'Dried Lentils',             category: 'plant',   protein: 25, priceKg: 1.20,  cal: 353, fat: 1,   emoji: '🫘', note: 'Cheapest protein per kg' },
  { name: 'Dried Chickpeas',           category: 'plant',   protein: 19, priceKg: 1.50,  cal: 364, fat: 6,   emoji: '🫘' },
  { name: 'Dried Black Beans',         category: 'plant',   protein: 21, priceKg: 1.40,  cal: 341, fat: 1,   emoji: '🫘' },
  { name: 'Whole Eggs',                category: 'dairy',   protein: 13, priceKg: 2.80,  cal: 155, fat: 11,  emoji: '🥚' },
  { name: 'Chicken Breast (frozen)',   category: 'meat',    protein: 31, priceKg: 5.50,  cal: 165, fat: 4,   emoji: '🍗', note: 'Best lean meat value' },
  { name: 'Chicken Thigh (frozen)',    category: 'meat',    protein: 24, priceKg: 3.50,  cal: 209, fat: 11,  emoji: '🍗' },
  { name: 'Lean Beef Mince (5%)',      category: 'meat',    protein: 26, priceKg: 7.00,  cal: 153, fat: 5,   emoji: '🥩' },
  { name: 'Pork Mince',               category: 'meat',    protein: 19, priceKg: 4.50,  cal: 185, fat: 10,  emoji: '🐷' },
  { name: 'Sardines (canned)',         category: 'fish',    protein: 25, priceKg: 3.00,  cal: 208, fat: 11,  emoji: '🐟', note: 'Omega-3 bonus' },
  { name: 'Mackerel (canned)',         category: 'fish',    protein: 22, priceKg: 3.20,  cal: 232, fat: 16,  emoji: '🐟' },
  { name: 'Whey Protein Powder',       category: 'supplement', protein: 80, priceKg: 12.00, cal: 371, fat: 3, emoji: '🥤', note: 'Cost-effective per gram protein' },
  { name: 'Pea Protein Powder',        category: 'supplement', protein: 75, priceKg: 14.00, cal: 360, fat: 4, emoji: '🥤' },
  { name: 'Cottage Cheese (low fat)',  category: 'dairy',   protein: 12, priceKg: 2.50,  cal: 72,  fat: 1,   emoji: '🧀' },
  { name: 'Greek Yoghurt (0% fat)',    category: 'dairy',   protein: 10, priceKg: 3.00,  cal: 59,  fat: 0,   emoji: '🥛' },
  { name: 'Peanut Butter (natural)',   category: 'plant',   protein: 25, priceKg: 4.00,  cal: 588, fat: 50,  emoji: '🥜' },
  { name: 'Tofu (firm)',               category: 'plant',   protein: 17, priceKg: 2.80,  cal: 144, fat: 9,   emoji: '🌱' },
  { name: 'Tempeh',                    category: 'plant',   protein: 19, priceKg: 6.00,  cal: 195, fat: 11,  emoji: '🌱' },
  { name: 'Turkey Mince',             category: 'meat',    protein: 22, priceKg: 5.00,  cal: 165, fat: 7,   emoji: '🦃' },
  { name: 'Frozen Salmon Fillets',     category: 'fish',    protein: 25, priceKg: 9.00,  cal: 208, fat: 13,  emoji: '🐟' },
];

// Cost per 100g protein
const costPer100gProtein = food => {
  const kgOfFoodFor100gProtein = 100 / food.protein;
  return food.priceKg * kgOfFoodFor100gProtein;
};

const CATEGORIES = [
  { id: 'all',         label: 'All',        emoji: '🍽️' },
  { id: 'meat',        label: 'Meat',       emoji: '🥩' },
  { id: 'fish',        label: 'Fish',       emoji: '🐟' },
  { id: 'dairy',       label: 'Dairy',      emoji: '🥛' },
  { id: 'plant',       label: 'Plant',      emoji: '🌱' },
  { id: 'supplement',  label: 'Supplements',emoji: '🥤' },
];

function ValueBar({ cost }) {
  const pct = Math.max(0, Math.min(100, 100 - (cost - 1) / 0.15 * 100));
  const colour = cost < 4 ? '#4ade80' : cost < 8 ? '#D85A30' : '#f59e0b';
  return (
    <div className="hp-bar-track">
      <div className="hp-bar-fill" style={{ width: `${Math.max(pct, 8)}%`, background: colour }} />
    </div>
  );
}

export default function CheapestProteinPage() {
  const [category, setCategory] = useState('all');
  const [sort,     setSort]     = useState('cost_asc');
  const [search,   setSearch]   = useState('');

  const filtered = useMemo(() => {
    let list = FOODS;
    if (category !== 'all') list = list.filter(f => f.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(f => f.name.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      if (sort === 'cost_asc')     return costPer100gProtein(a) - costPer100gProtein(b);
      if (sort === 'protein_desc') return b.protein - a.protein;
      if (sort === 'price_asc')    return a.priceKg - b.priceKg;
      return 0;
    });
  }, [category, sort, search]);

  return (
    <>
      <Helmet>
        <title>Cheapest Protein Sources — Cost per Gram of Protein | LiftAndBurn</title>
        <meta name="description" content="Cheapest protein sources ranked by cost per gram of protein. Meat, fish, dairy, plant-based and supplements compared so you can hit your protein goals on any budget." />
        <link rel="canonical" href="https://liftandburn.fit/cheapest-protein-sources" />
      </Helmet>
      <div className="hp-page container">
        <header className="hp-header fade-up">
          <div className="calc-breadcrumb"><Link to="/articles">Articles</Link> › Cheapest Protein Sources</div>
          <span className="hp-eyebrow">Nutrition Reference</span>
          <h1 className="hp-title">CHEAPEST PROTEIN SOURCES</h1>
          <p className="hp-subtitle">{FOODS.length} protein sources ranked by cost per 100g of protein. Hit your targets without breaking the bank.</p>
        </header>

        <div className="ref-notice">
          <span>💡</span>
          <p>Prices are approximate UK averages and vary by store, brand, and region. Use this as a comparison guide — the relative ranking is more useful than the absolute numbers.</p>
        </div>

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
              <option value="cost_asc">Cost per 100g protein ↑</option>
              <option value="protein_desc">Protein per 100g ↓</option>
              <option value="price_asc">Price per kg ↑</option>
            </select>
          </div>
        </div>

        <div className="hp-stats">
          <span className="hp-stats__count"><strong>{filtered.length}</strong> sources</span>
          {filtered.length > 0 && <><span className="hp-stats__divider">·</span><span className="hp-stats__best">Best value: <strong>{filtered[0].name}</strong> (£{costPer100gProtein(filtered[0]).toFixed(2)} / 100g protein)</span></>}
        </div>

        <div className="hp-table">
          <div className="hp-table__head">
            <span className="hp-col-name">Food</span>
            <span className="hp-col-protein">£/100g protein</span>
            <span className="hp-col-bar"></span>
            <span className="hp-col-cal">£/kg</span>
            <span className="hp-col-carbs">Protein/100g</span>
            <span className="hp-col-fat">Calories</span>
          </div>
          {filtered.length === 0 && <div className="hp-empty">No foods match your search.</div>}
          {filtered.map((food, i) => {
            const cost = costPer100gProtein(food);
            return (
              <div key={food.name} className={`hp-row ${i % 2 === 0 ? 'hp-row--even' : ''}`}>
                <div className="hp-col-name">
                  <span className="hp-row__emoji">{food.emoji}</span>
                  <span className="hp-row__name">{food.name}</span>
                  {food.note && <span className="hp-row__note">{food.note}</span>}
                </div>
                <div className="hp-col-protein"><span className="hp-protein-val">£{cost.toFixed(2)}</span></div>
                <div className="hp-col-bar"><ValueBar cost={cost} /></div>
                <div className="hp-col-cal hp-muted">£{food.priceKg.toFixed(2)}</div>
                <div className="hp-col-carbs hp-muted">{food.protein}g</div>
                <div className="hp-col-fat hp-muted">{food.cal}</div>
              </div>
            );
          })}
        </div>
        <p className="hp-footnote">Prices are approximate UK averages. Cost per 100g protein = (price per kg ÷ protein per 100g) × 10. Values vary by retailer.</p>

        <div className="hp-content">
          <h2>Why cost per gram of protein matters</h2>
          <p>The sticker price of a food tells you almost nothing about its protein value. A cheap food with low protein density can cost far more per gram of protein than a more expensive food with very high protein. This table reranks everything by cost per 100g of actual protein, which is the number that matters when you're trying to hit a protein target on a budget.</p>
          <p>Dried lentils rank near the top of value rankings because at ~£1.20/kg with 25g protein per 100g, you're buying 100g of protein for well under £1. Canned tuna is the best animal-protein value. Whey protein powder, despite costing £12+/kg, has 80g protein per 100g — making it surprisingly cost-effective per gram of protein compared to fresh meat.</p>

          <h2>Budget protein strategy</h2>
          <p>Build your protein intake around three or four cost-effective staples: dried legumes, eggs, canned fish, and frozen chicken. These four cover animal and plant sources, give you variety, and between them can deliver 140g of protein per day at very low cost. Use protein powder to fill gaps conveniently, not as a primary source.</p>

          <div className="hp-links">
            <Link to="/high-protein-foods">High Protein Foods →</Link>
            <span>·</span>
            <Link to="/articles/how-much-protein-to-build-muscle">How Much Protein Do You Need?</Link>
            <span>·</span>
            <Link to="/calculators/macros">Macro Calculator</Link>
          </div>
        </div>
      </div>
    </>
  );
}
