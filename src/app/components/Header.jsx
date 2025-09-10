'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import {
  ShoppingCart, X, Minus, Plus, Trash, Info, Clock, Package,
  CheckCircle, Shield, PhoneCall, ArrowRight, LogIn, Truck,
  Mail, User, Lock, Smartphone, ArrowLeft, CreditCard, Wallet,
  Banknote, UserCircle, MapPin, Gift, HelpCircle, ChevronRight,
  Home, Box, Users, Phone, Download, LogOut,PartyPopper
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

  // In your Navbar component, replace the profileItems definition with:
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
    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
    { id: 'upi', label: 'UPI Payment', icon: Smartphone },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
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
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false)

  // Calculate values using the functions from CartContext
  const cartItemCount = getCartItemCount();
  const itemsTotal = getCartTotal();
  const charges = getDeliveryCharges();
  const grandTotal = getGrandTotal();

  // Get token function (same as in CartContext)
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
  // If we're not on the home page, navigate to home first with hash
  if (pathname !== '/') {
    if (sectionId === 'home') {
      router.push('/');
    } else {
      router.push(`/#${sectionId}`);
    }
    
    // Close any open panels
    setCartOpen(false);
    setProfileOpen(false);
    return;
  }

  // If we're already on home page, handle scrolling
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

  // Close any open panels
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

  // Pre-fetch addresses when user logs in
  // Add API_KEY and getToken to dependencies
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserAddresses();
    }
  }, [isAuthenticated, API_KEY, getToken]);

  const fetchUserAddresses = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_KEY}/customers/addresses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const addresses = await response.json();
        // setUserAddresses(addresses);
        // Cache addresses for future use
        cacheAddresses(addresses);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  }, [API_KEY, getToken]);

  // Simplified address selection
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

  // Current problematic code:
  // Replace the problematic useEffect with this:
  // Replace the problematic useEffect with this:
  useEffect(() => {
    // Only auto-open cart when items are added AND user hasn't manually closed it
    if (cart.length > 0 && !cartOpen && !isClosing && !userClosedCart) {
      setCartOpen(true);
    }

    // Reset userClosedCart when cart becomes empty
    if (cart.length === 0) {
      setUserClosedCart(false);
    }
  }, [cart.length, cartOpen, isClosing, setCartOpen, userClosedCart]);

  // Update handleCloseCart to track manual closure
  const handleCloseCart = useCallback(() => {
    setIsClosing(true);
    setUserClosedCart(true); // Track that user manually closed the cart
    setCartOpen(false);
    setTimeout(() => {
      setCheckoutStep('cart');
      setIsClosing(false);
      setSelectedAddress(null);
      setSelectedPayment('');
    }, 300);
  }, [setCartOpen]);
