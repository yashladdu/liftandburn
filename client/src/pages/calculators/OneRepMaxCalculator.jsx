import { useState } from 'react';
import './CalcPage.css';

const FORMULAS = {
  Epley:    (w, r) => r === 1 ? w : w * (1 + r / 30),
  Brzycki:  (w, r) => r === 1 ? w : w * (36 / (37 - r)),
  Lander:   (w, r) => r === 1 ? w : (100 * w) / (101.3 - 2.67123 * r),
};

const PCT_TABLE = [
  { pct: 100, reps: 1 },
  { pct: 95,  reps: 2 },
  { pct: 90,  reps: 3 },
  { pct: 85,  reps: 4 },
  { pct: 80,  reps: 5 },
  { pct: 75,  reps: 6 },
  { pct: 70,  reps: 8 },
  { pct: 65,  reps: 10 },
  { pct: 60,  reps: 12 },
];

export default function OneRepMaxCalculator() {
  const [weight, setWeight] = useState('');
  const [reps,   setReps]   = useState('');
  const [unit,   setUnit]   = useState('kg');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const r = parseInt(reps);
    if (!w || !r || r < 1 || r > 30) return;

    const estimates = Object.entries(FORMULAS).map(([name, fn]) => ({
      name,
      value: Math.round(fn(w, r)),
    }));
    const avg = Math.round(estimates.reduce((s, e) => s + e.value, 0) / estimates.length);
    setResult({ avg, estimates, unit });
  };

  return (
    <div className="calc-card">
      <div className="calc-card__header">
        <span className="calc-card__icon">🏋️</span>
        <div>
          <h2 className="calc-card__title">One Rep Max Calculator</h2>
          <p className="calc-card__subtitle">Estimate your 1RM from any set</p>
        </div>
      </div>

      <div className="calc-inputs">
        <div className="calc-field">
          <label>Weight lifted</label>
          <div className="calc-input-row">
            <input
              type="number"
              placeholder="e.g. 100"
              value={weight}
              min="1"
              onChange={(e) => setWeight(e.target.value)}
            />
            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>
        <div className="calc-field">
          <label>Reps completed</label>
          <input
            type="number"
            placeholder="e.g. 5"
            value={reps}
            min="1" max="30"
            onChange={(e) => setReps(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && calculate()}
          />
        </div>
        <button className="calc-btn" onClick={calculate}>Calculate →</button>
      </div>

      {result && (
        <div className="calc-result fade-up">
          <div className="calc-result__primary">
            <span className="calc-result__big">{result.avg} {result.unit}</span>
            <span className="calc-result__unit">Estimated 1 Rep Max</span>
          </div>

          <div className="calc-formula-row">
            {result.estimates.map((e) => (
              <div key={e.name} className="calc-formula-item">
                <span className="calc-formula-val">{e.value} {result.unit}</span>
                <span className="calc-formula-name">{e.name}</span>
              </div>
            ))}
          </div>

          <p className="calc-result__tip">
            Use the percentage table below to programme your training weights.
          </p>

          <div className="calc-table-wrap">
            <table className="calc-table">
              <thead>
                <tr>
                  <th>% of 1RM</th>
                  <th>Weight ({result.unit})</th>
                  <th>Target reps</th>
                </tr>
              </thead>
              <tbody>
                {PCT_TABLE.map((row) => (
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
