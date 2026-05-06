import { vi } from 'vitest';

export const mockUser = {
  username: 'Goutam',
  email: 'goutam@example.com',
};

export const mockLogout = vi.fn();

export const threatsMockApiResponse = [
  {
    threatLevel: 'attack',
    count: 2,
    affectedIPs: ['192.168.1.1', '192.168.1.2'],
  },
  {
    threatLevel: 'suspicious',
    count: 1,
    affectedIPs: ['192.168.1.3'],
  },
  {
    threatLevel: 'normal',
    count: 0,
    affectedIPs: [],
  },
];


export const mockFile = new File(['dummy content'], 'test.csv', {
  type: 'text/csv',
});

export const mockUploadFile = vi.fn();
export const mockAnalyze = vi.fn();
export const mockGetThreats = vi.fn();