// src/pages/RegistrationPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import './RegistrationPage.css';

export default function RegistrationPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.post('/auth/register', form);
      alert('✅ Registration successful! Please log in.');
      navigate('/login', { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="register">
      <div className="register-card">
        <h1>Create your account</h1>

        {error && <div className="error">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="field">
            <label>Username</label>
            <input
              name="username"
              value={form.username}
              onChange={onChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" disabled={busy}>
            {busy ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p className="hint">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
}
