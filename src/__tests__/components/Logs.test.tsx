import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';

vi.mock('../../api', () => ({
  api: {
    getLogs: vi.fn(),
  },
}));

import { api } from '../../api';
import { Logs } from '../../components/Logs';
import { logsMockData } from '../mocks/logsMockData';

describe('Logs Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders logs correctly', async () => {
    (api.getLogs as any).mockResolvedValue(logsMockData);

    render(<Logs />);

    await waitFor(() => {
      expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
      expect(screen.getByText('192.168.1.2')).toBeInTheDocument();
    });
  });

  test('filters logs based on input', async () => {
    (api.getLogs as any).mockResolvedValue(logsMockData);

    render(<Logs />);

    await waitFor(() => screen.getByText('192.168.1.1'));

    const input = screen.getByPlaceholderText('Filter logs...');

    fireEvent.change(input, { target: { value: '192.168.1.1' } });

    expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
    expect(screen.queryByText('192.168.1.2')).not.toBeInTheDocument();
  });

  test('shows empty message when no logs', async () => {
    (api.getLogs as any).mockResolvedValue({ records: [] });

    render(<Logs />);

    await waitFor(() => {
      expect(screen.getByText(/No network events found/i)).toBeInTheDocument();
    });
  });

  test('shows error message on API failure', async () => {
    (api.getLogs as any).mockRejectedValue(new Error('Server Down'));

    render(<Logs />);

    await waitFor(() => {
      expect(screen.getByText(/Connection Error/i)).toBeInTheDocument();
      expect(screen.getByText(/Server Down/i)).toBeInTheDocument();
    });
  });

  test('pagination next button works', async () => {
    // Create many logs to trigger pagination
    const bigData = {
      records: Array.from({ length: 25 }, (_, i) => ({
        id: i,
        sourceIp: `192.168.1.${i}`,
        destIp: '10.0.0.1',
        protocol: 'TCP',
        packetSize: 100,
        timestamp: '2026-01-01T10:00:00Z',
      })),
    };

    (api.getLogs as any).mockResolvedValue(bigData);

    render(<Logs />);

    await waitFor(() => screen.getByText('192.168.1.0'));

    const nextBtn = screen.getByRole('button', { name: /next/i });

    fireEvent.click(nextBtn);

    expect(screen.getByText(/Page 2 of/i)).toBeInTheDocument();
  });

  test('prev button disabled on first page', async () => {
    (api.getLogs as any).mockResolvedValue(logsMockData);

    render(<Logs />);

    await waitFor(() => screen.getByText('192.168.1.1'));

    const prevBtn = screen.getByRole('button', { name: /prev/i });

    expect(prevBtn).toBeDisabled();
  });
});