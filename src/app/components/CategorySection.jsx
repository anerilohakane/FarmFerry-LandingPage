'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { apiService } from '../../utils/api';

// Fallback images for categories that don't have images
const fallbackImages = {
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

const CategoryItem = ({ category }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [popupPosition, setPopupPosition] = useState('bottom');
  const [hasError, setHasError] = useState(false);
  const itemRef = useRef(null);

  useEffect(() => {
    const checkPosition = () => {
      if (itemRef.current) {
        const rect = itemRef.current.getBoundingClientRect();
        setPopupPosition(rect.top < window.innerHeight / 2 ? 'bottom' : 'top');
      }
    };

    // Delay the check slightly to ensure proper rendering
    const timer = setTimeout(checkPosition, 50);
    window.addEventListener('scroll', checkPosition);
    window.addEventListener('resize', checkPosition);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', checkPosition);
      window.removeEventListener('resize', checkPosition);
    };
  }, []);

  const handleCategoryClick = () => {
    // Navigate to products page with category parameter
    window.location.href = `/products?category=${encodeURIComponent(category.name)}&categoryId=${category._id}&showAll=true`;
  };

  // Get image URL from category or fallback
  const getImageUrl = () => {
    if (category.image?.url) {
      return category.image.url;
    }
    return fallbackImages[category.name] || "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
  };

  return (
    <div className="relative flex-shrink-0" ref={itemRef}>
      <div
        className="flex flex-col items-center justify-start space-y-2 cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCategoryClick}
        aria-label={category.name}
      >
        <div className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full bg-gray-100 flex items-center justify-center
                       group-hover:bg-gray-200 transition-all duration-200 border border-gray-200
                       overflow-hidden transform group-hover:scale-105">
          {!hasError ? (
            <Image
              src={getImageUrl()}
              alt={category.name}
              width={96}
              height={96}
              className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-110"
              loading="eager"
              onError={() => setHasError(true)}
              priority={category.name === "Fresh Vegetables" || category.name === "Fresh Fruits"}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-xs text-center text-black line-clamp-2">{category.name}</span>
            </div>
          )}
        </div>
        <span className="text-xs sm:text-sm font-medium text-black text-center max-w-[80px] sm:max-w-[100px] md:max-w-[120px] line-clamp-2">
          {category.name.split(' ').map((word, i) => (
            <span key={`${category.name}-${word}-${i}`} className="block">{word}</span>
          ))}
        </span>
      </div>

      <div className={`absolute z-10 ${popupPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} 
                      left-1/2 transform -translate-x-1/2 w-32 sm:w-36 md:w-40 transition-opacity duration-150 
                      ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-white p-2 sm:p-3 rounded-lg shadow-xl border border-gray-200">
          <p className="text-xs sm:text-sm font-medium text-center text-black line-clamp-1">{category.name}</p>
          {category.description && (
            <p className="text-xs text-gray-600 text-center mt-1 line-clamp-2">{category.description}</p>
          )}
          <div className={`absolute w-3 h-3 bg-white ${popupPosition === 'top' ? '-bottom-1' : '-top-1'} 
                          left-1/2 transform -translate-x-1/2 rotate-45 border-r border-b border-gray-200`}></div>
        </div>
      </div>
    </div>
  );
};

const CategorySection = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch root categories (parent = null)
      const response = await apiService.getAllCategories({
        parent: 'null',
        includeInactive: 'false'
      });
      
      if (response.success) {
        setCategories(response.data.categories);
      } else {
        setError('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (!isMounted || loading) {
    return (
      <div id='products' className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-6 text-center text-black">Explore Categories</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6 md:gap-8">
          {[...Array(14)].map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="w-16 sm:w-20 h-3 bg-gray-200 rounded mt-2 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div id='products' className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-6 text-center text-black">Explore Categories</h1>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
          <button 
            onClick={fetchCategories}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id='products' className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-6 text-center text-black">Explore Categories</h1>
      {categories.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-sm sm:text-base">No categories available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6 md:gap-8">
          {categories.map((category) => (
            <CategoryItem
              key={category._id}
              category={category}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySection;