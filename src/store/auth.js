// Import the 'create' function from the 'zustand' library.
import { create } from 'zustand';

// Import the 'mountStoreDevtool' function from the 'simple-zustand-devtools' library.
import { mountStoreDevtool } from 'simple-zustand-devtools';

// Create a custom Zustand store named 'useAuthStore' using the 'create' function.
const useAuthStore = create((set, get) => ({
    // Define the 'allUserData' state variable and initialize it from localStorage or null.
    allUserData: (() => {
        try {
            const stored = localStorage.getItem('user_data');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    })(),

    // Define the 'loading' state variable and initialize it to false.
    loading: false,

    // Define the 'lastFetchTime' to track when user data was last fetched
    lastFetchTime: (() => {
        try {
            return localStorage.getItem('user_data_fetch_time') ? parseInt(localStorage.getItem('user_data_fetch_time')) : 0;
        } catch {
            return 0;
        }
    })(),

    // Define a function 'user' that returns an object with user-related data.
    user: () => ({
        user_id: get().allUserData?.id || null,
        username: get().allUserData?.email || null,
    }),

    // Define a function 'setUser' that allows setting the 'allUserData' state and persists to localStorage.
    setUser: (user) => {
        set({ allUserData: user });
        if (user) {
            localStorage.setItem('user_data', JSON.stringify(user));
            localStorage.setItem('user_data_fetch_time', Date.now().toString());
        } else {
            localStorage.removeItem('user_data');
            localStorage.removeItem('user_data_fetch_time');
        }
    },

    // Define a function 'setLoading' that allows setting the 'loading' state.
    setLoading: (loading) => set({ loading }),

    // Define a function to check if data needs to be refreshed (30 minutes = 1800000ms)
    shouldRefreshUserData: () => {
        const lastFetch = get().lastFetchTime;
        const thirtyMinutesInMs = 30 * 60 * 1000;
        return Date.now() - lastFetch > thirtyMinutesInMs;
    },

    // Define a function 'isLoggedIn' that checks if 'allUserData' is not null.
    isLoggedIn: () => get().allUserData !== null,
}));

// Conditionally attach the DevTools only in a development environment.
if (import.meta.env.DEV) {
    mountStoreDevtool('Store', useAuthStore);
}

// Export the 'useAuthStore' for use in other parts of the application.
export { useAuthStore };
