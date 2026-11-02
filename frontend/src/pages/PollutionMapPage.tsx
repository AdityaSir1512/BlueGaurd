import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

type Report = {
  _id: string;
  pollutionType: string;
  userConfirmedType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'VERIFIED' | 'RESOLVED';
  location: { type: 'Point'; coordinates: [number, number] };
  createdAt: string;
};

export function PollutionMapPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/reports/map`)
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load verified pollution reports');
        return response.json() as Promise<Report[]>;
      })
      .then(setReports)
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Unable to load map data'));
  }, []);

  return (
    <section style={{ maxWidth: '1100px', margin: '2rem auto', color: '#ffffff' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Verified Pollution Map</h2>
        <p style={{ color: '#b8e8ff', fontSize: '1.05rem' }}>
          Only verified and resolved BlueGuard reports appear here. Historical and biodiversity data are separate layers.
        </p>
      </div>
      {error && <p style={messageStyle}>{error}</p>}
      {!error && reports.length === 0 && <p style={messageStyle}>No verified pollution reports are available yet.</p>}
      <div style={{ height: '520px', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(0, 204, 255, 0.35)' }}>
        <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {reports.map((report) => {
            const [longitude, latitude] = report.location.coordinates;
            const position: LatLngExpression = [latitude, longitude];
            return (
              <Marker key={report._id} position={position}>
                <Popup>
                  <strong>{report.userConfirmedType || report.pollutionType}</strong>
                  <br />Severity: {report.severity}
                  <br />Status: {report.status}
                  <br />Reported: {new Date(report.createdAt).toLocaleDateString()}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </section>
  );
}

const messageStyle = {
  padding: '1rem',
  borderRadius: '10px',
  background: 'rgba(0, 25, 55, 0.85)',
  border: '1px solid rgba(0, 204, 255, 0.35)',
  color: '#b8e8ff'
};
