export const logsMockData = {
  records: [
    {
      id: 1,
      sourceIp: '192.168.1.1',
      destIp: '10.0.0.1',
      protocol: 'TCP',
      packetSize: 500,
      timestamp: '2026-01-01T10:00:00Z',
    },
    {
      id: 2,
      sourceIp: '192.168.1.2',
      destIp: '10.0.0.2',
      protocol: 'UDP',
      packetSize: 300,
      timestamp: '2026-01-02T10:00:00Z',
    },
    {
      id: 3,
      sourceIp: '192.168.1.3',
      destIp: '10.0.0.3',
      protocol: 'ICMP',
      packetSize: 200,
      timestamp: '2026-01-03T10:00:00Z',
    },
  ],
};