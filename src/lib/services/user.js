// Add these functions to your existing userService in src/lib/services/user.js
// If the file doesn't exist, create it with these functions

import api from "./api";
import { authStore } from "$stores/auth";
import { get } from "svelte/store";

export const userService = {
  /**
   * Register a new user
   * @param {string} email - The user's email
   * @param {string} password - The user's password
   * @returns {Promise<Object>} Response from the server
   */
  async register(email, password) {
    try {
      const response = await api.post("/users", { email, password });
      return response.data;
    } catch (error) {
      console.error("Erro ao registrar:", error);
      throw error;
    }
  },

  /**
   * Register a new user using an invitation token
   * @param {string} email - The user's email
   * @param {string} password - The user's password
   * @param {string} token - The invitation token
   * @returns {Promise<Object>} Response from the server
   */
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

  /**
   * Soft delete user's own profile
   * @returns {Promise<Object>} Response from the server
   */
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

  /**
   * Restore a soft-deleted user
   * @returns {Promise<Object>} Response from the server
   */
  async restoreUser() {
    try {
      const response = await api.patch("/users/restore");
      return response.data;
    } catch (error) {
      console.error("Error restoring user:", error);
      throw error;
    }
  },

  /**
   * Change user's password
   * @param {string} currentPassword - The user's current password
   * @param {string} newPassword - The user's new password
   * @returns {Promise<Object>} Response from the server
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.patch("/users/change-password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  /**
   * Get current user details including deletion status
   * @returns {Promise<Object>} User data
   */
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

  /**
   * Calculate days remaining until permanent deletion
   * @param {Date} deletedAt - The date when the user was soft deleted
   * @returns {number} Days remaining until permanent deletion
   */
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
