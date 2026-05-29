import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import OneRepMaxCalculator from './OneRepMaxCalculator';
import './CalcPage.css';

export default function OneRepMaxPage() {
  return (
    <>
      <Helmet>
        <title>One Rep Max Calculator — LiftAndBurn</title>
        <meta name="description" content="Calculate your one rep max (1RM) from any working set using Epley, Brzycki, and Lander formulas. Includes a full training percentage table." />
      </Helmet>
      <div className="calc-page container">
        <div className="calc-breadcrumb">
          <Link to="/calculators">Calculators</Link> › One Rep Max
        </div>
        <h1 className="calc-page__title">One Rep Max Calculator</h1>
        <div className="calc-layout">
          <div className="calc-main">
            <OneRepMaxCalculator />
            <div className="calc-instructions">
              <h2>How to use your 1RM</h2>
              <p>Your one rep max is the foundation of percentage-based programming. Use the training table above to know exactly what weight to lift for any rep range.</p>
              <p>As a general guide: 85%+ builds strength, 70–85% builds size, 60–70% builds endurance and technique.</p>
              <div className="calc-links">
                <Link to="/articles/progressive-overload-for-beginners">Progressive Overload Guide →</Link>
                <span>|</span>
                <Link to="/calculators">All Calculators</Link>
              </div>
            </div>
          </div>
          <aside className="calc-sidebar">
            <div className="adsense-slot" style={{ minHeight: 250 }}>AdSense · 300×250</div>
            <div className="calc-related">
              <h3>Related Calculators</h3>
              <Link to="/calculators/zone2">Zone 2 Heart Rate</Link>
              <Link to="/calculators/calories">Calories Burned</Link>
              <Link to="/calculators/treadmill-calorie-calculator">Walk / Run Metabolic</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
