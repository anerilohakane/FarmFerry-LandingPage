'use client';
import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function PromoBanners() {
    const banners = [
        { id: 1, image: "/images/1(4).png", link: "/products" },
        { id: 2, image: "/images/1(5).png", link: "/products" },
        { id: 3, image: "/images/1(6).png", link: "/products" }
    ];

    return (
        <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {banners.map((banner) => (
                    <div
                        key={banner.id}
                        className="relative h-64 rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        onClick={() => window.location.href = banner.link}
                    >
                        <Image
                            src={banner.image}
                            alt="Promo Banner"
                            fill
                            className="object-fill transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
