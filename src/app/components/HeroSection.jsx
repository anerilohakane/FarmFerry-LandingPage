'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Smartphone } from 'lucide-react';

const Banner = () => {
  const images = [
    '/images/banner.png',
    '/images/Hero Banner 2.png',
    '/images/Hero Banner 3.png',
    '/images/Hero Banner 4.png',
    '/images/Hero Banner 5.png',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-scroll every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 30000); // 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [images.length]);

  const handleClick = () => {
    window.location.href = 'https://play.google.com/store';
  };

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-6 sm:mt-8 md:mt-12 lg:mt-16 px-2 sm:px-4 md:px-6 lg:px-8">
      {/* Desktop - Full Banner Carousel */}
      <div className="hidden md:block cursor-pointer p-2 sm:p-4 md:p-6 lg:p-8 rounded-xl">
        <div className="relative w-full aspect-[3/1] max-h-[450px] min-h-[300px] overflow-hidden rounded-xl">
          {images.map((src, index) => (
            <Image
              key={index}
              src={src}
              alt={`Special Offer ${index + 1}`}
              fill
              className={`object-cover absolute top-0 left-0 transition-all duration-1000 ease-in-out ${
                index === currentImageIndex
                  ? 'opacity-100 transform scale-100 translate-x-0 shadow-lg'
                  : 'opacity-0 transform scale-105 translate-x-10'
              }`}
              priority={index === 0} // Priority for first image only
              onClick={handleClick}
            />
          ))}
          {/* Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  currentImageIndex === index ? 'bg-white scale-125 shadow-md' : 'bg-gray-400 opacity-70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile - Half Banner Image + Text + Button */}
      <div className="md:hidden bg-white rounded-xl shadow-sm overflow-hidden mt-6 sm:mt-8">
        <div className="flex flex-col">
          {/* Top Half: Banner Image Carousel */}
          <div className="relative w-full aspect-[3/2] max-h-[280px] min-h-[120px] overflow-hidden pt-4 sm:pt-6">
            {images.map((src, index) => (
              <Image
                key={index}
                src={src}
                alt={`Special Offer ${index + 1}`}
                fill
                className={`object-contain absolute top-0 left-0 transition-all duration-1000 ease-in-out ${
                  index === currentImageIndex
                    ? 'opacity-100 transform scale-100 translate-x-0 shadow-md'
                    : 'opacity-0 transform scale-105 translate-x-10'
                }`}
                priority={index === 0} // Priority for first image only
              />
            ))}
            {/* Navigation Dots */}
            <div className="absolute bottom-1 sm:bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                    currentImageIndex === index ? 'bg-white scale-125 shadow-md' : 'bg-gray-400 opacity-70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Bottom Half: Text Content */}
          <div className="p-2 sm:p-3 md:p-4 text-center space-y-1 sm:space-y-2">
            <h1 className="text-sm sm:text-base md:text-lg font-extrabold text-black">Free VIP Membership Trial!</h1>
            
            <div className="text-center space-y-1 pl-0 sm:pl-2">
              <p className="text-sm sm:text-base md:text-lg font-extrabold text-black">- Up to 40% Off!</p>
            </div>

            <p className="text-[10px] sm:text-xs md:text-sm font-medium text-black">
              Instant delivery with no Fees.<br />
              No minimum order Required!
            </p>

            <button 
              onClick={handleClick}
              className="mt-1 sm:mt-2 md:mt-3 bg-[#0F9D58] text-white px-2 sm:px-3 md:px-5 py-1 sm:py-1.5 rounded-lg font-bold flex items-center justify-center gap-1 sm:gap-2 mx-auto hover:bg-[#0b8043] transition-colors w-full max-w-[90%] sm:max-w-[80%] md:max-w-xs shadow-md hover:shadow-lg text-xs sm:text-sm"
            >
              <Smartphone className="w-3 h-3 sm:w-4 sm:h-4" />
              GET IT ON Google Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;