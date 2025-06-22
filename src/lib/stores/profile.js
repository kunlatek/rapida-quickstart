import { writable, get } from "svelte/store";
import { browser } from "$app/environment";
import { profileService } from "$services/profile";
import { authStore } from "$stores/auth";

// Initial state
const initialState = {
  isLoaded: false,
  person: null,
  company: null,
  loading: {
    person: false,
    company: false,
  },
  error: null,
};

// Create the writable store
const profileStore = writable(initialState);

// Helper function to get the current state
const getState = () => get(profileStore);

/**
 * Load profiles based on the current active role
 * @returns {Promise<{person: Object|null, company: Object|null}>}
 */
const loadProfiles = async (forceReload = false) => {
  if (!browser) return { person: null, company: null };

  const state = getState();
  const auth = get(authStore);

  // Return cached profiles if already loaded and not forcing reload
  if (state.isLoaded && !forceReload) {
    return {
      person: state.person,
      company: state.company,
    };
  }

  // If not authenticated, can't load profiles
  if (!auth.isAuthenticated || !auth.user) {
    profileStore.set({ ...initialState, error: "Not authenticated" });
    return { person: null, company: null };
  }

  const userId = auth.user.userId;
  const activeRole = auth.user.activeRole;

  try {
    // Reset loading state
    profileStore.update((state) => ({
      ...state,
      loading: {
        person: activeRole === "person",
        company: activeRole === "company",
      },
      error: null,
    }));

    const result = { person: null, company: null };

    // Load the profile based on active role
    if (activeRole === "person") {
      try {
        result.person = await profileService.getPersonProfileByUserId(userId);
      } catch (error) {
        console.error("Error loading person profile:", error);
      }
    } else if (activeRole === "company") {
      try {
        result.company = await profileService.getCompanyProfileByUserId(userId);
      } catch (error) {
        console.error("Error loading company profile:", error);
      }
    }

    // Update store with loaded profiles
    profileStore.update((state) => ({
      ...state,
      isLoaded: true,
      person: result.person,
      company: result.company,
      loading: {
        person: false,
        company: false,
      },
    }));

    return result;
  } catch (error) {
    console.error("Error loading profiles:", error);

    // Update store with error state
    profileStore.update((state) => ({
      ...state,
      isLoaded: false,
      loading: {
        person: false,
        company: false,
      },
      error: error.message || "Failed to load profiles",
    }));

    return { person: null, company: null };
  }
};

/**
 * Clear the profile store data
 */
const clearProfiles = () => {
  profileStore.set(initialState);
};

/**
 * Update a profile in the store after changes
 * @param {string} type - 'person' or 'company'
 * @param {Object} data - New profile data
 */
const updateProfile = (type, data) => {
  if (type !== "person" && type !== "company") {
    console.error("Invalid profile type:", type);
    return;
  }

  profileStore.update((state) => ({
    ...state,
    [type]: data,
  }));
};

// Export the store and helper functions
export { profileStore, getState, loadProfiles, clearProfiles, updateProfile };
