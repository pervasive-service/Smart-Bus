// src/services/authService.js
import api from './api';

const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/login', { username, password });
      const data = response.data;
      if (response.status === 200) {
        localStorage.setItem('token', data.token); // Store token in local storage
        return data.user;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw new Error('Login failed. Please try again.');
    }
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};

export default authService;


