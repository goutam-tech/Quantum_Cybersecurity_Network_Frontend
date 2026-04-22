import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export function Sidebar({ activePage, setActivePage }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-text">QUANTUM CORE</div>
      </div>

      <div className="nav-section">
        <div className="nav-label">Main Menu</div>
        <div className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => setActivePage('dashboard')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
          </svg>
          Dashboard
        </div>
        <div className={`nav-item ${activePage === 'upload' ? 'active' : ''}`} onClick={() => setActivePage('upload')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Analyze Data
        </div>
        <div className={`nav-item ${activePage === 'logs' ? 'active' : ''}`} onClick={() => setActivePage('logs')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
          </svg>
          Network Logs
        </div>
      </div>

      <div className="nav-section">
        <div className="nav-label">Security</div>
        <div className={`nav-item ${activePage === 'threats' ? 'active' : ''}`} onClick={() => setActivePage('threats')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Threat Intel
        </div>
        {/* <div className={`nav-item ${activePage === 'health' ? 'active' : ''}`} onClick={() => setActivePage('health')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          System Health
        </div> */}
      </div>

      <div style={{ marginTop: 'auto', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
            {user?.username?.substring(0, 2).toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.username || 'User'}</div>
            <div style={{ fontSize: '11px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || 'user@example.com'}</div>
          </div>
          <button onClick={logout} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }} title="Logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

