import { useState, useEffect } from 'react';
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
          <div className="stat-label">Nodes Analyzed</div>
          <div className="stat-value">{dashboardData?.stats?.nodesAnalyzed?.toLocaleString() || '-'}</div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
            ↑ {dashboardData?.stats?.nodesDelta || '0'}% <span style={{ color: '#94a3b8', fontWeight: 400 }}>since last week</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Threats Detected</div>
          <div className="stat-value" style={{ color: 'var(--attack)' }}>{dashboardData?.stats?.threatsDetected?.toLocaleString() || '-'}</div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#ef4444', fontWeight: 600 }}>
            ↑ {dashboardData?.stats?.threatsDelta || '0'}% <span style={{ color: '#94a3b8', fontWeight: 400 }}>high priority</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Logs</div>
          <div className="stat-value">{dashboardData?.stats?.totalLogs?.toLocaleString() || '-'}</div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
            ↑ {dashboardData?.stats?.logsDelta || '0'}% <span style={{ color: '#94a3b8', fontWeight: 400 }}>normalized logs</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Attack Count</div>
          <div className="stat-value" style={{ color: 'var(--attack)' }}>{dashboardData?.stats?.attackCount?.toLocaleString() || '-'}</div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#ef4444', fontWeight: 600 }}>
            ↑ {dashboardData?.stats?.attackDelta || '0'}% <span style={{ color: '#94a3b8', fontWeight: 400 }}>detected today</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Results Analysis</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['all', 'attack', 'suspicious'].map(f => (
                <button 
                  key={f}
                  onClick={() => setCurrentFilter(f)}
                  style={{ 
                    padding: '6px 12px', 
                    borderRadius: '6px', 
                    border: '1px solid #e2e8f0', 
                    background: currentFilter === f ? '#f1f5f9' : '#fff',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="table-container" id="results-scroll-container">
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
                {(dashboardData?.results || []).filter((r: any) => currentFilter === 'all' || r.level === currentFilter).map((r: any, idx: number) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600, fontFamily: 'monospace' }}>{r.ip}</td>
                    <td>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '6px', 
                        fontSize: '11px', 
                        fontWeight: 700,
                        background: r.level === 'attack' ? '#fef2f2' : r.level === 'suspicious' ? '#fffbeb' : '#f0fdf4',
                        color: r.level === 'attack' ? '#ef4444' : r.level === 'suspicious' ? '#f59e0b' : '#10b981',
                        textTransform: 'uppercase'
                      }}>
                        {r.level}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${r.confidence * 100}%`, height: '100%', background: 'var(--primary)' }}></div>
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>{Math.round(r.confidence * 100)}%</span>
                      </div>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '12px' }}>{r.ts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => {
                const container = document.getElementById('results-scroll-container');
                if (container) container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Scroll to bottom ↓
            </button>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Threat Distribution</h3>
          <div style={{ height: '220px', position: 'relative' }}>
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
                    backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
                    borderWidth: 0,
                    hoverOffset: 4
                  }]
                }}
                options={{
                  responsive: true, maintainAspectRatio: false,
                  cutout: '75%',
                  plugins: { legend: { display: false } }
                }}
              />
            )}
          </div>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Attack', count: dashboardData?.threatDistribution?.attack || 0, color: '#ef4444' },
              { label: 'Suspicious', count: dashboardData?.threatDistribution?.suspicious || 0, color: '#f59e0b' },
              { label: 'Normal', count: dashboardData?.threatDistribution?.normal || 0, color: '#10b981' }
            ].map(t => (
              <div key={t.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.color }}></div>
                  {t.label}
                </div>
                <div style={{ fontWeight: 700 }}>{t.count.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Quantum Walk Scores</h3>
          <div style={{ height: '200px' }}>
            {dashboardData?.quantumWalk && (
              <Bar
                data={{
                  labels: dashboardData.quantumWalk.ips.map((ip: string) => ip.split('.').slice(-2).join('.')),
                  datasets: [{
                    data: dashboardData.quantumWalk.vals,
                    backgroundColor: '#6366f1',
                    borderRadius: 4,
                  }]
                }}
                options={{
                  responsive: true, maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: '#f1f5f9' }, max: 1 }
                  }
                }}
              />
            )}
          </div>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Traffic Periodicity</h3>
          <div style={{ height: '200px' }}>
            {dashboardData?.qft && (
              <Line
                data={{
                  labels: dashboardData.qft.freqs,
                  datasets: [{
                    data: dashboardData.qft.amps,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.05)',
                    fill: true, tension: 0.4,
                    pointRadius: 0, borderWidth: 2,
                  }]
                }}
                options={{
                  responsive: true, maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } },
                    y: { grid: { color: '#f1f5f9' } }
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