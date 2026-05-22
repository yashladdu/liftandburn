import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">LIFT<span>&</span>BURN</span>
          <p className="footer__tagline">Strength + Endurance. No compromises.</p>
        </div>

        <nav className="footer__nav">
          <div className="footer__col">
            <span className="footer__col-title">Training</span>
            <Link to="/category/weightlifting">Weightlifting</Link>
            <Link to="/category/cardio">Cardio</Link>
            <Link to="/category/recomp">Body Recomp</Link>
            <Link to="/calculators">Calculators</Link>
          </div>
          <div className="footer__col">
            <span className="footer__col-title">Site</span>
            <Link to="/articles">All Articles</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </nav>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <span>© {new Date().getFullYear()} LiftAndBurn. All rights reserved.</span>
          {/* <span>Built with React + Node</span> */}
        </div>
      </div>
    </footer>
  );
}
