// src/components/Header.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const linkClass = ({ isActive }) => 'nav-link' + (isActive ? ' active' : '');

  const logout = () => {
    localStorage.removeItem('token');         // clear token on logout [13]
    navigate('/login', { replace: true });    // redirect to login [3]
  };

  return (
    <header className="site-header">
      <nav className="nav" aria-label="Primary">
        <div className="nav-left">
          <NavLink to="/home" className={linkClass} end>Home</NavLink>
          <NavLink to="/events" className={linkClass}>Events</NavLink>
          <NavLink to="/events/create" className={linkClass}>Create Events</NavLink>
        </div>
        <div className="nav-right">
          <button type="button" className="btn logout" onClick={logout}>Logout</button>
        </div>
      </nav>
    </header>
  );
}
