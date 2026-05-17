export const API_BASE = import.meta.env?.VITE_API_BASE_URL || '';

const getToken = () => localStorage.getItem('token') || '';

const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

const clearToken = () => {
  localStorage.removeItem('token');
};

const getHeaders = () => {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const request = async (url: string, options: any = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    clearToken();
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
      const token = data.token || data.Token;
      setToken(token);
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
      const token = data.token || data.Token;
      setToken(token);
      return data;
    },

    revoke: async () => {
      const token = getToken();
      if (!token) return true;
      const res = await fetch(`${API_BASE}/auth/revoke`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ Token: token }),
      });
      clearToken();
      return res.ok;
    },

    me: async () => {
      const token = getToken();
      if (!token) return null;
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getHeaders(),
      });
      if (!res.ok) {
        clearToken();
        return null;
      }
      return res.json();
    },
  },

  getDashboard: async () => {
    const [resResults, resQW, resQft] = await Promise.all([
      request(`${API_BASE}/Results`),
      request(`${API_BASE}/Results/quantum-walk`),
      request(`${API_BASE}/Results/qft?threshold=0.1`),
    ]);

    if (!resResults.ok) throw new Error('Failed to fetch dashboard');

    const resultsRaw = await resResults.json();
    const qwRaw = resQW.ok ? await resQW.json() : [];
    const qftRaw = resQft.ok ? await resQft.json() : [];

    const results = (Array.isArray(resultsRaw) ? resultsRaw : []).map((r: any) => ({
      ip: r.ipAddress,
      level: r.threatLevel ? r.threatLevel.toLowerCase() : 'normal',
      confidence: r.confidence,
      ts: r.detectedAt ? new Date(r.detectedAt).toLocaleTimeString() : '',
    }));

    let attack = 0, suspicious = 0, normal = 0;
    const uniqueIps = new Set<string>();
    results.forEach((r: any) => {
      uniqueIps.add(r.ip);
      if (r.level === 'attack') attack++;
      else if (r.level === 'suspicious') suspicious++;
      else normal++;
    });

    const qwMap = new Map<string, number>();
    (Array.isArray(qwRaw) ? qwRaw : []).forEach((q: any) => {
      const curr = qwMap.get(q.ipAddress) || 0;
      qwMap.set(q.ipAddress, Math.max(curr, q.anomalyScore));
    });

    const topQw = Array.from(qwMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const quantumWalk = {
      ips: topQw.map((t) => t[0]),
      vals: topQw.map((t) => t[1]),
    };

    const sortedQft = [...(Array.isArray(qftRaw) ? qftRaw : [])].sort((a, b) => {
      const fA = a.dominantFrequency ?? a.DominantFrequency ?? 0;
      const fB = b.dominantFrequency ?? b.DominantFrequency ?? 0;
      return fA - fB;
    });

    const qft = {
      freqs: sortedQft.map((q: any) => {
        const f = q.dominantFrequency ?? q.DominantFrequency ?? 0;
        return Number(f).toFixed(2);
      }),
      amps: sortedQft.map((q: any) => q.periodicityScore ?? q.PeriodicityScore ?? 0),
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
        attackDelta: 8,
      },
      results,
      threatDistribution: { attack, suspicious, normal },
      quantumWalk,
      qft,
    };
  },

  getLogs: async () => {
    const res = await request(`${API_BASE}/Logs`);
    if (!res.ok) {
      throw new Error(res.status === 401 ? 'Session expired' : 'Failed to fetch logs');
    }
    return res.json();
  },

  getThreats: async () => {
    const res = await request(`${API_BASE}/Threats`);
    if (!res.ok) {
      throw new Error(res.status === 401 ? 'Session expired' : 'Failed to fetch threats');
    }
    return res.json();
  },

  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/Upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    return res;
  },

  analyze: async () => {
    const res = await fetch(`${API_BASE}/Analyze`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Analysis failed');
    return res;
  },
};