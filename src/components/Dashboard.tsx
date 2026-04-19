import React, { useState, useEffect } from 'react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { api } from '../api';

export function Dashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [currentFilter, setCurrentFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getDashboard();
        setDashboardData(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="page active">
      <div className="stat-grid">
        <div className="stat-card">
          <div className="card-glow-line"></div>
          <div className="stat-icon" style={{ background: 'rgba(30,75,255,0.12)' }}>🌐</div>
          <div className="stat-label">Nodes Analyzed</div>
          <div className="stat-value blue">{dashboardData?.stats?.nodesAnalyzed?.toLocaleString() || '-'}</div>
          <div className="stat-delta"><span className="delta-up">↑ {dashboardData?.stats?.nodesDelta || '0'}%</span> vs last scan</div>
        </div>
        <div className="stat-card">
          <div className="card-glow-line"></div>
          <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.12)' }}>⚠</div>
          <div className="stat-label">Threats Detected</div>
          <div className="stat-value attack">{dashboardData?.stats?.threatsDetected?.toLocaleString() || '-'}</div>
          <div className="stat-delta"><span className="delta-up">↑ {dashboardData?.stats?.threatsDelta || '0'}%</span> high severity</div>
        </div>
        <div className="stat-card">
          <div className="card-glow-line"></div>
          <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.12)' }}>📋</div>
          <div className="stat-label">Total Logs</div>
          <div className="stat-value suspicious">{dashboardData?.stats?.totalLogs?.toLocaleString() || '-'}</div>
          <div className="stat-delta"><span className="delta-down">↓ {dashboardData?.stats?.logsDelta || '0'}%</span> normalized</div>
        </div>
        <div className="stat-card">
          <div className="card-glow-line"></div>
          <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.08)' }}>💀</div>
          <div className="stat-label">Attack Count</div>
          <div className="stat-value attack">{dashboardData?.stats?.attackCount?.toLocaleString() || '-'}</div>
          <div className="stat-delta"><span className="delta-up">↑ {dashboardData?.stats?.attackDelta || '0'}%</span> detected today</div>
        </div>
      </div>

      <div className="grid-3-1">
        <div className="card">
          <div className="card-glow-line"></div>
          <div className="scan-line"></div>
          <div className="card-header">
            <div className="card-title">Results Analysis</div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div className="filter-tabs" style={{ margin: 0 }}>
                {['all', 'attack', 'suspicious', 'normal'].map(filter => (
                  <button key={filter} className={`filter-tab ${currentFilter === filter ? 'active' : ''}`} onClick={() => setCurrentFilter(filter)}>
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
              <div className="card-badge">LIVE</div>
            </div>
          </div>
          <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '350px' }}>
            <table className="results-table">
              <thead>
                <tr>
                  <th>IP Address</th>
                  <th>Threat Level</th>
                  <th>Confidence</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {(dashboardData?.results || []).filter((r: any) => currentFilter === 'all' || r.level === currentFilter).map((r: any, idx: number) => {
                  const pct = Math.round(r.confidence * 100);
                  const color = r.level === 'attack' ? '#ef4444' : r.level === 'suspicious' ? '#f59e0b' : '#22c55e';
                  return (
                    <tr key={idx}>
                      <td className="ip-cell">{r.ip}</td>
                      <td><span className={`badge ${r.level}`}><span className="badge-dot"></span>{r.level.toUpperCase()}</span></td>
                      <td>
                        <div className="progress-wrap">
                          <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%`, background: color }}></div></div>
                          <span className="progress-val">{pct}%</span>
                        </div>
                      </td>
                      <td style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace" }}>{r.ts}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-glow-line"></div>
          <div className="card-header">
            <div className="card-title">Threat Distribution</div>
          </div>
          <div className="chart-wrap" style={{ height: '200px', position: 'relative', marginBottom: '16px' }}>
            {dashboardData?.threatDistribution && (
              <Doughnut
                data={{
                  labels: ['Attack', 'Suspicious', 'Normal'],
                  datasets: [{
                    data: [
                      dashboardData.threatDistribution.attack,
                      dashboardData.threatDistribution.suspicious,
                      dashboardData.threatDistribution.normal
                    ],
                    backgroundColor: ['rgba(239,68,68,0.8)', 'rgba(245,158,11,0.8)', 'rgba(34,197,94,0.8)'],
                    borderColor: ['rgba(239,68,68,0.3)', 'rgba(245,158,11,0.3)', 'rgba(34,197,94,0.3)'],
                    borderWidth: 1, hoverOffset: 4
                  }]
                }}
                options={{
                  responsive: true, maintainAspectRatio: false,
                  cutout: '72%',
                  plugins: { legend: { display: false } },
                  animation: { animateRotate: true, duration: 1000 }
                }}
              />
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            {[
              { label: 'Attack', count: dashboardData?.threatDistribution?.attack || 0, color: 'var(--attack)' },
              { label: 'Suspicious', count: dashboardData?.threatDistribution?.suspicious || 0, color: 'var(--suspicious)' },
              { label: 'Normal', count: dashboardData?.threatDistribution?.normal || 0, color: 'var(--normal)' }
            ].map(t => (
              <div key={t.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text2)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.color, boxShadow: `0 0 6px ${t.color}` }}></div>{t.label}
                </div>
                <div style={{ fontSize: '12px', fontFamily: "'JetBrains Mono', monospace", color: t.color }}>{t.count.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-glow-line"></div>
          <div className="card-header">
            <div className="card-title">Quantum Walk — Top Anomalous IPs</div>
            <div className="card-badge">QW-ALGO</div>
          </div>
          <div className="quantum-label">Anomaly amplitude by node</div>
          <div className="chart-wrap" style={{ height: '200px' }}>
            {dashboardData?.quantumWalk && (
              <Bar
                data={{
                  labels: dashboardData.quantumWalk.ips,
                  datasets: [{
                    data: dashboardData.quantumWalk.vals,
                    backgroundColor: dashboardData.quantumWalk.vals.map((v: number) => v > 0.85 ? 'rgba(239,68,68,0.7)' : v > 0.7 ? 'rgba(245,158,11,0.7)' : 'rgba(30,75,255,0.6)'),
                    borderColor: dashboardData.quantumWalk.vals.map((v: number) => v > 0.85 ? '#ef4444' : v > 0.7 ? '#f59e0b' : '#1e4bff'),
                    borderWidth: 1, borderRadius: 4,
                  }]
                }}
                options={{
                  responsive: true, maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { ticks: { color: '#64748b', font: { size: 9, family: "'JetBrains Mono'" } }, grid: { color: 'rgba(99,160,255,0.05)' } },
                    y: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(99,160,255,0.07)' }, max: 1, min: 0 }
                  }
                }}
              />
            )}
          </div>
        </div>
        <div className="card">
          <div className="card-glow-line"></div>
          <div className="card-header">
            <div className="card-title">QFT Periodicity</div>
            <div className="card-badge">FREQ DOMAIN</div>
          </div>
          <div className="quantum-label">Fourier transform of traffic patterns</div>
          <div className="chart-wrap" style={{ height: '200px' }}>
            {dashboardData?.qft && (
              <Line
                data={{
                  labels: dashboardData.qft.freqs,
                  datasets: [{
                    data: dashboardData.qft.amps,
                    borderColor: '#00c6ff',
                    backgroundColor: 'rgba(0,198,255,0.06)',
                    fill: true, tension: 0.4,
                    pointRadius: 3, borderWidth: 2,
                  }]
                }}
                options={{
                  responsive: true, maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { ticks: { color: '#64748b', font: { size: 9 }, maxTicksLimit: 8 }, grid: { color: 'rgba(99,160,255,0.05)' } },
                    y: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(99,160,255,0.07)' } }
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
