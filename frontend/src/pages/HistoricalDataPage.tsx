import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

type Assessment = {
  assessmentClass: string;
  gridCode: string;
  areaKm2: number;
  originalAreaKm2: number;
  source: string;
};

type HistoricalResponse = {
  source: string;
  dataset: string;
  dataType: string;
  records: Assessment[];
};

export function HistoricalDataPage() {
  const [data, setData] = useState<HistoricalResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/historical-assessments?limit=100`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Unable to load historical data');
        return result as HistoricalResponse;
      })
      .then(setData)
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Unable to load historical data'));
  }, []);

  const classCounts = data?.records.reduce<Record<string, number>>((counts, record) => {
    counts[record.assessmentClass] = (counts[record.assessmentClass] || 0) + 1;
    return counts;
  }, {}) || {};

  return (
    <section style={{ maxWidth: '1100px', margin: '2rem auto', color: '#ffffff' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Historical Marine-Litter Assessment</h2>
        <p style={{ color: '#b8e8ff' }}>External EEA assessment areas from 2010–2021. These are not BlueGuard user reports.</p>
      </div>
      {error && <p style={messageStyle}>{error}</p>}
      {data && (
        <>
          <div style={cardStyle}>
            <p style={{ color: '#b8e8ff', margin: 0 }}>Source</p>
            <strong>{data.source}</strong>
            <p style={{ color: '#b8e8ff', margin: '0.75rem 0 0' }}>{data.dataset}</p>
            <small style={{ color: '#ffd28a' }}>{data.dataType}</small>
          </div>
          <div style={gridStyle}>
            {Object.entries(classCounts).map(([assessmentClass, count]) => (
              <div style={cardStyle} key={assessmentClass}><strong>{assessmentClass}</strong><p style={{ color: '#b8e8ff' }}>{count} sampled areas</p></div>
            ))}
          </div>
          <div style={{ ...cardStyle, marginTop: '1rem', overflowX: 'auto' }}>
            <h3>Assessment area sample</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th style={cellStyle}>Class</th><th style={cellStyle}>Grid code</th><th style={cellStyle}>Area km²</th></tr></thead>
              <tbody>{data.records.slice(0, 20).map((record) => <tr key={record.gridCode}><td style={cellStyle}>{record.assessmentClass}</td><td style={cellStyle}>{record.gridCode}</td><td style={cellStyle}>{record.areaKm2.toFixed(2)}</td></tr>)}</tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

const cardStyle = { background: 'rgba(0, 25, 55, 0.85)', border: '1px solid rgba(0, 204, 255, 0.35)', borderRadius: '14px', padding: '1.25rem' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '1rem' };
const messageStyle = { ...cardStyle, color: '#ffd28a' };
const cellStyle = { textAlign: 'left' as const, padding: '0.65rem', borderBottom: '1px solid rgba(184, 232, 255, 0.2)', color: '#b8e8ff' };
