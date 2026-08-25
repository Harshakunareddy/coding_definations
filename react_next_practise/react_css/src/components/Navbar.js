import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/counter', label: 'Counter' },
  { path: '/todo', label: 'Todo' },
  { path: '/form', label: 'Form' },
  { path: '/accordion', label: 'Accordion' },
  { path: '/tabs', label: 'Tabs' },
  { path: '/modal', label: 'Modal' },
  { path: '/pagination', label: 'Pagination' },
  { path: '/stopwatch', label: 'Stopwatch' },
  { path: '/products', label: 'Products' },
  { path: '/users', label: 'Users' },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          ⚛️ React CSS
        </Link>

        <div className={`navbar-links ${menuOpen ? 'navbar-links--open' : ''}`}>
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`navbar-link ${isActive(path) ? 'navbar-link--active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          <button
            className="navbar-theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          <button
            className={`navbar-hamburger ${menuOpen ? 'navbar-hamburger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
