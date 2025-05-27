import api from "./api";
import { authStore } from "$stores/auth";
import { browser } from "$app/environment";
import { jwtDecode } from "jwt-decode";
import { loadProfiles, clearProfiles } from "$stores/profile";

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post("/auth/login", { email, password });
      this.setSession(response.data.access_token);
      return response.data;
    } catch (error) {
      console.log("veio aqui");
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  },

  async googleLogin(idToken) {
    try {
      console.log("🔄 Iniciando login com Google");
      const response = await api.post("/auth/google/login", { idToken });

      if (response.data && response.data.access_token) {
        console.log("✅ Token JWT recebido após autenticação com Google");
        this.setSession(response.data.access_token);

        // Load profiles after authentication
        await loadProfiles();

        return response.data;
      } else {
        throw new Error("Resposta inválida do servidor");
      }
    } catch (error) {
      console.error("❌ Erro ao autenticar com Google:", error);
      throw error;
    }
  },

  async appleLogin(idToken) {
    try {
      const response = await api.post("/auth/apple/login", { idToken });

      if (response.data && response.data.access_token) {
        this.setSession(response.data.access_token);
        return response.data;
      } else {
        throw new Error("Resposta inválida do servidor");
      }
    } catch (error) {
      console.error("Erro ao fazer login com Apple:", error);
      throw error;
    }
  },

  async registerInit(email) {
    try {
      const response = await api.post("/auth/register-init", { email });
      return response.data;
    } catch (error) {
      console.error("Erro ao iniciar registro:", error);
      throw error;
    }
  },

  setSession(token) {
    if (browser) {
      localStorage.setItem("token", token);

      // Decode token
      const decoded = jwtDecode(token);

      console.log("Token decodificado:", decoded);

      // Store user data
      const userData = {
        userId: decoded.sub,
        email: decoded.email,
        activeRole: decoded.activeRole || null,
        availableRoles: decoded.availableRoles || [],
      };

      console.log("Dados do usuário atualizados:", userData);

      localStorage.setItem("user", JSON.stringify(userData));

      // Update auth store
      authStore.set({
        isAuthenticated: true,
        user: userData,
        token,
      });

      // Load profiles if user has active role
      if (userData.activeRole) {
        loadProfiles();
      }
    }
  },

  logout() {
    if (browser) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Clear auth store
      authStore.set({
        isAuthenticated: false,
        user: null,
        token: null,
      });

      // Clear profiles
      clearProfiles();
    }
  },

  isLoggedIn() {
    if (browser) {
      const token = localStorage.getItem("token");
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
      const userStr = localStorage.getItem("user");
      if (userStr) {
        return JSON.parse(userStr);
      }
    }
    return null;
  },

  async switchRole(role) {
    try {
      console.log("Trocando para papel:", role);
      const response = await api.post("/auth/switch-role", { role });

      if (response.data && response.data.access_token) {
        console.log(
          "Novo token recebido ao trocar papel:",
          response.data.access_token
        );

        // Update session with new token
        this.setSession(response.data.access_token);

        // Reload profiles
        await loadProfiles(true);

        // Reload page to ensure everything is updated
        setTimeout(() => {
          window.location.reload();
        }, 500);

        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao trocar de papel:", error);
      if (error.response) {
        console.error("Detalhes do erro:", error.response.data);
      }
      return false;
    }
  },

  async checkAndSetActiveRole() {
    if (!browser) return { hasRole: false };

    const user = this.getCurrentUser();
    if (!user) return { hasRole: false };

    // If user already has an active role
    if (user.activeRole) {
      // Load profiles
      await loadProfiles();
      return {
        hasRole: true,
        activeRole: user.activeRole,
        needsSelection: false,
      };
    }

    // If user has only one role, auto-select it
    if (user.availableRoles && user.availableRoles.length === 1) {
      const role = user.availableRoles[0];
      await this.switchRole(role);
      return { hasRole: true, activeRole: role, needsSelection: false };
    }

    // If user has multiple roles, need selection
    if (user.availableRoles && user.availableRoles.length > 1) {
      return {
        hasRole: true,
        needsSelection: true,
        availableRoles: user.availableRoles,
      };
    }

    // No roles available
    return { hasRole: false };
  },

  async forgotPassword(email) {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      throw error;
    }
  },

  async resetPassword(token, password) {
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      throw error;
    }
  },
};
