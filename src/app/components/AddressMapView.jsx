'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, X, ExternalLink, AlertCircle } from 'lucide-react';

const AddressMapView = ({ address, isOpen, onClose }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const waitForGoogleMaps = () => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve(window.google);
        return;
      }
      const interval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(interval);
          resolve(window.google);
        }
      }, 100);
      setTimeout(() => {
        clearInterval(interval);
        reject(new Error('Google Maps failed to load'));
      }, 10000); // Timeout after 10 seconds
    });
  };

  const initializeMap = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!mapRef.current) {
        console.error('Map container not found');
        setError('Map container not ready');
        setIsLoading(false);
        return;
      }

      const google = await waitForGoogleMaps();
      
      if (!mapRef.current) {
        console.error('Map container disappeared during initialization');
        setError('Map container not available');
        setIsLoading(false);
        return;
      }
      
      let coordinates = null;
      
      if (address.latitude && address.longitude) {
        coordinates = { lat: parseFloat(address.latitude), lng: parseFloat(address.longitude) };
      } else {
        const geocoder = new google.maps.Geocoder();
        const fullAddress = `${address.street}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`;
        
        try {
          const results = await new Promise((resolve, reject) => {
            geocoder.geocode({ address: fullAddress }, (results, status) => {
              if (status === 'OK' && results[0]) {
                resolve(results);
              } else {
                reject(new Error('Geocoding failed: ' + status));
              }
            });
          });
          
          coordinates = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };
        } catch (geocodeError) {
          console.error('Geocoding error:', geocodeError);
          setError('Could not locate this address on the map');
          setIsLoading(false);
          return;
        }
      }

      if (!mapRef.current) {
        console.error('Map container lost before map creation');
        setError('Map container unavailable');
        setIsLoading(false);
        return;
      }

      const mapInstance = new google.maps.Map(mapRef.current, {
        center: coordinates,
        zoom: 16,
        mapTypeControl: false,
        streetViewControl: true,
        fullscreenControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      const marker = new google.maps.Marker({
        position: coordinates,
        map: mapInstance,
        title: address.street,
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" fill="#16A34A" stroke="#FFFFFF" stroke-width="2"/>
              <circle cx="12" cy="10" r="3" fill="#FFFFFF"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 32)
        }
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #1f2937;">
              ${address.type.charAt(0).toUpperCase() + address.type.slice(1)} Address
            </h3>
            <p style="margin: 0; font-size: 12px; color: #4b5563; line-height: 1.4;">
              ${address.street}<br>
              ${address.city}, ${address.state}<br>
              ${address.postalCode}, ${address.country}
            </p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstance, marker);
      });

      setMap(mapInstance);
      setIsLoading(false);

    } catch (err) {
      console.error('Error loading map:', err);
      setError(
        err.message.includes('ApiNotActivatedMapError')
          ? 'Google Maps API is not activated. Please enable Maps JavaScript API, Places API, and Geocoding API.'
          : err.message.includes('API key')
          ? 'Invalid Google Maps API key. Please check your API key configuration.'
          : 'Failed to load map. Please check your internet connection and API configuration.'
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isOpen && address) {
      const timer = setTimeout(() => {
        if (isMounted) initializeMap();
      }, 100);
      return () => {
        clearTimeout(timer);
        isMounted = false;
      };
    }
  }, [isOpen, address]);

  const openInGoogleMaps = () => {
    const fullAddress = `${address.street}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`;
    const encodedAddress = encodeURIComponent(fullAddress);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              {address.type.charAt(0).toUpperCase() + address.type.slice(1)} Address
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openInGoogleMaps}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Open in Google Maps"
            >
              <ExternalLink size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Address Info */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="text-sm text-gray-700 space-y-1">
            <p className="font-medium text-gray-800">{address.street}</p>
            <p>{address.city}, {address.state} - {address.postalCode}</p>
            <p>{address.country}</p>
            {address.phone && (
              <p className="flex items-center gap-1.5 mt-2">
                <span>📞</span>
                {address.phone}
              </p>
            )}
          </div>
        </div>

        {/* Map Container */}
        <div className="relative h-96">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <span className="text-gray-600">Loading map...</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center p-4">
              <div className="text-center">
                <MapPin size={48} className="text-gray-400 mx-auto mb-2" />
                <p className="text-red-600 text-sm">{error}</p>
                <button
                  onClick={openInGoogleMaps}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm underline"
                >
                  Open in Google Maps instead
                </button>
              </div>
            </div>
          )}

          <div
            ref={mapRef}
            className="w-full h-full"
            style={{ minHeight: '384px' }}
          />
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 flex justify-between items-center">
          <p className="text-xs text-gray-500">
            Click the marker for more details
          </p>
          <button
            onClick={openInGoogleMaps}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <ExternalLink size={14} />
            Open in Google Maps
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressMapView;