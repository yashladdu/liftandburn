import { useState } from 'react';

// MET values for common exercises
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

export default function CaloriesCalculator() {
  const [weight,   setWeight]   = useState('');
  const [duration, setDuration] = useState('');
  const [actIdx,   setActIdx]   = useState(0);
  const [unit,     setUnit]     = useState('kg');
  const [result,   setResult]   = useState(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const d = parseFloat(duration);
    if (!w || !d) return;

    const weightKg = unit === 'lbs' ? w * 0.453592 : w;
    const met      = ACTIVITIES[actIdx].met;
    // Calories = MET × weight(kg) × duration(hours)
    const calories = Math.round(met * weightKg * (d / 60));
    const fatGrams = Math.round((calories / 7700) * 1000) / 10;

    setResult({
      calories,
      fatGrams,
      met,
      activity: ACTIVITIES[actIdx].label,
      perMinute: Math.round((met * weightKg) / 60 * 10) / 10,
    });
  };

  return (
    <div className="calc-card">
      <div className="calc-card__header">
        <span className="calc-card__icon">🔥</span>
        <div>
          <h2 className="calc-card__title">Calories Burned Calculator</h2>
          <p className="calc-card__subtitle">Treadmill, cycling, lifting and more</p>
        </div>
      </div>

      <div className="calc-inputs">
        <div className="calc-field" style={{ gridColumn: '1 / -1' }}>
          <label>Activity</label>
          <select
            value={actIdx}
            onChange={(e) => setActIdx(parseInt(e.target.value))}
            style={{ width: '100%' }}
          >
            {ACTIVITIES.map((a, i) => (
              <option key={i} value={i}>{a.label}</option>
            ))}
          </select>
        </div>

        <div className="calc-field">
          <label>Body weight</label>
          <div className="calc-input-row">
            <input
              type="number"
              placeholder="e.g. 75"
              value={weight}
              min="30"
              onChange={(e) => setWeight(e.target.value)}
            />
            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>

        <div className="calc-field">
          <label>Duration (minutes)</label>
          <input
            type="number"
            placeholder="e.g. 45"
            value={duration}
            min="1"
            onChange={(e) => setDuration(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && calculate()}
          />
        </div>

        <button
          className="calc-btn"
          onClick={calculate}
          style={{ gridColumn: '1 / -1' }}
        >
          Calculate →
        </button>
      </div>

      {result && (
        <div className="calc-result fade-up">
          <div className="calc-result__primary">
            <span className="calc-result__big">{result.calories}</span>
            <span className="calc-result__unit">calories burned</span>
          </div>

          <div className="calc-formula-row">
            <div className="calc-formula-item">
              <span className="calc-formula-val">{result.perMinute}</span>
              <span className="calc-formula-name">cal / min</span>
            </div>
            <div className="calc-formula-item">
              <span className="calc-formula-val">{result.fatGrams}g</span>
              <span className="calc-formula-name">fat burned</span>
            </div>
            <div className="calc-formula-item">
              <span className="calc-formula-val">{result.met}</span>
              <span className="calc-formula-name">MET value</span>
            </div>
          </div>

          <p className="calc-result__tip">
            Based on MET values from the Compendium of Physical Activities.
            Actual calories vary with fitness level, age, and intensity.
          </p>
        </div>
      )}
    </div>
  );
}
