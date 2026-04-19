import React from 'react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export function Sidebar({ activePage, setActivePage }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-text">QCA</div>
        <div className="logo-sub">v2.4.1 · QUANTUM CORE</div>
      </div>

      <div className="nav-section">
        <div className="nav-label">Operations</div>
        <div className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => setActivePage('dashboard')}>
          <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="1" width="6" height="6" rx="1.5" /><rect x="9" y="1" width="6" height="6" rx="1.5" />
            <rect x="1" y="9" width="6" height="6" rx="1.5" /><rect x="9" y="9" width="6" height="6" rx="1.5" />
          </svg>
          Command Center
        </div>
        <div className={`nav-item ${activePage === 'upload' ? 'active' : ''}`} onClick={() => setActivePage('upload')}>
          <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 10V3M5 6l3-3 3 3" /><path d="M3 12h10" />
          </svg>
          Upload & Analyze
        </div>
        <div className={`nav-item ${activePage === 'logs' ? 'active' : ''}`} onClick={() => setActivePage('logs')}>
          <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="12" height="12" rx="1.5" />
            <line x1="5" y1="6" x2="11" y2="6" /><line x1="5" y1="9" x2="11" y2="9" />
          </svg>
          Network Logs
        </div>
      </div>

      <div className="nav-section" style={{ marginTop: '12px' }}>
        <div className="nav-label">Intelligence</div>
        <div className={`nav-item ${activePage === 'threats' ? 'active' : ''}`} onClick={() => setActivePage('threats')}>
          <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 2L14 5v4c0 3-2.7 5.5-6 6.5C2.7 14.5 2 12 2 9V5l6-3z" />
          </svg>
          Threat Intel
        </div>
        <div className={`nav-item ${activePage === 'health' ? 'active' : ''}`} onClick={() => setActivePage('health')}>
          <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="1,9 4,9 5,5 7,12 9,3 11,9 13,9 15,9" />
          </svg>
          System Health
        </div>
      </div>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div className="status-dot"></div>
          <div className="status-text">SYSTEM ONLINE</div>
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace" }}>SOC-ALPHA · 192.168.1.1</div>
      </div>
    </aside>
  );
}
