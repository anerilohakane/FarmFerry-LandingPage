'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import {
    ShoppingCart, X, Minus, Plus, Info, Clock, Package,
    CheckCircle, Shield, PhoneCall, ArrowRight, LogIn, Truck,
    UserCircle, MapPin, HelpCircle, ArrowLeft, CreditCard,
    Home, Box, Users, Phone, Download, LogOut, PartyPopper, Search,
    Heart, Grid, ChevronDown, FileText
} from 'lucide-react';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../utils/api';
import AuthModal from './AuthModal';
import AddressList from './AddressList';

const AlertModal = ({ isOpen, message, onClose }) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center"
        >
            <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full mx-4 text-center relative overflow-hidden"
            >
                <div className="absolute -top-10 -right-10 bg-green-100 rounded-full opacity-50 w-20 sm:w-24 h-20 sm:h-24"></div>
                <div className="absolute -bottom-8 -left-8 bg-green-200 rounded-full opacity-30 w-16 sm:w-20 h-16 sm:h-20"></div>

                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Alert</h2>
                <p className="text-gray-600 text-sm sm:text-base mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
                >
                    OK
                </button>
            </motion.div>
        </motion.div>
    );
};

const Header = () => {
    const router = useRouter();
    const pathname = usePathname();
    const navItems = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'products', label: 'Shop', icon: Box },
        { id: 'about', label: 'About', icon: Info },
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
        clearCart,
        addToCart
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
    const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [userLocation, setUserLocation] = useState('Fetching location...');
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [alertModal, setAlertModal] = useState({ isOpen: false, message: '' });
    const [orderId, setOrderId] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [categories, setCategories] = useState([]);
    const [wishlistOpen, setWishlistOpen] = useState(false);
    const [wishlist, setWishlist] = useState([]);
    const [wishlistCount, setWishlistCount] = useState(0);

    useEffect(() => {
        setMounted(true);
        const fetchCategories = async () => {
            try {
                const response = await apiService.getAllCategories({ parent: 'null', includeInactive: 'false' });
                if (response.success) {
                    const cats = response.data?.categories || response.data?.items || response.data || [];
                    setCategories(cats);
                }
            } catch (error) {
                console.error('Error fetching categories in header:', error);
            }
        };
        fetchCategories();

        const handleOpenAuth = () => {
            setShowAuthModal(true);
            setProfileOpen(false);
            setCartOpen(false);
        };
        window.addEventListener('openAuthModal', handleOpenAuth);
        return () => window.removeEventListener('openAuthModal', handleOpenAuth);
    }, []);

    const fetchWishlist = useCallback(async () => {
        if (!isAuthenticated || !user?._id) {
            setWishlist([]);
            setWishlistCount(0);
            return;
        }
        try {
            const response = await apiService.getWishlist(user._id);
            if (response.success && response.data?.items) {
                setWishlist(response.data.items);
                setWishlistCount(response.data.items.length);
            } else {
                setWishlist([]);
                setWishlistCount(0);
            }
        } catch (error) {
            console.error("Error fetching wishlist", error);
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        fetchWishlist();
        const handleWishlistUpdate = () => fetchWishlist();
        window.addEventListener('wishlistUpdated', handleWishlistUpdate);
        return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    }, [fetchWishlist]);

    const handleRemoveFromWishlist = async (productId) => {
        try {
            await apiService.removeFromWishlist(user._id, productId);
            fetchWishlist();
            window.dispatchEvent(new Event('wishlistUpdated'));
        } catch (error) {
            console.error("Error removing from wishlist", error);
        }
    };

    const handleWishlistAddToCart = async (product) => {
        await addToCart(product);
        setWishlistOpen(false);
        setCartOpen(true);
        setCheckoutStep('cart');
    };

    const placeholders = [
        'Search rice...',
        'Search chips...',
        'Search milk...',
        'Search Butter...',
        'Search IceCream...',
        'Search paneer...',
        'Search Chocolate...',
        'Search ColdDrink...',
        'Search Fruits...',
        'Search Dessert...',
        'Search Juices...',
        'Search vegetable...'
    ];

    const cartItemCount = getCartItemCount();
    const itemsTotal = getCartTotal();
    const charges = getDeliveryCharges();
    const grandTotal = getGrandTotal();

    // Animate placeholder text
    useEffect(() => {
        if (searchTerm) return;
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [searchTerm, placeholders.length]);

    // Fetch user's live location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
                        );
                        const data = await response.json();
                        if (data && data.display_name) {
                            setUserLocation(data.display_name);
                        } else {
                            setUserLocation('Location not available');
                        }
                    } catch (error) {
                        console.error('Error fetching location:', error);
                        setUserLocation('Unable to fetch location');
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setUserLocation('Location access denied');
                }
            );
        } else {
            setUserLocation('Geolocation not supported');
        }
    }, []);

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
        // Always navigate to Products page for 'products' ID
        if (sectionId === 'products') {
            router.push('/products');
            setCartOpen(false);
            setProfileOpen(false);
            return;
        }

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

    const showAlert = useCallback((message) => {
        setAlertModal({ isOpen: true, message });
    }, []);

    const closeAlert = useCallback(() => {
        setAlertModal({ isOpen: false, message: '' });
    }, []);

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
            if (!isAuthenticated) return;

            const response = await apiService.getAddresses();
            if (response.success) {
                // Handle both response structures: direct array or nested in customer object
                const addresses = Array.isArray(response.data) ? response.data : (response.data.customer?.addresses || []);
                try {
                    localStorage.setItem('user-addresses', JSON.stringify(addresses));
                } catch (error) {
                    console.error('Error caching addresses:', error);
                }
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    }, [isAuthenticated]);

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
            showAlert('Please select a delivery address');
            return;
        }
        setCheckoutStep('payment');
    }, [selectedAddress, showAlert]);

    const handlePaymentSelection = useCallback((methodId) => {
        setSelectedPayment(methodId);
    }, []);

    const handleBackToCart = useCallback(() => {
        setCheckoutStep('cart');
    }, []);

    const handleBackToAddress = useCallback(() => {
        setCheckoutStep('address');
    }, []);

    // Auto-open cart logic removed to prevent intrusive behavior
    // useEffect(() => {
    //   if (cart.length > 0 && !cartOpen && !isClosing && !userClosedCart) {
    //     setCartOpen(true);
    //   }
    //
    //   if (cart.length === 0) {
    //     setUserClosedCart(false);
    //   }
    // }, [cart.length, cartOpen, isClosing, setCartOpen, userClosedCart]);

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
            if (!isAuthenticated) {
                throw new Error('No authentication token found. Please login again.');
            }

            const response = await apiService.placeOrder(orderData);
            console.log('createOrder response:', response); // Debug log

            if (response.success) {
                return response;
            } else {
                throw new Error(response.message || 'Failed to create order');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            if (error.message.includes('401') || error.message.includes('expired')) {
                logout();
            }
            throw error;
        }
    }, [isAuthenticated, logout]);

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
            supplier: cart[0]?.supplier?._id || cart[0]?.supplier || cart[0]?.product?.supplier?._id || cart[0]?.product?.supplier || null,
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
                // Try to find the human-readable Order ID first, then the specific ID
                console.log('Place Order Result:', result);
                const orderId = result.order?.orderId || result.order?._id || result.data?.order?.orderId || result.data?.orderId || result.data?.orderDetails?.orderId || result.data?._id || 'N/A';
                setOrderId(orderId);
                setShowOrderConfirmation(true);

                // Cleanup logic to reset cart state
                setCartOpen(false);
                setCheckoutStep('cart');
                setSelectedAddress(null);
                setSelectedPayment('');
                clearCart();
            }
        } catch (error) {
            console.error('Error placing order:', error);
            showAlert(error.message || 'Failed to place order. Please try again.');
        } finally {
            setIsPlacingOrder(false);
        }
    }, [prepareOrderData, createOrder, showAlert]);

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
                showAlert('Payment gateway is currently unavailable. Please try again later or use Cash on Delivery.');
                return;
            }

            const orderResponse = await createOrder(orderData);
            const createdOrder = orderResponse.data;
            const orderRef = createdOrder.orderId || createdOrder._id || `FF_${Date.now()}`;
            setOrderId(orderRef);

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_Sbs1ZuKmKT2RXE',
                amount: Math.round((createdOrder.totalAmount || orderData.totalAmount) * 100),
                currency: 'INR',
                name: 'FarmFerry',
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
                        showAlert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
                    } catch (error) {
                        console.error('Payment success handling error:', error);
                        showAlert('Payment completed but there was an issue. Please contact support.');
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
                        showAlert('Payment was cancelled');
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
                showAlert('Unable to connect to payment gateway. Please check your internet connection and try again.');
            } else {
                showAlert('Failed to initiate payment. Please try again.');
            }
        }
    }, [user, clearCart, createOrder, showAlert]);

    const handleOpenPayment = useCallback(async (orderData) => {
        try {
            const token = getToken();
            if (!isAuthenticated || !token) {
                showAlert('Please login to complete payment');
                setIsClosing(true);
                setCartOpen(false);
                setTimeout(() => {
                    setShowAuthModal(true);
                    setIsClosing(false);
                }, 300);
                return;
            }

            if (selectedPayment === 'online') {
                console.log("Opening Razorpay");
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
            showAlert('Failed to initiate payment. Please try again.');
            setIsLoadingPayment(false);
        }
    }, [isAuthenticated, getToken, selectedPayment, createOrder, handleRazorpayPayment, showAlert]);

    const handleSearchChange = useCallback((e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (searchTimeout) clearTimeout(searchTimeout);
        if (term.length < 2) {
            setSearchResults([]);
            setShowSearchDropdown(false);
            return;
        }
        const timeout = setTimeout(async () => {
            try {
                console.log('Searching for:', term);
                const response = await apiService.searchProducts(term);
                console.log('Search response:', response);

                if (response && response.success) {
                    const products = Array.isArray(response.data?.products)
                        ? response.data.products
                        : Array.isArray(response.data)
                            ? response.data
                            : [];
                    setSearchResults(products);
                    setShowSearchDropdown(products.length > 0);
                } else {
                    console.error('Search failed:', response?.message || 'No data');
                    setSearchResults([]);
                    setShowSearchDropdown(false);
                }
            } catch (err) {
                console.error('Search error:', err);
                setSearchResults([]);
                setShowSearchDropdown(false);
            }
        }, 300);
        setSearchTimeout(timeout);
    }, [searchTimeout]);

    const handleSearchBlur = useCallback(() => {
        setTimeout(() => {
            setShowSearchDropdown(false);
        }, 200);
    }, []);

    const handleSelectProduct = useCallback((product) => {
        // When clicking a dropdown item, we now want to SEARCH for it in layout
        // effectively doing the same as manual search but with the specific product name.
        // This keeps the user in the "Shop" browsing flow.

        const term = product?.name || searchTerm;
        router.push(`/products?search=${encodeURIComponent(term.trim())}`);

        setSearchTerm(''); // Clear or keep? User asked for behavior "same as enter"
        setSearchResults([]);
        setShowSearchDropdown(false);
    }, [router, searchTerm]);

    const handleManualSearch = useCallback(() => {
        if (!searchTerm.trim()) return;

        // Always navigate to search results page on Enter/Click Search
        // This allows the user to see all results sorted by relevance
        router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);

        // Clear UI state
        // We might want to keep searchTerm in the input, but standard behavior often clears or keeps it.
        // Keeping it cleared for now as per previous logic, or maybe we should keep it?
        // Let's clear the dropdown but maybe keep the term? 
        // The previous logic cleared it: setSearchTerm('');
        // Let's stick to clearing it to avoid confusion or blocking view.
        setSearchTerm('');
        setShowSearchDropdown(false);
    }, [searchTerm, router]);

    useEffect(() => {
        return () => {
            if (searchTimeout) clearTimeout(searchTimeout);
        };
    }, [searchTimeout]);

    const CartItem = React.memo(({ item }) => {
        const getImageSrc = () => {
            if (item.product?.images?.[0]?.url) {
                return item.product.images[0].url;
            }
            return '/images/explore/tomato.png';
        };

        const itemPrice = item.discountedPrice || item.price || 0;
        const itemQty = item.qty || item.quantity || 1;
        const totalPrice = (itemPrice * itemQty).toFixed(2);
        const originalPrice = item.price ? (item.price * itemQty).toFixed(2) : null;

        return (
            <div className="flex items-center justify-between bg-white p-3 sm:p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20">
                        <Image
                            src={getImageSrc()}
                            width={80}
                            height={80}
                            alt={item.product?.name || 'Product'}
                            className="rounded-lg object-cover border border-gray-100"
                            onError={(e) => {
                                e.target.src = '/images/explore/tomato.png';
                            }}
                        />
                        {item.discountedPrice && item.discountedPrice < item.price ? (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                SALE
                            </div>
                        ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-gray-800 truncate text-sm sm:text-base">{item.product?.name || 'Product'}</h4>
                        {item.product?.unit ? (
                            <div className="text-gray-500 text-xs sm:text-sm">{item.product.unit}</div>
                        ) : null}
                        <div className="mt-1 flex items-center">
                            <span className="font-bold text-green-700 text-sm sm:text-base">₹{Number(totalPrice).toFixed(2)}</span>
                            {originalPrice && Number(item.discountedPrice) < Number(item.price) ? (
                                <span className="text-gray-400 text-xs sm:text-sm line-through ml-2">
                                    ₹{Number(originalPrice).toFixed(2)}
                                </span>
                            ) : null}
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={async () => {
                                try {
                                    const id = item.cartItemId || item.backendCartItemId || item._id;
                                    if (itemQty === 1) {
                                        setItemToRemove(id);
                                        setShowRemoveConfirmation(true);
                                    } else {
                                        await decreaseQty(id);
                                    }
                                } catch (err) {
                                    console.error('Error updating cart:', err);
                                    showAlert(err.message);
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
                            onClick={async () => {
                                try {
                                    const id = item.cartItemId || item.backendCartItemId || item._id;
                                    await increaseQty(id);
                                } catch (err) {
                                    console.error('Error updating cart:', err);
                                    showAlert(err.message);
                                }
                            }}
                            className="bg-gray-50 w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
                            aria-label="Increase quantity"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>
            </div>
        );
    });

    CartItem.displayName = 'CartItem';

    const RemoveConfirmationModal = () => (
        <motion.div
            key="remove-confirmation-modal"
            className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center"
        >
            <motion.div
                className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full mx-4 text-center relative overflow-hidden"
            >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                    Remove Item
                </h2>
                <p className="text-gray-600 text-sm sm:text-base mb-6">
                    Are you sure you want to remove this item from your cart?
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => {
                            setShowRemoveConfirmation(false);
                            setItemToRemove(null);
                        }}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            if (itemToRemove) {
                                console.log('Confirming removal of item:', itemToRemove);
                                try {
                                    await removeFromCart(itemToRemove);
                                } catch (error) {
                                    console.error('Error removing item in modal:', error);
                                }
                            } else {
                                console.warn('No itemToRemove set!');
                            }
                            setShowRemoveConfirmation(false);
                            setItemToRemove(null);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
                    >
                        Remove
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );

    const OrderConfirmation = ({ orderId }) => {
        useEffect(() => {
            const timer = setTimeout(() => {
                clearCart();
                setCartOpen(false);
                setCheckoutStep('cart');
                setSelectedAddress(null);
                setSelectedPayment('');
                setShowOrderConfirmation(false);
                setOrderId(null);
            }, 3000);

            return () => clearTimeout(timer);
        }, [clearCart, setCartOpen]);

        return (
            <motion.div
                key="order-confirmation-modal"
                className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center"
            >
                <motion.div
                    className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 text-center relative overflow-hidden"
                >
                    <div className="absolute -top-10 -right-10 bg-green-100 rounded-full opacity-50 w-20 sm:w-24 h-20 sm:h-24"></div>
                    <div className="absolute -bottom-8 -left-8 bg-green-200 rounded-full opacity-30 w-16 sm:w-20 h-16 sm:h-20"></div>

                    <motion.div
                        className="mb-4 sm:mb-6"
                    >
                        <PartyPopper size={48} className="mx-auto text-green-500" />
                    </motion.div>

                    <motion.div
                        className="flex justify-center mb-4 sm:mb-6"
                    >
                        <div className="relative">
                            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle size={32} className="text-green-600" />
                            </div>
                            <motion.div
                                className="absolute inset-0 rounded-full border-4 border-green-400"
                            />
                        </div>
                    </motion.div>

                    <motion.h2
                        className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2"
                    >
                        Order Placed!
                    </motion.h2>

                    <motion.p
                        className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6"
                    >
                        Your order has been successfully placed.
                    </motion.p>

                    <motion.div>
                        <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-200">
                            <p className="text-lg font-bold text-green-800">
                                Order #{orderId || 'N/A'}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                                Estimated delivery: {charges.deliveryDate}
                            </p>
                        </div>
                    </motion.div>

                    <motion.button
                        onClick={() => {
                            setShowOrderConfirmation(false);
                            clearCart();
                            setCartOpen(false);
                            setOrderId(null);
                        }}
                        className="mt-4 sm:mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
                    >
                        Continue Shopping
                    </motion.button>
                </motion.div>
            </motion.div>
        );
    };

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
                        onClick={() => {
                            router.push('/products');
                            setCartOpen(false);
                        }}
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
                        className="bg-gradient-to-r from-green-50 to-green-50 px-4 sm:px-6 py-4 flex items-start gap-4 mx-4 sm:mx-6 my-4 rounded-xl border border-green-100"
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
                        {cart.map((item, index) => (
                            <CartItem key={item._id || item.cartItemId || `cart-item-${index}`} item={item} />
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
                        {isAuthenticated && (
                            <button
                                onClick={() => {
                                    router.push('/products');
                                    setCartOpen(false);
                                }}
                                className="w-full mt-3 bg-white border border-green-600 text-green-600 hover:bg-green-50 font-bold py-2 sm:py-3 px-4 rounded-lg flex items-center justify-center transition-colors shadow-sm text-sm sm:text-base"
                            >
                                Continue Shopping
                            </button>
                        )}
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
                            showAlert('Please select a payment method');
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

    const renderWishlist = () => (
        <>
            <div className="flex items-center justify-between p-4 sm:p-6 pb-3 border-b sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                    <Heart className="text-green-600" size={20} />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">My Wishlist</h2>
                    {wishlistCount > 0 && (
                        <span className="bg-green-100 text-green-800 text-xs sm:text-sm font-medium px-2.5 py-0.5 rounded-full">
                            {wishlistCount} item{wishlistCount > 1 ? 's' : ''}
                        </span>
                    )}
                </div>
                <button
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition hover:text-gray-700"
                    onClick={() => setWishlistOpen(false)}
                    aria-label="Close wishlist"
                >
                    <X size={18} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {wishlist.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center h-full">
                        <div className="bg-gray-50 p-6 rounded-full mb-4">
                            <Heart size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-500 mb-6 text-sm">Save items you love to verify them later.</p>
                        <button
                            onClick={() => {
                                setWishlistOpen(false);
                                router.push('/products');
                            }}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            Explore Products
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {wishlist.map((item) => {
                            // Handle populated vs unpopulated vs snapshot vs broken link
                            const rawProduct = item.product || item;
                            // normalize product for display
                            const product = {
                                _id: rawProduct._id || item.product,
                                name: rawProduct.name || 'Unknown Product',
                                price: rawProduct.price || 0,
                                discountedPrice: rawProduct.discountedPrice || rawProduct.price || 0,
                                images: rawProduct.images || (rawProduct.thumbnail ? [{ url: rawProduct.thumbnail }] : []),
                                stockQuantity: rawProduct.stockQuantity !== undefined ? rawProduct.stockQuantity : 100
                            };

                            // Valid ID check
                            if (!product._id) return null;

                            return (
                                <div key={product._id} className="flex gap-3 border border-gray-100 rounded-xl p-3 hover:shadow-sm transition-shadow">
                                    <div className="w-20 h-20 bg-gray-50 rounded-lg flex-shrink-0 relative overflow-hidden cursor-pointer" onClick={() => {
                                        setWishlistOpen(false);
                                        router.push(`/productDetails/${product._id}`);
                                    }}>
                                        <Image
                                            src={product.images?.[0]?.url || '/images/explore/tomato.png'}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-800 truncate cursor-pointer hover:text-green-600" onClick={() => {
                                                setWishlistOpen(false);
                                                router.push(`/productDetails/${product._id}`);
                                            }}>
                                                {product.name}
                                            </h4>
                                            <div className="text-sm font-bold text-green-600 mt-1">
                                                ₹{product.discountedPrice || product.price}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <button
                                                onClick={() => handleWishlistAddToCart(rawProduct._id ? rawProduct : product)}
                                                className="text-xs font-medium text-white hover:bg-green-700 flex items-center gap-1 bg-green-600 px-3 py-1.5 rounded-md transition-colors shadow-sm"
                                            >
                                                <ShoppingCart size={14} />
                                                Add to Cart
                                            </button>
                                            <button
                                                onClick={() => handleRemoveFromWishlist(product._id)}
                                                className="text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1.5 rounded-md transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );

    return (
        <>
            <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />

            <header className="fixed w-full top-0 z-50 bg-white shadow-sm font-sans">
                {/* Top Strip */}


                {/* Main Header */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
                    <div className="flex items-center justify-between gap-4 md:gap-8">
                        {/* Logo */}
                        <div className="flex-shrink-0 cursor-pointer" onClick={() => scrollToSection('home')}>
                            <div className="flex items-center gap-2">
                                <Image
                                    src="/images/1(12).png"
                                    width={130}
                                    height={75}
                                    alt="Farm Ferry"
                                    className="h-12 sm:h-14 w-auto"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Search Bar - Centered & Wide (Hidden on mobile initially, shown in separate row if needed, but for now fluid) */}
                        <div className="hidden md:flex flex-1 max-w-2xl relative z-20">
                            <div className="flex items-center w-full border border-gray-200 rounded-full overflow-hidden bg-gray-50 hover:border-green-500 transition-colors">
                                {
                                    /* All Categories Dropdown Removed as per request */
                                }
                                <input
                                    type="text"
                                    placeholder={placeholders[placeholderIndex]}
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onBlur={handleSearchBlur}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleManualSearch();
                                        }
                                    }}
                                    className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none px-3 py-1.5 text-sm text-gray-700 placeholder-gray-400"
                                />
                                <button
                                    onClick={handleManualSearch}
                                    className="px-4 py-1.5 bg-green-600 text-white hover:bg-green-700 transition-colors"
                                >
                                    <Search size={18} />
                                </button>
                            </div>

                            {/* Search Results Dropdown */}
                            {showSearchDropdown && searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-96 overflow-y-auto z-50">
                                    {searchResults.map((product) => (
                                        <div
                                            key={product._id}
                                            onMouseDown={(e) => {
                                                e.preventDefault(); // Prevent focus loss
                                                handleSelectProduct(product);
                                            }}
                                            className="p-3 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-b-0 flex items-center gap-3 transition-colors"
                                        >
                                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 relative">
                                                <Image
                                                    src={product.images?.[0]?.url || '/images/explore/tomato.png'}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="font-medium text-gray-800 truncate">{product.name}</div>
                                                <div className="text-xs text-gray-500 truncate">{product.unit}{product.categoryId?.name ? ` • ${product.categoryId.name}` : ''}</div>
                                            </div>
                                            <div className="text-sm font-bold text-green-600">
                                                ₹{product.discountedPrice || product.price}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {showSearchDropdown && searchResults.length === 0 && searchTerm.length >= 2 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl p-4 text-center text-gray-500 text-sm">
                                    No products found for "{searchTerm}"
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 sm:gap-6">
                            {/* Wishlist */}
                            <div className="hidden sm:flex flex-col items-center gap-1 cursor-pointer group" onClick={() => {
                                if (isAuthenticated) {
                                    setWishlistOpen(true);
                                    setCartOpen(false);
                                    setProfileOpen(false);
                                } else {
                                    handleAuthAction();
                                }
                            }}>
                                <div className="relative p-1">
                                    <Heart size={20} className="text-gray-700 group-hover:text-green-600 transition-colors" />
                                    {wishlistCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide group-hover:text-green-600">Wishlist</span>
                            </div>

                            {/* Cart */}
                            <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => {
                                setCartOpen(true);
                                setCheckoutStep('cart');
                                setProfileOpen(false);
                            }}>
                                <div className="relative p-1">
                                    <ShoppingCart size={20} className="text-gray-700 group-hover:text-green-600 transition-colors" />
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide group-hover:text-green-600">Cart</span>
                            </div>

                            {/* Account */}
                            {isAuthenticated ? (
                                <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => {
                                    setProfileOpen(true);
                                    setCartOpen(false);
                                }}>
                                    <div className="relative p-1">
                                        <UserCircle size={20} className="text-gray-700 group-hover:text-green-600 transition-colors" />
                                    </div>
                                    <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide group-hover:text-green-600">Account</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={handleAuthAction}>
                                    <div className="relative p-1">
                                        <LogIn size={20} className="text-gray-700 group-hover:text-green-600 transition-colors" />
                                    </div>
                                    <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide group-hover:text-green-600">Login</span>
                                </div>
                            )}

                            {/* Mobile Menu Toggle (Simplified) */}
                            <button className="md:hidden p-2 text-gray-700">
                                <Grid size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search Bar (Visible only on mobile) */}
                    <div className="mt-4 md:hidden relative">
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleManualSearch();
                                }
                            }}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                        <button
                            onClick={handleManualSearch}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-green-600"
                        >
                            <Search size={16} />
                        </button>
                        {showSearchDropdown && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                                {searchResults.map((product) => (
                                    <div
                                        key={product._id}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleSelectProduct(product);
                                        }}
                                        className="p-3 border-b border-gray-50 flex items-center gap-2"
                                    >
                                        <span className="text-sm text-gray-800">{product.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Bar */}
                <div className="border-t border-gray-100 hidden md:block">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-8 py-0">
                            {/* Browse Categories Dropdown Button */}
                            <div className="relative group">
                                <button className="bg-green-600 text-white px-6 py-2.5 flex items-center gap-2 font-semibold hover:bg-green-700 transition-colors rounded-t-lg group-hover:rounded-b-none min-w-[220px]">
                                    <Grid size={18} />
                                    Browse By Categories
                                    <ChevronDown size={14} className="ml-auto" />
                                </button>
                                {/* Dropdown Content */}
                                <div className="absolute top-full left-0 w-full bg-white shadow-lg border border-gray-100 hidden group-hover:block z-40 rounded-b-lg">
                                    <div className="py-2 max-h-[400px] overflow-y-auto">
                                        {categories.length > 0 ? (
                                            categories.map((category) => (
                                                <div
                                                    key={category._id}
                                                    onClick={() => router.push(`/products?category=${encodeURIComponent(category.name)}&categoryId=${category._id}&showAll=true`)}
                                                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 flex items-center gap-2"
                                                >
                                                    {category.name}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-sm text-gray-400">Loading...</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Nav Links */}
                            <nav className="flex items-center gap-8 flex-1">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => scrollToSection(item.id)}
                                        className="flex items-center gap-1.5 font-semibold text-gray-700 hover:text-green-600 transition-colors text-sm uppercase tracking-wide"
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </nav>

                            {/* Daily Offer Highlight */}
                            <div className="text-sm font-bold text-gray-800 flex items-center gap-1">
                                <PhoneCall size={16} className="text-green-600" />
                                <span>+91 93225 06730</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {cartOpen && (
                    <React.Fragment key="cart-slider">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
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
                    </React.Fragment>
                )}

                {profileOpen && isAuthenticated && (
                    <React.Fragment key="profile-slider">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
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
                    </React.Fragment>
                )}

                {wishlistOpen && isAuthenticated && (
                    <React.Fragment key="wishlist-slider">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/30 z-[998]"
                            onClick={() => setWishlistOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 w-full sm:w-11/12 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-md h-full bg-white z-[999] flex flex-col shadow-xl overflow-y-auto no-scrollbar"
                        >
                            {renderWishlist()}
                        </motion.div>
                    </React.Fragment>
                )}

                {showOrderConfirmation && <OrderConfirmation key="order-confirmation-modal" orderId={orderId} />}
                {showRemoveConfirmation && <RemoveConfirmationModal key="remove-confirmation-modal" />}
                {alertModal.isOpen && (
                    <AlertModal
                        key="alert-modal"
                        isOpen={alertModal.isOpen}
                        message={alertModal.message}
                        onClose={closeAlert}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;