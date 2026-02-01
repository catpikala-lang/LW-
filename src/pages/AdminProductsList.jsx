import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Edit, Trash2, Eye, EyeOff, Package, DollarSign, 
  Tag, Search, Filter, Plus, RefreshCw 
} from 'lucide-react';
import { getAllProducts, deleteProduct, updateProduct } from '../firebase/firestoreFunctions';

export default function AdminProductsList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    inStock: true
  });
  // Export Data modal state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportRange, setExportRange] = useState('');

  // Load products
  useEffect(() => {
    loadProducts();
  }, []);

  // Filter products
  useEffect(() => {
    let result = products;
    
    // Search filter
    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory]);

  const loadProducts = async () => {
    setLoading(true);
    const result = await getAllProducts();
    if (result.success) {
      setProducts(result.products);
      setFilteredProducts(result.products);
    }
    setLoading(false);
  };

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Delete "${productName}"? This action cannot be undone.`)) {
      const result = await deleteProduct(productId);
      if (result.success) {
        alert('Product deleted successfully');
        loadProducts();
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      inStock: product.inStock
    });
  };

  const saveEdit = async () => {
    if (!editingProduct) return;
    
    const result = await updateProduct(editingProduct.id, editForm);
    if (result.success) {
      alert('Product updated successfully');
      setEditingProduct(null);
      loadProducts();
    }
  };

  const toggleProductStatus = async (productId, currentStatus) => {
    const result = await updateProduct(productId, { inStock: !currentStatus });
    if (result.success) {
      loadProducts();
    }
  };

  const toggleFeatured = async (productId, currentFeatured) => {
    const result = await updateProduct(productId, { featured: !currentFeatured });
    if (result.success) {
      loadProducts();
    }
  };

  const categories = ['All', 'Leather Money Bag', 'Chelsea Boot', 'Oxford Shoe', 'Leather Belt', 'Leather Converse', 'Casual Shoe'];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Export Data Button */}
      <div className="flex justify-end mb-4">
        <button
          className="btn-primary px-4 py-2"
          onClick={() => setShowExportModal(true)}
        >
          Export Data
        </button>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Export Data</h2>
            <div className="space-y-3 mb-6">
              <button
                className="w-full px-4 py-2 border rounded hover:bg-gray-100"
                onClick={() => { setExportRange('today'); setShowExportModal(false); }}
              >
                Today
              </button>
              <button
                className="w-full px-4 py-2 border rounded hover:bg-gray-100"
                onClick={() => { setExportRange('last7'); setShowExportModal(false); }}
              >
                Last 7 Days
              </button>
              <button
                className="w-full px-4 py-2 border rounded hover:bg-gray-100"
                onClick={() => { setExportRange('month'); setShowExportModal(false); }}
              >
                This Month
              </button>
            </div>
            <button
              className="w-full px-4 py-2 border rounded text-gray-500 hover:bg-gray-50"
              onClick={() => setShowExportModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Products</h1>
          <p className="text-gray-600">Total Products: {products.length}</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button
            onClick={loadProducts}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={() => navigate('/admin/products')}
            className="btn-primary flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Search Products
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or description..."
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Quick Stats</div>
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{products.length}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {products.filter(p => p.inStock).length}
                </div>
                <div className="text-sm text-gray-600">In Stock</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {products.filter(p => !p.inStock).length}
                </div>
                <div className="text-sm text-gray-600">Out of Stock</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price (৳)</label>
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      {categories.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    rows="4"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.inStock}
                    onChange={(e) => setEditForm({...editForm, inStock: e.target.checked})}
                    className="w-5 h-5 text-accent rounded"
                    id="inStockEdit"
                  />
                  <label htmlFor="inStockEdit" className="ml-2">
                    In Stock
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="btn-primary px-6 py-2"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left">Product</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left">Stock</th>
                  <th className="p-4 text-left">Featured</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden mr-4">
                          <img
                            src={product.images?.[0] || product.thumbnails?.[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-sm text-gray-600 truncate max-w-xs">
                            {product.description.substring(0, 60)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4 font-semibold">
                      ৳{product.price?.toLocaleString('bn-BD')}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleProductStatus(product.id, product.inStock)}
                        className={`px-3 py-1 rounded-full text-sm flex items-center ${
                          product.inStock 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.inStock ? (
                          <>
                            <Eye className="w-4 h-4 mr-1" />
                            In Stock
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4 mr-1" />
                            Out of Stock
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleFeatured(product.id, product.featured)}
                        className={`p-2 rounded-full ${
                          product.featured 
                            ? 'bg-yellow-100 text-yellow-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}
                        title={product.featured ? "Remove from Home" : "Add to Home"}
                      >
                        {product.featured ? "⭐ Featured" : "★ Add to Home"}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== 'All' 
                ? 'Try changing your search filters' 
                : 'Add your first product'}
            </p>
            <button
              onClick={() => navigate('/admin/products')}
              className="btn-primary"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Add New Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
}