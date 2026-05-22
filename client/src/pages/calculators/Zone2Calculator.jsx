import { useState } from 'react';
import './CalcPage.css';

export default function Zone2Calculator() {
  const [age, setAge]       = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const a = parseInt(age);
    if (!a || a < 10 || a > 100) return;
    const maxHR   = 220 - a;
    const low     = Math.round(maxHR * 0.6);
    const high    = Math.round(maxHR * 0.7);
    const zone3lo = Math.round(maxHR * 0.71);
    const zone3hi = Math.round(maxHR * 0.8);
    setResult({ maxHR, low, high, zone3lo, zone3hi });
  };

  const zones = result ? [
    { label: 'Zone 1 — Recovery',       range: `< ${Math.round(result.maxHR * 0.6)} bpm`,                color: '#4ade80' },
    { label: 'Zone 2 — Fat Burn ✓',     range: `${result.low}–${result.high} bpm`,                       color: '#D85A30', active: true },
    { label: 'Zone 3 — Aerobic',        range: `${result.zone3lo}–${result.zone3hi} bpm`,                color: '#facc15' },
    { label: 'Zone 4 — Threshold',      range: `${Math.round(result.maxHR * 0.81)}–${Math.round(result.maxHR * 0.9)} bpm`, color: '#f97316' },
    { label: 'Zone 5 — Max Effort',     range: `> ${Math.round(result.maxHR * 0.9)} bpm`,               color: '#ef4444' },
  ] : [];

  return (
    <div className="calc-card">
      <div className="calc-card__header">
        <span className="calc-card__icon">🏃</span>
        <div>
          <h2 className="calc-card__title">Zone 2 Heart Rate Calculator</h2>
          <p className="calc-card__subtitle">Find your optimal fat-burning cardio zone</p>
        </div>
      </div>

      <div className="calc-inputs">
        <div className="calc-field">
          <label>Age</label>
          <input
            type="number"
            placeholder="e.g. 30"
            value={age}
            min="10" max="100"
            onChange={(e) => setAge(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && calculate()}
          />
        </div>
        <button className="calc-btn" onClick={calculate}>Calculate →</button>
      </div>

      {result && (
        <div className="calc-result fade-up">
          <div className="calc-result__primary">
            <span className="calc-result__big">{result.low}–{result.high}</span>
            <span className="calc-result__unit">bpm — Your Zone 2</span>
          </div>
          <p className="calc-result__tip">
            Stay in this range during cardio. You should be able to hold a full conversation — if you can't, slow down.
          </p>
          <div className="calc-zones">
            {zones.map((z) => (
              <div key={z.label} className={`calc-zone ${z.active ? 'active' : ''}`}>
                <span className="calc-zone__dot" style={{ background: z.color }} />
                <span className="calc-zone__label">{z.label}</span>
                <span className="calc-zone__range">{z.range}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
