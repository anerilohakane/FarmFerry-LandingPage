'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Minus, Plus, Trash } from 'lucide-react';
import Image from 'next/image';

// Login Modal Component
function LoginModal({ open, onClose }) {
  const [mobile, setMobile] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
    if (!open) {
      setMobile('');
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="relative bg-white rounded-3xl w-[90vw] max-w-sm p-6 text-center mt-18">
        <button
          className="absolute left-5 top-5 p-2 rounded-full hover:bg-gray-100 transition"
          onClick={onClose}
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
        <h1 className="text-2xl font-extrabold mb-2">First choice of customers</h1>
        <p className="text-base text-gray-600 mb-6">Log in or Sign up</p>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (mobile.length === 10) {
              alert(`Continue with +91${mobile}`);
              onClose();
            }
          }}
        >
          <div className="flex border border-gray-300 rounded-lg overflow-hidden mb-6 focus-within:ring-2 focus-within:ring-green-600">
            <div className="bg-white text-gray-700 px-4 flex items-center border-r border-gray-300 select-none">
              +91
            </div>
            <input
              type="tel"
              ref={inputRef}
              className="w-full px-4 py-3 focus:outline-none text-lg"
              placeholder="Enter mobile number"
              value={mobile}
              maxLength={10}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                setMobile(val);
              }}
              required
            />
          </div>
          <button
            type="submit"
            disabled={mobile.length !== 10}
            className={`w-full py-3 rounded-lg text-lg font-semibold transition-colors duration-300 ${
              mobile.length === 10 ? 'bg-green-700 text-white hover:bg-green-800' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            Continue
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
      </div>
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
  // Cart state
  const [cart, setCart] = useState([
    {
      id: 1,
      name: 'Gokul Full Cream Milk',
      desc: '500 ml',
      qty: 1,
      price: 37,
      image: '/images/groceries/groceries-4.png',
    },
  ]);
  const [cartOpen, setCartOpen] = useState(false);

  // Auth/Modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Cart calculations
  const deliveryCharge = 25;
  const handlingCharge = 2;
  const smallCartCharge = 20;
  const itemsTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const showSmallCartCharge = itemsTotal < 100;
  const grandTotal = itemsTotal + deliveryCharge + handlingCharge + (showSmallCartCharge ? smallCartCharge : 0);

  // Cart manipulation handlers
  const increaseQty = id => setCart(c => c.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item));
  const decreaseQty = id => setCart(c => c.map(item => item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item));
  const removeItem = id => setCart(c => c.filter(item => item.id !== id));

  // Scroll To Section function
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
      {/* Login modal */}
      <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />

      <header className="fixed w-full top-0 z-50 bg-white shadow-sm">
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            <div className="flex justify-between h-20 items-center">
              {/* Logo and Brand */}
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
              {/* Navigation Links */}
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
              {/* Right controls */}
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
                  onClick={() => setShowLoginModal(true)}
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
                    {cart.length > 0 && (
                      <span className="absolute top-0 right-0 -mt-1 -mr-1 rounded-full bg-green-600 px-1 text-xs text-white font-semibold">
                        {cart.reduce((sum, item) => sum + item.qty, 0)}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <div
            className="fixed top-0 right-0 w-full sm:max-w-md h-full bg-white z-[999] flex flex-col shadow-2xl overflow-y-auto"
          >
            {/* Cart Header */}
            <div className="flex items-center justify-between p-6 pb-3 border-b">
              <div className="text-2xl font-bold">My Cart</div>
              <button
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"
                onClick={() => setCartOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            {/* Delivery Info */}
            <div className="bg-gray-50 px-6 py-5 flex items-center gap-4 rounded-xl mx-4 my-4">
              <div className="bg-white w-12 h-12 flex items-center justify-center rounded-full shadow border">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="#4ade80" strokeWidth="2" />
                  <path d="M12 7v5l3 2" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div className="text-lg font-bold text-black">Delivery in 30 minutes</div>
                <div className="text-gray-700 text-sm">Shipment of {cart.reduce((sum, item) => sum + item.qty, 0)} item{cart.length > 1 ? 's' : ''}</div>
              </div>
            </div>
            {/* Cart Items */}
            <div className="px-4 pb-0">
              {cart.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white py-0 mb-0 rounded-lg shadow border"
                  style={{ minHeight: '56px' }}
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={item.image}
                      width={88}
                      height={48}
                      alt={item.name}
                      className="rounded border"
                    />
                    <div>
                      <div className="font-medium text-[13px] text-gray-800">{item.name}</div>
                      <div className="text-gray-400 text-xs">{item.desc}</div>
                      <div className="font-bold text-green-700 text-xs mt-1">₹{item.price}</div>
                    </div>
                  </div>
                  <div className="flex items-center pr-1">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      disabled={item.qty === 1}
                      className={`bg-green-700 w-6 h-6 flex items-center justify-center text-white rounded-l text-xs ${item.qty === 1 ? "opacity-60 cursor-not-allowed" : "hover:bg-green-800"}`}
                    >
                      <Minus size={13} />
                    </button>
                    <span className="bg-white px-2 py-0 font-bold border-y border-green-700 text-sm leading-none">{item.qty}</span>
                    <button
                      onClick={() => increaseQty(item.id)}
                      className="bg-green-700 w-6 h-6 flex items-center justify-center text-white rounded-r text-xs hover:bg-green-800"
                    >
                      <Plus size={13} />
                    </button>
                    {/* Delete/trash button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                      className="ml-2 p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 transition"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Bill details */}
            <div className="bg-gray-50 rounded-xl mx-4 my-4 px-5 py-4">
              <div className="font-bold text-lg mb-2">Bill details</div>
              <div className="flex justify-between items-center py-1">Items total <span>₹{itemsTotal}</span></div>
              <div className="flex justify-between items-center py-1">
                <span className="flex items-center gap-1">
                  <span role="img" aria-label="delivery">🛵</span>
                  Delivery charge <span className="ml-1 text-xs text-gray-400 cursor-help">i</span>
                </span>
                <span>₹{deliveryCharge}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="flex items-center gap-1">
                  <span role="img" aria-label="handling">⚙️</span>
                  Handling charge <span className="ml-1 text-xs text-gray-400 cursor-help">i</span>
                </span>
                <span>₹{handlingCharge}</span>
              </div>
              {showSmallCartCharge && (
                <div className="flex justify-between items-center py-1">
                  <span className="flex items-center gap-1">
                    <span role="img" aria-label="small cart">🛒</span>
                    Small cart charge <span className="ml-1 text-xs text-gray-400 cursor-help">i</span>
                  </span>
                  <span>₹{smallCartCharge}</span>
                </div>
              )}
              <div className="flex justify-between items-center border-t border-gray-200 mt-2 pt-2 font-bold">
                <span>Grand total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>
            {/* Cancellation Policy */}
            <div className="bg-white rounded-xl mx-4 my-4 px-5 py-3">
              <div className="font-bold mb-1 text-base">Cancellation Policy</div>
              <p className="text-gray-600 text-xs">
                Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a refund will be provided, if applicable.
              </p>
            </div>
            {/* Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 sm:right-auto sm:left-auto sm:bottom-0 w-full sm:max-w-md z-50 bg-green-600 flex items-center justify-between rounded-t-2xl px-6 py-4">
              <div className="font-bold text-white text-lg">
                ₹{grandTotal} <span className="text-xs font-normal">TOTAL</span>
              </div>
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    alert("Please login to proceed!");
                    setShowLoginModal(true);
                  } else {
                    // Proceed to checkout logic here...
                  }
                }}
                className="bg-white text-red-700 font-bold px-8 py-3 rounded-lg text-lg hover:bg-gray-100 transition"
              >
                Login to Proceed&nbsp;
                <svg className="inline-block w-4 h-4 align-middle" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
