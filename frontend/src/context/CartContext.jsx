import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Load cart on auth change
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      if (isAuthenticated) {
        try {
          const { data } = await API.get('/cart');
          setCartItems(data.items || []);
        } catch (err) {
          console.error('Error loading backend cart:', err);
        }
      } else {
        const localCart = localStorage.getItem('scollection_guest_cart');
        if (localCart) {
          try {
            setCartItems(JSON.parse(localCart));
          } catch (e) {
            setCartItems([]);
          }
        } else {
          setCartItems([]);
        }
      }
      setLoading(false);
    };

    fetchCart();
  }, [isAuthenticated, user]);

  // Save guest cart to localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('scollection_guest_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const addToCart = async (product, quantity = 1, size = 'M', color = 'Default') => {
    if (isAuthenticated) {
      try {
        const prodId = product._id || product.id;
        const { data } = await API.post('/cart', { productId: prodId, quantity, size, color });
        setCartItems(data.items || []);
        showToast(`Added "${product.name}" (${size}) to your Cart!`);
      } catch (err) {
        console.error('Error adding to API cart:', err);
      }
    } else {
      setCartItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (item) => (item.product._id === product._id || item.product.id === product.id) && item.size === size && item.color === color
        );

        if (existingIndex > -1) {
          const newItems = [...prevItems];
          newItems[existingIndex].quantity += quantity;
          return newItems;
        } else {
          return [...prevItems, { product, quantity, size, color }];
        }
      });
      showToast(`Added "${product.name}" (${size}) to your Cart!`);
    }
  };

  const updateQuantity = async (productId, size, color, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId, size, color);
    }

    if (isAuthenticated) {
      try {
        const { data } = await API.put(`/cart/${productId}`, { quantity, size, color });
        setCartItems(data.items || []);
      } catch (err) {
        console.error('Error updating cart item quantity:', err);
      }
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) => {
          const matchesProd = item.product._id === productId || item.product.id === productId;
          const matchesSize = !size || item.size === size;
          const matchesColor = !color || item.color === color;

          if (matchesProd && matchesSize && matchesColor) {
            return { ...item, quantity };
          }
          return item;
        })
      );
    }
  };

  const removeFromCart = async (productId, size, color) => {
    if (isAuthenticated) {
      try {
        let url = `/cart/${productId}`;
        const params = [];
        if (size) params.push(`size=${encodeURIComponent(size)}`);
        if (color) params.push(`color=${encodeURIComponent(color)}`);
        if (params.length > 0) url += `?${params.join('&')}`;

        const { data } = await API.delete(url);
        setCartItems(data.items || []);
        showToast('Item removed from cart');
      } catch (err) {
        console.error('Error removing cart item:', err);
      }
    } else {
      setCartItems((prevItems) =>
        prevItems.filter((item) => {
          const matchesProd = item.product._id === productId || item.product.id === productId;
          const matchesSize = !size || item.size === size;
          const matchesColor = !color || item.color === color;
          return !(matchesProd && matchesSize && matchesColor);
        })
      );
      showToast('Item removed from cart');
    }
  };

  const clearCart = () => {
    setCartItems([]);
    if (!isAuthenticated) {
      localStorage.removeItem('scollection_guest_cart');
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const cartSubtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.discountPrice || item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toastMessage
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
