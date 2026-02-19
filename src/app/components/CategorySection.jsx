'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { apiService } from '../../utils/api';

export default function CategorySection() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await apiService.getAllCategories({
                parent: 'null',
                includeInactive: 'false'
            });

            if (response.success) {
                // Handle potentially different response structures, slightly robust
                const cats = response.data?.categories || response.data?.items || response.data || [];
                setCategories(cats);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (category) => {
        // Navigate to products page with category context to fetch categorized products (Category > Subcategory > Product)
        router.push(`/products?categoryId=${category._id}&categoryName=${encodeURIComponent(category.name)}`);
    };

    if (loading) {
        return (
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <div className="h-8 w-48 bg-gray-200 rounded mx-auto animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center space-y-3">
                                <div className="w-24 h-24 rounded-2xl bg-gray-200 animate-pulse"></div>
                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // If no categories, we still render the section to avoid layout shifting, 
    // potentially showing an empty state or allow the empty array to map to nothing.
    // User requested "dont remove browse by categories".

    return (
        <section className="py-4 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header: Title and Navigation */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Browse By Categories</h2>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 rounded bg-[#1a4d2e] text-white flex items-center justify-center hover:bg-green-700 transition-colors shadow-md">
                            <ArrowLeft size={20} />
                        </button>
                        <button className="w-10 h-10 rounded bg-[#1a4d2e] text-white flex items-center justify-center hover:bg-green-700 transition-colors shadow-md">
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Categories Grid */}
                {/* Categories Grid */}
                {categories.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                        {categories.map((category) => {
                            let imageUrl = (typeof category.image === 'string' ? category.image : category.image?.url) || category.images?.[0]?.url || '/images/farmferry-logo.png';
                            if (imageUrl.startsWith('hhttps://')) imageUrl = imageUrl.replace('hhttps://', 'https://');

                            return (
                                <div
                                    key={category._id}
                                    onClick={() => handleCategoryClick(category)}
                                    className="group cursor-pointer flex flex-col items-center"
                                >
                                    {/* Circular Image Container */}
                                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 mb-4 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-2">

                                        {/* Product Image - Circular & Clipped */}
                                        <div className="relative w-full h-full z-10 rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
                                            <Image
                                                src={imageUrl}
                                                alt={category.name}
                                                fill
                                                className="object-cover hover:scale-110 transition-transform duration-500"
                                                sizes="150px"
                                            />
                                        </div>
                                    </div>

                                    <h3 className="text-green-700 font-bold text-base sm:text-lg text-center leading-tight mt-2">
                                        {category.name}
                                    </h3>

                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-lg">No categories found in database.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
