import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      if (isAuthenticated) {
        try {
          const { data } = await API.get('/wishlist');
          setWishlistItems(data.products || []);
        } catch (err) {
          console.error('Error fetching wishlist:', err);
        }
      } else {
        const local = localStorage.getItem('scollection_guest_wishlist');
        if (local) {
          try {
            setWishlistItems(JSON.parse(local));
          } catch (e) {
            setWishlistItems([]);
          }
        } else {
          setWishlistItems([]);
        }
      }
      setLoading(false);
    };

    fetchWishlist();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('scollection_guest_wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isAuthenticated]);

  const isInWishlist = (productId) => {
    return wishlistItems.some(p => (p._id || p.id) === productId);
  };

  const toggleWishlist = async (product) => {
    const prodId = product._id || product.id;
    const exists = isInWishlist(prodId);

    if (exists) {
      if (isAuthenticated) {
        try {
          const { data } = await API.delete(`/wishlist/${prodId}`);
          setWishlistItems(data.products || []);
          showToast(`Removed "${product.name}" from Wishlist`);
        } catch (err) {
          console.error('Error removing from wishlist:', err);
        }
      } else {
        setWishlistItems(prev => prev.filter(p => (p._id || p.id) !== prodId));
        showToast(`Removed "${product.name}" from Wishlist`);
      }
    } else {
      if (isAuthenticated) {
        try {
          const { data } = await API.post('/wishlist', { productId: prodId });
          setWishlistItems(data.products || []);
          showToast(`Added "${product.name}" to Wishlist ❤`);
        } catch (err) {
          console.error('Error adding to wishlist:', err);
        }
      } else {
        setWishlistItems(prev => [...prev, product]);
        showToast(`Added "${product.name}" to Wishlist ❤`);
      }
    }
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        isInWishlist,
        toggleWishlist,
        loading,
        toastMessage
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
