'use client';

import { useState } from 'react';
import { Shield, FileText, Lock, Eye, UserCheck, Mail, ArrowRight } from 'lucide-react';

const AccountPrivacy = () => {
  const [activeSection, setActiveSection] = useState('information');
  const [expandedItems, setExpandedItems] = useState({});

  const privacyData = {
    information: {
      title: "Information Collection",
      icon: FileText,
      content: [
        {
          type: "provided",
          title: "Information You Provide",
          items: [
            "Personal Details: Your name, email address, phone number",
            "Location Data: Your precise delivery address and saved addresses",
            "Transaction Data: Your order history and payment details",
            "Communication: Records of customer support interactions"
          ]
        },
        {
          type: "automatic",
          title: "Information Collected Automatically",
          items: [
            "Device & App Information: Device type, OS, IP address",
            "Usage Data: How you interact with the app and features you use",
            "Location (GPS): For finding nearby stores and accurate delivery"
          ]
        },
        {
          type: "third-party",
          title: "Information from Third Parties",
          items: [
            "Social login information (Google, Facebook)",
            "Analytics and advertising data from partners",
            "Payment processing information"
          ]
        }
      ]
    },
    usage: {
      title: "How We Use Your Information",
      icon: Eye,
      content: [
        "Service Fulfillment: Process orders, deliver items, manage payments",
        "Customer Support: Respond to queries and refund requests",
        "Service Improvement: Analyze trends to improve functionality",
        "Personalization: Show relevant product recommendations",
        "Marketing: Send promotional alerts and updates (opt-out available)",
        "Security: Prevent fraudulent transactions and enhance platform security"
      ]
    },
    sharing: {
      title: "Information Sharing",
      icon: UserCheck,
      content: [
        {
          type: "delivery",
          title: "With Delivery Partners",
          text: "Your name, address, and phone number shared for order fulfillment"
        },
        {
          type: "providers",
          title: "With Service Providers",
          text: "Payment processors, cloud storage, analytics, and marketing partners"
        },
        {
          type: "legal",
          title: "For Legal Reasons",
          text: "When required by law, regulation, or legal process"
        },
        {
          type: "business",
          title: "Business Transfers",
          text: "In case of merger, acquisition, or sale of assets"
        }
      ]
    },
    security: {
      title: "Data Security",
      icon: Lock,
      content: [
        "Industry-standard security measures implemented",
        "Encryption (SSL) for data in transit",
        "Secure servers with access controls",
        "Regular security assessments and updates"
      ]
    },
    rights: {
      title: "Your Rights & Choices",
      icon: Shield,
      content: [
        "Access and correct your personal information",
        "Opt-out of marketing communications",
        "Request account and data deletion",
        "Control location permissions through device settings"
      ]
    }
  };

  const toggleItem = (section, index) => {
    setExpandedItems(prev => ({
      ...prev,
      [`${section}-${index}`]: !prev[`${section}-${index}`]
    }));
  };

  const renderContent = () => {
    const section = privacyData[activeSection];
    const IconComponent = section.icon;

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="bg-green-100 p-2 sm:p-3 rounded-full">
            <IconComponent size={20} className="text-green-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-green-800">{section.title}</h2>
        </div>

        {activeSection === 'information' && (
          <div className="space-y-3 sm:space-y-4">
            {section.content.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden transition-all hover:shadow-md">
                <button
                  className="flex justify-between items-center w-full px-4 sm:px-6 py-4 sm:py-5 text-left bg-white hover:bg-green-50 transition-colors"
                  onClick={() => toggleItem('information', index)}
                >
                  <span className="font-medium text-gray-800 text-sm sm:text-base">{item.title}</span>
                  <svg
                    className={`w-4 sm:w-5 h-4 sm:h-5 text-green-700 transform transition-transform ${expandedItems[`information-${index}`] ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedItems[`information-${index}`] && (
                  <div className="px-4 sm:px-6 py-3 sm:py-4 bg-green-50 border-t border-green-100">
                    <ul className="space-y-2">
                      {item.items.map((listItem, i) => (
                        <li key={i} className="text-gray-600 flex items-start text-sm sm:text-base">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 sm:mt-2 mr-2 flex-shrink-0"></span>
                          {listItem}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeSection === 'usage' && (
          <div className="space-y-3 sm:space-y-4">
            {section.content.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden transition-all hover:shadow-md">
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-green-50">
                  <p className="text-gray-600 flex items-start text-sm sm:text-base">
                    <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-500 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                    {item}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'sharing' && (
          <div className="space-y-3 sm:space-y-4">
            {section.content.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden transition-all hover:shadow-md">
                <button
                  className="flex justify-between items-center w-full px-4 sm:px-6 py-4 sm:py-5 text-left bg-white hover:bg-green-50 transition-colors"
                  onClick={() => toggleItem('sharing', index)}
                >
                  <span className="font-medium text-gray-800 text-sm sm:text-base">{item.title}</span>
                  <svg
                    className={`w-4 sm:w-5 h-4 sm:h-5 text-green-700 transform transition-transform ${expandedItems[`sharing-${index}`] ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedItems[`sharing-${index}`] && (
                  <div className="px-4 sm:px-6 py-3 sm:py-4 bg-green-50 border-t border-green-100">
                    <p className="text-gray-600 text-sm sm:text-base">{item.text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeSection === 'security' && (
          <div className="space-y-3 sm:space-y-4">
            {section.content.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden transition-all hover:shadow-md">
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-green-50">
                  <p className="text-gray-600 flex items-start text-sm sm:text-base">
                    <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-500 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                    {item}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'rights' && (
          <div className="space-y-3 sm:space-y-4">
            {section.content.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden transition-all hover:shadow-md">
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-green-50">
                  <p className="text-gray-600 flex items-start text-sm sm:text-base">
                    <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-500 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></span>
                    {item}
                  </p>
                </div>
              </div>
            ))}
            
            <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-start">
                <Mail size={18} className="text-green-600 mr-2 sm:mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">Contact Our Privacy Team</h4>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2">For any privacy-related questions or concerns, email us at:</p>
                  <a href="mailto:privacy@farmferry.com" className="text-green-600 font-medium text-xs sm:text-sm hover:text-green-800 transition-colors">
                    privacy@farmferry.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-800 mb-2">Account Privacy & Policy</h1>
            <p className="text-gray-600 text-sm sm:text-base">Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
          <div className="mt-3 sm:mt-0">
            <div className="flex items-center bg-green-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
              <Shield className="text-green-600 mr-1 sm:mr-2" size={18} />
              <span className="text-green-700 font-medium text-xs sm:text-sm">Your data is protected</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Navigation */}
        <nav className="lg:w-1/3 xl:w-1/4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
            <div className="space-y-2">
              {Object.keys(privacyData).map(key => {
                const IconComponent = privacyData[key].icon;
                return (
                  <button
                    key={key}
                    className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-xl transition-all text-left text-sm sm:text-base ${
                      activeSection === key
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveSection(key)}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <IconComponent size={18} className={activeSection === key ? "text-green-600" : "text-gray-500"} />
                      <span>{privacyData[key].title}</span>
                    </div>
                    <ArrowRight size={16} className={activeSection === key ? "text-green-600" : "text-gray-400"} />
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="lg:w-2/3 xl:w-3/4 bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          {renderContent()}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-green-50 rounded-xl border border-green-200">
        <div className="flex items-start">
          <Shield size={18} className="text-green-600 mr-2 sm:mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">FarmFerry Privacy Commitment</h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              We are committed to protecting your personal information and privacy. Our practices comply with applicable data protection regulations, and we continuously work to enhance our security measures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPrivacy;