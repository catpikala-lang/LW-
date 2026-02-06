// Facebook Conversion API (CAPI) Functions
const PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID || '';
// WARNING: এই token backend-এ রাখা safer, frontend-এ নয়
const ACCESS_TOKEN = import.meta.env.VITE_FB_ACCESS_TOKEN || '';

// SHA256 Hash Function (Phone/Email hash করার জন্য)
const hashData = (data) => {
  // Production-এ proper SHA256 hash করবে
  // এখনি test করার জন্য base64 encoding
  if (!data) return '';
  return btoa(data).replace(/[=+/]/g, '').substring(0, 20);
};

// Send Purchase Event to Facebook CAPI
export const sendPurchaseEvent = async (orderData) => {
  try {
    if (!ACCESS_TOKEN) {
      console.warn('Facebook Access Token not found. Skipping CAPI event.');
      return;
    }

    const eventData = {
      event_name: 'Purchase',
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: typeof window !== 'undefined' ? window.location.href : '',
      user_data: {
        ph: orderData.customerPhone ? [hashData(orderData.customerPhone)] : [],
        client_ip_address: '{{_CLIENT_IP_}}', // Facebook auto-fill করবে
        client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
      },
      custom_data: {
        value: orderData.amount,
        currency: 'BDT',
        order_id: orderData.orderId,
        content_ids: orderData.products?.map(p => p.id) || [],
        content_type: 'product',
        num_items: orderData.products?.length || 0
      }
    };

    const response = await fetch(`https://graph.facebook.com/v17.0/${PIXEL_ID}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [eventData],
        access_token: ACCESS_TOKEN,
      })
    });

    const result = await response.json();
    console.log('Facebook CAPI Response:', result);
    return result;
  } catch (error) {
    console.error('Facebook CAPI Error:', error);
    return null;
  }
};

