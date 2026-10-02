import React from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { CheckCircle2, Heart } from 'lucide-react';

export default function ToastNotification() {
  const { toastMessage: cartToast } = useCart();
  const { toastMessage: wishlistToast } = useWishlist();

  const msg = cartToast || wishlistToast;

  if (!msg) return null;

  const isHeart = msg.includes('Wishlist');

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce transition-all duration-300">
      <div className="bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-gray-700">
        {isHeart ? (
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        )}
        <span>{msg}</span>
      </div>
    </div>
  );
}
