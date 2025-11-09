
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username'); // get from localStorage

  const linkClass = ({ isActive }) => 'nav-link' + (isActive ? ' active' : '');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login', { replace: true });
  };

  return (
    <header className="site-header">
      <nav className="nav" aria-label="Primary">
        <div className="nav-left">
          <NavLink to="/home" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/events" className={linkClass}>
            Events
          </NavLink>
          <NavLink to="/events/create" className={linkClass}>
            Create Events
          </NavLink>
        </div>

        <div className="nav-right">
          {username && (
            <div className="user-info">
              <FaUserCircle className="profile-icon" />
              <span className="username">{username}</span>
            </div>
          )}
          <button type="button" className="btn logout" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
