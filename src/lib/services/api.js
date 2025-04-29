import axios from 'axios';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';


const api = axios.create({
 baseURL: '/api', // Modificado para usar o proxy configurado no Vite
 timeout: 10000,
 headers: {
  'Content-Type': 'application/json'
 }
});


api.interceptors.request.use(
 config => {
  if (browser) {
   const token = localStorage.getItem('token');
   if (token) {
    config.headers.Authorization = `Bearer ${token}`;
   }
  }
  return config;
 },
 error => Promise.reject(error)
);


api.interceptors.response.use(
 response => response,
 error => {
  const { response } = error;
  
  
  if (response && response.status === 401) {
   if (browser) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    goto('/auth/login');
   }
  }
  
  return Promise.reject(error);
 }
);

export default api;