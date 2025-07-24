'use client'

import { Sprout, PackageCheck, Leaf, HandCoins } from 'lucide-react';

export default function FreshProducts() {
  return (
    <section className="pt-10 pb-10 px-5 bg-grey-100">
      <div className="container mx-auto max-w-5xl bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-6">
          We are bringing Natural & Fresh back
        </h1>
        
        <p className="text-lg text-gray-700 text-center mb-12 max-w-3xl mx-auto">
          Better everyday health begins with the basics. We source Milk, Groceries, Fruits, Yogurts, Eggs, vegetables and all other essentials fresh from the best farms in India.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Ethically Sourced Produce Card */}
          <div className="relative h-60 rounded-xl overflow-hidden group">
            <img 
              src="/images/explore/ethically-sourced.png" 
              alt="Ethically Sourced Produce" 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-4 text-center">
              <div className="bg-white/90 p-3 rounded-full mb-3">
                <Sprout className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Ethically Sourced Produce</h3>
              <p className="text-white/90 text-sm">
                Supporting local Indian farmers
              </p>
            </div>
          </div>

          {/* Plastic-Free Packaging Card */}
          <div className="relative h-60 rounded-xl overflow-hidden group">
            <img 
              src="/images/explore/plasitc-free.png" 
              alt="Plastic-Free Packaging" 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-4 text-center">
              <div className="bg-white/90 p-3 rounded-full mb-3">
                <PackageCheck className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Plastic-Free Packaging</h3>
              <p className="text-white/90 text-sm">
                Better for your health and the planet
              </p>
            </div>
          </div>

          {/* Sustainable Farming Partners Card */}
          <div className="relative h-60 rounded-xl overflow-hidden group">
            <img 
              src="/images/explore/farming-partners.png" 
              alt="Sustainable Farming Partners" 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-4 text-center">
              <div className="bg-white/90 p-3 rounded-full mb-3">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Sustainable Farming Partners</h3>
              <p className="text-white/90 text-sm">
                Backed by eco-conscious practices
              </p>
            </div>
          </div>

          {/* Fair Pricing for Farmers Card */}
          <div className="relative h-60 rounded-xl overflow-hidden group">
            <img 
              src="/images/explore/fair-pricing.png" 
              alt="Fair Pricing for Farmers" 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-4 text-center">
              <div className="bg-white/90 p-3 rounded-full mb-3">
                <HandCoins className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Fair Pricing for Farmers</h3>
              <p className="text-white/90 text-sm">
                Every rupee supports rural livelihoods
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}