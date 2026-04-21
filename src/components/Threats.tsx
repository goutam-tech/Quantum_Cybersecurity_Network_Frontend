import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { api } from '../api';

export function Threats() {
  const [threatsData, setThreatsData] = useState<any>(null);
  const [drillLevel, setDrillLevel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const data = await api.getThreats();
        
        let results = [];
        let counts = { attack: 0, suspicious: 0, normal: 0 };
        let timeline = { hours: [], attacks: [], suspicious: [] };

        if (Array.isArray(data)) {
          results = data;
        } else if (data && Array.isArray(data.records)) {
          results = data.records;
          if (data.counts) counts = { ...counts, ...data.counts };
          if (data.timeline) timeline = { ...timeline, ...data.timeline };
        } else if (data && Array.isArray(data.results)) {
          results = data.results;
          if (data.counts) counts = { ...counts, ...data.counts };
          if (data.timeline) timeline = { ...timeline, ...data.timeline };
        } else if (data && Array.isArray(data.threats)) {
          results = data.threats;
        }

        const processedResults = (results || []).map((r: any) => ({
          ip: r.ipAddress || r.ip || '0.0.0.0',
          level: (r.threatLevel || r.level || 'normal').toLowerCase(),
          confidence: r.confidence || 0
        }));

        // Recalculate counts if they are all zero or missing
        if (counts.attack === 0 && counts.suspicious === 0 && counts.normal === 0) {
          processedResults.forEach((r: any) => {
            if (r.level === 'attack') counts.attack++;
            else if (r.level === 'suspicious') counts.suspicious++;
            else counts.normal++;
          });
        }

        setThreatsData({
          results: processedResults,
          counts,
          timeline
        });
      } catch (e: any) {
        setError(e.message || 'Threat intelligence service is offline');
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const drillDownData = threatsData?.results?.filter((r: any) => r.level === drillLevel) || [];

  return (
    <div className="page active">
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 700 }}>Security Sync Error</div>
              <div style={{ fontSize: '13px', opacity: 0.8 }}>{error}</div>
            </div>
          </div>
          <button onClick={() => window.location.reload()} style={{ background: '#b91c1c', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Retry</button>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Threat Drill-Down</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { id: 'attack', label: 'Attack', count: threatsData?.counts?.attack || 0, color: '#ef4444', icon: '💀' },
              { id: 'suspicious', label: 'Suspicious', count: threatsData?.counts?.suspicious || 0, color: '#f59e0b', icon: '⚡' },
              { id: 'normal', label: 'Normal', count: threatsData?.counts?.normal || 0, color: '#10b981', icon: '✓' },
            ].map(level => (
              <button
                key={level.id}
                onClick={() => setDrillLevel(level.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  background: drillLevel === level.id ? '#f1f5f9' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '18px' }}>{level.icon}</span>
                  <span style={{ fontWeight: 600, color: level.color }}>{level.label}</span>
                </div>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>{level.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>
            {drillLevel ? `${drillLevel.charAt(0).toUpperCase() + drillLevel.slice(1)} Details` : 'Select a Category'}
          </h3>
          <div className="table-container" style={{ maxHeight: '250px' }}>
            {drillLevel ? (
              <table className="results-table">
                <tbody>
                  {drillDownData.map((r: any, i: number) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '13px' }}>{r.ip}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: drillLevel === 'attack' ? '#ef4444' : drillLevel === 'suspicious' ? '#f59e0b' : '#10b981' }}>
                        {(r.confidence * 100).toFixed(0)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '40px 0' }}>Select a level to see specific nodes</div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px' }}>Threat Timeline (24h)</h3>
        <div style={{ height: '250px' }}>
          {threatsData?.timeline && (
            <Line
              data={{
                labels: threatsData.timeline.hours,
                datasets: [
                  {
                    label: 'Attacks',
                    data: threatsData.timeline.attacks,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    fill: true, tension: 0.4,
                    pointRadius: 0, borderWidth: 2
                  },
                  {
                    label: 'Suspicious',
                    data: threatsData.timeline.suspicious,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.05)',
                    fill: true, tension: 0.4,
                    pointRadius: 0, borderWidth: 2
                  },
                ]
              }}
              options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'top', align: 'end', labels: { boxWidth: 8, usePointStyle: true, font: { weight: 600 } } } },
                scales: {
                  x: { grid: { display: false }, ticks: { maxTicksLimit: 12 } },
                  y: { grid: { color: '#f1f5f9' }, beginAtZero: true }
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
