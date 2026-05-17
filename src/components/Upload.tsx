import { useState } from 'react';
import { api } from '../api';

export function Upload({ onAnalyzeComplete }: { onAnalyzeComplete: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    try {
      await api.uploadFile(file);
      setStatus('analyzing');
      let p = 0;
      const interval = setInterval(() => {
        p += 5;
        setProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          handleAnalyze();
        }
      }, 100);
    } catch (e) {
      setStatus('error');
    }
  };

  const handleAnalyze = async () => {
    try {
      await api.analyze();
      setStatus('complete');
      setTimeout(onAnalyzeComplete, 1500);
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <div className="page active">
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>Upload Network Traffic Data</h3>
        
        <div 
          style={{ 
            border: '2px dashed #e2e8f0', 
            borderRadius: '12px', 
            padding: '48px 24px', 
            textAlign: 'center',
            background: '#f8fafc',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input 
            id="file-input"
            type="file" 
            style={{ display: 'none' }} 
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <svg style={{ color: '#6366f1', marginBottom: '16px' }} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <div style={{ fontWeight: 600, color: '#1e293b' }}>{file ? file.name : 'Click to select or drag and drop'}</div>
          <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>Supports CSV, JSON, or PCAP files (Max 50MB)</div>
        </div>

        {file && status === 'idle' && (
          <div style={{ marginTop: '24px' }}>
            <button className="btn-primary btn-block" onClick={handleUpload}>
              Start Analysis
            </button>
          </div>
        )}

        {status !== 'idle' && (
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
              <span style={{ color: 'var(--primary)' }}>
                {status === 'uploading' && 'Uploading File...'}
                {status === 'analyzing' && 'Quantum Analysis in Progress...'}
                {status === 'complete' && 'Analysis Complete!'}
                {status === 'error' && 'Something went wrong'}
              </span>
              <span>{progress}%</span>
            </div>
            <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.2s' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}