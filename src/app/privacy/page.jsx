"use client";

import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 font-sans text-gray-800 leading-relaxed">
        {/* Header */}
        <div className="text-center mb-12 pb-8 border-b border-green-200 bg-white rounded-lg shadow-sm mt-15">
          <h1 className="text-3xl sm:text-4xl font-bold text-green-700 mb-2">Privacy Policy</h1>
          <p className="text-gray-600 italic text-sm sm:text-base">Last updated in September 2025</p>
        </div>

        <div className="space-y-8">
          {/* Introduction Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-green-100">
            <p className="text-base sm:text-lg mb-4">
              FarmFerry Private Limited ("FarmFerry," "Company," "we," "us," or "our") is committed to protecting the privacy and security of your personal information. Your trust is of utmost importance to us. This Privacy Policy explains how we collect, use, process, and disclose information about you when you access or use our website www.farmferry.in, mobile application, or other affiliated services (collectively, the "Services"). By using our Services, you consent to the terms of this Privacy Policy in addition to our <a href="https://www.farmferry.in/terms" className="text-green-600 hover:underline font-medium">Terms of Use</a>.
            </p>
            <p className="text-base sm:text-lg">
              We encourage you to read this Privacy Policy carefully to understand our practices regarding your information. For any clarifications, please contact us at <a href="mailto:info@farmferry.in" className="text-green-600 hover:underline font-medium">info@farmferry.in</a>.
            </p>
          </section>

          {/* Applicability and Scope Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-green-100">
            <h2 className="text-2xl sm:text-3xl font-semibold text-green-700 mb-6 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Applicability and Scope
            </h2>
            <div className="space-y-4 text-base sm:text-lg">
              <p>This Privacy Policy applies to all information collected by FarmFerry through its Services, including data provided directly by you, collected automatically, or obtained from third parties. It governs our practices for collecting, using, maintaining, protecting, and disclosing your information.</p>
              <p>This policy does not apply to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Information collected by third-party sellers or service providers offering products or services through the FarmFerry Platform ("Third Party Sellers"), who may have their own privacy policies. We recommend reviewing their policies before sharing information with them.</li>
                <li>Information you provide to third-party websites or services linked from our Services.</li>
              </ul>
              <p>By accessing or using our Services, including registering for an account, you agree to this Privacy Policy and consent to our collection, use, disclosure, retention, and protection of your personal information as described herein. If you do not provide required information, we may not be able to offer all our Services to you.</p>
              <p>This policy may be updated periodically to reflect changes in our practices or legal requirements. Your continued use of the Services after updates constitutes acceptance of those changes. Please check this page regularly for updates.</p>
            </div>
          </section>

          {/* Permissible Age Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-green-100">
            <h2 className="text-2xl sm:text-3xl font-semibold text-green-700 mb-6 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Permissible Age
            </h2>
            <div className="space-y-4 text-base sm:text-lg">
              <p>The Services are not intended for users under the age of 18, unless permitted under applicable Indian laws ("Permissible Age"). We do not knowingly collect personal information from users under the Permissible Age without parental or guardian consent. If you are a minor, you may use the Services only under the supervision of an adult parent or legal guardian who agrees to be bound by this Privacy Policy.</p>
            </div>
          </section>

          {/* Information Collection Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-green-100">
            <h2 className="text-2xl sm:text-3xl font-semibold text-green-700 mb-6 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              The Information We Collect and How We Use It
            </h2>
            <div className="space-y-4 text-base sm:text-lg">
              <p>FarmFerry collects various types of information to provide and improve our Services, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="font-medium">Personal Information:</span> Data that can identify you, such as your name, address, email address, phone number, and payment details.</li>
                <li><span className="font-medium">Non-Personal Information:</span> Data that does not directly identify you, such as device information, usage details, and anonymized analytics.</li>
              </ul>
              
              <h3 className="font-semibold text-green-600 mt-4 text-xl sm:text-2xl">We collect this information in the following ways:</h3>
              
              <h4 className="font-medium mt-4 text-lg sm:text-xl">Information You Provide to Us</h4>
              <p>We collect information you voluntarily provide when using our Services, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="font-medium">Account Information:</span> Name, email address, phone number, postal address, password, date of birth, and other details provided during account creation or profile updates.</li>
                <li><span className="font-medium">Order Information:</span> Details of products ordered, delivery addresses, payment information, and contact details for order fulfillment.</li>
                <li><span className="font-medium">Communications:</span> Feedback, queries, or complaints submitted via our Services, customer support channels, or surveys. This may include communications with delivery partners or Third Party Sellers facilitated through our platform.</li>
                <li><span className="font-medium">Transactional Information:</span> Payment details (e.g., credit/debit card, UPI, or net banking) used for purchases. We encrypt payment information using industry-standard technologies (e.g., PCI-compliant payment gateways).</li>
                <li><span className="font-medium">User-Generated Content:</span> Photos, reviews, or other content you upload to the Services, such as product feedback or ratings.</li>
                <li><span className="font-medium">Contact Details:</span> Information about contacts you provide for features like referrals, provided you have their consent to share such information.</li>
              </ul>
              
              <h4 className="font-medium mt-4 text-lg sm:text-xl">Information Collected Automatically</h4>
              <p>We use automated technologies to collect information about your interaction with our Services, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="font-medium">Usage Information:</span> Details of your activity, such as pages visited, search queries, products viewed, time spent on the Services, and order history.</li>
                <li><span className="font-medium">Device Information:</span> IP address, device type, operating system, browser type, mobile network information, and unique device identifiers.</li>
                <li><span className="font-medium">Location Information:</span> Real-time GPS location data from your device (with your consent) to enable location-based Services, such as delivery tracking or personalized offers.</li>
                <li><span className="font-medium">Cookies and Tracking Technologies:</span> We use cookies, web beacons, and pixel tags to enhance your experience, store preferences, analyze usage, and deliver tailored advertisements. You can manage cookie preferences through your browser settings, but disabling cookies may limit some features.</li>
                <li><span className="font-medium">Mobile Application Data:</span> Information about other applications on your device (e.g., shopping or food delivery apps) to personalize your experience, and the online/offline status of our app.</li>
              </ul>
              
              <h4 className="font-medium mt-4 text-lg sm:text-xl">Information from Third Parties</h4>
              <p>We may collect information from third parties, such as:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="font-medium">Social Media:</span> If you sign in using a social media account (e.g., Google or Facebook), we may collect your user ID, public profile information, or other data shared by the platform, subject to your consent.</li>
                <li><span className="font-medium">Partners and Analytics Providers:</span> Information from third-party partners, marketers, or analytics services (e.g., Google Analytics) to understand user behavior and improve our Services.</li>
              </ul>
            </div>
          </section>

          {/* How We Use Information Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-green-100">
            <h2 className="text-2xl sm:text-3xl font-semibold text-green-700 mb-6 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              How We Use Your Information
            </h2>
            <div className="space-y-4 text-base sm:text-lg">
              <p>We use the collected information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="font-medium">Provide Services:</span> Process orders, facilitate deliveries, and manage your account.</li>
                <li><span className="font-medium">Personalize Experience:</span> Offer tailored product recommendations, promotions, and advertisements based on your preferences and usage.</li>
                <li><span className="font-medium">Improve Services:</span> Analyze usage patterns, conduct research, and enhance platform functionality.</li>
                <li><span className="font-medium">Communicate:</span> Send order updates, respond to queries, and provide customer support via email, SMS, WhatsApp, or other channels.</li>
                <li><span className="font-medium">Marketing:</span> Share promotional offers or newsletters (with your consent) and display relevant ads through third-party ad networks.</li>
                <li><span className="font-medium">Fraud Prevention:</span> Detect and prevent fraudulent activities or violations of our Terms of Use.</li>
                <li><span className="font-medium">Compliance:</span> Meet legal obligations, including tax reporting and regulatory requirements under Indian laws.</li>
                <li><span className="font-medium">Analytics:</span> Use anonymized or aggregated data for research, reporting, and improving our Services.</li>
              </ul>
              <p>We may share anonymized or de-identified data with third parties without restriction, as it does not identify you personally.</p>
            </div>
          </section>

          {/* Information Sharing Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-green-100">
            <h2 className="text-2xl sm:text-3xl font-semibold text-green-700 mb-6 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              How We Share Your Information
            </h2>
            <div className="space-y-4 text-base sm:text-lg">
              <p>We may share your information in the following ways:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="font-medium">With Third Party Sellers:</span> To process orders placed with Third Party Sellers on our platform. These sellers are responsible for their own privacy practices.</li>
                <li><span className="font-medium">With Service Providers:</span> To facilitate Services, such as delivery partners, payment processors, cloud hosting providers, or customer support teams. These providers are contractually obligated to protect your information.</li>
                <li><span className="font-medium">With Affiliates:</span> With entities under common ownership with FarmFerry for operational purposes.</li>
                <li><span className="font-medium">For Legal Purposes:</span> To comply with legal obligations, respond to government requests, or protect the rights, safety, or property of FarmFerry, its users, or the public.</li>
                <li><span className="font-medium">Business Transfers:</span> In the event of a merger, acquisition, or sale of assets, your information may be transferred to a successor entity.</li>
                <li><span className="font-medium">With Consent:</span> For marketing or other purposes, where you have provided explicit consent.</li>
              </ul>
              <p>We do not sell your personal information to third parties for monetary gain. However, we may share data with advertising partners for targeted advertising, subject to your consent.</p>
            </div>
          </section>

          {/* User Rights Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-green-100">
            <h2 className="text-2xl sm:text-3xl font-semibold text-green-700 mb-6 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Your Rights
            </h2>
            <div className="space-y-4 text-base sm:text-lg">
              <p>Subject to applicable Indian laws, including the Digital Personal Data Protection Act, 2023, you have the following rights regarding your personal information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="font-medium">Access:</span> Request a copy of the personal data we hold about you.</li>
                <li><span className="font-medium">Correction:</span> Request correction of inaccurate or incomplete data.</li>
                <li><span className="font-medium">Deletion:</span> Request deletion of your data, subject to legal retention requirements.</li>
                <li><span className="font-medium">Restriction:</span> Request restriction of data processing in certain cases.</li>
                <li><span className="font-medium">Objection:</span> Object to processing for marketing or other purposes.</li>
                <li><span className="font-medium">Data Portability:</span> Request your data in a machine-readable format.</li>
              </ul>
              <p>To exercise these rights, contact our Data Protection Officer at <a href="mailto:info@farmferry.in" className="text-green-600 hover:underline font-medium">info@farmferry.in</a>. We may verify your identity before processing requests. Your rights may be limited if requests are excessive, affect others' rights, or relate to legal proceedings.</p>
            </div>
          </section>

          {/* Security Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-green-100">
            <h2 className="text-2xl sm:text-3xl font-semibold text-green-700 mb-6 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Security
            </h2>
            <div className="space-y-4 text-base sm:text-lg">
              <p>We implement industry-standard physical, electronic, and managerial safeguards to protect your information, including encryption for payment data and secure servers. However, no system is completely secure, and we cannot guarantee protection against unauthorized access due to errors in transmission or other causes beyond our control.</p>
              <p>You are responsible for safeguarding your account credentials. Do not share your username or password. If we receive instructions using your credentials, we will assume they are authorized.</p>
            </div>
          </section>

          {/* Third-Party Links Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-green-100">
            <h2 className="text-2xl sm:text-3xl font-semibold text-green-700 mb-6 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Third-Party Links and Services
            </h2>
            <div className="space-y-4 text-base sm:text-lg">
              <p>Our Services may contain links to third-party websites or services (e.g., payment gateways or Third Party Sellers). We are not responsible for their privacy practices or content. Please review their privacy policies before sharing information.</p>
            </div>
          </section>

          {/* Policy Amendments Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-green-100">
            <h2 className="text-2xl sm:text-3xl font-semibold text-green-700 mb-6 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Policy Amendments
            </h2>
            <div className="space-y-4 text-base sm:text-lg">
              <p>We may update this Privacy Policy to reflect changes in our practices, technology, or legal requirements. Updates will be posted on this page, and we may notify you of material changes via email or in-app notifications. Your continued use of the Services after updates constitutes acceptance of the revised policy.</p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-green-100">
            <h2 className="text-2xl sm:text-3xl font-semibold text-green-700 mb-6 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Contact Us
            </h2>
            <div className="space-y-4 text-base sm:text-lg">
              <p>For questions or concerns about this Privacy Policy or our data practices, please contact our Data Protection Officer at:</p>
              <p className="font-medium">Email: <a href="mailto:info@farmferry.in" className="text-green-600 hover:underline">info@farmferry.in</a></p>
              <p className="font-medium">Address: Sr. No 32/4, 3rd Floor Audumbar Nivya Near Canara Bank, Narhegaon, Pune - 411041, India</p>
              <p>We aim to respond to all inquiries within a reasonable timeframe, typically within 24-48 hours.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;