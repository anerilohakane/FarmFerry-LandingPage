'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, MapPin, Gift, HelpCircle, Shield, LogOut, ArrowRight, Package, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

const accountItems = [
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
  { id: 'gift-cards', label: 'E-Gift Cards', icon: Gift },
  { id: 'faqs', label: "FAQ'S", icon: HelpCircle },
  { id: 'privacy', label: 'Account Privacy', icon: Shield },
];

const MyAccount = () => {
  const { user, logout } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const section = searchParams.get('section') || 'orders'; // Default to 'orders'

  // Mock data for orders and addresses (replace with actual data from your backend)
  const [orders, setOrders] = useState([
    {
      id: 'ORD123',
      date: '2025-08-25',
      total: 599.50,
      status: 'Delivered',
      items: [
        { name: 'Fresh Tomatoes', qty: 2, price: 99.50 },
        { name: 'Organic Apples', qty: 1, price: 400.00 },
      ],
    },
    {
      id: 'ORD124',
      date: '2025-08-20',
      total: 249.75,
      status: 'Shipped',
      items: [
        { name: 'Spinach Bundle', qty: 1, price: 249.75 },
      ],
    },
  ]);

  const [addresses, setAddresses] = useState([
    {
      id: '1',
      type: 'Home',
      address: 'Parner Bhavan, 302, 3rd floor, Parner Bhavan, Parner Taluka Mitra Mandal Hostel, Dattraj Colony, Mangal Nagar, Wakad, Pimpri Chinchwad, Maharashtra',
      isDefault: true,
    },
  ]);

  const renderSectionContent = () => {
    switch (section) {
      case 'orders':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">My Orders</h3>
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <Package size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">You haven't placed any orders yet.</p>
                <Link href="/products" className="text-green-600 hover:underline mt-2 inline-block">
                  Shop Now
                </Link>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <div className="font-medium text-gray-800">Order #{order.id}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <Clock size={14} /> {order.date}
                      </div>
                    </div>
                    <div className="text-green-600 font-medium flex items-center gap-2">
                      <CheckCircle size={16} /> {order.status}
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>{item.name} x {item.qty}</span>
                        <span>₹{item.price.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-semibold text-gray-800 mt-3">
                      <span>Total</span>
                      <span>₹{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        );
      case 'addresses':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Saved Addresses</h3>
            {addresses.length === 0 ? (
              <div className="text-center py-8">
                <MapPin size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No saved addresses.</p>
                <button className="text-green-600 hover:underline mt-2">Add New Address</button>
              </div>
            ) : (
              addresses.map(address => (
                <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800 flex items-center gap-2">
                        {address.type}
                        {address.isDefault && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Default</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                    </div>
                    <button className="text-green-600 hover:underline text-sm">Edit</button>
                  </div>
                </div>
              ))
            )}
            <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 hover:bg-green-50 transition flex items-center justify-center">
              <Plus size={20} className="text-green-600 mr-2" />
              <span className="text-green-600 font-medium">Add new address</span>
            </button>
          </div>
        );
      case 'gift-cards':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">E-Gift Cards</h3>
            <div className="text-center py-8">
              <Gift size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No gift cards available.</p>
              <button className="text-green-600 hover:underline mt-2">Purchase Gift Card</button>
            </div>
          </div>
        );
      case 'faqs':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">FAQ'S</h3>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-800">How do I track my order?</h4>
                <p className="text-sm text-gray-600 mt-2">
                  You can track your order in the "My Orders" section. Select the order to view its status and tracking details.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-800">How can I update my address?</h4>
                <p className="text-sm text-gray-600 mt-2">
                  Go to "Saved Addresses" to add, edit, or delete your delivery addresses.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-800">What are the delivery charges?</h4>
                <p className="text-sm text-gray-600 mt-2">
                  Delivery charges vary based on your location and order total. Check the cart page for details.
                </p>
              </div>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Account Privacy</h3>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800">Manage Your Data</h4>
              <p className="text-sm text-gray-600 mt-2">
                You can manage your personal information, including email, phone number, and addresses, in the respective sections.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800">Data Sharing</h4>
              <p className="text-sm text-gray-600 mt-2">
                We do not share your personal data with third parties without your consent, except as required for order processing.
              </p>
            </div>
            <button className="text-red-600 hover:underline">Delete Account</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-4">
          <h1 className="text-2xl font-bold text-gray-800">My Account</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-green-100 p-3 rounded-full">
              <User size={32} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{user?.name || 'User'}</h2>
              <p className="text-gray-600">{user?.phone || '9322506730'}</p>
              <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 bg-white rounded-xl shadow-sm p-6">
            <div className="space-y-4">
              {accountItems.map(item => (
                <Link
                  key={item.id}
                  href={`/profile?section=${item.id}`}
                  className={`flex items-center justify-between p-4 border rounded-lg transition ${
                    section === item.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-500 hover:bg-green-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className="text-gray-600" />
                    <span className="text-gray-800 font-medium">{item.label}</span>
                  </div>
                  <ArrowRight size={18} className="text-gray-400" />
                </Link>
              ))}
              <button
                onClick={logout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors shadow-md"
              >
                Log Out
                <LogOut className="ml-2" size={18} />
              </button>
            </div>
          </div>

          <div className="md:w-2/3 bg-white rounded-xl shadow-sm p-6">
            {renderSectionContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyAccount;