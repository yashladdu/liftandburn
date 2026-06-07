import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const ARTICLES_DROPDOWN = [
  { to: '/category/weightlifting', label: 'Weightlifting' },
  { to: '/category/cardio',        label: 'Cardio' },
  { to: '/category/recomp',        label: 'Body Recomp' },
];

const EXERCISES_DROPDOWN = [
  { to: '/articles/best-chest-exercises',    label: 'Chest' },
  { to: '/articles/best-back-exercises',     label: 'Back' },
  { to: '/articles/best-shoulder-exercises', label: 'Shoulders' },
  { to: '/articles/best-leg-exercises',      label: 'Legs' },
  { to: '/articles/best-bicep-exercises',    label: 'Biceps' },
  { to: '/articles/best-tricep-exercises',   label: 'Triceps' },
  { to: '/articles/best-ab-exercises',       label: 'Abs' },
];

const NUTRITION_DROPDOWN = [
  { to: '/high-protein-foods',            label: 'High Protein Foods' },
  { to: '/high-fibre-foods',              label: 'High Fibre Foods' },
  { to: '/low-calorie-high-volume-foods', label: 'Low Calorie Foods' },
  { to: '/cheapest-protein-sources',      label: 'Cheapest Protein Sources' },
  { to: '/best-foods-for-each-macro',     label: 'Best Foods by Macro' },
];

function Dropdown({ label, footer, children, closeAll }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="nav-dropdown" ref={ref}>
      <button
        className={`nav-dropdown__trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        {label}
        <svg className="nav-dropdown__chevron" width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
      {open && (
        <div className="nav-dropdown__panel" onClick={() => { setOpen(false); closeAll(); }}>
          <div className="nav-dropdown__section">
            {children}
          </div>
          {footer && (
            <div className="nav-dropdown__footer">
              <Link to={footer.to} className="nav-dropdown__footer-link">{footer.label}</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [query,      setQuery]      = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [darkMode,   setDarkMode]   = useState(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle('light-mode', !darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim().length < 2) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery('');
    setSearchOpen(false);
    setMenuOpen(false);
  };

  const closeAll = () => { setMenuOpen(false); setSearchOpen(false); };

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" onClick={closeAll}>
          LIFT<span>&</span>BURN
        </Link>

        {/* ── Desktop nav ───────────────────────────── */}
        <nav className="navbar__links">

          <Dropdown
            label="Articles"
            footer={{ to: '/articles', label: 'All Articles →' }}
            closeAll={closeAll}
          >
            {ARTICLES_DROPDOWN.map(l => (
              <Link key={l.to} to={l.to} className="nav-dropdown__link">{l.label}</Link>
            ))}
          </Dropdown>

          <Dropdown
            label="Exercises"
            footer={{ to: '/articles', label: 'All Articles →' }}
            closeAll={closeAll}
          >
            {EXERCISES_DROPDOWN.map(l => (
              <Link key={l.to} to={l.to} className="nav-dropdown__link">{l.label}</Link>
            ))}
          </Dropdown>

          <Dropdown label="Nutrition" closeAll={closeAll}>
            {NUTRITION_DROPDOWN.map(l => (
              <Link key={l.to} to={l.to} className="nav-dropdown__link">{l.label}</Link>
            ))}
          </Dropdown>

          <Link to="/calculators" className="navbar__link--highlight">Calculators</Link>
          <Link to="/programs">Store</Link>

        </nav>

        <div className="navbar__right">
          <button
            className="navbar__icon-btn navbar__theme-btn"
            onClick={() => setDarkMode(d => !d)}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          <button
            className="navbar__icon-btn"
            onClick={() => { setSearchOpen(o => !o); setMenuOpen(false); }}
            aria-label="Toggle search"
          >
            {searchOpen ? '✕' : '⌕'}
          </button>

          <button
            className="navbar__hamburger"
            onClick={() => { setMenuOpen(o => !o); setSearchOpen(false); }}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : (
              <span className="navbar__hamburger-icon">
                <span /><span /><span />
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <form className="navbar__search-bar" onSubmit={handleSearch}>
          <div className="container">
            <input
              autoFocus
              type="text"
              placeholder="Search articles — e.g. zone 2, creatine, incline walking…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button type="submit">Search →</button>
          </div>
        </form>
      )}

      {/* ── Mobile menu ───────────────────────────── */}
      {menuOpen && (
        <nav className="navbar__mobile-menu">

          <span className="navbar__mobile-section">Articles</span>
          <Link to="/category/weightlifting" onClick={closeAll}>Weightlifting</Link>
          <Link to="/category/cardio"        onClick={closeAll}>Cardio</Link>
          <Link to="/category/recomp"        onClick={closeAll}>Body Recomp</Link>
          <Link to="/articles"               onClick={closeAll}>All Articles →</Link>

          <div className="navbar__mobile-divider" />

          <span className="navbar__mobile-section">Exercises</span>
          <Link to="/articles/best-chest-exercises"    onClick={closeAll}>Best Chest Exercises</Link>
          <Link to="/articles/best-back-exercises"     onClick={closeAll}>Best Back Exercises</Link>
          <Link to="/articles/best-shoulder-exercises" onClick={closeAll}>Best Shoulder Exercises</Link>
          <Link to="/articles/best-leg-exercises"      onClick={closeAll}>Best Leg Exercises</Link>
          <Link to="/articles/best-bicep-exercises"    onClick={closeAll}>Best Bicep Exercises</Link>
          <Link to="/articles/best-tricep-exercises"   onClick={closeAll}>Best Tricep Exercises</Link>
          <Link to="/articles/best-ab-exercises"       onClick={closeAll}>Best Ab Exercises</Link>

          <div className="navbar__mobile-divider" />

          <span className="navbar__mobile-section">Nutrition</span>
          <Link to="/high-protein-foods"            onClick={closeAll}>High Protein Foods</Link>
          <Link to="/high-fibre-foods"              onClick={closeAll}>High Fibre Foods</Link>
          <Link to="/low-calorie-high-volume-foods" onClick={closeAll}>Low Calorie Foods</Link>
          <Link to="/cheapest-protein-sources"      onClick={closeAll}>Cheapest Protein Sources</Link>
          <Link to="/best-foods-for-each-macro"     onClick={closeAll}>Best Foods by Macro</Link>

          <div className="navbar__mobile-divider" />

          <Link to="/calculators" onClick={closeAll} className="navbar__mobile-highlight">Calculators</Link>
          <Link to="/programs"    onClick={closeAll}>Store</Link>

          <div className="navbar__mobile-divider" />

          <Link to="/about"   onClick={closeAll}>About</Link>
          <Link to="/contact" onClick={closeAll}>Contact</Link>

          <div className="navbar__mobile-divider" />

          <button className="navbar__mobile-theme" onClick={() => setDarkMode(d => !d)}>
            {darkMode ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
          </button>
        </nav>
      )}
    </header>
  );
}