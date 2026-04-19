import React, { useState, useEffect } from 'react';
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
      <div className="grid-2">
        <div className="card">
          <div className="card-glow-line"></div>
          <div className="card-header">
            <div className="card-title">System Resources</div>
            <div className="card-badge">LIVE</div>
          </div>
          {[
            { id: 'cpu', label: 'CPU Utilization', val: healthData?.metrics?.cpu || 0, grad: 'linear-gradient(90deg,var(--liquid2),var(--liquid3))' },
            { id: 'mem', label: 'Memory', val: healthData?.metrics?.mem || 0, grad: 'linear-gradient(90deg,#22c55e,#16a34a)' },
            { id: 'disk', label: 'Disk I/O', val: healthData?.metrics?.disk || 0, grad: 'linear-gradient(90deg,#f59e0b,#d97706)' },
            { id: 'net', label: 'Network Throughput', val: healthData?.metrics?.net || 0, grad: 'linear-gradient(90deg,#ef4444,#dc2626)' },
            { id: 'qc', label: 'Quantum Core Load', val: healthData?.metrics?.qc || 0, grad: 'linear-gradient(90deg,var(--liquid4),var(--liquid2))' },
          ].map(m => (
            <div className="health-item" key={m.id}>
              <div className="health-label"><span>{m.label}</span><span>{m.val}%</span></div>
              <div className="health-bar"><div className="health-fill" style={{ width: `${m.val}%`, background: m.grad }}></div></div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-glow-line"></div>
          <div className="card-header">
            <div className="card-title">Service Status</div>
          </div>
          <div>
            {(healthData?.services || []).map((s: any) => {
              const color = s.status === 'operational' ? 'var(--normal)' : s.status === 'degraded' ? 'var(--suspicious)' : 'var(--attack)';
              return (
                <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(99,160,255,0.06)' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text2)' }}>{s.name}</span>
                  <span style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: color, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, display: 'inline-block', boxShadow: `0 0 5px ${color}` }}></span>
                    {s.status.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
