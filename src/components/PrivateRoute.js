import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem('token'); // Check for token in localStorage
  const isAuthenticated = !!token; // Set isAuthenticated to true if token exists

  return isAuthenticated ? (
    React.cloneElement(element, { ...rest })
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
