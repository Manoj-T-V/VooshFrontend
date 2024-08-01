import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import GoogleAuth from '../components/GoogleAuth'; // Import the GoogleAuth component

const apiUrl = process.env.REACT_APP_API_URL;

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to manage error messages
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
      // Handle different error responses
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          if (data.error === 'Invalid credentials') {
            setError('Incorrect email or password.');
          } else if (data.error === 'User not registered') {
            setError('User not registered. Please sign up.');
          } else {
            setError('An error occurred. Please try again.');
          }
        } else {
          setError('An error occurred. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    }
  };

  // Inline styles
  const styles = {
    loginContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f4f4f4',
    },
    loginCard: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
      width: '100%',
      textAlign: 'center',
    },
    input: {
      width: '100%',
      padding: '10px',
      margin: '8px 0',
      borderRadius: '4px',
      border: '1px solid #ddd',
    },
    button: {
      width: '100%',
      padding: '10px',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#007bff', // Blue background for the button
      color: '#fff',
      fontSize: '16px',
      cursor: 'pointer',
      margin: '10px 0',
    },
    googleAuth: {
      margin: '20px 0',
    },
    signupLink: {
      marginTop: '10px',
      color: '#007bff', // Blue color for the signup link
      textDecoration: 'none',
    },
    navLinkHover: {
      textDecoration: 'underline',
    },
    error: {
      color: 'red',
      margin: '10px 0',
    },
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginCard}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={styles.input}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Login</button>
        </form>
        {error && <div style={styles.error}>{error}</div>} {/* Display error message */}
        <div style={styles.googleAuth}>
          <GoogleAuth />
        </div>
        <div>
          <p>Don't have an account? <Link to="/signup" style={styles.signupLink}>Signup</Link></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
