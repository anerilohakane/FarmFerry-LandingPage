// // WhyChooseUs.jsx (complete modified code)
// 'use client';

// import { ShoppingCartIcon, ArrowRight, Check, ChevronLeft, ChevronRight } from 'lucide-react';
// import { useEffect, useRef, useState } from 'react';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { apiService } from '../../utils/api';
// import { useCart } from '../../context/CartContext';

// export default function NewLaunches() {
//   const router = useRouter();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [addedToCart, setAddedToCart] = useState({});
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(false);
//   const { cart, addToCart: contextAddToCart, loading: cartLoading } = useCart();
//   const timeoutRef = useRef({});
//   const scrollerRef = useRef(null);

//   // Cleanup timeouts on unmount
//   useEffect(() => {
//     return () => {
//       Object.values(timeoutRef.current).forEach(clearTimeout);
//     };
//   }, []);

//   // Helper functions to check if item is in cart and get quantity
//   const isInCart = (productId) => {
//     return cart.some(item => item._id === productId);
//   };

//   const getItemQuantity = (productId) => {
//     const item = cart.find(item => item._id === productId);
//     return item ? (item.qty || item.quantity || 0) : 0;
//   };

//   // Handle add to cart with visual feedback
//   const handleAddToCart = async (product) => {
//     try {
//       if (addedToCart[product._id] || cartLoading) return;
//       setAddedToCart(prev => ({ ...prev, [product._id]: true }));
//       await contextAddToCart(product);
//       timeoutRef.current[product._id] = setTimeout(() => {
//         setAddedToCart(prev => ({ ...prev, [product._id]: false }));
//       }, 2000);
//     } catch (err) {
//       console.error('Error adding to cart:', err);
//       setAddedToCart(prev => ({ ...prev, [product._id]: false }));
//       alert('Failed to add item to cart. Please try again.');
//     }
//   };

//   // Fetch products with offers
//   useEffect(() => {
//     const fetchProductsWithOffers = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const response = await apiService.getProductsWithOffers({
//           limit: 20
//         });

//         if (response?.data?.products) {
//           const productsWithOffers = response.data.products.filter(product => {
//             const hasValidOffer = product.hasActiveOffer &&
//                                  (product.offerPercentage > 0 ||
//                                   (product.discountedPrice && product.discountedPrice < product.price));
//             return hasValidOffer;
//           });
//           console.log(`Filtered ${productsWithOffers.length} products with offers`);
//           setProducts(productsWithOffers);
//         } else {
//           console.log('No products in response:', response);
//           setProducts([]);
//         }
//       } catch (err) {
//         console.error('Error fetching products with offers:', err);
//         setError('Failed to load products. Please try again later.');
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProductsWithOffers();
//   }, []);

//   // Calculate discounted price and format currency
//   const formatPrice = (product) => {
//     const originalPrice = product.price || 0;
//     const discountedPrice = product.discountedPrice || originalPrice;
//     const offerPercentage = product.offerPercentage || 0;

//     const finalPrice = discountedPrice < originalPrice ? discountedPrice :
//                       (originalPrice - (originalPrice * offerPercentage / 100));

//     return {
//       original: `₹${originalPrice}`,
//       discounted: `₹${Math.round(finalPrice)}`,
//       hasDiscount: finalPrice < originalPrice,
//       savings: Math.round(originalPrice - finalPrice)
//     };
//   };

//   // Check scroll position and update button states
//   const checkScrollButtons = () => {
//     const scroller = scrollerRef.current;
//     if (scroller) {
//       setCanScrollLeft(scroller.scrollLeft > 0);
//       setCanScrollRight(
//         scroller.scrollLeft < scroller.scrollWidth - scroller.clientWidth
//       );
//     }
//   };

//   // Manual scroll functions
//   const scrollLeft = () => {
//     const scroller = scrollerRef.current;
//     if (scroller) {
//       scroller.scrollBy({
//         left: -320,
//         behavior: 'smooth'
//       });
//     }
//   };

//   const scrollRight = () => {
//     const scroller = scrollerRef.current;
//     if (scroller) {
//       scroller.scrollBy({
//         left: 320,
//         behavior: 'smooth'
//       });
//     }
//   };

