import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import { User, Package, Heart, LogOut, Clock, CheckCircle2, ChevronRight, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserAccount() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile'

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const { data } = await API.get('/orders');
        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchUserOrders();
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-white text-black font-black text-2xl flex items-center justify-center shadow-md">
            {user?.name ? user.name[0] : 'U'}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">{user?.name}</h1>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="bg-white/10 hover:bg-rose-600/90 text-white font-bold px-5 py-2.5 rounded-full text-xs flex items-center gap-2 border border-white/20 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`font-extrabold text-sm px-5 py-2.5 rounded-full transition-all flex items-center gap-2 ${
            activeTab === 'orders' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`font-extrabold text-sm px-5 py-2.5 rounded-full transition-all flex items-center gap-2 ${
            activeTab === 'profile' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Details</span>
        </button>

        <Link
          to="/wishlist"
          className="font-extrabold text-sm px-5 py-2.5 rounded-full text-gray-600 hover:bg-gray-100 transition-all flex items-center gap-2 ml-auto"
        >
          <Heart className="w-4 h-4 text-rose-500" />
          <span className="hidden sm:inline">Wishlist</span>
        </Link>
      </div>

      {/* Tab Content */}
      {activeTab === 'orders' ? (
        <div className="space-y-6">
          {loadingOrders ? (
            <div className="space-y-4">
              {[1, 2].map(i => <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-3xl" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
              <Package className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-xl font-bold text-gray-900">No Orders Placed Yet</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                Once you place an order with Cash on Delivery, your full order history will appear here.
              </p>
              <Link to="/explore" className="inline-block bg-black text-white font-bold px-6 py-2.5 rounded-full text-xs">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id || order.orderNumber}
                  className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
                    <div>
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Order ID</span>
                      <span className="font-extrabold text-lg text-gray-900">{order.orderNumber}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{order.status || 'Processing'}</span>
                      </span>
                      <span className="font-black text-lg text-gray-900">${order.totalAmount?.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="space-y-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-12 rounded-lg object-cover bg-gray-100" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs text-gray-900 truncate">{item.name}</p>
                          <p className="text-[11px] text-gray-500">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                        </div>
                        <span className="text-xs font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-gray-500 border-t border-gray-50">
                    <span>Placed on: {new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="font-bold text-gray-800">Payment: {order.paymentMethod}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Profile Details Tab */
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm max-w-2xl space-y-6">
          <h3 className="text-xl font-extrabold text-gray-900 border-b border-gray-100 pb-4">Personal Details</h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Full Name</span>
                <span className="font-bold text-gray-900">{user?.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Email Address</span>
                <span className="font-bold text-gray-900">{user?.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Phone</span>
                <span className="font-bold text-gray-900">{user?.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
