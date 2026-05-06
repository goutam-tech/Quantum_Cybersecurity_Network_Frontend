import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { threatsMockApiResponse, mockGetThreats, mockAnalyze, mockUploadFile } from '../mocks/mockData';

vi.mock('../../api', () => ({
  api: {
    getThreats: mockGetThreats,
    uploadFile: mockUploadFile,
    analyze: mockAnalyze,
  },
}));

vi.mock('react-chartjs-2', () => ({
  Line: () => <div>Line Chart</div>,
}));

import { Threats } from '../../components/Threats';

describe('Threats Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders threat counts', async () => {
    mockGetThreats.mockResolvedValue(threatsMockApiResponse);

    render(<Threats />);

    await waitFor(() => {
      expect(screen.getByText('Attack')).toBeInTheDocument();
      expect(screen.getByText('Suspicious')).toBeInTheDocument();
    });
  });

  test('drill-down shows IPs', async () => {
    mockGetThreats.mockResolvedValue(threatsMockApiResponse);

    render(<Threats />);

    const attackBtn = await screen.findByText('Attack');
    fireEvent.click(attackBtn);

    expect(await screen.findByText('192.168.1.1')).toBeInTheDocument();
  });

  test('shows select message initially', async () => {
    mockGetThreats.mockResolvedValue(threatsMockApiResponse);

    render(<Threats />);

    expect(await screen.findByText(/Select a level/i)).toBeInTheDocument();
  });

  test('shows error message on API failure', async () => {
    mockGetThreats.mockRejectedValue(new Error('Server Down'));

    render(<Threats />);

    await waitFor(() => {
      expect(screen.getByText(/Security Sync Error/i)).toBeInTheDocument();
      expect(screen.getByText(/Server Down/i)).toBeInTheDocument();
    });
  });
});