import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Phone, MapPin, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginRegister() {
  const [isRegister, setIsRegister] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/account';

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    if (isRegister) {
      if (!name) {
        setErrorMessage('Please provide your name.');
        setLoading(false);
        return;
      }

      const res = await register(name, email, password, phone, { street, city, postalCode });
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMessage(res.message);
      }
    } else {
      const res = await login(email, password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMessage(res.message);
      }
    }

    setLoading(false);
  };

  // Quick Demo Login for instant testing
  const handleQuickDemo = async () => {
    setLoading(true);
    setErrorMessage('');
    // Try login or register demo account
    let res = await login('demo@scollection.com', 'password123');
    if (!res.success) {
      res = await register('Demo Shopper', 'demo@scollection.com', 'password123', '+1 555-0199', {
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        postalCode: '97477'
      });
    }

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMessage(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto py-8 space-y-6">
      
      {/* Container Box */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mx-auto font-black text-xl shadow-md">
            U
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            {isRegister ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-gray-500">
            {isRegister
              ? 'Join Scollection to track orders & save items to your wishlist.'
              : 'Sign in to access your personal cart and saved clothing orders.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setErrorMessage(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              !isRegister ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setErrorMessage(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              isRegister ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Quick Demo Login Helper */}
        <button
          type="button"
          onClick={handleQuickDemo}
          className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Quick 1-Click Demo Login</span>
        </button>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegister && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isRegister}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-black"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Email Address *</label>
            <div className="relative">
              <input
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-black"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Password *</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-black"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          {isRegister && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="+1 555 0199"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-black"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-black"
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-black"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-extrabold py-3.5 rounded-full text-xs flex items-center justify-center gap-2 shadow-md transition-all pt-3"
          >
            {loading ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : (
              <>
                <span>{isRegister ? 'Create Account' : 'Sign In Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="text-center pt-2 text-xs text-gray-500">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setIsRegister(false); setErrorMessage(''); }}
                className="font-bold text-black hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => { setIsRegister(true); setErrorMessage(''); }}
                className="font-bold text-black hover:underline"
              >
                Create One Here
              </button>
            </p>
          )}
        </div>

      </div>

    </div>
  );
}
