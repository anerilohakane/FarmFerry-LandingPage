'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const categoryImages = {
  "Coconut": "/images/explore/coconut.png",
  "Fresh Vegetables": "/images/explore/fresh-vegetables.png",
  "Fresh Fruits": "/images/explore/fresh-fruits.png",
  "Milk Products": "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
  "Ghee & Oils": "/images/explore/oil.png",
  "Country Specials": "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
  "Eggs": "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
  "Pulses": "/images/explore/pulses.png",
  "Dry Fruits": "/images/explore/dry-fruits.png",
  "Breads": "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
  "Cereals": "/images/explore/cereals.png",
  "Salt & Sugar": "/images/explore/suger.png",
  "Spices": "/images/explore/spices.png",
  "Atta & Rice": "/images/explore/rice.png"
};

const CategoryItem = ({ name, imageUrl }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [popupPosition, setPopupPosition] = useState('bottom');
  const [hasError, setHasError] = useState(false);
  const itemRef = useRef(null);

  useEffect(() => {
    const checkPosition = () => {
      if (itemRef.current) {
        const rect = itemRef.current.getBoundingClientRect();
        setPopupPosition(rect.top < 150 ? 'bottom' : 'top');
      }
    };

    // Delay the check slightly to ensure proper rendering
    const timer = setTimeout(checkPosition, 50);
    window.addEventListener('scroll', checkPosition);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', checkPosition);
    };
  }, []);

  return (
    <div className="relative" ref={itemRef}>
      <div
        className="flex flex-col items-center justify-start space-y-2 cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={name}
      >
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center
                       group-hover:bg-gray-200 transition-all duration-200 border border-gray-200
                       overflow-hidden transform group-hover:scale-105">
          {!hasError ? (
            <Image
              src={imageUrl}
              alt={name}
              width={96}
              height={96}
              className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-110"
              loading="eager"
              onError={() => setHasError(true)}
              priority={name === "Fresh Vegetables" || name === "Fresh Fruits"}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-xs text-center text-black">{name}</span>
            </div>
          )}
        </div>
        <span className="text-xs font-medium text-black text-center max-w-[80px]">
          {name.split(' ').map((word, i) => (
            <span key={`${name}-${word}-${i}`} className="block">{word}</span>
          ))}
        </span>
      </div>

      <div className={`absolute z-10 ${popupPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} 
                      left-1/2 transform -translate-x-1/2 w-40 transition-opacity duration-150 
                      ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-white p-3 rounded-lg shadow-xl border border-gray-200">
          <p className="text-sm font-medium text-center text-black">{name}</p>
          <div className={`absolute w-3 h-3 bg-white ${popupPosition === 'top' ? '-bottom-1' : '-top-1'} 
                          left-1/2 transform -translate-x-1/2 rotate-45 border-r border-b border-gray-200`}></div>
        </div>
      </div>
    </div>
  );
};

const CategorySection = () => {
  const [isMounted, setIsMounted] = useState(false);
  const categories = Object.keys(categoryImages);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent server-side rendering of the interactive parts
  if (!isMounted) {
    return (
      <div id='products' className="container mx-auto px-4 py-6 md:px-20">
        <h1 className="text-xl font-bold mb-6 text-center text-black">Explore Categories</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
          {categories.map((category) => (
            <div key={category} className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-100"></div>
              <span className="text-xs text-center mt-2 text-black">{category}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div id='products' className="container mx-auto px-4 py-6 md:px-20">
      <h1 className="text-xl font-bold mb-6 text-center text-black">Explore Categories</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {categories.map((category) => (
          <CategoryItem
            key={category}
            name={category}
            imageUrl={categoryImages[category]}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;