// 'use client'

// import { Truck, Calendar, BadgePercent, DownloadCloud, ShoppingCart } from 'lucide-react';

// export default function PopularProducts() {
//   return (
//     <section className="pt-10 pb-2 px-4 sm:px-5 bg-grey-100">
//       <div className="container mx-auto max-w-7xl bg-white rounded-lg shadow-md p-6 sm:p-8" id='about'>
//         <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-800 mb-8">Fresh Farm Deliveries Made Simple</h2>
        
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
//           {/* Left side - Text content with Lucide icons */}
//           <div className="space-y-6">
//             <p className="text-base sm:text-lg text-gray-800">
//               <span className="font-semibold">Lightning-fast delivery to your door.</span>
//             </p>

//             <p className="text-gray-600 text-sm sm:text-base">
//               We deliver fresh vegetables, dry fruits, leafy greens and other essentials directly from local farms.
//             </p>

//             <div className="space-y-4">
//               <div className="flex items-start gap-4">
//                 <DownloadCloud className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
//                 <div>
//                   <h3 className="font-semibold text-green-800">Easy App Download</h3>
//                   <p className="text-gray-600 text-sm">
//                     Download our app and start shopping fresh in just a few taps.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-4">
//                 <ShoppingCart className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
//                 <div>
//                   <h3 className="font-semibold text-green-800">Seamless Ordering</h3>
//                   <p className="text-gray-600 text-sm">
//                     Browse, select, and place your order effortlessly anytime, anywhere.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-4">
//                 <Truck className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
//                 <div>
//                   <h3 className="font-semibold text-green-800">Fast & Reliable Delivery</h3>
//                   <p className="text-gray-600 text-sm">
//                     Your orders delivered fresh and on time, right to your doorstep.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-4">
//                 <BadgePercent className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
//                 <div>
//                   <h3 className="font-semibold text-green-800">Recurring Order Subscription</h3>
//                   <p className="text-gray-600 text-sm">
//                     Get rewarded for consistency — enjoy amazing savings on every recurring order!  
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right side - Car-fit images with overlay text */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div className="relative min-w-[120px] h-32 sm:h-40 rounded-xl overflow-hidden group">
//               <img 
//                 src="/images/explore/fresh-vegetables.png" 
//                 alt="Fresh Vegetables" 
//                 className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
//               />
//               <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-4 text-center">
//                 <h3 className="font-bold text-white text-base sm:text-lg">Fresh Vegetables</h3>
//                 <p className="text-white/90 text-sm mt-1">Harvested Daily</p>
//               </div>
//             </div>
            
//             <div className="relative min-w-[120px] h-32 sm:h-40 rounded-xl overflow-hidden group">
//               <img 
//                 src="/images/explore/dry-fruits1.png" 
//                 alt="Dry Fruits" 
//                 className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
//               />
//               <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-4 text-center">
//                 <h3 className="font-bold text-white text-base sm:text-lg">Dry Fruits</h3>
//                 <p className="text-white/90 text-sm mt-1">Premium Quality</p>
//               </div>
//             </div>
            
//             <div className="relative min-w-[120px] h-32 sm:h-40 rounded-xl overflow-hidden group">
//               <img 
//                 src="/images/explore/leafy-green.png" 
//                 alt="Leafy Greens" 
//                 className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
//               />
//               <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-4 text-center">
//                 <h3 className="font-bold text-white text-base sm:text-lg">Leafy Greens</h3>
//                 <p className="text-white/90 text-sm mt-1">Nutrient Rich</p>
//               </div>
//             </div>
            
//             <div className="relative min-w-[120px] h-32 sm:h-40 rounded-xl overflow-hidden group">
//               <img 
//                 src="/images/explore/farm-fresh.png" 
//                 alt="Farm Fresh" 
//                 className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
//               />
//               <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-4 text-center">
//                 <h3 className="font-bold text-white text-base sm:text-lg">Farm Fresh</h3>
//                 <p className="text-white/90 text-sm mt-1">Quality Assured</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

'use client'

import { Truck, DownloadCloud, BadgePercent, ShoppingCart } from 'lucide-react';

export default function PopularProducts() {
  return (
    <section className="px-4 sm:px-6"> {/* Removed py-12 sm:py-16 */}
      {/* Custom width between 6xl and 7xl */}
      <div className="mx-auto max-w-6.5xl bg-green-50 rounded-3xl p-8 sm:p-12">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Fresh Farm Deliveries Made Simple
          </h2>
          <p className="text-gray-900 font-semibold text-lg mb-2">
            Lightning-fast delivery to your door
          </p>
          <p className="text-gray-600 text-base">
            We deliver fresh vegetables, dry fruits, leafy greens and other essentials directly from local farms.
          </p>
        </div>

        {/* 4 Icon Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Easy App Download */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                <DownloadCloud className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-2">Easy App Download</h3>
            <p className="text-gray-600 text-sm">
              Download our app and start shopping fresh in just a few taps
            </p>
          </div>

          {/* Seamless Ordering */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-2">Seamless Ordering</h3>
            <p className="text-gray-600 text-sm">
              Browse, select, and place your order effortlessly anytime, anywhere.
            </p>
          </div>

          {/* Fast & Reliable Delivery */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-2">Fast & Reliable Delivery</h3>
            <p className="text-gray-600 text-sm">
              Your orders delivered fresh and on time, right to your doorstep.
            </p>
          </div>

          {/* Recurring Order Subscription */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                <BadgePercent className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-2">Recurring Order Subscription</h3>
            <p className="text-gray-600 text-sm">
              Get rewarded for consistency — enjoy amazing savings on every recurring order!
            </p>
          </div>
        </div>

        {/* 4 Image Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Fresh Vegetables */}
          <div className="relative h-56 rounded-2xl overflow-hidden group cursor-pointer">
            <img
              src="/images/explore/fresh-vegetables.png"
              alt="Fresh Vegetables"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-center justify-end p-6 text-center">
              <h3 className="font-bold text-white text-lg mb-1">Fresh Vegetables</h3>
              <p className="text-white/90 text-sm">Harvested Daily</p>
            </div>
          </div>

          {/* Dry Fruits */}
          <div className="relative h-56 rounded-2xl overflow-hidden group cursor-pointer">
            <img
              src="/images/explore/dry-fruits1.png"
              alt="Dry Fruits"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-center justify-end p-6 text-center">
              <h3 className="font-bold text-white text-lg mb-1">Dry Fruits</h3>
              <p className="text-white/90 text-sm">Premium Quality</p>
            </div>
          </div>

          {/* Farm Fresh */}
          <div className="relative h-56 rounded-2xl overflow-hidden group cursor-pointer">
            <img
              src="/images/explore/farm-fresh.png"
              alt="Farm Fresh"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-center justify-end p-6 text-center">
              <h3 className="font-bold text-white text-lg mb-1">Farm Fresh</h3>
              <p className="text-white/90 text-sm">Quality Assured</p>
            </div>
          </div>

          {/* Leafy Greens */}
          <div className="relative h-56 rounded-2xl overflow-hidden group cursor-pointer">
            <img
              src="/images/explore/leafy-green.png"
              alt="Leafy Greens"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-center justify-end p-6 text-center">
              <h3 className="font-bold text-white text-lg mb-1">Leafy Greens</h3>
              <p className="text-white/90 text-sm">Nutrient Rich</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}