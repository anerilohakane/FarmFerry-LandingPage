'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart, X, Minus, Plus, Trash, Info, Clock, Package, CheckCircle, Shield, PhoneCall, ArrowRight, LogIn, Truck, Mail, User, Lock, Smartphone, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';

// Auth Modal Component
function AuthModal({ open, onClose }) {
  const [view, setView] = useState('login'); // 'login', 'register', 'verify'
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setMobile('');
    setName('');
    setEmail('');
    setPassword('');
    setOtp('');
    setView('login');
  };

  // Update handleLogin to use email and password
  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      // Simulate login API call
      setTimeout(() => {
        setIsLoading(false);
        alert(`Logged in with ${email}`);
        onClose();
      }, 1000);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name || !email || !mobile || !password) {
      alert('Please fill all fields');
      return;
    }
    
    setIsLoading(true);
    // Simulate registration API call
    setTimeout(() => {
      setIsLoading(false);
      setView('verify');
    }, 1500);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      alert('Please enter 6-digit OTP');
      return;
    }
    
    setIsVerifying(true);
    // Simulate verification API call
    setTimeout(() => {
      setIsVerifying(false);
      alert('Registration successful!');
      onClose();
    }, 1000);
  };

  const handleResendOtp = () => {
    alert('New OTP sent to your mobile');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="relative bg-white rounded-3xl w-[90vw] max-w-sm p-6 text-center mt-18 overflow-y-auto hide-scrollbar" style={{ maxHeight: '83vh' }}>
        <button
          className="absolute left-5 top-5 p-2 rounded-full hover:bg-gray-100 transition"
          onClick={() => {
            resetForm();
            onClose();
          }}
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="flex justify-center mb-6 mt-6">
          <Image
            src="/images/farmferry-logo.png"
            alt="Logo"
            width={124}
            height={124}
            className="rounded-xl"
          />
        </div>

        {view === 'login' && (
          <>
            <h1 className="text-2xl font-extrabold mb-2">Welcome back</h1>
            <p className="text-base text-gray-600 mb-6">Log in to continue</p>
            <form onSubmit={handleLogin}>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden mb-4 focus-within:ring-2 focus-within:ring-green-600">
                <div className="bg-white text-gray-700 px-4 flex items-center border-r border-gray-300 select-none">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  ref={inputRef}
                  className="w-full px-4 py-3 focus:outline-none text-lg"
                  placeholder="Enter email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden mb-6 focus-within:ring-2 focus-within:ring-green-600">
                <div className="bg-white text-gray-700 px-4 flex items-center border-r border-gray-300 select-none">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  className="w-full px-4 py-3 focus:outline-none text-lg"
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={!email || !password || isLoading}
                className={`w-full py-3 rounded-lg text-lg font-semibold transition-colors duration-300 mb-4 ${
                  email && password && !isLoading 
                    ? 'bg-green-700 text-white hover:bg-green-800' 
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
              >
                {isLoading ? 'Logging in...' : 'Continue'}
              </button>
              <div className="text-sm text-gray-500 mb-4">OR</div>
              <button
                type="button"
                onClick={() => setView('register')}
                className="w-full py-3 rounded-lg text-lg font-semibold border border-green-700 text-green-700 hover:bg-green-50 transition"
              >
                Create New Account
              </button>
            </form>
          </>
        )}

        {view === 'register' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={() => setView('login')}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-extrabold flex-1 text-center">Create Account</h1>
              <div className="w-8"></div>
            </div>
            
            <p className="text-base text-gray-600 mb-6">Join us today! It takes only few minutes</p>
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-600">
                <div className="bg-white text-gray-500 px-4 flex items-center border-r border-gray-300">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  className="w-full px-4 py-3 focus:outline-none text-lg"
                  placeholder="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-600">
                <div className="bg-white text-gray-500 px-4 flex items-center border-r border-gray-300">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  className="w-full px-4 py-3 focus:outline-none text-lg"
                  placeholder="Email Address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-600">
                <div className="bg-white text-gray-500 px-4 flex items-center border-r border-gray-300">
                  <Smartphone size={20} />
                </div>
                <div className="bg-white text-gray-700 px-2 flex items-center border-r border-gray-300 select-none">
                  +91
                </div>
                <input
                  type="tel"
                  className="w-full px-4 py-3 focus:outline-none text-lg"
                  placeholder="Mobile Number"
                  value={mobile}
                  maxLength={10}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setMobile(val);
                  }}
                  required
                />
              </div>
              
              <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-600">
                <div className="bg-white text-gray-500 px-4 flex items-center border-r border-gray-300">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  className="w-full px-4 py-3 focus:outline-none text-lg"
                  placeholder="Create Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-lg text-lg font-semibold transition-colors duration-300 ${
                  !isLoading 
                    ? 'bg-green-700 text-white hover:bg-green-800' 
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
              >
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>
            
            <p className="text-xs text-gray-400 mt-4 px-4">
              By continuing, you agree to our{' '}
              <a href="#" target="_blank" rel="noopener noreferrer" className="underline">
                Terms of Service
              </a>{' '}
              &{' '}
              <a href="#" target="_blank" rel="noopener noreferrer" className="underline">
                Privacy Policy
              </a>
            </p>
          </>
        )}

        {view === 'verify' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={() => setView('register')}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-extrabold flex-1 text-center">Verify Phone</h1>
              <div className="w-8"></div>
            </div>
            
            <p className="text-base text-gray-600 mb-2">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-lg font-semibold text-gray-800 mb-6">
              +91{mobile}
            </p>
            
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-600">
                <input
                  type="tel"
                  className="w-full px-4 py-3 focus:outline-none text-lg text-center tracking-widest"
                  placeholder="000000"
                  value={otp}
                  maxLength={6}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(val);
                  }}
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={otp.length !== 6 || isVerifying}
                className={`w-full py-3 rounded-lg text-lg font-semibold transition-colors duration-300 ${
                  otp.length === 6 && !isVerifying
                    ? 'bg-green-700 text-white hover:bg-green-800' 
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
              >
                {isVerifying ? 'Verifying...' : 'Verify & Continue'}
              </button>
              
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-green-700 text-sm font-medium hover:underline"
              >
                Didn't receive code? Resend OTP
              </button>
            </form>
          </>
        )}
      </div>
      <style jsx global>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'products', label: 'Products' },
  { id: 'about', label: 'How it works' },
  { id: 'about-us', label: 'About us' },
  { id: 'contact', label: 'Contact' }
];

const Navbar = () => {
  const { 
    cart, 
    cartOpen, 
    setCartOpen, 
    increaseQty, 
    decreaseQty, 
    removeFromCart, 
    getCartTotal, 
    getCartItemCount,
    deliveryCharges,
    loadingCharges,
    getDeliveryCharges,
    getGrandTotal
  } = useCart();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const itemsTotal = getCartTotal();
  const charges = getDeliveryCharges();
  const grandTotal = getGrandTotal();

  const scrollToSection = (sectionId) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerHeight = document.querySelector('header')?.offsetHeight || 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const redirectToPlayStore = () => {
    window.open('https://play.google.com/store/apps/details?id=com.farmferry.app', '_blank');
  };

  return (
    <>
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <header className="fixed w-full top-0 z-50 bg-white shadow-sm">
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            <div className="flex justify-between h-20 items-center">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <img
                    className="h-16 w-auto"
                    src="/images/farmferry-logo.png"
                    alt="Farm Ferry"
                    draggable={false}
                  />
                </div>
              </div>
              <nav className="hidden md:flex items-center space-x-10">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-gray-800 hover:text-green-600 px-3 py-2 text-base font-semibold transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="flex items-center gap-5">
                <button
                    onClick={redirectToPlayStore}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-md text-base font-semibold flex items-center shadow-sm hover:shadow-md"
                  >
                    Download the App
                    <svg
                      className="ml-2 -mr-1 h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2 border border-green-600 text-green-600 rounded-md font-semibold hover:bg-green-50"
                  >
                    {isLoggedIn ? 'Logout' : 'Login'}
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setCartOpen(true)}
                      className="p-2 rounded-full border border-gray-200 bg-green-50 text-green-700 shadow hover:bg-green-600 hover:text-white hover:border-green-600 transition"
                      aria-label="Open cart"
                    >
                      <ShoppingCart size={24} />
                      {getCartItemCount() > 0 && (
                        <span className="absolute top-0 right-0 -mt-1 -mr-1 rounded-full bg-green-600 px-1 text-xs text-white font-semibold">
                          {getCartItemCount()}
                        </span>
                      )}
                    </button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-[998]"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30 }}
              className="fixed top-0 right-0 w-full sm:max-w-md h-full bg-white z-[999] flex flex-col shadow-xl overflow-y-auto hide-scrollbar"
            >
              <div className="flex items-center justify-between p-6 pb-3 border-b sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="text-green-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-800">My Cart</h2>
                  {getCartItemCount() > 0 && (
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                      {getCartItemCount()} item{getCartItemCount() > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <button
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition hover:text-gray-700"
                  onClick={() => setCartOpen(false)}
                  aria-label="Close cart"
                >
                  <X size={20} />
                </button>
              </div>
              
              {cart.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col items-center justify-center p-6 text-center"
                >
                  <div className="bg-green-50 p-6 rounded-full mb-4">
                    <ShoppingCart size={48} className="text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart feels light</h3>
                  <p className="text-gray-500 mb-6 max-w-md">
                    Your shopping cart is waiting to be filled! Explore our fresh products and add something special.
                  </p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm"
                  >
                    Browse Products
                  </button>
                </motion.div>
              ) : (
                <>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 flex items-start gap-4 mx-4 my-4 rounded-xl border border-green-100"
                  >
                    <div className="bg-white p-2 rounded-full shadow-sm border border-green-200 mt-1">
                      <Clock size={20} className="text-green-600" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        Delivery in {deliveryCharges.deliveryTime}
                        {deliveryCharges.isFreeDelivery && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full flex items-center">
                            <CheckCircle size={14} className="mr-1" /> Free Delivery
                          </span>
                        )}
                      </div>
                      <div className="text-gray-600 text-sm mt-1">
                        {getCartItemCount()} item{getCartItemCount() > 1 ? 's' : ''} • {deliveryCharges.deliveryDate}
                      </div>
                    </div>
                  </motion.div>
                  
                  <div className="px-4 pb-4 space-y-3">
                    {cart.map(item => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="relative">
                            <Image
                              src={item.image}
                              width={72}
                              height={72}
                              alt={item.name}
                              className="rounded-lg object-cover border border-gray-100"
                              onError={(e) => {
                                e.target.src = '/images/explore/tomato.png';
                              }}
                            />
                            {item.discountedPrice && (
                              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                SALE
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-gray-800 truncate">{item.name}</h4>
                            <div className="text-gray-500 text-xs">{item.unit}</div>
                            <div className="mt-1 flex items-center">
                              <span className="font-bold text-green-700">
                                ₹{((item.discountedPrice || item.price) * item.qty).toFixed(2)}
                              </span>
                              {item.discountedPrice && item.discountedPrice < item.price && (
                                <span className="text-gray-400 text-xs line-through ml-2">
                                  ₹{(item.price * item.qty).toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => {
                                if (item.qty === 1) {
                                  removeFromCart(item._id);
                                } else {
                                  decreaseQty(item._id);
                                }
                              }}
                              className={`bg-gray-50 w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition ${
                                item.qty === 1 ? "" : ""
                              }`}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="bg-white px-2 py-1 font-medium text-gray-800 text-sm w-8 text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => increaseQty(item._id)}
                              className="bg-gray-50 w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl mx-4 my-4 px-5 py-4 border border-gray-100">
                    <h3 className="font-bold text-lg mb-3 text-gray-800">Order Summary</h3>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">₹{itemsTotal.toFixed(2)}</span>
                      </div>
                      
                      {loadingCharges ? (
                        <div className="flex justify-between items-center py-1 animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-center pt-2">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Truck size={14} className="text-gray-500" />
                              <span>Delivery</span>
                              <button className="text-gray-400 hover:text-gray-600" title="Delivery charges may vary">
                                <Info size={14} />
                              </button>
                            </div>
                            <span className={charges.isFreeDelivery ? "text-green-600 font-medium" : ""}>
                              {charges.isFreeDelivery ? "FREE" : `₹${charges.deliveryCharge}`}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Package size={14} className="text-gray-500" />
                              <span>Handling</span>
                            </div>
                            <span>₹{charges.handlingCharge}</span>
                          </div>
                          
                          {charges.showSmallCartCharge && (
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-1 text-gray-600">
                                <ShoppingCart size={14} className="text-gray-500" />
                                <span>Small order</span>
                              </div>
                              <span>₹{charges.smallCartCharge}</span>
                            </div>
                          )}
                        </>
                      )}
                      
                      <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                        <span className="font-semibold text-gray-700">Total</span>
                        <span className="font-bold text-lg text-green-700">₹{grandTotal.toFixed(2)}</span>
                      </div>
                      
                      {charges.isFreeDelivery && (
                        <div className="bg-green-50 text-green-700 text-sm p-2 rounded mt-2 flex items-center gap-2">
                          <CheckCircle size={16} />
                          You saved ₹{deliveryCharges.deliveryCharge} on delivery!
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 shadow-sm">
                    <button
                      onClick={() => {
                        if (!isLoggedIn) {
                          setCartOpen(false);
                          setTimeout(() => setShowAuthModal(true), 300);
                        } else {
                          // Proceed to checkout
                        }
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors shadow-md"
                    >
                      {isLoggedIn ? (
                        <>
                          Proceed to Checkout
                          <ArrowRight className="ml-2" size={18} />
                        </>
                      ) : (
                        <>
                          Login to Continue
                          <LogIn className="ml-2" size={18} />
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-2">
                      By continuing, you agree to our Terms & Conditions
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;