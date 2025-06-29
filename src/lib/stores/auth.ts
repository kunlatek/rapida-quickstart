import { writable, get, type Writable } from "svelte/store";
import { browser } from "$app/environment";
import type { AuthStoreType } from "$lib/interfaces/auth.interfaces";

const initialState: AuthStoreType = {
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

const authStore: Writable<AuthStoreType> = writable(initialState);

const getState = (): AuthStoreType => get(authStore);

export { authStore, getState };
