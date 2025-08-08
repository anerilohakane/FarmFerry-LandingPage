'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState({
    accessToken: null,
    refreshToken: null
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const savedUser = localStorage.getItem('farmferry-user');
        const savedTokens = localStorage.getItem('farmferry-tokens');
        
        if (savedUser && savedTokens) {
          const userData = JSON.parse(savedUser);
          const tokenData = JSON.parse(savedTokens);
          
          setUser(userData);
          setTokens(tokenData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        // Clear invalid data
        localStorage.removeItem('farmferry-user');
        localStorage.removeItem('farmferry-tokens');
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // Save user and tokens to localStorage
  useEffect(() => {
    if (user && tokens.accessToken) {
      localStorage.setItem('farmferry-user', JSON.stringify(user));
      localStorage.setItem('farmferry-tokens', JSON.stringify(tokens));
    } else {
      localStorage.removeItem('farmferry-user');
      localStorage.removeItem('farmferry-tokens');
    }
  }, [user, tokens]);

  // Register customer
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await apiService.registerCustomer(userData);
      
      if (response.success) {
        // Registration successful, but phone verification required
        return {
          success: true,
          requiresPhoneVerification: response.data.requiresPhoneVerification,
          customer: response.data.customer,
          message: response.message
        };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  // Send phone verification OTP
  const sendPhoneVerification = async (phone) => {
    try {
      setLoading(true);
      const response = await apiService.sendPhoneVerification(phone);
      
      if (response.success) {
        return {
          success: true,
          message: response.message
        };
      } else {
        throw new Error(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  // Verify phone OTP
  const verifyPhoneOTP = async (phone, otp) => {
    try {
      setLoading(true);
      const response = await apiService.verifyPhoneOTP(phone, otp);
      
      if (response.success) {
        // Phone verified, now user can login
        return {
          success: true,
          message: response.message
        };
      } else {
        throw new Error(response.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  // Login customer
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await apiService.loginCustomer(credentials);
      
      if (response.success) {
        const { customer, accessToken, refreshToken } = response.data;
        
        // Check if phone verification is required
        if (response.data.requiresPhoneVerification) {
          return {
            success: false,
            requiresPhoneVerification: true,
            customer: customer,
            message: response.message
          };
        }
        
        // Login successful
        setUser(customer);
        setTokens({ accessToken, refreshToken });
        setIsAuthenticated(true);
        
        return {
          success: true,
          user: customer,
          message: response.message
        };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const response = await apiService.forgotPassword(email);
      
      if (response.success) {
        return {
          success: true,
          message: response.message
        };
      } else {
        throw new Error(response.message || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  // Reset password with OTP
  const resetPassword = async (email, otp, password) => {
    try {
      setLoading(true);
      const response = await apiService.resetPasswordWithOTP(email, otp, password);
      
      if (response.success) {
        return {
          success: true,
          message: response.message
        };
      } else {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      // Call logout API if user is authenticated
      if (isAuthenticated && tokens.accessToken) {
        await apiService.logout();
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local state regardless of API call success
      setUser(null);
      setTokens({ accessToken: null, refreshToken: null });
      setIsAuthenticated(false);
    }
  };

  // Get current user
  const getCurrentUser = async () => {
    try {
      if (!tokens.accessToken) {
        throw new Error('No access token');
      }
      
      const response = await apiService.getCurrentUser();
      
      if (response.success) {
        setUser(response.data.user);
        return {
          success: true,
          user: response.data.user
        };
      } else {
        throw new Error(response.message || 'Failed to get user');
      }
    } catch (error) {
      console.error('Get current user error:', error);
      // If token is invalid, logout
      logout();
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Refresh token
  const refreshAccessToken = async () => {
    try {
      if (!tokens.refreshToken) {
        throw new Error('No refresh token');
      }
      
      const response = await apiService.refreshToken(tokens.refreshToken);
      
      if (response.success) {
        const { accessToken, refreshToken } = response.data;
        setTokens({ accessToken, refreshToken });
        return {
          success: true,
          accessToken,
          refreshToken
        };
      } else {
        throw new Error(response.message || 'Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout
      logout();
      return {
        success: false,
        error: error.message
      };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    tokens,
    register,
    login,
    logout,
    sendPhoneVerification,
    verifyPhoneOTP,
    forgotPassword,
    resetPassword,
    getCurrentUser,
    refreshAccessToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 