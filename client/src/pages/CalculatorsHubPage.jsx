import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './calculators/CalcPage.css';

const SECTIONS = [
  {
    title: 'Calorie & Energy',
    intro: 'Calculate your daily energy needs, macros, protein targets, and how many calories you burn through walking, the treadmill, and everyday activity.',
    calcs: [
      { icon: '🏃', title: 'Treadmill Calorie Calculator', desc: 'Calories burned on a treadmill at any speed and incline using ACSM equations.', to: '/calculators/treadmill-calorie-calculator' },
      { icon: '👟', title: 'Steps to Calories',            desc: 'How many calories your daily steps actually burn.', to: '/calculators/steps' },
      { icon: '🍽️', title: 'TDEE Calculator',             desc: 'Total Daily Energy Expenditure — Mifflin-St Jeor, Katch-McArdle, macro breakdown.', to: '/calculators/tdee' },
      { icon: '🥩', title: 'Macro Calculator',             desc: 'Grams of protein, carbs, and fat to calories — or calories to macro split.', to: '/calculators/macros' },
      { icon: '🍗', title: 'Protein Intake',               desc: 'Daily protein target based on bodyweight and goal.', to: '/calculators/protein-intake' },
      { icon: '⏱️', title: 'Calorie Deficit',              desc: 'How long to reach your goal weight at a given deficit.', to: '/calculators/calorie-deficit' },
      { icon: '💧', title: 'Water Intake',                 desc: 'Daily hydration target based on weight, activity, and climate.', to: '/calculators/water-intake' },
      { icon: '🔥', title: 'Calories Burned',              desc: 'Calories burned across 18 activities — treadmill, cycling, rowing, lifting.', to: '/calculators/calories' },
      
    ],
  },
  {
    title: 'Body & Cardio',
    intro: 'Estimate body fat, lean mass, ideal weight, and find your heart rate training zones for cardio and recovery.',
    calcs: [
      { icon: '⚖️', title: 'Ideal Body Weight',  desc: 'Four clinical formulas — Devine, Robinson, Miller, Hamwi — compared.', to: '/calculators/ideal-weight' },
      { icon: '📐', title: 'Body Fat Calculator', desc: 'Estimate body fat % — Navy, YMCA, Jackson-Pollock, BMI-based.', to: '/calculators/body-fat' },
      { icon: '⚖️', title: 'BMI Calculator',      desc: 'Body Mass Index with a visual gauge and healthy weight range.', to: '/calculators/bmi' },
      { icon: '💪', title: 'Lean Body Mass',      desc: 'Lean and fat mass using Boer, James, and Hume formulas.', to: '/calculators/lean-body-mass' },
      { icon: '💓', title: 'Zone 2 Heart Rate',   desc: 'Your optimal fat-burning cardio heart rate zone.', to: '/calculators/zone2' },
      { icon: '❤️', title: 'Heart Rate Zones',    desc: 'All 5 training zones — recovery to max effort.', to: '/calculators/heart-rate-zones' },
      { icon: '🫀', title: 'Resting Heart Rate',  desc: 'What your RHR means — compared against age-based ranges.', to: '/calculators/resting-heart-rate' },
      { icon: '🏃', title: 'Pace Calculator',     desc: 'Running/walking pace, race time predictions, and distance.', to: '/calculators/pace' },
    ],
  },
  {
    title: 'Strength',
    intro: 'Estimate your one-rep max, see how your lifts compare to strength standards, and work out exactly which plates to load.',
    calcs: [
      { icon: '🏋️', title: 'One Rep Max',         desc: 'Estimate your 1RM and get a full training percentage table.', to: '/calculators/one-rep-max' },
      { icon: '📊', title: 'Strength Standards',  desc: 'Squat, bench, deadlift, OHP, pull-ups, grip — beginner to elite.', to: '/calculators/strength-standards' },
      { icon: '🎯', title: 'Wilks / DOTS',        desc: 'Powerlifting strength score relative to bodyweight.', to: '/calculators/wilks-dots' },
      { icon: '🔢', title: 'Plate Loading',        desc: 'Which plates to put on each side of the bar for any weight.', to: '/calculators/plate-loading' },
    ],
  },
  {
    title: 'Converters',
    intro: 'Quick unit conversions for speed, distance, weight, and temperature — useful for treadmill settings and tracking progress.',
    calcs: [
      { icon: '💨', title: 'Speed — mph ↔ km/h', desc: 'Convert treadmill speeds with a full reference table.', to: '/calculators/converters' },
      { icon: '👟', title: 'Steps to Distance',   desc: 'Step count to meters, km, and miles based on height.', to: '/calculators/converters' },
      { icon: '📏', title: 'Length & Distance',   desc: 'km, miles, meters, feet, inches, and more.', to: '/calculators/converters' },
      { icon: '⚖️', title: 'Weight',              desc: 'kg, lbs, grams, ounces, and stones.', to: '/calculators/converters' },
      { icon: '🌡️', title: 'Temperature',         desc: 'Celsius, Fahrenheit, and Kelvin.', to: '/calculators/converters' },
    ],
  },
];

