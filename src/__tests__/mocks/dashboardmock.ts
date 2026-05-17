export const dashboardmock = {
  stats: {
    nodesAnalyzed: 1000,
    nodesDelta: 10,
    threatsDetected: 50,
    threatsDelta: 5,
    totalLogs: 5000,
    logsDelta: 12,
    attackCount: 20,
    attackDelta: 8,
  },
  results: [
    { ip: '192.168.1.1', level: 'attack', confidence: 0.9, ts: '2026-01-01' },
    { ip: '192.168.1.2', level: 'suspicious', confidence: 0.6, ts: '2026-01-02' },
    { ip: '192.168.1.3', level: 'normal', confidence: 0.2, ts: '2026-01-03' },
  ],
  threatDistribution: {
    attack: 10,
    suspicious: 20,
    normal: 30,
  },
  quantumWalk: {
    ips: ['192.168.1.1', '192.168.1.2'],
    vals: [0.8, 0.5],
  },
  qft: {
    freqs: [1, 2, 3],
    amps: [10, 20, 15],
  },
};