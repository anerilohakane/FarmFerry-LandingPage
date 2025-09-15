'use client';

import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Home, Briefcase, MoreHorizontal, Edit3, Trash2, Star, CheckCircle, Loader2 } from 'lucide-react';
import AddressForm from './AddressForm';
import GoogleMapsPicker from './GoogleMapsPicker';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const AddressList = ({ showManagementOptions = true, selectedAddress = null, onSelectAddress = null, showAddNewButton = true }) => {
  const [addresses, setAddresses] = useState([]);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [settingDefaultId, setSettingDefaultId] = useState(null);

  const [newAddress, setNewAddress] = useState({
    type: 'home',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
    isDefault: false,
  });

  const addressTypeIcons = {
    home: <Home size={18} className="text-green-600" />,
    work: <Briefcase size={18} className="text-blue-600" />,
    other: <MoreHorizontal size={18} className="text-gray-600" />,
  };

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const savedTokens = localStorage.getItem('farmferry-tokens');
      const parsedTokens = savedTokens ? JSON.parse(savedTokens) : null;
      const token = parsedTokens?.accessToken;

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE}/customers/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setAddresses(data.data.customer?.addresses || []);
      } else {
        console.error('Error fetching addresses:', data.message);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    
    setDeletingId(addressId);
    try {
      const savedTokens = localStorage.getItem('farmferry-tokens');
      const parsedTokens = savedTokens ? JSON.parse(savedTokens) : null;
      const token = parsedTokens?.accessToken;

      const res = await fetch(`${API_BASE}/customers/address/${addressId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setAddresses(addresses.filter((addr) => addr._id !== addressId));
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete address');
      }
    } catch (err) {
      console.error('Error deleting address:', err);
      alert('Failed to delete address. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (addressId) => {
    setSettingDefaultId(addressId);
    try {
      const savedTokens = localStorage.getItem('farmferry-tokens');
      const parsedTokens = savedTokens ? JSON.parse(savedTokens) : null;
      const token = parsedTokens?.accessToken;

      const res = await fetch(`${API_BASE}/customers/address/${addressId}/default`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setAddresses((prev) =>
          prev.map((addr) => ({ ...addr, isDefault: addr._id === addressId }))
        );
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to set default address');
      }
    } catch (err) {
      console.error('Error setting default:', err);
      alert('Failed to set default address. Please try again.');
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setNewAddress({
      type: address.type,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault,
    });
    setShowAddAddressForm(true);
  };

  if (showAddAddressForm) {
    return (
      <AddressForm
        newAddress={newAddress}
        setNewAddress={setNewAddress}
        editingAddress={editingAddress}
        onCancel={() => {
          setShowAddAddressForm(false);
          setEditingAddress(null);
          setNewAddress({
            type: 'home',
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
            phone: '',
            isDefault: false,
          });
          fetchAddresses();
        }}
        onSuccess={() => {
          setShowAddAddressForm(false);
          setEditingAddress(null);
          fetchAddresses();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-green-800 flex items-center gap-2">
          <MapPin size={24} className="text-green-600" />
          Saved Addresses
        </h3>
        {showManagementOptions && showAddNewButton && (
          <button
            onClick={() => setShowAddAddressForm(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
          >
            <Plus size={18} />
            Add New Address
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200 p-6">
          <Loader2 size={48} className="animate-spin text-green-600 mb-4" />
          <span className="text-gray-600">Loading addresses...</span>
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-xl border border-gray-200">
          <div className="bg-green-50 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <MapPin size={48} className="text-green-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">No addresses saved</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Add an address to make your deliveries faster and easier.
          </p>
          {showManagementOptions && (
            <button
              onClick={() => setShowAddAddressForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md"
            >
              Add Your First Address
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Integrated GoogleMapsPicker for functional map */}
          {/* <GoogleMapsPicker
            onLocationSelect={(locationData) => console.log('Selected Location:', locationData)} // Handle selection as needed
          /> */}
          
          <div className="grid gap-4">
            {addresses.map((address) => (
              <div
                key={address._id}
                onClick={() => onSelectAddress && onSelectAddress(address)}
                className={`border rounded-xl p-5 transition-all cursor-pointer hover:shadow-md ${
                  address.isDefault
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                } ${
                  selectedAddress && selectedAddress._id === address._id 
                    ? 'border-green-500 bg-green-50 ring-2 ring-green-100 shadow-md' 
                    : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        {addressTypeIcons[address.type]}
                        <span className="font-medium text-gray-800 capitalize">
                          {address.type}
                        </span>
                      </div>
                      {address.isDefault && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle size={12} />
                          Default
                        </span>
                      )}
                    </div>

                    <div className="text-gray-700 space-y-1.5">
                      <p className="font-medium text-gray-800">{address.street}</p>
                      <p className="text-gray-600">
                        {address.city}, {address.state} - {address.postalCode}
                      </p>
                      <p className="text-gray-600">{address.country}</p>
                      {address.phone && (
                        <p className="flex items-center gap-1.5 mt-2 text-gray-600">
                          <span className="text-gray-400">📞</span>
                          {address.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {showManagementOptions && (
                    <div className="flex flex-col gap-2 ml-4">
                      {!address.isDefault && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetDefault(address._id);
                          }}
                          disabled={settingDefaultId === address._id}
                          className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Set as default"
                        >
                          {settingDefaultId === address._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Star size={16} />
                          )}
                        </button>
                      )}
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAddress(address);
                        }}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit address"
                      >
                        <Edit3 size={16} />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAddress(address._id);
                        }}
                        disabled={deletingId === address._id}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete address"
                      >
                        {deletingId === address._id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressList;