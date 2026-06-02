import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Zone2Calculator from './Zone2Calculator';
import './CalcPage.css';

export default function Zone2CalculatorPage() {
  return (
    <>
      <Helmet>
        <title>Zone 2 Heart Rate Calculator — Find Your Fat-Burning Zone | LiftAndBurn</title>
        <meta name="description" content="Calculate your Zone 2 heart rate range for optimal fat-burning steady-state cardio. Based on your age using the standard 220-minus-age formula, with full training guidance." />
        <link rel="canonical" href="https://liftandburn.fit/calculators/zone2" />
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
              <h2>What is Zone 2 training?</h2>
              <p>Zone 2 is a heart rate range — approximately 60–70% of your maximum heart rate — where your body primarily burns fat for fuel and you can hold a full conversation without gasping for breath. It is the foundation of endurance training and one of the most effective and sustainable methods for improving cardiovascular fitness and burning fat.</p>
              <p>The concept comes from a five-zone model used by exercise physiologists to describe training intensity. Zone 1 is very light activity like walking slowly. Zone 5 is maximum effort you can only sustain for seconds. Zone 2 sits low in the range — deliberately easy, sustainable for long periods, and metabolically distinct from harder efforts.</p>

              <h2>Why Zone 2 burns fat</h2>
              <p>At low intensities, your body preferentially uses fat as its primary fuel source. As intensity rises, your body shifts toward burning glycogen — stored carbohydrate — because it releases energy faster. Zone 2 sits right at the point where fat oxidation is maximised relative to carbohydrate use, which is why it is often called the fat-burning zone.</p>
              <p>This does not mean Zone 2 burns the most total calories per minute — higher intensities burn more. But Zone 2 burns a higher proportion of those calories from fat, it can be sustained far longer, and crucially it can be done almost daily without the recovery cost of high-intensity training. That combination of sustainability and fat oxidation is what makes it so effective over weeks and months.</p>

              <h2>How your Zone 2 range is calculated</h2>
              <p>This calculator uses the most widely known formula for estimating maximum heart rate: 220 minus your age. Your Zone 2 range is then calculated as 60–70% of that maximum. For example, a 30-year-old has an estimated maximum heart rate of 190 beats per minute, putting their Zone 2 range at roughly 114–133 bpm.</p>
              <p>This is an estimate. Individual maximum heart rates vary by up to 10–15 beats per minute from the formula prediction. For a more precise figure, a lab test or a structured field test with a heart rate monitor will give you your true maximum. But for the vast majority of people, the 220-minus-age estimate is close enough to train effectively.</p>

              <h2>The talk test — Zone 2 without a heart rate monitor</h2>
              <p>If you do not have a heart rate monitor, you can find Zone 2 using the talk test. In Zone 2 you should be able to speak in full sentences but feel like you are working slightly. If you can sing comfortably, you are going too easy. If you cannot complete a sentence without pausing for breath, you have drifted into Zone 3 and need to slow down. This simple test is surprisingly accurate and is used even by experienced endurance athletes.</p>

              <h2>How much Zone 2 should you do?</h2>
              <p>For general health and fat loss, 2–4 sessions of 30–45 minutes per week produces significant benefits. Endurance athletes often do considerably more — elite runners and cyclists spend around 80% of their total training time in Zone 2, reserving high-intensity work for the remaining 20%. This is known as polarised training, and it consistently outperforms spending most of your time at moderate-to-hard intensities.</p>
              <p>The best activities for Zone 2 are ones you can sustain at a steady effort: incline treadmill walking, stationary cycling, rowing, or brisk outdoor walking. The 12-3-30 treadmill protocol naturally keeps most people in Zone 2, which is one reason it is so effective for fat loss.</p>

              <h2>Zone 2 and weight training</h2>
              <p>Because Zone 2 is low intensity, it does not significantly interfere with recovery from weight training the way high-intensity cardio can. This makes it the ideal cardio companion to a lifting program. You can do Zone 2 sessions on rest days or after lifting without compromising your strength gains — provided you keep the intensity genuinely low.</p>

              <div className="calc-links">
                <Link to="/articles/zone-2-cardio-beginners-guide">Zone 2 Complete Guide →</Link>
                <span>|</span>
                <Link to="/calculators/treadmill-calorie-calculator">Treadmill Calorie Calculator</Link>
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
              <Link to="/calculators/calories">Calories Burned</Link>
              <Link to="/calculators/tdee">TDEE Calculator</Link>
            </div>
            <div className="calc-related">
              <h3>Related Articles</h3>
              <Link to="/articles/zone-2-cardio-beginners-guide">Zone 2 Cardio Guide</Link>
              <Link to="/articles/zone-2-cardio-when-you-lift-weights">Zone 2 When You Lift</Link>
              <Link to="/articles/how-to-combine-weightlifting-and-cardio">Combining Lifting & Cardio</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}