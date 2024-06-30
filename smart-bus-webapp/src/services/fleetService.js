// src/services/fleetService.js
import api from './api';

export const getBuses = async () => {
  const response = await api.get('/fleet/buses');
  return response.data;
};

export const getDrivers = async () => {
  const response = await api.get('/fleet/drivers');
  return response.data;
};
