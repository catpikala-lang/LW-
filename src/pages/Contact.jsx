import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900 text-center">যোগাযোগ করুন</h1>
      <div className="bg-white rounded-2xl shadow-xl border p-8 flex flex-col gap-8 items-center">
        <a
          href="https://www.facebook.com/leatherwallah"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-blue-600 hover:text-blue-800 text-lg font-bold"
        >
          <FaFacebook className="w-7 h-7" /> Facebook Page
        </a>
        <a
          href="https://www.instagram.com/leatherwallahbd/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-pink-500 hover:text-pink-700 text-lg font-bold"
        >
          <FaInstagram className="w-7 h-7" /> Instagram
        </a>
        <a
          href="https://wa.me/8801956869107"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-green-600 hover:text-green-800 text-lg font-bold"
        >
          <FaWhatsapp className="w-7 h-7" /> WhatsApp: 01956-869107
        </a>
      </div>
    </div>
  );
}
