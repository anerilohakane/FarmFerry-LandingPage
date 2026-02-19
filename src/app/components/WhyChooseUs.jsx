'use client';
import React from 'react';
import Image from 'next/image';
import { PackageCheck, Leaf, Clock, Tag } from 'lucide-react';

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-green-600 font-bold tracking-wider text-sm uppercase">Why Choose Us</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Organic And Fresh</h2>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            We are dedicated to providing you with the freshest and most organic produce directly from the farm to your table.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between relative">

          {/* Left Features */}
          <div className="flex-1 space-y-12 md:pr-12 relative z-10">
            <div className="flex flex-row md:flex-row-reverse items-center gap-4 text-right md:text-right">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">Handmade Products</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Our products are carefully selected and handled with care to ensure premium quality.
                </p>
              </div>
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 shadow-sm shrink-0">
                <PackageCheck size={28} />
              </div>
            </div>

            <div className="flex flex-row md:flex-row-reverse items-center gap-4 text-right md:text-right">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">100% Natural</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Certified organic produce grown without harmful chemicals or pesticides.
                </p>
              </div>
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 shadow-sm shrink-0">
                <Leaf size={28} />
              </div>
            </div>
          </div>

          {/* Center Image */}
          <div className="w-full md:w-1/3 my-8 md:my-0 relative flex justify-center z-0">
            {/* Circle Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-green-50 rounded-full blur-3xl opacity-50"></div>

            <div className="relative w-[300px] h-[300px] md:w-[350px] md:h-[350px]">
              <Image
                src="/images/1(7).png"
                alt="Organic Veggies"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Right Features */}
          <div className="flex-1 space-y-12 md:pl-12 relative z-10">
            <div className="flex items-center gap-4 text-left">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 shadow-sm shrink-0">
                <Clock size={28} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">Fresh Daily</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Harvested every morning and delivered fresh to maintain nutritional value.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-left">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 shadow-sm shrink-0">
                <Tag size={28} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">Best Prices</h3>
                <p className="text-sm text-gray-500 mt-1">
                  High quality organic food at affordable market prices for everyone.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}