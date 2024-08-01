import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GoogleAuth from '../components/GoogleAuth'; // Import the GoogleAuth component
import '../styles/Login.css'; // Import the CSS file for styling

const apiUrl = process.env.REACT_APP_API_URL;

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
      console.log('Login successful:', response.data);
      const token = response.data.token;
      localStorage.setItem('token', token);
      navigate('/tasks');
    } catch (error) {
      console.error("Error while logging in:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
        <GoogleAuth />
        <a href="/auth/google" className="google-login">Login with Google</a>
      </div>
    </div>
  );
}

export default LoginPage;
