import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { api } from '../api';

export function Threats() {
  const [threatsData, setThreatsData] = useState<any>(null);
  const [drillLevel, setDrillLevel] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getThreats();
        setThreatsData(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const drillDownData = threatsData?.results?.filter((r: any) => r.level === drillLevel) || [];

  return (
    <div className="page active">
      <div className="grid-2">
        <div className="card">
          <div className="card-glow-line"></div>
          <div className="card-header">
            <div className="card-title">Threat Drill-Down</div>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '16px' }}>Click a threat level to view filtered results</div>
          <button className="threat-chip attack-chip" onClick={() => setDrillLevel('attack')}>
            <span>💀</span> Attack
            <span className="chip-count">{threatsData?.counts?.attack || 0}</span>
          </button>
          <button className="threat-chip suspicious-chip" onClick={() => setDrillLevel('suspicious')}>
            <span>⚡</span> Suspicious
            <span className="chip-count">{threatsData?.counts?.suspicious || 0}</span>
          </button>
          <button className="threat-chip" onClick={() => setDrillLevel('normal')}
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: 'var(--normal)' }}>
            <span>✓</span> Normal
            <span className="chip-count">{threatsData?.counts?.normal || 0}</span>
          </button>
        </div>
        <div className="card">
          <div className="card-glow-line"></div>
          <div className="card-header">
            <div className="card-title">{drillLevel ? `${drillLevel.charAt(0).toUpperCase() + drillLevel.slice(1)} Threats` : 'Drill-Down Results'}</div>
            <div className="card-badge" style={{ color: drillLevel === 'attack' ? 'var(--attack)' : drillLevel === 'suspicious' ? 'var(--suspicious)' : drillLevel === 'normal' ? 'var(--normal)' : '' }}>
              {drillLevel ? `${drillDownData.length} FOUND` : 'SELECT LEVEL'}
            </div>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text3)' }}>
            {drillLevel && drillDownData.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {drillDownData.map((r: any, i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(99,160,255,0.06)' }}>
                      <td style={{ padding: '8px 4px', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: 'var(--liquid3)' }}>{r.ip}</td>
                      <td style={{ padding: '8px 4px', fontSize: '12px', color: drillLevel === 'attack' ? 'var(--attack)' : drillLevel === 'suspicious' ? 'var(--suspicious)' : 'var(--normal)' }}>
                        {(r.confidence * 100).toFixed(0)}%
                      </td>
                      <td style={{ padding: '8px 4px', fontSize: '11px', color: 'var(--text3)' }}>{r.ts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>{drillLevel ? 'No entries for this level.' : 'Select a threat level to explore.'}</div>
            )}
          </div>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-glow-line"></div>
        <div className="card-header">
          <div className="card-title">Threat Timeline</div>
          <div className="card-badge">24H VIEW</div>
        </div>
        <div className="chart-wrap" style={{ height: '220px' }}>
          {threatsData?.timeline && (
            <Line
              data={{
                labels: threatsData.timeline.hours,
                datasets: [
                  { label: 'Attack', data: threatsData.timeline.attacks, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)', fill: true, tension: 0.4, pointRadius: 2, borderWidth: 2 },
                  { label: 'Suspicious', data: threatsData.timeline.suspicious, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.06)', fill: true, tension: 0.4, pointRadius: 2, borderWidth: 2 },
                ]
              }}
              options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#94a3b8', font: { size: 11 } } } },
                scales: {
                  x: { ticks: { color: '#64748b', font: { size: 9 }, maxTicksLimit: 12 }, grid: { color: 'rgba(99,160,255,0.05)' } },
                  y: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(99,160,255,0.07)' } }
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
