import { useState, useEffect } from 'react';
import { demoProducts, categories } from '../firebase/demoData';
import { getAllProducts } from '../firebase/firestoreFunctions';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Products');

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        // Try Firebase first
        const result = await getAllProducts();
        if (result.success && result.products.length > 0) {
          setProducts(result.products);
        } else {
          // Fallback to demo data
          console.log('Using demo data');
          setProducts(demoProducts);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts(demoProducts);
      }
      setLoading(false);
    };
    loadProducts();
  }, []);

  // ক্যাটাগরি অনুযায়ী প্রোডাক্ট ফিল্টার করা
  const filteredProducts = selectedCategory === 'All Products' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // ফিচারড প্রোডাক্ট আলাদা করা
  const featuredProducts = products.filter(product => product.featured);

  // কোন ক্যাটাগরিতে কয়টি প্রোডাক্ট আছে তা গণনা করা
  const productCounts = {};
  categories.forEach(cat => {
    if (cat === 'All Products') {
      productCounts[cat] = products.length;
    } else {
      productCounts[cat] = products.filter(p => p.category === cat).length;
    }
  });

  return {
    products: filteredProducts,
    featuredProducts,
    loading,
    selectedCategory,
    setSelectedCategory,
    productCounts,
    allCategories: categories
  };
}