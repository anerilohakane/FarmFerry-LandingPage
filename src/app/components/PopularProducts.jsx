'use client'

import { Truck, Calendar, BadgePercent, DownloadCloud, ShoppingCart } from 'lucide-react';

export default function PopularProducts() {
  return (
    <section className="pt-10 pb-2 px-5 bg-grey-100">
      <div className="container mx-auto max-w-5xl bg-white rounded-lg shadow-md p-8" id='about'>
        <h2 className="text-3xl font-bold text-center text-green-800 mb-8">Fresh Farm Deliveries Made Simple</h2>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Text content with Lucide icons */}
          <div className="space-y-6">
            <p className="text-lg text-gray-800">
              <span className="font-semibold">Order by midnight</span> for next morning delivery
            </p>

            <p className="text-gray-600">
              We deliver fresh vegetables, dry fruits, leafy greens and other essentials directly from local farms.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <DownloadCloud className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-800">Easy App Download</h3>
                  <p className="text-gray-600 text-sm">
                    Download our app and start shopping fresh in just a few taps.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <ShoppingCart className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-800">Seamless Ordering</h3>
                  <p className="text-gray-600 text-sm">
                    Browse, select, and place your order effortlessly anytime, anywhere.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Truck className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-800">Fast & Reliable Delivery</h3>
                  <p className="text-gray-600 text-sm">
                    Your orders delivered fresh and on time, right to your doorstep.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <BadgePercent className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-800">Recurring Order Subscription</h3>
                  <p className="text-gray-600 text-sm">
                    Get rewarded for consistency — enjoy amazing savings on every recurring order!  
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Car-fit images with overlay text */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-40 rounded-xl overflow-hidden group">
              <img 
                src="/images/explore/fresh-vegetables.png" 
                alt="Fresh Vegetables" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-4 text-center">
                <h3 className="font-bold text-white text-lg">Fresh Vegetables</h3>
                <p className="text-white/90 text-sm mt-1">Harvested Daily</p>
              </div>
            </div>
            
            <div className="relative h-40 rounded-xl overflow-hidden group">
              <img 
                src="/images/explore/dry-fruits1.png" 
                alt="Dry Fruits" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-4 text-center">
                <h3 className="font-bold text-white text-lg">Dry Fruits</h3>
                <p className="text-white/90 text-sm mt-1">Premium Quality</p>
              </div>
            </div>
            
            <div className="relative h-40 rounded-xl overflow-hidden group">
              <img 
                src="/images/explore/leafy-green.png" 
                alt="Leafy Greens" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-4 text-center">
                <h3 className="font-bold text-white text-lg">Leafy Greens</h3>
                <p className="text-white/90 text-sm mt-1">Nutrient Rich</p>
              </div>
            </div>
            
            <div className="relative h-40 rounded-xl overflow-hidden group">
              <img 
                src="/images/explore/farm-fresh.png" 
                alt="Farm Fresh" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-4 text-center">
                <h3 className="font-bold text-white text-lg">Farm Fresh</h3>
                <p className="text-white/90 text-sm mt-1">Quality Assured</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}