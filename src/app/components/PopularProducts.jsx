'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { apiService } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function PopularProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState(new Set());
  const router = useRouter();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (isAuthenticated && user?._id) {
        try {
          const response = await apiService.getWishlist(user._id);
          if (response.success && response.data?.items) {
            const ids = new Set(response.data.items.map(item =>
              typeof item.product === 'object' ? item.product._id : item.product
            ));
            setWishlist(ids);
          }
        } catch (error) {
          console.error("Failed to fetch wishlist", error);
        }
      } else {
        setWishlist(new Set());
      }
    };

    fetchWishlist();

    const handleWishlistUpdate = () => fetchWishlist();
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [isAuthenticated, user]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products
        const response = await apiService.getAllProducts({ limit: 8 });
        if (response.success && response.data?.products) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleToggleWishlist = async (e, product) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      // Trigger login modal
      window.dispatchEvent(new Event('openAuthModal'));
      return;
    }

    if (!user || !user._id) {
      console.error("User object missing ID:", user);
      alert("User session invalid. Please relogin.");
      return;
    }

    const productId = product._id;
    const isInWishlist = wishlist.has(productId);

    try {
      let response;
      if (isInWishlist) {
        response = await apiService.removeFromWishlist(user._id, productId);
      } else {
        response = await apiService.addToWishlist(user._id, productId);
      }

      console.log("Wishlist toggle response:", response);

      if (response && response.success) {
        setWishlist(prev => {
          const newSet = new Set(prev);
          if (isInWishlist) newSet.delete(productId);
          else newSet.add(productId);
          return newSet;
        });
        window.dispatchEvent(new Event('wishlistUpdated'));
        // alert(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
      } else {
        alert(`Failed to update wishlist: ${response?.message || response?.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      alert(`Error updating wishlist: ${error.message}`);
    }
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };

  if (loading) return (
    <div className="py-12 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse"></div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Super Flash Sale</h2>
          <p className="text-gray-500 mt-1">Get the best deals on our premium products</p>
        </div>
        <button
          onClick={() => router.push('/products')}
          className="text-sm font-semibold text-white bg-green-700 hover:bg-green-800 px-6 py-2 rounded-full transition-colors shadow-lg shadow-green-200"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-3xl border border-gray-100 hover:border-gray-300 hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
            {/* Wishlist/QuickView Buttons overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <button
                onClick={(e) => handleToggleWishlist(e, product)}
                className={`p-2 bg-white rounded-full shadow-md transition-colors ${wishlist.has(product._id) ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'}`}
              >
                <Heart size={18} fill={wishlist.has(product._id) ? "currentColor" : "none"} />
              </button>

            </div>

            {/* Product Image */}
            <div className="relative h-60 w-full bg-[#FAFAFA] cursor-pointer flex items-center justify-center" onClick={() => router.push(`/product/${product._id}`)}>
              <Image
                src={product.images?.[0]?.url || '/images/explore/tomato.png'}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {product.discountedPrice < product.price && (
                <span className="absolute top-4 left-4 bg-[#FF7E00] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Sale!
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="text-[11px] text-gray-400 mb-1 uppercase tracking-wide">{product.categoryId?.name || 'Organic'}</div>
              <h3 className="font-bold text-gray-800 text-base mb-2 truncate cursor-pointer hover:text-green-600 transition-colors" onClick={() => router.push(`/product/${product._id}`)}>
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                <div className="flex bg-green-600 text-white px-2 py-0.5 rounded text-xs font-bold items-center gap-1">
                  <span>{product.averageRating?.toFixed(1) || '0.0'}</span>
                  <Star size={10} fill="currentColor" />
                </div>
                <span className="text-xs text-gray-500">({product.totalReviews || 0} reviews)</span>
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                <div>
                  <span className="text-green-600 font-bold text-lg">
                    ₹{product.discountedPrice || product.price}
                    {product.unit && <span className="text-sm font-normal text-gray-500 ml-1">/ {product.unit}</span>}
                  </span>
                  {product.discountedPrice < product.price && (
                    <span className="text-gray-400 text-xs line-through ml-2">₹{product.price}</span>
                  )}
                </div>
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all shadow-sm"
                >
                  <ShoppingCart size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}