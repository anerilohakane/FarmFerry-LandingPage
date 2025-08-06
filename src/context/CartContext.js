'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../utils/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [deliveryCharges, setDeliveryCharges] = useState({
    deliveryCharge: 25,
    handlingCharge: 2,
    smallCartCharge: 20,
    smallCartThreshold: 100,
    deliveryTime: "30 minutes",
    freeDeliveryThreshold: 500
  });
  const [loadingCharges, setLoadingCharges] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('farmferry-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setCart([]);
      }
    }
  }, []);

  // Fetch delivery charges from backend
  useEffect(() => {
    const fetchDeliveryCharges = async () => {
      try {
        setLoadingCharges(true);
        const response = await apiService.getDeliveryCharges();
        if (response?.data) {
          setDeliveryCharges(response.data);
        }
      } catch (error) {
        console.error('Error fetching delivery charges:', error);
        // Keep default values if API fails
      } finally {
        setLoadingCharges(false);
      }
    };

    fetchDeliveryCharges();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('farmferry-cart', JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      
      if (existingItem) {
        // If item exists, increase quantity
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      } else {
        // If item doesn't exist, add new item
        const newItem = {
          _id: product._id,
          name: product.name,
          price: parseFloat(product.price) || 0,
          discountedPrice: product.discountedPrice ? parseFloat(product.discountedPrice) : null,
          offerPercentage: product.offerPercentage,
          unit: product.unit,
          stockQuantity: product.stockQuantity,
          image: product.images?.[0]?.url || '/images/explore/tomato.png',
          qty: 1
        };
        return [...prevCart, newItem];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === productId
          ? { ...item, qty: newQty }
          : item
      )
    );
  };

  // Increase quantity
  const increaseQty = (productId) => {
    updateQuantity(productId, cart.find(item => item._id === productId)?.qty + 1);
  };

  // Decrease quantity
  const decreaseQty = (productId) => {
    const currentItem = cart.find(item => item._id === productId);
    if (currentItem && currentItem.qty > 1) {
      updateQuantity(productId, currentItem.qty - 1);
    } else {
      removeFromCart(productId);
    }
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Get cart total
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.discountedPrice || item.price) || 0;
      return total + (price * item.qty);
    }, 0);
  };

  // Get cart item count
  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.qty, 0);
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    return cart.some(item => item._id === productId);
  };

  // Get item quantity in cart
  const getItemQuantity = (productId) => {
    const item = cart.find(item => item._id === productId);
    return item ? item.qty : 0;
  };

  // Calculate delivery charges
  const getDeliveryCharges = () => {
    const itemsTotal = getCartTotal();
    const showSmallCartCharge = itemsTotal < deliveryCharges.smallCartThreshold;
    const isFreeDelivery = itemsTotal >= deliveryCharges.freeDeliveryThreshold;
    
    return {
      deliveryCharge: isFreeDelivery ? 0 : deliveryCharges.deliveryCharge,
      handlingCharge: deliveryCharges.handlingCharge,
      smallCartCharge: showSmallCartCharge ? deliveryCharges.smallCartCharge : 0,
      totalCharges: isFreeDelivery ? deliveryCharges.handlingCharge : 
                   deliveryCharges.deliveryCharge + deliveryCharges.handlingCharge + 
                   (showSmallCartCharge ? deliveryCharges.smallCartCharge : 0),
      isFreeDelivery,
      showSmallCartCharge
    };
  };

  // Get grand total
  const getGrandTotal = () => {
    const itemsTotal = getCartTotal();
    const charges = getDeliveryCharges();
    return itemsTotal + charges.totalCharges;
  };

  const value = {
    cart,
    cartOpen,
    setCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQty,
    decreaseQty,
    clearCart,
    getCartTotal,
    getCartItemCount,
    isInCart,
    getItemQuantity,
    deliveryCharges,
    loadingCharges,
    getDeliveryCharges,
    getGrandTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 