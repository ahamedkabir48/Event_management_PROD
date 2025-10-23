// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import './LoginPage.css';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await api.post('/auth/login', form);
      const { token, username } = res.data;

      // ✅ store token + username for later use
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);

      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="login">
      <div className="login-card">
        <h1>Log in</h1>

        {error && <div className="error" role="alert">{error}</div>}

        <form className="login-form" onSubmit={onSubmit}>
          <div className="field">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button className="submit" type="submit" disabled={busy}>
            {busy ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p className="hint">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  );
}
