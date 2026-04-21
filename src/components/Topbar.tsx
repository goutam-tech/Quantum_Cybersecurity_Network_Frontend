import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface TopbarProps {
  activePage: string;
}

export function Topbar({ activePage }: TopbarProps) {
  const [currentTime, setCurrentTime] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Dashboard';
      case 'upload': return 'Analyze Data';
      case 'logs': return 'Network Logs';
      case 'threats': return 'Threat Intel';
      case 'health': return 'System Health';
      default: return 'Overview';
    }
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div>
          <div className="page-title">{getPageTitle()}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Pages / {getPageTitle()}
          </div>
        </div>
      </div>
      
      <div className="topbar-right">
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input 
            type="text" 
            placeholder="Search..." 
            style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '10px 12px 10px 36px', fontSize: '14px', outline: 'none', width: '240px' }}
          />
        </div>
        
        <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', position: 'relative' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <div style={{ position: 'absolute', top: '0', right: '0', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid #fff' }}></div>
        </button>

        <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500, fontFamily: 'monospace' }}>{currentTime}</div>
        
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#475569', fontSize: '13px' }}>
          {user?.username?.substring(0, 2).toUpperCase() || 'U'}
        </div>
      </div>
    </div>
  );
}

