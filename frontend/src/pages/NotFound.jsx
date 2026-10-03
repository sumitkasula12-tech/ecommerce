import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center py-12">
      <div className="text-8xl font-black text-gray-200">404</div>
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900">Page Not Found</h1>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          The page you are trying to access does not exist or may have been relocated.
        </p>
      </div>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-black text-white font-bold px-7 py-3.5 rounded-full text-xs shadow-md hover:bg-gray-800 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
}
