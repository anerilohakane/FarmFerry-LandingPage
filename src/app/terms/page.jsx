import React from 'react';

const TermsAndPolicy = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-28 pb-12 bg-gradient-to-b from-green-50 to-green-100 min-h-screen">
      {/* Main header with extra top padding to avoid overlap */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-800 mb-4">Terms & Policies</h1>
        <p className="text-green-700 max-w-2xl mx-auto">
          Farm Ferry is committed to transparency and your satisfaction. Please review our terms and policies below.
        </p>
      </div>

      {/* Terms of Service Section */}
      <section className="mb-16 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8 border border-green-200">
        <h2 className="text-2xl font-semibold text-green-700 mb-6 pb-2 border-b border-green-200 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Terms of Service
        </h2>
        
        <div className="space-y-6">
          <div className="hover:bg-green-50 p-4 rounded-lg transition-colors duration-200">
            <h3 className="text-lg font-medium text-gray-800 flex items-start">
              <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm flex-shrink-0">1</span>
              Acceptance of Terms
            </h3>
            <p className="text-gray-600 mt-2 ml-9">
              By accessing or using the Farm Ferry website and mobile application, you agree to be bound by these Terms of Service. If you do not agree, please refrain from using our services.
            </p>
          </div>
          
          <div className="hover:bg-green-50 p-4 rounded-lg transition-colors duration-200">
            <h3 className="text-lg font-medium text-gray-800 flex items-start">
              <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm flex-shrink-0">2</span>
              Ordering and Delivery
            </h3>
            <p className="text-gray-600 mt-2 ml-9">
              All orders are subject to product availability. We strive to deliver fresh produce by the next morning for orders placed before midnight. Delivery times may vary based on location and circumstances beyond our control.
            </p>
          </div>
          
          <div className="hover:bg-green-50 p-4 rounded-lg transition-colors duration-200">
            <h3 className="text-lg font-medium text-gray-800 flex items-start">
              <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm flex-shrink-0">3</span>
              Pricing and Payments
            </h3>
            <p className="text-gray-600 mt-2 ml-9">
              Prices are subject to change without notice. We offer up to 40% off on select products as part of promotions. All payments are processed securely through our payment gateway partners.
            </p>
          </div>
          
          <div className="hover:bg-green-50 p-4 rounded-lg transition-colors duration-200">
            <h3 className="text-lg font-medium text-gray-800 flex items-start">
              <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm flex-shrink-0">4</span>
              Returns and Refunds
            </h3>
            <p className="text-gray-600 mt-2 ml-9">
              Due to the perishable nature of our products, we only accept returns for damaged or incorrect items. Refund requests must be made within 24 hours of delivery.
            </p>
          </div>
          
          <div className="hover:bg-green-50 p-4 rounded-lg transition-colors duration-200">
            <h3 className="text-lg font-medium text-gray-800 flex items-start">
              <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm flex-shrink-0">5</span>
              Account Responsibility
            </h3>
            <p className="text-gray-600 mt-2 ml-9">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Section */}
      <section className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8 border border-green-200">
        <h2 className="text-2xl font-semibold text-green-700 mb-6 pb-2 border-b border-green-200 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Privacy Policy
        </h2>
        
        <div className="space-y-6">
          <div className="hover:bg-green-50 p-4 rounded-lg transition-colors duration-200">
            <h3 className="text-lg font-medium text-gray-800 flex items-start">
              <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm flex-shrink-0">1</span>
              Information Collection
            </h3>
            <p className="text-gray-600 mt-2 ml-9">
              We collect personal information such as name, email, phone number, and delivery address when you create an account or place an order. We may also collect usage data through cookies.
            </p>
          </div>
          
          <div className="hover:bg-green-50 p-4 rounded-lg transition-colors duration-200">
            <h3 className="text-lg font-medium text-gray-800 flex items-start">
              <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm flex-shrink-0">2</span>
              Use of Information
            </h3>
            <p className="text-gray-600 mt-2 ml-9">
              Your information is used to process orders, improve our services, and communicate with you. We may send promotional emails which you can opt-out of at any time.
            </p>
          </div>
          
          <div className="hover:bg-green-50 p-4 rounded-lg transition-colors duration-200">
            <h3 className="text-lg font-medium text-gray-800 flex items-start">
              <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm flex-shrink-0">3</span>
              Data Security
            </h3>
            <p className="text-gray-600 mt-2 ml-9">
              We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
            </p>
          </div>
          
          <div className="hover:bg-green-50 p-4 rounded-lg transition-colors duration-200">
            <h3 className="text-lg font-medium text-gray-800 flex items-start">
              <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm flex-shrink-0">4</span>
              Third-Party Sharing
            </h3>
            <p className="text-gray-600 mt-2 ml-9">
              We do not sell your personal information. We may share data with delivery partners and payment processors only as necessary to fulfill your orders.
            </p>
          </div>
          
          <div className="hover:bg-green-50 p-4 rounded-lg transition-colors duration-200">
            <h3 className="text-lg font-medium text-gray-800 flex items-start">
              <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm flex-shrink-0">5</span>
              Changes to Policy
            </h3>
            <p className="text-gray-600 mt-2 ml-9">
              We may update this Privacy Policy periodically. We will notify users of significant changes through email or notices on our website.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Footer */}
      <div className="mt-12 text-center">
        <div className="bg-white border border-green-200 rounded-lg p-6 inline-block shadow-sm">
          <h3 className="text-lg font-medium text-green-700 mb-2">Need help with anything?</h3>
          <p className="text-gray-600 mb-3">
            Contact us at <a href="mailto:farm.ferry.225@gmail.com" className="text-green-600 hover:underline">farm.ferry.225@gmail.com</a>
          </p>
          <p className="text-gray-500 text-sm">
            Last updated: July 25, 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPolicy;