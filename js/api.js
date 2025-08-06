// ATNT API Client
class ATNTApi {
    constructor() {
        this.baseURL = window.location.origin;
        this.token = localStorage.getItem('atnt_token');
        this.user = JSON.parse(localStorage.getItem('atnt_user') || 'null');
    }

    // Helper method for making API requests
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}/api${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers.Authorization = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Authentication methods
    async register(userData) {
        try {
            const response = await this.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            });

            this.token = response.accessToken;
            this.user = response.user;
            
            localStorage.setItem('atnt_token', this.token);
            localStorage.setItem('atnt_user', JSON.stringify(this.user));

            return response;
        } catch (error) {
            throw error;
        }
    }

    async login(credentials) {
        try {
            const response = await this.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials)
            });

            this.token = response.accessToken;
            this.user = response.user;
            
            localStorage.setItem('atnt_token', this.token);
            localStorage.setItem('atnt_user', JSON.stringify(this.user));

            return response;
        } catch (error) {
            throw error;
        }
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('atnt_token');
        localStorage.removeItem('atnt_user');
    }

    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    getCurrentUser() {
        return this.user;
    }

    // User profile methods
    async getProfile() {
        return await this.request('/user/profile');
    }

    async updateProfile(profileData) {
        return await this.request('/user/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    // Company methods
    async getCompanies(filters = {}) {
        const params = new URLSearchParams(filters);
        return await this.request(`/companies?${params}`);
    }

    async getCompany(symbol) {
        return await this.request(`/companies/${symbol}`);
    }

    // Watchlist methods
    async getWatchlists() {
        return await this.request('/watchlists');
    }

    async createWatchlist(watchlistData) {
        return await this.request('/watchlists', {
            method: 'POST',
            body: JSON.stringify(watchlistData)
        });
    }

    async updateWatchlist(id, watchlistData) {
        return await this.request(`/watchlists/${id}`, {
            method: 'PUT',
            body: JSON.stringify(watchlistData)
        });
    }

    async deleteWatchlist(id) {
        return await this.request(`/watchlists/${id}`, {
            method: 'DELETE'
        });
    }

    // Alert methods
    async getAlerts() {
        return await this.request('/alerts');
    }

    async createAlert(alertData) {
        return await this.request('/alerts', {
            method: 'POST',
            body: JSON.stringify(alertData)
        });
    }

    async deleteAlert(id) {
        return await this.request(`/alerts/${id}`, {
            method: 'DELETE'
        });
    }

    // Event methods
    async getEvents(filters = {}) {
        const params = new URLSearchParams(filters);
        return await this.request(`/events?${params}`);
    }

    async getEvent(id) {
        return await this.request(`/events/${id}`);
    }

    // Search methods
    async search(query, type = null) {
        const params = new URLSearchParams({ q: query });
        if (type) params.append('type', type);
        return await this.request(`/search?${params}`);
    }

    // Analytics methods
    async getDashboardAnalytics() {
        return await this.request('/analytics/dashboard');
    }
}

// Global API instance
window.api = new ATNTApi();

// Utility functions for UI integration
window.ATNTUtils = {
    // Show loading state
    showLoading(element) {
        if (element) {
            element.style.opacity = '0.6';
            element.style.pointerEvents = 'none';
        }
    },

    // Hide loading state
    hideLoading(element) {
        if (element) {
            element.style.opacity = '1';
            element.style.pointerEvents = 'auto';
        }
    },

    // Show success message
    showSuccess(message) {
        this.showNotification(message, 'success');
    },

    // Show error message
    showError(message) {
        this.showNotification(message, 'error');
    },

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            font-weight: 500;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);

        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    },

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    },

    // Format percentage
    formatPercentage(value) {
        return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
    },

    // Redirect if not authenticated
    requireAuth() {
        if (!window.api.isAuthenticated()) {
            window.location.href = '/pages/login.html';
            return false;
        }
        return true;
    },

    // Update user info in UI
    updateUserInfo() {
        const user = window.api.getCurrentUser();
        if (user) {
            // Update user name displays
            document.querySelectorAll('.user-name').forEach(el => {
                el.textContent = `${user.firstName} ${user.lastName}`;
            });

            // Update user email displays
            document.querySelectorAll('.user-email').forEach(el => {
                el.textContent = user.email;
            });

            // Update user tier displays
            document.querySelectorAll('.user-tier').forEach(el => {
                el.textContent = user.tier;
            });
        }
    }
};

// Auto-update user info when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.ATNTUtils.updateUserInfo();
});

console.log('🚀 ATNT API Client loaded');
console.log('📡 Ready to connect to backend server');