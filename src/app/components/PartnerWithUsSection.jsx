'use client';
import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

export default function PartnerWithUsSection() {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        phone: '',
        partnershipType: 'Select Partnership type',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Basic validation - Removed strict partnershipType check
        if (!formData.name || !formData.email || !formData.message) {
            alert('Please fill in your name, email, and message.');
            setIsSubmitting(false);
            return;
        }

        try {
            // Prepare data - if partnership type is default, send default or change to "General Inquiry"
            const submissionData = {
                ...formData,
                partnershipType: formData.partnershipType === 'Select Partnership type' ? 'General Inquiry' : formData.partnershipType
            };

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                console.log('Enquiry sent successfully. Customer Info:', submissionData);
                alert('Enquiry sent successfully');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    partnershipType: 'Select Partnership type',
                    message: ''
                });
            } else {
                alert(result.message || 'Failed to send inquiry. Please try again.');
            }
        } catch (error) {
            console.error('Error sending inquiry:', error);
            alert('An error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col lg:flex-row gap-8">

                {/* Left Side: Contact Info */}
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-[#0B1C39] mb-1">
                            We Deliver Freshness –
                        </h2>
                        <h2 className="text-3xl font-bold text-green-600 mb-2">
                            Contact Us!
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Your daily essentials are just one call away!
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-green-200">
                                    <Mail size={20} />
                                </div>
                                <span className="text-gray-600 font-medium">info@farmferry.in</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-green-200">
                                    <Phone size={20} />
                                </div>
                                <span className="text-gray-600 font-medium">+91 8421539304</span>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-green-200">
                                    <MapPin size={20} />
                                </div>
                                <span className="text-gray-600 font-medium pt-2 max-w-xs">
                                    Sr. No 36/1/3, 3rd Floor Audumbar Nivya Near Canara Bank, Narhe gaon, Pune - 411041
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                        <a href="#" className="w-10 h-10 rounded-full bg-[#0B1C39] flex items-center justify-center text-white hover:bg-green-600 transition-colors">
                            <Instagram size={18} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-[#0B1C39] flex items-center justify-center text-white hover:bg-green-600 transition-colors">
                            <Facebook size={18} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-[#0B1C39] flex items-center justify-center text-white hover:bg-green-600 transition-colors">
                            <Twitter size={18} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-[#0B1C39] flex items-center justify-center text-white hover:bg-green-600 transition-colors">
                            <Youtube size={18} />
                        </a>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#0B1C39] mb-6">Partner with Farm Ferry</h3>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 placeholder-gray-400"
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 placeholder-gray-400"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 placeholder-gray-400"
                            />
                            <div className="relative">
                                <select
                                    name="partnershipType"
                                    value={formData.partnershipType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border-2 border-gray-900 focus:outline-none focus:ring-0 text-gray-700 appearance-none font-medium"
                                >
                                    <option>Select Partnership type</option>
                                    <option value="Vendor">Vendor</option>
                                    <option value="Delivery Partner">Delivery Partner</option>
                                </select>
                            </div>
                        </div>

                        <div className="relative">
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Message"
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 placeholder-gray-400 resize-none"
                            ></textarea>
                            <span className="absolute bottom-3 right-4 text-xs text-gray-400">{formData.message.length}/500</span>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-all transform hover:scale-[1.01] shadow-lg shadow-green-200/50 flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
