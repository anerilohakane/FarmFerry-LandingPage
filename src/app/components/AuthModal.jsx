'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowLeft, Smartphone, AlertCircle, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';

const AuthModal = ({ open, onClose }) => {
  const {
    sendLoginOtp,
    loginWithPhoneOtp,
    loading
  } = useAuth();

  const [view, setView] = useState('phone-login'); // 'phone-login', 'phone-otp'
  const [formData, setFormData] = useState({
    phone: '',
    otp: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
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
      phone: '',
      otp: ''
    });
    setErrors({});
    setSuccessMessage('');
    setView('phone-login');
  };

  const validateForm = () => {
    const newErrors = {};

    if (view === 'phone-login') {
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (formData.phone.length !== 10) newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (view === 'phone-otp') {
      if (!formData.otp.trim()) newErrors.otp = 'OTP is required';
      else if (formData.otp.length !== 6) newErrors.otp = 'Please enter a 6-digit OTP';
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

  const handleSendLoginOtp = async (e) => {
    e.preventDefault();

    console.log("=== Send OTP clicked ===");
    console.log("Phone entered:", formData.phone);

    if (formData.phone.length !== 10) {
      setErrors({ phone: "Enter valid 10-digit phone number" });
      console.log("Validation failed: phone length is not 10");
      return;
    }

    try {
      setErrors({});
      setSuccessMessage("");

      const API_URL = "/api/auth/login/send-otp";
      console.log("Fetching API URL:", API_URL);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formData.phone,
        }),
      });

      console.log("Fetch completed. Response object:", res);

      if (!res.ok) {
        console.error("Response not OK. Status:", res.status);
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Response JSON data:", data);

      if (data.success) {
        setSuccessMessage("OTP sent successfully");
        setView("phone-otp");
        setResendTimer(30);
        console.log("OTP sent successfully, switching to OTP view");
      } else {
        setErrors({ general: data.message || "Failed to send OTP" });
        console.log("Backend returned failure:", data);
      }
    } catch (err) {
      console.error("OTP ERROR (fetch failed):", err);
      setErrors({
        general: "Failed to fetch. Backend or CORS issue.",
      });
    }
  };


  // const handlePhoneOtpLogin = async (e) => {
  //   e.preventDefault();

  //   console.log("=== Verify OTP clicked ===");
  //   console.log("Phone:", formData.phone);
  //   console.log("OTP:", formData.otp);

  //   if (formData.otp.length !== 6) {
  //     setErrors({ otp: "Enter valid 6-digit OTP" });
  //     return;
  //   }

  //   try {
  //     setErrors({});
  //     setSuccessMessage("");

  //     const API_URL = "http://localhost:3001/api/v1/auth/login/verify-otp";
  //     console.log("Verifying OTP at:", API_URL);

  //     const res = await fetch(API_URL, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         phone: formData.phone,
  //         otp: formData.otp,
  //       }),
  //     });

  //     console.log("Verify OTP response:", res);

  //     if (!res.ok) {
  //       throw new Error(`HTTP error! Status: ${res.status}`);
  //     }

  //     const data = await res.json();
  //     console.log("Verify OTP JSON:", data);

  //     if (data.success) {
  //       setSuccessMessage("Login successful!");

  //       // OPTIONAL: store token
  //       if (data.token) {
  //         localStorage.setItem("token", data.token);
  //       }

  //       setTimeout(() => {
  //         onClose();
  //         resetForm();
  //       }, 1000);
  //     } else {
  //       setErrors({ general: data.message || "Invalid OTP" });
  //     }
  //   } catch (err) {
  //     console.error("VERIFY OTP ERROR:", err);
  //     setErrors({
  //       general: "Failed to verify OTP. Backend or CORS issue.",
  //     });
  //   }
  // };



  const handlePhoneOtpLogin = async (e) => {
    e.preventDefault();

    console.log("=== Verify OTP clicked ===");
    console.log("Phone:", formData.phone);
    console.log("OTP:", formData.otp);

    if (formData.otp.length !== 6) {
      setErrors({ otp: "Enter valid 6-digit OTP" });
      return;
    }

    try {
      setErrors({});
      setSuccessMessage("");

      const API_URL = "/api/auth/login/verify-otp";
      console.log("Calling verify-otp:", API_URL);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formData.phone,
          otp: formData.otp,
        }),
      });

      console.log("Verify OTP response:", res);

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Verify OTP JSON:", data);

      if (data.success) {
        setSuccessMessage("Login successful!");

        // optional token save
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        setTimeout(() => {
          onClose();
          resetForm();
        }, 1000);
      } else {
        setErrors({ general: data.message || "Invalid OTP" });
      }
    } catch (err) {
      console.error("VERIFY OTP ERROR:", err);
      setErrors({
        general: "Failed to verify OTP. Backend or CORS issue.",
      });
    }
  };



  // const handlePhoneOtpLogin = async (e) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;

  //   try {
  //     const result = await loginWithPhoneOtp(formData.phone, formData.otp);
  //     if (result.success) {
  //       setSuccessMessage('Login successful!');
  //       setTimeout(() => {
  //         onClose();
  //         resetForm();
  //       }, 1000);
  //     } else {
  //       setErrors({ general: result.error });
  //     }
  //   } catch (error) {
  //     setErrors({ general: error.message });
  //   }
  // };

  const handleResendLoginOtp = async () => {
    if (!formData.phone) {
      setErrors({ general: 'Phone number not found' });
      return;
    }

    try {
      const result = await sendLoginOtp(formData.phone);
      if (result.success) {
        setSuccessMessage('OTP sent successfully!');
        setResendTimer(30); // 30 seconds cooldown
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
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 sm:p-6"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative bg-white rounded-2xl w-full max-w-md sm:max-w-lg mx-auto shadow-2xl"
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
          <div className="text-center p-6 sm:p-8">
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

            {/* Phone Login View */}
            {view === 'phone-login' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <h1 className="text-lg sm:text-xl font-bold mb-1">Welcome to FarmFerry</h1>
                  <p className="text-sm text-gray-600">Enter your phone number to login</p>
                </div>

                <form onSubmit={handleSendLoginOtp} className="space-y-3">
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-600">
                    <div className="bg-white text-gray-700 px-3 flex items-center border-r border-gray-300">
                      <Smartphone size={18} />
                    </div>
                    <div className="bg-white text-gray-700 px-2 flex items-center border-r border-gray-300 text-sm">
                      +91
                    </div>
                    <input
                      type="tel"
                      ref={inputRef}
                      className="w-full px-3 py-2.5 focus:outline-none text-sm"
                      placeholder="Enter mobile number"
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

                  <button
                    type="submit"
                    disabled={loading || formData.phone.length !== 10}
                    className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${formData.phone.length === 10 && !loading
                      ? 'bg-green-700 text-white hover:bg-green-800'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      }`}
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Phone OTP View */}
            {view === 'phone-otp' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={() => setView('phone-login')}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <h1 className="text-lg sm:text-xl font-bold flex-1 text-center">Enter OTP</h1>
                  <div className="w-10"></div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">
                    We've sent a 6-digit verification code to
                  </p>
                  <p className="text-base font-semibold text-gray-800">
                    +91{formData.phone}
                  </p>
                </div>

                <form onSubmit={handlePhoneOtpLogin} className="space-y-3">
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
                    className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${formData.otp.length === 6 && !loading
                      ? 'bg-green-700 text-white hover:bg-green-800'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      }`}
                  >
                    {loading ? 'Verifying...' : 'Verify & Login'}
                  </button>

                  <button
                    type="button"
                    onClick={handleResendLoginOtp}
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
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;