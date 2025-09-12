'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown, Clock } from 'lucide-react';
import { apiService } from '../../utils/api';
import { useCart } from '../../context/CartContext';

// ProductCard Component
const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { 
    cart, 
    addToCart, 
    increaseQty, 
    decreaseQty, 
    loading: cartLoading 
  } = useCart();

  // Helper functions to check if item is in cart and get quantity
  const isInCart = (productId) => {
    return cart.some(item => item.product?._id === productId || item._id === productId);
  };

  const getCartItem = (productId) => {
    return cart.find(item => item.product?._id === productId || item._id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = getCartItem(productId);
    return item ? (item.quantity || item.qty || 0) : 0;
  };

  const getCartItemId = (productId) => {
    const item = getCartItem(productId);
    return item?._id || item?.cartItemId;
  };

  const handleAddToCart = async () => {
    // Check if product is out of stock
    if (product.stockQuantity === 0) {
      alert('This product is out of stock and cannot be added to cart.');
      return;
    }
    
    setIsAdding(true);
    try {
      await addToCart(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setTimeout(() => setIsAdding(false), 500);
    }
  };

  const handleIncreaseQuantity = () => {
    const cartItemId = getCartItemId(product._id);
    increaseQty(product._id, cartItemId);
  };

  const handleDecreaseQuantity = () => {
    const cartItemId = getCartItemId(product._id);
    decreaseQty(product._id, cartItemId);
  };

  const isInCartItem = isInCart(product._id);
  const cartQuantity = getItemQuantity(product._id);

  // Calculate discount percentage and final price
  const calculateDiscount = () => {
    const originalPrice = parseFloat(product.price) || 0;
    const discountedPrice = parseFloat(product.discountedPrice) || 0;
    const offerPercentage = parseFloat(product.offerPercentage) || 0;
    
    if (discountedPrice > 0 && discountedPrice < originalPrice) {
      const discountPercent = ((originalPrice - discountedPrice) / originalPrice) * 100;
      return {
        percentage: Math.round(discountPercent),
        finalPrice: discountedPrice,
        hasDiscount: true
      };
    } else if (offerPercentage > 0) {
      const finalPrice = originalPrice - (originalPrice * offerPercentage / 100);
      return {
        percentage: Math.round(offerPercentage),
        finalPrice: Math.round(finalPrice * 100) / 100,
        hasDiscount: true
      };
    }
    
    return {
      percentage: 0,
      finalPrice: originalPrice,
      hasDiscount: false
    };
  };

  const discountInfo = calculateDiscount();

  // Get the best image URL
  const getImageUrl = () => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    if (product.image) {
      return product.image;
    }
    return "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden relative group w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge */}
      {discountInfo.hasDiscount && (
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-md font-medium">
            {discountInfo.percentage}% OFF
          </span>
        </div>
      )}

      {/* Deal Badge */}
      {product.deal && (
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md font-medium">
            {product.deal}
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-48 sm:h-40 xs:h-36 w-full overflow-hidden">
        <Image
          src={getImageUrl()}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          className="object-cover transition-transform duration-200 hover:scale-105"
          onError={(e) => {
            e.target.src = '/images/explore/tomato.png';
          }}
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Delivery Time */}
        <div className="flex items-center text-xs text-gray-600 mb-2">
          <Clock className="w-3 h-3 mr-1" />
          {product.deliveryTime || "8 MINS"}
        </div>

        {/* Product Name */}
        <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Volume with Dropdown */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-gray-800 transition-colors">
            <span>{product.quantity || product.volume || product.unit || "1 unit"}</span>
            <ChevronDown className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" />
          </div>
          {product.options && (
            <span className="text-xs text-gray-500">{product.options}</span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-900">
              ₹{discountInfo.finalPrice}
            </span>
            {discountInfo.hasDiscount && (
              <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
            )}
          </div>
            
          {/* Interactive Add/Quantity Controls */}
          {!isInCartItem ? (
            <button 
              onClick={handleAddToCart}
              disabled={isAdding || cartLoading || product.stockQuantity === 0}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isAdding || cartLoading || product.stockQuantity === 0
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700 hover:scale-105'
              }`}
            >
              {product.stockQuantity === 0 ? 'OUT OF STOCK' : isAdding ? 'ADDING...' : 'ADD'}
            </button>
          ) : (
            <div className="flex items-center space-x-2 bg-green-50 rounded-md px-2 py-1">
              <button 
                onClick={handleDecreaseQuantity}
                disabled={cartLoading}
                className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="text-sm font-medium text-gray-900 min-w-[20px] text-center">
                {cartQuantity}
              </span>
              <button 
                onClick={handleIncreaseQuantity}
                disabled={cartLoading}
                className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Stock Info */}
        <div className="text-xs mt-2">
          {product.stockQuantity === 0 ? (
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
              Out of Stock
            </span>
          ) : product.stockQuantity > 0 && product.stockQuantity < 5 ? (
            <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">
              Only {product.stockQuantity} left
            </span>
          ) : product.stockQuantity >= 5 ? (
            <span className="text-green-600">In Stock</span>
          ) : (
            <span className="text-gray-500">Stock: Available</span>
          )}
        </div>
      </div>
    </div>
  );
};

// SubcategoryItem Component
const SubcategoryItem = ({ subcategory, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Get fallback image based on subcategory name
  const getFallbackImage = (name) => {
    const fallbackImages = {
      'Milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      'Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      // ... other fallback images
    };

    for (const [key, image] of Object.entries(fallbackImages)) {
      if (name.toLowerCase().includes(key.toLowerCase())) {
        return image;
      }
    }
    return 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80';
  };

  return (
    <div
      className={`flex items-center space-x-3 px-4 py-3 cursor-pointer transition-all duration-200 rounded-lg ${
        isActive 
          ? 'bg-green-50 border-l-4 border-green-600 text-green-700 shadow-sm' 
          : 'hover:bg-gray-50 text-gray-700 hover:shadow-sm'
      }`}
      onClick={() => onClick(subcategory._id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subcategory Image */}
      <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
        {subcategory.image?.url && !imageError ? (
          <Image
            src={subcategory.image.url}
            alt={subcategory.name}
            fill
            sizes="40px"
            className="object-cover transition-transform duration-200 hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <Image
            src={getFallbackImage(subcategory.name)}
            alt={subcategory.name}
            fill
            sizes="40px"
            className="object-cover transition-transform duration-200 hover:scale-105"
          />
        )}
        {isActive && (
          <div className="absolute inset-0 bg-opacity-10 rounded-lg border border-green-500"></div>
        )}
      </div>
      
      <span className="text-sm font-medium">{subcategory.name}</span>
      {isActive && (
        <div className="ml-auto">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

// Main ProductsPage Component
const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [currentProducts, setCurrentProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategoryImage, setSelectedCategoryImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 });
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get category from URL parameter and fetch data
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const categoryIdParam = urlParams.get('categoryId');
    const showAllParam = urlParams.get('showAll');
    
    if (categoryParam && categoryIdParam) {
      setSelectedCategory(categoryParam);
      setSelectedCategoryId(categoryIdParam);
      fetchCategoryData(categoryIdParam, showAllParam === 'true');
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCategoryData = async (categoryId, showAll = false) => {
    try {
      setLoading(true);
      setError(null);

      const [categoryResponse, subcategoriesResponse] = await Promise.all([
        apiService.getCategoryById(categoryId),
        apiService.getAllCategories({ parent: categoryId, includeInactive: 'false' })
      ]);

      if (categoryResponse.success) {
        setSelectedCategory(categoryResponse.data.category.name);
        setSelectedCategoryImage(categoryResponse.data.category?.image || null);
      }

      if (subcategoriesResponse.success) {
        const subcats = subcategoriesResponse.data.categories;
        setSubcategories(subcats);
        
        if (showAll) {
          await fetchAllProductsFromCategory(categoryId, subcats);
          setSelectedSubcategory(categoryId);
        } else {
          if (subcats.length > 0) {
            setSelectedSubcategory(subcats[0]._id);
            await fetchProductsForSubcategory(subcats[0]._id);
          } else {
            await fetchProductsForSubcategory(categoryId);
          }
        }
      } else {
        await fetchProductsForSubcategory(categoryId);
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
      setError('Failed to load category data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProductsFromCategory = async (mainCategoryId, subcategories) => {
    try {
      const allCategoryIds = [mainCategoryId, ...subcategories.map(sub => sub._id)];
      const productPromises = allCategoryIds.map(categoryId => 
        apiService.getAllProducts({ category: categoryId, limit: 100, inStock: 'true' })
      );
      
      const responses = await Promise.all(productPromises);
      let allProducts = [];
      
      responses.forEach((response) => {
        if (response.success) {
          const products = response.data?.products || response.data || response.products || [];
          allProducts = [...allProducts, ...products];
        }
      });
      
      setCurrentProducts(allProducts);
    } catch (error) {
      console.error('Error fetching all products from category:', error);
      setError('Failed to fetch all products. Please try again.');
    }
  };

  const fetchProductsForSubcategory = async (subcategoryId) => {
    try {
      const response = await apiService.getAllProducts({ category: subcategoryId, limit: 100, inStock: 'true' });
      if (response.success) {
        const products = response.data.products || response.data || response.products || [];
        setCurrentProducts(products);
      } else {
        setError('Failed to fetch subcategory products. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching subcategory products:', error);
      setError('Failed to fetch subcategory products. Please try again.');
    }
  };

  const handleSubcategoryClick = async (subcategoryId) => {
    setIsLoading(true);
    setSelectedSubcategory(subcategoryId);
    
    try {
      if (subcategoryId === selectedCategoryId) {
        await fetchAllProductsFromCategory(selectedCategoryId, subcategories);
      } else {
        const response = await apiService.getAllProducts({ category: subcategoryId, limit: 100, inStock: 'true' });
        if (response.success) {
          const products = response.data.products || response.data || response.products || [];
          setCurrentProducts(products);
        } else {
          setError('Failed to fetch subcategory products. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error fetching subcategory products:', error);
      setError('Failed to fetch subcategory products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort products
  const filteredAndSortedProducts = React.useMemo(() => {
    let filtered = currentProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered = filtered.filter(product => {
      const price = parseFloat(product.price) || 0;
      return price >= priceRange.min && price <= priceRange.max;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
        case 'price-high':
          return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [currentProducts, searchTerm, sortBy, priceRange]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20">
        <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-48 sm:h-40 xs:h-36"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20">
        <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Buy {selectedCategory}</h1>
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => fetchCategoryData(selectedCategoryId)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20">
      <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Buy {selectedCategory}</h1>
              {selectedSubcategory && selectedSubcategory !== selectedCategoryId ? (
                <p className="text-sm text-gray-600 mt-1">
                  Showing products from: {subcategories.find(sub => sub._id === selectedSubcategory)?.name || 'Selected Category'}
                </p>
              ) : selectedSubcategory === selectedCategoryId && subcategories.length > 0 ? (
                <p className="text-sm text-gray-600 mt-1">
                  Showing all products from {selectedCategory} and its subcategories
                </p>
              ) : null}
            </div>
          </div>
          
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-auto"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => {
                  setPriceRange({ min: 0, max: 200 });
                  setSearchTerm("");
                }}
                className="text-sm text-green-600 hover:text-green-700"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 200 }))}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Results</label>
                <p className="text-sm text-gray-600">
                  {filteredAndSortedProducts.length} products found
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Subcategories */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="font-semibold text-gray-900 mb-4">{selectedCategory} Categories</h2>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {subcategories.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No subcategories available</p>
                ) : (
                  <>
                    {/* Show "All Products" option for main category */}
                    <SubcategoryItem
                      subcategory={{ 
                        _id: selectedCategoryId, 
                        name: `All ${selectedCategory} Products`,
                        image: selectedCategoryImage
                      }}
                      isActive={selectedSubcategory === selectedCategoryId}
                      onClick={handleSubcategoryClick}
                    />
                    {/* Show subcategories */}
                    {subcategories.map((subcategory) => (
                      <SubcategoryItem
                        key={subcategory._id}
                        subcategory={subcategory}
                        isActive={selectedSubcategory === subcategory._id}
                        onClick={handleSubcategoryClick}
                      />
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-600 rounded-full animate-bounce"></div>
                  <div className="w-4 h-4 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-4 h-4 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="text-gray-600 mt-4">Loading products...</p>
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Only one default export
export default ProductsPage;