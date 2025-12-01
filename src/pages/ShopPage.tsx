import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProductCard } from '../components/ProductCard';
import { Filter, X, ChevronDown } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const ROOM_OPTIONS = [
  { name: 'Home Bar' },
  { name: 'Bath Space' },
  { name: 'Bedroom' },
  { name: 'Dining Area' },
  { name: 'Game Zone / Lounge Cave' },
  { name: 'Workshop / Garage Space' },
  { name: 'Fitness Room' },
  { name: 'Entryway / Corridor' },
  { name: 'Kids Space' },
  { name: 'Kitchen' },
  { name: 'Living Area' },
  { name: 'Office / Study Zone' },
  { name: 'Pooja Room' },
];

const LAYOUT_OPTIONS = ['Portrait', 'Square', 'Landscape'];
const SIZE_OPTIONS = ['8×12', '12×18', '18×24', '20×30', '24×36', '30×40', '36×48'];
const COLOR_OPTIONS = ['White', 'Black', 'Wood', 'Gold', 'Brown', 'silver'];
const MATERIAL_OPTIONS = ['Wood', 'Metal', 'Plastic', 'Glass'];
const CATEGORY_OPTIONS = [
  { name: 'Home Decor', count: 3 },
  { name: 'Wall Art', count: 5 },
  { name: 'Bestselling', count: 7 },
  { name: 'Hot & Fresh', count: 4 },
  { name: 'Gen Z', count: 7 },
  { name: 'Graffiti Art', count: 2 },
  { name: 'Modern Art', count: 4 },
  { name: 'Animal', count: 2 },
  { name: 'Pop Art', count: 2 },
  { name: 'Black & White', count: 1 },
  { name: 'Spiritual', count: 1 },
];

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  room?: string;
  roomCategory?: string;
  layout?: string;
  size?: string;
  sizes?: string[];
  colors?: string[];
  material?: string;
  category?: string;
  createdAt?: string;
}

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    room: true,
    layout: true,
    size: true,
    colors: true,
    materials: true,
    categories: true,
  });

  const [filters, setFilters] = useState({
    rooms: [] as string[],
    layouts: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    materials: [] as string[],
    categories: [] as string[],
    priceMin: 0,
    priceMax: 10000,
    sortBy: 'popular',
  });

  useEffect(() => {
    fetchProducts();
    const category = searchParams.get('category');
    if (category) {
      setFilters(prev => ({ ...prev, categories: [category] }));
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const fetchProducts = async () => {
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
      setProducts(data.products || []);
    } catch (error) {
      console.error('Fetch products error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoomCounts = () => {
    const counts: { [key: string]: number } = {};
    products.forEach(p => {
      const room = p.roomCategory || p.room;
      if (room) {
        counts[room] = (counts[room] || 0) + 1;
      }
    });
    return counts;
  };

  const roomCounts = getRoomCounts();

  const applyFilters = () => {
    let result = [...products];

    if (filters.rooms.length > 0) {
      result = result.filter(p => filters.rooms.includes(p.roomCategory || p.room || ''));
    }

    if (filters.layouts.length > 0) {
      result = result.filter(p => filters.layouts.includes(p.layout || ''));
    }

    if (filters.sizes.length > 0) {
      result = result.filter(p => {
        if (Array.isArray(p.sizes)) {
          return p.sizes.some(s => filters.sizes.includes(s));
        }
        return filters.sizes.includes(p.size || '');
      });
    }

    if (filters.colors.length > 0) {
      result = result.filter(p => p.colors?.some(c => filters.colors.includes(c)));
    }

    if (filters.materials.length > 0) {
      result = result.filter(p => filters.materials.includes(p.material || ''));
    }

    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category || ''));
    }

    result = result.filter(p => p.price >= filters.priceMin && p.price <= filters.priceMax);

    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  };

  const toggleFilter = (filterType: string, value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterType as keyof typeof prev] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterType]: newValues };
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section as keyof typeof prev] }));
  };

  const clearFilters = () => {
    setFilters({
      rooms: [],
      layouts: [],
      sizes: [],
      colors: [],
      materials: [],
      categories: [],
      priceMin: 0,
      priceMax: 10000,
      sortBy: 'popular',
    });
  };

  const activeFilterCount = 
    filters.rooms.length + 
    filters.layouts.length + 
    filters.sizes.length + 
    filters.colors.length + 
    filters.materials.length + 
    filters.categories.length;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl lg:text-4xl" style={{ fontWeight: 700, color: '#1f2937' }}>
            Shop All Frames
          </h1>
          {/* <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 text-black px-6 py-4 rounded-xl shadow-lg hover:from-teal-600 hover:to-blue-600 transition-all transform active:scale-95 "
            >
            <Filter className="w-5 h-5" />
            <span className="font-semibold">Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-white text-teal-600 text-xs px-2 py-0.5 rounded-full font-bold">
                {activeFilterCount}
              </span>
            )}
          </button> */}

          <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 text-black px-6 py-4 rounded-xl shadow-lg hover:from-teal-600 hover:to-blue-600 transition-all transform active:scale-95 rounded-lg"
                  style={{
                    backgroundColor: '#14b8a6',
                    color: 'white',
                    fontWeight: 500
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0d9488'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#14b8a6'}
                >
                  <Filter className="w-5 h-5" />
                  <span className="font-semibold">Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-black text-teal-600 text-xs px-2 py-0.5 rounded-lg font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>



        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div
            className={`${
              showFilters ? 'block' : 'hidden'
            } lg:block fixed lg:static inset-0 lg:inset-auto z-50 lg:z-auto`}
          >
            {/* Mobile Overlay */}
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowFilters(false)}
            ></div>

            {/* Filter Panel */}
            <div className="lg:w-64 bg-white rounded-t-3xl lg:rounded-lg shadow-2xl lg:shadow-sm fixed lg:static bottom-0 left-0 right-0 lg:inset-auto max-h-[85vh] lg:max-h-none overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-teal-50 to-blue-50 lg:bg-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg lg:hidden">
                    <Filter className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Filters
                  </h2>
                  {activeFilterCount > 0 && (
                    <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden p-2 hover:bg-white/50 rounded-full transition"
                >
                  <X className="w-6 h-6 text-gray-700" />
                </button>

                
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1 p-6 custom-scrollbar">

              {/* Room Filter */}
              <div className="mb-6 pb-6 border-b" style={{ borderColor: '#e5e7eb' }}>
                <button
                  onClick={() => toggleSection('room')}
                  className="flex items-center justify-between w-full mb-3 transition"
                  style={{ fontWeight: 700, color: '#1f2937' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#1f2937'}
                >
                  <h3>Decor by Room</h3>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expandedSections.room ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedSections.room && (
                  <div className="space-y-2">
                    {ROOM_OPTIONS.map(room => {
                      const count = roomCounts[room.name] || 0;
                      return (
                        <label key={room.name} className="flex items-center cursor-pointer group py-2 px-3 rounded-lg hover:bg-teal-50 transition">
                          <input
                            type="checkbox"
                            checked={filters.rooms.includes(room.name)}
                            onChange={() => toggleFilter('rooms', room.name)}
                            className="mr-3 w-5 h-5"
                            style={{ accentColor: '#14b8a6' }}
                          />
                          <span className="text-gray-700 text-sm group-hover:text-teal-600 transition flex-1">
                            {room.name}
                          </span>
                          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {count}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Layout Filter */}
              <div className="mb-6 pb-6 border-b" style={{ borderColor: '#e5e7eb' }}>
                <button
                  onClick={() => toggleSection('layout')}
                  className="flex items-center justify-between w-full mb-3 transition"
                  style={{ fontWeight: 700, color: '#1f2937' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#1f2937'}
                >
                  <h3>Layout</h3>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expandedSections.layout ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedSections.layout && (
                  <div className="flex flex-wrap gap-2">
                    {LAYOUT_OPTIONS.map(layout => (
                      <button
                        key={layout}
                        onClick={() => toggleFilter('layouts', layout)}
                        className="px-5 py-2.5 rounded-xl border-2 text-sm transition-all transform active:scale-95"
                        style={{
                          backgroundColor: filters.layouts.includes(layout) ? '#14b8a6' : 'white',
                          color: filters.layouts.includes(layout) ? 'white' : '#374151',
                          borderColor: filters.layouts.includes(layout) ? '#14b8a6' : '#d1d5db',
                          fontWeight: 600
                        }}
                      >
                        {layout}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Size Filter */}
              <div className="mb-6 pb-6 border-b" style={{ borderColor: '#e5e7eb' }}>
                <button
                  onClick={() => toggleSection('size')}
                  className="flex items-center justify-between w-full mb-3 transition"
                  style={{ fontWeight: 700, color: '#1f2937' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#1f2937'}
                >
                  <h3>Sizes</h3>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expandedSections.size ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedSections.size && (
                  <div className="flex flex-wrap gap-2">
                    {SIZE_OPTIONS.map(size => (
                      <button
                        key={size}
                        onClick={() => toggleFilter('sizes', size)}
                        className="px-4 py-2 rounded-xl border-2 text-sm transition-all transform active:scale-95"
                        style={{
                          backgroundColor: filters.sizes.includes(size) ? '#14b8a6' : 'white',
                          color: filters.sizes.includes(size) ? 'white' : '#374151',
                          borderColor: filters.sizes.includes(size) ? '#14b8a6' : '#d1d5db',
                          fontWeight: 600
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Color Filter */}
              <div className="mb-6 pb-6 border-b" style={{ borderColor: '#e5e7eb' }}>
                <button
                  onClick={() => toggleSection('colors')}
                  className="flex items-center justify-between w-full mb-3 transition"
                  style={{ fontWeight: 700, color: '#1f2937' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#1f2937'}
                >
                  <h3>Color</h3>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expandedSections.colors ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedSections.colors && (
                  <div className="flex flex-wrap gap-2">
                    {COLOR_OPTIONS.map(color => (
                      <button
                        key={color}
                        onClick={() => toggleFilter('colors', color)}
                        className="px-3 py-1 rounded-full border text-sm transition"
                        style={{
                          backgroundColor: filters.colors.includes(color) ? '#14b8a6' : 'white',
                          color: filters.colors.includes(color) ? 'white' : '#374151',
                          borderColor: filters.colors.includes(color) ? '#14b8a6' : '#d1d5db',
                          fontWeight: 500
                        }}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Material Filter */}
              <div className="mb-6 pb-6 border-b" style={{ borderColor: '#e5e7eb' }}>
                <button
                  onClick={() => toggleSection('materials')}
                  className="flex items-center justify-between w-full mb-3 transition"
                  style={{ fontWeight: 700, color: '#1f2937' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#1f2937'}
                >
                  <h3>Material</h3>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expandedSections.materials ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedSections.materials && (
                  <div className="space-y-2">
                    {MATERIAL_OPTIONS.map(material => (
                      <label key={material} className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.materials.includes(material)}
                          onChange={() => toggleFilter('materials', material)}
                          className="mr-2"
                          style={{ accentColor: '#14b8a6' }}
                        />
                        <span className="text-gray-700 text-sm group-hover:text-teal-600 transition">
                          {material}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6 pb-6 border-b" style={{ borderColor: '#e5e7eb' }}>
                <button
                  onClick={() => toggleSection('categories')}
                  className="flex items-center justify-between w-full mb-3 transition"
                  style={{ fontWeight: 700, color: '#1f2937' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#1f2937'}
                >
                  <h3>Categories</h3>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${expandedSections.categories ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedSections.categories && (
                  <div className="space-y-2">
                    {CATEGORY_OPTIONS.map(cat => (
                      <label key={cat.name} className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.categories.includes(cat.name)}
                            onChange={() => toggleFilter('categories', cat.name)}
                            className="mr-2"
                            style={{ accentColor: '#14b8a6' }}
                          />
                          <span className="text-gray-700 text-sm group-hover:text-teal-600 transition">
                            {cat.name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">({cat.count})</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="mb-3" style={{ fontWeight: 700, color: '#1f2937' }}>
                  Price Range
                </h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={filters.priceMax}
                    onChange={(e) =>
                      setFilters(prev => ({ ...prev, priceMax: Number(e.target.value) }))
                    }
                    className="w-full"
                    style={{ accentColor: '#14b8a6' }}
                  />
                  <div className="flex items-center justify-between text-gray-600 text-sm">
                    <span>₹{filters.priceMin}</span>
                    <span>₹{filters.priceMax}</span>
                  </div>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full py-3 rounded-lg transition font-semibold"
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                >
                  Clear All Filters
                </button>
              )}
              </div>

              {/* Mobile Action Buttons */}
              <div className="lg:hidden p-4 border-t bg-white flex gap-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  Clear
                </button>

                <button
                  onClick={() => setShowFilters(false)}
                  className="mt-5 px-6 py-2 rounded-lg transition"
                  style={{
                    backgroundColor: '#14b8a6',
                    color: 'white',
                    fontWeight: 500
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0d9488'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#14b8a6'}
                >
                  Show {filteredProducts.length} Products
                </button>
                
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600" style={{ fontWeight: 500 }}>
                <span style={{ color: '#14b8a6', fontWeight: 700 }}>{filteredProducts.length}</span> products found
              </p>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters(prev => ({ ...prev, sortBy: e.target.value }))
                }
                className="border rounded-lg px-4 py-2 focus:outline-none transition"
                style={{
                  borderColor: '#d1d5db',
                  fontWeight: 500
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#14b8a6';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(20, 184, 166, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div 
                  className="animate-spin rounded-full h-12 w-12 border-b-2"
                  style={{ borderColor: '#14b8a6' }}
                ></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products match your filters</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 rounded-lg transition"
                  style={{
                    backgroundColor: '#14b8a6',
                    color: 'white',
                    fontWeight: 500
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0d9488'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#14b8a6'}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}