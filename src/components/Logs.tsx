import React, { useState, useEffect } from 'react';
import { api } from '../api';

export function Logs() {
  const [logsData, setLogsData] = useState<any[]>([]);
  const [logSearchTerm, setLogSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getLogs();
        setLogsData(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const LOGS_PER_PAGE = 10;
  const filteredLogs = logsData.filter(l =>
    !logSearchTerm ||
    l.src.includes(logSearchTerm) ||
    l.dst.includes(logSearchTerm) ||
    l.proto.toLowerCase().includes(logSearchTerm.toLowerCase())
  );
  const totalLogPages = Math.ceil(filteredLogs.length / LOGS_PER_PAGE) || 1;
  const currentLogs = filteredLogs.slice((currentPage - 1) * LOGS_PER_PAGE, currentPage * LOGS_PER_PAGE);

  return (
    <>
      {selectedLog && (
        <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) setSelectedLog(null); }}>
          <div className="modal">
            <button className="modal-close" onClick={() => setSelectedLog(null)}>✕</button>
            <div className="modal-title">Log Detail</div>
            <div>
              <div className="detail-row"><span className="detail-key">Source IP</span><span className="detail-val">{selectedLog.src}</span></div>
              <div className="detail-row"><span className="detail-key">Destination IP</span><span className="detail-val">{selectedLog.dst}</span></div>
              <div className="detail-row"><span className="detail-key">Protocol</span><span className="detail-val">{selectedLog.proto}</span></div>
              <div className="detail-row"><span className="detail-key">Packet Size</span><span className={`detail-val ${selectedLog.size > 5000 ? 'highlight' : ''}`}>{selectedLog.size.toLocaleString()} bytes {selectedLog.size > 5000 ? '⚠ LARGE' : ''}</span></div>
              <div className="detail-row"><span className="detail-key">Flags</span><span className="detail-val">{selectedLog.flags}</span></div>
              <div className="detail-row"><span className="detail-key">TTL</span><span className="detail-val">{selectedLog.ttl}</span></div>
              <div className="detail-row"><span className="detail-key">Sequence</span><span className="detail-val">{selectedLog.seq}</span></div>
              <div className="detail-row"><span className="detail-key">Timestamp</span><span className="detail-val">{selectedLog.ts}</span></div>
            </div>
          </div>
        </div>
      )}

      <div className="page active">
        <div className="card">
          <div className="card-glow-line"></div>
          <div className="card-header">
            <div className="card-title">Network Logs</div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input type="text" placeholder="Search IP, protocol…" value={logSearchTerm} onChange={(e) => { setLogSearchTerm(e.target.value); setCurrentPage(1); }}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 12px', color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', outline: 'none', width: '200px' }} />
              <div className="card-badge">{filteredLogs.length} entries</div>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="log-table">
              <thead>
                <tr>
                  <th>Source IP</th>
                  <th>Destination IP</th>
                  <th>Protocol</th>
                  <th>Packet Size</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((l: any) => (
                  <tr key={l.id} onClick={() => setSelectedLog(l)}>
                    <td>{l.src}</td>
                    <td>{l.dst}</td>
                    <td><span className={`protocol proto-${l.proto.toLowerCase()}`}>{l.proto}</span></td>
                    <td>{l.size.toLocaleString()} B</td>
                    <td>{l.ts}</td>
                  </tr>
                ))}
                {currentLogs.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center' }}>No logs found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            {currentPage > 1 && <button className="pg-btn" onClick={() => setCurrentPage(currentPage - 1)}>‹</button>}
            {Array.from({ length: totalLogPages }, (_, i) => i + 1).map(p => {
              if (p === 1 || p === totalLogPages || Math.abs(p - currentPage) <= 1) {
                return <button key={p} className={`pg-btn ${p === currentPage ? 'active' : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>;
              } else if (Math.abs(p - currentPage) === 2) {
                return <span key={p} style={{ color: 'var(--text3)', fontSize: '12px' }}>…</span>;
              }
              return null;
            })}
            {currentPage < totalLogPages && <button className="pg-btn" onClick={() => setCurrentPage(currentPage + 1)}>›</button>}
          </div>
        </div>
      </div>
    </>
  );
}
