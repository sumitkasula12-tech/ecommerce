import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/api';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, X, ArrowUpDown, RefreshCw, AlertCircle } from 'lucide-react';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Filter States
  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('q') || '';
  const selectedSize = searchParams.get('size') || '';
  const selectedColor = searchParams.get('color') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = searchParams.get('sort') || 'popularity';

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams).toString();
      const [prodRes, catRes] = await Promise.all([
        API.get(`/products?${params}`),
        API.get('/products/categories')
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error('Error fetching explore products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = selectedCategory !== 'All' || searchQuery || selectedSize || selectedColor || minPrice || maxPrice;

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-3xl p-8 sm:p-10 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Explore Clothing Catalog</h1>
          <p className="text-gray-300 text-sm mt-1">Browse our complete lineup of premium streetwear & tailored fashion.</p>
        </div>

        {/* Search input in Explore header */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="Search by name or keyword..."
            value={searchQuery}
            onChange={(e) => updateParam('q', e.target.value)}
            className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:bg-white focus:text-black focus:placeholder-gray-400 transition-all"
          />
          {searchQuery ? (
            <button onClick={() => updateParam('q', '')} className="absolute right-3 top-3 text-gray-300 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          ) : (
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
          )}
        </div>
      </div>

      {/* Main Grid & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 sticky top-28">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter Products</span>
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categories</label>
            <div className="space-y-1">
              <button
                onClick={() => updateParam('category', 'All')}
                className={`w-full text-left text-sm py-1.5 px-3 rounded-xl font-semibold transition-all ${
                  selectedCategory === 'All' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id || cat.name}
                  onClick={() => updateParam('category', cat.name)}
                  className={`w-full text-left text-sm py-1.5 px-3 rounded-xl font-semibold transition-all ${
                    selectedCategory.toLowerCase() === cat.name.toLowerCase()
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Size</label>
            <div className="grid grid-cols-4 gap-2">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => updateParam('size', selectedSize === sz ? '' : sz)}
                  className={`text-xs font-bold py-2 rounded-xl border transition-all ${
                    selectedSize === sz
                      ? 'bg-black text-white border-black shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Popular Colors</label>
            <div className="flex flex-wrap gap-1.5">
              {['Black', 'White', 'Blue', 'Beige', 'Rose', 'Gray', 'Green'].map((col) => (
                <button
                  key={col}
                  onClick={() => updateParam('color', selectedColor === col ? '' : col)}
                  className={`text-xs font-semibold px-3 py-1 rounded-full border transition-all ${
                    selectedColor.toLowerCase() === col.toLowerCase()
                      ? 'bg-black text-white border-black'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Price Range ($)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => updateParam('minPrice', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-black"
              />
              <span className="text-gray-400 text-xs">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Control Bar: Active filters & Sorting */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            
            {/* Mobile Filter Drawer Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 bg-gray-100 text-gray-800 font-bold text-xs px-4 py-2 rounded-full hover:bg-gray-200"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter ({hasActiveFilters ? 'Active' : 'All'})</span>
            </button>

            {/* Product Count */}
            <div className="text-xs font-semibold text-gray-500">
              Showing <span className="text-gray-900 font-bold">{products.length}</span> items
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Sort by:</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="bg-gray-50 text-gray-900 font-semibold text-xs rounded-xl px-3 py-1.5 border border-gray-200 focus:outline-none focus:border-black"
              >
                <option value="popularity">Popularity</option>
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-400 font-bold">Active:</span>
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-black text-white text-xs px-3 py-1 rounded-full font-semibold">
                  Category: {selectedCategory}
                  <button onClick={() => updateParam('category', 'All')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-black text-white text-xs px-3 py-1 rounded-full font-semibold">
                  Query: "{searchQuery}"
                  <button onClick={() => updateParam('q', '')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedSize && (
                <span className="inline-flex items-center gap-1 bg-black text-white text-xs px-3 py-1 rounded-full font-semibold">
                  Size: {selectedSize}
                  <button onClick={() => updateParam('size', '')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedColor && (
                <span className="inline-flex items-center gap-1 bg-black text-white text-xs px-3 py-1 rounded-full font-semibold">
                  Color: {selectedColor}
                  <button onClick={() => updateParam('color', '')}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-rose-600 hover:underline font-bold ml-2"
              >
                Reset All
              </button>
            </div>
          )}

          {/* Product Grid / Empty State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-3xl" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4 my-8">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">No products found</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                We couldn't find any products matching your current filters or search term. Try resetting filters or searching with a different keyword.
              </p>
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 bg-black text-white font-bold px-6 py-2.5 rounded-full text-xs hover:bg-gray-800 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
