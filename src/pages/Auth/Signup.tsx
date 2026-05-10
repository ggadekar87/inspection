// src/pages/Auth/Signup.tsx
import React, { useState } from 'react';
import { useAuth } from '../../features/auth/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const { signup } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Driver' | 'Admin'>('Driver');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signup(username, password, role);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    }
  };

  return (
    <div className="card" style={{ maxWidth: 420 }}>
      <h3>Sign Up</h3>
      <form onSubmit={submit}>
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <label>
          Role
          <select value={role} onChange={(e) => setRole(e.target.value as any)}>
            <option value="Driver">Driver</option>
            <option value="Admin">Admin</option>
          </select>
        </label>
        {error && <div className="error-card">{error}</div>}
        <div style={{ marginTop: 12 }}>
          <button className="btn primary" type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  );
}
