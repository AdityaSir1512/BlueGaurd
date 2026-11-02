import { useState } from 'react';
import type { FormEvent } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const TOKEN_KEY = 'blueguard_access_token';

interface AuthResponse {
  token: string;
  user: {
    email: string;
    role: string;
  };
}

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box' as const,
  padding: '0.8rem',
  borderRadius: '8px',
  border: '1px solid rgba(0, 204, 255, 0.35)',
  background: 'rgba(0, 20, 45, 0.75)',
  color: '#ffffff',
  fontSize: '1rem'
};

export function ReportPollutionPage() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [pollutionType, setPollutionType] = useState('PLASTIC_WASTE');
  const [severity, setSeverity] = useState('MEDIUM');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authenticate = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);

    try {
      const response = await fetch(`${API_URL}/api/auth/${authMode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Authentication failed');
      const authResult = result as AuthResponse;
      localStorage.setItem(TOKEN_KEY, authResult.token);
      setToken(authResult.token);
      setMessage(`Signed in as ${authResult.user.email}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  const submitReport = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    try {
      let reportImageUrl = imageUrl.trim();
      if (imageFile) {
        const uploadBody = new FormData();
        uploadBody.append('image', imageFile);
        const uploadResponse = await fetch(`${API_URL}/api/uploads`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: uploadBody
        });
        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(uploadResult.error || 'Image upload failed');
        reportImageUrl = `${API_URL}${uploadResult.imageUrl}`;
      }
      if (!reportImageUrl) throw new Error('Choose an image or provide an image URL');

      const response = await fetch(`${API_URL}/api/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          imageUrl: reportImageUrl,
          pollutionType,
          userConfirmedType: pollutionType,
          severity,
          description,
          location: {
            type: 'Point',
            coordinates: [Number(longitude), Number(latitude)]
          }
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Report submission failed');
      setMessage('Report submitted and marked Pending for verification.');
      setImageFile(null);
      setImageUrl('');
      setDescription('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Report submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section style={{ maxWidth: '760px', margin: '2rem auto', color: '#ffffff' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Report Marine Pollution</h2>
        <p style={{ color: '#b8e8ff', fontSize: '1.1rem' }}>
          Submit a location-based report for review. BlueGuard does not claim AI classification until a real model is connected.
        </p>
      </div>

      {!token ? (
        <form onSubmit={authenticate} style={{ ...panelStyle, marginBottom: '1rem' }}>
          <h3>{authMode === 'login' ? 'Sign in to report' : 'Create a BlueGuard account'}</h3>
          <label style={labelStyle}>
            Email
            <input style={inputStyle} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label style={labelStyle}>
            Password
            <input style={inputStyle} type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required />
          </label>
          <button style={primaryButtonStyle} type="submit">
            {authMode === 'login' ? 'Sign in' : 'Register'}
          </button>
          <button type="button" style={secondaryButtonStyle} onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
            Switch to {authMode === 'login' ? 'registration' : 'login'}
          </button>
        </form>
      ) : (
        <form onSubmit={submitReport} style={panelStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
            <h3>Pollution evidence</h3>
            <button type="button" style={secondaryButtonStyle} onClick={() => { localStorage.removeItem(TOKEN_KEY); setToken(''); }}>
              Sign out
            </button>
          </div>
          <p style={{ color: '#ffd28a' }}>Local development storage is active. Cloud storage is not configured yet.</p>
          <label style={labelStyle}>
            Upload image
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
          </label>
          <label style={labelStyle}>
            Or image URL for development
            <input style={inputStyle} type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} />
          </label>
          <label style={labelStyle}>
            Pollution type
            <select style={inputStyle} value={pollutionType} onChange={(event) => setPollutionType(event.target.value)}>
              <option value="PLASTIC_WASTE">Plastic Waste</option>
              <option value="FISHING_WASTE">Fishing Waste</option>
              <option value="OIL_CHEMICAL_LIKE">Oil/Chemical-like Pollution</option>
              <option value="GENERAL_WASTE">General Waste</option>
              <option value="OTHER_UNKNOWN">Other/Unknown</option>
            </select>
          </label>
          <label style={labelStyle}>
            Severity
            <select style={inputStyle} value={severity} onChange={(event) => setSeverity(event.target.value)}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </label>
          <label style={labelStyle}>
            Description
            <textarea style={{ ...inputStyle, minHeight: '110px', resize: 'vertical' }} value={description} onChange={(event) => setDescription(event.target.value)} maxLength={2000} />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <label style={labelStyle}>
              Latitude
              <input style={inputStyle} type="number" min="-90" max="90" step="any" value={latitude} onChange={(event) => setLatitude(event.target.value)} required />
            </label>
            <label style={labelStyle}>
              Longitude
              <input style={inputStyle} type="number" min="-180" max="180" step="any" value={longitude} onChange={(event) => setLongitude(event.target.value)} required />
            </label>
          </div>
          <button style={primaryButtonStyle} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit report'}
          </button>
        </form>
      )}

      {message && <p style={{ ...panelStyle, color: '#b8e8ff', marginTop: '1rem' }}>{message}</p>}
    </section>
  );
}

const panelStyle = {
  background: 'rgba(0, 25, 55, 0.85)',
  border: '1px solid rgba(0, 204, 255, 0.35)',
  borderRadius: '14px',
  padding: '1.5rem',
  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)'
};

const labelStyle = {
  display: 'grid',
  gap: '0.45rem',
  margin: '1rem 0',
  color: '#b8e8ff'
};

const primaryButtonStyle = {
  width: '100%',
  marginTop: '1rem',
  padding: '0.85rem 1rem',
  border: 'none',
  borderRadius: '8px',
  background: '#00a9d8',
  color: '#ffffff',
  fontWeight: 700,
  cursor: 'pointer'
};

const secondaryButtonStyle = {
  marginTop: '0.75rem',
  padding: '0.7rem 1rem',
  border: '1px solid rgba(184, 232, 255, 0.5)',
  borderRadius: '8px',
  background: 'transparent',
  color: '#b8e8ff',
  cursor: 'pointer'
};
