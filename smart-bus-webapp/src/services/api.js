// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/auth/', // Change this to your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const requestSignIn = async (username, password) => {
  return api.post('/login', { username, password });
};

export const requestPasswordReset = async (email) => {
  return api.post('/reset-password', { email });
};

export default api;
