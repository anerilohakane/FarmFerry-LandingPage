'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowRight } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.message || 'Failed to send message')
      }

      if (result.success) {
        setIsSubmitted(true)
        setFormData({ 
          name: '', 
          email: '', 
          phone: '',
          subject: '',
          message: '' 
        })
        setTimeout(() => setIsSubmitted(false), 3000)
      } else {
        throw new Error(result.message || 'Failed to send message')
      }
    } catch (error) {
      console.error('Submit error:', error)
      setError(error.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'farm.ferry.225@gmail.com',
      color: 'bg-white/90'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+91 8421539304',
      color: 'bg-white/90'
    },
    {
      icon: MapPin,
      title: 'Address',
      value: 'Sr. No 36/1/3, 3rd Floor Audumbar Nivya Near Canara Bank, Narhe gaon , Pune - 411041',
      color: 'bg-white/90'
    }
  ]

  return (
    <section id="contact" className="relative py-5 px-4 sm:px-6 lg:px-20 bg-grey-100 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-400/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-green-400/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-3xl font-bold text-gray-900 mb-6">
            Let's <span className="text-green-800">Connect</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Partner with Farm Ferry to bring fresh produce to communities nationwide
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-md bg-green-800 flex items-center justify-center text-white">
                <ArrowRight className="w-4 h-4" />
              </span>
              How to reach us
            </h3>

            <div className="grid gap-6">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-transparent shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 ${item.color} rounded-full text-green-600 shadow-md group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600 whitespace-pre-line">{item.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Business Hours</h4>
              <p className="text-gray-600 mb-2">Monday - Friday: 8am - 6pm</p>
              <p className="text-gray-600">Saturday: 9am - 2pm</p>
              <p className="text-gray-600">Sunday: Closed</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 sm:p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Partner with Farm Ferry</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 text-black border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 text-black border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 text-black border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Interest *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none text-gray-900"
                    required
                  >
                    <option value="" disabled className="text-gray-400">
                      Select partnership type
                    </option>
                    <option value="Farm Supplier Partnership">Farm Supplier Partnership</option>
                    <option value="Distribution Partnership">Distribution Partnership</option>
                    <option value="Investor Inquiry">Investor Inquiry</option>
                    <option value="Other Partnership Opportunity">Other Partnership Opportunity</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your farm or business..."
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-3 bg-gray-50 text-black border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-400 resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                    isSubmitted
                      ? 'bg-green-600 hover:bg-green-700'
                      : isSubmitting
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-green-800 hover:bg-green-900 shadow-md hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : isSubmitted ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Inquiry
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 text-center">
                We'll get back to you within 24 hours. Your information is secure with us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}