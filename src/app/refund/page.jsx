"use client";

import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 font-sans text-gray-800 leading-relaxed">
        {/* Header */}
        <div className="text-center mb-12 pb-8 border-b border-green-200 bg-white rounded-lg shadow-sm mt-15">
          <h1 className="text-3xl sm:text-4xl font-bold text-green-700 mb-2">Refund & Cancellation Policy</h1>
          <p className="text-gray-600 italic text-sm sm:text-base">Last updated in September 2025</p>
        </div>

        <div className="space-y-8">
          {/* Introduction Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-green-100">
            <p className="text-base sm:text-lg mb-4">
              At FarmFerry Private Limited ("FarmFerry," "we," "us," or "our"), we strive to ensure your complete satisfaction with our Services. This Refund & Cancellation Policy outlines the terms and conditions governing refunds, cancellations, and returns for products and services purchased through our platform.
            </p>
            <p className="text-base sm:text-lg">
              By using our Services, you agree to this Refund Policy in addition to our <a href="https://www.farmferry.in/terms" className="text-green-600 hover:underline font-medium">Terms of Use</a> and <a href="https://www.farmferry.in/privacy" className="text-green-600 hover:underline font-medium">Privacy Policy</a>. For any clarifications, please contact us at <a href="mailto:support@farmferry.in" className="text-green-600 hover:underline font-medium">support@farmferry.in</a>.
            </p>
          </section>

          {/* General Refund Principles Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-green-100">
            <h2 className="text-2xl sm:text-3xl font-semibold text-green-700 mb-6 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              General Refund Principles
            </h2>
            <div className="space-y-4 text-base sm:text-lg">
              <p>We aim to process refunds in a fair and transparent manner. The following general principles apply:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Refunds are processed to the original payment method used during purchase</li>
                <li>Processing times may vary depending on your payment provider (typically 5-10 business days)</li>
                <li>Partial refunds may be issued in cases where only part of an order is affected</li>
                <li>All refund requests are subject to verification and approval by our team</li>
              </ul>
            </div>
          </section>

          {/* Order Cancellation Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-green-100">
            <h2 className="text-2xl sm:text-3xl font-semibold text-green-700 mb-6 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Order Cancellation
            </h2>
            <div className="space-y-4 text-base sm:text-lg">
              <h3 className="font-semibold text-green-600 text-xl sm:text-2xl">Before Shipment/Delivery</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Orders can be cancelled free of charge before they are shipped or assigned for delivery</li>
                <li>Full refunds will be processed within 24 hours of cancellation</li>
                <li>To cancel, use the "Cancel Order" option in your account or contact customer support</li>
              </ul>
              
              <h3 className="font-semibold text-green-600 mt-4 text-xl sm:text-2xl">After Shipment/Delivery</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Once an order is shipped or out for delivery, cancellation may not be possible</li>
                <li>You may refuse delivery when the order arrives, subject to restocking fees</li>
                <li>Contact our support team immediately if you need to cancel a shipped order</li>
              </ul>
            </div>
          </section>

          {/* Refund Eligibility Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-green-100">
            <h2 className="text-2xl sm:text-3xl font-semibold text-green-700 mb-6 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Refund Eligibility
            </h2>
            <div className="space-y-4 text-base sm:text-lg">
              <h3 className="font-semibold text-green-600 text-xl sm:text-2xl">Full Refunds Available For:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Order cancellation before shipment</li>
                <li>Products damaged during delivery (with photographic evidence)</li>
                <li>Incorrect items received</li>
                <li>Missing items from your order</li>
                <li>Products that are expired or spoiled upon delivery</li>
                <li>Significant quality issues verified by our team</li>
              </ul>
              
              <h3 className="font-semibold text-green-600 mt-4 text-xl sm:text-2xl">Partial or No Refunds For:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Change of mind after delivery (unless required by local consumer laws)</li>
                <li>Products that have been opened, used, or partially consumed</li>
                <li>Perishable goods that have been delivered in good condition</li>
                <li>Minor quality variations that do not affect usability</li>
                <li>Delivery delays due to circumstances beyond our control</li>
              </ul>
            </div>
          </section>

          {/* Fresh Produce & Perishables Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-green-100">
            <h2 className="text-2xl sm:text-3xl font-semibold text-green-700 mb-6 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Fresh Produce & Perishable Goods
            </h2>
            <div className="space-y-4 text-base sm:text-lg">
              <p>Due to the nature of fresh produce, special conditions apply:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Natural variations in size, color, and appearance are not grounds for refund</li>
                <li>Seasonal availability may affect product characteristics</li>
                <li>Refunds are provided only for significant quality issues or spoilage</li>
                <li>Claims must be made within 24 hours of delivery with supporting photos</li>
                <li>We may offer credit instead of monetary refund for perishable goods</li>
              </ul>
            </div>
          </section>

          {/* Refund Process Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-green-100">
            <h2 className="text-2xl sm:text-3xl font-semibold text-green-700 mb-6 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Refund Process
            </h2>
            <div className="space-y-4 text-base sm:text-lg">
              <h3 className="font-semibold text-green-600 text-xl sm:text-2xl">Step-by-Step Procedure:</h3>
              <ol className="list-decimal pl-6 space-y-3">
                <li><span className="font-medium">Submit Request:</span> Contact our support team within 48 hours of delivery via email or through your account</li>
                <li><span className="font-medium">Provide Evidence:</span> Include order details, photos/videos of the issue, and description of the problem</li>
                <li><span className="font-medium">Verification:</span> Our team will review your claim within 24-48 hours</li>
                <li><span className="font-medium">Approval/Rejection:</span> You will be notified of the decision via email</li>
                <li><span className="font-medium">Processing:</span> Approved refunds are processed within 3-5 business days</li>
                <li><span className="font-medium">Completion:</span> Refund appears in your account based on your payment provider's timeline</li>
              </ol>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p className="font-medium text-yellow-800">Important: Keep the products in question until the refund process is complete, as we may arrange for pickup or request additional verification.</p>
              </div>
            </div>
          </section>

          {/* Third-Party Seller Orders Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-green-100">
            <h2 className="text-2xl sm:text-3xl font-semibold text-green-700 mb-6 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Third-Party Seller Orders
            </h2>
            <div className="space-y-4 text-base sm:text-lg">
              <p>For orders fulfilled by Third Party Sellers on our platform:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Refund policies may vary by seller</li>
                <li>We facilitate the refund process but the seller makes the final decision</li>
                <li>Third Party Sellers may have different return windows and conditions</li>
                <li>Check individual seller policies before purchasing</li>
                <li>We mediate disputes between buyers and sellers when necessary</li>
              </ul>
            </div>
          </section>

          {/* Non-Refundable Items Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-green-100">
            <h2 className="text-2xl sm:text-3xl font-semibold text-green-700 mb-6 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Non-Refundable Items & Services
            </h2>
            <div className="space-y-4 text-base sm:text-lg">
              <p>The following are generally non-refundable:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Delivery charges (unless the entire order is refunded due to our error)</li>
                <li>Gift wrapping services</li>
                <li>Donations made through our platform</li>
                <li>Digital products or services once accessed</li>
                <li>Products marked as "final sale" or "non-returnable"</li>
                <li>Customized or personalized items</li>
              </ul>
            </div>
          </section>

          {/* Store Credit Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-green-100">
            <h2 className="text-2xl sm:text-3xl font-semibold text-green-700 mb-6 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Store Credit Option
            </h2>
            <div className="space-y-4 text-base sm:text-lg">
              <p>In some cases, we may offer FarmFerry store credit as an alternative to monetary refunds:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Store credit is issued instantly to your account</li>
                <li>No expiration date - use anytime for future purchases</li>
                <li>Can be combined with other offers and promotions</li>
                <li>Non-transferable and cannot be redeemed for cash</li>
                <li>Ideal for minor issues where you'd like to try alternative products</li>
              </ul>
            </div>
          </section>

          {/* Delivery Issues Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-green-100">
            <h2 className="text-2xl sm:text-3xl font-semibold text-green-700 mb-6 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Delivery & Shipping Issues
            </h2>
            <div className="space-y-4 text-base sm:text-lg">
              <h3 className="font-semibold text-green-600 text-xl sm:text-2xl">Failed or Late Deliveries:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Full refund for orders that never arrive</li>
                <li>Partial refund for significantly delayed deliveries affecting product quality</li>
                <li>No refund for minor delays due to weather, traffic, or other unavoidable circumstances</li>
                <li>Contact us if delivery exceeds the promised timeframe by more than 24 hours</li>
              </ul>
              
              <h3 className="font-semibold text-green-600 mt-4 text-xl sm:text-2xl">Wrong Address:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ensure your delivery address is correct before placing orders</li>
                <li>Address changes after order confirmation may not be possible</li>
                <li>No refund for deliveries to incorrect addresses provided by you</li>
              </ul>
            </div>
          </section>

          {/* Policy Amendments Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-green-100">
            <h2 className="text-2xl sm:text-3xl font-semibold text-green-700 mb-6 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Policy Amendments
            </h2>
            <div className="space-y-4 text-base sm:text-lg">
              <p>We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting on our platform. Your continued use of our Services after changes constitutes acceptance of the updated policy.</p>
              <p>For major changes, we will notify users via email or in-app notifications.</p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-green-100">
            <h2 className="text-2xl sm:text-3xl font-semibold text-green-700 mb-6 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Contact Us for Refund Requests
            </h2>
            <div className="space-y-4 text-base sm:text-lg">
              <p>For refund requests, questions, or concerns about this policy, please contact us:</p>
              <p className="font-medium">Email: <a href="mailto:support@farmferry.in" className="text-green-600 hover:underline">support@farmferry.in</a></p>
              {/* <p className="font-medium">Phone: <a href="tel:+911800XXXXXX" className="text-green-600 hover:underline">1800-XXXXXX</a> (Toll-free)</p> */}
              <p className="font-medium">Hours: Monday-Saturday, 9:00 AM - 7:00 PM IST</p>
              <p className="font-medium">Address: Sr. No 32/4, 3rd Floor Audumbar Nivya Near Canara Bank, Narhegaon, Pune - 411041, India</p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <p className="font-medium text-green-800">For faster processing, include your order number and relevant details when contacting us about refunds.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;