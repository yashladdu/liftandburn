import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [query, setQuery]     = useState('');
  const [open, setOpen]       = useState(false);
  const navigate              = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim().length < 2) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery('');
    setOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          LIFT<span>&</span>BURN
        </Link>

        <nav className="navbar__links">
          <Link to="/category/weightlifting">Weightlifting</Link>
          <Link to="/category/cardio">Cardio</Link>
          <Link to="/category/recomp">Recomp</Link>
          <Link to="/calculators">Calculators</Link>
          <Link to="/articles">All Articles</Link>
        </nav>

        <div className="navbar__right">
          <button
            className="navbar__search-toggle"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle search"
          >
            {open ? '✕' : '⌕'}
          </button>
        </div>
      </div>

      {open && (
        <form className="navbar__search-bar" onSubmit={handleSearch}>
          <div className="container">
            <input
              autoFocus
              type="text"
              placeholder="Search articles — e.g. zone 2, progressive overload…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">Search →</button>
          </div>
        </form>
      )}
    </header>
  );
}
