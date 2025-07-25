'use client'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 pt-16 pb-8" id='contact'>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand info and socials - always full width on mobile */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-green-500 mb-4">
              Farm<span className="text-yellow-500">Ferry</span>
            </h3>
            <p className="mb-4">
              Delivering farm-fresh groceries directly to your doorstep.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Categories and Quick Links - side by side on small screens, stacked on medium+ */}
          <div className="grid grid-cols-2 gap-8 md:col-span-1">
            <div>
              <h4 className="text-white font-semibold mb-4">Categories</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-green-500 transition-colors">Vegetables</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Spices</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Dry Fruits</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Groceries</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Organic</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-green-500 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">FAQ</a></li>
                <li><a href="/terms" className="hover:text-green-500 transition-colors">Terms & Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Contact Info - always full width on mobile */}
          <div className="md:col-span-1">
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 mt-1 flex-shrink-0 text-green-500" />
                <span>Sr. No 36/1/3, 3rd Floor Audumbar Nivya Near Canara Bank, Narhe gaon , Pune - 411041</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 flex-shrink-0 text-green-500" />
                <span>+91 8421539304</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 flex-shrink-0 text-green-500" />
                <span>farm.ferry.225@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0">
              © {new Date().getFullYear()} FarmFerry. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}