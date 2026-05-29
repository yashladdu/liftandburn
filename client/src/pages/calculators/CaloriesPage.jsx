import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import CaloriesCalculator from './CaloriesCalculator';
import './CalcPage.css';

export default function CaloriesPage() {
  return (
    <>
      <Helmet>
        <title>Calories Burned Calculator — Treadmill, Cycling & More | LiftAndBurn</title>
        <meta name="description" content="Calculate calories burned on the treadmill, bike, rowing machine, weightlifting, and 15+ other activities using MET values." />
      </Helmet>
      <div className="calc-page container">
        <div className="calc-breadcrumb">
          <Link to="/calculators">Calculators</Link> › Calories Burned
        </div>
        <h1 className="calc-page__title">Calories Burned Calculator</h1>
        <div className="calc-layout">
          <div className="calc-main">
            <CaloriesCalculator />
            <div className="calc-instructions">
              <h2>How calories burned is calculated</h2>
              <p>This calculator uses MET (Metabolic Equivalent of Task) values from the Compendium of Physical Activities. The formula is: <strong>Calories = MET × weight (kg) × duration (hours)</strong>.</p>
              <p>A MET of 1 equals resting metabolic rate. Running at 10 km/h has a MET of ~10, meaning it burns roughly 10× more energy than sitting still.</p>
              <p className="calc-note">Actual calories vary with fitness level, age, and individual metabolic rate. Use this as an estimate, not a precise measurement.</p>
              <div className="calc-links">
                <Link to="/calculators/treadmill-calorie-calculator">Walk / Run Metabolic Calculator</Link>
                <span>|</span>
                <Link to="/articles/how-to-combine-weightlifting-and-cardio">Combining Lifting & Cardio →</Link>
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
              <Link to="/calculators/zone2">Zone 2 Heart Rate</Link>
              <Link to="/calculators/one-rep-max">One Rep Max</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
