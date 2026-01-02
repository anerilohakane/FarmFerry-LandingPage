'use client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    console.log('API Request URL:', url);
    console.log('Base URL:', this.baseURL);
    console.log('Endpoint:', endpoint);
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const config = {
      ...defaultOptions,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication APIs
  async registerCustomer(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }




apiService = {
  // STEP 1: Send OTP (register OR existing user)
  sendOtp: async (mobile) => {
    const res = await fetch(
      `${API_BASE_URL}//api/v1/auth/register`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile,
          name: 'FarmFerry User',
        }),
      }
    );
    return res.json();
  },

  // STEP 2: Verify OTP + Login
  verifyOtpAndLogin: async (mobile, otp) => {
    const res = await fetch(
      `${API_BASE_URL}//api/v1/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp }),
      }
    );
    return res.json();
  },
};



  async loginCustomer(credentials) {
    return this.request('/auth/login/customer', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async sendPhoneVerification(phone) {
    return this.request('/auth/send-phone-verification', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async verifyPhoneOTP(phone, otp) {
    return this.request('/auth/verify-phone-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email, role: 'customer' }),
    });
  }

  async resetPasswordWithOTP(email, otp, password) {
    return this.request('/auth/reset-password-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp, password }),
    });
  }

  async refreshToken(refreshToken) {
    return this.request('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/auth/current-user');
  }

  // Phone OTP Login APIs
  async sendLoginOtp(phone) {
    try {
      const response = await this.request('/auth/send-customer-otp', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      });
      return response;
    } catch (error) {
      console.error('Send login OTP error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send OTP'
      };
    }
  }

  async loginWithPhoneOtp(phone, otp) {
    try {
      const response = await this.request('/auth/login/customer-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp }),
      });
      return response;
    } catch (error) {
      console.error('Login with phone OTP error:', error);
      return {
        success: false,
        message: error.message || 'Failed to verify OTP'
      };
    }
  }

  // Category APIs
  async getAllCategories(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/categories?${queryString}`);
  }

  async getCategoryById(id) {
    return this.request(`/categories/${id}`);
  }

  async getCategoryTree() {
    return this.request('/categories/tree');
  }

  // Product APIs
  async getAllProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    console.log('API Request URL:', `/products?${queryString}`);
    try {
      const response = await this.request(`/products?${queryString}`);
      console.log('API Response:', response);
      
      // Ensure we have a proper response structure
      if (response && response.success) {
        // Handle different possible response structures
        const products = response.data?.products || response.data || response.products || [];
        console.log('Extracted products:', products.length);
        return {
          success: true,
          data: {
            products: products,
            pagination: response.data?.pagination || response.pagination || {}
          }
        };
      } else {
        console.error('Invalid API response structure:', response);
        return {
          success: false,
          error: 'Invalid response structure'
        };
      }
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getProductsByCategory(categoryId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products?category=${categoryId}&${queryString}`);
  }

  async getProductById(id) {
    return this.request(`/products/${id}`);
  }

  // Search Products API
  async searchProducts(query, params = {}) {
    const searchParams = new URLSearchParams({
      search: query,
      limit: 10,
      ...params
    }).toString();
    return this.request(`/products?${searchParams}`);
  }

  // Get products with active offers
  async getProductsWithOffers(params = {}) {
    const defaultParams = {
      hasActiveOffer: 'true',
      inStock: 'true',
      limit: 12,
      sort: 'offerPercentage',
      order: 'desc',
      ...params
    };
    const queryString = new URLSearchParams(defaultParams).toString();
    console.log('Fetching products with offers:', `/products?${queryString}`);
    try {
      const response = await this.request(`/products?${queryString}`);
      console.log('Products with offers response:', response);
      
      if (response && response.success) {
        const products = response.data?.products || response.data || response.products || [];
        console.log('Extracted products with offers:', products.length);
        return {
          success: true,
          data: {
            products: products,
            pagination: response.data?.pagination || response.pagination || {}
          }
        };
      } else {
        console.error('Invalid API response structure for offers:', response);
        return {
          success: false,
          error: 'Invalid response structure'
        };
      }
    } catch (error) {
      console.error('API request for offers failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Contact API
  async submitContact(contactData) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  // Settings APIs
  async getSettings() {
    return this.request('/settings');
  }

  async getDeliveryCharges() {
    return this.request('/settings/delivery-charges');
  }
}

export const apiService = new ApiService(); 