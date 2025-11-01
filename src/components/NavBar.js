// Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/NavBar.css'; 

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="nav-logo">
          <span role="img" aria-label="logo" style={{fontSize: '1.7em', verticalAlign: 'middle', marginRight: '8px'}}>🗂️</span>
          <span className="nav-title">TaskFlow Pro</span>
        </Link>
      </div>
      <div className="navbar-right">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="nav-link login">Login</Link>
            <Link to="/signup" className="nav-link signup">Signup</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="nav-link logout">Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
