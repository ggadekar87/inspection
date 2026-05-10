// src/pages/Auth/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../../features/auth/useAuth';
import { useNavigate } from 'react-router-dom';

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
    <div className="card" style={{ maxWidth: 420 }}>
      <h3>Login</h3>
      <form onSubmit={submit}>
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <div className="error-card">{error}</div>}
        <div style={{ marginTop: 12 }}>
          <button className="btn primary" type="submit">Login</button>
        </div>
      </form>
      <div style={{ marginTop: 12 }}>
        <small>Use username "alice" (Driver) or "bob" (Admin) with password "password".</small>
      </div>
    </div>
  );
}
