import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { wishlistEvents } from '../utils/wishlistEvents';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AuthContext } from '../context/AuthContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner';

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  colors?: string[];
  sizes?: string[];
};

type ProductCardProps = {
  product: Product;
  overridePrice?: number;
  eyeNavigates?: boolean;
};

export function ProductCard({ product, overridePrice, eyeNavigates }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, accessToken } = useContext(AuthContext);

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    
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
          body: JSON.stringify({ productId: product.id }),
        }
      );

      if (response.ok) {
        setIsWishlisted(true);
        toast.success('Added to wishlist');
        wishlistEvents.emit();
      } else {
        toast.error('Failed to add to wishlist');
      }
    } catch (error) {
      console.error('Add to wishlist error:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  const addToCart = async () => {
    if (!user) {
      toast.error('Please login to add to cart');
      return;
    }
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/cart`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            productId: product.id,
            quantity: 1,
            price: overridePrice ?? product.price,
          }),
        }
      );
      if (response.ok) {
        toast.success('Added to cart');
        setOpen(false);
      } else {
        toast.error('Failed to add to cart');
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden relative"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay buttons */}
        <div className="absolute inset-0 flex items-end justify-end p-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleAddToWishlist}
            className="p-2 rounded-full bg-white shadow hover:shadow-md"
            title="Add to wishlist"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'text-red-500' : 'text-gray-800'}`} />
          </button>
          <button
            onClick={eyeNavigates ? undefined : (e) => { e.preventDefault(); setOpen(true); }}
            className="p-2 rounded-full bg-white shadow hover:shadow-md"
            title={eyeNavigates ? "View" : "Quick view"}
          >
            <Eye className="w-5 h-5 text-gray-800" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
        <h3 className="text-gray-900 mb-2">{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-gray-900">₹ {(overridePrice ?? product.price).toFixed(2)}</span>
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1">
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl w-[94vw] md:w-[720px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-gray-100">
                <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-xl font-bold text-gray-900 mb-6">₹ {(overridePrice ?? product.price).toFixed(2)}</p>
                <div className="flex items-center gap-3">
                  <button className="premium-btn" onClick={addToCart}>Add to Cart</button>
                  <Link to={`/product/${product.id}`} className="premium-btn-white" onClick={() => setOpen(false)}>View Details</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Link>
  );
}
