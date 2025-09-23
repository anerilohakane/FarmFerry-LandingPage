'use client'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Home, Box, Info, Users, PhoneCall } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { apiService } from '../../utils/api'

export default function Footer() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch root categories (parent = null)
      const response = await apiService.getAllCategories({
        parent: 'null',
        includeInactive: 'false'
      })
      
      if (response.success) {
        setCategories(response.data.categories)
      } else {
        setError('Failed to fetch categories')
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setError('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (category) => {
    // Navigate to products page with category parameter
    window.location.href = `/products?category=${encodeURIComponent(category.name)}&categoryId=${category._id}&showAll=true`
  }

  const scrollToSection = (sectionId) => {
    if (pathname !== '/') {
      if (sectionId === 'home') {
        router.push('/')
      } else {
        router.push(`/#${sectionId}`)
      }
      return
    }

    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const element = document.getElementById(sectionId)
    if (element) {
      const headerHeight = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'products', label: 'Products', icon: Box },
    { id: 'about', label: 'How it works', icon: Info },
    { id: 'about-us', label: 'About us', icon: Users },
    { id: 'contact', label: 'Contact', icon: PhoneCall }
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8" id='contact'>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand info and socials */}
          <div className="w-full">
            <h3 className="text-2xl font-bold text-green-500 mb-4">
              Farm<span className="text-yellow-500">Ferry</span>
            </h3>
            <p className="mb-4 text-sm sm:text-base">
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

          {/* Navigation Links */}
          <div className="w-full">
            <h4 className="text-white font-semibold mb-4 text-base sm:text-lg">Navigation</h4>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="hover:text-green-500 transition-colors text-left w-full text-sm sm:text-base flex items-center gap-2"
                  >
                    <item.icon size={16} />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="w-full">
            <h4 className="text-white font-semibold mb-4 text-base sm:text-lg">Categories</h4>
            {!isMounted || loading ? (
              <ul className="space-y-2">
                {[...Array(5)].map((_, index) => (
                  <li key={index}>
                    <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                  </li>
                ))}
              </ul>
            ) : error ? (
              <ul className="space-y-2">
                <li className="text-red-400 text-sm">Failed to load categories</li>
              </ul>
            ) : (
              <ul className="space-y-2">
                {categories.slice(0, 5).map((category) => (
                  <li key={category._id}>
                    <button
                      onClick={() => handleCategoryClick(category)}
                      className="hover:text-green-500 transition-colors text-left w-full text-sm sm:text-base"
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Contact Info */}
          <div className="w-full">
            <h4 className="text-white font-semibold mb-4 text-base sm:text-lg">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 mt-1 flex-shrink-0 text-green-500" />
                <span className="text-sm sm:text-base">Sr. No 36/1/3, 3rd Floor Audumbar Nivya Near Canara Bank, Narhe gaon, Pune - 411041</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 flex-shrink-0 text-green-500" />
                <span className="text-sm sm:text-base">+91 8421539304</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 flex-shrink-0 text-green-500" />
                <span className="text-sm sm:text-base">info@farmferry.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
          {/* Quick Links */}
          <div className="w-full">
            <h4 className="text-white font-semibold mb-4 text-base sm:text-lg">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/terms" className="hover:text-green-500 transition-colors text-sm sm:text-base">Terms & Conditions</a></li>
              <li><a href="/privacy" className="hover:text-green-500 transition-colors text-sm sm:text-base">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="mb-4 sm:mb-0 text-sm sm:text-base">
              © {new Date().getFullYear()} FarmFerry. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}