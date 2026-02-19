// 'use client'

// import { Truck, Leaf, ShieldCheck } from 'lucide-react';

// export default function FarmToHome() {
//   return (
//     <section id="about-us" className="pt-10 pb-10 px-4 sm:px-5 bg-grey-50">
//       <div className="container mx-auto max-w-7xl">
//         <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-800 mb-12">
//           Farm to Home, Every Day Online Groceries Delivery
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {/* Farm Fresh Card */}
//           <div className="relative min-w-[150px] h-48 sm:h-64 rounded-xl overflow-hidden group">
//             <img 
//               src="/images/explore/fresh-vege.png" 
//               alt="Farm Fresh Products" 
//               className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
//             />
//             <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-6 text-center">
//               <div className="bg-green-100/90 p-3 rounded-full mb-4">
//                 <Leaf className="w-8 h-8 text-green-600" />
//               </div>
//               <h3 className="font-bold text-white text-lg sm:text-xl mb-2">Farm Fresh Products</h3>
//               <p className="text-white/90 text-sm">
//                 We source fresh produce directly from organic farms
//               </p>
//             </div>
//           </div>

//           {/* Quality Tested Card */}
//           <div className="relative min-w-[150px] h-48 sm:h-64 rounded-xl overflow-hidden group">
//             <img 
//               src="/images/explore/quality-tested.png" 
//               alt="Quality Tested" 
//               className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
//             />
//             <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-6 text-center">
//               <div className="bg-green-100/90 p-3 rounded-full mb-4">
//                 <ShieldCheck className="w-8 h-8 text-green-600" />
//               </div>
//               <h3 className="font-bold text-white text-lg sm:text-xl mb-2">Quality Tested</h3>
//               <p className="text-white/90 text-sm">
//                 Rigorous testing for 100+ common adulterants
//               </p>
//             </div>
//           </div>

//           {/* Home Delivery Card */}
//           <div className="relative min-w-[150px] h-48 sm:h-64 rounded-xl overflow-hidden group">
//             <img 
//               src="/images/explore/home-delivery.png" 
//               alt="Home Delivery" 
//               className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
//             />
//             <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-6 text-center">
//               <div className="bg-green-100/90 p-3 rounded-full mb-4">
//                 <Truck className="w-8 h-8 text-green-600" />
//               </div>
//               <h3 className="font-bold text-white text-lg sm:text-xl mb-2">Home Delivery</h3>
//               <p className="text-white/90 text-sm">
//                 Fresh at your doorstep every morning
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


'use client'

import { Truck, Leaf, ShieldCheck, Handshake, Sprout, Package, DollarSign } from 'lucide-react';

export default function FarmToHome() {
  return (
    <section id="about-us" className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        {/* Main Heading */}
        <div className="mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Farm to Home, Every Day Online Groceries Delivery
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-3xl">
            "From our farm to your home — fresh, healthy, and delivered with care every day!"
          </p>
        </div>

        {/* Top 3 Cards Section - Removed mb-16 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Farm Fresh Products Card */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="h-48 overflow-hidden">
              <img
                src="/images/1.png"
                alt="Farm Fresh Products"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="font-bold text-gray-900 text-lg mb-2">Farm Fresh Products</h3>
              <p className="text-gray-600 text-sm">
                We source fresh produce directly from organic farms
              </p>
            </div>
          </div>

          {/* Quality Tested Card */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="h-48 overflow-hidden">
              <img
                src="/images/2.png"
                alt="Quality Tested"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="font-bold text-gray-900 text-lg mb-2">Quality Tested</h3>
              <p className="text-gray-600 text-sm">
                Rigorous testing for 100+ common adulterants
              </p>
            </div>
          </div>

          {/* Home Delivery Card */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="h-48 overflow-hidden">
              <img
                src="/images/3.png"
                alt="Home Delivery"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="font-bold text-gray-900 text-lg mb-2">Home Delivery</h3>
              <p className="text-gray-600 text-sm">
                Fresh at your doorstep every morning
              </p>
            </div>
          </div>
        </div>

        {/* Second Section - Natural & Fresh */}
        <div className="mb-8 mt-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            We are bringing Natural & Fresh back
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-5xl">
            Better everyday health begins with the basics. We source Milk, Groceries, Fruits, Yogurts, Eggs, vegetables and all other essentials fresh from the best farms in India.
          </p>
        </div>

        {/* Bottom 4 Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Ethically Sourced Produce */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="h-48 overflow-hidden">
              <img
                src="/images/4.png"
                alt="Ethically Sourced Produce"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="font-bold text-gray-900 text-base mb-2">Ethically Sourced Produce</h3>
              <p className="text-gray-600 text-sm">
                Supporting local Indian farmers
              </p>
            </div>
          </div>

          {/* Sustainable Farming Partners */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="h-48 overflow-hidden">
              <img
                src="/images/4.png"
                alt="Sustainable Farming Partners"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="font-bold text-gray-900 text-base mb-2">Sustainable Farming Partners</h3>
              <p className="text-gray-600 text-sm">
                Backed by eco-conscious practices
              </p>
            </div>
          </div>

          {/* Packed for You! */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="h-48 overflow-hidden">
              <img
                src="/images/4.png"
                alt="Packed for You"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="font-bold text-gray-900 text-base mb-2">Packed for You!</h3>
              <p className="text-gray-600 text-sm">
                Your groceries are carefully packed with freshness, ready to reach your doorstep!
              </p>
            </div>
          </div>

          {/* Fair Pricing for Farmers */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="h-48 overflow-hidden">
              <img
                src="/images/5.png"
                alt="Fair Pricing for Farmers"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="font-bold text-gray-900 text-base mb-2">Fair Pricing for Farmers</h3>
              <p className="text-gray-600 text-sm">
                Every rupee supports rural livelihoods
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}