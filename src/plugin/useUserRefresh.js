import { useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/auth';
import apiInstance from '../utils/axios';
import Cookies from 'js-cookie';

/**
 * Custom hook to manage user data refresh every 30 minutes
 * Automatically refetches user profile if 30 minutes have passed since last fetch
 */
export const useUserRefresh = () => {
    const accessToken = Cookies.get('access_token');
    const setUser = useAuthStore((state) => state.setUser);
    const shouldRefresh = useAuthStore((state) => state.shouldRefreshUserData);

    // Callback to fetch and update user data
    const refreshUserData = useCallback(async () => {
        if (!accessToken) return;

        try {
            const response = await apiInstance.get('user/me', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setUser(response.data);
        } catch (error) {
            console.log('Error refreshing user data:', error);
        }
    }, [accessToken, setUser]);

    // Set up interval to check every 5 minutes if refresh is needed
    useEffect(() => {
        if (!accessToken) return;

        // Check immediately on mount if refresh is needed
        if (shouldRefresh()) {
            refreshUserData();
        }

        // Set up interval to check every 5 minutes
        const interval = setInterval(() => {
            if (shouldRefresh()) {
                refreshUserData();
            }
        }, 5 * 60 * 1000); // Check every 5 minutes

        return () => clearInterval(interval);
    }, [accessToken, refreshUserData, shouldRefresh]);

    return refreshUserData;
};
