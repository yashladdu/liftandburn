import { useState } from 'react';
import './CalcPage.css';

const ACTIVITIES = [
  { label: 'Treadmill walking (5 km/h)',    met: 3.5  },
  { label: 'Treadmill walking (6.5 km/h)',  met: 4.3  },
  { label: 'Treadmill jogging (8 km/h)',    met: 8.3  },
  { label: 'Treadmill running (10 km/h)',   met: 10.0 },
  { label: 'Treadmill running (12 km/h)',   met: 11.5 },
  { label: 'Incline treadmill (10% grade)', met: 6.0  },
  { label: 'Outdoor running (easy pace)',   met: 8.0  },
  { label: 'Outdoor cycling (leisure)',     met: 6.0  },
  { label: 'Outdoor cycling (moderate)',    met: 8.0  },
  { label: 'Stationary bike (moderate)',    met: 7.0  },
  { label: 'Rowing machine (moderate)',     met: 7.0  },
  { label: 'Elliptical (moderate)',         met: 5.0  },
  { label: 'Swimming (moderate)',           met: 7.0  },
  { label: 'Weightlifting (moderate)',      met: 3.5  },
  { label: 'Weightlifting (vigorous)',      met: 6.0  },
  { label: 'Jump rope (moderate)',          met: 10.0 },
  { label: 'Hiking (moderate terrain)',     met: 6.0  },
  { label: 'Walking (brisk, 6 km/h)',       met: 4.0  },
];

const toKg = (w, u) => u === 'lbs' ? w * 0.453592 : w;

export default function CaloriesCalculator() {
  const [weight,   setWeight]   = useState('');
  const [duration, setDuration] = useState('');
  const [actIdx,   setActIdx]   = useState(0);
  const [unit,     setUnit]     = useState('kg');
  const [result,   setResult]   = useState(null);
  const [error,    setError]    = useState('');

  const calculate = () => {
    setError('');
    const w = parseFloat(weight);
    const d = parseFloat(duration);
    if (!w || w <= 0) return setError('Enter a valid body weight.');
    if (!d || d <= 0) return setError('Enter a valid duration.');
    const weightKg = toKg(w, unit);
    const met      = ACTIVITIES[actIdx].met;
    const calories = Math.round(met * weightKg * (d / 60));
    const fatGrams = Math.round((calories / 7700) * 1000) / 10;
    setResult({
      calories,
      fatGrams,
      met,
      perMinute: Math.round((met * weightKg) / 60 * 10) / 10,
      activity: ACTIVITIES[actIdx].label,
    });
  };

  return (
    <div className="calc-box">
      <div className="calc-grid">
        <div className="calc-row" style={{ gridColumn: '1 / -1' }}>
          <label>Activity</label>
          <select value={actIdx} onChange={e => setActIdx(parseInt(e.target.value))}>
            {ACTIVITIES.map((a, i) => <option key={i} value={i}>{a.label}</option>)}
          </select>
        </div>
        <div className="calc-row">
          <label>Body weight</label>
          <div className="calc-input-pair">
            <input
              type="number" placeholder="e.g. 75"
              value={weight} min="30"
              onChange={e => setWeight(e.target.value)}
            />
            <select value={unit} onChange={e => setUnit(e.target.value)}>
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>
        <div className="calc-row">
          <label>Duration (minutes)</label>
          <input
            type="number" placeholder="e.g. 45"
            value={duration} min="1"
            onChange={e => setDuration(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && calculate()}
          />
        </div>
      </div>
      {error && <p className="calc-error">{error}</p>}
      <div className="calc-actions">
        <button className="calc-btn-primary" onClick={calculate}>Calculate →</button>
        <button className="calc-btn-reset" onClick={() => { setWeight(''); setDuration(''); setResult(null); setError(''); }}>Reset</button>
      </div>

      {result && (
        <div className="calc-results fade-up" style={{ marginTop: 20 }}>
          <div className="calc-result-grid">
            <div className="calc-result-item highlight">
              <span className="calc-result-val">{result.calories}</span>
              <span className="calc-result-label">Calories (kcal)</span>
            </div>
            <div className="calc-result-item">
              <span className="calc-result-val">{result.perMinute}</span>
              <span className="calc-result-label">kcal / min</span>
            </div>
            <div className="calc-result-item">
              <span className="calc-result-val">{result.fatGrams}g</span>
              <span className="calc-result-label">Fat burned</span>
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 12 }}>
            MET value: {result.met} · Based on the Compendium of Physical Activities. Actual calories vary with fitness level, age, and intensity.
          </p>
        </div>
      )}
    </div>
  );
}
