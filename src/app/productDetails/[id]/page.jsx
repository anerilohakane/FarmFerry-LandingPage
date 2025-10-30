// app/products/[id]/page.jsx (complete product detail page code)
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Plus, Minus, ShoppingCart, Star, Truck, Shield, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiService } from '../../../utils/api';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';

const ProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProductById(params.id);
        
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
    if (quantity < (product?.stockQuantity || 1)) {
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

  const currentPrice = product.discountedPrice || product.price;
  const originalPrice = product.discountedPrice ? product.price : null;
  const discount = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-xl border border-gray-200 overflow-hidden">
              <Image
                src={product.images?.[selectedImage]?.url || '/images/explore/tomato.png'}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                      selectedImage === index ? 'border-green-500' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-gray-600">{product.unit}</p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-green-600">₹{currentPrice}</span>
              {originalPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">₹{originalPrice}</span>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stockQuantity > 0 ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">In Stock ({product.stockQuantity} available)</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stockQuantity > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-3 font-medium min-w-[60px] text-center">{quantity}</span>
                    <button
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stockQuantity}
                      className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-gray-600">
                    Total: ₹{(currentPrice * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            {product.stockQuantity > 0 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Add to Cart
                  </>
                )}
              </motion.button>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <Truck size={16} />
                <span className="text-sm">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Shield size={16} />
                <span className="text-sm">Quality Assured</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={16} />
                <span className="text-sm">Fresh Products</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;