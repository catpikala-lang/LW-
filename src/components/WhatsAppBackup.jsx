import { useState } from 'react';
import toast from 'react-hot-toast';
import { MessageCircle, Smartphone, Mail } from 'lucide-react';

export default function WhatsAppBackup({ orderNumber, customerName }) {
  const [showAlternatives, setShowAlternatives] = useState(false);
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('কপি করা হয়েছে!');
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <MessageCircle className="w-6 h-6 text-green-500 mr-3" />
        <h3 className="font-semibold">WhatsApp এ মেসেজ করতে সমস্যা?</h3>
      </div>
      
      <p className="text-gray-600 mb-4">
        WhatsApp ওপেন না হলে নিচের বিকল্পগুলো ব্যবহার করুন:
      </p>
      
      <div className="space-y-3">
        <button
          onClick={() => copyToClipboard(`আমার অর্ডার নম্বর: ${orderNumber}, নাম: ${customerName}`)}
          className="w-full flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50"
        >
          <span className="flex items-center">
            <Smartphone className="w-5 h-5 mr-3 text-blue-500" />
            টেক্সট কপি করুন
          </span>
          <span className="text-sm text-blue-500">কপি</span>
        </button>
        
        <button
          onClick={() => window.location.href = `sms:016XXXXXXXX?body=অর্ডার: ${orderNumber}`}
          className="w-full flex items-center p-3 bg-white border rounded-lg hover:bg-gray-50"
        >
          <Mail className="w-5 h-5 mr-3 text-purple-500" />
          এসএমএস পাঠান
        </button>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        অথবা সরাসরি কল করুন: <strong>০১৬XX-XXXXXX</strong>
      </div>
    </div>
  );
}