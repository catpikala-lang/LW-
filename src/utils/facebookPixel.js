// Facebook Pixel Events
export const FB_PIXEL_ID = '1429350568976516';

export const pageView = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

export const event = (name, options = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', name, options);
  }
};

// Common E-commerce Events
export const FBEvents = {
    // Add Payment Info
    addPaymentInfo: (value, currency = 'BDT') => {
      event('AddPaymentInfo', {
        value: value,
        currency: currency
      });
    },
  // View Content
  viewContent: (contentName, contentIds = []) => {
    event('ViewContent', {
      content_name: contentName,
      content_ids: contentIds,
      content_type: 'product'
    });
  },
  
  // Add to Cart
  addToCart: (value, currency, contentName, contentIds = []) => {
    event('AddToCart', {
      value: value,
      currency: currency,
      content_name: contentName,
      content_ids: contentIds,
      content_type: 'product'
    });
  },
  
  // Initiate Checkout
  initiateCheckout: (value, currency, contentIds = []) => {
    event('InitiateCheckout', {
      value: value,
      currency: currency,
      content_ids: contentIds,
      num_items: contentIds.length
    });
  },
  
  // Purchase
  purchase: (value, currency, contentIds = [], orderId) => {
    event('Purchase', {
      value: value,
      currency: currency,
      content_ids: contentIds,
      content_type: 'product',
      order_id: orderId
    });
  },
  
  // Complete Registration (for admin login)
  completeRegistration: () => {
    event('CompleteRegistration');
  }
};
