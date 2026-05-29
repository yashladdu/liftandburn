import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './calculators/CalcPage.css';

const SECTIONS = [
  {
    title: 'Metabolic Calculators',
    calcs: [
      { icon: '🚶', title: 'Walk / Run',  desc: 'METs, VO2, and calories burned walking or running on a treadmill.', to: '/calculators/treadmill-calorie-calculator' },
      { icon: '👟', title: 'Steps to Calories', desc: 'How many calories does walking 10,000 steps burn? Enter your steps, weight and pace.', to: '/calculators/steps' },
    ],
  },
  {
    title: 'Strength Calculators',
    calcs: [
      { icon: '⚖️', title: 'BMI Calculator', desc: 'Calculate your Body Mass Index with a visual gauge, healthy weight range, and an honest explanation of why BMI is misleading for muscular people.', to: '/calculators/bmi' },
      { icon: '🍽️', title: 'TDEE Calculator', desc: 'Calculate your Total Daily Energy Expenditure and daily calorie target using Mifflin-St Jeor, Katch-McArdle and more. Includes macro breakdown.', to: '/calculators/tdee' },
      { icon: '🏋️', title: 'One Rep Max',         desc: 'Estimate your 1RM from any working set and get a full training percentage table.', to: '/calculators/one-rep-max' },
      { icon: '🏃', title: 'Zone 2 Heart Rate',   desc: 'Find your optimal fat-burning cardio heart rate zone based on your age.', to: '/calculators/zone2' },
      { icon: '🔥', title: 'Calories Burned',     desc: 'Calories burned across 18 activities including treadmill, cycling, rowing, and lifting.', to: '/calculators/calories' },
    ],
  },
  {
    title: 'Converters',
    calcs: [
      { icon: '💨', title: 'Speed — mph ↔ km/h', desc: 'Instantly convert treadmill speeds between mph and km/h. Includes a full speed reference table.', to: '/calculators/converters' },
      { icon: '👟', title: 'Steps to Distance', desc: 'Convert step count to meters, km, and miles based on your height.', to: '/calculators/converters' },
      { icon: '📏', title: 'Length & Distance', desc: 'Convert between km, miles, meters, feet, inches, and more.', to: '/calculators/converters' },
      { icon: '⚖️', title: 'Weight',            desc: 'Convert between kg, lbs, grams, ounces, and stones.', to: '/calculators/converters' },
      { icon: '🌡️', title: 'Temperature',       desc: 'Convert between Celsius, Fahrenheit, and Kelvin.', to: '/calculators/converters' },
    ],
  },
];

export default function CalculatorsHubPage() {
  return (
    <>
      <Helmet>
        <title>Fitness Calculators — LiftAndBurn</title>
        <meta name="description" content="Free fitness calculators for hybrid athletes — metabolic calculators, strength tools, and unit converters. No sign-up required." />
      </Helmet>

      <div className="calc-hub container">
        <header className="calc-hub-header fade-up">
          <span className="calc-hub-eyebrow">Free tools</span>
          <h1 className="calc-hub-title">FITNESS CALCULATORS</h1>
          <p className="calc-hub-sub">Science-based calculators to support your training. No sign-up required.</p>
        </header>

        <div className="adsense-slot">AdSense · 728×90</div>

        {SECTIONS.map((section) => (
          <div key={section.title} className="calc-hub-section">
            <h2 className="calc-hub-section-title">{section.title}</h2>
            <div className="calc-hub-grid">
              {section.calcs.map((calc) => (
                <Link key={calc.title} to={calc.to} className="calc-hub-card">
                  <span className="calc-hub-card__icon">{calc.icon}</span>
                  <span className="calc-hub-card__title">{calc.title}</span>
                  <span className="calc-hub-card__desc">{calc.desc}</span>
                  <span className="calc-hub-card__link">Open →</span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className="adsense-slot">AdSense · 728×90</div>
      </div>
    </>
  );
}
