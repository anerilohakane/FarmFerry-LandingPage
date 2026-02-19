// context/CartContext.js
'use client';


import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { apiService } from '../utils/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Use Next.js proxy to handle API calls
const API_BASE_URL = '/api';
const LOCAL_STORAGE_KEY = 'farmferry_cart';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, loading: authLoading } = useAuth();
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
      // console.log('Retrieved token:', parsedTokens);

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
    if (!Array.isArray(items)) {
      console.warn('transformCartItems: items is not an array', items);
      return [];
    }

    return items.map(item => {
      // Handle both 'product' (from GET formatter) and 'productId' (from Mongoose populate in POST)
      let productObj = item.product || (item.productId && typeof item.productId === 'object' ? item.productId : null) || {};

      // Handle case where product is just an ID string (unpopulated)
      if (typeof item.product === 'string') {
        productObj = { _id: item.product };
      } else if (typeof item.productId === 'string') {
        productObj = { _id: item.productId, ...productObj };
      }

      // Determine the Product ID
      // If productObj has _id, use it. Otherwise fallback to item._id if it looks like a product ID (not cart item ID)
      // BUT item._id from backend GET /cart IS the Cart Item ID.
      // So be careful.
      // If productObj._id exists, usage is safe.
      const explicitProductId = productObj._id || (typeof item.productId === 'string' ? item.productId : null);

      // Fallback: If no explicit product ID, and item._id matches product ID format (usually we won't know for sure), use it?
      // Actually, if we are here, we MUST have a product ID.
      // If explicitProductId is missing, we might be in trouble (Ghost Item).
      // But let's assume item._id *could* be the product ID if this is a flat product list.
      const productId = explicitProductId || item._id;

      return {
        _id: productId, // Internal ID (Product ID)
        cartItemId: item._id, // Backend Cart Item ID
        backendCartItemId: item._id, // Explicit reference
        product: {
          _id: productId,
          name: productObj.name || item.name || 'Unknown Product',
          price: Number(productObj.price || item.price || 0),
          discountedPrice: Number(productObj.discountedPrice || item.discountedPrice || 0),
          unit: productObj.unit || item.unit || '',
          images: productObj.images || item.images || [],
          stockQuantity: Number(productObj.stockQuantity || item.stockQuantity || 0),
          gst: Number(productObj.gst || item.gst || 0),
          supplier: productObj.supplier || item.supplier || productObj.supplierId || item.supplierId
        },
        qty: Number(item.quantity || item.qty || 1),
        quantity: Number(item.quantity || item.qty || 1),
        price: Number(item.price || productObj.price || 0),
        discountedPrice: Number(item.discountedPrice || productObj.discountedPrice || 0),
        gst: Number(productObj.gst || item.gst || 0),
        totalPrice: Number(item.totalPrice || (Number(item.price || productObj.price || 0) * Number(item.quantity || item.qty || 1)))
      };
    });
  };

  // Unified function to handle API response and set cart
  const handleApiResponse = (response) => {
    // console.log('Handling API response:', response);

    // Support multiple response structures
    let items = [];

    if (response.data && Array.isArray(response.data.items)) {
      // New Backend Format: { success: true, data: { items: [...] } }
      items = response.data.items;
    } else if (response.data && response.data.cart && Array.isArray(response.data.cart.items)) {
      // Possible Nested Format: { success: true, data: { cart: { items: [...] } } }
      items = response.data.cart.items;
    } else if (response.cart && Array.isArray(response.cart.items)) {
      // Legacy/Alternative: { success: true, cart: { items: [...] } }
      items = response.cart.items;
    } else if (Array.isArray(response.items)) {
      // Flattened: { items: [...] }
      items = response.items;
    } else if (Array.isArray(response.data)) {
      // Direct Array: { success: true, data: [...] }
      items = response.data;
    } else if (Array.isArray(response)) {
      // Pure Array: [...]
      items = response;
    } else {
      console.warn('Unknown cart response structure:', response);
      // Don't clear cart immediately on unknown structure to prevent flashing empty, 
      // but if it's a valid "success" with no data, maybe it is empty.
      // For now, if we can't find items, we assume empty or error.
      // But verify if it's just a success message without data?
      if (response.success && !response.data) {
        // Maybe just a status update? Keep current cart?
        return;
      }
      items = [];
    }

    const cartItems = transformCartItems(items);
    setCart(cartItems);
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
        supplier: item.product?.supplier || item.supplier,
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
            gst: item.gst || 0,
            supplier: item.supplier
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

  // Fetch cart from backend when user is authenticated, clear when logged out
  useEffect(() => {
    const manageCartState = async () => {
      if (isAuthenticated) {
        // User just logged in or is authenticated
        try {
          // Optional: Sync any local items before fetching
          // await syncLocalCartToServer(); 

          await fetchCart();
        } catch (error) {
          console.error('Failed to fetch user cart:', error);
        }
      } else {
        // User logged out
        setCart([]);
        // Optionally clear local storage if you don't want guest cart persistence after logout
        // localStorage.removeItem(LOCAL_STORAGE_KEY); 
      }
    };

    manageCartState();
  }, [isAuthenticated]);

  // Save guest cart to localStorage
  useEffect(() => {
    if (!isAuthenticated && cart.length > 0) {
      saveCartToLocalStorage(cart);
    }
  }, [cart, isAuthenticated]);

  // Public fetchCart function for manual refreshing
  const fetchCart = async () => {
    if (!isAuthenticated) {
      loadCartFromLocalStorage();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getCart();

      handleApiResponse(response);
      return response;
      // if (response.success) {
      //   handleApiResponse(response);
      //   return response;
      // } else {
      //   throw new Error(response.message || 'Failed to fetch cart');
      // }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch cart';
      setError(errorMessage);
      console.error('Error fetching cart:', err);
      // throw err; // Don't throw to avoid crashing UI components
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    try {
      setLoading(true);
      setError(null);

      console.log('addToCart called with:', product);
      console.log('Is Authenticated:', isAuthenticated);

      // Check if product is out of stock
      if (product.stockQuantity === 0) {
        throw new Error('This product is out of stock and cannot be added to cart.');
      }

      const token = getToken();
      console.log('Token available:', !!token);

      if (isAuthenticated && token) {
        console.log('Adding to cart for authenticated user:', product._id);
        try {
          const response = await apiService.addToCart(product._id, 1, user?._id);
          console.log('addToCart API response:', response);

          // if (!response.success) { ... } // Removed strict check

          handleApiResponse(response);
          setCartOpen(true);
          return response;
        } catch (apiError) {
          console.error('addToCart API error:', apiError);
          throw apiError;
        }
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
                gst: product.gst || 0,
                supplier: product.supplier || product.supplierId
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
      alert(errorMessage); // Added alert for visibility
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
        item._id === cartItemId || item.cartItemId === cartItemId || item.backendCartItemId === cartItemId
      );

      if (!currentItem) {
        throw new Error('Item not found in cart');
      }

      const newQuantity = Number(currentItem.qty || currentItem.quantity || 0) + 1;
      // Use the correct backend cart item ID
      // PRIORITY: backendCartItemId -> cartItemId -> _id
      let backendItemId = currentItem.backendCartItemId || currentItem.cartItemId;

      if (!backendItemId || String(backendItemId) === 'undefined') {
        backendItemId = currentItem._id;
      }

      // Robustness: If somehow it's still invalid, use the passed cartItemId if it looks like a real ID
      if ((!backendItemId || String(backendItemId) === 'undefined') && cartItemId && String(cartItemId) !== 'undefined') {
        backendItemId = cartItemId;
      }

      console.log('increaseQty: Resolved backendItemId:', backendItemId, 'for item:', currentItem);

      if (!backendItemId || String(backendItemId) === 'undefined') {
        console.error('increaseQty: ID resolution failed');
        await fetchCart();
        throw new Error('Cart sync issue. Refreshed.');
      }


      // Check stock limit
      if (currentItem.product?.stockQuantity != null && newQuantity > currentItem.product.stockQuantity) {
        throw new Error(`Only ${currentItem.product.stockQuantity} items available in stock`);
      }

      if (isAuthenticated && token) {
        // ROBUSTNESS: Instead of PUT /cart/items/${id} which can fail if IDs are out of sync,
        // we use addToCart which uses the Product ID and always works.
        // This is a "Self-Healing" approach.
        const productToAdd = currentItem.product || { _id: currentItem._id };

        // We call the internal addToCart logic (which handles the POST /cart)
        // This ensures the item quantity is bumped on the server reliably.
        await addToCart(productToAdd, 1);
        return;
      } else {
        // Non-auth cart update
        setCart(prevCart => {
          const newCart = prevCart.map(item =>
            (item._id === cartItemId || item.cartItemId === cartItemId || item.backendCartItemId === cartItemId)
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
      const errorMessage = err.message || 'Failed to increase quantity';
      setError(errorMessage);
      console.error('Error increasing quantity:', err);
      throw err; // Re-throw to allow UI to handle error
    }
  };

  const decreaseQty = async (cartItemId) => {
    try {
      setError(null);
      const token = getToken();
      const currentItem = cart.find(item =>
        item._id === cartItemId || item.cartItemId === cartItemId || item.backendCartItemId === cartItemId
      );

      if (!currentItem) {
        throw new Error('Item not found in cart');
      }

      const newQuantity = Number(currentItem.qty || currentItem.quantity || 0) - 1;

      if (newQuantity <= 0) {
        await removeFromCart(cartItemId);
        return;
      }

      // Use the correct backend cart item ID
      let backendItemId = currentItem.backendCartItemId || currentItem.cartItemId;

      if (!backendItemId || String(backendItemId) === 'undefined') {
        backendItemId = currentItem._id;
      }

      if ((!backendItemId || String(backendItemId) === 'undefined') && cartItemId && String(cartItemId) !== 'undefined') {
        backendItemId = cartItemId;
      }

      console.log('decreaseQty: Resolved backendItemId:', backendItemId, 'for item:', currentItem);

      if (!backendItemId || String(backendItemId) === 'undefined') {
        console.error('decreaseQty: Unable to resolve valid backendItemId for item:', currentItem);
        // Try to recover by fetching cart
        await fetchCart();
        throw new Error('Item ID missing. Cart refreshed.');
      }

      if (isAuthenticated && token) {
        // ROBUSTNESS: Use PATCH /cart with productId instead of PUT /cart/items/${id}
        // This is much more stable because product IDs never change.
        const productId = currentItem.product?._id || currentItem._id;

        const response = await fetch(`${API_BASE_URL}/cart`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            productId: productId,
            quantity: newQuantity
          })
        });

        if (!response.ok) {
          if (response.status === 404) {
            console.warn('Item not found on server (404) during decrease, refreshing cart...');
            await fetchCart();
            throw new Error('Cart was out of sync. Please try again.');
          }
          const errorText = await response.text();
          throw new Error(`Failed to update quantity: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        handleApiResponse(data);
      } else {
        setCart(prevCart => {
          const newCart = prevCart.map(item =>
            (item._id === cartItemId || item.cartItemId === cartItemId || item.backendCartItemId === cartItemId)
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
      const errorMessage = err.message || 'Failed to decrease quantity';
      setError(errorMessage);
      console.error('Error decreasing quantity:', err);
      throw err; // Re-throw to allow UI to handle error
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      setError(null);
      const token = getToken();

      // Validate cartItemId
      if (!cartItemId) {
        throw new Error('Cart item ID is required');
      }

      console.log('removeFromCart called with:', cartItemId);
      // Find the item to get the correct Product ID
      const currentItem = cart.find(item =>
        item._id === cartItemId || item.cartItemId === cartItemId || item.backendCartItemId === cartItemId
      );

      const productId = currentItem?.product?._id || currentItem?._id || cartItemId;

      if (isAuthenticated && token) {
        console.log('Using productId for DELETE:', productId);

        const response = await fetch(`${API_BASE_URL}/cart?productId=${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to remove item from cart: ${response.status} - ${errorText}`);

          // Final Fail-Safe: Always remove from local state if it's a 404
          if (response.status === 404) {
            console.warn('Item not found on server during remove, cleaning up local state...');
          } else {
            throw new Error(`Failed to remove item from cart: ${response.status}`);
          }
        }

        const data = await response.json();
        handleApiResponse(data);
      } else {
        // For non-authenticated users
        setCart(prevCart => {
          const newCart = prevCart.filter(item =>
            !(item._id === cartItemId || item.cartItemId === cartItemId || item.backendCartItemId === cartItemId)
          );
          saveCartToLocalStorage(newCart);
          return newCart;
        });
      }
    } catch (err) {
      // Local removal fail-safe even on error
      setCart(prevCart => prevCart.filter(item =>
        !(item._id === cartItemId || item.cartItemId === cartItemId || item.backendCartItemId === cartItemId)
      ));
      const errorMessage = err.message || 'Failed to remove item';
      setError(errorMessage);
      console.error('Error removing from cart:', err);
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