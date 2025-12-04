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
const SIZE_OPTIONS = ['8×12', '12×18', '18×24', '20×30', '24×36', '30×40', '36×48', '48×66', '18×18', '24×24', '36×36', '20×20', '30×30'];
const COLOR_OPTIONS = ['White', 'Black', 'Brown'];
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
  subsection?: 'Basic' | '2-Set' | '3-Set' | 'Square';
  format?: 'Rolled' | 'Canvas' | 'Frame';
  frameColor?: 'White' | 'Black' | 'Brown';
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

  const [formatSubsection, setFormatSubsection] = useState<'All' | 'Rolled' | 'Canvas' | 'Frame'>('All');
  const [subsectionChip, setSubsectionChip] = useState<'All' | 'Basic' | '2-Set' | '3-Set' | 'Square'>('All');

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

  const normalizeSize = (s?: string) => {
    if (!s) return '';
    const cleaned = s.replace(/\s+/g, '').toUpperCase().replace('×', 'X');
    const parts = cleaned.split('X');
    if (parts.length !== 2) return cleaned;
    return `${parts[0]}X${parts[1]}`;
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
    <div className="min-h-screen about-theme content-offset">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="section-title">
            <span className="text-[#3b2f27]">Shop</span> <span style={{ color: '#14b8a6' }}>All Frames</span>
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
            className="lg:hidden premium-btn flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            <span className="font-semibold">Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-white/90 text-teal-700 text-xs px-2 py-0.5 rounded-full font-bold">
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
            <div
              className="lg:w-64 bg-white rounded-t-3xl lg:rounded-lg shadow-2xl lg:shadow-sm fixed lg:static bottom-0 left-0 right-0 lg:inset-auto max-h-[90vh] lg:max-h-none overflow-y-auto no-scrollbar flex flex-col"
              style={{ overscrollBehavior: 'contain' }}
            >
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
                  className="premium-btn flex-1"
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

            {/* Subsection Chips */}
            <div className="flex flex-wrap gap-3 mb-4">
              {(['All','Basic','2-Set','3-Set','Square'] as const).map(opt => (
                <button
                  key={opt}
                  onClick={() => setSubsectionChip(opt)}
                  className="px-4 py-2 rounded-full border text-sm transition"
                  style={{
                    backgroundColor: subsectionChip === opt ? '#14b8a6' : 'white',
                    color: subsectionChip === opt ? 'white' : '#374151',
                    borderColor: subsectionChip === opt ? '#14b8a6' : '#d1d5db',
                    fontWeight: 600,
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Format Chips */}
            <div className="flex flex-wrap gap-3 mb-6">
              {(['All','Rolled','Canvas','Frame'] as const).map(opt => (
                <button
                  key={opt}
                  onClick={() => setFormatSubsection(opt)}
                  className="px-4 py-2 rounded-full border text-sm transition"
                  style={{
                    backgroundColor: formatSubsection === opt ? '#14b8a6' : 'white',
                    color: formatSubsection === opt ? 'white' : '#374151',
                    borderColor: formatSubsection === opt ? '#14b8a6' : '#d1d5db',
                    fontWeight: 600,
                  }}
                >
                  {opt}
                </button>
              ))}
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
                {(filteredProducts.filter(p => {
                  const byFormat = formatSubsection === 'All' ? true : (p.format === formatSubsection);
                  const bySubsection = subsectionChip === 'All' ? true : (p.subsection === subsectionChip);
                  return byFormat && bySubsection;
                })).map(product => {
                  const chosenSize = filters.sizes[0] || '';
                  const effectiveSubsection = subsectionChip === 'All' ? (product.subsection || 'Basic') : subsectionChip;
                  const overridePrice =
                    formatSubsection !== 'All' && chosenSize
                      ? computePriceFor(
                          chosenSize,
                          formatSubsection as 'Rolled' | 'Canvas' | 'Frame',
                          effectiveSubsection as 'Basic' | '2-Set' | '3-Set' | 'Square'
                        )
                      : undefined;
                  return (
                    <ProductCard key={product.id} product={product} overridePrice={overridePrice} />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products match your filters</p>
                <button
                  onClick={clearFilters}
                  className="premium-btn"
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
