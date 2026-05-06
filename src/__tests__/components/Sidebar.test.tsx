import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { mockUser, mockLogout } from '../mocks/mockData';

const mockUseAuth = vi.fn();

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

import { Sidebar } from '../../components/Sidebar';

describe('Sidebar Component', () => {
  const setActivePageMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });
  });

  test('renders user information', () => {
    render(<Sidebar activePage="dashboard" setActivePage={setActivePageMock} />);
    expect(screen.getByText('Goutam')).toBeInTheDocument();
    expect(screen.getByText('goutam@example.com')).toBeInTheDocument();
  });

  test('clicking Dashboard calls setActivePage', () => {
    render(<Sidebar activePage="dashboard" setActivePage={setActivePageMock} />);
    fireEvent.click(screen.getByText('Dashboard'));
    expect(setActivePageMock).toHaveBeenCalledWith('dashboard');
  });

  test('clicking Network Logs calls setActivePage', () => {
    render(<Sidebar activePage="dashboard" setActivePage={setActivePageMock} />);
    fireEvent.click(screen.getByText('Network Logs'));
    expect(setActivePageMock).toHaveBeenCalledWith('logs');
  });

  test('active class applied correctly', () => {
    render(<Sidebar activePage="logs" setActivePage={setActivePageMock} />);
    const logsItem = screen.getByText('Network Logs');
    expect(logsItem.className).toContain('active');
  });

  test('clicking logout calls logout function', () => {
    render(<Sidebar activePage="dashboard" setActivePage={setActivePageMock} />);

    const logoutBtn = screen.getByTitle('Logout');

    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalled();
  });

  test('renders fallback user when no user data', () => {
    mockUseAuth.mockReturnValueOnce({
      user: null,
      logout: mockLogout,
    });

    render(<Sidebar activePage="dashboard" setActivePage={setActivePageMock} />);

    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
  });
});