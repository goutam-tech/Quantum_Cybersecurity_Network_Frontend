export const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

let authToken = localStorage.getItem('token') || '';

const getHeaders = () => {
  const headers: any = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

const request = async (url: string, options: any = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers
    }
  });

  if (res.status === 401) {
    authToken = '';
    localStorage.removeItem('token');
    // We don't throw here so that individual components can handle it, 
    // or we could throw a specific error.
  }

  return res;
};

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email, Password: password }),
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      authToken = data.token || data.Token;
      localStorage.setItem('token', authToken);
      return data;
    },
    signup: async (username: string, email: string, password: string) => {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Name: username, Email: email, Password: password }),
      });
      if (!res.ok) throw new Error('Signup failed');
      const data = await res.json();
      authToken = data.token || data.Token;
      localStorage.setItem('token', authToken);
      return data;
    },
    revoke: async () => {
      if (!authToken) return true;
      const res = await fetch(`${API_BASE}/auth/revoke`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ Token: authToken }),
      });
      authToken = '';
      localStorage.removeItem('token');
      return res.ok;
    },
    me: async () => {
      if (!authToken) return null;
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getHeaders(),
      });
      if (!res.ok) {
        authToken = '';
        localStorage.removeItem('token');
        return null;
      }
      return res.json();
    },
  },
  getDashboard: async () => {
    const [resResults, resQW, resQft] = await Promise.all([
      request(`${API_BASE}/Results`),
      request(`${API_BASE}/Results/quantum-walk`),
      request(`${API_BASE}/Results/qft?threshold=0.1`)
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
    const res = await request(`${API_BASE}/Logs`);
    if (!res.ok) throw new Error(res.status === 401 ? 'Session expired' : 'Failed to fetch logs');
    return res.json();
  },
  getThreats: async () => {
    const res = await request(`${API_BASE}/Threats`);
    if (!res.ok) throw new Error(res.status === 401 ? 'Session expired' : 'Failed to fetch threats');
    return res.json();
  },
  // getHealth: async () => {
  //   const res = await request(`${API_BASE}/health`);
  //   if (!res.ok) throw new Error('Failed to fetch health');
  //   return res.json();
  // },
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/Upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    return res;
  },
  analyze: async () => {
    const res = await fetch(`${API_BASE}/Analyze`, { 
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Analysis failed');
    return res;
  }
};

