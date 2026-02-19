'use client';
import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-24 sm:mt-28">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[500px]">

        {/* Main Banner - Takes up 2 columns */}
        {/* Main Banner - Takes up 2 columns */}
        <Link href="/products" className="md:col-span-2 relative h-[300px] md:h-full rounded-3xl overflow-hidden group shadow-sm hover:shadow-md transition-shadow cursor-pointer block">
          <Image
            src="/images/1%20(1).png"
            alt="Organic Food For Healthy Lifestyle"
            fill
            className="object-fill hover:scale-105 transition-transform duration-700"
            priority
          />
        </Link>

        {/* Side Banners - Stacked */}
        <div className="flex flex-col gap-6 h-[500px] md:h-full">

          {/* Top Side Banner */}
          <Link href="/products?category=Fruits" className="relative flex-1 rounded-3xl overflow-hidden group shadow-sm hover:shadow-md transition-shadow cursor-pointer block">
            <Image
              src="/images/1(2).png"
              alt="Fresh Fruits"
              fill
              className="object-fill hover:scale-105 transition-transform duration-700"
            />
          </Link>

          {/* Bottom Side Banner */}
          <Link href="/products?category=Vegetables" className="relative flex-1 rounded-3xl overflow-hidden group shadow-sm hover:shadow-md transition-shadow cursor-pointer block">
            <Image
              src="/images/1(3).png"
              alt="New Vegetable Item"
              fill
              className="object-fill hover:scale-105 transition-transform duration-700"
            />
          </Link>
        </div>
      </div>

      {/* Features Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 border border-gray-100 rounded-2xl p-6 bg-white shadow-sm">
        <div className="flex items-center gap-4 border-r border-gray-100 last:border-0 pr-4">
          <div className="w-20 h-20 rounded-full bg-green-50 flex-shrink-0 relative overflow-hidden">
            <Image src="/images/explore/home-delivery.png" alt="Free Shipping" fill className="object-cover" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Free Shipping</h4>
            <p className="text-xs text-gray-500">On all orders over ₹500</p>
          </div>
        </div>
        <div className="flex items-center gap-4 border-r border-gray-100 last:border-0 pr-4">
          <div className="w-20 h-20 rounded-full bg-orange-50 flex-shrink-0 relative overflow-hidden">
            <Image src="/images/explore/quality-tested.png" alt="Freshness" fill className="object-cover" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Freshness</h4>
            <p className="text-xs text-gray-500">100% Fresh Guarantee</p>
          </div>
        </div>
        <div className="flex items-center gap-4 border-r border-gray-100 last:border-0 pr-4">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex-shrink-0 relative overflow-hidden">
            <Image src="/images/explore/fair-pricing.png" alt="Smart Pricing" fill className="object-cover" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Smart Pricing</h4>
            <p className="text-xs text-gray-500">Best market rates</p>
          </div>
        </div>
        <div className="flex items-center gap-4 last:border-0 pr-4">
          <div className="w-20 h-20 rounded-full bg-purple-50 flex-shrink-0 relative overflow-hidden">
            <Image src="/images/explore/farming-partners.png" alt="Secure Payment" fill className="object-cover" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Secure Payment</h4>
            <p className="text-xs text-gray-500">100% Safe Transactions</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;