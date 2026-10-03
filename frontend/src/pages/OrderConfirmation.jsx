import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, Truck, Calendar, MapPin, ArrowRight, User } from 'lucide-react';

export default function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6">
      
      {/* Celebration Header */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3.5 py-1 rounded-full">
            ORDER PLACED SUCCESSFULLY
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight pt-2">
            Thank You For Your Order!
          </h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            We have received your order. Our team is preparing your apparel for dispatch.
          </p>
        </div>

        <div className="inline-block bg-gray-50 border border-gray-200 rounded-2xl px-6 py-3 text-center">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Order Reference Number</span>
          <span className="text-2xl font-black text-gray-900 tracking-wider">{order.orderNumber}</span>
        </div>
      </div>

      {/* Order Details Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <h2 className="text-xl font-extrabold text-gray-900 border-b border-gray-100 pb-4">
          Order Summary & Delivery Info
        </h2>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2 bg-gray-50 p-4 rounded-2xl">
            <h4 className="font-extrabold text-gray-900 flex items-center gap-2 text-xs uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-gray-700" />
              <span>Shipping Address</span>
            </h4>
            <p className="font-bold text-gray-900">{order.shippingAddress?.customerName}</p>
            <p className="text-xs text-gray-600">{order.shippingAddress?.address}</p>
            <p className="text-xs text-gray-600">
              {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
            </p>
            <p className="text-xs text-gray-600">Phone: {order.shippingAddress?.phone}</p>
          </div>

          <div className="space-y-2 bg-gray-50 p-4 rounded-2xl">
            <h4 className="font-extrabold text-gray-900 flex items-center gap-2 text-xs uppercase tracking-wider">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Payment & Status</span>
            </h4>
            <div className="space-y-1 text-xs">
              <p><span className="text-gray-500">Method:</span> <strong className="text-gray-900">{order.paymentMethod}</strong></p>
              <p><span className="text-gray-500">Status:</span> <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">{order.status || 'Processing'}</span></p>
              <p><span className="text-gray-500">Estimated Delivery:</span> <strong className="text-gray-900">3 - 5 Business Days</strong></p>
            </div>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <h4 className="font-extrabold text-gray-900 text-sm">Items Ordered:</h4>
          <div className="space-y-3">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl">
                <img src={item.image} alt={item.name} className="w-14 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h5 className="font-bold text-gray-900 text-sm">{item.name}</h5>
                  <p className="text-xs text-gray-500">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                </div>
                <span className="font-extrabold text-sm text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-right">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-bold text-gray-900">${order.subtotal?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span className="font-bold text-gray-900">
              {order.shippingFee === 0 ? 'FREE' : `$${order.shippingFee?.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-100">
            <span>Total Payable (COD)</span>
            <span className="text-xl">${order.totalAmount?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Navigation CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/explore"
          className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white font-extrabold px-8 py-3.5 rounded-full text-xs flex items-center justify-center gap-2 shadow-md transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
        <Link
          to="/account"
          className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-8 py-3.5 rounded-full text-xs flex items-center justify-center gap-2 transition-all"
        >
          <User className="w-4 h-4" />
          <span>View Order History</span>
        </Link>
      </div>

    </div>
  );
}
