'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  User,
  MapPin,
  HelpCircle,
  Shield,
  LogOut,
  ArrowRight,
  Package,
  Loader,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Star,
  Calendar,
  Truck,
  CheckCircle,
  XCircle,
  CreditCard,
  ShoppingBag,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import AddressList from '../components/AddressList';
import FarmFerryFAQ from '../components/FarmFerryFAQ';
import AccountPrivacy from '../components/AccountPrivacy';
import { apiService } from '../../utils/api';

// Account items for sidebar
const accountItems = [
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
  { id: 'faqs', label: "FAQ'S", icon: HelpCircle },
  { id: 'privacy', label: 'Account Privacy', icon: Shield },
];


const getToken = () => {
  try {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') {
      return null;
    }

    const savedTokens = localStorage.getItem('farmferry-tokens');
    if (!savedTokens) return null;

    const parsedTokens = JSON.parse(savedTokens);
    return parsedTokens?.accessToken;
  } catch (err) {
    console.error('Error getting token:', err);
    return null;
  }
};

// Add this function before the return statement in OrdersList
// const calculateOrderSummary = (order) => {
//   const itemsTotal = order.items.reduce((total, item) => {
//     const itemPrice = (item.discountedPrice && item.discountedPrice > 0)
//       ? item.discountedPrice
//       : item.price;
//     return total + (itemPrice * item.quantity);
//   }, 0);

//   const deliveryCharge = order.deliveryCharge || 0;
//   const platformFee = order.platformFee || 2;
//   const gst = order.gst || 0;
//   const calculatedTotal = itemsTotal + deliveryCharge + platformFee + gst;

//   return {
//     itemsTotal,
//     deliveryCharge,
//     platformFee,
//     gst,
//     calculatedTotal
//   };
// };


const calculateOrderSummary = (order) => {
  const items = Array.isArray(order?.items) ? order.items : [];

  const itemsTotal = items.reduce((total, item) => {
    const itemPrice =
      item.discountedPrice && item.discountedPrice > 0
        ? item.discountedPrice
        : item.price || 0;
    return total + (itemPrice * (item.quantity || 0));
  }, 0);

  const deliveryCharge = order?.deliveryCharge || 0;
  const platformFee = order?.platformFee || 2;
  const gst = order?.gst || 0;
  const calculatedTotal = itemsTotal + deliveryCharge + platformFee + gst;

  return {
    itemsTotal,
    deliveryCharge,
    platformFee,
    gst,
    calculatedTotal,
  };
};

