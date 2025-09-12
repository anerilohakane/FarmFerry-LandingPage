# Google Maps Integration Documentation

## Overview
This document describes the Google Maps integration implemented in the FarmFerry Landing Page for address selection and management.

## Components Added

### 1. GoogleMapsPicker.jsx
A comprehensive map picker component that allows users to:
- Search for addresses using Google Places Autocomplete
- Click on the map to select locations
- Drag markers to fine-tune location selection
- Get current location using browser geolocation
- Auto-fill address form fields with selected location data

**Features:**
- Real-time address geocoding and reverse geocoding
- Responsive design with loading states
- Error handling for API key issues
- Restricted to India for better performance
- Auto-extraction of address components (street, city, state, postal code, country)

### 2. AddressMapView.jsx
A map view component for displaying saved addresses:
- Shows all saved addresses as markers on the map
- Different marker colors for default vs regular addresses
- Interactive info windows with address details
- Toggle show/hide functionality
- Automatic map bounds adjustment to fit all addresses
- Click markers to select addresses

**Features:**
- Geocoding of existing addresses for map display
- Color-coded markers (green for default, blue for others)
- Info windows with complete address information
- Map legend for marker identification

### 3. Enhanced AddressForm.jsx
The address form now includes:
- Toggle button to show/hide Google Maps picker
- Integration with GoogleMapsPicker component
- Auto-fill functionality when location is selected from map
- Maintains existing manual input capabilities

### 4. Enhanced AddressList.jsx
The address list now includes:
- Integrated AddressMapView component
- Toggle to show/hide map view of all addresses
- Click on map markers to select addresses
- Maintains all existing address management features

## Configuration

### Environment Variables
Add to your `.env` file:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key_here
```

### Google Maps API Requirements
The integration requires the following Google Maps APIs to be enabled:
1. **Maps JavaScript API** - For map display
2. **Places API** - For address search and autocomplete
3. **Geocoding API** - For converting addresses to coordinates and vice versa

### API Key Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the required APIs mentioned above
4. Create credentials (API Key)
5. Restrict the API key to your domain for security
6. Add the API key to your `.env` file

## Usage

### In AddressForm
```jsx
// The map picker is automatically integrated
// Users can toggle map view and select locations
// Form fields auto-fill when location is selected from map
```

### In AddressList
```jsx
// Map view is automatically available
// Users can toggle to see all addresses on map
// Click markers to select addresses
```

## Features

### Address Selection
- **Search**: Type address in search box for autocomplete suggestions
- **Click**: Click anywhere on map to select location
- **Drag**: Drag the marker to fine-tune location
- **Current Location**: Use GPS to get current location

### Address Display
- **List View**: Traditional list of saved addresses
- **Map View**: Visual representation of all addresses on map
- **Toggle**: Easy switch between views
- **Selection**: Click markers or list items to select addresses

### Auto-fill Functionality
When a location is selected from the map:
- Street address is automatically filled
- City, state, postal code, and country are populated
- Users can still manually edit any field
- Maintains data accuracy and user control

## Error Handling

### API Key Issues
- Clear error messages when API key is missing or invalid
- Fallback to manual address entry
- User-friendly error display

### Geocoding Failures
- Graceful handling of addresses that cannot be geocoded
- Warnings in console for debugging
- Continues to show other addresses that geocode successfully

### Network Issues
- Loading states during API calls
- Timeout handling for slow connections
- Retry mechanisms where appropriate

## Security Considerations

### API Key Protection
- API key is stored in environment variables
- Should be restricted to specific domains in production
- Never commit actual API keys to version control

### Data Privacy
- Location data is only used for address selection
- No location tracking or storage beyond user addresses
- Complies with standard privacy practices

## Performance Optimizations

### Lazy Loading
- Maps only load when requested by user
- Components initialize only when needed
- Reduces initial page load time

### Caching
- Google Maps API handles caching automatically
- Address geocoding results are cached by browser
- Minimizes redundant API calls

### Bounds Optimization
- Map automatically adjusts to show all addresses
- Zoom levels optimized for single vs multiple addresses
- Efficient rendering of multiple markers

## Troubleshooting

### Common Issues
1. **Map not loading**: Check API key configuration
2. **Search not working**: Verify Places API is enabled
3. **Addresses not showing on map**: Check Geocoding API
4. **Console errors**: Review API key restrictions

### Debug Steps
1. Check browser console for error messages
2. Verify API key in `.env` file
3. Confirm APIs are enabled in Google Cloud Console
4. Test with a fresh browser session
5. Check network connectivity

## Future Enhancements

### Potential Improvements
- Offline map support
- Custom marker icons
- Address validation
- Bulk address import
- Export addresses to other formats
- Integration with delivery tracking

### Performance Enhancements
- Marker clustering for many addresses
- Progressive loading of map tiles
- Optimized geocoding batch requests
- Local storage caching of geocoded addresses

## Dependencies

### Required Packages
- `@googlemaps/js-api-loader`: For loading Google Maps API
- `lucide-react`: For icons
- `react`: Core React functionality

### Browser Requirements
- Modern browsers with JavaScript enabled
- Geolocation API support (optional, for current location)
- Internet connection for map tiles and API calls

## Support

For issues or questions regarding the Google Maps integration:
1. Check this documentation first
2. Review browser console for error messages
3. Verify API key and enabled services
4. Test with different addresses and locations
5. Check Google Maps API documentation for advanced features
