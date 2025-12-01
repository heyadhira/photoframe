import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ProductCard } from "../components/ProductCard";
import { Star } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import logo from "../assets/logo-r.png";
import canva from "../assets/canva.jpg";



// =======================
// TYPE DEFINITIONS
// =======================
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
}

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const productsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/products`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const productsData = await productsRes.json();
      setFeaturedProducts(productsData.products?.slice(0, 8) || []);

      const testimonialsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/testimonials`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const testimonialsData = await testimonialsRes.json();
      setTestimonials(testimonialsData.testimonials?.slice(0, 4) || []);
    } catch (error) {
      console.error("Homepage fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #f1f5f9 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 relative">
              {/* Decorative squares */}
              <div className="flex gap-2 mb-4">
                <div className="w-8 h-8 border-2 border-gray-400 rounded" style={{ borderColor: '#cbd5e1' }}></div>
                <div className="w-8 h-8 border-2 border-gray-400 rounded" style={{ borderColor: '#cbd5e1' }}></div>
              </div>

              <h1 className="text-4xl lg:text-5xl xl:text-6xl leading-tight" style={{ fontWeight: 700 }}>
                Preserve Your
                <br />
                <span style={{ color: '#14b8a6', fontWeight: 700 }}>Moments</span>
                <br />
                in Style
              </h1>
              
              <p className="text-gray-600 text-base max-w-md leading-relaxed">
                Discover our curated collection of premium photo frames. Transform your cherished memories into elegant wall art that tells your unique story.
              </p>
              
              <Link
                to="/shop"
                className="inline-block px-8 py-3 rounded-md transition shadow-lg"
                style={{ 
                  backgroundColor: '#14b8a6',
                  color: 'white',
                  fontWeight: 500
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0d9488'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#14b8a6'}
              >
                Shop Now
              </Link>

              {/* Decorative squares bottom */}
              <div className="flex gap-2 pt-6">
                <div className="w-8 h-8 border-2 border-gray-400 rounded" style={{ borderColor: '#cbd5e1' }}></div>
                <div className="w-8 h-8 border-2 border-gray-400 rounded" style={{ borderColor: '#cbd5e1' }}></div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <img
                src={logo}
                alt="Photo frames display"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 py-16 lg:py-20 relative">
        {/* Decorative elements */}
        <div className="absolute left-4 top-20 hidden lg:flex gap-2">
          <div className="w-10 h-10 border-2 rounded" style={{ borderColor: '#cbd5e1' }}></div>
          <div className="w-10 h-10 border-2 rounded" style={{ borderColor: '#cbd5e1' }}></div>
        </div>
        <div className="absolute right-4 top-20 hidden lg:flex gap-2">
          <div className="w-10 h-10 border-2 rounded" style={{ borderColor: '#cbd5e1' }}></div>
          <div className="w-10 h-10 border-2 rounded" style={{ borderColor: '#cbd5e1' }}></div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl mb-2" style={{ fontWeight: 700 }}>
            Best <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400 }}>Seller</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-12 w-12 border-b-2 rounded-full" style={{ borderColor: '#14b8a6' }}></div>
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="relative">
            {/* Navigation buttons */}
            <button 
              className="absolute left-0 top-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-10 transition hidden lg:flex"
              style={{ 
                backgroundColor: '#14b8a6',
                color: 'white',
                transform: 'translate(-50%, -50%)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0d9488'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#14b8a6'}
            >
              ‹
            </button>
            <button 
              className="absolute right-0 top-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-10 transition hidden lg:flex"
              style={{ 
                backgroundColor: '#14b8a6',
                color: 'white',
                transform: 'translate(50%, -50%)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0d9488'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#14b8a6'}
            >
              ›
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center py-12 text-gray-500">No products available</p>
        )}
      </section>

      {/* CUSTOM CANVAS PROMO */}
      <section className="py-16 lg:py-20" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fef3c7 100%)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-5xl lg:text-6xl leading-tight" style={{ fontWeight: 700 }}>
                Custom
                <br />
                <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '4rem', fontWeight: 400 }}>Canvas</span>
              </h2>
              
              <div className="w-12 h-12 border-2 rounded-full" style={{ borderColor: '#9ca3af' }}></div>
              
              <Link
                to="/shop?category=Canvas"
                className="inline-block px-8 py-3 rounded-md transition shadow-lg"
                style={{ 
                  backgroundColor: '#14b8a6',
                  color: 'white',
                  fontWeight: 500
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0d9488'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#14b8a6'}
              >
                Shop Now
              </Link>
            </div>
            
            <div className="relative">
              <img
                src={canva}
                alt="Custom canvas"
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 py-16 lg:py-20 relative">
        <div className="absolute right-4 top-8 hidden lg:flex gap-2">
          <div className="w-10 h-10 border-2 rounded" style={{ borderColor: '#cbd5e1' }}></div>
          <div className="w-10 h-10 border-2 rounded" style={{ borderColor: '#cbd5e1' }}></div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl mb-4" style={{ fontWeight: 700 }}>
            Features <span style={{ color: '#14b8a6' }}>Products</span>
          </h2>
          <p className="text-gray-600">Harmonized excellence from our artisan partners</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-12 w-12 border-b-2 rounded-full" style={{ borderColor: '#14b8a6' }}></div>
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-center py-12 text-gray-500">No products available</p>
        )}
      </section>

      {/* TRUST CENTER */}
      <section className="py-16 lg:py-20 relative" style={{ backgroundColor: '#f9fafb' }}>
        <div className="absolute right-8 top-12 hidden lg:flex flex-col gap-2">
          <div className="w-10 h-10 border-2 rounded" style={{ borderColor: '#cbd5e1' }}></div>
          <div className="w-10 h-10 border-2 rounded" style={{ borderColor: '#cbd5e1' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl mb-4" style={{ fontWeight: 700 }}>Trust Center</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your confidence in our products is paramount. We stand behind every piece with unwavering guarantee and dedication.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Sourcing', desc: 'Ethically sourced materials from sustainable forests and trusted artisan partners worldwide.' },
              { title: 'Design', desc: 'Contemporary and timeless designs crafted to complement any home aesthetic perfectly.' },
              { title: 'Crafting', desc: 'Handcrafted by skilled artisans using time-honored techniques and precision tools.' },
              { title: 'Quality Assura', desc: 'Every frame undergoes rigorous quality checks to ensure it meets our standards.' }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div 
                  className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#14b8a6', color: 'white' }}
                >
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl mb-3" style={{ fontWeight: 700 }}>{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOME DECOR PROMO */}
      <section className="py-16 lg:py-20" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fef3c7 50%, #fed7aa 100%)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <div className="flex gap-2 mb-4">
                <div className="w-10 h-10 border-2 rounded" style={{ borderColor: '#cbd5e1' }}></div>
                <div className="w-10 h-10 border-2 rounded" style={{ borderColor: '#cbd5e1' }}></div>
              </div>

              <h2 className="text-5xl lg:text-6xl leading-tight" style={{ fontWeight: 700 }}>
                Home
                <br />
                <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '4rem', fontWeight: 400 }}>Decor</span>
              </h2>
              
              <Link
                to="/shop"
                className="inline-block px-8 py-3 rounded-md transition shadow-lg"
                style={{ 
                  backgroundColor: '#14b8a6',
                  color: 'white',
                  fontWeight: 500
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0d9488'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#14b8a6'}
              >
                Shop Now
              </Link>

              <div className="flex gap-2 pt-6">
                <div className="w-10 h-10 border-2 rounded" style={{ borderColor: '#cbd5e1' }}></div>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop"
                alt="Home decor"
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-16 lg:py-20 bg-white relative">
          <div className="absolute left-8 top-32 hidden lg:flex flex-col gap-2">
            <div className="w-10 h-10 border-2 rounded" style={{ borderColor: '#cbd5e1' }}></div>
            <div className="w-10 h-10 border-2 rounded" style={{ borderColor: '#cbd5e1' }}></div>
          </div>

          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl mb-2" style={{ fontWeight: 700 }}>
                What Our <span style={{ color: '#14b8a6' }}>Client Say</span>
              </h2>
              <p className="text-gray-600">Real testimonials from their discovery stories with Decorize</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-white p-6 rounded-xl border-2 transition"
                  style={{ borderColor: '#e5e7eb' }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div className="flex items-start mb-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-lg mr-3 flex-shrink-0"
                      style={{ 
                        backgroundColor: '#ccfbf1',
                        color: '#14b8a6',
                        fontWeight: 700
                      }}
                    >
                      {t.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 text-sm" style={{ fontWeight: 700 }}>{t.name}</p>
                      <div className="flex mt-1">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4"
                            style={{ fill: '#facc15', color: '#facc15' }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{t.text}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/testimonials"
                className="inline-block px-10 py-3 rounded-md transition shadow-lg"
                style={{ 
                  backgroundColor: '#14b8a6',
                  color: 'white',
                  fontWeight: 500
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0d9488'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#14b8a6'}
              >
                View Customer Gallery
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
     

    </div>
  );
}