const FAQS = [
  {
    q: 'How do I calculate my TDEE?',
    a: 'Your TDEE (Total Daily Energy Expenditure) is calculated from your basal metabolic rate (BMR) multiplied by an activity factor based on how often you exercise. Our TDEE calculator uses the Mifflin-St Jeor and Katch-McArdle equations and gives you a macro breakdown for your goal.',
  },
  {
    q: 'How much protein do I need per day?',
    a: 'Most people aiming to build muscle or lose fat while preserving muscle should aim for 0.7–1.0g of protein per pound of bodyweight (roughly 1.6–2.2g per kg). Use the protein intake calculator for a target based on your weight and goal.',
  },
  {
    q: 'How many calories does walking burn?',
    a: 'It depends on your weight, speed, and incline. A 70kg person walking at 3mph flat burns roughly 140 calories in 30 minutes — at 12% incline that rises to over 300 calories. Use the treadmill calorie calculator or steps to calories calculator for a personalised figure.',
  },
  {
    q: 'What is a good resting heart rate?',
    a: 'For most adults, 60–100 bpm is considered normal, but lower is generally better for cardiovascular fitness — well-trained athletes often sit in the 40s and 50s. Use the resting heart rate calculator to see where you fall for your age group.',
  },
  {
    q: 'Are these calculators free to use?',
    a: 'Yes, every calculator on LiftAndBurn is completely free with no sign-up required. We built them to be accurate, science-based tools using established formulas (ACSM, Mifflin-St Jeor, Tanaka, and more).',
  },
];

export default function CalculatorsHubPage() {
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  });

  return (
    <>
      <Helmet>
        <title>Free Fitness Calculators — TDEE, Macros, Body Fat, Heart Rate & More | LiftAndBurn</title>
        <meta name="description" content="20+ free fitness calculators: TDEE, macros, protein intake, body fat, BMI, lean body mass, heart rate zones, one rep max, pace, and more. No sign-up required." />
        <link rel="canonical" href="https://liftandburn.fit/calculators" />
        <script type="application/ld+json">{jsonLd}</script>
      </Helmet>

      <div className="calc-hub container">
        <header className="calc-hub-header fade-up">
          <h1 className="calc-hub-title">FITNESS CALCULATORS</h1>
          <p className="calc-hub-sub">
            Science-based calculators for TDEE, macros, body fat, heart rate zones, one rep max, and more —
            built on established formulas like Mifflin-St Jeor, ACSM, and the Tanaka equation. No sign-up required.
          </p>
        </header>

        <div className="adsense-slot">AdSense · 728×90</div>

        {SECTIONS.map((section) => (
          <div key={section.title} className="calc-hub-section">
            <h2 className="calc-hub-section-title">{section.title}</h2>
            <p className="calc-hub-section-intro">{section.intro}</p>
            <div className="calc-hub-grid calc-hub-grid--4col">
              {section.calcs.map((calc) => (
                <Link key={calc.title} to={calc.to} className="calc-hub-card calc-hub-card--compact">
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

        {/* FAQ section — SEO + featured snippet opportunities */}
        <section className="calc-hub-faq">
          <h2 className="calc-hub-section-title">Frequently Asked Questions</h2>
          <div className="calc-hub-faq__list">
            {FAQS.map(f => (
              <div key={f.q} className="calc-hub-faq__item">
                <h3 className="calc-hub-faq__q">{f.q}</h3>
                <p className="calc-hub-faq__a">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}