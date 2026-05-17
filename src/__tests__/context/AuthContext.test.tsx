import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { AuthProvider, useAuth } from '../../context/AuthContext';

const { mockMe, mockLogin, mockSignup, mockRevoke } = vi.hoisted(() => ({
  mockMe: vi.fn(),
  mockLogin: vi.fn(),
  mockSignup: vi.fn(),
  mockRevoke: vi.fn(),
}));

vi.mock('../../api', () => ({
  api: {
    auth: {
      me: mockMe,
      login: mockLogin,
      signup: mockSignup,
      revoke: mockRevoke,
    },
  },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts with loading true and user null', async () => {
    mockMe.mockResolvedValueOnce(null);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('sets user when checkAuth returns data', async () => {
    mockMe.mockResolvedValueOnce({ Name: 'Alice', email: 'alice@example.com' });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toEqual({ username: 'Alice', email: 'alice@example.com' });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('leaves user null when checkAuth throws', async () => {
    mockMe.mockRejectedValueOnce(new Error('Unauthorized'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('sets user on successful login', async () => {
    mockMe.mockResolvedValueOnce(null);
    mockLogin.mockResolvedValueOnce({
      User: { Name: 'Bob', Email: 'bob@example.com' },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.login('bob@example.com', 'password123');
    });

    expect(result.current.user).toEqual({ username: 'Bob', email: 'bob@example.com' });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('sets user on successful signup', async () => {
    mockMe.mockResolvedValueOnce(null);
    mockSignup.mockResolvedValueOnce({
      user: { username: 'Carol', email: 'carol@example.com' },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.signup('Carol', 'carol@example.com', 'pass');
    });

    expect(result.current.user).toEqual({ username: 'Carol', email: 'carol@example.com' });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('clears user on logout', async () => {
    mockMe.mockResolvedValueOnce({ Name: 'Alice', email: 'alice@example.com' });
    mockRevoke.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).not.toBeNull();

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('throws when useAuth is used outside AuthProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within an AuthProvider'
    );

    consoleSpy.mockRestore();
  });
});