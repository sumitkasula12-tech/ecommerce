import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const prodId = product._id || product.id;
  const isWishlisted = isInWishlist(prodId);

  const displayPrice = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
      
      {/* Image & Badges Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link to={`/product/${prodId}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Category Tag */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-gray-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
          {product.category}
        </span>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-3 right-12 bg-rose-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm animate-pulse">
            -{discountPercent}%
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isWishlisted
              ? 'bg-rose-50 text-rose-500 shadow-md'
              : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:text-rose-500 hover:bg-white'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Information */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-gray-800">{product.rating || 4.5}</span>
            <span className="text-[11px] text-gray-400">({product.reviewsCount || 24})</span>
          </div>

          {/* Title */}
          <Link to={`/product/${prodId}`}>
            <h3 className="font-bold text-gray-900 group-hover:text-black line-clamp-1 text-base transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Available Sizes preview */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] uppercase font-bold text-gray-400">Sizes:</span>
              <div className="flex gap-1">
                {product.sizes.slice(0, 4).map((s) => (
                  <span key={s} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-semibold">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold text-gray-900">${displayPrice.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1, product.sizes ? product.sizes[0] : 'M', product.colors ? product.colors[0] : 'Default')}
            className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-xs font-bold px-3.5 py-2 rounded-full transition-all active:scale-95 shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

      </div>

    </div>
  );
}
