import { useState } from 'react';
import './CalcPage.css';

export default function Zone2Calculator() {
  const [age,    setAge]    = useState('');
  const [result, setResult] = useState(null);
  const [error,  setError]  = useState('');

  const calculate = () => {
    setError('');
    const a = parseInt(age);
    if (!a || a < 10 || a > 100) return setError('Enter a valid age (10–100).');
    const maxHR = 220 - a;
    const low   = Math.round(maxHR * 0.60);
    const high  = Math.round(maxHR * 0.70);
    setResult({
      maxHR, low, high,
      zones: [
        { label: 'Zone 1 — Recovery',   range: `< ${Math.round(maxHR * 0.60)} bpm`,                                   color: '#4ade80' },
        { label: 'Zone 2 — Fat Burn ✓', range: `${low}–${high} bpm`,                                                  color: '#D85A30', active: true },
        { label: 'Zone 3 — Aerobic',    range: `${Math.round(maxHR * 0.71)}–${Math.round(maxHR * 0.80)} bpm`,         color: '#facc15' },
        { label: 'Zone 4 — Threshold',  range: `${Math.round(maxHR * 0.81)}–${Math.round(maxHR * 0.90)} bpm`,         color: '#f97316' },
        { label: 'Zone 5 — Max Effort', range: `> ${Math.round(maxHR * 0.90)} bpm`,                                   color: '#ef4444' },
      ],
    });
  };

  return (
    <div className="calc-box">
      <div className="calc-grid">
        <div className="calc-row">
          <label>Age</label>
          <input
            type="number" placeholder="e.g. 30"
            value={age} min="10" max="100"
            onChange={e => setAge(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && calculate()}
          />
        </div>
      </div>
      {error && <p className="calc-error">{error}</p>}
      <div className="calc-actions">
        <button className="calc-btn-primary" onClick={calculate}>Calculate →</button>
        <button className="calc-btn-reset" onClick={() => { setAge(''); setResult(null); setError(''); }}>Reset</button>
      </div>
      {result && (
        <div className="calc-results fade-up" style={{ marginTop: 20 }}>
          <div className="calc-result-grid">
            <div className="calc-result-item highlight">
              <span className="calc-result-val">{result.low}–{result.high}</span>
              <span className="calc-result-label">Zone 2 (bpm)</span>
            </div>
            <div className="calc-result-item">
              <span className="calc-result-val">{result.maxHR}</span>
              <span className="calc-result-label">Max HR (bpm)</span>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '14px 0 12px', padding: '10px 14px', background: 'var(--bg-raised)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent)' }}>
            Stay in this range during cardio. You should be able to hold a full conversation — if you can't, slow down.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {result.zones.map(z => (
              <div key={z.label} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                background: z.active ? 'rgba(216,90,48,0.08)' : 'var(--bg-raised)',
                border: `1px solid ${z.active ? 'var(--accent)' : 'transparent'}`,
              }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: z.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'var(--text)', flex: 1 }}>{z.label}</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{z.range}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
