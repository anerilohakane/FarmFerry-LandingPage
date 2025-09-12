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
    }, 3000); // 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [images.length]);

  const handleClick = () => {
    window.location.href = 'https://play.google.com/store';
  };

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
      {/* Desktop - Full Banner Carousel */}
      <div className="hidden md:block cursor-pointer p-4 sm:p-6 lg:p-8 rounded-lg">
        <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
          {images.map((src, index) => (
            <Image
              key={index}
              src={src}
              alt={`Special Offer ${index + 1}`}
              fill
              className={`object-cover w-full h-full absolute top-0 left-0 transition-all duration-1000 ease-in-out ${
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
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentImageIndex === index ? 'bg-white scale-125 shadow-md' : 'bg-gray-400 opacity-70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile - Half Banner Image + Text + Button */}
      <div className="md:hidden bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col">
          {/* Top Half: Banner Image Carousel */}
          <div className="relative h-48 sm:h-64 md:h-70 w-full overflow-hidden">
            {images.map((src, index) => (
              <Image
                key={index}
                src={src}
                alt={`Special Offer ${index + 1}`}
                fill
                className={`object-cover absolute top-0 left-0 transition-all duration-1000 ease-in-out ${
                  index === currentImageIndex
                    ? 'opacity-100 transform scale-100 translate-x-0 shadow-md'
                    : 'opacity-0 transform scale-105 translate-x-10'
                }`}
                priority={index === 0} // Priority for first image only
              />
            ))}
            {/* Navigation Dots */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentImageIndex === index ? 'bg-white scale-125 shadow-md' : 'bg-gray-400 opacity-70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Bottom Half: Text Content */}
          <div className="p-4 sm:p-5 text-center space-y-2 sm:space-y-3">
            <h1 className="text-lg sm:text-xl font-extrabold text-black">Free VIP Membership Trial!</h1>
            
            <div className="text-center space-y-2 pl-0 sm:pl-4">
              <p className="text-lg sm:text-xl font-extrabold text-black">- Up to 40% Off!</p>
            </div>

            <p className="text-xs sm:text-sm font-medium text-black">
              Instant delivery with no Fees.<br />
              No minimum order Required!
            </p>

            <button 
              onClick={handleClick}
              className="mt-3 sm:mt-4 bg-[#0F9D58] text-white px-4 sm:px-6 py-2 rounded-lg font-bold flex items-center justify-center gap-2 mx-auto hover:bg-[#0b8043] transition-colors w-full max-w-xs sm:max-w-sm shadow-md hover:shadow-lg"
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