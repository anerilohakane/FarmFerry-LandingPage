'use client';
import React from 'react';
import Image from 'next/image';

export default function NaturalFreshSection() {
    const features = [
        {
            id: 1,
            title: 'Ethically Sourced Produce',
            subtitle: 'Supporting local Indian farmers',
            image: '/images/1(9).jpeg',
        },
        {
            id: 2,
            title: 'Sustainable Farming Partners',
            subtitle: 'Backed by eco-conscious practices',
            image: '/images/1(10).jpeg',
        },
        {
            id: 3,
            title: 'Packed for You!',
            subtitle: 'Your groceries are carefully packed with freshness, ready to reach your doorstep!',
            image: '/images/4.png',
        },
        {
            id: 4,
            title: 'Fair Pricing for Farmers',
            subtitle: 'Every rupee supports rural livelihoods',
            image: '/images/1(11).png',
        },
    ];

    return (
        <section className="py-16 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left mb-12">
                <h2 className="text-3xl md:text-3xl font-bold text-[#0B1C39] mb-4">
                    We are bringing Natural & Fresh back
                </h2>
                <p className="text-gray-500 text-base md:text-lg max-w-4xl">
                    Better everyday health begins with the basics. We source Milk, Groceries, Fruits, Yogurts, Eggs, vegetables and all other essentials fresh from the best farms in India.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature) => (
                    <div
                        key={feature.id}
                        className="flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="relative w-full aspect-[4/3]">
                            <Image
                                src={feature.image}
                                alt={feature.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 25vw"
                            />
                        </div>
                        <div className="p-6 text-center flex-grow flex flex-col justify-start">
                            <h3 className="text-lg font-bold text-[#0B1C39] mb-2 leading-tight">{feature.title}</h3>
                            <p className="text-gray-500 text-sm">{feature.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
