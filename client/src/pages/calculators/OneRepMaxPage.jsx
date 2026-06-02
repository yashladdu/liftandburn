import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import OneRepMaxCalculator from './OneRepMaxCalculator';
import './CalcPage.css';

export default function OneRepMaxPage() {
  return (
    <>
      <Helmet>
        <title>One Rep Max Calculator (1RM) — Epley, Brzycki & Lander | LiftAndBurn</title>
        <meta name="description" content="Calculate your one rep max (1RM) from any working set using the Epley, Brzycki, and Lander formulas. Includes a full training percentage table for every rep range." />
        <link rel="canonical" href="https://liftandburn.fit/calculators/one-rep-max" />
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
              <h2>What is a one rep max?</h2>
              <p>Your one rep max, or 1RM, is the maximum weight you can lift for a single repetition of a given exercise with proper form. It is the standard measure of maximal strength and the foundation of percentage-based training programs. Knowing your 1RM lets you calculate exactly what weight to use for any rep range, take the guesswork out of programming, and track your strength progress objectively over time.</p>

              <h2>How this calculator estimates your 1RM</h2>
              <p>Testing your true 1RM by actually attempting a maximal single is taxing, requires a spotter, and carries injury risk — so most lifters estimate it instead. This calculator uses three of the most validated formulas in strength science to estimate your 1RM from a submaximal set, then averages them for a reliable figure.</p>
              <p>The <strong>Epley formula</strong> (1985) is the most widely used and tends to be accurate across most rep ranges. The <strong>Brzycki formula</strong> uses a slightly different equation that is very accurate at lower rep ranges. The <strong>Lander formula</strong> provides a third reference point. By averaging all three, this calculator smooths out the small differences between them to give you a dependable estimate.</p>
              <p>Accuracy is highest when you enter a set of 10 reps or fewer. The further you go beyond 10 reps, the less accurate any 1RM estimate becomes, because fatigue and endurance start to influence the result more than pure strength.</p>

              <h2>How to use your 1RM for programming</h2>
              <p>Once you know your 1RM, you can train at specific percentages of it to target different adaptations. The training percentage table above shows the approximate weight and rep targets for each percentage of your max:</p>
              <p><strong>85–100% of 1RM (1–5 reps):</strong> Builds maximal strength. This is the range powerlifters and strength athletes spend most of their time in. Long rest periods of 3–5 minutes are needed between sets.</p>
              <p><strong>70–85% of 1RM (6–12 reps):</strong> The hypertrophy range — best for building muscle size. This is where most bodybuilding-style training lives, with rest periods of 1.5–3 minutes.</p>
              <p><strong>60–70% of 1RM (12–20 reps):</strong> Builds muscular endurance and is useful for technique practice, warm-ups, and higher-rep accessory work.</p>

              <h2>How often should you retest?</h2>
              <p>Rather than testing your true 1RM frequently, most lifters re-estimate it every 4–8 weeks using this calculator after a heavy working set. This avoids the fatigue and risk of repeated maximal attempts while still letting you track progress. If your estimated 1RM is climbing, your programming is working. If it has stalled for several weeks, it may be time to adjust your training, nutrition, or recovery.</p>

              <h2>A note on form and safety</h2>
              <p>An estimated 1RM is only meaningful if the set you entered was performed with good form. Reps that involve heaving, bouncing, or partial range of motion will inflate your estimate and lead you to program with weights that are too heavy. Always base your estimate on clean, controlled reps.</p>

              <div className="calc-links">
                <Link to="/articles/progressive-overload-for-beginners">Progressive Overload Guide →</Link>
                <span>|</span>
                <Link to="/articles/progressive-overload-explained">Progressive Overload Explained →</Link>
                <span>|</span>
                <Link to="/calculators">All Calculators</Link>
              </div>
            </div>
          </div>
          <aside className="calc-sidebar">
            <div className="adsense-slot" style={{ minHeight: 250 }}>AdSense · 300×250</div>
            <div className="calc-related">
              <h3>Related Calculators</h3>
              <Link to="/calculators/tdee">TDEE Calculator</Link>
              <Link to="/calculators/bmi">BMI Calculator</Link>
              <Link to="/calculators/zone2">Zone 2 Heart Rate</Link>
            </div>
            <div className="calc-related">
              <h3>Related Articles</h3>
              <Link to="/articles/progressive-overload-for-beginners">Progressive Overload for Beginners</Link>
              <Link to="/articles/minimum-effective-dose-muscle-growth">Minimum Effective Dose</Link>
              <Link to="/articles/junk-volume-too-many-sets">The Junk Volume Problem</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}