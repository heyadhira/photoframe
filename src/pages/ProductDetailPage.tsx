import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingCart, Check } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { AuthContext } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { cartEvents } from '../utils/cartEvents';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, accessToken } = useContext(AuthContext);

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<'Rolled' | 'Canvas' | 'Frame'>('Rolled');
  const [selectedFrameColor, setSelectedFrameColor] = useState<'White' | 'Black' | 'Brown'>('Black');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();

      if (data.product) {
        setProduct(data.product);
        if (data.product.colors?.length > 0) {
          setSelectedColor(data.product.colors[0]);
        }
        if (data.product.sizes?.length > 0) {
          setSelectedSize(data.product.sizes[0]);
        }

        if (data.product.format) {
          setSelectedFormat(data.product.format);
        }
        if (data.product.frameColor) {
          setSelectedFrameColor(data.product.frameColor);
        }

        fetchRelatedProducts(data.product.category);
      }
    } catch (error) {
      console.error('Fetch product error:', error);
    } finally {
      setLoading(false);
    }
  };

  const normalizeSize = (s?: string) => {
    if (!s) return '';
    const cleaned = s.replace(/\s+/g, '').toUpperCase().replace('×', 'X');
    const parts = cleaned.split('X');
    if (parts.length !== 2) return cleaned;
    return `${parts[0]}X${parts[1]}`;
  };

  const BASIC_PRICE: Record<string, { Rolled: number | null; Canvas: number | null; Frame: number | null }> = {
    '8X12': { Rolled: 679, Canvas: 800, Frame: 999 },
    '12X18': { Rolled: 879, Canvas: 1100, Frame: 1299 },
    '18X24': { Rolled: 1280, Canvas: 1699, Frame: 1799 },
    '20X30': { Rolled: 1780, Canvas: 2599, Frame: 2799 },
    '24X36': { Rolled: 1999, Canvas: 2999, Frame: 3299 },
    '30X40': { Rolled: 3580, Canvas: 4599, Frame: 5199 },
    '36X48': { Rolled: 3500, Canvas: 5799, Frame: 6499 },
    '48X66': { Rolled: 5879, Canvas: 9430, Frame: null },
    '18X18': { Rolled: 1199, Canvas: 1699, Frame: 1899 },
    '24X24': { Rolled: 1599, Canvas: 2299, Frame: 2499 },
    '36X36': { Rolled: 3199, Canvas: 4599, Frame: 4999 },
    '20X20': { Rolled: 1299, Canvas: 1899, Frame: 1999 },
    '30X30': { Rolled: 2199, Canvas: 3199, Frame: 3499 },
  };

  const TWOSET_PRICE: Record<string, { Rolled: number | null; Canvas: number | null; Frame: number | null }> = {
    '8X12': { Rolled: 1299, Canvas: 1599, Frame: 1999 },
    '12X18': { Rolled: 1899, Canvas: 2199, Frame: 2499 },
    '18X24': { Rolled: 2499, Canvas: 3399, Frame: 3599 },
    '20X30': { Rolled: 3799, Canvas: 5199, Frame: 5599 },
    '24X36': { Rolled: 3999, Canvas: 5999, Frame: 6599 },
    '30X40': { Rolled: 5799, Canvas: 9399, Frame: 10399 },
    '36X48': { Rolled: 6999, Canvas: 11599, Frame: 12999 },
    '48X66': { Rolled: 11799, Canvas: 18899, Frame: null },
  };

  const THREESET_PRICE: Record<string, { Rolled: number | null; Canvas: number | null; Frame: number | null }> = {
    '8X12': { Rolled: 2099, Canvas: 2499, Frame: 2999 },
    '12X18': { Rolled: 2699, Canvas: 3399, Frame: 3899 },
    '18X24': { Rolled: 3899, Canvas: 5099, Frame: 5399 },
    '20X30': { Rolled: 5399, Canvas: 7799, Frame: 8399 },
    '24X36': { Rolled: 6999, Canvas: 8899, Frame: 9599 },
    '30X40': { Rolled: 8699, Canvas: 14099, Frame: 15559 },
    '36X48': { Rolled: 10599, Canvas: 17399, Frame: 19499 },
    '48X66': { Rolled: 17699, Canvas: 28299, Frame: null },
  };

  const computePriceFor = (
    size: string,
    format: 'Rolled' | 'Canvas' | 'Frame',
    subsection?: 'Basic' | '2-Set' | '3-Set' | 'Square'
  ) => {
    const key = normalizeSize(size);
    const table = subsection === '2-Set' ? TWOSET_PRICE : subsection === '3-Set' ? THREESET_PRICE : BASIC_PRICE;
    const row = table[key];
    if (!row) return undefined;
    const value = row[format];
    return value === null ? undefined : value ?? undefined;
  };

  const fetchRelatedProducts = async (category: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/products`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      const related = data.products
        .filter((p: any) => p.category === category && p.id !== id)
        .slice(0, 4);
      setRelatedProducts(related);
    } catch (error) {
      console.error('Fetch related products error:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add to cart');
      navigate('/login');
      return;
    }

    if (!selectedColor || !selectedSize) {
      toast.error('Please select color and size');
      return;
    }

    try {
      const overridePrice = computePriceFor(selectedSize, product.format || selectedFormat, product.subsection) ?? product.price;
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/cart`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            productId: id,
            quantity,
            size: selectedSize,
            color: selectedColor,
            // format removed from UI; keep product.format if present
            format: product.format,
            frameColor: product.frameColor,
            price: overridePrice,
            subsection: product.subsection,
          }),
        }
      );

      if (response.ok) {
        toast.success('Added to cart');
        cartEvents.emit();
      } else {
        toast.error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/wishlist`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ productId: id }),
        }
      );

      if (response.ok) {
        toast.success('Added to wishlist');
      } else {
        toast.error('Failed to add to wishlist');
      }
    } catch (error) {
      console.error('Add to wishlist error:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin h-12 w-12 rounded-full border-b-2" style={{ borderColor: '#14b8a6' }}></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">Product Not Found</h1>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-2 rounded-md text-white"
            style={{ backgroundColor: '#14b8a6' }}
          >
            Back to Shop
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Decorative Squares (top) */}
      <div className="flex justify-between max-w-7xl mx-auto px-4 pt-12">
        <div className="flex gap-2">
          <div className="w-10 h-10 border-2 rounded" style={{ borderColor: '#cbd5e1' }}></div>
          <div className="w-10 h-10 border-2 rounded" style={{ borderColor: '#cbd5e1' }}></div>
        </div>

        <div className="flex gap-2">
          <div className="w-10 h-10 border-2 rounded" style={{ borderColor: '#cbd5e1' }}></div>
          <div className="w-10 h-10 border-2 rounded" style={{ borderColor: '#cbd5e1' }}></div>
        </div>
      </div>

      {/* Product Detail Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Image Box */}
          <div className="rounded-xl shadow-xl bg-white p-4">
            <div className="aspect-square overflow-hidden rounded-lg">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div>
            <p className="text-gray-600 mb-2">{product.category}</p>

            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-4">
              {product.name}
            </h1>

            <p className="text-3xl font-semibold text-gray-900 mb-6">
              ₹{(computePriceFor(selectedSize, product.format || selectedFormat, product.subsection) ?? product.price).toFixed(2)}
            </p>

            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Color: {selectedColor}</h3>
                <div className="flex gap-3">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-2 transition ${
                        selectedColor === color
                          ? 'border-teal-500 shadow-lg'
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {selectedColor === color && (
                        <Check className="w-6 h-6 text-white m-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Size: {selectedSize}</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2 rounded-xl border-2 transition ${
                        selectedSize === size
                          ? 'border-teal-500 bg-teal-50 text-teal-600'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Format section removed per request */}

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="text-xl font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 px-10 py-3 rounded-xl text-white shadow-xl transition"
                style={{ backgroundColor: '#14b8a6' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0d9488')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#14b8a6')}
              >
                <div className="flex gap-2 items-center justify-center">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </div>
              </button>

              <button
                onClick={handleAddToWishlist}
                className="w-12 h-12 border-2 rounded-xl flex items-center justify-center transition"
                style={{ borderColor: '#cbd5e1' }}
              >
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Specifications */}
            {product.material && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-2xl font-semibold mb-4">Specifications</h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Material:</span>
                    <span>{product.material}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Colors:</span>
                    <span>{product.colors.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sizes:</span>
                    <span>{product.sizes.join(', ')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-4xl font-bold text-center mb-12">
              Related <span style={{ color: '#14b8a6' }}>Frames</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
