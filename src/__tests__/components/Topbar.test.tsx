import { render, screen, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { mockUser } from '../mocks/mockData';

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));

import { Topbar } from '../../components/Topbar';

describe('Topbar Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('renders dashboard title', () => {
    render(<Topbar activePage="dashboard" />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Pages / Dashboard')).toBeInTheDocument();
  });

  test('renders logs title', () => {
    render(<Topbar activePage="logs" />);

    expect(screen.getByText('Network Logs')).toBeInTheDocument();
  });

  test('renders search input', () => {
    render(<Topbar activePage="dashboard" />);

    expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument();
  });

  test('renders user initials', () => {
    render(<Topbar activePage="dashboard" />);

    expect(screen.getByText('GO')).toBeInTheDocument();
  });

  test('updates time every second', () => {
    const t0 = new Date('2024-01-01T10:00:00');
    vi.setSystemTime(t0);

    render(<Topbar activePage="dashboard" />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    const t1 = new Date('2024-01-01T10:00:01');
    const firstVisibleTick = t1.toLocaleTimeString('en-GB', { hour12: false });
    expect(screen.getByText(firstVisibleTick)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    const t2 = new Date('2024-01-01T10:00:02');
    const secondVisibleTick = t2.toLocaleTimeString('en-GB', { hour12: false });
    expect(screen.getByText(secondVisibleTick)).toBeInTheDocument();
  });

  test('renders default title for unknown page', () => {
    render(<Topbar activePage="unknown" />);

    expect(screen.getByText('Overview')).toBeInTheDocument();
  });
});