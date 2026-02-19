'use client';
import React from 'react';
import Image from 'next/image';

export default function FarmToHomeSection() {
    const features = [
        {
            id: 1,
            title: 'Farm Fresh Products',
            description: 'We source fresh produce directly from organic farms',
            image: '/images/1.png',
        },
        {
            id: 2,
            title: 'Quality Tested',
            description: 'Rigorous testing for 100+ common adulterants',
            image: '/images/2.png',
        },
        {
            id: 3,
            title: 'Home Delivery',
            description: 'Fresh at your doorstep every morning',
            image: '/images/1(8).png',
        },
    ];

    return (
        <section id="about" className="py-16 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#0B1C39] mb-4">
                    Farm to Home, Every Day Online Groceries Delivery
                </h2>
                <p className="text-gray-500 text-lg md:text-xl">
                    "From our farm to your home — fresh, healthy, and delivered with care every day!"
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature) => (
                    <div
                        key={feature.id}
                        className="flex flex-col items-center text-center bg-white border border-gray-200 rounded-[32px] p-6 hover:shadow-xl transition-all duration-300 group"
                    >
                        <div className="relative w-full aspect-[4/3] mb-6">
                            <Image
                                src={feature.image}
                                alt={feature.title}
                                fill
                                className="object-contain transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                        </div>
                        <div className="px-2 pb-2">
                            <h3 className="text-xl font-bold text-[#0B1C39] mb-3">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed mx-auto">
                                {feature.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
