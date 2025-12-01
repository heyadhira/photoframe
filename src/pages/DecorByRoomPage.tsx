import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Filter, Grid, List } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const roomCategories = [
  { name: 'All Rooms', count: 0 },
  { name: 'Home Bar', count: 0 },
  { name: 'Bath Space', count: 0 },
  { name: 'Bedroom', count: 0 },
  { name: 'Dining Area', count: 0 },
  { name: 'Game Zone / Lounge Cave', count: 0 },
  { name: 'Workshop / Garage Space', count: 0 },
  { name: 'Fitness Room', count: 0 },
  { name: 'Entryway / Corridor', count: 0 },
  { name: 'Kids Space', count: 0 },
  { name: 'Kitchen', count: 0 },
  { name: 'Living Area', count: 0 },
  { name: 'Office / Study Zone', count: 0 },
  { name: 'Pooja Room', count: 0 },
];

export default function DecorByRoomPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(searchParams.get('room') || 'All Rooms');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const room = searchParams.get('room');
    if (room) setSelectedRoom(room);
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/products`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedRoom === 'All Rooms'
    ? products
    : products.filter(p => p.roomCategory === selectedRoom);

  const getCategoryCounts = () => {
    const counts: any = {};
    products.forEach(p => {
      if (p.roomCategory) {
        counts[p.roomCategory] = (counts[p.roomCategory] || 0) + 1;
      }
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  const handleRoomSelect = (room: string) => {
    setSelectedRoom(room);
    if (room === 'All Rooms') {
      setSearchParams({});
    } else {
      setSearchParams({ room });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - Same as Shop Page */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl lg:text-4xl" style={{ fontWeight: 700, color: '#1f2937' }}>
            Decor by Room
          </h1>
        </div>
        <div className="flex gap-8">

          {/* Sidebar Filters - Same as Shop Page */}
          <div className="lg:w-64 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-xl" style={{ fontWeight: 700, color: '#1f2937' }}>
                Filters
              </h2>
            </div>

            <div className="mb-6 pb-6 border-b" style={{ borderColor: '#e5e7eb' }}>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Decor by Room</h3>
              <div className="space-y-2">
                {roomCategories.map((category) => {
                  const count = category.name === 'All Rooms'
                    ? products.length
                    : categoryCounts[category.name] || 0;

                  return (
                    <label key={category.name} className="flex items-center cursor-pointer group py-2 px-3 rounded-lg hover:bg-teal-50 transition">
                      <input
                        type="radio"
                        name="room"
                        checked={selectedRoom === category.name}
                        onChange={() => handleRoomSelect(category.name)}
                        className="mr-3 w-5 h-5"
                        style={{ accentColor: '#14b8a6' }}
                      />
                      <span className="text-gray-700 text-sm group-hover:text-teal-600 transition flex-1">
                        {category.name}
                      </span>
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                {selectedRoom !== 'All Rooms' && ` in ${selectedRoom}`}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-teal-600 text-white' : 'bg-gray-100'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-teal-600 text-white' : 'bg-gray-100'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="h-12 w-12 border-b-2 border-teal-600 rounded-full animate-spin" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No products found in this category</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
              }>
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className={`group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    <div className={viewMode === 'list' ? 'w-48' : 'aspect-square'}>
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