//   // Update scroll button states
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       checkScrollButtons();
//     }, 100);
//     return () => clearTimeout(timer);
//   }, [products]);

//   const redirectToPlayStore = () => {
//     window.open('https://play.google.com/store', '_blank');
//   };

//   return (
//     <section className="py-8 sm:py-12 px-4 sm:px-6 bg-gray-50">
//       <div className="container mx-auto max-w-6xl">
//         <div className="relative">
//           {products.length > 0 && !loading && (
//             <>
//               <button
//                 onClick={scrollLeft}
//                 disabled={!canScrollLeft}
//                 className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-200 ${
//                   canScrollLeft
//                     ? 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:shadow-xl'
//                     : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
//                 }`}
//               >
//                 <ChevronLeft size={24} />
//               </button>
//               <button
//                 onClick={scrollRight}
//                 disabled={!canScrollRight}
//                 className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-200 ${
//                   canScrollRight
//                     ? 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:shadow-xl'
//                     : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
//                 }`}
//               >
//                 <ChevronRight size={24} />
//               </button>
//             </>
//           )}

//           <div className="text-center mb-8">
//             <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">New Launches</h2>
//             <p className="text-gray-600 mt-1">Discover our latest products with exclusive offers</p>
//           </div>

//           <div
//             ref={scrollerRef}
//             className="flex overflow-x-auto py-4 gap-4 sm:gap-6 scrollbar-hide"
//             onScroll={checkScrollButtons}
//             style={{
//               scrollbarWidth: 'none',
//               msOverflowStyle: 'none',
//             }}
//           >
//             {loading ? (
//               Array.from({ length: 6 }).map((_, index) => (
//                 <div
//                   key={`loading-${index}`}
//                   className="flex-shrink-0 w-48 sm:w-56 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 animate-pulse"
//                 >
//                   <div className="h-48 bg-gray-200"></div>
//                   <div className="p-4">
//                     <div className="h-4 bg-gray-200 rounded mb-2"></div>
//                     <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
//                     <div className="h-4 bg-gray-200 rounded w-20"></div>
//                   </div>
//                 </div>
//               ))
//             ) : error ? (
//               <div className="w-full text-center py-12">
//                 <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 max-w-md mx-auto">
//                   <p className="text-red-600 mb-4 text-base font-medium">{error}</p>
//                   <button
//                     onClick={() => window.location.reload()}
//                     className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
//                   >
//                     Retry
//                   </button>
//                 </div>
//               </div>
//             ) : products.length === 0 ? (
//               <div className="w-full text-center py-12">
//                 <div className="bg-white rounded-xl shadow-sm border border-yellow-200 p-8 max-w-md mx-auto">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-2">No Special Offers Available</h3>
//                   <p className="text-gray-600 mb-6 text-sm">
//                     We don't have any products with active offers at the moment.
//                     Check back soon for exciting deals!
//                   </p>
//                   <button
//                     onClick={() => window.location.reload()}
//                     className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
//                   >
//                     Refresh Offers
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               products.map((product) => {
//                 if (!product || !product._id || !product.name || !product.price) {
//                   console.warn(`Invalid product data:`, product);
//                   return null;
//                 }

//                 const pricing = formatPrice(product);
//                 const isAdded = addedToCart[product._id];
//                 const itemInCart = isInCart(product._id);
//                 const itemQuantity = getItemQuantity(product._id);

//                 return (
//                   <div
//                     key={product._id}
//                     className="flex-shrink-0 w-48 sm:w-56 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative group cursor-pointer"
//                     onClick={(e) => {
//                       if (e.target.closest('button')) return;
//                       router.push(`/products/${product._id}`);
//                     }}
//                   >
//                     {(product.offerPercentage > 0 || (product.discountedPrice && product.discountedPrice < (product.price || 0))) && (
//                       <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-lg z-10">
//                         {product.offerPercentage > 0
//                           ? `${Math.round(product.offerPercentage)}% OFF`
//                           : `₹${Math.round((product.price || 0) - (product.discountedPrice || 0))} OFF`}
//                       </div>
//                     )}

//                     <div className="h-48 relative overflow-hidden">
//                       <Image
//                         src={product.images?.[0]?.url || '/images/explore/tomato.png'}
//                         alt={product.name}
//                         fill
//                         className="object-cover group-hover:scale-105 transition-transform duration-300"
//                         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                         onError={(e) => {
//                           e.target.src = '/images/explore/tomato.png';
//                         }}
//                       />
//                     </div>
//                     <div className="p-4">
//                       <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 mb-1">{product.name}</h3>
//                       <p className="text-xs text-gray-500">{product.unit}</p>

//                       <div className="mt-3 flex flex-col">
//                         <div className="flex items-center gap-2">
//                           <span className="font-bold text-base text-green-600">{pricing.discounted}</span>
//                           {pricing.hasDiscount && (
//                             <span className="text-xs text-gray-400 line-through">{pricing.original}</span>
//                           )}
//                         </div>
//                         {pricing.savings > 0 && (
//                           <span className="text-xs text-green-600 font-medium mt-1">
//                             Save ₹{pricing.savings}
//                           </span>
//                         )}
//                       </div>

//                       <div className="mt-4 flex justify-between items-center">
//                         <span className="text-xs text-gray-500">
//                           Stock: {product.stockQuantity || 0}
//                         </span>
//                         <div className="flex items-center gap-2">
//                           {itemInCart && (
//                             <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
//                               {itemQuantity} in cart
//                             </span>
//                           )}
//                           <button
//                             className={`p-2 rounded-full transition-all duration-300 ${
//                               isAdded
//                                 ? 'bg-green-500 text-white scale-110'
//                                 : itemInCart
//                                 ? 'bg-green-700 text-white hover:bg-green-800'
//                                 : 'bg-green-600 text-white hover:bg-green-700 hover:scale-105'
//                             } ${cartLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleAddToCart(product);
//                             }}
//                             disabled={isAdded || cartLoading}
//                           >
//                             {isAdded ? (
//                               <Check size={16} />
//                             ) : (
//                               <ShoppingCartIcon size={16} />
//                             )}
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           <div className="mt-8 text-center">
//             <button
//               onClick={redirectToPlayStore}
//               className="inline-flex items-center justify-center bg-green-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
//             >
//               Available on App
//               <ArrowRight size={18} className="ml-2" />
//             </button>
//           </div>
//         </div>

//         <style jsx>{`
//           .scrollbar-hide::-webkit-scrollbar {
//             display: none;
//           }
//           .scrollbar-hide {
//             -ms-overflow-style: none;
//             scrollbar-width: none;
//           }
//         `}</style>
//       </div>
//     </section>
//   );
// }

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiService } from '../../utils/api';
import { useCart } from '../../context/CartContext';

// ProductCard Component for New Taste Section
const NewTasteProductCard = ({ product }) => {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { 
    cart, 
    addToCart, 
    increaseQty, 
    decreaseQty, 
    loading: cartLoading 
  } = useCart();

  // Helper functions
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

  // Calculate discount
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

  // Get image URL
  const getImageUrl = () => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    if (product.image) {
      return product.image;
    }
    return "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop&auto=format&q=80";
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div 
      className="flex-shrink-0 w-[200px] bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative cursor-pointer border border-gray-100"
      onClick={() => router.push(`/products/${product._id}`)}
    >
      {/* Product Image with Heart Icon */}
      <div className="relative h-[140px] w-full overflow-hidden bg-gray-50">
        {/* Heart/Wishlist Icon */}
        {/* <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 z-10 bg-white rounded-full p-1.5 shadow-md hover:scale-110 transition-transform duration-200"
        >
          <Heart 
            className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button> */}

        <Image
          src={getImageUrl()}
          alt={product.name}
          fill
          sizes="200px"
          className="object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/images/explore/tomato.png';
          }}
        />

        {/* Add Button at Bottom Right Corner */}
        {!isInCartItem ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={product.stockQuantity === 0 || isAdding || cartLoading}
            className={`absolute bottom-2 right-2 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-200 shadow-md min-w-[70px] text-center
              ${product.stockQuantity === 0 
                ? 'bg-gray-300 text-red-500 cursor-not-allowed' 
                : 'bg-white text-green-600 hover:bg-gray-50 active:scale-95'
              }`}
          >
            {product.stockQuantity === 0 ? 'Out of Stock' : 'Add'}
          </button>
        ) : (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-2 right-2 flex items-center bg-white rounded-lg shadow-md overflow-hidden min-w-[80px] justify-center"
          >
            <button
              onClick={handleDecreaseQuantity}
              disabled={cartLoading}
              className="px-2 py-1.5 text-gray-800 hover:bg-gray-100 transition-colors font-semibold text-sm"
            >
              -
            </button>
            <span className="px-2 py-1.5 text-gray-800 font-semibold bg-green-50 text-xs min-w-[20px] text-center">
              {cartQuantity}
            </span>
            <button
              onClick={handleIncreaseQuantity}
              disabled={cartLoading || cartQuantity >= product.stockQuantity}
              className="px-2 py-1.5 text-gray-800 hover:bg-gray-100 transition-colors font-semibold text-sm"
            >
              +
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        {/* Product Name */}
        <h3 className="font-medium text-gray-900 text-xs mb-2 line-clamp-2 leading-tight min-h-[32px]">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-center space-x-1 mb-2">
          <span className="font-bold text-gray-900 text-sm">
            ₹{discountInfo.finalPrice}
          </span>
          {discountInfo.hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.price}
            </span>
          )}
        </div>

        {/* Discount and Quantity Row */}
        <div className="flex items-center justify-between">
          {discountInfo.hasDiscount && (
            <span className="text-xs text-red-600 font-medium">
              Save ₹{(product.price - discountInfo.finalPrice).toFixed(0)}
            </span>
          )}
          
          {/* Quantity Badge */}
          <div className="inline-flex items-center bg-green-100 text-green-700 text-xs font-medium px-1.5 py-0.5 rounded ml-auto">
            {product.quantity || product.volume || product.unit || "1 unit"}
          </div>
        </div>
      </div>
    </div>
  );
};

