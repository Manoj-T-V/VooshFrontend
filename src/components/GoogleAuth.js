import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const GoogleAuth = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = async (response) => {
    const { credential } = response;

    try {
      // Send the ID token to your backend for validation and session management
      const res = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken: credential }), // Send the token in the request body
      });

      if (res.ok) {
        // Assuming the backend sends a token or user data
        const data = await res.json();
        localStorage.setItem('token', data.token); // Store token in localStorage if needed
        navigate('/tasks'); // Redirect on successful login
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login', error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={(error) => console.error('Login failed', error)}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
