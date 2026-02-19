'use client'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { apiService } from '../../utils/api'

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8" id='contact'>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* 1. Brand info and socials */}
          <div className="w-full">
            <h3 className="text-2xl font-bold text-green-500 mb-4 flex items-center gap-2">
              <img src="/images/farmferry-logo.png" alt="Logo" className="w-8 h-8 rounded-full" />
              Farm<span className="text-white">Ferry</span>
            </h3>
            <p className="mb-6 text-sm text-gray-400 leading-relaxed">
              Maecenas mi justo, interdum at consectetur vel, tristique et arcu. Ut quis eros blandit, ultrices diam in, elementum ex.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"><Facebook size={16} /></a>
              <a href="#" className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"><Twitter size={16} /></a>
              <a href="#" className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"><Instagram size={16} /></a>
              <a href="#" className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"><Youtube size={16} /></a>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="w-full">
            <h4 className="text-white font-semibold mb-6 text-lg relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-12 after:h-0.5 after:bg-green-500">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="/#about" className="hover:text-green-500 transition-colors flex items-center gap-2"><ArrowRight size={14} /> About Us</a></li>
              <li><a href="/contact" className="hover:text-green-500 transition-colors flex items-center gap-2"><ArrowRight size={14} /> Contact Us</a></li>
              <li><a href="/products" className="hover:text-green-500 transition-colors flex items-center gap-2"><ArrowRight size={14} /> Shop Now</a></li>
              <li><a href="/privacy" className="hover:text-green-500 transition-colors flex items-center gap-2"><ArrowRight size={14} /> Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-green-500 transition-colors flex items-center gap-2"><ArrowRight size={14} /> Terms & Condition</a></li>
            </ul>
            <h4 className="text-white font-semibold mt-8 mb-4 text-sm">Download App</h4>
            <div className="flex gap-2">
              <div className="w-24 h-8 bg-gray-800 rounded border border-gray-700 flex items-center justify-center text-[10px] text-gray-400 cursor-pointer hover:bg-gray-700">App Store</div>
              <div className="w-24 h-8 bg-gray-800 rounded border border-gray-700 flex items-center justify-center text-[10px] text-gray-400 cursor-pointer hover:bg-gray-700">Google Play</div>
            </div>
          </div>

          {/* 3. Top Rated */}


          {/* 4. Top Selling */}


          {/* 5. Contact & Newsletter */}
          <div className="w-full">
            <h4 className="text-white font-semibold mb-6 text-lg relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-12 after:h-0.5 after:bg-green-500">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-400 mb-6">
              <li className="flex items-start">
                <MapPin size={20} className="mr-3 mt-1 flex-shrink-0 text-green-500" />
                <span>Sr. No 36/1/3, 3rd Floor Audumbar Nivya Near Canara Bank, Narhe gaon, Pune - 411041</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-3 flex-shrink-0 text-green-500" />
                <span>+91 8421539304</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-3 flex-shrink-0 text-green-500" />
                <span>info@farmferry.in</span>
              </li>
            </ul>

            <h5 className="text-white font-semibold mb-3 text-sm">Subscribe Our Newsletter</h5>
            <div className="flex">
              <input type="email" placeholder="Enter Email" className="bg-gray-800 text-white rounded-l-md px-3 py-2 w-full focus:outline-none border border-gray-700 text-sm focus:border-green-500" />
              <button className="bg-green-600 text-white px-3 py-2 rounded-r-md hover:bg-green-700">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="mb-4 sm:mb-0 text-sm text-gray-500">
              © {new Date().getFullYear()} FarmFerry. All rights reserved.
            </p>
            <div className="flex gap-4">
              <img src="/images/payment_methods.png" alt="Payments" className="h-6 object-contain opacity-50" />
              {/* Placeholder for payment methods if needed */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}