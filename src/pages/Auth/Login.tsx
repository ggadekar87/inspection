import React, { useState } from 'react';
import { useAuth } from '../../features/auth/useAuth';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(username, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h3 className="login-title">Login</h3>

        <form onSubmit={submit} className="login-form">
          <label className="login-label">
            Username
            <input
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>

          <label className="login-label">
            Password
            <input
              type="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <div className="login-error">{error}</div>}

          <button className="login-btn" type="submit">
            Login
          </button>
        </form>

        <p className="login-hint">
          Use username <strong>alice</strong> (Driver) or <strong>bob</strong> (Admin)  
          with password <strong>password</strong>.
        </p>
      </div>
    </div>
  );
}
