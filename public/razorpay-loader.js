// Razorpay script loader with fallback
(function() {
  // Check if Razorpay is already loaded
  if (window.Razorpay) {
    return;
  }

  // Create script element
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  script.crossOrigin = 'anonymous';
  
  // Add timeout handling
  let loaded = false;
  const timeout = setTimeout(() => {
    if (!loaded) {
      console.warn('Razorpay script failed to load within timeout');
      window.RazorpayLoadError = true;
    }
  }, 8000);

  script.onload = function() {
    loaded = true;
    clearTimeout(timeout);
    console.log('Razorpay script loaded successfully');
    window.RazorpayLoaded = true;
  };

  script.onerror = function() {
    loaded = true;
    clearTimeout(timeout);
    console.error('Failed to load Razorpay script');
    window.RazorpayLoadError = true;
  };

  // Append to head
  document.head.appendChild(script);
})();
