import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { Signup } from '../../pages/Signup';

const mockSignup = vi.fn();
const mockToggleLogin = vi.fn();
const mockSanitize = vi.fn();
const mockValidateEmail = vi.fn();
const mockValidatePassword = vi.fn();

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    signup: mockSignup,
  }),
}));

vi.mock('../../utils/sanitize', () => ({
  sanitize: (val: string) => mockSanitize(val),
  validateEmail: (val: string) => mockValidateEmail(val),
  validatePassword: (val: string) => mockValidatePassword(val),
}));

describe('Signup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockSanitize.mockImplementation((val) => val);
    mockValidateEmail.mockReturnValue(true);
    mockValidatePassword.mockReturnValue(true);
  });

  test('renders signup form', () => {
    render(<Signup onToggleLogin={mockToggleLogin} />);

    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('johndoe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name@company.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  test('shows error for invalid email', async () => {
    mockValidateEmail.mockReturnValue(false);

    render(<Signup onToggleLogin={mockToggleLogin} />);

    fireEvent.change(screen.getByPlaceholderText('johndoe'), {
      target: { value: 'john' },
    });

    fireEvent.change(screen.getByPlaceholderText('name@company.com'), {
      target: { value: 'invalid' },
    });

    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument();
    expect(mockSignup).not.toHaveBeenCalled();
  });

  test('shows error for weak password', async () => {
    mockValidatePassword.mockReturnValue(false);

    render(<Signup onToggleLogin={mockToggleLogin} />);

    fireEvent.change(screen.getByPlaceholderText('johndoe'), {
      target: { value: 'john' },
    });

    fireEvent.change(screen.getByPlaceholderText('name@company.com'), {
      target: { value: 'test@mail.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: '123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(
      await screen.findByText(/password must be at least 8 characters/i)
    ).toBeInTheDocument();

    expect(mockSignup).not.toHaveBeenCalled();
  });

  test('calls signup on valid input', async () => {
    mockSignup.mockResolvedValueOnce({});

    render(<Signup onToggleLogin={mockToggleLogin} />);

    fireEvent.change(screen.getByPlaceholderText('johndoe'), {
      target: { value: 'john' },
    });

    fireEvent.change(screen.getByPlaceholderText('name@company.com'), {
      target: { value: 'test@mail.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith(
        'john',
        'test@mail.com',
        'password123'
      );
    });
  });

  test('shows error if signup fails', async () => {
    mockSignup.mockRejectedValueOnce(new Error('Signup failed'));

    render(<Signup onToggleLogin={mockToggleLogin} />);

    fireEvent.change(screen.getByPlaceholderText('johndoe'), {
      target: { value: 'john' },
    });

    fireEvent.change(screen.getByPlaceholderText('name@company.com'), {
      target: { value: 'test@mail.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByText('Signup failed')).toBeInTheDocument();
  });

  test('shows loading state', async () => {
    mockSignup.mockImplementation(() => new Promise(() => {})); // never resolves

    render(<Signup onToggleLogin={mockToggleLogin} />);

    fireEvent.change(screen.getByPlaceholderText('johndoe'), {
      target: { value: 'john' },
    });

    fireEvent.change(screen.getByPlaceholderText('name@company.com'), {
      target: { value: 'test@mail.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByText('Creating account...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('calls toggle login when clicked', () => {
    render(<Signup onToggleLogin={mockToggleLogin} />);

    fireEvent.click(screen.getByText(/login/i));

    expect(mockToggleLogin).toHaveBeenCalled();
  });
});