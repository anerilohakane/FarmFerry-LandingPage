const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
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
    const response = await this.request(`/products?${queryString}`);
    console.log('API Response:', response);
    return response;
  }

  async getProductsByCategory(categoryId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products?category=${categoryId}&${queryString}`);
  }

  async getProductById(id) {
    return this.request(`/products/${id}`);
  }
}

export const apiService = new ApiService(); 