'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, ArrowLeft, Mail, User, Lock, Smartphone, ArrowRight, LogIn, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';

const AuthModal = ({ open, onClose }) => {
  const { 
    register, 
    login, 
    sendPhoneVerification, 
    verifyPhoneOTP, 
    forgotPassword, 
    resetPassword,
    loading 
  } = useAuth();

  const [view, setView] = useState('login'); // 'login', 'register', 'verify', 'forgot-password', 'reset-password'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
    if (!open) {
      resetForm();
    }
  }, [open]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      otp: ''
    });
    setErrors({});
    setSuccessMessage('');
    setView('login');
    setCurrentCustomer(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (view === 'register') {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (formData.phone.length !== 10) newErrors.phone = 'Please enter a valid 10-digit phone number';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    if (view === 'login') {
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.password) newErrors.password = 'Password is required';
    }

    if (view === 'verify') {
      if (!formData.otp.trim()) newErrors.otp = 'OTP is required';
      else if (formData.otp.length !== 6) newErrors.otp = 'Please enter a 6-digit OTP';
    }

    if (view === 'forgot-password') {
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    }

    if (view === 'reset-password') {
      if (!formData.otp.trim()) newErrors.otp = 'OTP is required';
      else if (formData.otp.length !== 6) newErrors.otp = 'Please enter a 6-digit OTP';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await login({
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        setSuccessMessage('Login successful!');
        setTimeout(() => {
          onClose();
          resetForm();
        }, 1000);
      } else if (result.requiresPhoneVerification) {
        setCurrentCustomer(result.customer);
        setView('verify');
        setSuccessMessage('Please verify your phone number to continue');
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: error.message });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      if (result.success) {
        setCurrentCustomer(result.customer);
        setView('verify');
        setSuccessMessage('Registration successful! Please verify your phone number.');
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: error.message });
    }
  };

  const handleSendOTP = async () => {
    if (!currentCustomer?.phone) {
      setErrors({ general: 'Phone number not found' });
      return;
    }

    try {
      const result = await sendPhoneVerification(currentCustomer.phone);
      if (result.success) {
        setSuccessMessage('OTP sent successfully!');
        setResendTimer(60); // 60 seconds cooldown
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: error.message });
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await verifyPhoneOTP(currentCustomer.phone, formData.otp);
      if (result.success) {
        setSuccessMessage('Phone verified successfully! You can now login.');
        setTimeout(() => {
          setView('login');
          setFormData(prev => ({ ...prev, email: currentCustomer.email }));
        }, 2000);
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: error.message });
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await forgotPassword(formData.email);
      if (result.success) {
        setSuccessMessage('Password reset OTP sent to your email!');
        setView('reset-password');
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: error.message });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await resetPassword(formData.email, formData.otp, formData.password);
      if (result.success) {
        setSuccessMessage('Password reset successful! You can now login.');
        setTimeout(() => {
          setView('login');
        }, 2000);
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: error.message });
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 mt-20"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative bg-white rounded-2xl w-full max-w-sm mx-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition z-10"
            onClick={handleClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Content container */}
          <div className={`text-center ${view === 'register' ? 'p-4' : 'p-6'}`}>
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <Image
                src="/images/farmferry-logo.png"
                alt="Logo"
                width={80}
                height={80}
                className="rounded-xl"
              />
            </div>

            {/* Success Message */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
              >
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-sm text-green-700">{successMessage}</span>
              </motion.div>
            )}

            {/* Error Message */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
              >
                <AlertCircle size={16} className="text-red-600" />
                <span className="text-sm text-red-700">{errors.general}</span>
              </motion.div>
            )}

            {/* Login View */}
            {view === 'login' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <h1 className="text-xl font-bold mb-1">Welcome back</h1>
                  <p className="text-sm text-gray-600">Log in to continue</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-3">
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-600">
                    <div className="bg-white text-gray-700 px-3 flex items-center border-r border-gray-300">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      ref={inputRef}
                      className="w-full px-3 py-2.5 focus:outline-none text-sm"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs text-left">{errors.email}</p>}
                  
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-600">
                    <div className="bg-white text-gray-700 px-3 flex items-center border-r border-gray-300">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full px-3 py-2.5 focus:outline-none text-sm"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="bg-white text-gray-700 px-3 flex items-center border-l border-gray-300"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs text-left">{errors.password}</p>}
                  
                  <button
                    type="submit"
                    disabled={loading || !formData.email || !formData.password}
                    className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      formData.email && formData.password && !loading 
                        ? 'bg-green-700 text-white hover:bg-green-800' 
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {loading ? 'Logging in...' : 'Continue'}
                  </button>
                  
                  <div className="text-xs text-gray-500">OR</div>
                  
                  <button
                    type="button"
                    onClick={() => setView('register')}
                    className="w-full py-2.5 rounded-lg text-sm font-semibold border border-green-700 text-green-700 hover:bg-green-50 transition"
                  >
                    Create New Account
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setView('forgot-password')}
                    className="text-green-700 text-sm font-medium hover:underline"
                  >
                    Forgot Password?
                  </button>
                </form>
              </motion.div>
            )}

            {/* Register View */}
            {view === 'register' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                <div className="flex justify-between items-center mb-3">
                  <button 
                    onClick={() => setView('login')}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <h1 className="text-xl font-bold flex-1 text-center">Create Account</h1>
                  <div className="w-10"></div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">Join us today! It takes only few minutes</p>
                
                <form onSubmit={handleRegister} className="space-y-2.5">
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-600">
                    <div className="bg-white text-gray-500 px-3 flex items-center border-r border-gray-300">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      className="w-full px-3 py-2 focus:outline-none text-sm"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs text-left">{errors.name}</p>}
                  
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-600">
                    <div className="bg-white text-gray-500 px-3 flex items-center border-r border-gray-300">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      className="w-full px-3 py-2 focus:outline-none text-sm"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs text-left">{errors.email}</p>}
                  
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-600">
                    <div className="bg-white text-gray-500 px-3 flex items-center border-r border-gray-300">
                      <Smartphone size={16} />
                    </div>
                    <div className="bg-white text-gray-700 px-2 flex items-center border-r border-gray-300 text-sm">
                      +91
                    </div>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 focus:outline-none text-sm"
                      placeholder="Mobile Number"
                      value={formData.phone}
                      maxLength={10}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        handleInputChange('phone', val);
                      }}
                      required
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs text-left">{errors.phone}</p>}
                  
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-600">
                    <div className="bg-white text-gray-500 px-3 flex items-center border-r border-gray-300">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full px-3 py-2 focus:outline-none text-sm"
                      placeholder="Create Password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="bg-white text-gray-700 px-3 flex items-center border-l border-gray-300"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs text-left">{errors.password}</p>}
                  
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-600">
                    <div className="bg-white text-gray-500 px-3 flex items-center border-r border-gray-300">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full px-3 py-2 focus:outline-none text-sm"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="bg-white text-gray-700 px-3 flex items-center border-l border-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs text-left">{errors.confirmPassword}</p>}
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors mt-4 ${
                      !loading 
                        ? 'bg-green-700 text-white hover:bg-green-800' 
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {loading ? 'Creating account...' : 'Sign Up'}
                  </button>
                </form>
                
                <p className="text-xs text-gray-400 mt-3 px-2">
                  By continuing, you agree to our{' '}
                  <a href="#" target="_blank" rel="noopener noreferrer" className="underline">
                    Terms of Service
                  </a>{' '}
                  &{' '}
                  <a href="#" target="_blank" rel="noopener noreferrer" className="underline">
                    Privacy Policy
                  </a>
                </p>
              </motion.div>
            )}

            {/* Verify View */}
            {view === 'verify' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <button 
                    onClick={() => setView('register')}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <h1 className="text-xl font-bold flex-1 text-center">Verify Phone</h1>
                  <div className="w-10"></div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">
                    We've sent a 6-digit verification code to
                  </p>
                  <p className="text-base font-semibold text-gray-800">
                    +91{currentCustomer?.phone}
                  </p>
                </div>
                
                <form onSubmit={handleVerifyOTP} className="space-y-3">
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-600">
                    <input
                      type="tel"
                      className="w-full px-4 py-2.5 focus:outline-none text-sm text-center tracking-widest"
                      placeholder="000000"
                      value={formData.otp}
                      maxLength={6}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        handleInputChange('otp', val);
                      }}
                      required
                    />
                  </div>
                  {errors.otp && <p className="text-red-500 text-xs text-left">{errors.otp}</p>}
                  
                  <button
                    type="submit"
                    disabled={formData.otp.length !== 6 || loading}
                    className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      formData.otp.length === 6 && !loading
                        ? 'bg-green-700 text-white hover:bg-green-800' 
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {loading ? 'Verifying...' : 'Verify & Continue'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={resendTimer > 0 || loading}
                    className="text-green-700 text-sm font-medium hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {resendTimer > 0 
                      ? `Resend OTP in ${resendTimer}s` 
                      : "Didn't receive code? Resend OTP"
                    }
                  </button>
                </form>
              </motion.div>
            )}

            {/* Forgot Password View */}
            {view === 'forgot-password' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <button 
                    onClick={() => setView('login')}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <h1 className="text-xl font-bold flex-1 text-center">Forgot Password</h1>
                  <div className="w-10"></div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  Enter your email address and we'll send you a password reset OTP.
                </p>
                
                <form onSubmit={handleForgotPassword} className="space-y-3">
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-600">
                    <div className="bg-white text-gray-700 px-3 flex items-center border-r border-gray-300">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      className="w-full px-3 py-2.5 focus:outline-none text-sm"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs text-left">{errors.email}</p>}
                  
                  <button
                    type="submit"
                    disabled={loading || !formData.email}
                    className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      formData.email && !loading 
                        ? 'bg-green-700 text-white hover:bg-green-800' 
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {loading ? 'Sending...' : 'Send Reset OTP'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Reset Password View */}
            {view === 'reset-password' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <button 
                    onClick={() => setView('forgot-password')}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <h1 className="text-xl font-bold flex-1 text-center">Reset Password</h1>
                  <div className="w-10"></div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  Enter the OTP sent to your email and create a new password.
                </p>
                
                <form onSubmit={handleResetPassword} className="space-y-3">
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-600">
                    <input
                      type="tel"
                      className="w-full px-4 py-2.5 focus:outline-none text-sm text-center tracking-widest"
                      placeholder="Enter 6-digit OTP"
                      value={formData.otp}
                      maxLength={6}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        handleInputChange('otp', val);
                      }}
                      required
                    />
                  </div>
                  {errors.otp && <p className="text-red-500 text-xs text-left">{errors.otp}</p>}
                  
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-600">
                    <div className="bg-white text-gray-500 px-3 flex items-center border-r border-gray-300">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full px-3 py-2 focus:outline-none text-sm"
                      placeholder="New Password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="bg-white text-gray-700 px-3 flex items-center border-l border-gray-300"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs text-left">{errors.password}</p>}
                  
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-600">
                    <div className="bg-white text-gray-500 px-3 flex items-center border-r border-gray-300">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full px-3 py-2 focus:outline-none text-sm"
                      placeholder="Confirm New Password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="bg-white text-gray-700 px-3 flex items-center border-l border-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs text-left">{errors.confirmPassword}</p>}
                  
                  <button
                    type="submit"
                    disabled={loading || formData.otp.length !== 6 || !formData.password || !formData.confirmPassword}
                    className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      formData.otp.length === 6 && formData.password && formData.confirmPassword && !loading
                        ? 'bg-green-700 text-white hover:bg-green-800' 
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal; 