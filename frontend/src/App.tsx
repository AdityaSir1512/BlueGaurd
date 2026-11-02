import { useState, useEffect } from 'react';
import { BlueFusionLogo } from './components/BlueFusionLogo';
import { BiodiversityPage } from './pages/BiodiversityPage';
import { ReportPollutionPage } from './pages/ReportPollutionPage';
import { PollutionMapPage } from './pages/PollutionMapPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AdminPage } from './pages/AdminPage';
import { ActionPage } from './pages/ActionPage';
import { HistoricalDataPage } from './pages/HistoricalDataPage';
import { RiskPage } from './pages/RiskPage';
import { DataUpload } from './components/DataUpload';

interface DataRecord {
  [key: string]: string | number;
}

function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const [animatedStats, setAnimatedStats] = useState({
    temperature: 0,
    species: 0,
    biodiversity: 0,
    dataPoints: 0
  });
  const [uploadedDatasets, setUploadedDatasets] = useState<{[key: string]: DataRecord[]}>({});

  const handleDataUploaded = (data: DataRecord[], datasetType: string) => {
    // Store the uploaded data
    setUploadedDatasets(prev => ({
      ...prev,
      [datasetType]: data
    }));
    
    // Switch to the appropriate section
    setActiveSection(datasetType);
    
    // Show success message or update stats based on dataset
    if (datasetType === 'biodiversity') {
      // Update biodiversity stats immediately
      const uniqueFamilies = [...new Set(data.map((record: DataRecord) => record.family).filter(Boolean))];
      setAnimatedStats(prev => ({
        ...prev,
        species: uniqueFamilies.length,
        dataPoints: data.length
      }));
    }
  };

  // Animate numbers on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats({
        temperature: 18.5,
        species: 2847,
        biodiversity: 7.8,
        dataPoints: 1200000
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const navItems = [
    { id: 'overview', name: 'Overview', icon: '🏠' },
    { id: 'report', name: 'Report Pollution', icon: '📍' },
    { id: 'map', name: 'Pollution Map', icon: '🗺️' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'admin', name: 'Admin Review', icon: '🛡️' },
    { id: 'action', name: 'Awareness', icon: '🌱' },
    { id: 'historical', name: 'Historical Data', icon: '🗂️' },
    { id: 'risk', name: 'Potential Risk', icon: '⚠️' },
    { id: 'oceanography', name: 'Oceanography', icon: '🌊' },
    { id: 'fisheries', name: 'Fisheries', icon: '🐟' },
    { id: 'biodiversity', name: 'Biodiversity', icon: '🐙' }
  ];

  // Ocean wave keyframes (will be applied as CSS-in-JS)
  const waveStyles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      margin: 0;
      padding: 0;
      overflow-x: hidden;
    }
    
    @keyframes wave1 {
      0% { transform: translateX(0) translateY(0) rotate(0deg); }
      50% { transform: translateX(-25px) translateY(-10px) rotate(180deg); }
      100% { transform: translateX(0) translateY(0) rotate(360deg); }
    }
    @keyframes wave2 {
      0% { transform: translateX(0) translateY(0) rotate(0deg); }
      50% { transform: translateX(25px) translateY(10px) rotate(180deg); }
      100% { transform: translateX(0) translateY(0) rotate(360deg); }
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
      100% { transform: translateY(0px); }
    }
    @keyframes pulse {
      0% { opacity: 0.4; }
      50% { opacity: 1; }
      100% { opacity: 0.4; }
    }
    @keyframes bubbles {
      0% { transform: translateY(100px) scale(0); opacity: 0; }
      50% { opacity: 1; }
      100% { transform: translateY(-100px) scale(1); opacity: 0; }
    }
  `;

  return (
    <>
      <style>{waveStyles}</style>
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(180deg, #001122 0%, #003366 25%, #004488 50%, #0066aa 75%, #0088cc 100%)',
        position: 'relative',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        width: '100vw',
        boxSizing: 'border-box'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0
        }}>
          {/* Floating Bubbles */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                backgroundColor: 'rgba(135, 206, 250, 0.3)',
                borderRadius: '50%',
                animation: `bubbles ${Math.random() * 6 + 4}s infinite linear`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
          
          {/* Wave Patterns */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '200%',
            height: '100px',
            background: 'linear-gradient(90deg, transparent, rgba(0, 234, 255, 0.1), transparent)',
            animation: 'wave1 8s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: 0,
            width: '200%',
            height: '80px',
            background: 'linear-gradient(90deg, transparent, rgba(0, 150, 255, 0.1), transparent)',
            animation: 'wave2 6s ease-in-out infinite'
          }} />
        </div>

        {/* Header */}
        <header style={{ 
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
          padding: '1.5rem 1rem',
          borderBottom: '3px solid #00ccff',
          boxShadow: '0 8px 32px rgba(0, 204, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          zIndex: 10,
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ marginRight: '1.5rem', cursor: 'pointer' }} onClick={() => setActiveSection('overview')} title="Go to Overview/Home">
                <BlueFusionLogo size={64} />
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '2.2rem', 
                  color: '#ffffff', 
                  margin: 0,
                  fontWeight: 'bold',
                  textShadow: '0 0 20px rgba(0, 204, 255, 0.5)',
                  background: 'linear-gradient(45deg, #ffffff, #00ccff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  BlueGuard
                </h1>
                <p style={{ 
                  fontSize: '1rem', 
                  color: '#87ceeb', 
                  margin: 0
                }}>
                  🐠 Marine Science & Ocean Monitoring Platform 🐋
                </p>
              </div>
            </div>
            
            <nav style={{ display: 'flex', gap: '0.5rem' }}>
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  style={{
                    background: activeSection === item.id 
                      ? 'linear-gradient(135deg, #00ccff 0%, #0088cc 100%)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(0, 204, 255, 0.3)',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: activeSection === item.id ? 'translateY(-2px)' : 'translateY(0)',
                    boxShadow: activeSection === item.id 
                      ? '0 8px 16px rgba(0, 204, 255, 0.4)' 
                      : '0 2px 4px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  {item.icon} {item.name}
                </button>
              ))}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ 
          padding: '1rem 0.5rem', 
          position: 'relative', 
          zIndex: 5,
          width: '100%',
          boxSizing: 'border-box',
          margin: 0
        }}>
          {activeSection === 'overview' && (
            <div style={{ 
              width: '100%', 
              maxWidth: 'none',
              padding: '0 0.5rem',
              boxSizing: 'border-box'
            }}>
              <div style={{
                textAlign: 'center',
                marginBottom: '2rem',
                animation: 'float 4s ease-in-out infinite'
              }}>
                <h2 style={{ 
                  color: '#ffffff', 
                  fontSize: '3rem', 
                  marginBottom: '1rem',
                  textShadow: '0 0 30px rgba(0, 204, 255, 0.6)',
                  background: 'linear-gradient(45deg, #ffffff, #00ccff, #87ceeb)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  🌊 Ocean Monitoring Dashboard 🌊
                </h2>
                <p style={{ 
                  color: '#87ceeb', 
                  fontSize: '1.3rem',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                }}>
                  Real-time marine ecosystem monitoring and data analysis
                </p>
              </div>
              
              {/* Animated Stats Cards */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                gap: '0.8rem',
                marginBottom: '1.5rem',
                width: '100%'
              }}>
                {[
                  { 
                    icon: '🌊', 
                    title: 'Ocean Temperature', 
                    value: `${animatedStats.temperature.toFixed(1)}°C`,
                    subtitle: 'Average surface temperature',
                    color: '#00ccff',
                    bgGradient: 'linear-gradient(135deg, rgba(0, 204, 255, 0.2) 0%, rgba(0, 150, 255, 0.1) 100%)'
                  },
                  { 
                    icon: '🐟', 
                    title: 'Fish Species', 
                    value: animatedStats.species.toLocaleString(),
                    subtitle: 'Species monitored',
                    color: '#00ff88',
                    bgGradient: 'linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 200, 100, 0.1) 100%)'
                  },
                  { 
                    icon: '🐙', 
                    title: 'Biodiversity Index', 
                    value: `${animatedStats.biodiversity.toFixed(1)}/10`,
                    subtitle: 'Marine ecosystem health',
                    color: '#ff6b35',
                    bgGradient: 'linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 140, 0, 0.1) 100%)'
                  },
                  { 
                    icon: '📊', 
                    title: 'Data Points', 
                    value: `${(animatedStats.dataPoints / 1000000).toFixed(1)}M`,
                    subtitle: 'Collected this month',
                    color: '#8b5cf6',
                    bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(147, 51, 234, 0.1) 100%)'
                  }
                ].map((stat, index) => (
                  <div
                    key={index}
                    style={{
                      background: stat.bgGradient,
                      padding: '2rem',
                      borderRadius: '20px',
                      border: `2px solid ${stat.color}40`,
                      boxShadow: `0 8px 32px ${stat.color}20`,
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      animation: `float ${3 + index * 0.5}s ease-in-out infinite`
                    }}
                  >
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>
                      {stat.icon}
                    </div>
                    <h3 style={{ 
                      color: stat.color, 
                      fontSize: '1.3rem', 
                      marginBottom: '1rem',
                      textShadow: `0 0 10px ${stat.color}60`
                    }}>
                      {stat.title}
                    </h3>
                    <p style={{ 
                      color: '#ffffff', 
                      fontSize: '2.5rem', 
                      fontWeight: 'bold', 
                      margin: '0 0 0.5rem 0',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                    }}>
                      {stat.value}
                    </p>
                    <p style={{ 
                      color: '#87ceeb', 
                      fontSize: '1rem', 
                      margin: 0
                    }}>
                      {stat.subtitle}
                    </p>
                  </div>
                ))}
              </div>

              {/* Marine Life Section */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(0, 50, 100, 0.8) 0%, rgba(0, 30, 60, 0.8) 100%)',
                padding: '2rem 1rem',
                borderRadius: '16px',
                border: '2px solid rgba(0, 204, 255, 0.3)',
                boxShadow: '0 16px 48px rgba(0, 204, 255, 0.2)',
                backdropFilter: 'blur(15px)',
                marginBottom: '1.5rem',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <h3 style={{ 
                  color: '#ffffff', 
                  fontSize: '2rem', 
                  marginBottom: '2rem',
                  textAlign: 'center',
                  textShadow: '0 0 20px rgba(0, 204, 255, 0.8)'
                }}>
                  🐠 Marine Ecosystem Overview 🐋
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                  gap: '1rem',
                  width: '100%'
                }}>
                  {[
                    { icon: '🌊', title: 'Ocean Currents', desc: 'Real-time current mapping and flow analysis', emoji: '🌀' },
                    { icon: '🐟', title: 'Fish Migration', desc: 'Track seasonal migration patterns', emoji: '➡️' },
                    { icon: '🪸', title: 'Coral Reefs', desc: 'Reef health monitoring and conservation', emoji: '🌺' },
                    { icon: '🐋', title: 'Marine Mammals', desc: 'Whale and dolphin population tracking', emoji: '📍' },
                    { icon: '🔬', title: 'Water Quality', desc: 'pH, salinity, and pollution monitoring', emoji: '⚗️' },
                    { icon: '📊', title: 'Data Analytics', desc: 'AI-powered marine insights', emoji: '🤖' }
                  ].map((item, index) => (
                    <div 
                      key={index} 
                      style={{
                        padding: '1.5rem',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                        borderRadius: '16px',
                        border: '1px solid rgba(0, 204, 255, 0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)',
                        animation: `pulse ${2 + index * 0.3}s ease-in-out infinite`
                      }}
                    >
                      <div style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>
                        {item.icon} {item.emoji}
                      </div>
                      <h4 style={{ 
                        color: '#00ccff', 
                        fontSize: '1.1rem', 
                        margin: '0 0 0.8rem 0',
                        textShadow: '0 0 10px rgba(0, 204, 255, 0.6)'
                      }}>
                        {item.title}
                      </h4>
                      <p style={{ 
                        color: '#87ceeb', 
                        fontSize: '0.9rem', 
                        margin: 0,
                        lineHeight: '1.4'
                      }}>
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dataset Upload Section */}
              <DataUpload onDataUploaded={handleDataUploaded} />
            </div>
          )}

          {/* Other sections with enhanced styling */}
          {activeSection !== 'overview' && (
            activeSection === 'report' ? (
              <ReportPollutionPage />
            ) : activeSection === 'map' ? (
              <PollutionMapPage />
            ) : activeSection === 'analytics' ? (
              <AnalyticsPage />
            ) : activeSection === 'admin' ? (
              <AdminPage />
            ) : activeSection === 'action' ? (
              <ActionPage />
            ) : activeSection === 'historical' ? (
              <HistoricalDataPage />
            ) : activeSection === 'risk' ? (
              <RiskPage />
            ) : activeSection === 'biodiversity' ? (
              <div style={{ width: '100%', maxWidth: 'none' }}>
                <BiodiversityPage uploadedData={uploadedDatasets.biodiversity} />
              </div>
            ) : (
              <div style={{ width: '100%', maxWidth: 'none' }}>
                <h2 style={{ 
                  color: '#ffffff', 
                  fontSize: '2.5rem', 
                  marginBottom: '2rem',
                  textAlign: 'center',
                  textShadow: '0 0 20px rgba(0, 204, 255, 0.6)'
                }}>
                  {navItems.find(item => item.id === activeSection)?.icon} {navItems.find(item => item.id === activeSection)?.name}
                </h2>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(0, 50, 100, 0.6) 0%, rgba(0, 30, 60, 0.6) 100%)',
                  padding: '3rem',
                  borderRadius: '20px',
                  border: '2px solid rgba(0, 204, 255, 0.3)',
                  textAlign: 'center',
                  backdropFilter: 'blur(15px)',
                  animation: 'float 4s ease-in-out infinite'
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                    {activeSection === 'oceanography' && '🌊'}
                    {activeSection === 'fisheries' && '🐟'}
                  </div>
                  <p style={{ 
                    color: '#87ceeb', 
                    fontSize: '1.4rem',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                  }}>
                    {activeSection === 'oceanography' && 'Advanced oceanographic data visualization and analysis tools will be integrated here with your dataset...'}
                    {activeSection === 'fisheries' && 'Comprehensive fisheries management and population tracking systems await your data integration...'}
                  </p>
                  <div style={{
                    marginTop: '2rem',
                    padding: '1.5rem',
                    background: 'rgba(0, 204, 255, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 204, 255, 0.3)'
                  }}>
                    <p style={{ color: '#00ccff', fontSize: '1rem', margin: 0 }}>
                      🚀 Ready to integrate your marine dataset for real-time visualization and analysis
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </main>
      </div>
    </>
  );
}

export default App;