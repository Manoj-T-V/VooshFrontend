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
        <Link to="/" className="nav-link">Home</Link>
      </div>
      <div className="navbar-right">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Signup</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="nav-link">Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
