import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './calculators/CalcPage.css';

const SECTIONS = [
  {
    title: 'Calorie & Energy',
    calcs: [
      { icon: '🍽️', title: 'TDEE Calculator',             desc: 'Calculate your Total Daily Energy Expenditure using Mifflin-St Jeor, Katch-McArdle and more. Includes macro breakdown.', to: '/calculators/tdee' },
      { icon: '🥩', title: 'Macro Calculator',             desc: 'Convert grams of protein, carbs, and fat to total calories — or enter a calorie target and get your macro split in grams.', to: '/calculators/macros' },
      { icon: '⏱️', title: 'Calorie Deficit',              desc: 'How long to reach your goal weight at a given daily deficit. Shows weeks, months, and target date.', to: '/calculators/calorie-deficit' },
      { icon: '💧', title: 'Water Intake',                 desc: 'Daily hydration target based on bodyweight, activity level, and climate.', to: '/calculators/water-intake' },
      { icon: '🔥', title: 'Calories Burned',              desc: 'Calories burned across 18 activities including treadmill, cycling, rowing, and lifting.', to: '/calculators/calories' },
      { icon: '🏃', title: 'Treadmill Calorie Calculator', desc: 'Calculate calories burned on a treadmill at any speed and incline using ACSM equations.', to: '/calculators/treadmill-calorie-calculator' },
      { icon: '👟', title: 'Steps to Calories',            desc: 'How many calories does walking 10,000 steps burn? Enter your steps, weight and pace.', to: '/calculators/steps' },
    ],
  },
  {
    title: 'Body & Cardio',
    calcs: [
      { icon: '⚖️', title: 'Ideal Body Weight',  desc: 'Calculate your ideal weight using all four clinical formulas — Devine, Robinson, Miller, and Hamwi — and see how they compare.', to: '/calculators/ideal-weight' },
      { icon: '📐', title: 'Body Fat Calculator', desc: 'Estimate body fat % using four methods: U.S. Navy, YMCA, Jackson-Pollock 3-site skinfold, and BMI-based.', to: '/calculators/body-fat' },
      { icon: '⚖️', title: 'BMI Calculator',      desc: 'Calculate your Body Mass Index with a visual gauge, healthy weight range, and an honest explanation of why BMI is misleading for muscular people.', to: '/calculators/bmi' },
      { icon: '💪', title: 'Lean Body Mass',      desc: 'Calculate your lean mass and fat mass using Boer, James, and Hume formulas — or enter your body fat %.', to: '/calculators/lean-body-mass' },
      { icon: '💓', title: 'Zone 2 Heart Rate',   desc: 'Find your optimal fat-burning cardio heart rate zone based on your age.', to: '/calculators/zone2' },
    ],
  },
  {
    title: 'Strength',
    calcs: [
      { icon: '🏋️', title: 'One Rep Max',         desc: 'Estimate your 1RM from any working set and get a full training percentage table.', to: '/calculators/one-rep-max' },
      { icon: '📊', title: 'Strength Standards',  desc: 'See how your squat, bench, deadlift, OHP, pull-ups, and grip strength rank from beginner to elite.', to: '/calculators/strength-standards' },
      { icon: '🎯', title: 'Wilks / DOTS',        desc: 'Powerlifting strength score relative to bodyweight. Compares across all weight classes.', to: '/calculators/wilks-dots' },
      { icon: '🔢', title: 'Plate Loading',        desc: 'What plates to put on each side of the bar for any target weight. Visual diagram.', to: '/calculators/plate-loading' },
    ],
  },
  {
    title: 'Converters',
    calcs: [
      { icon: '💨', title: 'Speed — mph ↔ km/h', desc: 'Instantly convert treadmill speeds between mph and km/h. Includes a full speed reference table.', to: '/calculators/converters' },
      { icon: '👟', title: 'Steps to Distance',   desc: 'Convert step count to meters, km, and miles based on your height.', to: '/calculators/converters' },
      { icon: '📏', title: 'Length & Distance',   desc: 'Convert between km, miles, meters, feet, inches, and more.', to: '/calculators/converters' },
      { icon: '⚖️', title: 'Weight',              desc: 'Convert between kg, lbs, grams, ounces, and stones.', to: '/calculators/converters' },
      { icon: '🌡️', title: 'Temperature',         desc: 'Convert between Celsius, Fahrenheit, and Kelvin.', to: '/calculators/converters' },
    ],
  },
];

export default function CalculatorsHubPage() {
  return (
    <>
      <Helmet>
        <title>Fitness Calculators — LiftAndBurn</title>
        <meta name="description" content="Free fitness calculators — TDEE, macros, calories burned, treadmill, BMI, Zone 2 heart rate, one rep max, and unit converters. No sign-up required." />
        <link rel="canonical" href="https://liftandburn.fit/calculators" />
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