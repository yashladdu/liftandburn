import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './CalcPage.css';

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
    // Stride length ≈ 0.413 × height (m) for average adult
    const heightM    = hUnit === 'cm' ? h / 100 : h * 0.0254;
    const strideM    = 0.413 * heightM;
    const distanceM  = s * strideM;
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

  const UNITS = {
    km:     1000,
    m:      1,
    cm:     0.01,
    mm:     0.001,
    miles:  1609.34,
    yards:  0.9144,
    feet:   0.3048,
    inches: 0.0254,
  };

  const result = value
    ? Math.round((parseFloat(value) * UNITS[from] / UNITS[to]) * 10000) / 10000
    : null;

  const units = Object.keys(UNITS);

  return (
    <div className="converter-card">
      <h3>Length & Distance</h3>
      <div className="converter-row">
        <input type="number" placeholder="Value" value={value}
          onChange={e => setValue(e.target.value)} />
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

  const result = value
    ? Math.round((parseFloat(value) * UNITS[from] / UNITS[to]) * 1000) / 1000
    : null;

  return (
    <div className="converter-card">
      <h3>Weight & Mass</h3>
      <div className="converter-row">
        <input type="number" placeholder="Value" value={value}
          onChange={e => setValue(e.target.value)} />
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
    let celsius;
    if (f === '°C') celsius = v;
    else if (f === '°F') celsius = (v - 32) * 5 / 9;
    else celsius = v - 273.15;

    if (t === '°C') return Math.round(celsius * 100) / 100;
    if (t === '°F') return Math.round((celsius * 9/5 + 32) * 100) / 100;
    return Math.round((celsius + 273.15) * 100) / 100;
  };

  const units = ['°C', '°F', 'K'];
  const result = value ? convert(parseFloat(value), from, to) : null;

  return (
    <div className="converter-card">
      <h3>Temperature</h3>
      <div className="converter-row">
        <input type="number" placeholder="Value" value={value}
          onChange={e => setValue(e.target.value)} />
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
        <title>Fitness Converters — Steps, Length, Weight, Temperature | LiftAndBurn</title>
        <meta name="description" content="Free fitness unit converters — convert steps to distance, length, weight, and temperature. Built for athletes and gym-goers." />
      </Helmet>

      <div className="calc-page container">
        <div className="calc-breadcrumb">
          <Link to="/calculators">Calculators</Link> › Converters
        </div>

        <h1 className="calc-page__title">Converters</h1>

        <div className="calc-layout">
          <div className="calc-main">
            <div className="adsense-slot">AdSense · 728×90</div>
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
