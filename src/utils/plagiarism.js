import apiInstance from './axios';
import Cookies from 'js-cookie';

const accessToken = Cookies.get('access_token');

/**
 * Run a plagiarism check on a project
 * @param {number} projectId - The project ID to check
 * @param {string} checkType - 'local' or 'premium'
 * @param {string} premiumProvider - 'copyscape', 'turnitin', or 'plagscan' (for premium checks)
 * @returns {Promise<Object>} - The plagiarism check result
 */
export const runPlagiarismCheck = async (projectId, checkType = 'local', premiumProvider = null) => {
    try {
        const payload = {
            project_id: projectId,
            check_type: checkType,
        };

        // Add premium provider if premium check
        if (checkType === 'premium' && premiumProvider) {
            payload.premium_provider = premiumProvider;
        }

        const response = await apiInstance.post('plagiarism/check/', payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Get all plagiarism checks for authenticated user
 * @param {number} page - Page number for pagination
 * @param {number} pageSize - Results per page
 * @returns {Promise<Object>} - List of plagiarism checks
 */
export const getPlagiarismChecks = async (page = 1, pageSize = 10) => {
    try {
        const response = await apiInstance.get('plagiarism/checks/', {
            params: {
                page,
                page_size: pageSize,
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Get specific plagiarism check details
 * @param {number} checkId - The check ID
 * @returns {Promise<Object>} - Detailed plagiarism check result
 */
export const getPlagiarismCheckDetails = async (checkId) => {
    try {
        const response = await apiInstance.get(`plagiarism/checks/${checkId}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Get all plagiarism checks for a specific project
 * @param {number} projectId - The project ID
 * @returns {Promise<Object>} - List of plagiarism checks for the project
 */
export const getProjectPlagiarismChecks = async (projectId) => {
    try {
        const response = await apiInstance.get(`plagiarism/project/${projectId}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Determine plagiarism severity based on percentage
 * @param {number} percentage - The plagiarism percentage
 * @returns {Object} - Severity info with color and label
 */
export const getPlagiarismSeverity = (percentage) => {
    if (percentage < 20) {
        return { level: 'low', color: 'green', label: 'Low Risk', icon: 'fa-check-circle' };
    } else if (percentage < 50) {
        return { level: 'medium', color: 'yellow', label: 'Medium Risk', icon: 'fa-exclamation-triangle' };
    } else if (percentage < 75) {
        return { level: 'high', color: 'orange', label: 'High Risk', icon: 'fa-exclamation-circle' };
    } else {
        return { level: 'critical', color: 'red', label: 'Critical', icon: 'fa-times-circle' };
    }
};
