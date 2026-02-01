import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Toaster } from 'react-hot-toast';

// Strict Mode ছাড়াই রেন্ডার করা হচ্ছে যাতে ডেভেলপমেন্টে কোনো এরর বা ডাবল রেন্ডারিং সমস্যা না হয়
ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Toaster 
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#1a202c', // Dark theme matching your UI
          color: '#fff',
          borderRadius: '10px',
          padding: '16px',
        },
        success: {
          iconTheme: {
            primary: '#d69e2e', // Your accent color
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  </>
);