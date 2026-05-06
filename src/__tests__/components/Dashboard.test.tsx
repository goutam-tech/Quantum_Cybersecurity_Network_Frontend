import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';

vi.mock('../../api', () => ({
  api: {
    getDashboard: vi.fn(),
  },
}));

import { api } from '../../api';
import { Dashboard } from '../../components/Dashboard';
import { dashboardmock } from '../mocks/dashboardmock';

vi.mock('react-chartjs-2', () => ({
  Doughnut: () => <div>Doughnut Chart</div>,
  Bar: () => <div>Bar Chart</div>,
  Line: () => <div>Line Chart</div>,
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (api.getDashboard as any).mockResolvedValue(dashboardmock);
  });

  test('renders stats correctly', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Nodes Analyzed')).toBeInTheDocument();
      expect(screen.getByText('1,000')).toBeInTheDocument();
      expect(screen.getByText('Threats Detected')).toBeInTheDocument();
    });
  });

  test('renders table rows', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
      expect(screen.getByText('192.168.1.2')).toBeInTheDocument();
      expect(screen.getByText('192.168.1.3')).toBeInTheDocument();
    });
  });

  test('filter works (attack only)', async () => {
    render(<Dashboard />);

    await waitFor(() => screen.getByText('192.168.1.1'));

    const buttons = await screen.findAllByRole('button');
    const attackBtn = buttons.find(
        (btn) => btn.textContent?.trim() === 'Attack'
    );

    fireEvent.click(attackBtn!);

    expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
    expect(screen.queryByText('192.168.1.2')).not.toBeInTheDocument();
    });

  test('renders charts section', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Threat Distribution')).toBeInTheDocument();
      expect(screen.getByText('Quantum Walk Scores')).toBeInTheDocument();
      expect(screen.getByText('Traffic Periodicity')).toBeInTheDocument();
    });
  });
});