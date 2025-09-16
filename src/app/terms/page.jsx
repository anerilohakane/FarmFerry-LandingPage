"use client";

import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 font-sans text-gray-800 leading-relaxed">
        {/* Header */}
        <div className="text-center mb-12 pb-8 border-b border-green-200 bg-white rounded-lg shadow-sm mt-15">
          <div className="flex justify-center items-center mb-4">
            {/* <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div> */}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-700 mb-2">Terms and Conditions</h1>
          <p className="text-gray-600 italic text-xs sm:text-sm">Last updated in September 2025</p>
        </div>

        <div className="space-y-8">
          {/* Introduction Section */}
          <section id="intro" className="bg-white rounded-lg shadow-sm p-5 sm:p-6 border border-green-100">
            <h2 className="text-xl sm:text-2xl font-semibold text-green-700 mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              Terms of Use
            </h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p>Thank you for using FarmFerry.</p>
              <p>For your information: "FarmFerry Private Limited" is a company with its registered office at Sr. No 32/4, 3rd Floor Audumbar Nivya Near Canara Bank, Narhegaon , Pune - 411041, India (hereinafter referred to as "We"/ "FarmFerry"/ "Us"/ "Our").</p>
              <p>For abundant clarity, FarmFerry and/or the trademark "FarmFerry" are neither related, linked, nor interconnected in any manner to any other entity or business unless explicitly stated.</p>
              <p>The terms and conditions/terms of use ("Terms") governing the FarmFerry Platform (defined later) and the Services (defined later) follow:</p>
            </div>
          </section>

          {/* Acceptance Section */}
          <section id="acceptance" className="bg-white rounded-lg shadow-sm p-5 sm:p-6 border border-green-100">
            <h2 className="text-xl sm:text-2xl font-semibold text-green-700 mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              Acceptance of Terms
            </h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p>These Terms are intended to make you aware of your legal rights and responsibilities with respect to your access to and use of FarmFerry's website www.farmferry.in ("Site") and/or any related mobile or software applications (collectively referred to as, "FarmFerry Platform") including but not limited to the services offered by FarmFerry via the FarmFerry Platform or otherwise ("Services").</p>
              <p>Your use/access of the FarmFerry Platform shall be governed by these Terms and the Privacy Policy of FarmFerry as available at <a href="https://www.farmferry.in/privacy" className="text-green-600 hover:underline font-medium">https://www.farmferry.in/privacy</a> ("Privacy Policy"). By accessing the FarmFerry Platform and/or undertaking any sale-purchase transaction, you agree to be bound by the Terms, including any additional terms and conditions and policies referenced herein and/or available by hyperlink on the FarmFerry Platform, and acknowledge that it constitutes an agreement between you and FarmFerry. You may not access the FarmFerry Platform or use the Services if you do not accept the Terms or are unable to be bound by the Terms/the Privacy Policy.</p>
              <p>These Terms may be updated from time to time by FarmFerry without notice. It is therefore strongly recommended that you review these Terms, as available on the FarmFerry Platform, each time you access and/or use the FarmFerry Platform. In the event of any conflict or inconsistency between these Terms and any other terms of use that appear on the FarmFerry Platform, these Terms will prevail.</p>
              <p>The terms 'visitor(s)', 'user(s)', 'you', 'your', 'customer(s)' hereunder refer to the person visiting, accessing, viewing, browsing through, and/or using the FarmFerry Platform at any point in time.</p>
              <p>Should you need any clarifications regarding the Terms, please write to us at <a href="mailto:info@farmferry.in" className="text-green-600 hover:underline font-medium">info@farmferry.in</a>.</p>
            </div>
          </section>

          {/* Services Overview Section */}
          <section id="services" className="bg-white rounded-lg shadow-sm p-5 sm:p-6 border border-green-100">
            <h2 className="text-xl sm:text-2xl font-semibold text-green-700 mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              Services Overview
            </h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p>The FarmFerry Platform is a platform for users/consumers to transact with sellers/service providers offering products/services for sale/supply through the FarmFerry Platform, with a focus on farm-fresh products such as fruits, vegetables, dairy, and other grocery items. Products/services may be listed or offered for sale/supply on the FarmFerry Platform by FarmFerry, its affiliates, or third parties ("Third Party Sellers") (such third-party products/services offered by Third Party Sellers shall hereinafter be referred to as "Third Party Offerings"). For abundant clarity, with respect to the Third Party Offerings, FarmFerry does not provide any services to users other than providing the FarmFerry Platform as a platform to transact at their own cost and risk, and other services as may be specifically notified in writing. Services on the FarmFerry Platform are available in select geographies in India.</p>
              <p>FarmFerry is not and cannot be a party to any transaction between you and the Third Party Sellers (which shall be a bipartite arrangement between you and the Third Party Seller), nor does FarmFerry have any control or influence over the Third Party Offerings. FarmFerry does not make any representation or warranties with respect to the Third Party Offerings, including relating to quality, suitability, merchantability, and fitness for any purpose, nor does FarmFerry implicitly or explicitly support or endorse the sale/supply or purchase of any such products/services on the FarmFerry Platform. FarmFerry therefore disclaims all warranties and liabilities associated with any Third Party Offerings on the FarmFerry Platform.</p>
            </div>
          </section>

          {/* Eligibility Section */}
          <section id="eligibility" className="bg-white rounded-lg shadow-sm p-5 sm:p-6 border border-green-100">
            <h2 className="text-xl sm:text-2xl font-semibold text-green-700 mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              Eligibility
            </h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p>Persons who are "incompetent to contract" within the meaning of the Indian Contract Act, 1872, including minors, undischarged insolvents, etc., are not eligible to use/access the FarmFerry Platform. However, if you are a minor, i.e., under the age of 18 years, you may use/access the FarmFerry Platform under the supervision of an adult parent or legal guardian "competent to contract" who agrees to be bound by these Terms. You are, however, prohibited (even under supervision) from purchasing any product(s) which is for adult consumption or the sale of which to minors is prohibited, including any tobacco products.</p>
              <p>The FarmFerry Platform is intended to be a platform for end-consumers desirous of purchasing product(s)/availing services for domestic/self-consumption. If you are a retailer, institution, wholesaler, or any other business-to-business user, you are not eligible to use the FarmFerry Platform.</p>
              <p>To determine compliance with eligibility criteria, FarmFerry uses inter alia algorithms and/or pre-determined criteria-based technology, and accordingly, from time to time, your usage may be restricted or blocked on account of overlap with such algorithms/pre-determined criteria. In such cases, if you are a genuine user of the FarmFerry Platform, please contact us for assistance.</p>
              <p>If you are using the FarmFerry Platform on behalf of any person/entity, you represent and warrant that you are authorized to accept these Terms on behalf of such person/entity. Further, you and such person/entity agree to be jointly and severally liable for compliance and indemnify us for violations of these Terms.</p>
            </div>
          </section>

          {/* Gift Cards Section */}
          {/* <section id="giftcards" className="bg-white rounded-lg shadow-sm p-5 sm:p-6 border border-green-100">
            <h2 className="text-xl sm:text-2xl font-semibold text-green-700 mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              FarmFerry Gift Cards
            </h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p>FarmFerry co-branded gift cards ("Co-branded Gift Card") are issued by [Insert Payment Partner, e.g., Razorpay Technologies Private Limited], a private limited company incorporated under the laws of India, and is authorized by the Reserve Bank of India ("RBI") under the Master Directions on Prepaid Payment Instruments issued by RBI ("PPI Master Directions") in collaboration with FarmFerry as the co-branding partner. For the sake of clarity, 'FarmFerry Money' on the FarmFerry Platform is powered by and includes the Co-branded Gift Cards purchased.</p>
              <p>The Co-branded Gift Card is redeemable only on the FarmFerry Platform. The Co-branded Gift Card can be purchased on the FarmFerry Platform using the following payment modes only: credit card, debit card, UPI, and internet banking.</p>
              <p>The Co-branded Gift Card issued by [Insert Payment Partner] shall be governed by the applicable terms as specified [Insert link or reference to payment partner's terms].</p>
            </div>
          </section> */}
        </div>

        {/* Footer Note */}
        <div className="mt-10 pt-6 border-t border-green-200 text-center text-xs text-gray-600">
          <p>If you have any questions about these Terms, please contact us at <a href="mailto:info@farmferry.in" className="text-green-600 hover:underline">info@farmferry.in</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;