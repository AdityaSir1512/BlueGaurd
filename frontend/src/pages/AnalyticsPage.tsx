import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

type Statistics = {
  source: string;
  totalVerifiedReports: number;
  byType: { _id: string; count: number }[];
  bySeverity: { _id: string; count: number }[];
  byStatus: { _id: string; count: number }[];
  byMonth: { _id: string; count: number }[];
};

type HotspotResponse = {
  minimumReports: number;
  hotspots: { latitude: number; longitude: number; reportCount: number; level: string }[];
};

export function AnalyticsPage() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [hotspots, setHotspots] = useState<HotspotResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/statistics`).then((response) => response.json()),
      fetch(`${API_URL}/api/hotspots`).then((response) => response.json())
    ])
      .then(([statisticsResult, hotspotResult]) => {
        setStatistics(statisticsResult);
        setHotspots(hotspotResult);
      })
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Unable to load analytics'));
  }, []);

  return (
    <section style={{ maxWidth: '1100px', margin: '2rem auto', color: '#ffffff' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Pollution Analytics</h2>
        <p style={{ color: '#b8e8ff', fontSize: '1.05rem' }}>
          Values come from verified and resolved BlueGuard reports only.
        </p>
      </div>
      {error && <p style={messageStyle}>{error}</p>}
      {statistics && (
        <>
          <div style={cardGridStyle}>
            <Metric label="Verified reports" value={statistics.totalVerifiedReports} />
            <Metric label="Pollution types" value={statistics.byType.length} />
            <Metric label="Months with data" value={statistics.byMonth.length} />
            <Metric label="Hotspots" value={hotspots?.hotspots.length ?? 0} />
          </div>
          <div style={gridStyle}>
            <Breakdown title="By pollution type" items={statistics.byType} />
            <Breakdown title="By severity" items={statistics.bySeverity} />
            <Breakdown title="By month" items={statistics.byMonth} />
            <div style={panelStyle}>
              <h3>Hotspot methodology</h3>
              <p style={{ color: '#b8e8ff', lineHeight: 1.5 }}>
                Reports are grouped into 0.1-degree grid cells. A cell needs at least {hotspots?.minimumReports ?? 3} verified or resolved reports before it is listed as a hotspot.
              </p>
              {hotspots?.hotspots.length === 0 && <p style={{ color: '#ffd28a' }}>Insufficient verified data for a hotspot estimate.</p>}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div style={panelStyle}><p style={{ color: '#b8e8ff', margin: 0 }}>{label}</p><strong style={{ fontSize: '2rem' }}>{value}</strong></div>;
}

function Breakdown({ title, items }: { title: string; items: { _id: string; count: number }[] }) {
  return (
    <div style={panelStyle}>
      <h3>{title}</h3>
      {items.length === 0 && <p style={{ color: '#ffd28a' }}>No verified data yet.</p>}
      {items.map((item) => <p key={item._id} style={{ display: 'flex', justifyContent: 'space-between', color: '#b8e8ff' }}><span>{item._id}</span><strong>{item.count}</strong></p>)}
    </div>
  );
}

const panelStyle = {
  background: 'rgba(0, 25, 55, 0.85)',
  border: '1px solid rgba(0, 204, 255, 0.35)',
  borderRadius: '14px',
  padding: '1.25rem'
};

const cardGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' };
const messageStyle = { ...panelStyle, color: '#ffd28a' };
