'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    },
    hover: {
      scale: 1.05,
      transition: { type: 'spring', stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  };

  const buttonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 15 }
    },
    hover: {
      scale: 1.05,
      boxShadow: '0px 5px 15px rgba(22, 163, 74, 0.3)',
      transition: { type: 'spring', stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'about', label: 'How it works' },
    { id: 'about-us', label: 'About us' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <motion.header 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="fixed w-full top-0 z-50 bg-white shadow-sm"
    >
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex justify-between h-20 items-center">
            {/* Logo and Brand */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center space-x-6"
            >
              <div className="flex-shrink-0">
                <motion.img
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                  className="h-16 w-auto"
                  src="/images/farmferry-logo.png"
                  alt="Farm Ferry"
                />
              </div>
            </motion.div>

            {/* Navigation Links */}
            <motion.nav 
              variants={containerVariants}
              className="hidden md:flex items-center space-x-10"
            >
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  variants={itemVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => scrollToSection(item.id)}
                  className="text-gray-800 hover:text-green-600 px-3 py-2 text-base font-semibold transition-colors"
                >
                  {item.label}
                </motion.button>
              ))}
            </motion.nav>

            {/* CTA Button */}
            <motion.div 
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
              className="flex items-center"
            >
              <motion.button 
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
                onClick={redirectToPlayStore}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-md text-base font-semibold flex items-center shadow-sm hover:shadow-md"
              >
                <span>Download the App</span>
                <motion.svg 
                  animate={{
                    x: [0, 5, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut"
                  }}
                  className="ml-2 -mr-1 h-5 w-5" 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </motion.svg>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;