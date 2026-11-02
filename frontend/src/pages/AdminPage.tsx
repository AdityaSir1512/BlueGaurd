import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const TOKEN_KEY = 'blueguard_access_token';

type AdminReport = {
  _id: string;
  pollutionType: string;
  userConfirmedType: string;
  severity: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'RESOLVED';
  description?: string;
  imageUrl: string;
  createdAt: string;
  location: { coordinates: [number, number] };
};

export function AdminPage() {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadReports = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setError('Sign in with an ADMIN account to review reports.');
      return;
    }
    fetch(`${API_URL}/api/admin/reports?status=PENDING`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Unable to load admin reports');
        return result as AdminReport[];
      })
      .then(setReports)
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Unable to load admin reports'));
  };

  useEffect(loadReports, []);

  const moderate = async (reportId: string, action: 'verify' | 'reject') => {
    const token = localStorage.getItem(TOKEN_KEY);
    const response = await fetch(`${API_URL}/api/admin/reports/${reportId}/${action}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: `Reviewed in BlueGuard admin dashboard: ${action}` })
    });
    if (!response.ok) {
      const result = await response.json();
      setError(result.error || 'Moderation failed');
      return;
    }
    setReports((currentReports) => currentReports.filter((report) => report._id !== reportId));
  };

  return (
    <section style={{ maxWidth: '1000px', margin: '2rem auto', color: '#ffffff' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Admin Review</h2>
        <p style={{ color: '#b8e8ff' }}>Review user reports before they appear on the public map and analytics.</p>
      </div>
      {error && <p style={messageStyle}>{error}</p>}
      {reports.length === 0 && !error && <p style={messageStyle}>No pending reports require review.</p>}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {reports.map((report) => (
          <article key={report._id} style={cardStyle}>
            <div>
              <h3>{report.userConfirmedType || report.pollutionType}</h3>
              <p style={{ color: '#b8e8ff' }}>Severity: {report.severity}</p>
              <p style={{ color: '#b8e8ff' }}>{report.description || 'No description provided.'}</p>
              <p style={{ color: '#b8e8ff' }}>Coordinates: {report.location.coordinates[1]}, {report.location.coordinates[0]}</p>
              <a href={report.imageUrl} target="_blank" rel="noreferrer" style={{ color: '#7fe7ff' }}>Inspect evidence image</a>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button style={verifyButtonStyle} onClick={() => moderate(report._id, 'verify')}>Verify</button>
              <button style={rejectButtonStyle} onClick={() => moderate(report._id, 'reject')}>Reject</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const cardStyle = { display: 'grid', gap: '1rem', background: 'rgba(0, 25, 55, 0.85)', border: '1px solid rgba(0, 204, 255, 0.35)', borderRadius: '14px', padding: '1.25rem' };
const messageStyle = { background: 'rgba(0, 25, 55, 0.85)', border: '1px solid rgba(255, 210, 138, 0.45)', borderRadius: '10px', padding: '1rem', color: '#ffd28a' };
const verifyButtonStyle = { border: 'none', borderRadius: '8px', padding: '0.75rem 1.25rem', background: '#18a878', color: '#ffffff', cursor: 'pointer' };
const rejectButtonStyle = { border: 'none', borderRadius: '8px', padding: '0.75rem 1.25rem', background: '#c34b5d', color: '#ffffff', cursor: 'pointer' };
