import { categories } from '../firebase/demoData';
import { Filter, Tag, ChevronRight } from 'lucide-react';

export default function Sidebar({ selectedCategory, setSelectedCategory, productCounts }) {
  return (
    <div className="w-full md:w-64 bg-white rounded-xl shadow-lg p-6 h-fit sticky top-24">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6 pb-4 border-b">
        <Filter className="w-5 h-5 text-accent" />
        <h2 className="text-xl font-bold text-primary">Categories</h2>
      </div>
      
      {/* Category List */}
      <div className="space-y-2">
        {categories.map(category => {
          const count = productCounts[category] || 0;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === 'All Products' ? 'All' : category)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                (selectedCategory === category || 
                 (category === 'All Products' && selectedCategory === 'All'))
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Tag className={`w-4 h-4 ${
                  (selectedCategory === category || 
                   (category === 'All Products' && selectedCategory === 'All'))
                    ? 'text-white'
                    : 'text-gray-400'
                }`} />
                <span className="font-medium">{category}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  (selectedCategory === category || 
                   (category === 'All Products' && selectedCategory === 'All'))
                    ? 'bg-white/20'
                    : 'bg-gray-100'
                }`}>
                  {count}
                </span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Divider */}
      <div className="my-6 border-t"></div>
      
      {/* Featured Info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2 flex items-center">
          <Tag className="w-4 h-4 mr-2 text-accent" />
          Why Leather Wallah?
        </h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 100% Genuine Leather</li>
          <li>• 1 Year Warranty</li>
          <li>• Free Shipping</li>
          <li>• Easy Returns</li>
        </ul>
      </div>
    </div>
  );
}