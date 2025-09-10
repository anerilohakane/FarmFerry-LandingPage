'use client';

import { useState } from 'react';

const FarmFerryFAQ = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const faqData = {
    categories: [
      { id: 'ordering', name: 'Ordering & Products' },
      { id: 'delivery', name: 'Delivery & Tracking' },
      { id: 'payments', name: 'Payments & Pricing' },
      { id: 'account', name: 'Account & Technical' },
      { id: 'returns', name: 'Returns & Refunds' }
    ],
    items: [
      {
        id: 1,
        question: 'How do I place an order on FarmFerry?',
        answer: 'To place an order, simply browse our categories, add products to your cart, and proceed to checkout. You\'ll need to create an account or sign in to complete your purchase.',
        category: 'ordering'
      },
      {
        id: 2,
        question: 'What are FarmFerry\'s delivery hours?',
        answer: 'We deliver from 8 AM to 10 PM daily, including weekends. Same-day delivery is available for orders placed before 2 PM.',
        category: 'delivery'
      },
      {
        id: 3,
        question: 'What payment methods do you accept?',
        answer: 'We accept credit/debit cards, UPI, net banking, and cash on delivery. All online payments are securely processed.',
        category: 'payments'
      },
      {
        id: 4,
        question: 'How can I track my order?',
        answer: 'Once your order is shipped, you\'ll receive a tracking link via SMS and email. You can also track it from your account dashboard.',
        category: 'delivery'
      },
      {
        id: 5,
        question: 'What if I receive damaged or spoiled produce?',
        answer: 'We take quality seriously. If you receive damaged items, please contact us within 24 hours with photos for a full refund or replacement.',
        category: 'returns'
      },
      {
        id: 6,
        question: 'Do I need an account to place an order?',
        answer: 'While you can browse without an account, you need to create one to complete your purchase. This helps us provide order tracking and order history.',
        category: 'account'
      },
      {
        id: 7,
        question: 'Are there any delivery fees?',
        answer: 'Delivery is free for orders above ₹499. For orders below this amount, a ₹49 delivery fee applies.',
        category: 'payments'
      },
      {
        id: 8,
        question: 'How do I reset my password?',
        answer: 'Click on "Forgot Password" on the login page, enter your registered email, and follow the instructions sent to your email to reset your password.',
        category: 'account'
      },
      {
        id: 9,
        question: 'Can I modify my order after placing it?',
        answer: 'You can modify your order within 15 minutes of placing it by contacting our support team. After that, the order enters processing and cannot be changed.',
        category: 'ordering'
      },
      {
        id: 10,
        question: 'Do you offer organic products?',
        answer: 'Yes, we have a dedicated "Organic" section with certified organic fruits, vegetables, and other grocery items. Look for the organic badge on products.',
        category: 'ordering'
      }
    ]
  };

  const filteredFAQs = faqData.items.filter(item => {
    return activeCategory === 'all' || item.category === activeCategory;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-800 mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-600">Find answers to common questions about FarmFerry</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-10 justify-center">
        <button
          className={`px-5 py-2 rounded-full transition-all ${activeCategory === 'all' ? 'bg-green-700 text-white shadow-md' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
          onClick={() => setActiveCategory('all')}
        >
          All FAQs
        </button>
        {faqData.categories.map(category => (
          <button
            key={category.id}
            className={`px-5 py-2 rounded-full transition-all ${activeCategory === category.id ? 'bg-green-700 text-white shadow-md' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map(item => (
            <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-md">
              <button
                className="flex justify-between items-center w-full px-6 py-5 text-left bg-white hover:bg-green-50 transition-colors"
                onClick={() => toggleItem(item.id)}
              >
                <span className="font-medium text-lg text-gray-800">{item.question}</span>
                <svg
                  className={`w-5 h-5 text-green-700 transform transition-transform ${openItems[item.id] ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openItems[item.id] && (
                <div className="px-6 py-4 bg-green-50 border-t border-green-100">
                  <p className="text-gray-700">{item.answer}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No FAQs found in this category</h3>
            <p className="mt-2 text-gray-500">Try selecting a different category</p>
          </div>
        )}
      </div>

      {/* Support CTA */}
      <div className="mt-16 p-6 bg-green-50 rounded-lg border border-green-200 text-center">
        <h3 className="text-xl font-semibold text-green-800 mb-3">Still have questions?</h3>
        <p className="text-gray-700 mb-4">Our support team is here to help you</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
            Contact Support
          </button>
          <button className="px-6 py-3 border border-green-700 text-green-700 rounded-lg hover:bg-green-700 hover:text-white transition-colors">
            Live Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmFerryFAQ;