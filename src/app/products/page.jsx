'use client';
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronDown, ChevronRight, ChevronUp, Star, Heart,
  ShoppingCart, RefreshCw, LayoutGrid, List, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

// --- Components ---

const ProductCard = ({ product, isWishlisted = false }) => {
  const router = useRouter();
  const { addToCart, loading: cartLoading } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [adding, setAdding] = useState(false);
  const [inWishlist, setInWishlist] = useState(isWishlisted);

  useEffect(() => {
    setInWishlist(isWishlisted);
  }, [isWishlisted]);

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      // Trigger login modal instead of alert
      window.dispatchEvent(new Event('openAuthModal'));
      return;
    }
    try {
      if (inWishlist) {
        await apiService.removeFromWishlist(user._id, product._id);
        setInWishlist(false);
      } else {
        const response = await apiService.addToWishlist(user._id, product._id);
        if (response.success) {
          setInWishlist(true);
        }
      }
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (product.stockQuantity <= 0) return;
    setAdding(true);
    await addToCart(product);
    setTimeout(() => setAdding(false), 500);
  };

  const price = product.discountedPrice || product.price;
  const originalPrice = product.discountedPrice ? product.price : null;
  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
      onClick={() => router.push(`/product/${product._id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        <Image
          src={product.images?.[0]?.url || product.image || '/images/explore/tomato.png'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isOutOfStock ? (
            <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
              Out of Stock
            </span>
          ) : (
            <>

              {/* Simulated "New" badge if created recently - optional logic */}
              {/* <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded">New</span> */}
            </>
          )}
        </div>

        {/* Action Overlay */}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            onClick={handleWishlist}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-colors ${inWishlist ? 'bg-red-50 text-red-500' : 'bg-white text-gray-400 hover:text-red-500'}`}
          >
            <Heart size={16} fill={inWishlist ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1 group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>
          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded items-center gap-0.5">
              <span>{product.averageRating?.toFixed(1) || '0.0'}</span>
              <Star size={8} fill="currentColor" />
            </div>
            <span className="text-xs text-gray-400">({product.totalReviews || 0} reviews)</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-lg font-bold text-gray-900">₹{price}</span>
            {product.unit && <span className="text-xs text-gray-500 ml-1">/ {product.unit}</span>}
            {originalPrice && (
              <div className="text-xs text-gray-400 line-through">₹{originalPrice}</div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            className={`px-4 py-1.5 rounded border transition-all text-sm font-bold uppercase tracking-wide ${isOutOfStock
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-white border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
              }`}
          >
            {isOutOfStock ? 'No Stock' : adding ? '...' : 'Add +'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Page ---

const FilterCheckbox = ({ label, count, checked, onChange }) => (
  <label className="flex items-center justify-between cursor-pointer group py-1">
    <div className="flex items-center gap-3">
      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-green-600 border-green-600' : 'border-gray-300 group-hover:border-green-500'}`}>
        {checked && <div className="w-2 h-2 bg-white rounded-full" />}
      </div>
      <span className={`text-sm ${checked ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
        {label}
      </span>
    </div>
    {count !== undefined && <span className="text-xs text-gray-400">({count})</span>}
  </label>
);

const PriceRadio = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer group py-1">
    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${checked ? 'border-green-600' : 'border-gray-300 group-hover:border-green-400'}`}>
      {checked && <div className="w-2.5 h-2.5 bg-green-600 rounded-full" />}
    </div>
    <span className={`text-sm ${checked ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
      {label}
    </span>
  </label>
);



function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  // State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [wishlistIds, setWishlistIds] = useState(new Set());

  // Fetch Wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      if (isAuthenticated && user?._id) {
        try {
          const res = await apiService.getWishlist(user._id);
          if (res.success && res.data?.items) {
            // Extract product IDs from wishlist items
            const ids = new Set(res.data.items.map(item => {
              return item.product?._id || item.product || item._id;
            }));
            setWishlistIds(ids);
          }
        } catch (err) {
          console.error("Failed to fetch wishlist", err);
        }
      } else {
        setWishlistIds(new Set());
      }
    };

    fetchWishlist();

    const handleUpdate = () => fetchWishlist();
    window.addEventListener('wishlistUpdated', handleUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleUpdate);
  }, [isAuthenticated, user]);

  // Initial Fetch
  // Initial Fetch - Handles Search or Default Load
  useEffect(() => {
    const fetchShopData = async () => {
      setLoading(true);
      const searchQuery = searchParams.get('search');

      try {
        // 1. Always fetch categories (for sidebar)
        const catsRes = await apiService.getAllCategories({});
        if (catsRes.success) {
          const cats = catsRes.data?.categories || catsRes.data?.items || catsRes.data || [];
          setCategories(cats);
        }

        // 2. Fetch Products (Search or Default)
        let prodsRes;
        if (searchQuery) {
          console.log("Searching for:", searchQuery);
          prodsRes = await apiService.searchProducts(searchQuery);

          // Reset category selection if not specified (so search applies to all)
          if (!searchParams.get('categoryId')) {
            setSelectedCategory('All');
          }
        } else {
          // Default load (Fetch all products)
          prodsRes = await apiService.getAllProducts({ limit: 100 });
        }

        if (prodsRes.success) {
          const items = prodsRes.data?.products || prodsRes.data?.items || [];
          setProducts(items);
        }
      } catch (err) {
        console.error("Shop Load Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [searchParams]);

  // Update selected category from URL
  useEffect(() => {
    const catId = searchParams.get('categoryId');
    const catName = searchParams.get('category');
    if (catId) setSelectedCategory(catId);
    else if (catName) {
      // Find ID by name? or just use "All"
      // keeping simple for now
    }
  }, [searchParams]);

  // Derived State: Filtered Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (selectedCategory !== 'All') {
      // Find all subcategories (children) of the selected category
      const relevantCategoryIds = new Set([selectedCategory]);

      // Find immediate children
      const children = categories.filter(c => {
        const pId = c.parent?._id || c.parent;
        return pId === selectedCategory;
      });

      children.forEach(c => relevantCategoryIds.add(c._id));

      // Also check if any found children have children (Grandchildren) - basic 2-level support
      // For deeper recursion, a helper function would be better, but this covers 99% of cases here
      children.forEach(child => {
        const grandChildren = categories.filter(gc => {
          const gcpId = gc.parent?._id || gc.parent;
          return gcpId === child._id;
        });
        grandChildren.forEach(gc => relevantCategoryIds.add(gc._id));
      });

      result = result.filter(p => {
        const pCat = p.categoryId?._id || p.categoryId || p.category;
        return relevantCategoryIds.has(pCat);
      });
    }

    // Price Filter
    if (priceFilter === 'under-100') result = result.filter(p => (p.discountedPrice || p.price) < 100);
    else if (priceFilter === '100-500') result = result.filter(p => {
      const price = p.discountedPrice || p.price;
      return price >= 100 && price <= 500;
    });
    else if (priceFilter === 'above-500') result = result.filter(p => (p.discountedPrice || p.price) > 500);

    // Sort
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';

    if (sortBy === 'popularity') {
      // Search relevance sorting
      if (searchQuery) {
        result.sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();

          // 1. Exact Name match takes highest priority
          if (nameA === searchQuery && nameB !== searchQuery) return -1;
          if (nameA !== searchQuery && nameB === searchQuery) return 1;

          // 2. Starts with Query priority
          const aStarts = nameA.startsWith(searchQuery);
          const bStarts = nameB.startsWith(searchQuery);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;

          // 3. Length priority (Shorter names are usually more relevant/exact)
          // e.g. "Cabbage" (7) vs "Green Cabbage" (13) -> Cabbage wins
          return nameA.length - nameB.length;
        });
      }
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [products, selectedCategory, priceFilter, sortBy, searchParams]);

  // Handlers
  const toggleCategoryExpand = (id, e) => {
    e.stopPropagation();
    const newSet = new Set(expandedCategories);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedCategories(newSet);
  };

  const handleCategorySelect = (id) => {
    setSelectedCategory(id);
    router.push(`/products?categoryId=${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-36 pb-12">
        <div className="max-w-7xl mx-auto px-4 flex gap-8">
          <div className="w-64 hidden lg:block space-y-4">
            <div className="h-8 bg-gray-100 rounded w-1/2 animate-pulse" />
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-6 bg-gray-100 rounded w-full animate-pulse" />)}
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const selectedCategoryName = categories.find(c => c._id === selectedCategory)?.name || 'All Products';

  return (
    <div className="min-h-screen bg-white pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              {selectedCategoryName}
              <span className="text-lg font-normal text-gray-500">({filteredProducts.length} items)</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-sm">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border-0 font-bold text-gray-900 pr-8 focus:ring-0 cursor-pointer text-sm"
              >
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
              <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-900" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">

            {/* Categories */}
            <div>
              <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm mb-4">Category</h3>
              <div className="bg-green-50/50 rounded-lg p-2">
                <div
                  onClick={() => handleCategorySelect('All')}
                  className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors ${selectedCategory === 'All' ? 'bg-green-100 text-green-600 font-bold' : 'text-gray-600 hover:bg-green-50'}`}
                >
                  <span>All Categories</span>
                  {selectedCategory === 'All' && <CheckIcon />}
                </div>

                {categories.filter(c => !c.parent || !c.parent._id).map(cat => {
                  const subCategories = categories.filter(c => c.parent && (c.parent._id === cat._id || c.parent === cat._id));
                  const isExpanded = selectedCategory === cat._id || subCategories.some(sub => sub._id === selectedCategory) || expandedCategories.has(cat._id);
                  const isSelected = selectedCategory === cat._id;

                  return (
                    <div key={cat._id} className="mt-1">
                      <div
                        onClick={(e) => {
                          handleCategorySelect(cat._id);
                          toggleCategoryExpand(cat._id, e);
                        }}
                        className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors ${isSelected ? 'text-green-600 font-bold bg-green-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                      >
                        <span className="flex-1">{cat.name}</span>
                        {subCategories.length > 0 && (
                          <button
                            onClick={(e) => toggleCategoryExpand(cat._id, e)}
                            className={`p-1 rounded-full hover:bg-green-100 transition-colors ${isExpanded ? 'rotate-180' : ''}`}
                          >
                            <ChevronDown size={14} className={isSelected ? 'text-green-600' : 'text-gray-400'} />
                          </button>
                        )}
                      </div>

                      {/* Subcategories */}
                      <AnimatePresence>
                        {isExpanded && subCategories.length > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden ml-4 pl-2 border-l border-gray-200"
                          >
                            {subCategories.map(sub => (
                              <div
                                key={sub._id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCategorySelect(sub._id);
                                }}
                                className={`py-2 px-2 text-sm cursor-pointer transition-colors rounded ${selectedCategory === sub._id ? 'text-green-600 font-bold bg-green-50' : 'text-gray-500 hover:text-green-600'}`}
                              >
                                {sub.name}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm mb-4">Price</h3>
              <div className="space-y-1">
                <div onClick={() => setPriceFilter('all')}>
                  <PriceRadio label="All Prices" checked={priceFilter === 'all'} />
                </div>
                <div onClick={() => setPriceFilter('under-100')}>
                  <PriceRadio label="Under ₹100" checked={priceFilter === 'under-100'} />
                </div>
                <div onClick={() => setPriceFilter('100-500')}>
                  <PriceRadio label="₹100 - ₹500" checked={priceFilter === '100-500'} />
                </div>
                <div onClick={() => setPriceFilter('above-500')}>
                  <PriceRadio label="Above ₹500" checked={priceFilter === 'above-500'} />
                </div>
              </div>
            </div>

          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} isWishlisted={wishlistIds.has(product._id)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-xl">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <button
                  onClick={() => { setSelectedCategory('All'); setPriceFilter('all'); }}
                  className="mt-4 text-green-600 font-bold hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white pt-36 pb-12 flex justify-center">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}