// Enhanced ToastNotification with Framer Motion
const ToastNotification = ({ message, type = 'success', onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg border ${type === 'success'
        ? 'bg-green-50 border-green-200 text-green-800'
        : 'bg-red-50 border-red-200 text-red-800'
        }`}
    >
      {type === 'success' ? (
        <CheckCircle size={20} className="mr-2 text-green-600" />
      ) : (
        <AlertCircle size={20} className="mr-2 text-red-600" />
      )}
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-gray-500 hover:text-gray-700"
      >
        <XCircle size={16} />
      </button>
    </motion.div>
  );
};

// Confirmation Modal Component with animations
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel" }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center mb-4">
              <AlertCircle size={24} className="text-yellow-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            </div>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Rate Order Modal
const RateOrderModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setFeedback("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, feedback);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Rate Your Order</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <XCircle size={24} />
              </button>
            </div>

            <p className="text-gray-600 mb-6 text-center">
              How was your experience with this order?
            </p>

            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`${star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                      } transition-colors`}
                  />
                </button>
              ))}
            </div>

            <div className="mb-6">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your feedback (optional)..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none h-32"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${rating === 0 || isSubmitting
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 shadow-md"
                }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader size={20} className="animate-spin mr-2" />
                  Submitting...
                </div>
              ) : (
                "Submit Review"
              )}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [debugApiInfo, setDebugApiInfo] = useState(null);

  // Rating State
  const [showRateModal, setShowRateModal] = useState(false);
  const [orderToRate, setOrderToRate] = useState(null);
  const [isRating, setIsRating] = useState(false);

  const summary = calculateOrderSummary(orders);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = getToken();

        if (!token) {
          setError('Please log in to view your orders');
          setLoading(false);
          return;
        }

        const response = await apiService.getMyOrders();

        // apiService handles non-ok responses by throwing or returning structured error
        if (!response.success) {
          console.error('Fetch orders failed:', response);
          if (response.message === 'Unauthorized' || response.message?.includes('token')) {
            setError('Session expired. Please log in again.');
            // Optional: Trigger logout flow here
          } else {
            setError(response.message || 'Failed to fetch orders');
          }
          setLoading(false);
          return;
        }

        console.log('Fetching orders response:', response);

        // Robustly handle various response structures
        let ordersData = [];

        // Strategy 1: response.data.orders (Standard structure)
        if (response.data?.orders && Array.isArray(response.data.orders)) {
          ordersData = response.data.orders;
        }
        // Strategy 2: response.orders (Flat structure)
        else if (response.orders && Array.isArray(response.orders)) {
          ordersData = response.orders;
        }
        // Strategy 3: response.data (Direct array in data)
        else if (Array.isArray(response.data)) {
          ordersData = response.data;
        }
        // Strategy 4: response.data.data (Nested data)
        else if (response.data?.data && Array.isArray(response.data.data)) {
          ordersData = response.data.data;
        }
        // Strategy 5: response.data.items (Pagination structure)
        else if (response.data?.items && Array.isArray(response.data.items)) {
          ordersData = response.data.items;
        }
        // Strategy 6: Direct array response (unlikely but possible if apiService wraps it)
        else if (Array.isArray(response)) {
          ordersData = response;
        }

        console.log('Parsed orders data:', ordersData);
        setOrders(ordersData);


      } catch (err) {
        setError(err.message);
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    setCancellingId(orderId);
    try {
      const response = await apiService.cancelOrder(orderId, 'Cancelled by customer');

      if (!response.success) {
        throw new Error(response.message || 'Failed to cancel order');
      }

      // Update the order status locally with animation
      setOrders(prev => prev.map(order =>
        order._id === orderId
          ? { ...order, status: 'cancelled' }
          : order
      ));

      // Show success toast
      setToast({
        show: true,
        message: 'Order cancelled successfully!',
        type: 'success'
      });

      // Close the modal
      setShowCancelModal(false);
      setOrderToCancel(null);

    } catch (err) {
      console.error('Error cancelling order:', err);

      // Show error toast
      setToast({
        show: true,
        message: err.message || 'Failed to cancel order. Please try again.',
        type: 'error'
      });
    } finally {
      setCancellingId(null);
    }
  };

  const openCancelModal = (orderId) => {
    setOrderToCancel(orderId);
    setShowCancelModal(true);
  };

  const openRateModal = (orderId) => {
    setOrderToRate(orderId);
    setShowRateModal(true);
  };

  const handleRateSubmit = async (rating, feedback) => {
    if (!orderToRate) return;
    setIsRating(true);
    try {
      const response = await apiService.rateOrder(orderToRate, rating, feedback);
      if (response.success) {
        setToast({
          show: true,
          message: 'Thank you for your feedback!',
          type: 'success'
        });
        setShowRateModal(false);
        setOrderToRate(null);
        // Optionally update local order state if we display the rating
      } else {
        throw new Error(response.message || 'Failed to submit rating');
      }
    } catch (error) {
      console.error('Rating failed:', error);
      setToast({
        show: true,
        message: error.message || 'Something went wrong.',
        type: 'error'
      });
    } finally {
      setIsRating(false);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'pending':
        return <Loader size={16} className="animate-spin text-yellow-600" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Truck size={16} className="text-blue-600" />;
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200 p-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader size={48} className="text-green-600 mb-4" />
        </motion.div>
        <span className="text-gray-600 text-lg">Loading your orders...</span>
        <p className="text-gray-400 mt-2">This will just take a moment</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto"
      >
        <div className="flex items-center mb-4">
          <AlertCircle size={24} className="text-red-600 mr-3" />
          <h3 className="text-red-800 font-medium text-lg">Error loading orders</h3>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-red-600 text-white px-4 py-3 rounded-lg text-sm hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  if (orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 px-4 bg-white rounded-xl border border-gray-200"
      >
        <motion.div
          className="bg-green-50 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Package size={48} className="text-green-600" />
        </motion.div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">No orders yet</h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Your orders will appear here once you make a purchase. Start exploring our fresh products!
        </p>
        <Link
          href="/products"
          className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md"
        >
          Start Shopping
        </Link>
      </motion.div>
    );
  }

  // return (
  //   <div>
  //     {/* Toast Notification */}
  //     <AnimatePresence>
  //       {toast.show && (
  //         <ToastNotification
  //           message={toast.message}
  //           type={toast.type}
  //           onClose={() => setToast({ show: false, message: '', type: 'success' })}
  //         />
  //       )}
  //     </AnimatePresence>

  //     {/* Cancel Confirmation Modal */}
  //     <ConfirmationModal
  //       isOpen={showCancelModal}
  //       onClose={() => {
  //         setShowCancelModal(false);
  //         setOrderToCancel(null);
  //       }}
  //       onConfirm={() => handleCancelOrder(orderToCancel)}
  //       title="Cancel Order"
  //       message="Are you sure you want to cancel this order? This action cannot be undone."
  //       confirmText={cancellingId === orderToCancel ? "Cancelling..." : "Yes, Cancel Order"}
  //       cancelText="Keep Order"
  //     />

  //     <div className="flex items-center justify-between mb-6">
  //       <h2 className="text-2xl font-bold text-green-800 flex items-center">
  //         <Package size={24} className="text-green-600 mr-2" />
  //         My Orders
  //       </h2>
  //       <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
  //         {orders.length} order{orders.length !== 1 ? 's' : ''}
  //       </span>
  //     </div>

  //     <div className="space-y-4">
  //       <AnimatePresence>
  //         {orders.map((order) => (
  //           <motion.div
  //             key={order._id}
  //             layout
  //             initial={{ opacity: 0, y: 20 }}
  //             animate={{ opacity: 1, y: 0 }}
  //             exit={{ opacity: 0, height: 0, transition: { duration: 0.3 } }}
  //             transition={{ type: "spring", stiffness: 300, damping: 30 }}
  //             className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white"
  //           >
  //             <div
  //               className="flex justify-between items-start cursor-pointer"
  //               onClick={() => toggleOrderDetails(order._id)}
  //             >
  //               <div className="flex-1">
  //                 <div className="flex items-center gap-3 mb-2">
  //                   <p className="font-semibold text-gray-800">Order #{order.orderId}</p>
  //                   <motion.span
  //                     className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${order.status === 'delivered'
  //                       ? 'bg-green-100 text-green-800'
  //                       : order.status === 'pending'
  //                         ? 'bg-yellow-100 text-yellow-800'
  //                         : order.status === 'cancelled'
  //                           ? 'bg-red-100 text-red-800'
  //                           : 'bg-blue-100 text-blue-800'
  //                       }`}
  //                     whileHover={{ scale: 1.05 }}
  //                   >
  //                     {getStatusIcon(order.status)}
  //                     {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Processing'}
  //                   </motion.span>
  //                 </div>
  //                 <p className="text-gray-600 text-sm flex items-center">
  //                   <Calendar size={14} className="mr-1.5" />
  //                   Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
  //                     day: 'numeric',
  //                     month: 'short',
  //                     year: 'numeric'
  //                   })}
  //                 </p>
  //               </div>
  //               <div className="ml-4">
  //                 {expandedOrder === order._id ? (
  //                   <ChevronUp size={20} className="text-gray-500" />
  //                 ) : (
  //                   <ChevronDown size={20} className="text-gray-500" />
  //                 )}
  //               </div>
  //             </div>

  //             <div className="mt-4 flex justify-between items-center">
  //               <div>
  //                 <p className="text-gray-600 text-sm">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
  //                 <p className="text-sm text-gray-500 flex items-center">
  //                   <Truck size={14} className="mr-1.5" />
  //                   Est. delivery: {new Date(order.estimatedDeliveryDate).toLocaleDateString('en-IN', {
  //                     day: 'numeric',
  //                     month: 'short'
  //                   })}
  //                 </p>
  //               </div>
  //               <div className="text-right">
  //                 <p className="text-gray-600 text-sm">Total Amount</p>
  //                 <p className="font-bold text-lg text-green-700">₹{calculateOrderSummary(order).calculatedTotal.toFixed(2)}</p>
  //               </div>
  //             </div>

  //             <AnimatePresence>
  //               {expandedOrder === order._id && (
  //                 <motion.div
  //                   initial={{ opacity: 0, height: 0 }}
  //                   animate={{ opacity: 1, height: "auto" }}
  //                   exit={{ opacity: 0, height: 0 }}
  //                   transition={{ duration: 0.3 }}
  //                   className="overflow-hidden"
  //                 >
  //                   <div className="mt-4 pt-4 border-t border-gray-100">
  //                     <h4 className="font-medium text-gray-700 mb-3">Order Details</h4>

  //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
  //                       <div>
  //                         <h5 className="text-sm font-medium text-gray-700 mb-2">Items</h5>
  //                         <ul className="space-y-2">
  //                           {order.items.map((item, index) => (
  //                             <motion.li
  //                               key={index}
  //                               className="flex justify-between text-sm"
  //                               initial={{ opacity: 0, x: -20 }}
  //                               animate={{ opacity: 1, x: 0 }}
  //                               transition={{ delay: index * 0.1 }}
  //                             >
  //                               <span className="text-gray-600">
  //                                 {item.quantity} × {item.product?.name || 'Product'}
  //                               </span>
  //                               <span className="font-medium">
  //                                 ₹{((item.discountedPrice || item.price) * item.quantity).toFixed(2)}
  //                               </span>
  //                             </motion.li>
  //                           ))}
  //                         </ul>
  //                       </div>

  //                       {/* Order Summary */}
  //                       <div className="mt-4 pt-3 border-t border-gray-100">
  //                         <h5 className="text-sm font-medium text-gray-700 mb-2">Order Summary</h5>
  //                         {(() => {
  //                           const summary = calculateOrderSummary(order);
  //                           return (
  //                             <div className="space-y-1 text-xs">
  //                               <div className="flex justify-between">
  //                                 <span className="text-gray-600">Items Total</span>
  //                                 <span>₹{summary.itemsTotal.toFixed(2)}</span>
  //                               </div>
  //                               <div className="flex justify-between">
  //                                 <span className="text-gray-600">Delivery</span>
  //                                 <span>{summary.deliveryCharge === 0 ? 'FREE' : `₹${summary.deliveryCharge.toFixed(2)}`}</span>
  //                               </div>
  //                               <div className="flex justify-between">
  //                                 <span className="text-gray-600">Platform Fee</span>
  //                                 <span>₹{summary.platformFee.toFixed(2)}</span>
  //                               </div>
  //                               <div className="flex justify-between">
  //                                 <span className="text-gray-600">GST</span>
  //                                 <span>₹{summary.gst.toFixed(2)}</span>
  //                               </div>
  //                               <div className="flex justify-between pt-2 border-t border-gray-100 font-medium">
  //                                 <span className="text-gray-700">Total</span>
  //                                 <span className="text-green-700">₹{summary.calculatedTotal.toFixed(2)}</span>
  //                               </div>
  //                             </div>
  //                           );
  //                         })()}
  //                       </div>
  //                     </div>

  //                     <div>
  //                       <h5 className="text-sm font-medium text-gray-700 mb-2">Delivery Address</h5>
  //                       {order.deliveryAddress ? (
  //                         <div className="text-sm text-gray-600">
  //                           <p className="font-medium">{order.deliveryAddress.name}</p>
  //                           <p>{order.deliveryAddress.street}</p>
  //                           <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.postalCode}</p>
  //                           <p className="mt-1">{order.deliveryAddress.phone}</p>
  //                         </div>
  //                       ) : (
  //                         <p className="text-sm text-gray-600">Address not available</p>
  //                       )}
  //                     </div>
  //                   </div>

  //                   <div className="flex justify-end space-x-3">
  //                     {order.status === 'delivered' && (
  //                       <motion.button
  //                         whileHover={{ scale: 1.05 }}
  //                         whileTap={{ scale: 0.95 }}
  //                         className="bg-blue-600 text-white font-medium text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center"
  //                       >
  //                         <Star size={16} className="mr-1.5" />
  //                         Rate Order
  //                       </motion.button>
  //                     )}
  //                     {order.status === 'pending' && (
  //                       <motion.button
  //                         whileHover={{ scale: 1.05 }}
  //                         whileTap={{ scale: 0.95 }}
  //                         onClick={(e) => {
  //                           e.stopPropagation();
  //                           openCancelModal(order._id);
  //                         }}
  //                         disabled={cancellingId === order._id}
  //                         className="text-red-600 hover:text-red-800 font-medium text-sm px-4 py-2 border border-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
  //                       >
  //                         {cancellingId === order._id ? (
  //                           <>
  //                             <Loader size={16} className="animate-spin mr-1.5" />
  //                             Cancelling...
  //                           </>
  //                         ) : (
  //                           <>
  //                             <XCircle size={16} className="mr-1.5" />
  //                             Cancel Order
  //                           </>
  //                         )}
  //                       </motion.button>
  //                     )}
  //                   </div>

  //                 </motion.div>
  //         )}
  //       </AnimatePresence>
  //     </motion.div>
  //         ))}
  //   </AnimatePresence>
  //     </div >
  //   </div >
  // );


  return (
    <div>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <ToastNotification
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ show: false, message: '', type: 'success' })}
          />
        )}
      </AnimatePresence>

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setOrderToCancel(null);
        }}
        onConfirm={() => handleCancelOrder(orderToCancel)}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        confirmText={cancellingId === orderToCancel ? "Cancelling..." : "Yes, Cancel Order"}
        cancelText="Keep Order"
      />

      {/* Rate Order Modal */}
      <RateOrderModal
        isOpen={showRateModal}
        onClose={() => setShowRateModal(false)}
        onSubmit={handleRateSubmit}
        isSubmitting={isRating}
      />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-800 flex items-center">
          <ShoppingBag size={24} className="text-green-600 mr-2" />
          My Orders
        </h2>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          {orders.length} order{orders.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {orders.map((order) => {
            const orderSummary = calculateOrderSummary(order);

            return (
              <motion.div
                key={order._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, transition: { duration: 0.3 } }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white"
              >
                {/* Order Header */}
                <div
                  className="flex justify-between items-start p-5 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => toggleOrderDetails(order._id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <FileText size={18} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Order #{order.orderId || order._id?.slice(-8).toUpperCase() || 'N/A'}</p>
                        <p className="text-gray-500 text-sm">
                          {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <motion.span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${order.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {getStatusIcon(order.status)}
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Processing'}
                    </motion.span>

                    <p className="font-bold text-lg text-green-700">₹{orderSummary.calculatedTotal.toFixed(2)}</p>

                    {expandedOrder === order._id ? (
                      <ChevronUp size={20} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-500" />
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedOrder === order._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 border-t border-gray-100">
                        {/* Order Items */}
                        <div className="mb-6">
                          <h4 className="font-medium text-gray-700 mb-4 flex items-center">
                            <Package size={18} className="mr-2 text-green-600" />
                            Order Items ({order.items.length})
                          </h4>
                          <div className="space-y-3">
                            {order.items.map((item, index) => (
                              <motion.div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <div className="flex items-center">
                                  <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0 relative overflow-hidden mr-3">
                                    {item.product?.images?.[0]?.url ? (
                                      <Image
                                        src={item.product.images[0].url}
                                        alt={item.product.name || 'Product'}
                                        fill
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className="flex items-center justify-center h-full w-full bg-green-100">
                                        <Package size={16} className="text-green-600" />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800">
                                      {item.product?.name || 'Product'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Qty: {item.quantity} • ₹{(item.discountedPrice || item.price).toFixed(2)} each
                                    </p>
                                  </div>
                                </div>
                                <span className="font-medium">
                                  ₹{((item.discountedPrice || item.price) * item.quantity).toFixed(2)}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          {/* Order Summary */}
                          <div className="bg-green-50 p-4 rounded-xl">
                            <h5 className="text-sm font-medium text-green-800 mb-3 flex items-center">
                              <CreditCard size={16} className="mr-2" />
                              Payment Summary
                            </h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Items Total</span>
                                <span>₹{orderSummary.itemsTotal.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Delivery</span>
                                <span>{orderSummary.deliveryCharge === 0 ? 'FREE' : `₹${orderSummary.deliveryCharge.toFixed(2)}`}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Platform Fee</span>
                                <span>₹{orderSummary.platformFee.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">GST</span>
                                <span>₹{orderSummary.gst.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between pt-2 border-t border-green-200 font-medium text-green-800">
                                <span>Total Amount</span>
                                <span>₹{orderSummary.calculatedTotal.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Delivery Information */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                              <Truck size={16} className="mr-2 text-blue-600" />
                              Delivery Information
                            </h5>
                            <div className="text-sm">
                              <div className="flex items-center mb-2">
                                <Calendar size={14} className="mr-2 text-gray-500" />
                                <span className="text-gray-600">
                                  Estimated Delivery: {new Date(order.estimatedDeliveryDate).toLocaleDateString('en-IN', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short'
                                  })}
                                </span>
                              </div>

                              {order.deliveryAddress ? (
                                <div className="bg-blue-50 p-3 rounded-lg">
                                  <h6 className="font-medium text-blue-800 mb-1">Delivery Address</h6>
                                  <div className="text-xs text-blue-700">
                                    <p className="font-medium">{order.deliveryAddress.name}</p>
                                    <p>{order.deliveryAddress.street}</p>
                                    <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.postalCode}</p>
                                    <p className="mt-1">📞 {order.deliveryAddress.phone}</p>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-600">Address not available</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                          {order.status === 'delivered' && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                openRateModal(order._id);
                              }}
                              className="bg-blue-600 text-white font-medium text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center"
                            >
                              <Star size={16} className="mr-1.5" />
                              Rate Order
                            </motion.button>
                          )}
                          {order.status === 'pending' && (
                            <div className="flex space-x-2">


                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openCancelModal(order._id);
                                }}
                                disabled={cancellingId === order._id}
                                className="text-red-600 hover:text-red-800 font-medium text-sm px-4 py-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                              >
                                {cancellingId === order._id ? (
                                  <>
                                    <Loader size={16} className="animate-spin mr-1.5" />
                                    Cancelling...
                                  </>
                                ) : (
                                  <>
                                    <XCircle size={16} className="mr-1.5" />
                                    Cancel Order
                                  </>
                                )}
                              </motion.button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};



// Logout function
const logout = () => {
  localStorage.removeItem('farmferry-tokens');
  window.location.href = '/';
};

const MyAccount = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('orders');

  // Read section from URL on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const section = urlParams.get('section');
      if (section && accountItems.some(item => item.id === section)) {
        setActiveSection(section);
      }
    }
  }, []);

  // Update URL when section changes
  const handleSectionChange = (section) => {
    setActiveSection(section);
    router.push(`${pathname}?section=${section}`);
  };

  // Section Renderer
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'addresses':
        return <AddressList />;
      case 'orders':
        return <OrdersList />;
      case 'faqs':
        return <FarmFerryFAQ />;
      case 'privacy':
        return <AccountPrivacy />;
      default:
        return <OrdersList />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add padding-top to account for fixed navbar (approx 80px + some spacing) */}
      <div className="pt-32 md:pt-40">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-sm"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-green-800">My Account</h1>
            <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
          </div>
        </motion.header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* User Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="bg-gradient-to-br from-green-500 to-teal-500 p-4 rounded-full"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <User size={36} className="text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Welcome back!
                </h2>
                <p className="text-gray-600">Manage your account settings and track your orders</p>
              </div>
            </div>
          </motion.div>

          {/* Sidebar + Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:w-1/4 bg-white rounded-xl border border-gray-200 p-5 h-fit lg:sticky lg:top-32 shadow-sm"
            >
              <div className="space-y-2">
                {accountItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    onClick={() => handleSectionChange(item.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${activeSection === item.id
                      ? 'bg-green-100 text-green-700 font-medium border border-green-200'
                      : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} className={activeSection === item.id ? "text-green-600" : "text-gray-500"} />
                      <span>{item.label}</span>
                    </div>
                    <ArrowRight size={18} className={activeSection === item.id ? "text-green-600" : "text-gray-400"} />
                  </motion.button>
                ))}

                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={logout}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 px-4 rounded-xl flex items-center justify-center transition-colors mt-4 border border-red-100"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="mr-2" size={18} />
                  Log Out
                </motion.button>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:w-3/4 bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            >
              {renderSectionContent()}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyAccount;