import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { sanitize, validateEmail, validatePassword } from '../utils/sanitize';

export const Signup: React.FC<{ onToggleLogin: () => void }> = ({ onToggleLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const sanitizedUsername = sanitize(username);
    const sanitizedEmail = sanitize(email);

    if (!validateEmail(sanitizedEmail)) {
      setError('Invalid email format');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await signup(sanitizedUsername, sanitizedEmail, password);
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="orb-container">
          <div className="orb orb-alt"></div>
          <div className="orb-glow orb-glow-alt"></div>
        </div>
        <div className="auth-visual-text">
          <h1>Secure Scale</h1>
          <p>Join the future of quantum-proof networking.</p>
        </div>
      </div>
      <div className="auth-form-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Create Account</h2>
          <p className="auth-subtitle">Get started with a free trial</p>

          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe"
              required
            />
          </div>

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

          <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>

          <p className="auth-switch">
            Already have an account? <a onClick={onToggleLogin}>Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};
