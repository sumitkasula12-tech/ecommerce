import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Sparkles, Flame, Tag, ShoppingBag, ShieldCheck, RefreshCw } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          API.get('/products'),
          API.get('/products/categories')
        ]);
        setProducts(prodRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);
  const popularProducts = products.filter(p => p.isPopular).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24">

      {/* Hero / Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gray-900 text-white min-h-[500px] flex items-center shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80"
          alt="Scollection Fashion Banner"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        <div className="relative z-20 max-w-2xl px-6 sm:px-12 py-16 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider text-amber-300 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SCOLLECTION 2026 AUTUMN RELEASE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Redefine Your <br />
            <span className="text-transparent  text-white">
              Everyday Style
            </span>
          </h1>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl">
            Discover versatile essentials, statement outerwear, and premium cotton basics designed for maximum comfort and contemporary elegance.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/explore"
              className="bg-white hover:bg-gray-100 text-gray-900 font-bold px-7 py-3.5 rounded-full text-sm flex items-center gap-2 shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Collection</span>
            </Link>
            <Link
              to="/explore?category=Women"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-full text-sm border border-white/20 backdrop-blur-md transition-all"
            >
              Shop Women
            </Link>
          </div>
        </div>
      </section>

      {/* Category Cards Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Shop by Category</h2>
            <p className="text-sm text-gray-500">Explore tailored lines crafted for every moment.</p>
          </div>
          <Link to="/explore" className="text-xs sm:text-sm font-bold text-gray-900 hover:text-gray-600 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id || cat.slug}
              to={`/explore?category=${encodeURIComponent(cat.name)}`}
              className="group relative h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
                <div className="text-white">
                  <h3 className="font-bold text-base leading-tight group-hover:text-amber-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-gray-300 font-medium">Explore Line →</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Featured Highlights</h2>
          </div>
          <Link to="/explore" className="text-xs sm:text-sm font-bold text-gray-900 hover:text-gray-600 flex items-center gap-1">
            <span>Shop All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Callout Banner */}
      <section className="bg-black text-white rounded-3xl p-8 sm:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
            <Tag className="w-3.5 h-3.5" />
            <span>LIMITED TIME PROMO</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold">Get 20% Off Your First Order</h3>
          <p className="text-white/90 text-sm max-w-lg">
            Sign up today and experience luxury fabrics with fast Cash on Delivery shipping right to your doorstep.
          </p>
        </div>
        <Link
          to="/login"
          className="bg-white text-gray-900 hover:bg-gray-100 font-extrabold px-8 py-4 rounded-full text-sm shadow-md transition-transform transform hover:scale-105 shrink-0"
        >
          Claim Discount Now
        </Link>
      </section>

      {/* New Arrivals Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">New Arrivals</h2>
          </div>
          <Link to="/explore?sort=newest" className="text-xs sm:text-sm font-bold text-gray-900 hover:text-gray-600 flex items-center gap-1">
            <span>Explore New</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map(product => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Most Popular</h2>
            <p className="text-sm text-gray-500">Top-rated items loved by our community.</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {popularProducts.map(product => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
