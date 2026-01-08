// app/page.jsx (complete modified category page code)
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronDown, Clock } from 'lucide-react';
import { apiService } from '../../utils/api';
import { useCart } from '../../context/CartContext';

// ProductCard Component
const ProductCard = ({ product }) => {
  const router = useRouter();
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
    let url = "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";

    if (product.images && product.images.length > 0) {
      url = product.images[0].url;
    } else if (product.image) {
      url = product.image;
    }

    // Fix common protocol typo
    if (url && typeof url === 'string' && url.startsWith('hhttps://')) {
      return url.replace('hhttps://', 'https://');
    }
    return url;
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden relative group w-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        if (e.target.closest('button')) return;
        router.push(`/productDetails/${product._id}`);
        console.log('Product ID:', id);
      }}
    >
      {/* Discount Badge */}
      {discountInfo.hasDiscount && (
        <div className="absolute top-1.5 left-1.5 z-10">
          <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-md font-medium">
            {discountInfo.percentage}% OFF
          </span>
        </div>
      )}

      {/* Deal Badge */}
      {product.deal && (
        <div className="absolute top-1.5 right-1.5 z-10">
          <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-md font-medium">
            {product.deal}
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-36 w-full overflow-hidden">
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
      <div className="p-3">
        {/* Product Name */}
        <h3 className="font-medium text-gray-900 text-sm mb-1.5 line-clamp-2">
          {product.name}
        </h3>

        {/* Volume */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs text-gray-600">
            {product.quantity || product.volume || product.unit || "1 unit"}
          </span>
          {product.options && (
            <span className="text-xs text-gray-500">{product.options}</span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-gray-900 text-sm">
              ₹{discountInfo.finalPrice}
            </span>
            {discountInfo.hasDiscount && (
              <span className="text-xs text-gray-500 line-through">₹{product.price}</span>
            )}
          </div>

          {/* Interactive Add/Quantity Controls */}
          {!isInCartItem ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={isAdding || cartLoading || product.stockQuantity === 0}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${isAdding || cartLoading || product.stockQuantity === 0
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-green-600 text-white hover:bg-green-700 hover:scale-105'
                }`}
            >
              {product.stockQuantity === 0 ? 'OUT OF STOCK' : isAdding ? 'ADDING...' : 'ADD'}
            </button>
          ) : (
            <div className="flex items-center space-x-1.5 bg-green-50 rounded-md px-1.5 py-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDecreaseQuantity();
                }}
                disabled={cartLoading}
                className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="text-xs font-medium text-gray-900 min-w-[16px] text-center">
                {cartQuantity}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleIncreaseQuantity();
                }}
                disabled={cartLoading}
                className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Stock Info */}
        <div className="text-xs">
          {product.stockQuantity === 0 ? (
            <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">
              Out of Stock
            </span>
          ) : product.stockQuantity > 0 && product.stockQuantity < 5 ? (
            <span className="bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium">
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
      className={`flex items-center space-x-2.5 px-3 py-2.5 cursor-pointer transition-all duration-200 rounded-md ${isActive
        ? 'bg-green-50 border-l-3 border-green-600 text-green-700 shadow-sm'
        : 'hover:bg-gray-50 text-gray-700 hover:shadow-sm'
        }`}
      onClick={() => onClick(subcategory._id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subcategory Image */}
      <div className="relative w-8 h-8 rounded-md overflow-hidden flex-shrink-0">
        {subcategory.image?.url && !imageError ? (
          <Image
            src={subcategory.image.url.startsWith('hhttps://') ? subcategory.image.url.replace('hhttps://', 'https://') : subcategory.image.url}
            alt={subcategory.name}
            fill
            sizes="32px"
            className="object-cover transition-transform duration-200 hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <Image
            src={getFallbackImage(subcategory.name)}
            alt={subcategory.name}
            fill
            sizes="32px"
            className="object-cover transition-transform duration-200 hover:scale-105"
          />
        )}
        {isActive && (
          <div className="absolute inset-0 bg-opacity-10 rounded-md border border-green-500"></div>
        )}
      </div>

      <span className="text-sm font-medium">{subcategory.name}</span>
      {isActive && (
        <div className="ml-auto">
          <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>
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
        let subs = [];
        if (subcategoriesResponse.data?.categories) {
          subs = subcategoriesResponse.data.categories;
        } else if (subcategoriesResponse.data?.items) {
          subs = subcategoriesResponse.data.items;
        } else if (Array.isArray(subcategoriesResponse.data)) {
          subs = subcategoriesResponse.data;
        }

        // Client-side filter to ensure we ONLY get subcategories of this parent
        // This is necessary because the API might return all categories ignoring the parent param
        const filteredSubs = subs.filter(sub => sub.parent === categoryId || sub.parentId === categoryId);

        setSubcategories(filteredSubs);

        if (showAll) {
          await fetchAllProductsFromCategory(categoryId, filteredSubs);
          setSelectedSubcategory(categoryId);
        } else {
          if (filteredSubs.length > 0) {
            setSelectedSubcategory(filteredSubs[0]._id);
            await fetchProductsForSubcategory(filteredSubs[0]._id);
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
          .then(response => ({ response, categoryId })) // Pass categoryId along
      );

      const results = await Promise.all(productPromises);
      let allProducts = [];

      results.forEach(({ response, categoryId }) => {
        if (response.success) {
          const products = response.data?.products || response.data?.items || response.data || response.products || [];
          // Client-side filter: Only keep products that actually belong to this category (or its subcategories)
          // This fixes the issue where the API returns ALL products regardless of the filter
          const filteredHelper = products.filter(p => {
            const pCatId = p.categoryId || p.category?.id || p.category?._id;
            return pCatId === categoryId;
          });
          allProducts = [...allProducts, ...filteredHelper];
        }
      });

      // Dedup products by _id to prevent duplicate keys
      const uniqueProducts = Array.from(new Map(allProducts.map(item => [item._id, item])).values());
      setCurrentProducts(uniqueProducts);
    } catch (error) {
      console.error('Error fetching all products from category:', error);
      setError('Failed to fetch all products. Please try again.');
    }
  };

  const fetchProductsForSubcategory = async (subcategoryId) => {
    try {
      const response = await apiService.getAllProducts({ category: subcategoryId, limit: 100, inStock: 'true' });
      if (response.success) {
        const products = response.data.products || response.data?.items || response.data || response.products || [];
        // Client-side filter
        const filteredProducts = products.filter(p => {
          const pCatId = p.categoryId || p.category?.id || p.category?._id;
          return pCatId === subcategoryId;
        });
        setCurrentProducts(filteredProducts);
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
          const products = response.data.products || response.data?.items || response.data || response.products || [];
          // Client-side filter
          const filteredProducts = products.filter(p => {
            const pCatId = p.categoryId || p.category?.id || p.category?._id;
            return pCatId === subcategoryId;
          });
          setCurrentProducts(filteredProducts);
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-60 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-3">
                <div className="h-5 w-28 bg-gray-200 rounded mb-3 animate-pulse"></div>
                <div className="space-y-2">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-36 bg-gray-200"></div>
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Buy {selectedCategory}</h1>
            </div>
          </div>
          <div className="text-center py-8">
            <div className="bg-white rounded-lg shadow-sm border border-red-100 p-4 max-w-sm mx-auto">
              <p className="text-red-600 mb-3 text-sm">{error}</p>
              <button
                onClick={() => fetchCategoryData(selectedCategoryId)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        {/* Header */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Buy {selectedCategory}</h1>
              {selectedSubcategory && selectedSubcategory !== selectedCategoryId ? (
                <p className="text-xs text-gray-600 mt-0.5">
                  Showing products from: {subcategories.find(sub => sub._id === selectedSubcategory)?.name || 'Selected Category'}
                </p>
              ) : selectedSubcategory === selectedCategoryId && subcategories.length > 0 ? (
                <p className="text-xs text-gray-600 mt-0.5">
                  Showing all products from {selectedCategory} and its subcategories
                </p>
              ) : null}
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            {/* Search Bar */}
            <div className="relative w-full sm:w-56">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent w-full text-sm"
              />
              <svg className="absolute left-2.5 top-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-auto text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors w-full sm:w-auto text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mb-4 p-3 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Filters</h3>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price Range</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                  <span className="text-gray-500 text-sm">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 200 }))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Results</label>
                <p className="text-sm text-gray-600">
                  {filteredAndSortedProducts.length} products found
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Sidebar - Subcategories */}
          <div className="w-full lg:w-60 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-3">
              <h2 className="font-medium text-gray-900 mb-3 text-sm">{selectedCategory} Categories</h2>
              <div className="space-y-1 max-h-80 overflow-y-auto">
                {subcategories.length === 0 ? (
                  <p className="text-gray-500 text-xs text-center py-3">No subcategories available</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-36 bg-gray-200"></div>
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-base font-medium text-gray-900 mb-1">No products found</h3>
                <p className="text-gray-600 text-sm">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
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

export default ProductsPage;