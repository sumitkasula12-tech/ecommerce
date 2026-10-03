import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingBag, Trash2, ArrowLeft, CheckCircle } from 'lucide-react';

export default function Wishlist() {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center py-12">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center">
          <Heart className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Your Wishlist is Empty</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Save your favorite fits by tapping the heart icon on any product card.
          </p>
        </div>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-extrabold px-8 py-3.5 rounded-full text-sm shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Discover Clothing</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Saved Favorites</h1>
        <p className="text-sm text-gray-500">You have saved {wishlistItems.length} item(s) to your wishlist.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((product) => {
          const prodId = product._id || product.id;
          const displayPrice = product.discountPrice || product.price;

          return (
            <div
              key={prodId}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <Link to={`/product/${prodId}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-rose-500 flex items-center justify-center shadow-md hover:scale-110 transition-all"
                  title="Remove from wishlist"
                >
                  <Heart className="w-4 h-4 fill-rose-500" />
                </button>
              </div>

              <div className="p-5 space-y-3 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{product.category}</span>
                  <Link to={`/product/${prodId}`}>
                    <h3 className="font-bold text-gray-900 text-base line-clamp-1 hover:text-black">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-emerald-600">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>In Stock</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                  <span className="font-extrabold text-lg text-gray-900">${displayPrice.toFixed(2)}</span>
                  <button
                    onClick={() => {
                      addToCart(product, 1, product.sizes ? product.sizes[0] : 'M', product.colors ? product.colors[0] : 'Default');
                    }}
                    className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-xs font-bold px-3.5 py-2 rounded-full transition-all active:scale-95 shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
