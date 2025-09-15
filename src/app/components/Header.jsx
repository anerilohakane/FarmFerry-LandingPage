'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import {
  ShoppingCart, X, Minus, Plus, Info, Clock, Package,
  CheckCircle, Shield, PhoneCall, ArrowRight, LogIn, Truck,
  UserCircle, MapPin, HelpCircle, ArrowLeft, CreditCard,
  Home, Box, Users, Phone, Download, LogOut, PartyPopper
} from 'lucide-react';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import AuthModal from './AuthModal';
import AddressList from './AddressList';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'products', label: 'Products', icon: Box },
    { id: 'about', label: 'How it works', icon: Info },
    { id: 'about-us', label: 'About us', icon: Users },
    { id: 'contact', label: 'Contact', icon: Phone }
  ];

  const accountItems = [
    {
      id: 'orders',
      label: 'My Orders',
      icon: Package,
      action: () => {
        window.location.href = '/profile?section=orders';
        setProfileOpen(false);
      }
    },
    {
      id: 'addresses',
      label: 'Saved Addresses',
      icon: MapPin,
      action: () => {
        setCheckoutStep('address');
        setCartOpen(true);
        setProfileOpen(false);
      }
    },
    {
      id: 'faqs',
      label: "FAQ'S",
      icon: HelpCircle,
      action: () => {
        window.location.href = '/profile?section=faqs';
        setProfileOpen(false);
      }
    },
    {
      id: 'privacy',
      label: 'Account Privacy',
      icon: Shield,
      action: () => {
        window.location.href = '/profile?section=privacy';
        setProfileOpen(false);
      }
    },
  ];

  const paymentMethods = [
    { id: 'online', label: 'Online Payment', icon: CreditCard },
    { id: 'cod', label: 'Cash on Delivery', icon: Truck }
  ];

  const {
    cart,
    cartOpen,
    setCartOpen,
    increaseQty,
    decreaseQty,
    removeFromCart,
    getCartItemCount,
    getCartTotal,
    getDeliveryCharges,
    getGrandTotal,
    clearCart
  } = useCart();

  const { user, isAuthenticated, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [userClosedCart, setUserClosedCart] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);

  const cartItemCount = getCartItemCount();
  const itemsTotal = getCartTotal();
  const charges = getDeliveryCharges();
  const grandTotal = getGrandTotal();

  const getToken = useCallback(() => {
    try {
      const savedTokens = localStorage.getItem('farmferry-tokens');
      const parsedTokens = savedTokens ? JSON.parse(savedTokens) : null;
      return parsedTokens?.accessToken;
    } catch (err) {
      console.error('Error getting token:', err);
      return null;
    }
  }, []);

  const scrollToSection = useCallback((sectionId) => {
    if (pathname !== '/') {
      if (sectionId === 'home') {
        router.push('/');
      } else {
        router.push(`/#${sectionId}`);
      }
      setCartOpen(false);
      setProfileOpen(false);
      return;
    }

    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }

    setCartOpen(false);
    setProfileOpen(false);
  }, [setCartOpen, setProfileOpen, pathname, router]);

  const API_KEY = process.env.NEXT_PUBLIC_API_BASE_URL;
  const redirectToPlayStore = useCallback(() => {
    window.open('https://play.google.com/store/apps/details?id=com.farmferry.app', '_blank');
  }, []);

  const handleAuthAction = useCallback(() => {
    if (isAuthenticated) {
      logout();
      setProfileOpen(false);
    } else {
      setShowAuthModal(true);
      setProfileOpen(false);
    }
  }, [isAuthenticated, logout]);

  const handleProceedToCheckout = useCallback(() => {
    if (!isAuthenticated) {
      setIsClosing(true);
      setCartOpen(false);
      setTimeout(() => {
        setShowAuthModal(true);
        setIsClosing(false);
      }, 300);
    } else {
      setCheckoutStep('address');
    }
  }, [isAuthenticated, setCartOpen]);

  const fetchUserAddresses = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_KEY}/customers/addresses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const addresses = await response.json();
        try {
          localStorage.setItem('user-addresses', JSON.stringify(addresses));
        } catch (error) {
          console.error('Error caching addresses:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  }, [API_KEY, getToken]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserAddresses();
    }
  }, [isAuthenticated, fetchUserAddresses]);

  const handleAddressSelect = useCallback((address) => {
    setSelectedAddress(address);
  }, []);

  const handleProceedToPayment = useCallback(() => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }
    setCheckoutStep('payment');
  }, [selectedAddress]);

  const handlePaymentSelection = useCallback((methodId) => {
    setSelectedPayment(methodId);
  }, []);

  const handleBackToCart = useCallback(() => {
    setCheckoutStep('cart');
  }, []);

  const handleBackToAddress = useCallback(() => {
    setCheckoutStep('address');
  }, []);

  useEffect(() => {
    if (cart.length > 0 && !cartOpen && !isClosing && !userClosedCart) {
      setCartOpen(true);
    }

    if (cart.length === 0) {
      setUserClosedCart(false);
    }
  }, [cart.length, cartOpen, isClosing, setCartOpen, userClosedCart]);

  const handleCloseCart = useCallback(() => {
    setIsClosing(true);
    setUserClosedCart(true);
    setCartOpen(false);
    setTimeout(() => {
      setCheckoutStep('cart');
      setIsClosing(false);
      setSelectedAddress(null);
      setSelectedPayment('');
    }, 300);
  }, [setCartOpen]);

  const createOrder = useCallback(async (orderData) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch(`${API_KEY}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      if (response.ok) {
        return result;
      } else {
        if (response.status === 401) {
          logout();
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(result.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }, [getToken, API_KEY, logout]);

  const prepareOrderData = useCallback(() => {
    if (!user?._id) {
      throw new Error('User information is missing');
    }

    if (!cart || cart.length === 0) {
      throw new Error('Cart is empty');
    }

    if (!selectedAddress) {
      throw new Error('Delivery address is required');
    }

    const requiredAddressFields = ['street', 'city', 'state', 'postalCode', 'country', 'phone'];
    const missingFields = requiredAddressFields.filter(field => !selectedAddress[field]);

    if (missingFields.length > 0) {
      throw new Error(`Delivery address is missing required fields: ${missingFields.join(', ')}`);
    }

    const paymentMethodMap = {
      'cod': 'cash_on_delivery',
      'online': 'credit_card',
      'card': 'credit_card',
      'credit_card': 'credit_card',
      'debit_card': 'debit_card',
      'upi': 'upi',
      'wallet': 'wallet',
      'bank_transfer': 'bank_transfer'
    };

    const backendPaymentMethod = paymentMethodMap[selectedPayment] || 'cash_on_delivery';

    return {
      customer: user._id,
      supplier: cart[0]?.supplier?._id || null,
      items: cart.map(item => ({
        product: item.product?._id || item._id,
        quantity: item.qty || item.quantity || 1,
        price: item.price || 0,
        discountedPrice: item.discountedPrice || item.price || 0,
        variation: item.variation || {},
        totalPrice: (item.discountedPrice || item.price || 0) * (item.qty || item.quantity || 1)
      })),
      subtotal: itemsTotal,
      discountAmount: 0,
      gst: charges.gst || 0,
      platformFee: charges.platformFee || 0,
      handlingFee: 0,
      deliveryCharge: charges.isFreeDelivery ? 0 : charges.deliveryCharge || 0,
      totalAmount: grandTotal,
      paymentMethod: backendPaymentMethod,
      paymentStatus: 'pending',
      deliveryAddress: {
        street: selectedAddress.street,
        city: selectedAddress.city,
        state: selectedAddress.state,
        postalCode: selectedAddress.postalCode,
        country: selectedAddress.country,
        phone: selectedAddress.phone
      },
      status: 'pending'
    };
  }, [cart, user, itemsTotal, charges, grandTotal, selectedPayment, selectedAddress]);

  const handlePlaceOrder = useCallback(async () => {
    try {
      setIsPlacingOrder(true);
      const orderData = prepareOrderData();
      const result = await createOrder(orderData);

      if (result.success) {
        setShowOrderConfirmation(true);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  }, [prepareOrderData, createOrder]);

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        resolve();
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        reject(new Error('Failed to load Razorpay script'));
      };
      document.head.appendChild(script);
    });
  };

  const handleRazorpayPayment = useCallback(async (orderData) => {
    try {
      if (!window.Razorpay) {
        await loadRazorpayScript();
      }

      if (!window.Razorpay) {
        alert('Payment gateway is currently unavailable. Please try again later or use Cash on Delivery.');
        return;
      }

      const orderResponse = await createOrder(orderData);
      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to create order');
      }

      const createdOrder = orderResponse.data;
      const orderRef = createdOrder.orderId || createdOrder._id || `FF_${Date.now()}`;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_Sbs1ZuKmKT2RXE',
        amount: Math.round((createdOrder.totalAmount || orderData.totalAmount) * 100),
        currency: 'INR',
        name: 'Farm Ferry',
        description: `Order #${orderRef}`,
        handler: async (response) => {
          try {
            console.log('Payment successful:', response);
            setShowOrderConfirmation(true);
            setCartOpen(false);
            setCheckoutStep('cart');
            setSelectedAddress(null);
            setSelectedPayment('');
            clearCart();
            alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
          } catch (error) {
            console.error('Payment success handling error:', error);
            alert('Payment completed but there was an issue. Please contact support.');
          }
        },
        prefill: {
          name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#16a34a',
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed');
            alert('Payment was cancelled');
          },
        },
        method: {
          netbanking: true,
          card: true,
          upi: true,
          wallet: true,
          paylater: true,
          emi: true
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Razorpay payment error:', error);
      if (error.message.includes('timeout') || error.message.includes('Failed to load')) {
        alert('Unable to connect to payment gateway. Please check your internet connection and try again.');
      } else {
        alert('Failed to initiate payment. Please try again.');
      }
    }
  }, [user, clearCart, createOrder]);

  const handleOpenPayment = useCallback(async (orderData) => {
    try {
      const token = getToken();
      if (!isAuthenticated || !token) {
        alert('Please login to complete payment');
        setIsClosing(true);
        setCartOpen(false);
        setTimeout(() => {
          setShowAuthModal(true);
          setIsClosing(false);
        }, 300);
        return;
      }

      if (selectedPayment === 'online') {
        setIsLoadingPayment(true);
        try {
          await handleRazorpayPayment(orderData);
        } finally {
          setIsLoadingPayment(false);
        }
      } else {
        const orderResponse = await createOrder(orderData);
        if (orderResponse.success) {
          setShowOrderConfirmation(true);
          setCartOpen(false);
          setCheckoutStep('cart');
          setSelectedAddress(null);
          setSelectedPayment('');
        } else {
          throw new Error(orderResponse.message || 'Failed to create order');
        }
      }
    } catch (error) {
      console.error('Error opening payment:', error);
      alert('Failed to initiate payment. Please try again.');
      setIsLoadingPayment(false);
    }
  }, [isAuthenticated, getToken, selectedPayment, createOrder, handleRazorpayPayment]);

  const CartItem = React.memo(({ item }) => {
    const [imageSrc, setImageSrc] = useState(item.product?.images?.[0]?.url || '/images/explore/tomato.png');
    const itemPrice = item.discountedPrice || item.price || 0;
    const itemQty = item.qty || item.quantity || 1;
    const totalPrice = (itemPrice * itemQty).toFixed(2);
    const originalPrice = item.price ? (item.price * itemQty).toFixed(2) : null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-between bg-white p-3 sm:p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20">
            <Image
              src={imageSrc}
              width={80}
              height={80}
              alt={item.product.name}
              className="rounded-lg object-cover border border-gray-100"
              onLoadingComplete={(img) => {
                if (img.naturalWidth === 0) {
                  setImageSrc('/images/explore/tomato.png');
                }
              }}
            />
            {item.discountedPrice && item.discountedPrice < item.price && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                SALE
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-gray-800 truncate text-sm sm:text-base">{item.product.name}</h4>
            <div className="text-gray-500 text-xs sm:text-sm">{item.product.unit}</div>
            <div className="mt-1 flex items-center">
              <span className="font-bold text-green-700 text-sm sm:text-base">₹{totalPrice}</span>
              {originalPrice && item.discountedPrice && item.discountedPrice < item.price && (
                <span className="text-gray-400 text-xs sm:text-sm line-through ml-2">
                  ₹{originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => {
                try {
                  if (itemQty === 1) {
                    removeFromCart(item._id || item.cartItemId);
                  } else {
                    decreaseQty(item._id || item.cartItemId);
                  }
                } catch (err) {
                  console.error('Error updating cart:', err);
                }
              }}
              className="bg-gray-50 w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="bg-white px-2 py-1 font-medium text-gray-800 text-sm sm:text-base w-8 sm:w-10 text-center">
              {itemQty}
            </span>
            <button
              onClick={() => increaseQty(item._id || item.cartItemId)}
              className="bg-gray-50 w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  });

  CartItem.displayName = 'CartItem';

  const renderCart = () => (
    <>
      <div className="flex items-center justify-between p-4 sm:p-6 pb-3 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <ShoppingCart className="text-green-600" size={20} />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">My Cart</h2>
          {cartItemCount > 0 && (
            <span className="bg-green-100 text-green-800 text-xs sm:text-sm font-medium px-2.5 py-0.5 rounded-full">
              {cartItemCount} item{cartItemCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition hover:text-gray-700"
          onClick={handleCloseCart}
          aria-label="Close cart"
        >
          <X size={18} />
        </button>
      </div>
      {cart.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center"
        >
          <div className="bg-green-50 p-4 sm:p-6 rounded-full mb-4">
            <ShoppingCart size={40} className="text-green-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Your cart feels light</h3>
          <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base max-w-md">
            Your shopping cart is waiting to be filled! Explore our fresh products and add something special.
          </p>
          <button
            onClick={handleCloseCart}
            className="bg-green-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm text-sm sm:text-base"
          >
            Browse Products
          </button>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-50 to-blue-50 px-4 sm:px-6 py-4 flex items-start gap-4 mx-4 sm:mx-6 my-4 rounded-xl border border-green-100"
          >
            <div className="flex justify-center bg-white p-2 rounded-full shadow-sm border border-green-200 mt-1">
              <Clock size={18} className="text-green-600" />
            </div>
            <div>
              <div className="flex justify-center items-center gap-2">
                Delivery in {charges.deliveryTime}
                {charges.isFreeDelivery && (
                  <span className="bg-green-100 text-green-800 text-xs sm:text-sm font-medium px-2 py-0.5 rounded-full flex items-center">
                    <CheckCircle size={12} className="mr-1" /> Free Delivery
                  </span>
                )}
              </div>
              <div className="text-gray-600 text-xs sm:text-sm mt-1">
                {cartItemCount} item{cartItemCount > 1 ? 's' : ''} • {charges.deliveryDate}
              </div>
            </div>
          </motion.div>

          <div className="px-4 sm:px-6 pb-4 space-y-3">
            {cart.map(item => (
              <CartItem key={item._id || item.cartItemId} item={item} />
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl mx-4 sm:mx-6 my-4 px-4 sm:px-5 py-4 border border-gray-100">
            <h3 className="font-bold text-base sm:text-lg mb-3 text-gray-800">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm sm:text-base">Subtotal</span>
                <span className="font-medium text-sm sm:text-base">₹{itemsTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-1 text-gray-600 text-sm sm:text-base">
                  <Truck size={12} className="text-gray-500" />
                  <span>Delivery</span>
                  <button className="text-gray-400 hover:text-gray-600" title="Delivery charges may vary">
                    <Info size={12} />
                  </button>
                </div>
                <span className={charges.isFreeDelivery ? "text-green-600 font-medium text-sm sm:text-base" : "text-sm sm:text-base"}>
                  {charges.isFreeDelivery ? "FREE" : `₹${charges.deliveryCharge}`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-gray-600 text-sm sm:text-base">
                  <Package size={12} className="text-gray-500" />
                  <span>Platform Fee</span>
                </div>
                <span className="text-sm sm:text-base">₹{charges.platformFee}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-gray-600 text-sm sm:text-base">
                  <Package size={12} className="text-gray-500" />
                  <span>GST</span>
                </div>
                <span className="text-sm sm:text-base">₹{charges.gst.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                <span className="font-semibold text-gray-700 text-sm sm:text-base">Total</span>
                <span className="font-bold text-base sm:text-lg text-green-700">₹{grandTotal.toFixed(2)}</span>
              </div>
              {charges.isFreeDelivery && (
                <div className="bg-green-50 text-green-700 text-xs sm:text-sm p-2 rounded mt-2 flex items-center gap-2">
                  <CheckCircle size={14} />
                  You saved ₹{charges.deliveryCharge} on delivery!
                </div>
              )}
            </div>
          </div>
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 sm:px-6 py-3 shadow-sm">
            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 sm:py-3 px-4 rounded-lg flex items-center justify-center transition-colors shadow-md text-sm sm:text-base"
            >
              {isAuthenticated ? (
                <>
                  Proceed to Checkout
                  <ArrowRight className="ml-2" size={16} />
                </>
              ) : (
                <>
                  Login to Continue
                  <LogIn className="ml-2" size={16} />
                </>
              )}
            </button>
            <p className="text-center text-xs sm:text-sm text-gray-500 mt-2">
              By continuing, you agree to our Terms & Conditions
            </p>
          </div>
        </>
      )}
    </>
  );

  const renderAddressSelection = () => (
    <>
      <div className="flex items-center justify-between p-4 sm:p-6 pb-3 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToCart}
            className="p-1 text-gray-500 hover:bg-gray-100 rounded-full transition hover:text-gray-700"
            aria-label="Back to cart"
          >
            <ArrowLeft size={18} />
          </button>
          <MapPin size={20} className="text-green-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Select Address</h2>
        </div>
        <button
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition hover:text-gray-700"
          onClick={handleCloseCart}
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <AddressList
          selectedAddress={selectedAddress}
          onSelectAddress={handleAddressSelect}
        />
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 sm:px-6 py-3 shadow-sm">
        <button
          onClick={handleProceedToPayment}
          disabled={!selectedAddress}
          className={`w-full text-white font-bold py-2 sm:py-3 px-4 rounded-lg flex items-center justify-center transition-colors shadow-md text-sm sm:text-base ${selectedAddress
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          Continue to Payment
          <ArrowRight className="ml-2" size={16} />
        </button>
      </div>
    </>
  );

  const renderPaymentMethod = () => (
    <>
      <div className="flex items-center justify-between p-4 sm:p-6 pb-3 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToAddress}
            className="p-1 text-gray-500 hover:bg-gray-100 rounded-full transition hover:text-gray-700"
            aria-label="Back to address selection"
          >
            <ArrowLeft size={18} />
          </button>
          <CreditCard size={20} className="text-green-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Payment Method</h2>
        </div>
        <button
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition hover:text-gray-700"
          onClick={handleCloseCart}
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => handlePaymentSelection(method.id)}
              className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors flex items-center gap-3 text-sm sm:text-base ${selectedPayment === method.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
                }`}
            >
              <div className={`p-2 rounded-full ${selectedPayment === method.id ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                <method.icon size={18} />
              </div>
              <span className="font-medium">{method.label}</span>
              <div className="ml-auto">
                {selectedPayment === method.id ? (
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <CheckCircle size={14} className="text-white" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-gray-300" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 sm:mt-6 bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-100">
          <h3 className="font-bold text-base sm:text-lg mb-3 text-gray-800">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm sm:text-base">Items Total</span>
              <span className="font-medium text-sm sm:text-base">₹{itemsTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm sm:text-base">Delivery</span>
              <span className={charges.isFreeDelivery ? "text-green-600 font-medium text-sm sm:text-base" : "text-sm sm:text-base"}>
                {charges.isFreeDelivery ? "FREE" : `₹${charges.deliveryCharge}`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm sm:text-base">Platform Fee</span>
              <span className="text-sm sm:text-base">₹{charges.platformFee}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm sm:text-base">GST</span>
              <span className="text-sm sm:text-base">₹{charges.gst.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
              <span className="font-semibold text-gray-700 text-sm sm:text-base">Total Amount</span>
              <span className="font-bold text-base sm:text-lg text-green-700">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 sm:px-6 py-3 shadow-sm">
        <button
          onClick={() => {
            if (!selectedPayment) {
              alert('Please select a payment method');
              return;
            }
            if (selectedPayment === 'cod') {
              handlePlaceOrder();
            } else {
              handleOpenPayment(prepareOrderData());
            }
          }}
          disabled={isPlacingOrder || isLoadingPayment}
          className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 sm:py-3 px-4 rounded-lg flex items-center justify-center transition-colors shadow-md text-sm sm:text-base ${(isPlacingOrder || isLoadingPayment) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          {isPlacingOrder ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : isLoadingPayment ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Loading Payment Gateway...
            </>
          ) : (
            <>
              {selectedPayment === 'cod' ? 'Place Order' : 'Proceed to Payment'}
              <CheckCircle className="ml-2" size={16} />
            </>
          )}
        </button>
      </div>
    </>
  );

  const renderProfileSlider = () => (
    <>
      <div className="flex items-center justify-between p-4 sm:p-6 pb-3 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <UserCircle className="text-green-600" size={20} />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">My Profile</h2>
        </div>
        <button
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition hover:text-gray-700"
          onClick={() => setProfileOpen(false)}
          aria-label="Close profile"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Welcome, {user?.name || 'User'}</h3>
          <p className="text-gray-600 text-xs sm:text-sm">{user?.phone || '9322506730'}</p>
          {/* <p className="text-gray-600 text-xs sm:text-sm">{user?.email || 'user@example.com'}</p> */}
        </div>

        <div className="space-y-3 sm:space-y-4">
          {accountItems.map(item => (
            <button
              key={item.id}
              onClick={item.action}
              className="w-full flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition text-sm sm:text-base"
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className="text-gray-600" />
                <span>{item.label}</span>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </button>
          ))}
        </div>

        <div className="mt-6 sm:mt-8">
          <button
            onClick={handleAuthAction}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 sm:py-3 px-4 rounded-lg flex items-center justify-center transition-colors shadow-md text-sm sm:text-base"
          >
            Log Out
            <LogIn className="ml-2" size={16} />
          </button>
        </div>
      </div>
    </>
  );

  const OrderConfirmation = () => {
    useEffect(() => {
      const timer = setTimeout(() => {
        clearCart();
        setCartOpen(false);
        setCheckoutStep('cart');
        setSelectedAddress(null);
        setSelectedPayment('');
        setShowOrderConfirmation(false);
      }, 3000);

      return () => clearTimeout(timer);
    }, [clearCart, setCartOpen]);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.8, rotateY: 90 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ 
            type: "spring", 
            damping: 15, 
            stiffness: 200,
            duration: 0.8
          }}
          className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 text-center relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 bg-green-100 rounded-full opacity-50 w-20 sm:w-24 h-20 sm:h-24"></div>
          <div className="absolute -bottom-8 -left-8 bg-green-200 rounded-full opacity-30 w-16 sm:w-20 h-16 sm:h-20"></div>
          
          <motion.div
            initial={{ scale: 0, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-4 sm:mb-6"
          >
            <PartyPopper size={48} className="mx-auto text-green-500" />
          </motion.div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-4 sm:mb-6"
          >
            <div className="relative">
              <div className="w-16 sm:w-20 h-16 sm:h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                className="absolute inset-0 rounded-full border-4 border-green-400"
              />
            </div>
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2"
          >
            Order Placed!
          </motion.h2>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6"
          >
            Your order has been successfully placed.
          </motion.p>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
          >
            <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-200">
              <p className="text-xs sm:text-sm text-green-800 font-medium">
                Order #{(Math.random() * 10000).toFixed(0).padStart(4, '0')}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Estimated delivery: {charges.deliveryDate}
              </p>
            </div>
          </motion.div>
          
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4 }}
            onClick={() => {
              setShowOrderConfirmation(false);
              clearCart();
              setCartOpen(false);
            }}
            className="mt-4 sm:mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <>
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <header className="fixed w-full top-0 z-50 bg-white shadow-sm">
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-14 sm:h-16 md:h-20 items-center">
              <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
                <div className="flex-shrink-0">
                  <Image
                    src="/images/farmferry-logo.png"
                    width={80}
                    height={48}
                    alt="Farm Ferry"
                    className="h-8 sm:h-10 md:h-12 w-auto"
                  />
                </div>

                <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="text-gray-700 hover:text-green-600 px-2 py-2 text-sm md:text-base font-medium transition-colors flex items-center gap-1"
                    >
                      <item.icon size={14} />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <button
                  onClick={redirectToPlayStore}
                  className="hidden sm:flex bg-green-600 hover:bg-green-700 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm font-medium items-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <Download size={14} className="mr-1" />
                  <span className="hidden md:inline">Download App</span>
                </button>

                <button
                  onClick={handleAuthAction}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 border border-green-600 text-green-600 rounded text-xs sm:text-sm font-medium hover:bg-green-50 transition-colors"
                >
                  {isAuthenticated ? 'Logout' : 'Login'}
                </button>

                <button
                  onClick={() => {
                    setProfileOpen(true);
                    setCartOpen(false);
                  }}
                  className="p-1 sm:p-1.5 md:p-2 rounded-full border border-gray-200 bg-green-50 text-green-700 shadow-sm hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors"
                  aria-label="Open profile"
                >
                  <UserCircle size={18} />
                </button>

                <div className="relative">
                  <button
                    onClick={() => {
                      setCartOpen(true);
                      setCheckoutStep('cart');
                      setProfileOpen(false);
                    }}
                    className="p-1 sm:p-1.5 md:p-2 rounded-full border border-gray-200 bg-green-50 text-green-700 shadow-sm hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors"
                    aria-label="Open cart"
                  >
                    <ShoppingCart size={18} />
                    {cartItemCount > 0 && (
                      <span className="absolute top-0 right-0 -mt-1 -mr-1 rounded-full bg-green-600 px-1.5 py-0.5 text-xs text-white font-semibold min-w-[18px]">
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="md:hidden pb-2 overflow-x-auto scrollbar-hide">
              <div className="flex space-x-3 px-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="flex-shrink-0 text-gray-700 hover:text-green-600 px-2 py-2 text-xs sm:text-sm transition-colors flex items-center gap-1 whitespace-nowrap"
                  >
                    <item.icon size={12} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-[998]"
              onClick={handleCloseCart}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 w-full sm:w-11/12 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-md h-full bg-white z-[999] flex flex-col shadow-xl overflow-y-auto no-scrollbar"
            >
              {checkoutStep === 'cart' && renderCart()}
              {checkoutStep === 'address' && renderAddressSelection()}
              {checkoutStep === 'payment' && renderPaymentMethod()}
            </motion.div>
          </>
        )}

        {profileOpen && isAuthenticated && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-[998]"
              onClick={() => setProfileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 w-full sm:w-11/12 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-md h-full bg-white z-[999] flex flex-col shadow-xl overflow-y-auto no-scrollbar"
            >
              {renderProfileSlider()}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showOrderConfirmation && <OrderConfirmation />}
      </AnimatePresence>
    </>
  );
};

export default Header;