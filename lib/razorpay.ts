/**
 * Dynamically loads the Razorpay checkout script
 * @returns Promise<boolean> - true if loaded successfully, false otherwise
 */
export const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};
