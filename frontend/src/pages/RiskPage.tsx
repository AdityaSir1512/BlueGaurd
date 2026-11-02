import { useState } from 'react';
import type { FormEvent } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

type RiskResult = {
  status: string;
  label: string;
  riskLevel: string | null;
  riskScore: number | null;
  inputs: { verifiedReports: number; historicalAssessments: number };
  methodology: string;
  limitations: string[];
};

export function RiskPage() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [result, setResult] = useState<RiskResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateRisk = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/risk?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`);
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Unable to calculate potential risk');
      setResult(body);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to calculate potential risk');
    }
  };

  return (
    <section style={{ maxWidth: '780px', margin: '2rem auto', color: '#ffffff' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Potential Pollution Risk</h2>
        <p style={{ color: '#b8e8ff' }}>This is an evidence-based prototype estimate, not a guaranteed prediction.</p>
      </div>
      <form onSubmit={calculateRisk} style={panelStyle}>
        <label style={labelStyle}>Latitude<input style={inputStyle} type="number" min="-90" max="90" step="any" value={latitude} onChange={(event) => setLatitude(event.target.value)} required /></label>
        <label style={labelStyle}>Longitude<input style={inputStyle} type="number" min="-180" max="180" step="any" value={longitude} onChange={(event) => setLongitude(event.target.value)} required /></label>
        <button style={buttonStyle} type="submit">Estimate potential risk</button>
      </form>
      {error && <p style={{ ...panelStyle, color: '#ffd28a' }}>{error}</p>}
      {result && <div style={{ ...panelStyle, marginTop: '1rem' }}>
        <h3>{result.label}: {result.riskLevel || 'Insufficient data'}</h3>
        {result.riskScore !== null && <p style={{ color: '#b8e8ff' }}>Prototype risk score: {result.riskScore}/100</p>}
        <p style={{ color: '#b8e8ff' }}>Verified reports: {result.inputs.verifiedReports}</p>
        <p style={{ color: '#b8e8ff' }}>Historical assessment areas: {result.inputs.historicalAssessments}</p>
        <p style={{ color: '#b8e8ff', lineHeight: 1.5 }}>{result.methodology}</p>
        <ul style={{ color: '#ffd28a' }}>{result.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul>
      </div>}
    </section>
  );
}

const panelStyle = { background: 'rgba(0, 25, 55, 0.85)', border: '1px solid rgba(0, 204, 255, 0.35)', borderRadius: '14px', padding: '1.25rem' };
const labelStyle = { display: 'grid', gap: '0.45rem', margin: '1rem 0', color: '#b8e8ff' };
const inputStyle = { width: '100%', boxSizing: 'border-box' as const, padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(0, 204, 255, 0.35)', background: 'rgba(0, 20, 45, 0.75)', color: '#ffffff', fontSize: '1rem' };
const buttonStyle = { width: '100%', padding: '0.85rem', border: 'none', borderRadius: '8px', background: '#00a9d8', color: '#ffffff', fontWeight: 700, cursor: 'pointer' };
