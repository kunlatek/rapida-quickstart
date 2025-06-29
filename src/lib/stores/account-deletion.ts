import { writable, get, type Writable } from "svelte/store";
import { browser } from "$app/environment";
import { userService } from "$services/user";
import { authStore } from "$stores/auth";
import type { IAccountDeletionState } from "$lib/interfaces/account-deletion.interfaces";

const initialState: IAccountDeletionState = {
  isDeleted: false,
  deletedAt: null,
  daysRemaining: 0,
  loading: false,
  error: null,
};

const accountDeletionStore: Writable<IAccountDeletionState> =
  writable(initialState);

const fetchDeletionStatus = async () => {
  if (!browser) return;

  const authState = get(authStore);
  if (!authState.isAuthenticated) return;

  accountDeletionStore.update((state) => ({
    ...state,
    loading: true,
    error: null,
  }));

  try {
    const userDetails = await userService.getCurrentUserDetails();
    console.log("🔄 User details:", userDetails);
    if (userDetails && userDetails.deletedAt) {
      const daysRemaining = userService.calculateDaysRemaining(
        userDetails.deletedAt
      );

      accountDeletionStore.update((state) => ({
        ...state,
        isDeleted: true,
        deletedAt: userDetails.deletedAt,
        daysRemaining,
        loading: false,
      }));
    } else {
      accountDeletionStore.update((state) => ({
        ...state,
        isDeleted: false,
        deletedAt: null,
        daysRemaining: 0,
        loading: false,
      }));
    }
  } catch (error: any) {
    console.error("Error fetching deletion status:", error);
    accountDeletionStore.update((state) => ({
      ...state,
      loading: false,
      error: error.message || "Erro ao verificar status de exclusão da conta",
    }));
  }
};

const softDeleteAccount = async () => {
  console.log("🔄 Iniciando processo no store para exclusão de conta");
  accountDeletionStore.update((state) => ({
    ...state,
    loading: true,
    error: null,
  }));

  try {
    console.log("📤 Chamando userService.softDeleteOwnProfile()");
    await userService.softDeleteOwnProfile();

    console.log("✅ Exclusão bem-sucedida, atualizando store");
    const now = new Date();
    const daysRemaining = userService.calculateDaysRemaining(now.toISOString());

    accountDeletionStore.update((state) => ({
      ...state,
      isDeleted: true,
      deletedAt: now.toISOString(),
      daysRemaining,
      loading: false,
    }));

    return { success: true };
  } catch (error: any) {
    console.error("❌ Erro durante softDeleteAccount:", error);
    accountDeletionStore.update((state) => ({
      ...state,
      loading: false,
      error: error.message || "Erro ao excluir conta",
    }));

    return { success: false, error };
  }
};

const restoreAccount = async () => {
  accountDeletionStore.update((state) => ({
    ...state,
    loading: true,
    error: null,
  }));

  try {
    await userService.restoreUser();

    accountDeletionStore.update((state) => ({
      ...state,
      isDeleted: false,
      deletedAt: null,
      daysRemaining: 0,
      loading: false,
    }));

    return { success: true };
  } catch (error: any) {
    console.error("Error restoring account:", error);
    accountDeletionStore.update((state) => ({
      ...state,
      loading: false,
      error: error.message || "Erro ao restaurar conta",
    }));

    return { success: false, error };
  }
};

const resetStore = () => {
  accountDeletionStore.set(initialState);
};

export {
  accountDeletionStore,
  fetchDeletionStatus,
  softDeleteAccount,
  restoreAccount,
  resetStore,
};
