import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { X, Image } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/gallery`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      setGalleryItems(data.galleryItems || []);
    } catch (error) {
      console.error('Fetch gallery error:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Events', 'Studio', 'Outdoor', 'Portrait'];

  const filteredItems =
    filter === 'All'
      ? galleryItems
      : galleryItems.filter((item: any) => item.category === filter);

  const itemsByYear = filteredItems.reduce((acc: any, item: any) => {
    const year = item.year || new Date().getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(item);
    return acc;
  }, {});

  const years = Object.keys(itemsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO HEADER */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #f1f5f9 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-14 lg:py-20">
          <div className="space-y-6 text-center">
            {/* Decorative squares */}
            <div className="flex justify-center gap-2 mb-4">
              <div className="w-8 h-8 border-2 rounded" style={{ borderColor: "#cbd5e1" }}></div>
              <div className="w-8 h-8 border-2 rounded" style={{ borderColor: "#cbd5e1" }}></div>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold">
              Explore Our <span style={{ color: '#14b8a6' }}>Gallery</span>
            </h1>

            <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
              A curated collection of our finest artwork — captured across events,
              studios, outdoors, and creative visuals.
            </p>

            <div className="flex justify-center gap-2 pt-4">
              <div className="w-8 h-8 border-2 rounded" style={{ borderColor: "#cbd5e1" }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-center flex-wrap gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className="px-6 py-2 rounded-lg transition text-sm font-medium shadow-md"
              style={{
                backgroundColor: filter === category ? '#14b8a6' : 'white',
                color: filter === category ? 'white' : '#475569',
                border: filter === category ? 'none' : '1px solid #cbd5e1',
              }}
              onMouseEnter={(e) => {
                if (filter !== category) {
                  e.currentTarget.style.backgroundColor = '#f0fdfa';
                }
              }}
              onMouseLeave={(e) => {
                if (filter !== category) {
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* GALLERY GRID */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin h-12 w-12 border-b-2 rounded-full" style={{ borderColor: '#14b8a6' }}></div>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="space-y-16">
            {years.map((year) => (
              <div key={year}>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">{year}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {itemsByYear[year].map((item: any) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedImage(item)}
                      className="group relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden cursor-pointer shadow-md transition hover:shadow-xl"
                    >
                      {imageLoading[item.id] !== false && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        onLoad={() => setImageLoading(prev => ({...prev, [item.id]: false}))}
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                          setImageLoading(prev => ({...prev, [item.id]: false}));
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 bg-white"
                        style={{ display: imageLoading[item.id] === false ? 'block' : 'none' }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-lg font-semibold drop-shadow-lg">{item.title}</h3>
                          {item.description && (
                            <p className="text-sm text-gray-200 mt-1 drop-shadow-md">{item.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No gallery items available</p>
          </div>
        )}
      </div>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>

          <div className="max-w-5xl max-h-[90vh] text-center" onClick={(e) => e.stopPropagation()}>
            <div className="relative inline-block">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="max-w-full max-h-[70vh] object-contain mx-auto mb-6 rounded-lg shadow-2xl"
              />
            </div>

            <h2 className="text-2xl text-white font-semibold mb-2">
              {selectedImage.title}
            </h2>

            {selectedImage.description && (
              <p className="text-gray-300 mb-3 max-w-2xl mx-auto">
                {selectedImage.description}
              </p>
            )}

            <div className="flex justify-center gap-4 text-sm text-gray-400">
              <span>{selectedImage.category}</span>
              <span>•</span>
              <span>{selectedImage.year}</span>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
