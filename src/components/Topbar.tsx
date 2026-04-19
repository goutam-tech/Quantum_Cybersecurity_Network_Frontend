import React, { useState, useEffect } from 'react';

interface TopbarProps {
  activePage: string;
}

export function Topbar({ activePage }: TopbarProps) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const exportReport = () => {
    alert('📊 Report export initiated — generating PDF...\n\n(In production, this calls POST /export with auth token)');
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div>
          <div className="page-title">
            {activePage === 'dashboard' && 'Command Center'}
            {activePage === 'upload' && 'Upload & Analyze'}
            {activePage === 'logs' && 'Network Logs'}
            {activePage === 'threats' && 'Threat Intel'}
            {activePage === 'health' && 'System Health'}
          </div>
          <div className="breadcrumb">
            {activePage === 'dashboard' && 'QCA / Dashboard / Live'}
            {activePage === 'upload' && 'QCA / Upload / Workflow'}
            {activePage === 'logs' && 'QCA / Logs / Network'}
            {activePage === 'threats' && 'QCA / Intelligence / Threats'}
            {activePage === 'health' && 'QCA / System / Health'}
          </div>
        </div>
      </div>
      <div className="topbar-right">
        <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace" }}>{currentTime}</div>
        <button className="btn btn-ghost" onClick={exportReport}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 2v9M5 8l3 3 3-3" />
            <path d="M3 14h10" />
          </svg>
          Export Report
        </button>
        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,var(--liquid2),var(--liquid3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>SA</div>
      </div>
    </div>
  );
}
