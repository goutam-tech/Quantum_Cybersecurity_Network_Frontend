export const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const api = {
  getDashboard: async () => {
    const [resResults, resQW, resQft] = await Promise.all([
      fetch(`${API_BASE}/Results`),
      fetch(`${API_BASE}/Results/quantum-walk`),
      fetch(`${API_BASE}/Results/qft?threshold=0.1`)
    ]);

    if (!resResults.ok) throw new Error('Failed to fetch dashboard');

    const resultsRaw = await resResults.json();
    const qwRaw = resQW.ok ? await resQW.json() : [];
    const qftRaw = resQft.ok ? await resQft.json() : [];

    const results = resultsRaw.map((r: any) => ({
      ip: r.ipAddress,
      level: r.threatLevel ? r.threatLevel.toLowerCase() : 'normal',
      confidence: r.confidence,
      ts: r.detectedAt ? new Date(r.detectedAt).toLocaleTimeString() : ''
    }));

    let attack = 0, suspicious = 0, normal = 0;
    const uniqueIps = new Set();
    results.forEach((r: any) => {
      uniqueIps.add(r.ip);
      if (r.level === 'attack') attack++;
      else if (r.level === 'suspicious') suspicious++;
      else normal++;
    });

    const qwMap = new Map();
    qwRaw.forEach((q: any) => {
      const curr = qwMap.get(q.ipAddress) || 0;
      qwMap.set(q.ipAddress, Math.max(curr, q.anomalyScore));
    });
    
    const topQw = Array.from(qwMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const quantumWalk = {
      ips: topQw.map(t => t[0]),
      vals: topQw.map(t => t[1])
    };

    const sortedQft = [...qftRaw].sort((a, b) => {
      const fA = a.dominantFrequency ?? a.DominantFrequency ?? 0;
      const fB = b.dominantFrequency ?? b.DominantFrequency ?? 0;
      return fA - fB;
    });

    const qft = {
      freqs: sortedQft.map((q: any) => {
        const f = q.dominantFrequency ?? q.DominantFrequency ?? 0;
        return Number(f).toFixed(2);
      }),
      amps: sortedQft.map((q: any) => q.periodicityScore ?? q.PeriodicityScore ?? 0)
    };

    return {
      stats: {
        nodesAnalyzed: uniqueIps.size || 0,
        nodesDelta: 5,
        threatsDetected: attack + suspicious,
        threatsDelta: 12,
        totalLogs: resultsRaw.length,
        logsDelta: 2,
        attackCount: attack,
        attackDelta: 8
      },
      results,
      threatDistribution: { attack, suspicious, normal },
      quantumWalk,
      qft
    };
  },
  getLogs: async () => {
    const res = await fetch(`${API_BASE}/Logs`);
    if (!res.ok) throw new Error('Failed to fetch logs');
    return res.json();
  },
  getThreats: async () => {
    const res = await fetch(`${API_BASE}/Threats`);
    if (!res.ok) throw new Error('Failed to fetch threats');
    return res.json();
  },
  getHealth: async () => {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Failed to fetch health');
    return res.json();
  },
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/Upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    return res;
  },
  analyze: async () => {
    const res = await fetch(`${API_BASE}/Analyze`, { method: 'POST' });
    if (!res.ok) throw new Error('Analysis failed');
    return res;
  }
};
