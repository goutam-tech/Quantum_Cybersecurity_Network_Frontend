import { useState, useEffect } from 'react';
import { api } from '../api';

export function Health() {
  const [healthData, setHealthData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getHealth();
        setHealthData(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page active">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px' }}>System Resources</h3>
          {[
            { id: 'cpu', label: 'CPU Utilization', val: healthData?.metrics?.cpu || 0, color: '#6366f1' },
            { id: 'mem', label: 'Memory Usage', val: healthData?.metrics?.mem || 0, color: '#10b981' },
            { id: 'disk', label: 'Disk I/O', val: healthData?.metrics?.disk || 0, color: '#f59e0b' },
            { id: 'net', label: 'Network Throughput', val: healthData?.metrics?.net || 0, color: '#ef4444' },
            { id: 'qc', label: 'Quantum Core Load', val: healthData?.metrics?.qc || 0, color: '#8b5cf6' },
          ].map(m => (
            <div key={m.id} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>{m.label}</span>
                <span>{m.val}%</span>
              </div>
              <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${m.val}%`, height: '100%', background: m.color, transition: 'width 1s ease' }}></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px' }}>Service Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(healthData?.services || []).map((s: any) => {
              const statusColor = s.status === 'operational' ? '#10b981' : s.status === 'degraded' ? '#f59e0b' : '#ef4444';
              return (
                <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#1e293b' }}>{s.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColor }}></div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: statusColor, textTransform: 'uppercase' }}>{s.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
