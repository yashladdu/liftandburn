import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/category/weightlifting', label: 'Weightlifting' },
  { to: '/category/cardio',        label: 'Cardio' },
  { to: '/category/recomp',        label: 'Recomp' },
  { to: '/calculators',            label: 'Calculators', highlight: true },
  { to: '/articles',               label: 'All Articles' },
];

export default function Navbar() {
  const [query,      setQuery]      = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [darkMode,   setDarkMode]   = useState(() => {
    // Read from localStorage — default dark
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });
  const navigate = useNavigate();

  // Apply theme class on mount and toggle
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

        {/* Desktop nav */}
        <nav className="navbar__links">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className={l.highlight ? 'navbar__link--highlight' : ''}>{l.label}</Link>
          ))}
        </nav>

        <div className="navbar__right">
          {/* Dark/light toggle */}
          <button
            className="navbar__icon-btn navbar__theme-btn"
            onClick={() => setDarkMode(d => !d)}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Search toggle */}
          <button
            className="navbar__icon-btn"
            onClick={() => { setSearchOpen(o => !o); setMenuOpen(false); }}
            aria-label="Toggle search"
          >
            {searchOpen ? '✕' : '⌕'}
          </button>

          {/* Hamburger — mobile only */}
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
              placeholder="Search articles — e.g. zone 2, incline walking…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button type="submit">Search →</button>
          </div>
        </form>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="navbar__mobile-menu">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} onClick={closeAll}>{l.label}</Link>
          ))}
          <div className="navbar__mobile-divider" />
          <Link to="/about"   onClick={closeAll}>About</Link>
          <Link to="/contact" onClick={closeAll}>Contact</Link>
          <div className="navbar__mobile-divider" />
          <button
            className="navbar__mobile-theme"
            onClick={() => setDarkMode(d => !d)}
          >
            {darkMode ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
          </button>
        </nav>
      )}
    </header>
  );
}
