import api from './api';
import { authStore } from '$stores/auth';
import { browser } from '$app/environment';
import { jwtDecode } from 'jwt-decode';

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      this.setSession(response.data.access_token);
      return response.data;
    } catch (error) {
      console.log("veio aqui");
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  },

  async googleLogin(idToken) {
    try {
      const response = await api.post('/auth/google/login', { idToken });
      this.setSession(response.data.access_token);
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer login com Google:', error);
      throw error;
    }
  },

  async appleLogin(idToken) {
    try {
      const response = await api.post('/auth/apple/login', { idToken });
      this.setSession(response.data.access_token);
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer login com Apple:', error);
      throw error;
    }
  },

  async switchRole(role) {
    try {
      const response = await api.post('/auth/switch-role', { role });
      this.setSession(response.data.access_token);
      return response.data;
    } catch (error) {
      console.error('Erro ao trocar papel:', error);
      throw error;
    }
  },

  setSession(token) {
    if (browser) {
      localStorage.setItem('token', token);
      
      
      const decoded = jwtDecode(token);
      const userData = {
        userId: decoded.sub,
        email: decoded.email,
        activeRole: decoded.activeRole,
        availableRoles: decoded.availableRoles
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      
      authStore.set({
        isAuthenticated: true,
        user: userData,
        token
      });
    }
  },

  logout() {
    if (browser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      
      authStore.set({
        isAuthenticated: false,
        user: null,
        token: null
      });
    }
  },

  isLoggedIn() {
    if (browser) {
      const token = localStorage.getItem('token');
      if (!token) return false;
      
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        
        return decoded.exp > currentTime;
      } catch (error) {
        return false;
      }
    }
    return false;
  },

  getCurrentUser() {
    if (browser) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
    }
    return null;
  }
};