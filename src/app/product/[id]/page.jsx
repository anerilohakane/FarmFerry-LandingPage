// app/products/[id]/page.jsx (COMPLETE CORRECTED CODE)
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';  // ← CORRECT IMPORT
import Image from 'next/image';
import { ArrowLeft, Plus, Minus, ShoppingCart, Star, Truck, Shield, Clock, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiService } from '../../../utils/api';         // ← CORRECT PATH
import { useCart } from '../../../context/CartContext';  // ← CORRECT PATH
import { useAuth } from '../../../context/AuthContext';  // ← CORRECT PATH

const ProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState(new Set());

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // Review State
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProductById(params.id);  // ← params.id is correct

        if (response && response.success) {
          setProduct(response.data);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

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
    if (product?._id) {
      apiService.getReviews(product._id).then(res => {
        if (res.success) setReviews(res.data || []);
      }).catch(err => console.error("Failed to load reviews", err));
    }
  }, [product]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return alert("Please login to write a review");

    setSubmittingReview(true);
    setReviewError(null);
    setReviewSuccess(false);

    try {
      const res = await apiService.createReview({
        productId: product._id,
        ...reviewForm
      });
      if (res.success) {
        setReviewSuccess(true);
        // Optimistically add review or re-fetch
        // Since we don't have user profile populated fully in response immediately without population, easiest is to append basic data
        const newReview = { ...res.data, customer: user };
        setReviews([newReview, ...reviews]);
        setReviewForm({ rating: 5, title: '', comment: '' });
      } else {
        setReviewError(res.error || "Failed to submit review");
      }
    } catch (err) {
      setReviewError(err.message || "An error occurred");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleToggleWishlist = async (e) => {
    if (e) e.stopPropagation();
    if (!isAuthenticated) {
      // Trigger login modal
      window.dispatchEvent(new Event('openAuthModal'));
      return;
    }

    if (!user || !user._id) {
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

      if (response && response.success) {
        setWishlist(prev => {
          const newSet = new Set(prev);
          if (isInWishlist) newSet.delete(productId);
          else newSet.add(productId);
          return newSet;
        });
        window.dispatchEvent(new Event('wishlistUpdated'));
      } else {
        alert(`Failed to update wishlist: ${response?.message || response?.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      alert(`Error updating wishlist: ${error.message}`);
    }
  };

  // ... rest of your code remains exactly the same ...

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAddingToCart(true);
      await addToCart({
        _id: product._id,
        product: product,
        qty: quantity,
        price: product.price,
        discountedPrice: product.discountedPrice || product.price
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const increaseQuantity = () => {
    if (quantity < (product?.stockQuantity || 100)) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 aspect-square rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.back()}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }



  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on FarmFerry!`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      alert('Link copied to clipboard!');
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const currentPrice = product.discountedPrice || product.price;
  const originalPrice = product.discountedPrice ? product.price : null;
  const discount = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  return (
    <div className="bg-gray-50 pt-36 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumbs / Back */}


        {/* Main Product Card */}
        <div className="bg-white rounded-3xl p-6 lg:p-6 shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

            {/* Left: Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden relative group">
                <Image
                  src={product.images?.[selectedImage]?.url || '/images/explore/tomato.png'}
                  alt={product.name}
                  fill
                  className="w-full h-full object-contain mix-blend-multiply p-4 transition-transform duration-500 group-hover:scale-105"
                  sizes="600px"
                  priority
                />
              </div>

              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all ${selectedImage === index ? 'border-green-500 ring-2 ring-green-100' : 'border-gray-200 hover:border-green-300'
                        }`}
                    >
                      <div className="relative w-full h-full bg-gray-50">
                        <Image
                          src={image.url}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          className="w-full h-full object-contain p-1 mix-blend-multiply"
                          sizes="80px"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="space-y-6">
              <div>
                <div className="text-sm text-gray-400 mb-1">{product.categoryId?.name || 'Groceries'}</div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>

                {/* Rating - Dynamic */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex bg-green-600 text-white px-2 py-1 rounded text-sm font-bold items-center gap-1">
                    <span>{product.averageRating?.toFixed(1) || '0.0'}</span>
                    <Star size={12} fill="currentColor" />
                  </div>
                  <span className="text-sm text-gray-500">({product.totalReviews || 0} reviews)</span>
                </div>

                <div className="flex items-end gap-3 mb-2">
                  <span className="text-3xl font-bold text-gray-900">₹{currentPrice}</span>
                  <span className="text-gray-500 mb-1">/ {product.unit || 'pcs'}</span>
                </div>
                {originalPrice && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400 line-through">₹{originalPrice}</span>
                    <span className="text-green-600 font-medium">{discount}% OFF</span>
                  </div>
                )}

                <p className="text-xs text-orange-500 font-medium mt-2">Minimum Order: 1 {product.unit || 'pcs'}</p>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <p className="text-gray-600 leading-relaxed mb-6">
                  {product.description || `Fresh and high-quality ${product.name} sourced directly from organic farms.`}
                </p>

                {/* Quantity */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Quantity</label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-full px-1 py-1 w-32 justify-between">
                      <button
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-green-600 disabled:opacity-30 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-bold text-gray-900">{quantity}</span>
                      <button
                        onClick={increaseQuantity}
                        disabled={quantity >= (product.stockQuantity || 100)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-green-600 disabled:opacity-30 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-gray-700">Total: ₹{(currentPrice * quantity).toFixed(2)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 h-12">
                  {product.stockQuantity > 0 ? (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      className="flex-1 bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 font-bold rounded-lg flex items-center justify-center gap-2 transition-all uppercase tracking-wide text-sm"
                    >
                      {addingToCart ? 'Adding...' : (
                        <>
                          <ShoppingCart size={18} />
                          Add to Cart
                        </>
                      )}
                    </motion.button>
                  ) : (
                    <button disabled className="flex-1 bg-gray-100 text-gray-400 font-bold rounded-lg border border-gray-200 cursor-not-allowed uppercase tracking-wide text-sm">
                      Out of Stock
                    </button>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleToggleWishlist}
                    className={`w-12 h-12 flex items-center justify-center rounded-lg border transition-colors ${wishlist.has(product._id)
                      ? 'border-red-500 text-red-500 bg-red-50'
                      : 'border-gray-200 text-gray-400 hover:border-red-500 hover:text-red-500 bg-white'
                      }`}
                  >
                    <Heart size={20} fill={wishlist.has(product._id) ? "currentColor" : "none"} />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-green-600 hover:border-green-600 bg-white transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Trust Badge Grid */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-6">
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                  <div className="p-2 bg-white rounded-full text-orange-500 shadow-sm">
                    <Truck size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Fast Delivery</p>
                    <p className="text-[10px] text-gray-500">2-3 business days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                  <div className="p-2 bg-white rounded-full text-green-500 shadow-sm">
                    <Shield size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Quality Assured</p>
                    <p className="text-[10px] text-gray-500">100% authentic</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <div className="p-2 bg-white rounded-full text-blue-500 shadow-sm">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Easy Returns</p>
                    <p className="text-[10px] text-gray-500">7-day return policy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                  <div className="p-2 bg-white rounded-full text-purple-500 shadow-sm">
                    <Star size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Verified Seller</p>
                    <p className="text-[10px] text-gray-500">Trusted supplier</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[300px]">
          <div className="flex border-b border-gray-100">
            {['Description', 'Specifications', `Reviews (${reviews.length})`].map((tab) => {
              const key = tab.split(' ')[0].toLowerCase();
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-8 py-4 text-sm font-bold transition-colors relative ${activeTab === key
                    ? 'text-orange-500'
                    : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {tab}
                  {activeTab === key && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-8">
            {activeTab === 'description' && (
              <div className="animate-fadeIn">
                <h3 className="font-bold text-gray-900 mb-4">Product Description</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {product.description || "Experience the best quality organic produce with our farm-fresh selection. We ensure every item is carefully handpicked and packed to retain its natural goodness. Perfect for your daily nutritional needs."}
                </p>

                <h4 className="font-bold text-gray-900 mb-3">Key Features:</h4>
                <ul className="space-y-2 text-gray-600 text-sm list-disc pl-5">
                  <li>Premium quality ingredients for professional use</li>
                  <li>Consistent texture and flavor in every batch</li>
                  <li>Suitable for all types of cooking applications</li>
                  <li>Long shelf life with proper storage</li>
                  <li>Food-grade packaging for freshness</li>
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="animate-fadeIn">
                <h3 className="font-bold text-gray-900 mb-4">Product Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Brand</span>
                    <span className="font-medium text-gray-900">FarmFerry Organic</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Category</span>
                    <span className="font-medium text-gray-900">{product.categoryId?.name || 'General'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Unit</span>
                    <span className="font-medium text-gray-900">{product.unit || 'Standard'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Stock Status</span>
                    <span className={`font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="animate-fadeIn py-8">
                {/* Reviews List */}
                <div className="mb-12 space-y-6">
                  {reviews.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No reviews yet. Be the first to review!</div>
                  ) : (
                    reviews.map((review) => {
                      const customerName = (() => {
                        const c = review.customer;
                        if (!c) return 'User';
                        const fullName = `${c.firstName || ''} ${c.lastName || ''}`.trim();
                        if (fullName) return fullName;
                        const addr = c.addresses?.find(a => a.isDefault) || c.addresses?.[0];
                        return addr?.name || 'User';
                      })();

                      return (
                        <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold overflow-hidden">
                                {review.customer?.profileImage ? (
                                  <Image src={review.customer.profileImage} alt="User" width={32} height={32} className="w-full h-full object-cover" />
                                ) : (
                                  (customerName[0] || 'U').toUpperCase()
                                )}
                              </div>
                              <span className="font-bold text-gray-900">{customerName}</span>
                            </div>
                            <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex text-yellow-400 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-300" : ""} />
                            ))}
                          </div>
                          {review.title && <h4 className="font-bold text-gray-800 text-sm mb-1">{review.title}</h4>}
                          <p className="text-gray-600 text-sm">{review.comment}</p>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Review Form Removed */}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductPage;