import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Truck, CreditCard, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Checkout() {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shippingFee = cartSubtotal >= 75 || cartItems.length === 0 ? 0 : 9.99;
  const totalAmount = cartSubtotal + shippingFee;

  // Form State
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address?.street || '',
    city: user?.address?.city || '',
    postalCode: user?.address?.postalCode || '',
    paymentMethod: 'Cash on Delivery'
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.customerName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.postalCode) {
      setErrorMessage('Please fill in all shipping details before placing order.');
      return;
    }

    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          product: item.product._id || item.product.id,
          name: item.product.name,
          image: item.product.image,
          price: item.product.discountPrice || item.product.price,
          size: item.size,
          color: item.color,
          quantity: item.quantity
        })),
        shippingAddress: {
          customerName: formData.customerName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode
        },
        paymentMethod: formData.paymentMethod,
        subtotal: cartSubtotal,
        shippingFee: shippingFee,
        totalAmount: totalAmount
      };

      const { data } = await API.post('/orders', orderPayload);
      
      // Clear cart
      clearCart();

      // Navigate to order confirmation
      navigate('/order-confirmation', { state: { order: data } });
    } catch (err) {
      console.error('Error placing order:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
        <p className="text-gray-500 text-sm">Add some items to your bag before checking out.</p>
        <button
          onClick={() => navigate('/explore')}
          className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-bold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-100 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Checkout</h1>
          <p className="text-sm text-gray-500">Provide shipping details to finalize your Cash on Delivery order.</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span>SSL Encrypted Checkout</span>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Customer Information & Shipping Form */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Customer Contact */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
            <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <span className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-xs">1</span>
              <span>Customer Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Full Name *</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="e.g. Alex Johnson"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@example.com"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 019-2834"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Shipping Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
            <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <span className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-xs">2</span>
              <span>Delivery Address</span>
            </h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Street Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Fashion Ave, Suite 400"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New York"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="10001"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method Selection */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
            <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <span className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-xs">3</span>
              <span>Payment Option</span>
            </h2>

            <div className="space-y-3">
              {/* Cash on Delivery (Selected) */}
              <label className="flex items-start gap-4 p-4 rounded-2xl border-2 border-black bg-gray-50/80 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={formData.paymentMethod === 'Cash on Delivery'}
                  onChange={handleChange}
                  className="mt-1 text-black focus:ring-black"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      Cash on Delivery (COD)
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Pay in cash when your parcel is delivered directly to your doorstep. No prepayment required.
                  </p>
                </div>
              </label>

              {/* Online Payment Gateway Preview */}
              <label className="flex items-start gap-4 p-4 rounded-2xl border border-gray-200 bg-white opacity-60 cursor-not-allowed">
                <input
                  type="radio"
                  name="paymentMethod"
                  disabled
                  className="mt-1"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-500 text-sm flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      Credit / Debit Card (Stripe / Gateway)
                    </span>
                    <span className="bg-gray-100 text-gray-500 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Online gateway integration architecture ready for future deployment.
                  </p>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Order Summary Side Column */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 sticky top-28">
          <h2 className="text-xl font-extrabold text-gray-900 border-b border-gray-100 pb-4">
            Order Summary ({cartItems.length})
          </h2>

          {/* Selected Product Thumbnails */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 rounded-xl object-cover bg-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 truncate">{item.product.name}</h4>
                  <p className="text-[11px] text-gray-500">Qty: {item.quantity} | Size: {item.size}</p>
                </div>
                <span className="text-xs font-extrabold text-gray-900">
                  ${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 text-xs border-t border-gray-100 pt-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-bold text-gray-900">${cartSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping Fee</span>
              <span className="font-bold text-gray-900">
                {shippingFee === 0 ? <span className="text-emerald-600 uppercase font-bold">Free</span> : `$${shippingFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Payment Method</span>
              <span className="font-bold text-gray-900">Cash on Delivery</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
            <span className="font-extrabold text-gray-900 text-sm">Total Amount</span>
            <span className="font-black text-2xl text-gray-900">${totalAmount.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-extrabold py-4 rounded-full text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
          >
            {loading ? (
              <span className="animate-pulse">Processing Order...</span>
            ) : (
              <>
                <span>Place Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-gray-400 leading-tight">
            By placing this order you agree to Scollection's terms of service and delivery terms.
          </p>
        </div>

      </form>
    </div>
  );
}
