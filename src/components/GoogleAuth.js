import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;
const GoogleAuth = () => {
  const navigate = useNavigate();
  
  const handleLoginSuccess = async (response) => {
  const { credential } = response;
  const user = jwtDecode(credential);

  const userInfo = {
    firstName: user.given_name,
    lastName: user.family_name,
    email: user.email,
    googleId: user.sub,
    picture: user.picture,
    emailVerified: user.email_verified,
  };

  try {
    const res = await axios.post(`${apiUrl}/api/auth/signingoogle`, userInfo);
    console.log(res.data.token);
    localStorage.setItem('token', res.data.token);
    navigate('/tasks');
  } catch (error) {
    console.error('Error handling login success:', error);
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
