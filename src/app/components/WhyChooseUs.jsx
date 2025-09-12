'use client';
import { ShoppingCartIcon, ArrowRight, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { apiService } from '../../utils/api';
import { useCart } from '../../context/CartContext';

export default function NewLaunches() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState({});
  
  // Destructure cart context properly
  const { cart, addToCart: contextAddToCart, loading: cartLoading } = useCart();
  
  const timeoutRef = useRef({});
  const scrollerRef = useRef(null);
  const animationRef = useRef(null);
  const scrollAmountRef = useRef(0);

  const [isScrolling, setIsScrolling] = useState(true);
  const [dragging, setDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

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

  // Handle add to cart with visual feedback - FIXED
  const handleAddToCart = async (product) => {
    try {
      // Prevent multiple clicks
      if (addedToCart[product._id] || cartLoading) return;
      
      // Show visual feedback immediately
      setAddedToCart(prev => ({ ...prev, [product._id]: true }));
      
      // Call the addToCart function from context
      await contextAddToCart(product);
      
      // Store timeout for cleanup
      timeoutRef.current[product._id] = setTimeout(() => {
        setAddedToCart(prev => ({ ...prev, [product._id]: false }));
      }, 2000);
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      // Remove visual feedback if there's an error
      setAddedToCart(prev => ({ ...prev, [product._id]: false }));
      
      // Show error message to user
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

  // Auto-scroll functionality
  const syncScrollAmount = () => {
    const scroller = scrollerRef.current;
    if (scroller) {
      scrollAmountRef.current = scroller.scrollLeft;
    }
  };

  const startScrolling = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const step = () => {
      if (scroller && isScrolling && !dragging) {
        scrollAmountRef.current += 0.5;
        if (scrollAmountRef.current >= scroller.scrollWidth / 2) {
          scrollAmountRef.current = 0;
          scroller.scrollLeft = 0;
        }
        scroller.scrollLeft = scrollAmountRef.current;
      }
      animationRef.current = requestAnimationFrame(step);
    };
    animationRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    startScrolling();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isScrolling, dragging]);

  // Mouse/touch drag handlers
  const handleUserScrollStart = e => {
    setIsScrolling(false);
    setDragging(true);
    const scroller = scrollerRef.current;

    if (e.type === 'touchstart') {
      dragStartX.current = e.touches[0].clientX;
    } else {
      dragStartX.current = e.clientX;
    }
    dragStartScroll.current = scroller.scrollLeft;
  };

  const handleUserScrollMove = e => {
    if (!dragging) return;
    const scroller = scrollerRef.current;
    let clientX;
    if (e.type === 'touchmove') {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    const diff = dragStartX.current - clientX;
    scroller.scrollLeft = dragStartScroll.current + diff;
    scrollAmountRef.current = scroller.scrollLeft;
  };

  const handleUserScrollEnd = () => {
    setDragging(false);
    syncScrollAmount();
    setIsScrolling(true);
  };

  const handleScroll = () => {
    syncScrollAmount();
  };

  const handleMouseLeave = () => {
    if (dragging) {
      setDragging(false);
      syncScrollAmount();
      setIsScrolling(true);
    } else {
      setIsScrolling(true);
    }
  };

  const handleDragStart = e => e.preventDefault();

  const redirectToPlayStore = () => {
    window.open('https://play.google.com/store', '_blank');
  };

  return (
    <section className="py-6 sm:py-8 px-3 sm:px-4 bg-green-100 select-none">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">New Launches</h2>
          <div className="w-16 h-1 bg-green-600 mx-auto mt-2"></div>
        </div>

        <div
          ref={scrollerRef}
          className="flex overflow-x-hidden py-4 gap-3 sm:gap-4 no-scrollbar"
          onMouseDown={handleUserScrollStart}
          onTouchStart={handleUserScrollStart}
          onMouseMove={handleUserScrollMove}
          onTouchMove={handleUserScrollMove}
          onMouseUp={handleUserScrollEnd}
          onTouchEnd={handleUserScrollEnd}
          onMouseLeave={handleMouseLeave}
          onScroll={handleScroll}
          onMouseEnter={() => setIsScrolling(false)}
          style={{
            cursor: dragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            msUserSelect: 'none',
          }}
          draggable={false}
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`loading-${index}`}
                className="flex-shrink-0 w-40 sm:w-48 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 animate-pulse"
              >
                <div className="h-40 bg-gray-200"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="w-full text-center py-8">
              <p className="text-red-500 mb-4 text-sm sm:text-base">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="min-w-[140px] bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="w-full text-center py-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-base sm:text-lg font-semibold text-yellow-800 mb-2">No Special Offers Available</h3>
                <p className="text-yellow-700 mb-4 text-sm sm:text-base">
                  We don't have any products with active offers at the moment. 
                  Check back soon for exciting deals!
                </p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="min-w-[140px] bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
                >
                  Refresh Offers
                </button>
              </div>
            </div>
          ) : (
            [...products, ...products].map((product, index) => {
              const pricing = formatPrice(product);
              const isAdded = addedToCart[product._id];
              const itemInCart = isInCart(product._id);
              const itemQuantity = getItemQuantity(product._id);
              
              return (
                <div
                  key={`${product._id}-${index}`}
                  className="flex-shrink-0 w-40 sm:w-48 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative"
                  onDragStart={handleDragStart}
                >
                  {(product.offerPercentage > 0 || (product.discountedPrice && product.discountedPrice < (product.price || 0))) && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
                      {product.offerPercentage > 0 
                        ? `${Math.round(product.offerPercentage)}% OFF`
                        : `₹${Math.round((product.price || 0) - (product.discountedPrice || 0))} OFF`
                      }
                    </div>
                  )}
                  
                  <div className="h-40 relative">
                    <Image
                      src={product.images?.[0]?.url || '/images/explore/tomato.png'}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      draggable={false}
                      onError={(e) => {
                        e.target.src = '/images/explore/tomato.png';
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm text-gray-800 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{product.unit}</p>
                    
                    <div className="mt-2 flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-green-600">{pricing.discounted}</span>
                        {pricing.hasDiscount && (
                          <span className="text-xs text-gray-500 line-through">
                            {pricing.original}
                          </span>
                        )}
                      </div>
                      {pricing.savings > 0 && (
                        <span className="text-xs text-green-600 mt-1">
                          Save ₹{pricing.savings}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-gray-600">
                        Stock: {product.stockQuantity || 0}
                      </span>
                      <div className="flex items-center gap-2">
                        {itemInCart && (
                          <span className="text-xs text-green-600 font-medium">
                            {itemQuantity} in cart
                          </span>
                        )}
                        <button
                          className={`p-1.5 rounded-full transition-all duration-300 ${
                            isAdded 
                              ? 'bg-green-500 text-white scale-110' 
                              : itemInCart
                              ? 'bg-green-700 text-white hover:bg-green-800'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          } ${cartLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => handleAddToCart(product)}
                          disabled={isAdded || cartLoading}
                        >
                          {isAdded ? (
                            <Check size={14} />
                          ) : (
                            <ShoppingCartIcon size={14} />
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
            className="min-w-[140px] inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors shadow-md hover:shadow-lg"
          >
            Available on App
            <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
}