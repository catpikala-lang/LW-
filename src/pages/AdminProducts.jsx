import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Package, DollarSign, Tag, Plus, Image as ImageIcon, X } from 'lucide-react';
import { uploadMultipleImages } from '../api/imgbb';
import { addProduct } from '../firebase/firestoreFunctions';

export default function AdminProducts() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Chelsea Boot',
    description: '',
    sizes: ['40', '41', '42', '43', '44'],
    colors: ['Black', 'Brown', 'Tan', 'Burgundy', 'Navy', 'Gray', 'Chocolate', 'Master'],
    inStock: true,
    featured: false
  });

  const categories = [
    'Leather Money Bag',
    'Chelsea Boot', 
    'Oxford Shoe',
    'Leather Belt',
    'Leather Converse',
    'Casual Shoe'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Simulate ImgBB upload (we'll implement real upload later)
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploaded: false,
      url: null
    }));
    
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if already 6 featured products
    if (formData.featured) {
      const { getAllProducts } = await import('../firebase/firestoreFunctions');
      const allProducts = await getAllProducts();
      const featuredCount = allProducts.products.filter(p => p.featured).length;
      if (featuredCount >= 6) {
        alert('Maximum 6 featured products allowed. Please unselect some existing featured products.');
        return;
      }
    }
    setLoading(true);

    try {
      // 1. Upload images to ImgBB
      const imageFiles = images.map(img => img.file);
      const uploadResult = await uploadMultipleImages(imageFiles);
      
      if (!uploadResult.success || uploadResult.images.length === 0) {
        throw new Error('Image upload failed: ' + (uploadResult.errors?.[0] || 'Unknown error'));
      }

      // 2. Prepare product data with ImgBB links
      const productData = {
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        description: formData.description,
        images: uploadResult.images, // ImgBB links
        thumbnails: uploadResult.thumbnails,
        sizes: formData.sizes,
        colors: formData.colors,
        inStock: formData.inStock,
        featured: formData.featured,
        createdAt: new Date().toISOString()
      };

      // 3. Save to Firebase (only data + ImgBB links)
      const saveResult = await addProduct(productData);
      
      if (saveResult.success) {
        alert(`✅ Product added successfully!\n\n` +
              `Name: ${formData.name}\n` +
              `Price: ৳${formData.price}\n` +
              `Category: ${formData.category}\n` +
              `Images Uploaded: ${uploadResult.images.length}`);
        setFormData({
          name: '',
          price: '',
          category: 'Chelsea Boot',
          description: '',
          sizes: ['40', '41', '42', '43', '44'],
          colors: ['Black', 'Brown', 'Tan', 'Burgundy', 'Navy', 'Gray', 'Chocolate', 'Master'],
          inStock: true,
          featured: false
        });
        setImages([]);
      } else {
        throw new Error('Firebase save failed: ' + saveResult.error);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('❌ Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Add New Product</h1>
            <p className="text-gray-600">Upload new products to your store</p>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className="btn-secondary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
            {/* Product Name & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Package className="w-4 h-4 inline mr-2" />
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="Black Leather Chelsea Boot"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Price (৳) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="3999"
                />
              </div>
            </div>

            {/* Category & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Tag className="w-4 h-4 inline mr-2" />
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Stock Status
                </label>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleChange}
                    className="w-5 h-5 text-accent rounded"
                    id="inStock"
                  />
                  <label htmlFor="inStock" className="ml-2">
                    In Stock
                  </label>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Product description..."
              />
            </div>

            {/* Sizes & Colors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Available Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {['38', '39', '40', '41', '42', '43', '44'].map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        const newSizes = formData.sizes.includes(size)
                          ? formData.sizes.filter(s => s !== size)
                          : [...formData.sizes, size];
                        setFormData({...formData, sizes: newSizes});
                      }}
                      className={`px-3 py-2 border rounded-lg ${
                        formData.sizes.includes(size)
                          ? 'bg-primary text-white border-primary'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Colors
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Black', 'Brown', 'Tan', 'Burgundy', 'Navy', 'Gray', 'Chocolate', 'Master'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        const newColors = formData.colors.includes(color)
                          ? formData.colors.filter(c => c !== color)
                          : [...formData.colors, color];
                        setFormData({...formData, colors: newColors});
                      }}
                      className={`px-3 py-2 border rounded-lg ${
                        formData.colors.includes(color)
                          ? 'bg-primary text-white border-primary'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={e => setFormData({...formData, featured: e.target.checked})}
                  className="w-5 h-5 text-accent rounded"
                  id="featured"
                />
                <label htmlFor="featured" className="ml-2">
                  Show on Home Page (Featured)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                  className="w-5 h-5 text-accent rounded"
                  id="inStock"
                />
                <label htmlFor="inStock" className="ml-2">
                  In Stock
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-lg flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                  Saving Product...
                </>
              ) : (
                <>
                  <Plus className="w-6 h-6 mr-2" />
                  Add Product to Store
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column - Image Upload */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Product Images</h2>
            
            {/* Image Upload Area */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-4">
                Upload Images (Max 5)
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag & drop images here</p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <label className="btn-secondary cursor-pointer inline-block">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  Browse Files
                </label>
                <p className="text-xs text-gray-500 mt-4">
                  Supported: JPG, PNG, WEBP (Max 5MB each)
                </p>
              </div>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4">Selected Images ({images.length}/5)</h3>
                <div className="grid grid-cols-2 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {img.uploaded && (
                        <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          Uploaded
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Tips */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">
                <ImageIcon className="w-4 h-4 inline mr-2" />
                Image Guidelines
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• First image will be main product image</li>
                <li>• Use high-quality images (min 800x600)</li>
                <li>• Show product from multiple angles</li>
                <li>• Use natural lighting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}