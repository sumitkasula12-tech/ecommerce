import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Star, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Minus, Plus, Check } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);

        // Fetch related products in same category
        if (data.category) {
          const relatedRes = await API.get(`/products?category=${encodeURIComponent(data.category)}`);
          setRelatedProducts(relatedRes.data.filter(p => (p._id || p.id) !== id).slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="h-[450px] bg-gray-200 animate-pulse rounded-3xl" />
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4" />
            <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4" />
            <div className="h-24 bg-gray-200 animate-pulse rounded" />
            <div className="h-12 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-gray-500 text-sm">The product you are looking for might have been moved or removed.</p>
        <Link to="/explore" className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-bold">
          Return to Shop
        </Link>
      </div>
    );
  }

  const prodId = product._id || product.id;
  const isWishlisted = isInWishlist(prodId);
  const displayPrice = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;

  return (
    <div className="space-y-16">
      
      {/* Breadcrumb Navigation */}
      <nav className="text-xs font-semibold text-gray-400 flex items-center gap-2">
        <Link to="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <Link to="/explore" className="hover:text-black">Explore</Link>
        <span>/</span>
        <Link to={`/explore?category=${encodeURIComponent(product.category)}`} className="hover:text-black">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900 truncate">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Large Product Image Preview */}
        <div className="bg-gray-100 rounded-3xl overflow-hidden aspect-square border border-gray-100 shadow-sm relative group">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          {product.discountPrice && (
            <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
              Special Offer
            </span>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-8">
          
          {/* Category & Title */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {product.name}
            </h1>
            
            {/* Rating Stars */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(product.rating || 4.5)
                        ? 'fill-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-800">{product.rating || 4.8}</span>
              <span className="text-xs text-gray-400">({product.reviewsCount || 128} verified customer reviews)</span>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="flex items-center justify-between border-y border-gray-100 py-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-gray-900">${displayPrice.toFixed(2)}</span>
              {originalPrice && (
                <span className="text-base text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
              )}
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              <Check className="w-3.5 h-3.5" />
              <span>In Stock & Ready to Ship</span>
            </span>
          </div>

          {/* Product Description */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Color: <span className="text-gray-500 font-normal">{selectedColor}</span>
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedColor === color
                        ? 'bg-black text-white border-black shadow-sm'
                        : 'bg-white text-gray-800 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Select Size: <span className="text-gray-500 font-normal">{selectedSize}</span>
                </label>
                <a href="#size-guide" className="text-[11px] font-bold text-gray-500 underline">Size Guide</a>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-11 rounded-xl font-bold text-xs border flex items-center justify-center transition-all ${
                      selectedSize === size
                        ? 'bg-black text-white border-black shadow-md scale-105'
                        : 'bg-white text-gray-800 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              
              {/* Quantity Counter */}
              <div className="flex items-center border border-gray-200 rounded-full px-3 py-2 bg-gray-50 shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 hover:text-black text-gray-500"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 hover:text-black text-gray-500"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => addToCart(product, quantity, selectedSize, selectedColor)}
                className="flex-1 bg-black hover:bg-gray-800 text-white font-extrabold py-3.5 px-6 rounded-full text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Cart</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-500 border-rose-200 shadow-md'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-rose-400 hover:text-rose-500'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              </button>

            </div>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 text-center text-xs text-gray-600">
            <div className="flex flex-col items-center gap-1.5">
              <Truck className="w-5 h-5 text-gray-900" />
              <span className="font-semibold">Cash on Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-gray-900" />
              <span className="font-semibold">Authentic Quality</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <RefreshCw className="w-5 h-5 text-gray-900" />
              <span className="font-semibold">30-Day Easy Returns</span>
            </div>
          </div>

        </div>

      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-gray-100">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relProd) => (
              <ProductCard key={relProd._id || relProd.id} product={relProd} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
