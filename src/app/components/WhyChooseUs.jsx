// WhyChooseUs.jsx (complete modified code)
'use client';

import { ShoppingCartIcon, ArrowRight, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { apiService } from '../../utils/api';
import { useCart } from '../../context/CartContext';

export default function NewLaunches() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const { cart, addToCart: contextAddToCart, loading: cartLoading } = useCart();
  const timeoutRef = useRef({});
  const scrollerRef = useRef(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutRef.current).forEach(clearTimeout);
    };
  }, []);

  // Helper functions to check if item is in cart and get quantity
  const isInCart = (productId) => {
    return cart.some(item => item._id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = cart.find(item => item._id === productId);
    return item ? (item.qty || item.quantity || 0) : 0;
  };

  // Handle add to cart with visual feedback
  const handleAddToCart = async (product) => {
    try {
      if (addedToCart[product._id] || cartLoading) return;
      setAddedToCart(prev => ({ ...prev, [product._id]: true }));
      await contextAddToCart(product);
      timeoutRef.current[product._id] = setTimeout(() => {
        setAddedToCart(prev => ({ ...prev, [product._id]: false }));
      }, 2000);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setAddedToCart(prev => ({ ...prev, [product._id]: false }));
      alert('Failed to add item to cart. Please try again.');
    }
  };

  // Fetch products with offers
  useEffect(() => {
    const fetchProductsWithOffers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getProductsWithOffers({
          limit: 20
        });

        if (response?.data?.products) {
          const productsWithOffers = response.data.products.filter(product => {
            const hasValidOffer = product.hasActiveOffer &&
                                 (product.offerPercentage > 0 ||
                                  (product.discountedPrice && product.discountedPrice < product.price));
            return hasValidOffer;
          });
          console.log(`Filtered ${productsWithOffers.length} products with offers`);
          setProducts(productsWithOffers);
        } else {
          console.log('No products in response:', response);
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products with offers:', err);
        setError('Failed to load products. Please try again later.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsWithOffers();
  }, []);

  // Calculate discounted price and format currency
  const formatPrice = (product) => {
    const originalPrice = product.price || 0;
    const discountedPrice = product.discountedPrice || originalPrice;
    const offerPercentage = product.offerPercentage || 0;

    const finalPrice = discountedPrice < originalPrice ? discountedPrice :
                      (originalPrice - (originalPrice * offerPercentage / 100));

    return {
      original: `₹${originalPrice}`,
      discounted: `₹${Math.round(finalPrice)}`,
      hasDiscount: finalPrice < originalPrice,
      savings: Math.round(originalPrice - finalPrice)
    };
  };

  // Check scroll position and update button states
  const checkScrollButtons = () => {
    const scroller = scrollerRef.current;
    if (scroller) {
      setCanScrollLeft(scroller.scrollLeft > 0);
      setCanScrollRight(
        scroller.scrollLeft < scroller.scrollWidth - scroller.clientWidth
      );
    }
  };

  // Manual scroll functions
  const scrollLeft = () => {
    const scroller = scrollerRef.current;
    if (scroller) {
      scroller.scrollBy({
        left: -320,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    const scroller = scrollerRef.current;
    if (scroller) {
      scroller.scrollBy({
        left: 320,
        behavior: 'smooth'
      });
    }
  };

  // Update scroll button states
  useEffect(() => {
    const timer = setTimeout(() => {
      checkScrollButtons();
    }, 100);
    return () => clearTimeout(timer);
  }, [products]);

  const redirectToPlayStore = () => {
    window.open('https://play.google.com/store', '_blank');
  };

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="relative">
          {products.length > 0 && !loading && (
            <>
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-200 ${
                  canScrollLeft
                    ? 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:shadow-xl'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                }`}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-200 ${
                  canScrollRight
                    ? 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:shadow-xl'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                }`}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">New Launches</h2>
            <p className="text-gray-600 mt-1">Discover our latest products with exclusive offers</p>
          </div>

          <div
            ref={scrollerRef}
            className="flex overflow-x-auto py-4 gap-4 sm:gap-6 scrollbar-hide"
            onScroll={checkScrollButtons}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`loading-${index}`}
                  className="flex-shrink-0 w-48 sm:w-56 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 animate-pulse"
                >
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="w-full text-center py-12">
                <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 max-w-md mx-auto">
                  <p className="text-red-600 mb-4 text-base font-medium">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="w-full text-center py-12">
                <div className="bg-white rounded-xl shadow-sm border border-yellow-200 p-8 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Special Offers Available</h3>
                  <p className="text-gray-600 mb-6 text-sm">
                    We don't have any products with active offers at the moment.
                    Check back soon for exciting deals!
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Refresh Offers
                  </button>
                </div>
              </div>
            ) : (
              products.map((product) => {
                if (!product || !product._id || !product.name || !product.price) {
                  console.warn(`Invalid product data:`, product);
                  return null;
                }

                const pricing = formatPrice(product);
                const isAdded = addedToCart[product._id];
                const itemInCart = isInCart(product._id);
                const itemQuantity = getItemQuantity(product._id);

                return (
                  <div
                    key={product._id}
                    className="flex-shrink-0 w-48 sm:w-56 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative group cursor-pointer"
                    onClick={(e) => {
                      if (e.target.closest('button')) return;
                      router.push(`/products/${product._id}`);
                    }}
                  >
                    {(product.offerPercentage > 0 || (product.discountedPrice && product.discountedPrice < (product.price || 0))) && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-lg z-10">
                        {product.offerPercentage > 0
                          ? `${Math.round(product.offerPercentage)}% OFF`
                          : `₹${Math.round((product.price || 0) - (product.discountedPrice || 0))} OFF`}
                      </div>
                    )}

                    <div className="h-48 relative overflow-hidden">
                      <Image
                        src={product.images?.[0]?.url || '/images/explore/tomato.png'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={(e) => {
                          e.target.src = '/images/explore/tomato.png';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 mb-1">{product.name}</h3>
                      <p className="text-xs text-gray-500">{product.unit}</p>

                      <div className="mt-3 flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-green-600">{pricing.discounted}</span>
                          {pricing.hasDiscount && (
                            <span className="text-xs text-gray-400 line-through">{pricing.original}</span>
                          )}
                        </div>
                        {pricing.savings > 0 && (
                          <span className="text-xs text-green-600 font-medium mt-1">
                            Save ₹{pricing.savings}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          Stock: {product.stockQuantity || 0}
                        </span>
                        <div className="flex items-center gap-2">
                          {itemInCart && (
                            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                              {itemQuantity} in cart
                            </span>
                          )}
                          <button
                            className={`p-2 rounded-full transition-all duration-300 ${
                              isAdded
                                ? 'bg-green-500 text-white scale-110'
                                : itemInCart
                                ? 'bg-green-700 text-white hover:bg-green-800'
                                : 'bg-green-600 text-white hover:bg-green-700 hover:scale-105'
                            } ${cartLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            disabled={isAdded || cartLoading}
                          >
                            {isAdded ? (
                              <Check size={16} />
                            ) : (
                              <ShoppingCartIcon size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={redirectToPlayStore}
              className="inline-flex items-center justify-center bg-green-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Available on App
              <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        </div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </section>
  );
}