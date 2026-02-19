'use client';
import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function BottomBanner() {
    return (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden">
                {/* Background Image / Color */}
                <div className="absolute inset-0 bg-[#f3f4f6]"> {/* Light Gray Substitute */}
                    <Image
                        src="/images/Hero Banner 5.png" // Using an existing banner as background
                        alt="Daily Life"
                        fill
                        className="object-cover opacity-80"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="absolute top-1/2 -translate-y-1/2 left-8 md:left-16 max-w-lg z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                        We Make Your Daily <br /> Life More Easy
                    </h2>
                    <p className="text-gray-600 mb-8 text-lg">
                        Subscribe to our newsletter and enjoy <br /> with our 100% organic food.
                    </p>
                    <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-green-600 transition-colors shadow-lg">
                        Read More <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </section>
    );
}
