// 'use client'

// import { useState } from 'react'
// import { Mail, Phone, MapPin, Send, CheckCircle, ArrowRight } from 'lucide-react'

// export default function Contact() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     subject: '',
//     message: ''
//   })
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [isSubmitted, setIsSubmitted] = useState(false)
//   const [error, setError] = useState(null)

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setIsSubmitting(true)
//     setError(null)

//     try {
//       const res = await fetch('/api/contact', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData)
//       })

//       const result = await res.json()

//       if (!res.ok) {
//         throw new Error(result.message || 'Failed to send message')
//       }

//       if (result.success) {
//         setIsSubmitted(true)
//         setFormData({ 
//           name: '', 
//           email: '', 
//           phone: '',
//           subject: '',
//           message: '' 
//         })
//         setTimeout(() => setIsSubmitted(false), 3000)
//       } else {
//         throw new Error(result.message || 'Failed to send message')
//       }
//     } catch (error) {
//       console.error('Submit error:', error)
//       setError(error.message || 'Something went wrong. Please try again.')
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   const contactInfo = [
//     {
//       icon: Mail,
//       title: 'Email',
//       value: 'info@farmferry.in',
//       color: 'bg-white/90'
//     },
//     {
//       icon: Phone,
//       title: 'Phone',
//       value: '+91 8421539304',
//       color: 'bg-white/90'
//     },
//     {
//       icon: MapPin,
//       title: 'Address',
//       value: 'Sr. No 36/1/3, 3rd Floor Audumbar Nivya Near Canara Bank, Narhe gaon , Pune - 411041',
//       color: 'bg-white/90'
//     }
//   ]

//   return (
//     <section id="contact" className="relative py-8 px-4 sm:px-6 lg:px-8 bg-grey-100 overflow-hidden">
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-20 -right-20 w-48 sm:w-64 h-48 sm:h-64 bg-green-400/10 rounded-full filter blur-3xl"></div>
//         <div className="absolute bottom-0 left-0 w-48 sm:w-72 h-48 sm:h-72 bg-green-400/10 rounded-full filter blur-3xl"></div>
//       </div>

//       <div className="w-full mx-auto relative z-10">
//         <div className="text-center mb-12">
//           <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl font-bold text-gray-900 mb-6">
//             Let's <span className="text-green-800">Connect</span>
//           </h2>
//           <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
//             Partner with Farm Ferry to bring fresh produce to communities nationwide
//           </p>
//         </div>

//         {error && (
//           <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-lg text-center text-sm sm:text-base">
//             {error}
//           </div>
//         )}

//         <div className="grid lg:grid-cols-2 gap-8 items-start">
//           <div className="space-y-6">
//             <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
//               <span className="w-8 h-8 rounded-md bg-green-800 flex items-center justify-center text-white">
//                 <ArrowRight className="w-4 h-4" />
//               </span>
//               How to reach us
//             </h3>

//             <div className="grid gap-6">
//               {contactInfo.map((item, index) => (
//                 <div
//                   key={index}
//                   className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-transparent shadow-sm hover:shadow-lg transition-all duration-300"
//                 >
//                   <div className="flex items-start gap-4">
//                     <div className={`p-3 ${item.color} rounded-full text-green-600 shadow-md group-hover:scale-110 transition-transform`}>
//                       <item.icon className="w-5 h-5" />
//                     </div>
//                     <div>
//                       <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{item.title}</h4>
//                       <p className="text-gray-600 text-sm sm:text-base whitespace-pre-line">{item.value}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-100">
//               <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Business Hours</h4>
//               <p className="text-gray-600 mb-2 text-sm sm:text-base">Monday - Friday: 8am - 6pm</p>
//               <p className="text-gray-600 text-sm sm:text-base">Saturday: 9am - 2pm</p>
//               <p className="text-gray-600 text-sm sm:text-base">Sunday: Closed</p>
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
//             <div className="p-6 sm:p-8">
//               <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Partner with Farm Ferry</h3>

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
//                   <div>
//                     <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
//                     <input
//                       type="text"
//                       id="name"
//                       name="name"
//                       placeholder="Your name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 bg-gray-50 text-black border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-400 text-sm sm:text-base"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
//                     <input
//                       type="email"
//                       id="email"
//                       name="email"
//                       placeholder="your@email.com"
//                       value={formData.email}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 bg-gray-50 text-black border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-400 text-sm sm:text-base"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
//                   <input
//                     type="tel"
//                     id="phone"
//                     name="phone"
//                     placeholder="Your phone number"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 bg-gray-50 text-black border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-400 text-sm sm:text-base"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Interest *</label>
//                   <select
//                     id="subject"
//                     name="subject"
//                     value={formData.subject}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none text-gray-900 text-sm sm:text-base"
//                     required
//                   >
//                     <option value="" disabled className="text-gray-400">
//                       Select partnership type
//                     </option>
//                     <option value="Farm Supplier Partnership">Farm Supplier Partnership</option>
//                     <option value="Distribution Partnership">Distribution Partnership</option>
//                     <option value="Investor Inquiry">Investor Inquiry</option>
//                     <option value="Other Partnership Opportunity">Other Partnership Opportunity</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
//                   <textarea
//                     id="message"
//                     name="message"
//                     placeholder="Tell us about your farm or business..."
//                     value={formData.message}
//                     onChange={handleChange}
//                     rows="5"
//                     className="w-full px-4 py-3 bg-gray-50 text-black border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-400 resize-none text-sm sm:text-base"
//                     required
//                   ></textarea>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={isSubmitting || isSubmitted}
//                   className={`w-full py-3 sm:py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base ${
//                     isSubmitted
//                       ? 'bg-green-600 hover:bg-green-700'
//                       : isSubmitting
//                       ? 'bg-gray-500 cursor-not-allowed'
//                       : 'bg-green-800 hover:bg-green-900 shadow-md hover:shadow-lg'
//                   }`}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Sending...
//                     </>
//                   ) : isSubmitted ? (
//                     <>
//                       <CheckCircle className="w-5 h-5" />
//                       Message Sent!
//                     </>
//                   ) : (
//                     <>
//                       <Send className="w-5 h-5" />
//                       Send Inquiry
//                     </>
//                   )}
//                 </button>
//               </form>
//             </div>

//             <div className="bg-gray-50 px-6 sm:px-8 py-6 border-t border-gray-100">
//               <p className="text-sm text-gray-500 text-center">
//                 We'll get back to you within 24 hours. Your information is secure with us.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }


'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle, Instagram, Facebook, Twitter, Youtube } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    subject: false,
    message: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState(null)

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required'
        if (value.trim().length < 2) return 'Name must be at least 2 characters'
        if (value.trim().length > 50) return 'Name must be less than 50 characters'
        if (!/^[a-zA-Z\s]*$/.test(value)) return 'Name can only contain letters and spaces'
        return ''
      
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address'
        return ''
      
      case 'phone':
        if (!value.trim()) return 'Phone number is required'
        if (!/^[6-9]\d{9}$/.test(value.replace(/\D/g, ''))) return 'Please enter a valid 10-digit Indian phone number'
        return ''
      
      case 'subject':
        if (!value) return 'Please select a partnership type'
        return ''
      
      case 'message':
        if (!value.trim()) return 'Message is required'
        if (value.trim().length < 10) return 'Message must be at least 10 characters'
        // if (value.trim().length > 10) return 'Message must be less than 10 characters'
        return ''
      
      default:
        return ''
    }
  }

  const validateForm = () => {
    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      subject: validateField('subject', formData.subject),
      message: validateField('message', formData.message)
    }
    
    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error !== '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      phone: true,
      subject: true,
      message: true
    })

    // Validate form
    if (!validateForm()) {
      setError('Please fix the errors in the form')
      return
    }

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
        setTouched({
          name: false,
          email: false,
          phone: false,
          subject: false,
          message: false
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
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    // Validate field in real-time if it's been touched
    if (touched[name]) {
      setErrors({
        ...errors,
        [name]: validateField(name, value)
      })
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched({
      ...touched,
      [name]: true
    })
    
    // Validate the field when it loses focus
    setErrors({
      ...errors,
      [name]: validateField(name, formData[name])
    })
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '') // Remove non-digits
    let formattedValue = value
    
    // Format phone number for display
    if (value.length <= 3) {
      formattedValue = value
    } else if (value.length <= 6) {
      formattedValue = `${value.slice(0, 3)} ${value.slice(3)}`
    } else if (value.length <= 10) {
      formattedValue = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6)}`
    } else {
      formattedValue = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6, 10)}`
    }

    setFormData({
      ...formData,
      phone: formattedValue
    })

    if (touched.phone) {
      setErrors({
        ...errors,
        phone: validateField('phone', value)
      })
    }
  }

  return (
    <section id="contact" className="px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-lg text-center text-sm sm:text-base">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-12">
          <div className="grid lg:grid-cols-2">
            {/* Left Side - Contact Info */}
            <div className="p-8 lg:p-12 bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="h-full flex flex-col">
                <div className="flex-1">
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                    We Deliver Freshness –
                  </h2>
                  <h2 className="text-3xl lg:text-4xl font-bold text-green-600 mb-4">
                    Contact Us!
                  </h2>
                  <p className="text-gray-600 text-base mb-12">
                    Your daily essentials are just one call away!
                  </p>

                  <div className="space-y-6">
                    {/* Email */}
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <a href="mailto:info@farmferry.in" className="text-gray-700 hover:text-green-600 transition-colors">
                        info@farmferry.in
                      </a>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <a href="tel:+918421539304" className="text-gray-700 hover:text-green-600 transition-colors">
                        +91 8421539304
                      </a>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <p className="text-gray-700">
                        Sr. No 36/1/3, 3rd Floor Audumbar Nivya Near Canara Bank, Narhe gaon, Pune - 411041
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media Icons */}
                <div className="mt-12 flex items-center gap-4">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <Facebook className="w-5 h-5 text-white" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <Twitter className="w-5 h-5 text-white" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <Youtube className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="bg-white p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-8">Partner with Farm Ferry</h3>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 bg-gray-50 text-gray-900 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all placeholder-gray-400 ${
                        touched.name && errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {touched.name && errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 bg-gray-50 text-gray-900 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all placeholder-gray-400 ${
                        touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {touched.email && errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      onBlur={handleBlur}
                      maxLength="12"
                      className={`w-full px-4 py-3 bg-gray-50 text-gray-900 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all placeholder-gray-400 ${
                        touched.phone && errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {touched.phone && errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                  <div>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 bg-gray-50 text-gray-900 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all appearance-none ${
                        touched.subject && errors.subject ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="" disabled>
                        Select Partnership type
                      </option>
                      <option value="Farm Supplier Partnership">Farm Supplier Partnership</option>
                      <option value="Distribution Partnership">Distribution Partnership</option>
                      <option value="Investor Inquiry">Investor Inquiry</option>
                      <option value="Other Partnership Opportunity">Other Partnership Opportunity</option>
                    </select>
                    {touched.subject && errors.subject && (
                      <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                    )}
                  </div>
                </div>

                <div>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows="6"
                    className={`w-full px-4 py-3 bg-gray-50 text-gray-900 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all placeholder-gray-400 resize-none ${
                      touched.message && errors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  ></textarea>
                  {touched.message && errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                  )}
                  <div className="mt-1 text-sm text-gray-500 text-right">
                    {formData.message.length}/10
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    isSubmitted
                      ? 'bg-green-600 text-white'
                      : isSubmitting
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                      Send Inquiry
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}