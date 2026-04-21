import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { sanitize, validateEmail } from '../utils/sanitize';

export const Login: React.FC<{ onToggleSignup: () => void }> = ({ onToggleSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const sanitizedEmail = sanitize(email);

    if (!validateEmail(sanitizedEmail)) {
      setError('Invalid email format');
      return;
    }

    setIsLoading(true);
    try {
      await login(sanitizedEmail, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="orb-container">
          <div className="orb"></div>
          <div className="orb-glow"></div>
        </div>
        <div className="auth-visual-text">
          <h1>Quantum Core</h1>
          <p>Next-gen network intelligence & security.</p>
        </div>
      </div>
      <div className="auth-form-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Login to access your dashboard</p>

          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="auth-switch">
            Don't have an account? <a onClick={onToggleSignup}>Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
};
