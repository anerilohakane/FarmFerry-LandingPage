'use client';

import React, { useState } from 'react';
import { ArrowLeft, MapPin, Home, Briefcase, MoreHorizontal } from 'lucide-react';

const AddressForm = ({ newAddress, setNewAddress, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveAddress = async () => {
    setIsSubmitting(true);
    try {
      const savedTokens = localStorage.getItem("farmferry-tokens");
      const parsedTokens = savedTokens ? JSON.parse(savedTokens) : null;
      const token = parsedTokens?.accessToken;

      if (!token) {
        alert("⚠️ Please login to save your address");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/customers/address`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newAddress),
        }
      );

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Unexpected response: ${text}`);
      }

      if (res.ok) {
        alert("✅ Address saved successfully!");
        setNewAddress({
          name: "",
          type: "home",
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
          phone: "",
          isDefault: false,
        });
        if (onCancel) onCancel();
      } else {
        alert(data?.message || "❌ Failed to save address");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("⚠️ Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addressTypeIcons = {
    home: <Home size={16} />,
    work: <Briefcase size={16} />,
    other: <MoreHorizontal size={16} />,
  };

  return (
    <div className="space-y-6 p-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition hover:text-gray-700"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <MapPin size={22} className="text-green-600" />
          Add New Address
        </h3>
        <div className="w-8"></div>
      </div>

      {/* Address Form Fields */}
      <div className="space-y-5">
        {/* Address Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address Type
          </label>
          <div className="flex flex-wrap gap-2">
            {['home', 'work', 'other'].map((type) => (
              <button
                key={type}
                onClick={() => setNewAddress({ ...newAddress, type })}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  newAddress.type === type
                    ? 'bg-green-100 text-green-800 border border-green-300 shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                }`}
              >
                {addressTypeIcons[type]}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Street */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street Address *
          </label>
          <input
            type="text"
            value={newAddress.street}
            onChange={(e) =>
              setNewAddress({ ...newAddress, street: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            placeholder="House no, Building name, Street"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              placeholder="City"
              required
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <input
              type="text"
              value={newAddress.state}
              onChange={(e) =>
                setNewAddress({ ...newAddress, state: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              placeholder="State"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Postal Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code *
            </label>
            <input
              type="text"
              value={newAddress.postalCode}
              onChange={(e) =>
                setNewAddress({ ...newAddress, postalCode: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              placeholder="Postal Code"
              required
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country *
            </label>
            <input
              type="text"
              value={newAddress.country}
              onChange={(e) =>
                setNewAddress({ ...newAddress, country: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              placeholder="Country"
              required
            />
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={newAddress.name}
            onChange={(e) =>
              setNewAddress({ ...newAddress, name: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            placeholder="Enter recipient name"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number (optional)
          </label>
          <input
            type="tel"
            value={newAddress.phone}
            onChange={(e) =>
              setNewAddress({ ...newAddress, phone: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            placeholder="+91 1234567890"
          />
          <p className="text-xs text-gray-500 mt-1">
            For delivery updates and notifications
          </p>
        </div>

        {/* Default Address Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="defaultAddress"
            checked={newAddress.isDefault}
            onChange={(e) =>
              setNewAddress({ ...newAddress, isDefault: e.target.checked })
            }
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="defaultAddress" className="ml-2 block text-sm text-gray-700">
            Set as default address
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveAddress}
          disabled={
            !newAddress.street ||
            !newAddress.city ||
            !newAddress.state ||
            !newAddress.postalCode ||
            !newAddress.country ||
            isSubmitting
          }
          class AguilarName={`flex-1 px-4 py-3 font-medium rounded-lg transition ${
            !newAddress.street ||
            !newAddress.city ||
            !newAddress.state ||
            !newAddress.postalCode ||
            !newAddress.country ||
            isSubmitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white shadow-md'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span className="ml-2">Saving...</span>
            </div>
          ) : (
            'Save Address'
          )}
        </button>
      </div>
    </div>
  );
};

export default AddressForm;