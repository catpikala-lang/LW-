import { useState } from 'react';
import { Filter, Grid, List, Search } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';

export default function Shop() {
  const { 
    products, 
    loading, 
    selectedCategory, 
    setSelectedCategory,
    productCounts 
  } = useProducts();
  
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Search functionality
  const searchedProducts = searchQuery 
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Shop Leather Products</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Premium leather goods handcrafted with traditional techniques
        </p>
      </div>

      {/* Top Controls Bar */}
      <div className="bg-white rounded-xl shadow-lg p-2 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          {/* Left Side: Search */}
          <div className="relative flex-1 max-w-xl w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products (e.g., 'chelsea', 'wallet', 'belt')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-2 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm sm:text-base"
            />
          </div>

          {/* Right Side: Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* View Toggle */}
            <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 sm:p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 sm:p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg"
            >
              <Filter className="w-5 h-5" />
              <span>Categories</span>
            </button>

            {/* Results Count */}
            <div className="hidden md:block text-sm text-gray-600">
              <span className="font-semibold">{searchedProducts.length}</span> products found
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Sidebar - Mobile */}
        <div className={`sm:hidden ${showSidebar ? 'block' : 'hidden'} mb-4 sm:mb-6`}>
          <Sidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            productCounts={productCounts}
          />
        </div>

        {/* Sidebar - Desktop */}
        <div className="hidden sm:block">
          <Sidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            productCounts={productCounts}
          />
        </div>

        {/* Products Area */}
        <div className="flex-1">
          {/* Category Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">
                {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                <span className="ml-2 text-lg text-gray-500">
                  ({searchedProducts.length})
                </span>
              </h2>
              
              {/* Category Description */}
              {selectedCategory !== 'All' && (
                <p className="text-gray-600 text-sm">
                  Premium {selectedCategory.toLowerCase()} collection
                </p>
              )}
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategory !== 'All' && (
                <span className="px-3 py-1 bg-primary text-white rounded-full text-sm flex items-center">
                  {selectedCategory}
                  <button 
                    onClick={() => setSelectedCategory('All')}
                    className="ml-2 hover:text-gray-200"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="px-3 py-1 bg-accent text-white rounded-full text-sm flex items-center">
                  Search: "{searchQuery}"
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="ml-2 hover:text-gray-200"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>

          {/* Products Grid/List */}
          {loading ? (
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' : 'space-y-4'} gap-6`}>
              {[1, 2, 3, 4, 5, 6].map(item => (
                <div key={item} className={`bg-white rounded-xl shadow-lg overflow-hidden animate-pulse ${viewMode === 'list' ? 'flex' : ''}`}>
                  <div className={`${viewMode === 'list' ? 'w-48' : 'h-64'} bg-gray-200`}></div>
                  <div className="p-4 flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchedProducts.length > 0 ? (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {searchedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
              
              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-4">
                  {searchedProducts.map(product => (
                    <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition-shadow">
                      <div className="md:w-48 h-48 md:h-auto overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x400?text=Leather+Wallah';
                          }}
                        />
                      </div>
                      <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{product.name}</h3>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              {product.category}
                            </span>
                          </div>
                          <span className="text-2xl font-bold text-accent">
                            ৳{product.price.toLocaleString('bn-BD')}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            {product.sizes && (
                              <div className="text-sm text-gray-500 mb-2">
                                Available Sizes: {product.sizes.join(', ')}
                              </div>
                            )}
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="btn-secondary px-6">View Details</button>
                            <button className="btn-primary px-6" disabled={!product.inStock}>
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <div className="text-5xl mb-4">👔</div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Try a different category or search term</p>
              <div className="space-x-3">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="btn-secondary"
                >
                  Show All Products
                </button>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}