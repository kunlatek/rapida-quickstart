import { writable, get } from "svelte/store";
import { browser } from "$app/environment";
import { userService } from "$services/user";
import { authStore } from "$stores/auth";

// Initial state
const initialState = {
    isDeleted: false,
    deletedAt: null,
    daysRemaining: 0,
    loading: false,
    error: null,
};

// Create the account deletion store
const accountDeletionStore = writable(initialState);

// Fetch deletion status
const fetchDeletionStatus = async () => {
    if (!browser) return;

    const authState = get(authStore);
    if (!authState.isAuthenticated) return;

    accountDeletionStore.update(state => ({ ...state, loading: true, error: null }));
    
    try {
        const userDetails = await userService.getCurrentUserDetails();
        console.log("🔄 User details:", userDetails);
        if (userDetails && userDetails.deletedAt) {
            const daysRemaining = userService.calculateDaysRemaining(userDetails.deletedAt);

            accountDeletionStore.update(state => ({
                ...state,
                isDeleted: true,
                deletedAt: userDetails.deletedAt,
                daysRemaining,
                loading: false,
            }));
        } else {
            accountDeletionStore.update(state => ({
                ...state,
                isDeleted: false,
                deletedAt: null,
                daysRemaining: 0,
                loading: false,
            }));
        }
    } catch (error) {
        console.error("Error fetching deletion status:", error);
        accountDeletionStore.update(state => ({
            ...state,
            loading: false,
            error: error.message || "Erro ao verificar status de exclusão da conta",
        }));
    }
};

// Soft delete user account
const softDeleteAccount = async () => {
    console.log("🔄 Iniciando processo no store para exclusão de conta");
    accountDeletionStore.update(state => ({ ...state, loading: true, error: null }));

    try {
        console.log("📤 Chamando userService.softDeleteOwnProfile()");
        await userService.softDeleteOwnProfile();

        console.log("✅ Exclusão bem-sucedida, atualizando store");
        const now = new Date();
        const daysRemaining = userService.calculateDaysRemaining(now);

        accountDeletionStore.update(state => ({
            ...state,
            isDeleted: true,
            deletedAt: now.toISOString(),
            daysRemaining,
            loading: false,
        }));

        return { success: true };
    } catch (error) {
        console.error("❌ Erro durante softDeleteAccount:", error);
        accountDeletionStore.update(state => ({
            ...state,
            loading: false,
            error: error.message || "Erro ao excluir conta",
        }));

        return { success: false, error };
    }
};

// Restore user account
const restoreAccount = async () => {
    accountDeletionStore.update(state => ({ ...state, loading: true, error: null }));

    try {
        await userService.restoreUser();

        accountDeletionStore.update(state => ({
            ...state,
            isDeleted: false,
            deletedAt: null,
            daysRemaining: 0,
            loading: false,
        }));

        return { success: true };
    } catch (error) {
        console.error("Error restoring account:", error);
        accountDeletionStore.update(state => ({
            ...state,
            loading: false,
            error: error.message || "Erro ao restaurar conta",
        }));

        return { success: false, error };
    }
};

// Reset the store
const resetStore = () => {
    accountDeletionStore.set(initialState);
};

// Export the store and its actions
export {
    accountDeletionStore,
    fetchDeletionStatus,
    softDeleteAccount,
    restoreAccount,
    resetStore,
};