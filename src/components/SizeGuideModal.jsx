import { X } from 'lucide-react';

export default function SizeGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const sizeChart = [
    { bd: '40', uk: '6', us: '7', eu: '40' },
    { bd: '41', uk: '7', us: '8', eu: '41' },
    { bd: '42', uk: '8', us: '9', eu: '42' },
    { bd: '43', uk: '9', us: '10', eu: '43' },
    { bd: '44', uk: '10', us: '11', eu: '44' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full">
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-center">Size Guide</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">BD</th>
                <th className="p-2 border">UK</th>
                <th className="p-2 border">US</th>
                <th className="p-2 border">EU</th>
              </tr>
            </thead>
            <tbody>
              {sizeChart.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2 border font-bold">{row.bd}</td>
                  <td className="p-2 border">{row.uk}</td>
                  <td className="p-2 border">{row.us}</td>
                  <td className="p-2 border">{row.eu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <button onClick={onClose} className="w-full mt-6 btn-primary py-3">Got It</button>
      </div>
    </div>
  );
}