// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
  const [roles, setRoles] = useState(localStorage.getItem('roles') || null);

  const login = (token,roles) => {
    setAuthToken(token);
    setRoles(roles);
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('roles', roles);
  };

  const logout = () => {
    setAuthToken(null);
    setRoles(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('roles');

  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const roles = localStorage.getItem('roles');
    if (token) {
      setAuthToken(token);
    }
    if (roles) {
      setRoles(roles);
    }

  }, []);

  return (
    <AuthContext.Provider value={{ authToken,roles, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
