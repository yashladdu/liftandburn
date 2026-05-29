import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Zone2Calculator from './Zone2Calculator';
import './CalcPage.css';

export default function Zone2CalculatorPage() {
  return (
    <>
      <Helmet>
        <title>Zone 2 Heart Rate Calculator — LiftAndBurn</title>
        <meta name="description" content="Calculate your Zone 2 heart rate range for optimal fat-burning steady-state cardio. Based on your age using the standard 220-minus-age formula." />
      </Helmet>
      <div className="calc-page container">
        <div className="calc-breadcrumb">
          <Link to="/calculators">Calculators</Link> › Zone 2 Heart Rate
        </div>
        <h1 className="calc-page__title">Zone 2 Heart Rate Calculator</h1>
        <div className="calc-layout">
          <div className="calc-main">
            <Zone2Calculator />
            <div className="calc-instructions">
              <h2>What is Zone 2?</h2>
              <p>Zone 2 is a heart rate range — approximately 60–70% of your maximum heart rate — where your body primarily burns fat for fuel and you can hold a full conversation without gasping.</p>
              <p>Training consistently in Zone 2 builds mitochondrial density, improves fat oxidation, and strengthens your aerobic base — all without the recovery cost of high-intensity work.</p>
              <div className="calc-links">
                <Link to="/articles/zone-2-cardio-beginners-guide">Zone 2 Complete Guide →</Link>
                <span>|</span>
                <Link to="/calculators/treadmill-calorie-calculator">Walk / Run Calculator</Link>
                <span>|</span>
                <Link to="/calculators">All Calculators</Link>
              </div>
            </div>
          </div>
          <aside className="calc-sidebar">
            <div className="adsense-slot" style={{ minHeight: 250 }}>AdSense · 300×250</div>
            <div className="calc-related">
              <h3>Related Calculators</h3>
              <Link to="/calculators/treadmill-calorie-calculator">Walk / Run Metabolic</Link>
              <Link to="/calculators/steps">Step Metabolic</Link>
              <Link to="/calculators/calories">Calories Burned</Link>
              <Link to="/calculators/one-rep-max">One Rep Max</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
