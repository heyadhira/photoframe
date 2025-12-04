import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AuthContext } from '../App';
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
};

export function ProductCard({ product, overridePrice }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
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
      } else {
        toast.error('Failed to add to wishlist');
      }
    } catch (error) {
      console.error('Add to wishlist error:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay buttons */}
       
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
    </Link>
  );
}
