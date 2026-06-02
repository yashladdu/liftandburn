import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import CaloriesCalculator from './CaloriesCalculator';
import './CalcPage.css';

export default function CaloriesPage() {
  return (
    <>
      <Helmet>
        <title>Calories Burned Calculator — Treadmill, Cycling, Lifting & More | LiftAndBurn</title>
        <meta name="description" content="Calculate calories burned on the treadmill, bike, rowing machine, weightlifting, and 15+ other activities using MET values from the Compendium of Physical Activities." />
        <link rel="canonical" href="https://liftandburn.fit/calculators/calories" />
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
              <p>This calculator uses MET (Metabolic Equivalent of Task) values from the Compendium of Physical Activities — the standard reference used by exercise scientists worldwide. The formula is: <strong>Calories = MET × weight (kg) × duration (hours)</strong>.</p>
              <p>A MET of 1 equals your resting metabolic rate — the energy your body uses sitting completely still. An activity with a MET of 10, such as running at 10 km/h, burns roughly ten times more energy than resting. Multiplying the MET value by your body weight and the duration of the activity gives a reliable estimate of total calories burned.</p>

              <h2>Why body weight matters so much</h2>
              <p>Body weight is the single biggest variable in calorie burn for any given activity. A heavier person burns more calories doing the same exercise because they are moving more mass over the same distance. This is why generic calorie estimates — and the readouts on gym cardio machines — are so often wrong. A treadmill that assumes an average 70 kg user will significantly underestimate the burn for a 95 kg person and overestimate it for a 55 kg person.</p>
              <p>By entering your actual body weight, this calculator produces a far more accurate figure than the default estimates most machines and apps provide.</p>

              <h2>Understanding MET values</h2>
              <p>Different activities have different MET values based on how metabolically demanding they are. Light activities like slow walking sit around 2–3 METs. Moderate activities like cycling or brisk walking are around 4–7 METs. Vigorous activities like running, fast cycling, or jumping rope range from 8 to 12 METs or higher. The higher the MET value, the more calories burned per minute at any given body weight.</p>
              <p>It is worth noting that strength training has a deceptively modest MET value during the session itself — typically 3.5 to 6 METs — but this understates its true value. Building muscle through resistance training raises your resting metabolic rate over time, meaning you burn more calories around the clock, not just during the workout.</p>

              <h2>How accurate are these estimates?</h2>
              <p>MET-based calculations are estimates, not precise measurements. Actual calorie burn varies with fitness level, age, sex, body composition, exercise efficiency, and individual metabolic differences. A fitter person is often more efficient and may burn slightly fewer calories doing the same activity than a less-fit person. Terrain, temperature, and technique also play a role.</p>
              <p>That said, MET-based estimates are considerably more accurate than the generic readouts on most fitness equipment, and they are more than sufficient for planning your nutrition and tracking your energy expenditure over time. Use the number as a reliable estimate to inform your decisions, not as an exact figure to the calorie.</p>

              <h2>Using calories burned for fat loss</h2>
              <p>Fat loss comes down to maintaining a calorie deficit — burning more energy than you consume. Knowing how many calories you burn during exercise helps you plan that deficit accurately. However, a common mistake is "eating back" all the calories burned, which cancels out the deficit. Many people get the best results by calculating their maintenance calories using the TDEE calculator, eating in a moderate deficit, and treating exercise calories as a bonus rather than permission to eat more.</p>

              <p className="calc-note">Actual calories vary with fitness level, age, and individual metabolic rate. Use this as an estimate, not a precise measurement.</p>
              <div className="calc-links">
                <Link to="/calculators/treadmill-calorie-calculator">Treadmill Calorie Calculator</Link>
                <span>|</span>
                <Link to="/calculators/tdee">TDEE Calculator</Link>
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
              <Link to="/calculators/treadmill-calorie-calculator">Treadmill Calorie Calculator</Link>
              <Link to="/calculators/steps">Steps to Calories</Link>
              <Link to="/calculators/zone2">Zone 2 Heart Rate</Link>
              <Link to="/calculators/tdee">TDEE Calculator</Link>
            </div>
            <div className="calc-related">
              <h3>Related Articles</h3>
              <Link to="/articles/treadmill-incline-walking-burn-calories">Treadmill Incline Walking</Link>
              <Link to="/articles/how-to-combine-weightlifting-and-cardio">Combining Lifting & Cardio</Link>
              <Link to="/articles/12-3-30-workout-does-it-work">The 12-3-30 Workout</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}