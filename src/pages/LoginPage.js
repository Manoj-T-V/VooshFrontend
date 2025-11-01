
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import GoogleAuth from '../components/GoogleAuth';

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
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: '#f4f7fb',
    },
    animatedBg: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none',
    },
    loginCard: {
      width: '420px',
      maxWidth: '97vw',
      padding: '36px 28px 28px 28px',
      borderRadius: '20px',
      background: '#fff',
      boxShadow: '0 8px 40px 0 rgba(80,80,180,0.13)',
      border: '1.5px solid #e3eafc',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 1,
      position: 'relative',
    },
    heading: {
      fontSize: '2em',
      fontWeight: 900,
      color: '#2575fc',
      marginBottom: '18px',
      letterSpacing: '1px',
      textAlign: 'center',
      textShadow: '0 2px 12px #a6c1ee44',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      margin: '12px 0',
      borderRadius: '7px',
      border: '1.5px solid #bdbdbd',
      boxSizing: 'border-box',
      fontSize: '1.08em',
      background: '#f8fafc',
      transition: 'border 0.2s',
    },
    button: {
      width: '100%',
      padding: '14px',
      borderRadius: '7px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.13em',
      color: '#fff',
      background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
      marginTop: '18px',
      fontWeight: 700,
      letterSpacing: '0.5px',
      boxShadow: '0 2px 8px 0 rgba(80,80,180,0.10)',
      transition: 'background 0.2s, box-shadow 0.2s',
    },
    googleAuth: {
      margin: '20px 0',
    },
    signupLink: {
      marginTop: '10px',
      color: '#2575fc',
      textDecoration: 'none',
      fontWeight: 600,
      fontSize: '1.04em',
      letterSpacing: '0.2px',
    },
    error: {
      color: 'red',
      margin: '10px 0',
    },
    float1: {
      position: 'absolute',
      width: 110,
      height: 110,
      borderRadius: '50%',
      background: 'radial-gradient(circle at 30% 30%, #a1c4fd 80%, #c2e9fb 100%)',
      top: 60,
      left: 40,
      opacity: 0.32,
      filter: 'blur(1.5px)',
      zIndex: 0,
    },
    float2: {
      position: 'absolute',
      width: 70,
      height: 70,
      borderRadius: '50%',
      background: 'radial-gradient(circle at 70% 70%, #fbc2eb 70%, #f8fafc 100%)',
      bottom: 80,
      right: 60,
      opacity: 0.22,
      filter: 'blur(1.2px)',
      zIndex: 0,
    },
    float3: {
      position: 'absolute',
      width: 55,
      height: 55,
      borderRadius: '50%',
      background: 'radial-gradient(circle at 50% 50%, #b2f7ef 70%, #e0c3fc 100%)',
      top: 180,
      right: 120,
      opacity: 0.18,
      filter: 'blur(1.2px)',
      zIndex: 0,
    },
  };

  return (
    <div style={styles.loginContainer}>
      {/* Animated floating shapes background */}
      <motion.div
        style={styles.animatedBg}
        aria-hidden="true"
      >
        <motion.div
          style={styles.float1}
          animate={{
            y: [0, 24, 0],
            x: [0, 18, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          style={styles.float2}
          animate={{
            y: [0, -18, 0],
            x: [0, -14, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        />
        <motion.div
          style={styles.float3}
          animate={{
            y: [0, 12, 0],
            x: [0, 9, 0],
            scale: [1, 1.09, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
        />
      </motion.div>
      {/* Card content with entrance and hover animation */}
      <motion.div
        style={styles.loginCard}
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 60, damping: 14 }}
        whileHover={{ scale: 1.025, boxShadow: '0 10px 32px 0 rgba(80,80,180,0.18)' }}
      >
        <div style={styles.heading}>
          <span role="img" aria-label="lock" style={{fontSize: '1.3em'}}>🔒</span>
          Login
        </div>
        <form onSubmit={handleSubmit} style={{width: '100%'}}>
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
        {error && <div style={styles.error}>{error}</div>}
        <div style={styles.googleAuth}>
          <GoogleAuth />
        </div>
        <div>
          <p>Don't have an account? <Link to="/signup" style={styles.signupLink}>Signup</Link></p>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
