'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart, X, Minus, Plus, Trash, Info, Clock, Package, CheckCircle, Shield, PhoneCall, ArrowRight, LogIn, Truck, Mail, User, Lock, Smartphone, ArrowLeft, CreditCard, Wallet, Banknote } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import AuthModal from './AuthModal';

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

  const { user, isAuthenticated, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'address', 'payment'
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      type: 'Home',
      address: 'Parner Bhavan, 302, 3rd floor, Parner Bhavan, Parner Taluka Mitra Mandal Hostel, Dattraj Colony, Mangal Nagar, Wakad, Pimpri Chinchwad, Maharashtra',
      isDefault: true
    }
  ]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    flat: '',
    floor: '',
    area: '',
    landmark: '',
    name: '',
    phone: ''
  });

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

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
    } else {
      setShowAuthModal(true);
    }
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      setCartOpen(false);
      setTimeout(() => setShowAuthModal(true), 300);
    } else {
      setCheckoutStep('address');
    }
  };

  const handleAddNewAddress = () => {
    setShowAddAddressForm(true);
  };

  const handleSaveAddress = () => {
    const fullAddress = `${newAddress.flat}, ${newAddress.floor && `Floor ${newAddress.floor},`} ${newAddress.area}, ${newAddress.landmark && `Near ${newAddress.landmark},`} Pune, Maharashtra`;
    
    const newAddressObj = {
      id: `addr-${Date.now()}`,
      type: newAddress.type,
      address: fullAddress,
      isDefault: false
    };
    
    setAddresses([...addresses, newAddressObj]);
    setSelectedAddress(newAddressObj.id);
    setNewAddress({
      type: 'Home',
      flat: '',
      floor: '',
      area: '',
      landmark: '',
      name: '',
      phone: ''
    });
    setShowAddAddressForm(false);
  };

  const handleAddressSelection = (addressId) => {
    setSelectedAddress(addressId);
  };

  const handleProceedToPayment = () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }
    setCheckoutStep('payment');
  };

  const handlePlaceOrder = () => {
    // Here you would typically send the order to your backend
    alert('Order placed successfully!');
    setCartOpen(false);
    setCheckoutStep('cart');
  };

  const renderCart = () => (
    <>
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
        <button
          onClick={() => setCheckoutStep('cart')}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition hover:text-gray-700"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Select delivery address</h2>
        <div className="w-8"></div> {/* Spacer for alignment */}
      </div>
      
      <div className="p-6">
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Add a new address</h3>
          <button
            onClick={handleAddNewAddress}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 hover:bg-green-50 transition flex items-center justify-center"
          >
            <Plus size={20} className="text-green-600 mr-2" />
            <span className="text-green-600 font-medium">Add new address</span>
          </button>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Your saved addresses</h3>
          <div className="space-y-4">
            {addresses.map(address => (
              <div 
                key={address.id} 
                className={`border rounded-lg p-4 cursor-pointer transition ${selectedAddress === address.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => handleAddressSelection(address.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{address.type}</span>
                      {address.isDefault && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Default</span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{address.address}</p>
                  </div>
                  {selectedAddress === address.id && (
                    <CheckCircle className="text-green-500" size={20} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 shadow-sm">
        <button
          onClick={handleProceedToPayment}
          disabled={!selectedAddress}
          className={`w-full ${selectedAddress ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'} text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors shadow-md`}
        >
          Proceed to Payment
          <ArrowRight className="ml-2" size={18} />
        </button>
      </div>
    </>
  );

  const renderAddAddressForm = () => (
    <>
      <div className="flex items-center justify-between p-6 pb-3 border-b sticky top-0 bg-white z-10">
        <button
          onClick={() => setShowAddAddressForm(false)}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition hover:text-gray-700"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Enter complete address</h2>
        <div className="w-8"></div> {/* Spacer for alignment */}
      </div>
      
      <div className="p-6">
        <div className="flex gap-2 mb-6">
          {['Home', 'Work', 'Hotel', 'Other'].map(type => (
            <button
              key={type}
              onClick={() => setNewAddress({...newAddress, type})}
              className={`px-4 py-2 rounded-md text-sm font-medium ${newAddress.type === type ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {type}
            </button>
          ))}
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Flat / House no / Building name *</label>
            <input
              type="text"
              value={newAddress.flat}
              onChange={(e) => setNewAddress({...newAddress, flat: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 302, Parner Bhavan"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Floor (optional)</label>
            <input
              type="text"
              value={newAddress.floor}
              onChange={(e) => setNewAddress({...newAddress, floor: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 3rd floor"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area / Sector / Locality *</label>
            <input
              type="text"
              value={newAddress.area}
              onChange={(e) => setNewAddress({...newAddress, area: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. Wakad, Pune"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nearby landmark (optional)</label>
            <input
              type="text"
              value={newAddress.landmark}
              onChange={(e) => setNewAddress({...newAddress, landmark: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. Near Wakad Bridge"
            />
          </div>
          
          <div className="pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Enter your details for seamless delivery experience</h4>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Your name *</label>
              <input
                type="text"
                value={newAddress.name}
                onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Your name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your phone number (optional)</label>
              <input
                type="tel"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Phone number"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 shadow-sm">
        <button
          onClick={handleSaveAddress}
          disabled={!newAddress.flat || !newAddress.area || !newAddress.name}
          className={`w-full ${(!newAddress.flat || !newAddress.area || !newAddress.name) ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors shadow-md`}
        >
          Save Address
        </button>
      </div>
    </>
  );

  const renderPaymentMethod = () => (
    <>
      <div className="flex items-center justify-between p-6 pb-3 border-b sticky top-0 bg-white z-10">
        <button
          onClick={() => setCheckoutStep('address')}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition hover:text-gray-700"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Select Payment Method</h2>
        <div className="w-8"></div> {/* Spacer for alignment */}
      </div>
      
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Wallets</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition">
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-gray-600" />
                <span>Credit or Debit Card</span>
              </div>
              <ArrowRight size={18} className="text-gray-400" />
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition">
              <div className="flex items-center gap-3">
                <Wallet size={20} className="text-gray-600" />
                <span>Netbanking</span>
              </div>
              <ArrowRight size={18} className="text-gray-400" />
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition">
              <div className="flex items-center gap-3">
                <Smartphone size={20} className="text-gray-600" />
                <span>UPI</span>
              </div>
              <ArrowRight size={18} className="text-gray-400" />
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition">
              <div className="flex items-center gap-3">
                <Banknote size={20} className="text-gray-600" />
                <span>Cash on Delivery</span>
              </div>
              <ArrowRight size={18} className="text-gray-400" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Cash on delivery is not applicable on orders with item total less than ₹50
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Pay Later</h3>
          <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-gray-600" />
              <span>Pay after delivery</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold mb-3">Delivery Address</h3>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start gap-2">
              <div className="bg-green-100 p-1.5 rounded-full">
                <Truck size={16} className="text-green-600" />
              </div>
              <div>
                <div className="font-medium">
                  {addresses.find(a => a.id === selectedAddress)?.type}: {addresses.find(a => a.id === selectedAddress)?.address.split(',')[0]}
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  {addresses.find(a => a.id === selectedAddress)?.address}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">My Cart</h3>
          <div className="space-y-3">
            {cart.map(item => (
              <div key={item._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Image
                    src={item.image}
                    width={48}
                    height={48}
                    alt={item.name}
                    className="rounded-lg object-cover border border-gray-100"
                  />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-gray-500 text-xs">{item.unit}</div>
                  </div>
                </div>
                <div className="font-bold text-green-700">₹{((item.discountedPrice || item.price) * item.qty).toFixed(2)}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Items total</span>
              <span className="font-medium">₹{itemsTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Delivery charge</span>
              <span className="font-medium">₹{charges.deliveryCharge}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Handling charge</span>
              <span className="font-medium">₹{charges.handlingCharge}</span>
            </div>
            {charges.showSmallCartCharge && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Small cart charge</span>
                <span className="font-medium">₹{charges.smallCartCharge}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center">
              <span className="font-semibold">Grand total</span>
              <span className="font-bold text-lg text-green-700">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 shadow-sm">
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors shadow-md"
        >
          Pay Now
        </button>
      </div>
    </>
  );

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
                    onClick={handleAuthAction}
                    className="px-4 py-2 border border-green-600 text-green-600 rounded-md font-semibold hover:bg-green-50"
                  >
                    {isAuthenticated ? 'Logout' : 'Login'}
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => {
                        setCartOpen(true);
                        setCheckoutStep('cart');
                      }}
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
  initial={{ x: '100%' }}
  animate={{ x: 0 }}
  exit={{ x: '100%' }}
  transition={{ type: 'spring', damping: 30 }}
  className="fixed top-0 right-0 w-full sm:max-w-md h-full bg-white z-[999] flex flex-col shadow-xl overflow-y-auto no-scrollbar" // Changed from hide-scrollbar to no-scrollbar
></motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-[998]"
              onClick={() => {
                setCartOpen(false);
                setCheckoutStep('cart');
                setShowAddAddressForm(false);
              }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30 }}
              className="fixed top-0 right-0 w-full sm:max-w-md h-full bg-white z-[999] flex flex-col shadow-xl overflow-y-auto hide-scrollbar"
            >
              {showAddAddressForm ? renderAddAddressForm() : 
               checkoutStep === 'cart' ? renderCart() : 
               checkoutStep === 'address' ? renderAddressSelection() : 
               renderPaymentMethod()}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;