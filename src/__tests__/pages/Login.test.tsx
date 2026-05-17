import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { Login } from '../../pages/Login';

const mockLogin = vi.fn();
const mockToggleSignup = vi.fn();
const mockSanitize = vi.fn();
const mockValidateEmail = vi.fn();

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

vi.mock('../../utils/sanitize', () => ({
  sanitize: (val: string) => mockSanitize(val),
  validateEmail: (val: string) => mockValidateEmail(val),
}));

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockSanitize.mockReturnValue('test@mail.com');
    mockValidateEmail.mockReturnValue(true);
  });

  test('renders login form', () => {
    render(<Login onToggleSignup={mockToggleSignup} />);

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name@company.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  test('shows validation error for invalid email', async () => {
    mockSanitize.mockReturnValue('invalidemail');
    mockValidateEmail.mockReturnValue(false);

    render(<Login onToggleSignup={mockToggleSignup} />);

    fireEvent.change(screen.getByPlaceholderText('name@company.com'), {
      target: { value: 'invalidemail' },
    });

    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText(/please enter a valid email/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  test('calls login on valid input', async () => {
    mockLogin.mockResolvedValueOnce({});

    render(<Login onToggleSignup={mockToggleSignup} />);

    fireEvent.change(screen.getByPlaceholderText('name@company.com'), {
      target: { value: 'test@mail.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@mail.com', 'password123');
    });
  });

  test('shows error if login fails', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Login failed'));

    render(<Login onToggleSignup={mockToggleSignup} />);

    fireEvent.change(screen.getByPlaceholderText('name@company.com'), {
      target: { value: 'test@mail.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Login failed')).toBeInTheDocument();
  });

  test('shows loading state', async () => {
    // Never resolves → keeps loading
    mockLogin.mockImplementation(() => new Promise(() => {}));

    render(<Login onToggleSignup={mockToggleSignup} />);

    fireEvent.change(screen.getByPlaceholderText('name@company.com'), {
      target: { value: 'test@mail.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Signing in...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('calls toggle signup when clicked', () => {
    render(<Login onToggleSignup={mockToggleSignup} />);

    fireEvent.click(screen.getByText(/sign up/i));

    expect(mockToggleSignup).toHaveBeenCalled();
  });
});