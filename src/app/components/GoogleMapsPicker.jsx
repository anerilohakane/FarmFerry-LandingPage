'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Search, Crosshair, AlertCircle } from 'lucide-react';

const GoogleMapsPicker = ({ onLocationSelect, initialLocation = null, className = '' }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const autocompleteRef = useRef(null);
  const searchInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [searchValue, setSearchValue] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showMap, setShowMap] = useState(true); // Made map visible by default

  // Wait for Google Maps to load
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

  // Initialize Google Maps
  const initializeMap = async () => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
        throw new Error('Google Maps API key not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file.');
      }

      const google = await waitForGoogleMaps();

      // Default location (India center)
      const defaultCenter = initialLocation || { lat: 20.5937, lng: 78.9629 };

      // Initialize map
      const map = new google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: initialLocation ? 15 : 5,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'simplified' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      mapInstanceRef.current = map;

      // Initialize marker
      const marker = new google.maps.Marker({
        position: defaultCenter,
        map: map,
        draggable: true,
        title: 'Selected Location'
      });

      markerRef.current = marker;

      // Initialize autocomplete
      const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
        types: ['geocode', 'establishment'],
        componentRestrictions: { country: 'IN' },
        fields: ['address_components', 'formatted_address', 'geometry', 'name']
      });

      autocompleteRef.current = autocomplete;

      // Handle marker drag
      marker.addListener('dragend', () => {
        const position = marker.getPosition();
        const location = {
          lat: position.lat(),
          lng: position.lng()
        };
        handleLocationSelect(location);
      });

      // Handle map click
      map.addListener('click', (event) => {
        const location = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };
        marker.setPosition(location);
        handleLocationSelect(location);
      });

      // Handle autocomplete selection
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };

          map.setCenter(location);
          map.setZoom(15);
          marker.setPosition(location);
          handleLocationSelect(location, place);
        }
      });

      setIsLoading(false);
    } catch (err) {
      console.error('Error initializing Google Maps:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = async (location, place = null) => {
    setSelectedLocation(location);

    try {
      let addressDetails = {};

      if (place) {
        // Use place details if available
        addressDetails = extractAddressFromPlace(place);
      } else {
        // Reverse geocode to get address
        const google = window.google;
        const geocoder = new google.maps.Geocoder();

        const response = await new Promise((resolve, reject) => {
          geocoder.geocode({ location }, (results, status) => {
            if (status === 'OK' && results[0]) {
              resolve(results[0]);
            } else {
              reject(new Error('Geocoding failed'));
            }
          });
        });

        addressDetails = extractAddressFromPlace(response);
      }

      const locationData = {
        ...location,
        ...addressDetails
      };

      onLocationSelect && onLocationSelect(locationData);
    } catch (err) {
      console.error('Error getting address details:', err);
      onLocationSelect && onLocationSelect(location);
    }
  };

  // Extract address components from Google Places result
  const extractAddressFromPlace = (place) => {
    const components = place.address_components || [];
    const addressDetails = {
      formattedAddress: place.formatted_address || '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    };

    components.forEach(component => {
      const types = component.types;

      if (types.includes('street_number')) {
        addressDetails.street = component.long_name + ' ' + addressDetails.street;
      } else if (types.includes('route')) {
        addressDetails.street += component.long_name;
      } else if (types.includes('sublocality_level_1') || types.includes('sublocality')) {
        if (!addressDetails.street) addressDetails.street = component.long_name;
      } else if (types.includes('locality')) {
        addressDetails.city = component.long_name;
      } else if (types.includes('administrative_area_level_2') && !addressDetails.city) {
        addressDetails.city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        addressDetails.state = component.long_name;
      } else if (types.includes('postal_code')) {
        addressDetails.postalCode = component.long_name;
      } else if (types.includes('country')) {
        addressDetails.country = component.long_name;
      }
    });

    addressDetails.street = addressDetails.street.trim();
    return addressDetails;
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setCenter(location);
          mapInstanceRef.current.setZoom(15);
          markerRef.current.setPosition(location);
          handleLocationSelect(location);
        }

        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your current location. Please search for your address or click on the map.');
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  useEffect(() => {
    initializeMap();
  }, []);

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center gap-3 text-red-800">
          <AlertCircle size={24} />
          <div>
            <h3 className="font-semibold">Google Maps Error</h3>
            <p className="text-sm mt-1">{error}</p>
            <p className="text-xs mt-2 text-red-600">
              Please configure your Google Maps API key in the .env file.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Controls */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin size={20} className="text-green-600" />
          <h3 className="font-semibold text-gray-800">Select Location on Map</h3>
        </div>

        <div className="flex gap-2">
          {/* <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for an address..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div> */}

          {/* <button
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
            title="Use current location"
          >
            {isGettingLocation ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Crosshair size={18} />
            )}
          </button> */}
        </div>

        <p className="text-sm text-gray-600">
          Search for an address, click on the map, or drag the marker to select your location.
        </p>
      </div>

      {/* Map Container */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}

        <div
          ref={mapRef}
          className="w-full h-80 rounded-lg border border-gray-300"
          style={{ minHeight: '320px' }}
        />

        {/* Floating current location button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="p-3 rounded-full bg-white text-green-600 hover:bg-green-50 disabled:bg-gray-200 shadow-md border border-gray-300 transition-colors flex items-center justify-center"
            title="Use current location"
          >
            {isGettingLocation ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
            ) : (
              <Crosshair size={20} />
            )}
          </button>
        </div>
      </div>



      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MapPin size={20} className="text-green-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-green-800 mb-1">Selected Location</h4>
              <p className="text-sm text-green-700">
                Latitude: {selectedLocation.lat?.toFixed(6)}, Longitude: {selectedLocation.lng?.toFixed(6)}
              </p>
              {selectedLocation.formattedAddress && (
                <p className="text-sm text-green-700 mt-1">
                  {selectedLocation.formattedAddress}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMapsPicker;