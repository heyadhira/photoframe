import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingCart, Check, Truck, Package, Lock, CheckSquare, CircleHelp, RotateCcw, FileText, ChevronDown, CheckCircle, Star, Share2, Copy, Home, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { AuthContext } from '../context/AuthContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner';
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
  const [defaultColor, setDefaultColor] = useState('');
  const [defaultSize, setDefaultSize] = useState('');
  const [defaultFormat, setDefaultFormat] = useState<'Rolled' | 'Canvas' | 'Frame'>('Rolled');
  const [zoom, setZoom] = useState(1);

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
          setDefaultColor(data.product.colors[0]);
        }
        if (data.product.sizes?.length > 0) {
          setSelectedSize(data.product.sizes[0]);
          setDefaultSize(data.product.sizes[0]);
        }

        if (data.product.format) {
          setSelectedFormat(data.product.format);
          setDefaultFormat(data.product.format);
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
      return;
    }

    if (!selectedSize) {
      toast.error('Please select size');
      return;
    }
    if (selectedFormat === 'Frame' && !selectedColor) {
      toast.error('Please select color');
      return;
    }

    try {
      const overridePrice = computePriceFor(selectedSize, selectedFormat, product.subsection) ?? product.price;
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
            color: selectedFormat === 'Frame' ? selectedColor : undefined,
            format: selectedFormat,
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

  const handleBuyNow = async () => {
    if (!user) {
      toast.error('Please login to buy');
      return;
    }

    if (!selectedSize) {
      toast.error('Please select size');
      return;
    }
    if (selectedFormat === 'Frame' && !selectedColor) {
      toast.error('Please select color');
      return;
    }

    try {
      const overridePrice = computePriceFor(selectedSize, selectedFormat, product.subsection) ?? product.price;
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
            color: selectedFormat === 'Frame' ? selectedColor : undefined,
            format: selectedFormat,
            frameColor: product.frameColor,
            price: overridePrice,
            subsection: product.subsection,
          }),
        }
      );

      if (response.ok) {
        cartEvents.emit();
        navigate('/checkout');
      } else {
        toast.error('Failed to proceed to checkout');
      }
    } catch (error) {
      console.error('Buy now error:', error);
      toast.error('Failed to proceed to checkout');
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
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

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-6 text-sm text-gray-600 flex items-center gap-2">
        <Home className="w-4 h-4" />
        <Link to="/" className="hover:underline">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/shop" className="hover:underline">Shop</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900">{product?.name || 'Product'}</span>
      </div>

      {/* Product Detail Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Image Box */}
          <div className="soft-card rounded-2xl bg-white p-4">
            <div className="rounded-lg overflow-hidden" style={{ height: '90vh' }}>
              {(() => {
                const activeFormat = selectedFormat;
                const isCanvas = activeFormat === 'Canvas';
                const isRolled = activeFormat === 'Rolled';
                const colorSrc = (product as any).imagesByColor?.[selectedColor];
                const src = (isCanvas || isRolled) ? product.image : (colorSrc || product.image);
                return (
                  <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', width: '100%', height: '100%' }}>
                    <ImageWithFallback
                      src={src}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                );
              })()}

              
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button onClick={() => setZoom(Math.min(2, zoom + 0.2))} className="px-6 py-1 mt-6 rounded-lg border border-gray-300 text-gray-800">Zoom In</button>
              <button onClick={() => setZoom(Math.max(1, zoom - 0.2))} className="px-6 py-1 mt-6 rounded-lg border border-gray-300 text-gray-800">Zoom Out</button>
              <button onClick={() => setZoom(1)} className="px-6 py-1 mt-6 rounded-lg premium-btn">Reset</button>
            </div>
            <div className="mt-4 rounded-2xl bg-white border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Specifications</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                {product.material && <div><span className="text-gray-500">Material:</span> <span>{product.material}</span></div>}
                {product.layout && <div><span className="text-gray-500">Layout:</span> <span>{product.layout}</span></div>}
                {product.colors?.length > 0 && <div className="col-span-2"><span className="text-gray-500">Available Colors:</span> <span>{product.colors.join(', ')}</span></div>}
                {product.sizes?.length > 0 && <div className="col-span-2"><span className="text-gray-500">Sizes:</span> <span>{product.sizes.join(', ')}</span></div>}
              </div>
            </div>
          </div>



          

          {/* Product Info */}
          <div>
            
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
             
              
          
              <span className="px-6 py-2 rounded-lg border text-gray-800 ">{product.category}</span>
              {product.layout && <span className="px-6 py-2 rounded-lg border text-gray-800">{product.layout}</span>}
              {product.material && <span className="px-6 py-2 rounded-lg border text-gray-800">{product.material}</span>}
            </div>

              
            <h1 className="section-title animate-title mb-2 text-gray-900">
              {product.name}
            </h1>

            <div className="flex items-center justify-between mb-6">
            <p className="text-3xl font-bold text-gray-900">
                ₹{(computePriceFor(selectedSize, selectedFormat, product.subsection) ?? product.price).toFixed(2)}
              </p>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg border hover:bg-gray-50" onClick={()=>{ navigator.clipboard.writeText(window.location.href); toast.success('Link copied'); }} title="Copy Link">
                  <Copy className="w-5 h-5 text-gray-700" />
                </button>
                <button className="p-2 rounded-lg border hover:bg-gray-50" onClick={()=>{ if (navigator.share) { navigator.share({ title: product.name, url: window.location.href }).catch(()=>{}); } else { toast.info('Use copy to share'); } }} title="Share">
                  <Share2 className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            {(product.rating || product.reviewsCount) && (
              <div className="flex items-center gap-2 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.round(Number(product.rating || 0)) ? 'text-yellow-400' : 'text-gray-300'}`} />
                ))}
                <span className="text-sm text-gray-600">{Number(product.rating || 0).toFixed(1)} {product.reviewsCount ? `(${product.reviewsCount} reviews)` : ''}</span>
              </div>
            )}

            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

                         {/* Format (Rolled / Canvas / Frame) */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2 ">Format</h3>
              <div className="flex gap-3 rounded-lg">
                {(['Frame','Canvas'] as const).map((fmt) => {
                  const available = computePriceFor(selectedSize, fmt, product.subsection) !== undefined;
                  return (
                    <button
                      key={fmt}
                      onClick={() => available && setSelectedFormat(fmt)}
                      className={`px-6 py-2 rounded-lg border-2 transition premium-btn ${
                        selectedFormat === fmt ? 'border-teal-500 bg-teal-50 text-teal-600' : 'border-gray-300 text-gray-700'
                      } ${available ? '' : 'opacity-50 cursor-not-allowed'}`}
                      title={available ? '' : 'Not available for this size'}
                      disabled={!available}
                    >
                      {fmt}
                    </button>
                  );
                })}
                <button onClick={() => { setSelectedColor(defaultColor); setSelectedSize(defaultSize); setSelectedFormat(defaultFormat); }} className="px-6 py-2 rounded-lg border text-gray-800 premium-btn">Clear Selection</button>
              </div>

            </div>

            {/* Colors (only for Frame) */}
            {product.colors?.length > 0 && selectedFormat === 'Frame' && (
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
                      className={`px-6 py-2 rounded-lg border-2 transition ${
                        selectedSize === size
                          ? 'border-teal-500 bg-teal text-white'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            

           

            

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
                onClick={handleBuyNow}
                className="flex-1 px-10 py-3 rounded-xl text-white shadow-xl transition premium-btn"
                style={{ backgroundColor: '#111827' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0b1220')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111827')}
              >
                Buy Now
              </button>

              <button
                onClick={handleAddToWishlist}
                className="w-12 h-12 border-2 rounded-xl flex items-center justify-center transition"
                style={{ borderColor: '#cbd5e1' }}
              >
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-white border border-gray-200 shadow-sm p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-800">
                <div className="flex items-center gap-3"><Truck className="w-5 h-5" color="#14b8a6" /><span>Free Delivery in 7–10 Days</span></div>
                <div className="flex items-center gap-3"><Package className="w-5 h-5" color="#14b8a6" /><span>4‑Layer Secure Packaging</span></div>
                <div className="flex items-center gap-3"><Lock className="w-5 h-5" color="#14b8a6" /><span>Secure Payments</span></div>
                <div className="flex items-center gap-3"><CheckSquare className="w-5 h-5" color="#14b8a6" /><span>Partial Cash on Delivery</span></div>
              </div>
              <div className="border-t border-gray-200" />

              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer py-2">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" color="#14b8a6" />
                    <span className="uppercase tracking-wider text-sm text-gray-900">Top Quality, Check</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600 group-open:rotate-180 transition" />
                </summary>
                <div className="mt-3 space-y-2 text-gray-800">
                  <div className="flex items-start gap-2"><CheckCircle className="w-5 h-5" color="#14b8a6" /><span>Colors that stay bright, printed on 400 GSM premium canvas.</span></div>
                  <div className="flex items-start gap-2"><CheckCircle className="w-5 h-5" color="#14b8a6" /><span>Built by hand with pinewood frames that last for years.</span></div>
                  <div className="flex items-start gap-2"><CheckCircle className="w-5 h-5" color="#14b8a6" /><span>Soft matte look that feels calm, elegant, and glare‑free.</span></div>
                </div>
              </details>

              <div className="border-t border-gray-200" />

              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer py-2">
                  <div className="flex items-center gap-2">
                    <CircleHelp className="w-4 h-4" color="#14b8a6" />
                    <span className="uppercase tracking-wider text-sm text-gray-900">How Will I Hang It?</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600 group-open:rotate-180 transition" />
                </summary>
                <p className="mt-3 text-sm text-gray-700">
                  Simply hammer in the included nails at your chosen spot. Then, carefully unbox and unwrap the frame. Hang it on the nails using the pre‑attached hooks. For our Stretched Canvas, no hooks are needed — just rest the top edge directly on the nails for a sleek, seamless look.
                </p>
              </details>

              <div className="border-t border-gray-200" />

              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer py-2">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" color="#14b8a6" />
                    <span className="uppercase tracking-wider text-sm text-gray-900">Can I Return My Order?</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600 group-open:rotate-180 transition" />
                </summary>
                <p className="mt-3 text-sm text-gray-700">
                  At Decorizz, we want you to love your purchase. If needed, you can return items within 48 hours for easy replacements or store credit. Our hassle‑free return process ensures quick resolution for any issues.
                </p>
              </details>

              <div className="border-t border-gray-200" />

              <details className="group" open>
                <summary className="flex items-center justify-between cursor-pointer py-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" color="#14b8a6" />
                    <span className="uppercase tracking-wider text-sm text-gray-900">About This Artwork</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600 group-open:rotate-180 transition" />
                </summary>
                <p className="mt-3 text-sm text-gray-700">
                  {product.description}
                </p>
              </details>
            </div>

            {/* Specifications */}
            {/* {product.material && (
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

      
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/90 backdrop-blur border-t border-gray-200 p-3 z-40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">₹{(computePriceFor(selectedSize, selectedFormat, product.subsection) ?? product.price).toFixed(2)}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleAddToCart} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800">Add</button>
              <button onClick={handleBuyNow} className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: '#14b8a6' }}>Buy Now</button>
            </div>
          </div>
        </div>

      </div>
            )} */}
          </div>

        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-4xl font-bold text-center mb-12">
              Related <span style={{ color: '#14b8a6' }}>Frames</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
