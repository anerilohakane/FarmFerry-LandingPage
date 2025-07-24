'use client'

import { Truck, Leaf, ShieldCheck } from 'lucide-react';

export default function FarmToHome() {
  return (
    <section id="about-us" className="pt-10 pb-10 px-5 bg-grey-50">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
          Farm to Home, Every Day Online Groceries Delivery
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Farm Fresh Card */}
          <div className="relative h-64 rounded-xl overflow-hidden group">
            <img 
              src="/images/explore/fresh-vege.png" 
              alt="Farm Fresh Products" 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-green-100/90 p-3 rounded-full mb-4">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-white text-xl mb-2">Farm Fresh Products</h3>
              <p className="text-white/90">
                We source fresh produce directly from organic farms
              </p>
            </div>
          </div>
          
          {/* Quality Tested Card */}
          <div className="relative h-64 rounded-xl overflow-hidden group">
            <img 
              src="/images/explore/quality-tested.png" 
              alt="Quality Tested" 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-green-100/90 p-3 rounded-full mb-4">
                <ShieldCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-white text-xl mb-2">Quality Tested</h3>
              <p className="text-white/90">
                Rigorous testing for 100+ common adulterants
              </p>
            </div>
          </div>
          
          {/* Home Delivery Card */}
          <div className="relative h-64 rounded-xl overflow-hidden group">
            <img 
              src="/images/explore/home-delivery.png" 
              alt="Home Delivery" 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-green-100/90 p-3 rounded-full mb-4">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-white text-xl mb-2">Home Delivery</h3>
              <p className="text-white/90">
                Fresh at your doorstep every morning
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}