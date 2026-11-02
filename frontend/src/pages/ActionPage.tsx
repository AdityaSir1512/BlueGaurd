import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

type AwarenessItem = { id: string; title: string; summary: string; source: string; sourceUrl: string };

type ContentResponse = { items: AwarenessItem[] };

type ConservationResponse = { activities: { id: string; title: string }[]; message: string };

export function ActionPage() {
  const [awareness, setAwareness] = useState<ContentResponse | null>(null);
  const [conservation, setConservation] = useState<ConservationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/awareness`).then((response) => response.json()),
      fetch(`${API_URL}/api/conservation`).then((response) => response.json())
    ])
      .then(([awarenessResult, conservationResult]) => {
        setAwareness(awarenessResult);
        setConservation(conservationResult);
      })
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Unable to load content'));
  }, []);

  return (
    <section style={{ maxWidth: '1000px', margin: '2rem auto', color: '#ffffff' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Awareness and Conservation</h2>
        <p style={{ color: '#b8e8ff' }}>Learn from cited sources and participate only in verified activities.</p>
      </div>
      {error && <p style={messageStyle}>{error}</p>}
      <div style={gridStyle}>
        {awareness?.items.map((item) => (
          <article style={cardStyle} key={item.id}>
            <h3>{item.title}</h3>
            <p style={{ color: '#b8e8ff', lineHeight: 1.5 }}>{item.summary}</p>
            <a href={item.sourceUrl} target="_blank" rel="noreferrer" style={{ color: '#7fe7ff' }}>{item.source}</a>
          </article>
        ))}
      </div>
      <div style={{ ...cardStyle, marginTop: '1rem' }}>
        <h3>Conservation activities</h3>
        <p style={{ color: '#ffd28a' }}>{conservation?.message || 'Loading verified activities...'}</p>
      </div>
    </section>
  );
}

const cardStyle = { background: 'rgba(0, 25, 55, 0.85)', border: '1px solid rgba(0, 204, 255, 0.35)', borderRadius: '14px', padding: '1.25rem' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' };
const messageStyle = { ...cardStyle, color: '#ffd28a' };
