import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css'; 

const apiUrl = process.env.REACT_APP_API_URL;

function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to manage error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/auth/register`, { firstName, lastName, email, password });
      navigate('/login');
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          if (data.error === 'User already exists') {
            setError('User already exists. Login or Please use a different email to register.');
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
    signupContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f4f4f4',
    },
    signupCard: {
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
    error: {
      color: 'red',
      margin: '10px 0',
    },
  };

  return (
    <div style={styles.signupContainer}>
      <div style={styles.signupCard}>
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
            style={styles.input}
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
            style={styles.input}
          />
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
          <button type="submit" style={styles.button}>Signup</button>
          {error && <div style={styles.error}>{error}</div>} {/* Display error message */}
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
