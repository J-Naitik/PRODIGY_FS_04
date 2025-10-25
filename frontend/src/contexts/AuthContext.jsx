import React, { createContext, useState, useEffect } from 'react';
import API, { setAuthToken } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('chat_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('chat_token') || null);

  useEffect(() => {
    setAuthToken(token);
    if (token && user) {
      localStorage.setItem('chat_token', token);
      localStorage.setItem('chat_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('chat_token');
      localStorage.removeItem('chat_user');
    }
  }, [token, user]);

  const login = (data) => {
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
