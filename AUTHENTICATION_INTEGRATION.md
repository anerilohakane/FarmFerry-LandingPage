# FarmFerry Authentication Integration

This document describes the complete authentication system integration for the FarmFerry landing page.

## Overview

The authentication system provides a complete user registration and login flow with the following features:

- **User Registration** with phone verification
- **User Login** with email/password
- **Phone Verification** via OTP
- **Password Reset** via email OTP
- **JWT Token Management** with refresh tokens
- **Persistent Authentication** using localStorage
- **Form Validation** and error handling
- **Responsive UI** with smooth animations

## Architecture

### 1. Authentication Context (`src/context/AuthContext.js`)

The `AuthContext` provides a centralized state management for authentication:

```javascript
const {
  user,                    // Current user object
  isAuthenticated,         // Authentication status
  loading,                 // Loading state
  tokens,                  // Access and refresh tokens
  register,                // Register new user
  login,                   // Login user
  logout,                  // Logout user
  sendPhoneVerification,   // Send OTP
  verifyPhoneOTP,          // Verify OTP
  forgotPassword,          // Send password reset
  resetPassword,           // Reset password
  getCurrentUser,          // Get current user
  refreshAccessToken       // Refresh token
} = useAuth();
```

### 2. API Service (`src/utils/api.js`)

Extended with authentication endpoints:

```javascript
// Authentication APIs
await apiService.registerCustomer(userData);
await apiService.loginCustomer(credentials);
await apiService.sendPhoneVerification(phone);
await apiService.verifyPhoneOTP(phone, otp);
await apiService.forgotPassword(email);
await apiService.resetPasswordWithOTP(email, otp, password);
await apiService.refreshToken(refreshToken);
await apiService.logout();
await apiService.getCurrentUser();
```

### 3. AuthModal Component (`src/app/components/AuthModal.jsx`)

A comprehensive modal component with multiple views:

- **Login View**: Email/password login
- **Register View**: User registration with validation
- **Verify View**: Phone OTP verification
- **Forgot Password View**: Email-based password reset
- **Reset Password View**: OTP-based password reset

## Features

### 1. User Registration Flow

1. **Registration Form**: Collects name, email, phone, and password
2. **Validation**: Client-side validation for all fields
3. **Backend Registration**: Calls `/auth/register` endpoint
4. **Phone Verification**: Automatically sends OTP to phone
5. **OTP Verification**: User enters 6-digit OTP
6. **Success**: User can now login

### 2. User Login Flow

1. **Login Form**: Email and password fields
2. **Validation**: Basic field validation
3. **Backend Login**: Calls `/auth/login/customer` endpoint
4. **Phone Verification Check**: If phone not verified, redirects to verification
5. **Token Storage**: Stores access and refresh tokens
6. **Success**: User is authenticated

### 3. Phone Verification

- **Automatic OTP**: Sent during registration
- **Manual Resend**: 60-second cooldown timer
- **OTP Validation**: 6-digit numeric validation
- **Success Handling**: Redirects to login after verification

### 4. Password Reset

- **Email Input**: User enters email address
- **OTP Delivery**: System sends OTP to email
- **OTP Verification**: User enters 6-digit OTP
- **New Password**: User sets new password
- **Success**: Password updated, redirects to login

### 5. Token Management

- **Access Token**: Short-lived (1 day) for API calls
- **Refresh Token**: Long-lived (7 days) for token refresh
- **Automatic Refresh**: Handles token expiration
- **Secure Storage**: HTTP-only cookies + localStorage backup

## Backend Integration

### Required Backend Endpoints

The system expects the following backend endpoints:

```javascript
// Registration
POST /api/v1/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123"
}

// Login
POST /api/v1/auth/login/customer
{
  "email": "john@example.com",
  "password": "password123"
}

// Phone Verification
POST /api/v1/auth/send-phone-verification
{
  "phone": "1234567890"
}

POST /api/v1/auth/verify-phone-otp
{
  "phone": "1234567890",
  "otp": "123456"
}

// Password Reset
POST /api/v1/auth/forgot-password
{
  "email": "john@example.com",
  "role": "customer"
}

POST /api/v1/auth/reset-password-otp
{
  "email": "john@example.com",
  "otp": "123456",
  "password": "newpassword123"
}

// Token Management
POST /api/v1/auth/refresh-token
{
  "refreshToken": "token_here"
}

POST /api/v1/auth/logout

GET /api/v1/auth/current-user
```

### Expected Response Format

All endpoints should return responses in this format:

```javascript
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

## Environment Configuration

Create a `.env.local` file in the project root:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:9000/api/v1

# Frontend URL (for password reset links)
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

## Usage

### 1. Using the AuthModal

```javascript
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const MyComponent = () => {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowAuthModal(true)}>
        {isAuthenticated ? 'Logout' : 'Login'}
      </button>
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};
```

### 2. Using Authentication State

```javascript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>Welcome, {user.firstName}!</div>
      ) : (
        <div>Please login to continue</div>
      )}
    </div>
  );
};
```

### 3. Protected Routes

```javascript
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

const ProtectedComponent = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <div>Protected content here</div>;
};
```

## Error Handling

The system includes comprehensive error handling:

- **Form Validation**: Client-side validation with error messages
- **API Errors**: Backend error messages displayed to user
- **Network Errors**: Graceful handling of network failures
- **Token Errors**: Automatic logout on invalid tokens

## Security Features

- **Password Hashing**: Backend handles password hashing
- **JWT Tokens**: Secure token-based authentication
- **HTTP-only Cookies**: Secure token storage
- **Input Validation**: Client and server-side validation
- **Rate Limiting**: Backend should implement rate limiting

## Testing

The authentication system can be tested with:

1. **Registration Flow**: Complete registration with phone verification
2. **Login Flow**: Login with valid credentials
3. **Phone Verification**: OTP verification process
4. **Password Reset**: Complete password reset flow
5. **Token Management**: Token refresh and logout
6. **Error Scenarios**: Invalid credentials, network errors, etc.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend allows frontend origin
2. **Token Issues**: Check token expiration and refresh logic
3. **Phone Verification**: Verify SMS service configuration
4. **Email Delivery**: Check email service configuration

### Debug Mode

Enable debug logging by adding to browser console:

```javascript
localStorage.setItem('debug-auth', 'true');
```

## Future Enhancements

- **Social Login**: Google, Facebook integration
- **Two-Factor Authentication**: Additional security layer
- **Remember Me**: Extended session management
- **Account Linking**: Link multiple accounts
- **Profile Management**: User profile editing
- **Session Management**: Multiple device handling

## Backend Requirements

The backend must implement:

1. **User Model**: Customer schema with required fields
2. **Authentication Middleware**: JWT verification
3. **SMS Service**: OTP delivery via SMS
4. **Email Service**: Password reset emails
5. **Rate Limiting**: Prevent abuse
6. **Input Validation**: Server-side validation
7. **Error Handling**: Proper error responses
8. **Logging**: Authentication events logging

This authentication system provides a robust, secure, and user-friendly authentication experience for the FarmFerry application. 