;


  // Create order function

  const createOrder = useCallback(async (orderData) => {
    try {
      const token = getToken();
      console.log(orderData)

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
      console.log('Order creation response:', result);

      if (response.ok) {
        return result;
      } else {
        if (response.status === 401) {
          // Token expired or invalid
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
    // First, validate that we have the necessary data
    if (!user?._id) {
      throw new Error('User information is missing');
    }

    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }

    if (!selectedAddress) {
      throw new Error('Delivery address is required');
    }

    // Validate address structure
    const requiredAddressFields = ['street', 'city', 'state', 'postalCode', 'country', 'phone'];
    const missingFields = requiredAddressFields.filter(field => !selectedAddress[field]);

    if (missingFields.length > 0) {
      throw new Error(`Delivery address is missing required fields: ${missingFields.join(', ')}`);
    }

    // Map payment method to backend enum values
    const paymentMethodMap = {
      'cod': 'cash_on_delivery',
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
      supplier: cart[0].supplier?._id || null,
      items: cart.map(item => ({
        product: item.product || item._id,
        quantity: item.qty || item.quantity || 1,
        price: item.price,
        discountedPrice: item.discountedPrice || item.price,
        variation: item.variation || {},
        totalPrice: (item.discountedPrice || item.price) * (item.qty || item.quantity || 1)
      })),
      subtotal: itemsTotal,
      discountAmount: 0,
      gst: 0,
      platformFee: charges.handlingCharge,
      handlingFee: 0,
      deliveryCharge: charges.isFreeDelivery ? 0 : charges.deliveryCharge,
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


  // Process order without waiting for full address resolution
const handlePlaceOrder = useCallback(async () => {
  try {
    setIsPlacingOrder(true);

    const orderData = prepareOrderData();
    const result = await createOrder(orderData);

    if (result.success) {
      // Show the confirmation animation
      setShowOrderConfirmation(true);
      
      // After animation completes, reset everything
      setTimeout(() => {
        clearCart();
        setCartOpen(false);
        setCheckoutStep('cart');
        setSelectedAddress(null);
        setSelectedPayment('');
        setShowOrderConfirmation(false);
      }, 3000); // Match this with animation duration
    }
  } catch (error) {
    console.error('Error placing order:', error);
    alert(error.message || 'Failed to place order. Please try again.');
  } finally {
    setIsPlacingOrder(false);
  }
}, [prepareOrderData, createOrder, clearCart, setCartOpen]);

  // Use localStorage to cache addresses

  const cacheAddresses = (addresses) => {
    try {
      localStorage.setItem('user-addresses', JSON.stringify(addresses));
    } catch (error) {
      console.error('Error caching addresses:', error);
    }
  };
  // Payment handler functions
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

    // For non-COD payments, you might want to implement actual payment processing
    alert('Payment integration would be implemented here');
    
  } catch (error) {
    console.error('Error opening payment:', error);
    alert('Failed to initiate payment. Please try again.');
  }
}, [isAuthenticated, getToken]);



  // Optimized cart item rendering with memoization
  const CartItem = React.memo(({ item }) => {
    const itemPrice = item.discountedPrice || item.price || 0;
    const itemQty = item.qty || item.quantity || 1;
    const totalPrice = (itemPrice * itemQty).toFixed(2);
    const originalPrice = item.price ? (item.price * itemQty).toFixed(2) : null;
    console.log('Rendering CartItem:', item);
    console.log('Item details:', CartItem);
    const imageUrl = item.product?.images?.[0]?.url || '/images/explore/tomato.png';

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <Image
              src={imageUrl || '/images/explore/tomato.png'}
              width={72}
              height={72}
              alt={item.product.name}
              className="rounded-lg object-cover border border-gray-100"
              onError={(e) => {
                e.target.src = '/images/explore/tomato.png';
              }}
            />
            {item.discountedPrice && item.discountedPrice < item.price && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                SALE
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-gray-800 truncate">{item.product.name}</h4>
            <div className="text-gray-500 text-xs">{item.product.unit}</div>
            <div className="mt-1 flex items-center">
              <span className="font-bold text-green-700">₹{totalPrice}</span>
              {originalPrice && item.discountedPrice && item.discountedPrice < item.price && (
                <span className="text-gray-400 text-xs line-through ml-2">
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
                if (itemQty === 1) {
                  removeFromCart(item._id || item.cartItemId);
                } else {
                  decreaseQty(item._id || item.cartItemId);
                }
              }}
              className="bg-gray-50 w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="bg-white px-2 py-1 font-medium text-gray-800 text-sm w-8 text-center">
              {itemQty}
            </span>
            <button
              onClick={() => increaseQty(item._id || item.cartItemId)}
              className="bg-gray-50 w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
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
      <div className="flex items-center justify-between p-6 pb-3 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <ShoppingCart className="text-green-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">My Cart</h2>
          {cartItemCount > 0 && (
            <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {cartItemCount} item{cartItemCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition hover:text-gray-700"
          onClick={handleCloseCart}
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
            onClick={handleCloseCart}
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
                Delivery in {charges.deliveryTime}
                {charges.isFreeDelivery && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full flex items-center">
                    <CheckCircle size={14} className="mr-1" /> Free Delivery
                  </span>
                )}
              </div>
              <div className="text-gray-600 text-sm mt-1">
                {cartItemCount} item{cartItemCount > 1 ? 's' : ''} • {charges.deliveryDate}
              </div>
            </div>
          </motion.div>

          <div className="px-4 pb-4 space-y-3">
            {cart.map(item => (
              <CartItem key={item._id || item.cartItemId} item={item} />
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl mx-4 my-4 px-5 py-4 border border-gray-100">
            <h3 className="font-bold text-lg mb-3 text-gray-800">Order Summary</h3>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{itemsTotal.toFixed(2)}</span>
              </div>

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
                    <ShoppingCart size={14} className='text-gray-500' />
                    <span>Small order</span>
                  </div>
                  <span>₹{charges.smallCartCharge}</span>
                </div>
              )}

              <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                <span className="font-semibold text-gray-700">Total</span>
                <span className="font-bold text-lg text-green-700">₹{grandTotal.toFixed(2)}</span>
              </div>

              {charges.isFreeDelivery && (
                <div className="bg-green-50 text-green-700 text-sm p-2 rounded mt-2 flex items-center gap-2">
                  <CheckCircle size={16} />
                  You saved ₹{charges.deliveryCharge} on delivery!
                </div>
              )}
            </div>
          </div>
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 shadow-sm">
            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors shadow-md"
            >
              {isAuthenticated ? (
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
    </>
  );

  const renderAddressSelection = () => (
    <>
      <div className="flex items-center justify-between p-6 pb-3 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToCart}
            className="p-1 text-gray-500 hover:bg-gray-100 rounded-full transition hover:text-gray-700"
            aria-label="Back to cart"
          >
            <ArrowLeft size={20} />
          </button>
          <MapPin size={24} className="text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Select Address</h2>
        </div>
        <button
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition hover:text-gray-700"
          onClick={handleCloseCart}
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <AddressList
          selectedAddress={selectedAddress}
          onSelectAddress={handleAddressSelect}
        />
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 shadow-sm">
        <button
          onClick={handleProceedToPayment}
          disabled={!selectedAddress}
          className={`w-full text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors shadow-md ${selectedAddress
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          Continue to Payment
          <ArrowRight className="ml-2" size={18} />
        </button>
      </div>
    </>
  );

  const renderPaymentMethod = () => (
    <>
      <div className="flex items-center justify-between p-6 pb-3 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToAddress}
            className="p-1 text-gray-500 hover:bg-gray-100 rounded-full transition hover:text-gray-700"
            aria-label="Back to address selection"
          >
            <ArrowLeft size={20} />
          </button>
          <CreditCard size={24} className="text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Payment Method</h2>
        </div>
        <button
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition hover:text-gray-700"
          onClick={handleCloseCart}
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => handlePaymentSelection(method.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors flex items-center gap-3 ${selectedPayment === method.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
                }`}
            >
              <div className={`p-2 rounded-full ${selectedPayment === method.id ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                <method.icon size={20} />
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

        <div className="mt-6 bg-gray-50 rounded-xl p-5 border border-gray-100">
          <h3 className="font-bold text-lg mb-3 text-gray-800">Order Summary</h3>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Items Total</span>
              <span className="font-medium">₹{itemsTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Delivery</span>
              <span className={charges.isFreeDelivery ? "text-green-600 font-medium" : ""}>
                {charges.isFreeDelivery ? "FREE" : `₹${charges.deliveryCharge}`}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Handling Fee</span>
              <span>₹{charges.handlingCharge}</span>
            </div>

            {charges.showSmallCartCharge && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Small Order Charge</span>
                <span>₹{charges.smallCartCharge}</span>
              </div>
            )}

            <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
              <span className="font-semibold text-gray-700">Total Amount</span>
              <span className="font-bold text-lg text-green-700">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 shadow-sm">
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
          disabled={isPlacingOrder}
          className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors shadow-md ${isPlacingOrder ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          {isPlacingOrder ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              {selectedPayment === 'cod' ? 'Place Order' : 'Proceed to Payment'}
              <CheckCircle className="ml-2" size={18} />
            </>
          )}
        </button>
      </div>
    </>
  );

  const renderProfileSlider = () => (
    <>
      <div className="flex items-center justify-between p-6 pb-3 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <UserCircle className="text-green-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
        </div>
        <button
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition hover:text-gray-700"
          onClick={() => setProfileOpen(false)}
          aria-label="Close profile"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Welcome, {user?.name || 'User'}</h3>
          <p className="text-gray-600 text-sm">{user?.phone || '9322506730'}</p>
          <p className="text-gray-600 text-sm">{user?.email || 'user@example.com'}</p>
        </div>

        <div className="space-y-4">
          {accountItems.map(item => (
            <button
              key={item.id}
              onClick={item.action}
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition"
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className="text-gray-600" />
                <span>{item.label}</span>
              </div>
              <ArrowRight size={18} className="text-gray-400" />
            </button>
          ))}
        </div>

        <div className="mt-8">
          <button
            onClick={handleAuthAction}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors shadow-md"
          >
            Log Out
            <LogIn className="ml-2" size={18} />
          </button>
        </div>
      </div>
    </>
  );
const OrderConfirmation = () => (
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
      className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-100 rounded-full opacity-50"></div>
      <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-green-200 rounded-full opacity-30"></div>
      
      {/* Confetti animation */}
      <motion.div
        initial={{ scale: 0, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mb-6"
      >
        <PartyPopper size={60} className="mx-auto text-green-500" />
      </motion.div>
      
      {/* Checkmark animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        className="flex justify-center mb-6"
      >
        <div className="relative">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            className="absolute inset-0 rounded-full border-4 border-green-400"
          />
        </div>
      </motion.div>
      
      {/* Text content */}
      <motion.h2 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-3xl font-bold text-gray-800 mb-2"
      >
        Order Placed!
      </motion.h2>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-gray-600 mb-6"
      >
        Your order has been successfully placed.
      </motion.p>
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
      >
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-800 font-medium">
            Order #{(Math.random() * 10000).toFixed(0).padStart(4, '0')}
          </p>
          <p className="text-xs text-green-600 mt-1">
            Estimated delivery: {charges.deliveryDate}
          </p>
        </div>
      </motion.div>
      
      {/* Continue shopping button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4 }}
        onClick={() => {
          setShowOrderConfirmation(false);
          clearCart();
          setCartOpen(false);
        }}
        className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors"
      >
        Continue Shopping
      </motion.button>
    </motion.div>
  </motion.div>
);

  return (
    <>
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <header className="fixed w-full top-0 z-50 bg-white shadow-sm">
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 md:h-20 items-center">
              <div className="flex items-center space-x-4 md:space-x-6">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 md:h-14 w-auto"
                    src="/images/farmferry-logo.png"
                    alt="Farm Ferry"
                    draggable={false}
                  />
                </div>

                <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="text-gray-700 hover:text-green-600 px-2 py-2 text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <item.icon size={16} />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="flex items-center gap-3 md:gap-4">
                <button
                  onClick={redirectToPlayStore}
                  className="hidden sm:flex bg-green-600 hover:bg-green-700 text-white px-3 py-2 md:px-4 md:py-2.5 rounded text-sm font-medium items-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <Download size={16} className="mr-1" />
                  <span className="hidden md:inline">Download App</span>
                </button>

                <button
                  onClick={handleAuthAction}
                  className="px-3 py-1.5 border border-green-600 text-green-600 rounded text-sm font-medium hover:bg-green-50 transition-colors"
                >
                  {isAuthenticated ? 'Logout' : 'Login'}
                </button>

                {isAuthenticated && (
                  <div className="relative">
                    <button
                      onClick={() => {
                        setProfileOpen(true);
                        setCartOpen(false);
                      }}
                      className="p-1.5 md:p-2 rounded-full border border-gray-200 bg-green-50 text-green-700 shadow-sm hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors"
                      aria-label="Open profile"
                    >
                      <UserCircle size={20} />
                    </button>
                  </div>
                )}

                <div className="relative">
                  <button
                    onClick={() => {
                      setCartOpen(true);
                      setCheckoutStep('cart');
                      setProfileOpen(false);
                    }}
                    className="p-1.5 md:p-2 rounded-full border border-gray-200 bg-green-50 text-green-700 shadow-sm hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors"
                    aria-label="Open cart"
                  >
                    <ShoppingCart size={20} />
                    {cartItemCount > 0 && (
                      <span className="absolute top-0 right-0 -mt-1 -mr-1 rounded-full bg-green-600 px-1.5 py-0.5 text-xs text-white font-semibold min-w-[18px]">
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden pb-2 overflow-x-auto scrollbar-hide">
              <div className="flex space-x-4 px-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="flex-shrink-0 text-gray-700 hover:text-green-600 px-3 py-2 text-xs transition-colors flex items-center gap-1 whitespace-nowrap"
                  >
                    <item.icon size={14} />
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
              className="fixed top-0 right-0 w-full sm:max-w-md h-full bg-white z-[999] flex flex-col shadow-xl overflow-y-auto no-scrollbar"
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
              className="fixed top-0 right-0 w-full sm:max-w-md h-full bg-white z-[999] flex flex-col shadow-xl overflow-y-auto no-scrollbar"
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