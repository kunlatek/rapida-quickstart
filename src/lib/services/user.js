// Frontend user service to handle user registration with token

import api from "./api";
import { authStore } from "$stores/auth";
import { get } from "svelte/store";

export const userService = {
  async register(email, password) {
    try {
      const response = await api.post("/users", { email, password });
      return response.data;
    } catch (error) {
      console.error("Erro ao registrar:", error);
      throw error;
    }
  },

  async registerWithToken(email, password, token) {
    try {
      const response = await api.post("/auth/signup", {
        email,
        password,
        registerToken: token,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao registrar com token:", error);
      throw error;
    }
  },

  async invitationRegister(email, password, token) {
    try {
      const response = await api.post("/users/invitation", {
        email,
        password,
        token,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao registrar:", error);
      throw error;
    }
  },

  async softDeleteOwnProfile() {
    console.log("🔄 Iniciando processo de exclusão de conta");
    try {
      const authState = get(authStore);
      console.log("👤 Estado de autenticação:", {
        isAuthenticated: authState.isAuthenticated,
        hasUserId: !!authState.user?.userId,
        activeRole: authState.user?.activeRole,
      });

      const response = await api.delete("/users");
      console.log("✅ Conta marcada para exclusão com sucesso:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao excluir conta:", error);
      console.error("Detalhes do erro:", {
        status: error.response?.status,
        mensagem: error.response?.data?.message,
        dados: error.response?.data,
      });
      throw error;
    }
  },

  async restoreUser() {
    try {
      const response = await api.patch("/users/restore");
      return response.data;
    } catch (error) {
      console.error("Error restoring user:", error);
      throw error;
    }
  },

  async changePassword(oldPassword, newPassword) {
    try {
      const response = await api.patch("/users/change-password", {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  async getCurrentUserDetails() {
    try {
      const authState = get(authStore);
      if (!authState.isAuthenticated) {
        throw new Error("User not authenticated");
      }

      const userId = authState.user.userId;
      const response = await api.get(`/users/me`);
      return response.data;
    } catch (error) {
      console.error("Error getting user details:", error);
      throw error;
    }
  },

  calculateDaysRemaining(deletedAt) {
    if (!deletedAt) return 0;

    const deletionDate = new Date(deletedAt);
    const permanentDeletionDate = new Date(deletionDate);
    permanentDeletionDate.setDate(permanentDeletionDate.getDate() + 90);

    const today = new Date();
    const timeDiff = permanentDeletionDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return Math.max(0, daysRemaining);
  },
};

export default userService;
