// src/lib/stores/auth.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Estado inicial
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null
};

// Verificar se há dados no localStorage
if (browser) {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    initialState.isAuthenticated = true;
    initialState.token = token;
    initialState.user = JSON.parse(user);
  }
}

// Criar store writable
export const authStore = writable(initialState);
