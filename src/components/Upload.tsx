import React, { useState, DragEvent, ChangeEvent } from 'react';
import { api } from '../api';

interface UploadProps {
  onAnalyzeComplete: () => void;
}

export function Upload({ onAnalyzeComplete }: UploadProps) {
  const [uploadStatus, setUploadStatus] = useState('IDLE');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadReady, setUploadReady] = useState(false);
  const [uploadResult, setUploadResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState('');

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('dragover');
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUpload(e.dataTransfer.files[0]);
    }
  };
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUpload(e.target.files[0]);
    }
  };

  const processUpload = async (file: File) => {
    setUploadStatus('UPLOADING');
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress(p => Math.min(p + Math.random() * 20, 95));
    }, 80);

    try {
      const res = await api.uploadFile(file);
      clearInterval(progressInterval);
      setUploadProgress(100);

      setUploadStatus('READY');
      setUploadResult(`✓ ${file.name} · ${(file.size / 1024).toFixed(1)} KB · Verified`);
      setUploadReady(true);
    } catch (e) {
      clearInterval(progressInterval);
      setUploadStatus('ERROR');
      setUploadResult('Upload failed due to network error');
    }
  };

  const runAnalysis = async () => {
    if (!uploadReady) return;
    setIsAnalyzing(true);
    setAnalyzeStep('Initializing quantum walk simulation...');

    try {
      await api.analyze();
      setAnalyzeStep('Compiling results...');
      setTimeout(() => {
        setIsAnalyzing(false);
        onAnalyzeComplete();
      }, 600);
    } catch (e) {
      setIsAnalyzing(false);
      alert('Analysis failed');
    }
  };

  return (
    <>
      {isAnalyzing && (
        <div className="full-loader show">
          <div style={{ position: 'relative', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loader-ring"></div>
            <div className="loader-ring2"></div>
            <div style={{ fontSize: '20px' }}>⚛</div>
          </div>
          <div className="loader-text">Running Quantum Analysis…</div>
          <div className="loader-sub">{analyzeStep}</div>
        </div>
      )}

      <div className="page active">
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-glow-line"></div>
            <div className="card-header">
              <div className="card-title">Step 1 — Upload CSV</div>
              <div className="card-badge" style={{ color: uploadStatus === 'READY' ? '#22c55e' : uploadStatus === 'UPLOADING' ? '#00c6ff' : 'var(--liquid3)' }}>{uploadStatus}</div>
            </div>
            <div className="upload-zone" onClick={() => document.getElementById('fileInput')?.click()}
              onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
              <div className="upload-icon">📡</div>
              <div className="upload-title">Drop your network capture CSV here</div>
              <div className="upload-sub">or click to browse files</div>
              <div className="upload-badge">.CSV · .PCAP · .LOG supported</div>
              <div className="progress-upload" style={{ display: uploadProgress > 0 ? 'block' : 'none' }}>
                <div className="progress-upload-fill" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
            <input type="file" id="fileInput" accept=".csv,.log,.pcap" style={{ display: 'none' }} onChange={handleFileSelect} />
            <div style={{ marginTop: '12px', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace", color: uploadStatus === 'READY' ? '#22c55e' : 'var(--text3)' }}>{uploadResult}</div>
          </div>

          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-glow-line"></div>
            <div className="card-header">
              <div className="card-title">Step 2 — Run Analysis</div>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '16px', lineHeight: 1.6 }}>
              Initiates the quantum walk anomaly detection pipeline and QFT periodicity analysis against the uploaded dataset.
            </div>
            <div className="analyze-section">
              <button className="btn btn-primary" onClick={runAnalysis} disabled={!uploadReady || isAnalyzing}>
                <span>⚛</span> Run Quantum Analysis
              </button>
              <div className={`analyze-status ${uploadReady ? 'ready' : ''}`}>
                {uploadReady ? '⚛ Ready to run quantum analysis' : '— Upload a file first'}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-glow-line"></div>
            <div className="card-header">
              <div className="card-title">Step 3 — View Results</div>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '16px' }}>
              After analysis completes, results populate the Command Center dashboard automatically.
            </div>
            <button className="btn btn-ghost" onClick={onAnalyzeComplete}>→ Go to Dashboard</button>
          </div>
        </div>
      </div>
    </>
  );
}
