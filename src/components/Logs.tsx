import { useState, useEffect } from 'react';
import { api } from '../api';

export function Logs() {
  const [logsData, setLogsData] = useState<any[]>([]);
  const [logSearchTerm, setLogSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getLogs();
        // Handle the Swagger structure: { total, page, pageSize, records: [...] }
        if (data && Array.isArray(data.records)) {
          setLogsData(data.records);
        } else if (Array.isArray(data)) {
          setLogsData(data);
        } else if (data && Array.isArray(data.logs)) {
          setLogsData(data.logs);
        } else {
          setLogsData([]);
        }
      } catch (e: any) {
        setError(e.message || 'Failed to connect to security server');
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const LOGS_PER_PAGE = 10;
  const filteredLogs = (logsData || []).filter(l =>
    !logSearchTerm ||
    (l.sourceIp && l.sourceIp.includes(logSearchTerm)) ||
    (l.destIp && l.destIp.includes(logSearchTerm)) ||
    (l.protocol && l.protocol.toLowerCase().includes(logSearchTerm.toLowerCase()))
  );
  const totalLogPages = Math.ceil(filteredLogs.length / LOGS_PER_PAGE) || 1;
  const currentLogs = filteredLogs.slice((currentPage - 1) * LOGS_PER_PAGE, currentPage * LOGS_PER_PAGE);

  return (
    <div className="page active">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Network Event Logs</h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Filter logs..." 
              value={logSearchTerm} 
              onChange={(e) => { setLogSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', width: '200px' }}
            />
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>{filteredLogs.length} events</span>
          </div>
        </div>
        
        <div className="table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>Source IP</th>
                <th>Destination</th>
                <th>Protocol</th>
                <th>Size</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.length > 0 ? currentLogs.map((l: any) => (
                <tr key={l.id} style={{ cursor: 'pointer' }}>
                  <td style={{ fontWeight: 600, fontFamily: 'monospace' }}>{l.sourceIp || l.src || '-'}</td>
                  <td style={{ fontFamily: 'monospace' }}>{l.destIp || l.dst || '-'}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '6px', 
                      fontSize: '11px', 
                      fontWeight: 700,
                      background: '#f1f5f9',
                      color: '#475569',
                      textTransform: 'uppercase'
                    }}>
                      {l.protocol || l.proto || 'UNK'}
                    </span>
                  </td>
                  <td>{(l.packetSize || l.size || 0).toLocaleString()} B</td>
                  <td style={{ color: '#64748b' }}>{l.timestamp ? new Date(l.timestamp).toLocaleString() : (l.ts || '-')}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
                    <div style={{ fontSize: '24px', marginBottom: '12px' }}>{error ? '⚠️' : '🔍'}</div>
                    <div style={{ fontWeight: 600, color: error ? '#ef4444' : '#1e293b' }}>
                      {error ? `Connection Error: ${error}` : 'No network events found'}
                    </div>
                    <div style={{ fontSize: '13px', marginTop: '4px' }}>
                      {error ? 'Please check if the backend is running and you are logged in.' : 'Try adjusting your filters or checking back later.'}
                    </div>
                    {error && (
                      <button 
                        onClick={() => window.location.reload()}
                        style={{ marginTop: '16px', padding: '8px 16px', borderRadius: '6px', border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Retry Connection
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            Prev
          </button>
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: '14px', fontWeight: 600 }}>
            Page {currentPage} of {totalLogPages}
          </div>
          <button 
            disabled={currentPage === totalLogPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', opacity: currentPage === totalLogPages ? 0.5 : 1 }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

