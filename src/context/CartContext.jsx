import { createContext, useContext, useState, useEffect } from 'react';
import { demoProducts } from '../firebase/demoData';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('leatherWallahCart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('leatherWallahCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product, quantity = 1, size = null, color = null) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        item => item.id === product.id && item.size === size && item.color === color
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item
        return [
          ...prevItems,
          {
            ...product,
            quantity,
            size,
            color,
            addedAt: new Date().toISOString()
          }
        ];
      }
    });
    
    // Open cart sidebar (optional)
    // setIsCartOpen(true);
  };

  // Remove item from cart
  const removeFromCart = (itemId, size = null, color = null) => {
    setCartItems(prevItems => 
      prevItems.filter(item => 
        !(item.id === itemId && item.size === size && item.color === color)
      )
    );
  };

  // Update item quantity
  const updateQuantity = (itemId, size, color, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId, size, color);
      return;
    }

    setCartItems(prevItems => 
      prevItems.map(item => 
        (item.id === itemId && item.size === size && item.color === color)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total items count
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity), 
    0
  );

  // Calculate total with shipping
  const shipping = subtotal > 3000 ? 0 : 120;
  const total = subtotal + shipping;

  // Toggle cart sidebar
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    shipping,
    total,
    isCartOpen,
    toggleCart,
    setIsCartOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}