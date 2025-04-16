import api from './api';

export const login = (credentials: { email: string; password: string }) =>
  api.post('/auth/login', credentials);

export const register = (data: { name: string; email: string; password: string }) =>
  api.post('/auth/register', data);
