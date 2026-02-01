import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const phone = "8801956869107";
  const message = "Hello Leather Wallah, I need help with an order";
  
  const handleClick = () => {
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed bottom-10 right-6 z-[9999] flex flex-col items-end">
      {/* Tooltip Label - শুধু বড় স্ক্রিনে দেখাবে */}
      <div className="hidden md:block bg-white text-gray-800 text-sm font-semibold py-1 px-3 rounded-lg shadow-md mb-2 mr-1 border border-green-100 animate-bounce">
        Chat with us!
      </div>

      <button
        onClick={handleClick}
        className="group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-[0_10px_25px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="WhatsApp Chat"
      >
        {/* Glowing Animation Effect */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
        
        {/* WhatsApp Icon */}
        <MessageCircle className="w-8 h-8 md:w-9 md:h-9 relative z-10" />

        {/* Notification Dot */}
        <span className="absolute top-0 right-0 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] items-center justify-center font-bold">1</span>
        </span>
      </button>
    </div>
  );
}