'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
                // Filter out subcategories ('Leafy Greens', 'Milk', 'Vegetables') from main view
                const filteredCats = cats.filter(cat => !['Leafy Greens', 'Milk', 'Vegetables'].includes(cat.name));
                setCategories(filteredCats);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (category) => {
        router.push(`/products?category=${encodeURIComponent(category.name)}&categoryId=${category._id}&showAll=true`);
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
                                <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore Categories</h2>
                    <p className="text-gray-600">Fresh from the farm to your table</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
                    {categories.map((category) => {
                        // detailed image extraction
                        let imageUrl = '';
                        if (category.image && typeof category.image === 'string') {
                            imageUrl = category.image;
                        } else if (category.image && typeof category.image === 'object' && category.image.url) {
                            imageUrl = category.image.url;
                        } else if (category.images && Array.isArray(category.images) && category.images.length > 0) {
                            imageUrl = category.images[0].url || '';
                        }

                        // Fix double protocol if present
                        if (imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('hhttps://')) {
                            imageUrl = imageUrl.replace('hhttps://', 'https://');
                        }

                        // Use unsplash placeholder if no image
                        if (!imageUrl) {
                            imageUrl = "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=300&h=300&fit=crop";
                        }

                        return (
                            <div
                                key={category._id}
                                onClick={() => handleCategoryClick(category)}
                                className="group cursor-pointer flex flex-col items-center"
                            >
                                <div className="w-24 h-24 sm:w-28 sm:h-28 relative rounded-full overflow-hidden bg-white shadow-md border-2 border-transparent group-hover:border-green-500 transition-all duration-300 transform group-hover:-translate-y-1">
                                    <Image
                                        src={imageUrl}
                                        alt={category.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                        sizes="(max-width: 768px) 100px, 150px"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=300&h=300&fit=crop";
                                        }}
                                    />
                                </div>
                                <h3 className="mt-4 text-base font-medium text-gray-800 group-hover:text-green-600 transition-colors text-center">
                                    {category.name}
                                </h3>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
