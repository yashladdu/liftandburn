import { useState } from 'react';
import './CalcPage.css';

const FORMULAS = {
  Epley:   (w, r) => r === 1 ? w : w * (1 + r / 30),
  Brzycki: (w, r) => r === 1 ? w : w * (36 / (37 - r)),
  Lander:  (w, r) => r === 1 ? w : (100 * w) / (101.3 - 2.67123 * r),
};

const PCT_TABLE = [
  { pct: 100, reps: 1  },
  { pct: 95,  reps: 2  },
  { pct: 90,  reps: 3  },
  { pct: 85,  reps: 4  },
  { pct: 80,  reps: 5  },
  { pct: 75,  reps: 6  },
  { pct: 70,  reps: 8  },
  { pct: 65,  reps: 10 },
  { pct: 60,  reps: 12 },
];

export default function OneRepMaxCalculator() {
  const [weight, setWeight] = useState('');
  const [reps,   setReps]   = useState('');
  const [unit,   setUnit]   = useState('kg');
  const [result, setResult] = useState(null);
  const [error,  setError]  = useState('');

  const calculate = () => {
    setError('');
    const w = parseFloat(weight);
    const r = parseInt(reps);
    if (!w || w <= 0)        return setError('Enter a valid weight.');
    if (!r || r < 1 || r > 30) return setError('Enter reps between 1 and 30.');
    const estimates = Object.entries(FORMULAS).map(([name, fn]) => ({
      name, value: Math.round(fn(w, r)),
    }));
    const avg = Math.round(estimates.reduce((s, e) => s + e.value, 0) / estimates.length);
    setResult({ avg, estimates, unit });
  };

  return (
    <div className="calc-box">
      <div className="calc-grid">
        <div className="calc-row">
          <label>Weight lifted</label>
          <div className="calc-input-pair">
            <input
              type="number" placeholder="e.g. 100"
              value={weight} min="1"
              onChange={e => setWeight(e.target.value)}
            />
            <select value={unit} onChange={e => setUnit(e.target.value)}>
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>
        <div className="calc-row">
          <label>Reps completed</label>
          <input
            type="number" placeholder="e.g. 5"
            value={reps} min="1" max="30"
            onChange={e => setReps(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && calculate()}
          />
        </div>
      </div>
      {error && <p className="calc-error">{error}</p>}
      <div className="calc-actions">
        <button className="calc-btn-primary" onClick={calculate}>Calculate →</button>
        <button className="calc-btn-reset" onClick={() => { setWeight(''); setReps(''); setResult(null); setError(''); }}>Reset</button>
      </div>

      {result && (
        <div className="calc-results fade-up" style={{ marginTop: 20 }}>
          <div className="calc-result-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            <div className="calc-result-item highlight" style={{ gridColumn: '1 / -1' }}>
              <span className="calc-result-val">{result.avg} {result.unit}</span>
              <span className="calc-result-label">Estimated 1 Rep Max</span>
            </div>
            {result.estimates.map(e => (
              <div key={e.name} className="calc-result-item">
                <span className="calc-result-val" style={{ fontSize: 22 }}>{e.value} {result.unit}</span>
                <span className="calc-result-label">{e.name}</span>
              </div>
            ))}
          </div>

          <div className="calc-table-wrap" style={{ marginTop: 16 }}>
            <table className="calc-table">
              <thead>
                <tr>
                  <th>% of 1RM</th>
                  <th>Weight ({result.unit})</th>
                  <th>Target reps</th>
                </tr>
              </thead>
              <tbody>
                {PCT_TABLE.map(row => (
                  <tr key={row.pct} className={row.pct === 100 ? 'highlight' : ''}>
                    <td>{row.pct}%</td>
                    <td>{Math.round(result.avg * row.pct / 100)}</td>
                    <td>{row.reps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
