import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    subtotal, 
    shipping, 
    total,
    totalItems 
  } = useCart();

  // যদি কার্ট খালি থাকে
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-16 sm:py-24 text-center">
        <div className="max-w-md w-full mx-auto">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 text-gray-800">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link to="/shop" className="btn-primary inline-flex items-center text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 rounded-xl transition-transform active:scale-95">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-gray-900">Shopping Cart</h1>
      <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
        You have <span className="text-accent font-bold">{totalItems}</span> {totalItems === 1 ? 'item' : 'items'} in your cart
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Left: Cart Items List */}
        <div className="sm:col-span-2 lg:col-span-2">
          {/* Header for Desktop */}
          <div className="hidden sm:grid grid-cols-12 gap-2 sm:gap-4 pb-2 sm:pb-4 border-b mb-2 sm:mb-4 text-gray-500 font-semibold uppercase text-xs tracking-wider">
            <div className="col-span-6">Product Information</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-center">Total</div>
          </div>

          <div className="space-y-2 sm:space-y-4">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.size}-${item.color}`} 
                   className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 sm:p-4 md:p-6 transition-hover hover:shadow-md">
                <div className="flex flex-col sm:grid sm:grid-cols-12 sm:items-center gap-2 sm:gap-4">
                  
                  {/* Product Info */}
                  <div className="flex items-center space-x-4 md:col-span-6">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border">
                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Link to={`/product/${item.id}`} className="font-bold text-gray-900 hover:text-accent transition-colors">
                        {item.name}
                      </Link>
                      <div className="text-gray-500 text-sm">{item.category}</div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.size && (
                          <span className="px-2 py-0.5 bg-accent/5 text-accent rounded text-[10px] font-bold border border-accent/10">
                            SIZE: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold">
                            COLOR: {item.color}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="md:col-span-2 text-center">
                    <span className="md:hidden text-xs text-gray-400 block">Unit Price</span>
                    <span className="font-semibold text-gray-700">৳{item.price.toLocaleString('bn-BD')}</span>
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-2 flex flex-col items-center">
                    <span className="md:hidden text-xs text-gray-400 mb-1">Quantity</span>
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                        className="p-2 hover:text-accent disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                        className="p-2 hover:text-accent"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Item Total & Remove */}
                  <div className="md:col-span-2 flex flex-row md:flex-col items-center justify-between md:justify-center gap-2">
                    <div className="text-right md:text-center">
                      <span className="md:hidden text-xs text-gray-400 block">Total</span>
                      <span className="font-bold text-lg text-accent">
                        ৳{(item.price * item.quantity).toLocaleString('bn-BD')}
                      </span>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id, item.size, item.color)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Footer Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
            <Link to="/shop" className="text-gray-600 hover:text-accent font-semibold flex items-center transition-colors">
              <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
              Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-red-400 hover:text-red-600 font-medium flex items-center transition-colors text-sm"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Entire Cart
            </button>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-50 p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-4">Order Summary</h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">৳{subtotal.toLocaleString('bn-BD')}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Fee</span>
                <span className="font-bold text-gray-900">{shipping > 0 ? `৳${shipping}` : '৳০'}</span>
              </div>

              {shipping > 0 && (
                {/* Removed free shipping logic and text */}
              )}

              <div className="border-t border-dashed pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Grand Total</span>
                  <span className="text-2xl font-black text-accent">৳{total.toLocaleString('bn-BD')}</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1 text-right italic">*Inclusive of all taxes</p>
              </div>
            </div>

            {/* Proceed to Checkout Link Button */}
            <Link 
              to="/checkout" 
              className="btn-primary w-full py-4 text-lg font-bold rounded-xl shadow-lg shadow-accent/20 flex items-center justify-center transition-transform active:scale-95 mb-6"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>

            {/* Trust Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="flex -space-x-2">
                  {['bKash', 'Nagad', 'Rocket'].map(i => (
                    <div key={i} className="w-6 h-6 bg-white border rounded-full text-[8px] flex items-center justify-center font-bold text-gray-400">{i[0]}</div>
                  ))}
                </div>
                <span className="text-xs font-medium text-gray-500 text-center flex-1">Secure Payment Gateways</span>
              </div>
              <p className="text-[11px] text-gray-400 text-center px-4">
                By proceeding, you agree to our Terms of Service and Refund Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}