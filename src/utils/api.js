'use client';

const API_BASE_URL = '/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}, isRetry = false) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    // console.log('API Request URL:', url); // Reduced logging

    // Inject token if available
    const savedTokens = typeof window !== 'undefined' ? localStorage.getItem('farmferry-tokens') : null;
    let authHeader = {};
    let currentRefreshToken = null;

    if (savedTokens) {
      try {
        const tokens = JSON.parse(savedTokens);
        if (tokens.accessToken) {
          authHeader = { 'Authorization': `Bearer ${tokens.accessToken}` };
        }
        if (tokens.refreshToken) {
          currentRefreshToken = tokens.refreshToken;
        }
      } catch (e) {
        console.error('Error parsing tokens for API request:', e);
      }
    }

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...options.headers,
      },
    };

    const config = {
      ...defaultOptions,
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401 && !isRetry) {
        // Skip auto-refresh for auth endpoints to prevent loops
        if (!endpoint.includes('/auth/login') && !endpoint.includes('/auth/register') && !endpoint.includes('/auth/refresh-token') && !endpoint.includes('/auth/logout')) {
          console.log('401 detected, attempting token refresh...');

          if (currentRefreshToken) {
            try {
              const refreshResponse = await fetch(`${this.baseURL}/auth/refresh-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: currentRefreshToken })
              });

              if (refreshResponse.ok) {
                const data = await refreshResponse.json();
                if (data.success && data.data) {
                  console.log('Token refreshed successfully');
                  // Update tokens in storage
                  const newTokens = {
                    accessToken: data.data.accessToken,
                    refreshToken: data.data.refreshToken || currentRefreshToken
                  };
                  localStorage.setItem('farmferry-tokens', JSON.stringify(newTokens));

                  // Retry original request with new token (recursive call will read new token)
                  return this.request(endpoint, options, true);
                }
              } else {
                console.warn('Token refresh failed with status:', refreshResponse.status);
                // Clear tokens immediately to prevent repeated failed requests
                localStorage.removeItem('farmferry-tokens');
                localStorage.removeItem('farmferry-user');
              }
            } catch (refreshErr) {
              console.warn('Auto-refresh failed:', refreshErr);
              localStorage.removeItem('farmferry-tokens');
              localStorage.removeItem('farmferry-user');
            }
          }

          // If refresh failed or not possible, trigger logout
          if (typeof window !== 'undefined') {
            console.warn('Authentication failed, triggering logout...');
            window.dispatchEvent(new Event('auth:unauthorized'));
          }
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return null;
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

  async logout(token) {
    return this.request('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async getCurrentUser() {
    return this.request('/auth/current-user');
  }

  // Phone OTP Login APIs
  async sendLoginOtp(phone) {
    try {
      const response = await this.request('/auth/login/send-otp', {
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
      const response = await this.request('/auth/login/verify-otp', {
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
    // Fetch products locally and derive categories to ensure sidebar lists CATEGORIES, not PRODUCTS
    try {
      // Use local proxy to fetch raw products
      const response = await this.request(`/products?limit=100`);

      if (response.success && (response.data?.items || response.data?.products)) {
        const products = response.data.items || response.data.products || [];
        const allCategories = new Map();

        // 1. Collect all categories from products
        products.forEach(p => {
          if (p.categoryId && typeof p.categoryId === 'object') {
            const c = p.categoryId;
            if (c._id && c.name) {
              if (!allCategories.has(c._id)) {
                allCategories.set(c._id, {
                  ...c,
                  image: c.image || c.image?.url || "https://images.unsplash.com/photo-1563636619-e143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
                  count: 0
                });
              }
              allCategories.get(c._id).count++;

              // Parent handling
              if (c.parent && typeof c.parent === 'object' && c.parent._id) {
                if (!allCategories.has(c.parent._id)) {
                  allCategories.set(c.parent._id, {
                    ...c.parent,
                    image: c.parent.image || "https://images.unsplash.com/photo-1563636619-e143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
                    count: 0
                  });
                }
              }
            }
          }
        });

        // 2. Resolve Relationships (Manual Fixes from previous logic)
        let freshVegId = null;
        let leafyGreensId = null;
        let dairyEggsId = null;
        let milkId = null;
        let rootVegId = null; // New check

        for (const [id, cat] of allCategories.entries()) {
          const lowerName = cat.name.toLowerCase();
          if (cat.name === 'Fresh Vegetables') freshVegId = id;
          if (cat.name === 'Leafy Greens') leafyGreensId = id;
          if (lowerName.includes('dairy') && lowerName.includes('eggs')) dairyEggsId = id;
          if (cat.name === 'Milk') milkId = id;
        }

        if (freshVegId && leafyGreensId) {
          allCategories.get(leafyGreensId).parent = { _id: freshVegId, name: allCategories.get(freshVegId).name };
        }

        if (milkId) {
          if (!dairyEggsId) {
            dairyEggsId = 'virtual-dairy-eggs';
            allCategories.set(dairyEggsId, {
              _id: dairyEggsId,
              name: 'Dairy & Eggs',
              image: { url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
              count: 0
            });
          }
          const milk = allCategories.get(milkId);
          const dairy = allCategories.get(dairyEggsId);
          milk.parent = { _id: dairyEggsId, name: dairy.name };
          dairy.count = (dairy.count || 0) + (milk.count || 0);
        }

        // 3. Filter
        let results = Array.from(allCategories.values());
        if (params.parent === 'null') {
          results = results.filter(c => !c.parent);
        } else if (params.parent) {
          results = results.filter(c => {
            const pId = c.parent?._id || c.parent;
            return String(pId) === String(params.parent);
          });
        }

        return {
          success: true,
          data: results
        };
      }

      return { success: false, data: [] };
    } catch (error) {
      console.error("API Error in getAllCategories:", error);
      return { success: false, data: [] };
    }
  }

  async getCategoryById(id) {
    try {
      // Workaround: fetch all and find, since direct ID endpoint might be unstable or different
      const response = await this.getAllCategories();
      if (response.success) {
        // Handle both 'categories' array or direct array
        const categories = response.data.categories || response.data?.items || response.data || [];
        const cat = Array.isArray(categories) ? categories.find(c => c._id === id || c.id === id) : null;

        if (cat) {
          return {
            success: true,
            data: { category: cat }
          };
        }
      }
      return { success: false, message: 'Category not found' };
    } catch (error) {
      console.error('Error in getCategoryById workaround:', error);
      return { success: false, message: error.message };
    }
  }

  async getCategoryTree() {
    return this.request('/categories/tree').catch(() => ({ success: true, data: [] }));
  }

  // Product APIs
  async getAllProducts(params = {}) {
    const defaultParams = { limit: 100, ...params };
    const queryString = new URLSearchParams(defaultParams).toString();
    console.log('Fetching products via local proxy:', queryString);
    try {
      // Use local proxy
      const response = await this.request(`/products?${queryString}`);

      if (response && response.success) {
        return response;
      }
      return { success: false, data: { products: [] } };
    } catch (error) {
      console.error("API Error in getAllProducts:", error);
      return { success: false, data: { products: [] } };
    }
  }




  async getProductsByCategory(categoryId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products?category=${categoryId}&${queryString}`);
  }

  async getProductById(id) {
    try {
      console.log(`Fetching product ${id} from production`);
      // 1. Try direct endpoint
      const response = await fetch(`https://farm-ferry-backend-new.vercel.app/api/v1/supplier/products/${id}`);

      if (response.ok) {
        const json = await response.json();
        if (json && json.success) {
          return json; // Direct fetch worked
        }
      }

      console.warn(`Direct fetch for ${id} failed (Status: ${response.status}), attempting fallback list search...`);

      // 2. Fallback: Fetch list and find
      const listResponse = await fetch(`https://farm-ferry-backend-new.vercel.app/api/v1/supplier/products?limit=100`);
      if (listResponse.ok) {
        const listJson = await listResponse.json();
        if (listJson && listJson.success) {
          const items = listJson.data?.items || listJson.data?.products || [];
          const product = items.find(p => p._id === id || p.id === id);

          if (product) {
            console.log("Found product in fallback list");
            return {
              success: true,
              data: product
            };
          }
        }
      }

      return { success: false, message: 'Product not found in list' };

    } catch (error) {
      console.error('API request failed in getProductById:', error);
      return { success: false, message: error.message };
    }
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

  // Address APIs
  async getAddresses() {
    return this.request('/customer/addresses');
  }

  async addAddress(addressData) {
    console.log('Sending address data:', addressData);
    return this.request('/customer/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  }

  async deleteAddress(id) {
    return this.request(`/customer/addresses/${id}`, {
      method: 'DELETE',
    });
  }

  async setDefaultAddress(id) {
    // Assuming PUT to the specific address or the collection to set default
    // Common pattern: PUT /customer/addresses/:id { isDefault: true }
    // Or PUT /customer/addresses/default { id }
    // Let's try the specific resource update first for now, or probe if needed.
    // Given the previous 405s on /profile, I'll bet on the ID path.
    return this.request(`/customer/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ isDefault: true }),
    });
  }

  // Wishlist APIs
  async getWishlist(userId) {
    if (!userId) {
      console.warn("getWishlist: userId is missing");
      return { success: false, message: "User ID is required" };
    }
    return this.request(`/wishlist?userId=${userId}`);
  }

  async addToWishlist(userId, productId) {
    if (!userId || !productId) {
      return { success: false, message: "User ID and Product ID are required" };
    }
    return this.request('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ userId, productId }),
    });
  }

  async removeFromWishlist(userId, productId) {
    if (!userId || !productId) {
      return { success: false, message: "User ID and Product ID are required" };
    }
    return this.request(`/wishlist?userId=${userId}&productId=${productId}`, {
      method: 'DELETE',
    });
  }

  // Cart methods
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId, quantity, userId) {
    console.log('API: addToCart called with:', { productId, quantity, userId });
    const body = { productId, quantity };
    if (userId) {
      body.userId = userId;
    }
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async updateCartItem(itemId, quantity) {
    return this.request(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
  }

  async removeFromCart(itemId) {
    return this.request(`/cart/items/${itemId}`, {
      method: 'DELETE'
    });
  }

  async clearCart() {
    return this.request('/cart', {
      method: 'DELETE'
    });
  }
  async placeOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async getMyOrders() {
    return this.request('/orders/customer');
  }

  async createReview(reviewData) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  }

  async getReviews(productId) {
    return this.request(`/reviews?productId=${productId}`);
  }

  async rateOrder(orderId, rating, feedback) {
    return this.request(`/orders/${orderId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating, feedback })
    });
  }

  async cancelOrder(orderId, reason) {
    return this.request(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'cancelled', note: reason })
    });
  }
}


export const apiService = new ApiService(); 