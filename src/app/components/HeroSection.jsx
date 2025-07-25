'use client';
import React from 'react';
import Image from 'next/image';
import { Smartphone } from 'lucide-react';

const Banner = () => {
  const handleClick = () => {
    window.location.href = 'https://play.google.com/store';
  };

  return (
    <div className="max-w-6xl mx-auto mt-20">
      {/* Desktop - Full Banner */}
      <div className="hidden md:block cursor-pointer p-8 rounded-lg">
        <Image
          src="/images/banner.png"
          alt="Special Offers"
          width={1200}
          height={400}
          className="w-full h-auto rounded-lg"
          priority
          onClick={handleClick}
        />
      </div>

      {/* Mobile - Half Banner Image + Text + Button */}
      <div className="md:hidden bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col">
          {/* Top Half: Banner Image */}
          <div className="h-70 overflow-hidden relative">
            <Image
              src="/images/products-banner.png"
              alt="Special Offers"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Bottom Half: Text Content */}
          <div className="p-5 text-center space-y-1">
            <h1 className="text-xl font-extrabold text-black">Free VIP Membership Trial!</h1>
            
            <div className="text-center space-y-2 pl-4">
              <p className="text-xl font-extrabold text-black">- Up to 40% Off!</p>
            </div>

            <p className="text-sm font-medium text-black">
              Instant delivery with no Fees.<br />
              No minimum order Required!
            </p>

            <button 
              onClick={handleClick}
              className="mt-4 bg-[#0F9D58] text-white px-6 py-2 rounded-lg font-bold flex items-center justify-center gap-2 mx-auto hover:bg-[#0b8043] transition-colors w-full max-w-xs"
            >
              <Smartphone className="w-4 h-4" />
              GET IT ON Google Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;