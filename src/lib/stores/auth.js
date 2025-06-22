import { writable, get } from "svelte/store";
import { browser } from "$app/environment";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

if (browser) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token && user) {
    initialState.isAuthenticated = true;
    initialState.token = token;
    initialState.user = JSON.parse(user);
  }
}

// Criar o store primeiro
const authStore = writable(initialState);

// Agora podemos adicionar métodos ao objeto store
const getState = () => get(authStore);

// Exportar o store com os métodos adicionados
export { authStore, getState };
