import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password });
      //localStorage.setItem('token', res.data.token);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);

      navigate('/home');
    } catch {
      alert('Login failed!');
    }
  };

return (
  <div className="login">
    <div className="login-card">
      <h2 className="login-title">Log in</h2>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="submit" type="submit">Log In</button>
      </form>

      <p className="hint">
        No account? <a href="/register">Register</a>
      </p>
    </div>
  </div>
);

}

export default LoginPage;
