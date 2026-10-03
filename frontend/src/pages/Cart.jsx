import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function Cart() {
  const { cartItems, cartSubtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const shippingCost = cartSubtotal >= 75 || cartItems.length === 0 ? 0 : 9.99;
  const grandTotal = cartSubtotal + shippingCost;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center py-12">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Your Shopping Cart is Empty</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Looks like you haven't added any clothing items to your bag yet. Explore our latest arrivals to get started!
          </p>
        </div>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-extrabold px-8 py-3.5 rounded-full text-sm shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Scollection Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-gray-500">You have {cartItems.length} unique item(s) in your bag.</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, index) => {
            const product = item.product;
            if (!product) return null;

            const prodId = product._id || product.id;
            const price = product.discountPrice || product.price || 0;
            const itemTotal = price * item.quantity;

            return (
              <div
                key={`${prodId}-${item.size}-${item.color}-${index}`}
                className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-6 transition-all hover:shadow-md"
              >
                {/* Product Thumbnail */}
                <Link to={`/product/${prodId}`} className="w-24 h-28 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 space-y-1.5 w-full text-center sm:text-left">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{product.category}</span>
                  <Link to={`/product/${prodId}`}>
                    <h3 className="font-bold text-gray-900 text-base hover:text-black line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-gray-500 font-semibold">
                    <span>Size: <strong className="text-gray-800">{item.size}</strong></span>
                    <span>•</span>
                    <span>Color: <strong className="text-gray-800">{item.color}</strong></span>
                  </div>
                  <div className="text-sm font-extrabold text-gray-900 pt-1">
                    ${price.toFixed(2)} <span className="text-xs font-normal text-gray-400">each</span>
                  </div>
                </div>

                {/* Quantity Controls & Subtotal */}
                <div className="flex items-center justify-between sm:flex-col sm:items-end w-full sm:w-auto gap-4 pt-4 sm:pt-0 border-t sm:border-0 border-gray-100">
                  <div className="flex items-center border border-gray-200 rounded-full px-2.5 py-1 bg-gray-50">
                    <button
                      onClick={() => updateQuantity(prodId, item.size, item.color, item.quantity - 1)}
                      className="p-1 text-gray-500 hover:text-black"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-bold text-xs">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(prodId, item.size, item.color, item.quantity + 1)}
                      className="p-1 text-gray-500 hover:text-black"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-extrabold text-gray-900">${itemTotal.toFixed(2)}</span>
                    <button
                      onClick={() => removeFromCart(prodId, item.size, item.color)}
                      className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-4">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 text-xs font-extrabold text-gray-700 hover:text-black"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 sticky top-28">
          <h2 className="text-xl font-extrabold text-gray-900 border-b border-gray-100 pb-4">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-bold text-gray-900">${cartSubtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-gray-600">
              <span className="flex items-center gap-1">
                <span>Shipping Fee</span>
                {cartSubtotal >= 75 && <Truck className="w-3.5 h-3.5 text-emerald-600" />}
              </span>
              <span className="font-bold text-gray-900">
                {shippingCost === 0 ? (
                  <span className="text-emerald-600 font-extrabold uppercase text-xs">Free</span>
                ) : (
                  `$${shippingCost.toFixed(2)}`
                )}
              </span>
            </div>

            {cartSubtotal < 75 && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 text-[11px] text-amber-800 font-semibold">
                Add ${(75 - cartSubtotal).toFixed(2)} more for <strong>Free Shipping</strong>!
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
            <span className="font-extrabold text-gray-900 text-base">Total Amount</span>
            <span className="font-black text-2xl text-gray-900">${grandTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-black hover:bg-gray-800 text-white font-extrabold py-4 rounded-full text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Cash on Delivery Verified & Safe</span>
          </div>
        </div>

      </div>

    </div>
  );
}
