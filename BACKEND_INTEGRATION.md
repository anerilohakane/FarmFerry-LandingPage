# Backend Integration for FarmFerry Landing Page

## Overview
The CategorySection and products page have been fully integrated with the backend to make them dynamic. All category and product data is now fetched from the backend API.

## API Integration

### Environment Setup
Create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:9000/api/v1
```

### API Endpoints Used

#### Categories
- `GET /categories` - Get all categories with optional filters
- `GET /categories/:id` - Get specific category details
- `GET /categories/tree` - Get category hierarchy

#### Products
- `GET /products` - Get all products with optional filters
- `GET /products/:id` - Get specific product details

### Data Flow

#### CategorySection Component
1. **Fetches root categories** (parent = null) on component mount
2. **Displays categories** with images from backend or fallback images
3. **Handles loading states** with skeleton animations
4. **Error handling** with retry functionality
5. **Navigation** to products page with category ID

#### Products Page
1. **URL Parameters** - Reads category and categoryId from URL
2. **Fetches category data** - Category details, subcategories, and products
3. **Dynamic subcategories** - Shows subcategories based on selected category
4. **Product filtering** - Real-time search and price filtering
5. **Loading states** - Skeleton screens during data fetching

### Backend Data Structure

#### Category Model
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  image: {
    url: String,
    publicId: String
  },
  parent: ObjectId (reference to parent category),
  isActive: Boolean,
  createdBy: ObjectId (reference to admin)
}
```

#### Product Model
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  quantity: String,
  images: [{
    url: String,
    publicId: String
  }],
  categoryId: ObjectId (reference to category),
  supplierId: ObjectId (reference to supplier),
  isActive: Boolean
}
```

### Features Implemented

#### CategorySection
- ✅ **Dynamic categories** from backend
- ✅ **Fallback images** for categories without images
- ✅ **Loading states** with skeleton animations
- ✅ **Error handling** with retry button
- ✅ **Responsive design** with hover effects
- ✅ **Navigation** to products page

#### Products Page
- ✅ **Dynamic subcategories** based on selected category
- ✅ **Real-time product fetching** from backend
- ✅ **Search functionality** across product names
- ✅ **Price filtering** with min/max range
- ✅ **Sorting options** (name, price low/high)
- ✅ **Loading states** for all interactions
- ✅ **Error handling** with retry functionality
- ✅ **Responsive product grid**

### API Service

The `src/utils/api.js` file provides a centralized API service with:
- **Base URL configuration** from environment variables
- **Error handling** for all API requests
- **Request/response interceptors**
- **Category and product API methods**

### Usage Examples

#### Fetching Categories
```javascript
const response = await apiService.getAllCategories({
  parent: 'null',
  includeInactive: 'false'
});
```

#### Fetching Products by Category
```javascript
const response = await apiService.getProductsByCategory(categoryId);
```

#### Fetching Category Details
```javascript
const response = await apiService.getCategoryById(categoryId);
```

### Error Handling

The integration includes comprehensive error handling:
- **Network errors** - Retry functionality
- **API errors** - User-friendly error messages
- **Loading states** - Skeleton screens
- **Empty states** - Helpful messages when no data

### Performance Optimizations

- **Memoized filtering** - Efficient product filtering and sorting
- **Lazy loading** - Images load on demand
- **Skeleton screens** - Better perceived performance
- **Error boundaries** - Graceful error handling

### Backend Requirements

Ensure your backend has:
1. **CORS enabled** for frontend domain
2. **Category endpoints** working properly
3. **Product endpoints** with category filtering
4. **Image upload** functionality for categories and products
5. **Authentication** (if required for admin features)

### Testing the Integration

1. **Start the backend** server on port 9000
2. **Set environment variable** `NEXT_PUBLIC_API_BASE_URL`
3. **Start the frontend** with `npm run dev`
4. **Navigate to landing page** and click categories
5. **Verify dynamic loading** of categories and products

The CategorySection is now fully dynamic and integrated with your backend API! 