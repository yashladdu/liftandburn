import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './CalcPage.css';

// ── Speed Converter ───────────────────────────────────────────
function SpeedConverter() {
  const [mph,  setMph]  = useState('');
  const [kmh,  setKmh]  = useState('');

  const fromMph = (v) => {
    const val = parseFloat(v);
    setMph(v);
    setKmh(isNaN(val) ? '' : (Math.round(val * 1.60934 * 100) / 100).toString());
  };

  const fromKmh = (v) => {
    const val = parseFloat(v);
    setKmh(v);
    setMph(isNaN(val) ? '' : (Math.round(val / 1.60934 * 100) / 100).toString());
  };

  // Common treadmill speed reference table
  const SPEEDS = [
    { mph: 2.0, label: 'Slow walk' },
    { mph: 2.5, label: 'Walk' },
    { mph: 3.0, label: '12-3-30 speed' },
    { mph: 3.5, label: 'Brisk walk' },
    { mph: 4.0, label: 'Fast walk' },
    { mph: 5.0, label: 'Jog' },
    { mph: 6.0, label: 'Easy run' },
    { mph: 7.0, label: 'Moderate run' },
    { mph: 8.0, label: 'Fast run' },
  ];

  return (
    <div className="converter-card converter-card--speed">
      <h3>Speed — mph ↔ km/h</h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 5 }}>mph</div>
          <input
            type="number"
            placeholder="e.g. 3"
            value={mph}
            min="0"
            step="0.1"
            onChange={e => fromMph(e.target.value)}
            style={{ width: '100%', background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: 15, outline: 'none' }}
          />
        </div>
        <div style={{ color: 'var(--accent)', fontSize: 20, marginTop: 18, flexShrink: 0 }}>⇄</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 5 }}>km/h</div>
          <input
            type="number"
            placeholder="e.g. 4.8"
            value={kmh}
            min="0"
            step="0.1"
            onChange={e => fromKmh(e.target.value)}
            style={{ width: '100%', background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: 15, outline: 'none' }}
          />
        </div>
      </div>

      {/* Reference table */}
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 8 }}>Treadmill reference</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {SPEEDS.map(s => (
            <div
              key={s.mph}
              onClick={() => fromMph(s.mph.toString())}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                background: parseFloat(mph) === s.mph ? 'rgba(216,90,48,0.12)' : 'var(--bg-raised)',
                border: parseFloat(mph) === s.mph ? '1px solid var(--accent)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</span>
              <span style={{ fontSize: 12, color: 'var(--text-faint)', fontFamily: 'monospace' }}>
                {s.mph} mph · {Math.round(s.mph * 1.60934 * 10) / 10} km/h
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Steps to Distance ────────────────────────────────────────
function StepsToDistance() {
  const [steps,   setSteps]   = useState('');
  const [height,  setHeight]  = useState('');
  const [hUnit,   setHUnit]   = useState('cm');
  const [result,  setResult]  = useState(null);

  const calc = () => {
    const s = parseFloat(steps);
    const h = parseFloat(height);
    if (!s || !h) return;
    const heightM   = hUnit === 'cm' ? h / 100 : h * 0.0254;
    const strideM   = 0.413 * heightM;
    const distanceM = s * strideM;
    setResult({
      meters: Math.round(distanceM),
      km:     Math.round(distanceM / 10) / 100,
      miles:  Math.round((distanceM / 1609.34) * 100) / 100,
      stride: Math.round(strideM * 100),
    });
  };

  return (
    <div className="converter-card">
      <h3>Steps → Distance</h3>
      <div className="converter-row">
        <input type="number" placeholder="Steps" value={steps} onChange={e => setSteps(e.target.value)} />
      </div>
      <div className="converter-row">
        <input type="number" placeholder="Your height" value={height} onChange={e => setHeight(e.target.value)} />
        <select value={hUnit} onChange={e => setHUnit(e.target.value)}>
          <option value="cm">cm</option>
          <option value="in">inches</option>
        </select>
      </div>
      <button className="calc-btn-primary" onClick={calc} style={{ marginTop: 4 }}>Convert</button>
      {result && (
        <div style={{ marginTop: 12 }}>
          <div className="converter-result">{result.meters} m</div>
          <div className="converter-result-label">{result.km} km · {result.miles} miles · stride {result.stride} cm</div>
        </div>
      )}
    </div>
  );
}

// ── Length ───────────────────────────────────────────────────
function LengthConverter() {
  const [value, setValue] = useState('');
  const [from,  setFrom]  = useState('km');
  const [to,    setTo]    = useState('miles');

  const UNITS = { km: 1000, m: 1, cm: 0.01, mm: 0.001, miles: 1609.34, yards: 0.9144, feet: 0.3048, inches: 0.0254 };
  const result = value ? Math.round((parseFloat(value) * UNITS[from] / UNITS[to]) * 10000) / 10000 : null;
  const units = Object.keys(UNITS);

  return (
    <div className="converter-card">
      <h3>Length & Distance</h3>
      <div className="converter-row">
        <input type="number" placeholder="Value" value={value} onChange={e => setValue(e.target.value)} />
        <select value={from} onChange={e => setFrom(e.target.value)}>
          {units.map(u => <option key={u}>{u}</option>)}
        </select>
      </div>
      <div style={{ color: 'var(--text-faint)', fontSize: 12, margin: '4px 0' }}>converts to</div>
      <div className="converter-row">
        <select value={to} onChange={e => setTo(e.target.value)} style={{ flex: 1 }}>
          {units.map(u => <option key={u}>{u}</option>)}
        </select>
      </div>
      {result !== null && (
        <div style={{ marginTop: 10 }}>
          <div className="converter-result">{result}</div>
          <div className="converter-result-label">{value} {from} = {result} {to}</div>
        </div>
      )}
    </div>
  );
}

// ── Weight ───────────────────────────────────────────────────
function WeightConverter() {
  const [value, setValue] = useState('');
  const [from,  setFrom]  = useState('kg');
  const [to,    setTo]    = useState('lbs');

  const UNITS = { kg: 1, lbs: 0.453592, grams: 0.001, oz: 0.0283495, stones: 6.35029 };
  const units = Object.keys(UNITS);
  const result = value ? Math.round((parseFloat(value) * UNITS[from] / UNITS[to]) * 1000) / 1000 : null;

  return (
    <div className="converter-card">
      <h3>Weight & Mass</h3>
      <div className="converter-row">
        <input type="number" placeholder="Value" value={value} onChange={e => setValue(e.target.value)} />
        <select value={from} onChange={e => setFrom(e.target.value)}>
          {units.map(u => <option key={u}>{u}</option>)}
        </select>
      </div>
      <div style={{ color: 'var(--text-faint)', fontSize: 12, margin: '4px 0' }}>converts to</div>
      <div className="converter-row">
        <select value={to} onChange={e => setTo(e.target.value)} style={{ flex: 1 }}>
          {units.map(u => <option key={u}>{u}</option>)}
        </select>
      </div>
      {result !== null && (
        <div style={{ marginTop: 10 }}>
          <div className="converter-result">{result}</div>
          <div className="converter-result-label">{value} {from} = {result} {to}</div>
        </div>
      )}
    </div>
  );
}

// ── Temperature ──────────────────────────────────────────────
function TemperatureConverter() {
  const [value, setValue] = useState('');
  const [from,  setFrom]  = useState('°C');
  const [to,    setTo]    = useState('°F');

  const convert = (v, f, t) => {
    let c = f === '°C' ? v : f === '°F' ? (v - 32) * 5 / 9 : v - 273.15;
    if (t === '°C') return Math.round(c * 100) / 100;
    if (t === '°F') return Math.round((c * 9/5 + 32) * 100) / 100;
    return Math.round((c + 273.15) * 100) / 100;
  };

  const units = ['°C', '°F', 'K'];
  const result = value ? convert(parseFloat(value), from, to) : null;

  return (
    <div className="converter-card">
      <h3>Temperature</h3>
      <div className="converter-row">
        <input type="number" placeholder="Value" value={value} onChange={e => setValue(e.target.value)} />
        <select value={from} onChange={e => setFrom(e.target.value)}>
          {units.map(u => <option key={u}>{u}</option>)}
        </select>
      </div>
      <div style={{ color: 'var(--text-faint)', fontSize: 12, margin: '4px 0' }}>converts to</div>
      <div className="converter-row">
        <select value={to} onChange={e => setTo(e.target.value)} style={{ flex: 1 }}>
          {units.map(u => <option key={u}>{u}</option>)}
        </select>
      </div>
      {result !== null && (
        <div style={{ marginTop: 10 }}>
          <div className="converter-result">{result} {to}</div>
          <div className="converter-result-label">{value} {from} = {result} {to}</div>
        </div>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────
export default function ConvertersPage() {
  return (
    <>
      <Helmet>
        <title>Fitness Converters — mph to km/h, Steps, Weight, Temperature | LiftAndBurn</title>
        <meta name="description" content="Free fitness converters — mph to km/h, steps to distance, weight, length, and temperature. Includes a treadmill speed reference table." />
      </Helmet>

      <div className="calc-page container">
        <div className="calc-breadcrumb">
          <Link to="/calculators">Calculators</Link> › Converters
        </div>

        <h1 className="calc-page__title">Converters</h1>

        <div className="calc-layout">
          <div className="calc-main">
            <div className="adsense-slot">AdSense · 728×90</div>

            {/* Speed converter first — most relevant for treadmill users */}
            <div style={{ marginBottom: 16 }}>
              <SpeedConverter />
            </div>

            <div className="converter-grid">
              <StepsToDistance />
              <LengthConverter />
              <WeightConverter />
              <TemperatureConverter />
            </div>

            <div className="adsense-slot">AdSense · 728×90</div>
            <div className="calc-instructions">
              <div className="calc-links">
                <Link to="/calculators/walk-run">Walk / Run Calculator</Link>
                <span>|</span>
                <Link to="/calculators/steps">Step Calculator</Link>
                <span>|</span>
                <Link to="/calculators">All Calculators</Link>
              </div>
            </div>
          </div>

          <aside className="calc-sidebar">
            <div className="adsense-slot" style={{ minHeight: 250 }}>AdSense · 300×250</div>
            <div className="calc-related">
              <h3>Metabolic Calculators</h3>
              <Link to="/calculators/walk-run">Walk / Run Metabolic</Link>
              <Link to="/calculators/steps">Step Metabolic</Link>
              <Link to="/calculators/calories">Calories Burned</Link>
            </div>
            <div className="calc-related">
              <h3>Strength Calculators</h3>
              <Link to="/calculators/one-rep-max">One Rep Max</Link>
              <Link to="/calculators/zone2">Zone 2 Heart Rate</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
