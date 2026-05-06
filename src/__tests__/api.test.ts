import { describe, test, expect, beforeEach, vi } from 'vitest';
import { api } from '../api';

const mockFetch = vi.fn();

vi.stubGlobal('fetch', mockFetch);

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || '',
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

vi.stubGlobal('localStorage', localStorageMock);

describe('API Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('login success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'abc123' }),
    });

    const res = await api.auth.login('test@mail.com', 'pass');

    expect(res.token).toBe('abc123');
    expect(localStorage.getItem('token')).toBe('abc123');
  });

  test('login failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    await expect(api.auth.login('test', 'pass')).rejects.toThrow('Login failed');
  });

  test('signup success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ Token: 'xyz456' }),
    });

    const res = await api.auth.signup('john', 'test@mail.com', 'pass');

    expect(res.Token).toBe('xyz456');
    expect(localStorage.getItem('token')).toBe('xyz456');
  });

  test('signup failure', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    await expect(
      api.auth.signup('john', 'test@mail.com', 'pass')
    ).rejects.toThrow('Signup failed');
  });

  test('revoke clears token', async () => {
    localStorage.setItem('token', 'abc');

    mockFetch.mockResolvedValueOnce({ ok: true });

    const res = await api.auth.revoke();

    expect(res).toBe(true);
    expect(localStorage.getItem('token')).toBe('');
  });

  test('revoke without token returns true', async () => {
    const res = await api.auth.revoke();
    expect(res).toBe(true);
  });

  test('me returns user data', async () => {
    localStorage.setItem('token', 'abc');

    mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ name: 'John' }),
    });

    const res = await api.auth.me();

    expect(res).toEqual({ name: 'John' });
  });

  test('me clears token on failure', async () => {
    localStorage.setItem('token', 'abc');

    mockFetch.mockResolvedValueOnce({
        ok: false,
    });

    const res = await api.auth.me();

    expect(res).toBe(null);
    expect(localStorage.getItem('token')).toBe('');
  });

  test('getDashboard success', async () => {
    mockFetch
        .mockResolvedValueOnce({
        ok: true,
        json: async () => [
            {
            ipAddress: '1.1.1.1',
            threatLevel: 'ATTACK',
            confidence: 0.9,
            detectedAt: new Date().toISOString(),
            },
        ],
        })
        // Quantum Walk
        .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
        })
        // QFT
        .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
        });

    const res = await api.getDashboard();

    expect(res.stats.nodesAnalyzed).toBe(1);
    expect(res.threatDistribution.attack).toBe(1);
  });

  test('getDashboard failure', async () => {
    mockFetch
        .mockResolvedValueOnce({
        ok: false,
        json: async () => [],
        })
        .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
        })
        .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
        });

    await expect(api.getDashboard()).rejects.toThrow(
        'Failed to fetch dashboard'
    );
  });

  test('getLogs success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1 }],
    });

    const res = await api.getLogs();
    expect(res.length).toBe(1);
  });

  test('getLogs unauthorized', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401 });

    await expect(api.getLogs()).rejects.toThrow('Session expired');
  });

  test('getThreats success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1 }],
    });

    const res = await api.getThreats();
    expect(res.length).toBe(1);
  });

  test('uploadFile success', async () => {
    const file = new File(['data'], 'test.txt');

    mockFetch.mockResolvedValueOnce({ ok: true });

    const res = await api.uploadFile(file);

    expect(res.ok).toBe(true);
  });

  test('uploadFile failure', async () => {
    const file = new File(['data'], 'test.txt');

    mockFetch.mockResolvedValueOnce({ ok: false });

    await expect(api.uploadFile(file)).rejects.toThrow('Upload failed');
  });

  test('analyze success', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });

    const res = await api.analyze();
    expect(res.ok).toBe(true);
  });

  test('analyze failure', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    await expect(api.analyze()).rejects.toThrow('Analysis failed');
  });
});