// Our Trusted Brands Component
const OurTrustedBrandsSection = () => {
  const brands = [
    {
      id: 1,
      name: 'Chitale',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Chitale_Bandhu_Mithaiwale_logo.svg/2560px-Chitale_Bandhu_Mithaiwale_logo.svg.png',
    },
    {
      id: 2,
      name: 'Suhana',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWFXAbWOfXQU_PVxRXBbD65c9zoXqzd6y1qg&s',
    },
    {
      id: 3,
      name: 'Britannia',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/50/Britannia_Industries_logo_with_motto.svg/2560px-Britannia_Industries_logo_with_motto.svg.png',
    },
    {
      id: 4,
      name: 'Unilever',
      logo: 'https://1000logos.net/wp-content/uploads/2017/06/Unilever-Logo.png',
    },
    {
      id: 5,
      name: 'Amul',
      logo: 'https://www.samco.in/knowledge-center/wp-content/uploads/2022/01/amul-girl-mascot.jpg',
    },
    {
      id: 6,
      name: 'Nestle',
      logo: 'https://images.seeklogo.com/logo-png/9/1/nestle-logo-png_seeklogo-98337.png',
    },
    {
      id: 7,
      name: 'Parle',
      logo: 'https://1000logos.net/wp-content/uploads/2022/02/Parle-Logo.jpg',
    },
    {
      id: 8,
      name: 'Haldiram',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Haldiram%27s_Logo_SVG.svg',
    },
    {
      id: 9,
      name: 'Mother Dairy',
      logo: 'https://mir-s3-cdn-cf.behance.net/projects/404/58f939103264743.Y3JvcCw3MjcsNTY4LDE5MCwyMjM.jpg',
    },
    {
      id: 10,
      name: 'Patanjali',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxQ4crgfsf8bfVYfOknLKBJenshAIkDHHllg&s',
    }
  ];

  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    const scroller = scrollContainerRef.current;
    if (scroller) {
      setCanScrollLeft(scroller.scrollLeft > 0);
      setCanScrollRight(
        scroller.scrollLeft < scroller.scrollWidth - scroller.clientWidth - 10
      );
    }
  };

  const scrollLeft = () => {
    const scroller = scrollContainerRef.current;
    if (scroller) {
      scroller.scrollBy({
        left: -320,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    const scroller = scrollContainerRef.current;
    if (scroller) {
      scroller.scrollBy({
        left: 320,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      checkScrollButtons();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="py-6 sm:py-8 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            Our Trusted Brands
          </h2>
          <p className="text-gray-600 text-sm">
            Discover the world of trusted brands that bring you quality, innovation, and reliability in every product.
          </p>
        </div>

        {/* Brands Horizontal Scroll with Navigation */}
        <div className="relative">
          {brands.length > 0 && (
            <>
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full shadow-lg transition-all duration-200 ${
                  canScrollLeft
                    ? 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:shadow-xl'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                }`}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full shadow-lg transition-all duration-200 ${
                  canScrollRight
                    ? 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:shadow-xl'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
            onScroll={checkScrollButtons}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="flex-shrink-0 w-[160px] bg-white rounded-xl p-6 flex items-center justify-center hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 group"
              >
                <div className="relative w-full h-16 flex items-center justify-center">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name)}&size=200&background=random`;
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to check if a product has a discount
const hasDiscount = (product) => {
  const originalPrice = parseFloat(product.price) || 0;
  const discountedPrice = parseFloat(product.discountedPrice) || 0;
  const offerPercentage = parseFloat(product.offerPercentage) || 0;
  
  return (discountedPrice > 0 && discountedPrice < originalPrice) || offerPercentage > 0;
};

// Main New Taste, New Start Section Component
const NewTasteNewStartSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    fetchDiscountedProducts();
  }, []);

  const fetchDiscountedProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all products first
      const response = await apiService.getAllProducts({
        limit: 50, // Fetch more to filter discounted products
        sortBy: 'createdAt',
        order: 'desc'
      });
      
      if (response.success) {
        const allProducts = response.data.products || response.data || [];
        
        // Filter only discounted products
        const discountedProducts = allProducts.filter(product => hasDiscount(product));
        
        // Take only the first 8 discounted products
        setProducts(discountedProducts.slice(0, 8));
      } else {
        setError('Failed to fetch discounted products');
      }
    } catch (error) {
      console.error('Error fetching discounted products:', error);
      setError('Failed to load discounted products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const checkScrollButtons = () => {
    const scroller = scrollContainerRef.current;
    if (scroller) {
      setCanScrollLeft(scroller.scrollLeft > 0);
      setCanScrollRight(
        scroller.scrollLeft < scroller.scrollWidth - scroller.clientWidth - 10
      );
    }
  };

  const scrollLeft = () => {
    const scroller = scrollContainerRef.current;
    if (scroller) {
      scroller.scrollBy({
        left: -320,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    const scroller = scrollContainerRef.current;
    if (scroller) {
      scroller.scrollBy({
        left: 320,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      checkScrollButtons();
    }, 100);
    return () => clearTimeout(timer);
  }, [products]);

  // Loading state
  if (loading) {
    return (
      <div className="py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              New Taste, New Start
            </h2>
            <p className="text-gray-600 text-sm">
              Exciting discounted products — shop them before they're gone!
            </p>
          </div>

          {/* Loading Skeleton */}
          <div className="flex gap-3 overflow-hidden">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex-shrink-0 w-[200px] bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse border border-gray-100">
                <div className="h-[140px] bg-gray-200"></div>
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              New Taste, New Start
            </h2>
            <p className="text-gray-600 text-sm">
              Exciting discounted products — shop them before they're gone!
            </p>
          </div>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchDiscountedProducts}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8"> 
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              New Taste, New Start
            </h2>
            <p className="text-gray-600 text-sm">
              Exciting discounted products — shop them before they're gone!
            </p>
          </div>

          {/* Products Horizontal Scroll with Navigation */}
          {products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-sm">No discounted products available at the moment.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Navigation Buttons */}
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full shadow-lg transition-all duration-200 ${
                  canScrollLeft
                    ? 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:shadow-xl'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                }`}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full shadow-lg transition-all duration-200 ${
                  canScrollRight
                    ? 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:shadow-xl'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                }`}
              >
                <ChevronRight size={20} />
              </button>

              {/* Products Scroll Container */}
              <div
                ref={scrollContainerRef}
                className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide"
                onScroll={checkScrollButtons}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {products.map((product) => (
                  <NewTasteProductCard 
                    key={product._id || product.id} 
                    product={product} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Our Trusted Brands Section */}
      <OurTrustedBrandsSection />

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default NewTasteNewStartSection;