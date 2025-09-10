// context/CartContext.js
'use client';


import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const LOCAL_STORAGE_KEY = 'farmferry_cart';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const [cartGST, setCartGST] = useState(0);
  const timeoutRefs = useRef({});

  // Cleanup timeouts on unmount
  useEffect(() => {
    // Store the current ref value in a variable
    const currentTimeouts = timeoutRefs.current;

    return () => {
      Object.values(currentTimeouts).forEach(clearTimeout);
    };
  }, []);

  // Get token from localStorage
  const getToken = () => {
    try {
      const savedTokens = localStorage.getItem('farmferry-tokens');
      const parsedTokens = savedTokens ? JSON.parse(savedTokens) : null;
      return parsedTokens?.accessToken;
    } catch (err) {
      console.error('Error getting token:', err);
      return null;
    }
  };

  const getCartGST = () => {
    // Calculate GST on subtotal instead of individual items
    const subtotal = getCartTotal();
    
    // Get weighted average GST percentage based on item values
    let totalGSTAmount = 0;
    
    cart.forEach(item => {
      const itemPrice = item.discountedPrice || item.price || 0;
      const itemQuantity = item.qty || item.quantity || 1;
      const itemTotal = itemPrice * itemQuantity;
      
      // GST % from DB (product level)
      let gstPercent = 0;
      if (item.product && typeof item.product === "object") {
        gstPercent = item.product.gst || 0;
      } else if (item.gst !== undefined) {
        gstPercent = item.gst;
      }
      
      // Calculate GST for this item's total
      const itemGST = (itemTotal * gstPercent) / 100;
      totalGSTAmount += itemGST;
    });
    
    return totalGSTAmount;
  };

  // Helper function to transform API response to consistent cart format
  const transformCartItems = (items) => {
    return items.map(item => ({
      _id: item._id || item.product?._id,
      cartItemId: item._id,
      product: {
        _id: item.product?._id || item._id,
        name: item.product?.name || item.name,
        price: item.product?.price || item.price,
        discountedPrice: item.product?.discountedPrice || item.discountedPrice,
        unit: item.product?.unit || item.unit,
        images: item.product?.images || item.images,
        stockQuantity: item.product?.stockQuantity || item.stockQuantity,
        gst: item.product?.gst || item.gst || 0
      },
      qty: item.quantity || item.qty || 1,
      quantity: item.quantity || item.qty || 1,
      price: item.price || item.product?.price,
      discountedPrice: item.discountedPrice || item.product?.discountedPrice,
      gst: item.product?.gst || item.gst || 0,
      totalPrice: item.totalPrice || (item.price || item.product?.price) * (item.quantity || item.qty || 1)
    }));
  };

  // Unified function to handle API response and set cart
  const handleApiResponse = (data) => {
    // console.log('Handling API response:', data);

    if (data.data && data.data.cart && Array.isArray(data.data.cart.items)) {
      const cartItems = transformCartItems(data.data.cart.items);
      setCart(cartItems);
    } else if (data.cart && Array.isArray(data.cart.items)) {
      const cartItems = transformCartItems(data.cart.items);
      setCart(cartItems);
    } else if (Array.isArray(data.items)) {
      const cartItems = transformCartItems(data.items);
      setCart(cartItems);
    } else if (Array.isArray(data)) {
      const cartItems = transformCartItems(data);
      setCart(cartItems);
    } else {
      console.warn('Unknown cart response structure:', data);
      setCart([]);
    }
  };

  // Helper function to save cart to localStorage
  const saveCartToLocalStorage = (cartData) => {
    try {
      const simplifiedCart = cartData.map(item => ({
        _id: item.product?._id || item._id,
        name: item.product?.name || item.name,
        price: item.product?.price || item.price,
        discountedPrice: item.product?.discountedPrice || item.discountedPrice,
        unit: item.product?.unit || item.unit,
        images: item.product?.images || item.images,
        stockQuantity: item.product?.stockQuantity || item.stockQuantity,
        gst: item.product?.gst || item.gst || 0,
        qty: item.qty || item.quantity,
        cartItemId: item.cartItemId || `local_${Date.now()}_${item._id}`
      }));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(simplifiedCart));
    } catch (err) {
      console.error('Error saving cart to localStorage:', err);
    }
  };

  // Helper function to load cart from localStorage
  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        const transformedCart = parsedCart.map(item => ({
          _id: item._id,
          cartItemId: item.cartItemId,
          product: {
            _id: item._id,
            name: item.name,
            price: item.price,
            discountedPrice: item.discountedPrice,
            unit: item.unit,
            images: item.images,
            stockQuantity: item.stockQuantity,
            gst: item.gst || 0
          },
          qty: item.qty,
          quantity: item.qty,
          price: item.price,
          discountedPrice: item.discountedPrice,
          gst: item.gst || 0,
          totalPrice: (item.discountedPrice || item.price) * item.qty
        }));
        setCart(transformedCart);
        return transformedCart;
      }
      return [];
    } catch (err) {
      console.error('Error loading cart from localStorage:', err);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setCart([]);
      return [];
    }
  };

  // Fetch cart from backend when user is authenticated
  useEffect(() => {
    const fetchCartData = async () => {
      // ... uses handleApiResponse
    };
    fetchCartData();
  }, [isAuthenticated, handleApiResponse]);

  // Save cart to localStorage for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated && cart.length > 0) {
      saveCartToLocalStorage(cart);
    }
  }, [cart, isAuthenticated]);

  // Public fetchCart function for manual refreshing
  const fetchCart = async () => {
    const token = getToken();
    if (!isAuthenticated || !token) {
      loadCartFromLocalStorage();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch cart: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      handleApiResponse(data);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch cart';
      setError(errorMessage);
      console.error('Error fetching cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    try {
      setLoading(true);
      setError(null);

      // Check if product is out of stock
      if (product.stockQuantity === 0) {
        throw new Error('This product is out of stock and cannot be added to cart.');
      }

      const token = getToken();

      if (isAuthenticated && token) {
        // console.log('Adding to cart for authenticated user:', product);
        const response = await fetch(`${API_BASE_URL}/cart/items`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            productId: product._id,
            quantity: 1
          })
        });

        // console.log('Add to cart response status:', response.status);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to add item to cart: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        handleApiResponse(data);
        setCartOpen(true);
        return data;
      } else {
        setCart(prevCart => {
          const existingItem = prevCart.find(item =>
            item.product?._id === product._id || item._id === product._id
          );

          let newCart;
          if (existingItem) {
            newCart = prevCart.map(item =>
              (item.product?._id === product._id || item._id === product._id)
                ? {
                  ...item,
                  qty: (item.qty || 0) + 1,
                  quantity: (item.quantity || 0) + 1
                }
                : item
            );
          } else {
            newCart = [...prevCart, {
              _id: product._id,
              cartItemId: `local_${Date.now()}_${product._id}`,
              product: {
                _id: product._id,
                name: product.name,
                price: product.price,
                discountedPrice: product.discountedPrice,
                unit: product.unit,
                images: product.images,
                stockQuantity: product.stockQuantity,
                gst: product.gst || 0
              },
              qty: 1,
              quantity: 1,
              price: product.price,
              discountedPrice: product.discountedPrice,
              gst: product.gst || 0,
              totalPrice: product.discountedPrice || product.price
            }];
          }

          saveCartToLocalStorage(newCart);
          return newCart;
        });

        setCartOpen(true);
        return { success: true };
      }
    } catch (err) {
      const errorMessage = err.message || 'Unknown error adding to cart';
      setError(errorMessage);
      console.error('Error adding to cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const increaseQty = async (cartItemId) => {
    try {
      setError(null);
      const token = getToken();
      const currentItem = cart.find(item =>
        item._id === cartItemId || item.cartItemId === cartItemId
      );

      if (!currentItem) {
        throw new Error('Item not found in cart');
      }

      const newQuantity = (currentItem.qty || currentItem.quantity || 0) + 1;

      if (isAuthenticated && token) {
        const response = await fetch(`${API_BASE_URL}/cart/items/${cartItemId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            quantity: newQuantity
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update quantity');
        }

        const data = await response.json();
        handleApiResponse(data);
      } else {
        setCart(prevCart => {
          const newCart = prevCart.map(item =>
            (item._id === cartItemId || item.cartItemId === cartItemId)
              ? {
                ...item,
                qty: newQuantity,
                quantity: newQuantity
              }
              : item
          );
          saveCartToLocalStorage(newCart);
          return newCart;
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Error increasing quantity:', err);
      throw err;
    }
  };

  const decreaseQty = async (cartItemId) => {
    try {
      setError(null);
      const token = getToken();
      const currentItem = cart.find(item =>
        item._id === cartItemId || item.cartItemId === cartItemId
      );

      if (!currentItem) {
        throw new Error('Item not found in cart');
      }

      const newQuantity = (currentItem.qty || currentItem.quantity || 0) - 1;

      if (newQuantity <= 0) {
        await removeFromCart(cartItemId);
        return;
      }

      if (isAuthenticated && token) {
        const response = await fetch(`${API_BASE_URL}/cart/items/${cartItemId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            quantity: newQuantity
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update quantity');
        }

        const data = await response.json();
        handleApiResponse(data);
      } else {
        setCart(prevCart => {
          const newCart = prevCart.map(item =>
            (item._id === cartItemId || item.cartItemId === cartItemId)
              ? {
                ...item,
                qty: newQuantity,
                quantity: newQuantity
              }
              : item
          );
          saveCartToLocalStorage(newCart);
          return newCart;
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Error decreasing quantity:', err);
      throw err;
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      setError(null);
      const token = getToken();

      if (isAuthenticated && token) {
        const response = await fetch(`${API_BASE_URL}/cart/items/${cartItemId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to remove item from cart');
        }

        const data = await response.json();
        handleApiResponse(data);
      } else {
        setCart(prevCart => {
          const newCart = prevCart.filter(item =>
            !(item._id === cartItemId || item.cartItemId === cartItemId)
          );
          saveCartToLocalStorage(newCart);
          return newCart;
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Error removing from cart:', err);
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      const token = getToken();

      if (isAuthenticated && token) {
        const response = await fetch(`${API_BASE_URL}/cart`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to clear cart');
        }

        setCart([]);
      } else {
        setCart([]);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error clearing cart:', err);
      throw err;
    }
  };

  // ADD THE MISSING syncLocalCartToServer FUNCTION
  const syncLocalCartToServer = async () => {
    const token = getToken();
    if (!isAuthenticated || !token || cart.length === 0) return;

    try {
      const localItems = cart.filter(item => item.cartItemId && item.cartItemId.startsWith('local_'));

      if (localItems.length > 0) {
        for (const item of localItems) {
          await fetch(`${API_BASE_URL}/cart/items`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              productId: item._id,
              quantity: item.qty
            })
          });
        }

        await fetchCart();
      }
    } catch (err) {
      console.error('Error syncing local cart to server:', err);
      throw err;
    }
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + (item.qty || item.quantity || 0), 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.discountedPrice || item.price || 0;
      const quantity = item.qty || item.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  const getDeliveryCharges = () => {
    const itemsTotal = getCartTotal();
    const deliveryTime = "30-45 mins";
    const deliveryDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });

    // Updated pricing structure
    const isFreeDelivery = itemsTotal >= 500; // Free delivery threshold
    const deliveryCharge = isFreeDelivery ? 0 : 20; // ₹20 delivery charge
    const platformFee = 2; // ₹2 platform fee
    const handlingCharge = 0; // Remove handling charge as requested
    
    // GST calculation (18% on platform fee and delivery charge)
    const taxableAmount = platformFee + (isFreeDelivery ? 0 : deliveryCharge);
    const gst = getCartGST();
    //const gst = Math.round(taxableAmount * 0.18 * 100) / 100; // 18% GST, rounded to 2 decimals

    return {
      deliveryTime,
      deliveryDate,
      isFreeDelivery,
      deliveryCharge,
      platformFee,
      handlingCharge,
      gst,
      taxableAmount
    };
  };

  const getGrandTotal = () => {
    const itemsTotal = getCartTotal();
    const charges = getDeliveryCharges();
    return itemsTotal + charges.deliveryCharge + charges.platformFee + charges.handlingCharge + charges.gst;
  };

  const value = {
    cart,
    cartOpen,
    setCartOpen,
    loading,
    error,
    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    getCartItemCount,
    getCartTotal,
    getCartGST,
    getDeliveryCharges,
    getGrandTotal,
    clearCart,
    syncLocalCartToServer, // Now this function is defined
    refreshCart: fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};