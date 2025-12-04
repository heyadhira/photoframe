import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ProductCard } from "../components/ProductCard";
import { Star } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

import AOS from "aos";
import "aos/dist/aos.css";

import canva from "../assets/canva.jpg";
import heroImage from "../assets/hero.jpg";
import owl from "../assets/owl.jpg";
import owlf from "../assets/owlf.jpg";
import viratImage from "../assets/virat.jpg";
import colorImage from "../assets/color.jpg";
import ramaImage from "../assets/lordrama.jpg";
import image1 from "../assets/1.jpg";
import image2 from "../assets/2.jpg";
import image3 from "../assets/3.jpg";
import image4 from "../assets/4.jpg";
import image5 from "../assets/5.jpg";

import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "../components/ui/carousel";

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
  const [heroApi, setHeroApi] = useState<CarouselApi | null>(null);
  const heroImages = [
    heroImage,
    image1,
    image2,
    image3,
    image4,
    image5,
    
  ];
  const [formatFilter, setFormatFilter] = useState<'All' | 'Rolled' | 'Canvas' | 'Frame'>('All');

  useEffect(() => {
    fetchHomeData();
  }, []);


  useEffect(() => {
  AOS.init({ duration: 1200, once: true });
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

  useEffect(() => {
    if (!heroApi) return;
    const id = setInterval(() => {
      try { heroApi.scrollNext(); } catch {}
    }, 2000);
    return () => clearInterval(id);
  }, [heroApi]);

  const bestSellerRef = React.useRef<HTMLDivElement | null>(null);

const scrollBestSellerLeft = () => {
  if (!bestSellerRef.current) return;
  const { clientWidth } = bestSellerRef.current;
  bestSellerRef.current.scrollBy({ left: -clientWidth, behavior: "smooth" });
};

const scrollBestSellerRight = () => {
  if (!bestSellerRef.current) return;
  const { clientWidth } = bestSellerRef.current;
  bestSellerRef.current.scrollBy({ left: clientWidth, behavior: "smooth" });
};

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
<section className="hero-section">
  <Carousel opts={{ loop: true, align: "center", slidesToScroll: 1 }} setApi={(api) => setHeroApi(api)} className="w-screen overflow-hidden">
    <CarouselContent className="ml-0 gap-0">
      {heroImages.map((src, idx) => (
        <CarouselItem key={idx} className="basis-full min-w-full pl-0">
          <div className="relative w-full">
            <img src={src} alt="Hero" className="hero-image" />
            <div className="hero-overlay" style={{ background: "rgba(0,0,0,0.45)" }} />
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious className="hidden lg:flex" />
    <CarouselNext className="hidden lg:flex" />
  </Carousel>
  <div className="hero-content">
    <div className="hero-container text-left">
      <h1 className="hero-title">Discover <span className="accent">300+</span> Modern</h1>
      <h2 className="hero-subtitle">Wall Frames</h2>
      <div className="hero-buttons">
        <Link to="/shop" className="hero-btn hero-btn-primary">Shop Now</Link>
        <Link to="/contact" className="hero-btn hero-btn-outline">Contact us</Link>
      </div>
      <div className="hero-caption">300+ Collection of premium frame</div>
    </div>
  </div>
</section>






{/* BEST SELLERS */}
<section className="max-w-7xl mx-auto px-4 py-16 lg:py-20 relative overflow-hidden">

  {/* Heading */}
  <div className="text-center mb-8 fade-up">
    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif', letterSpacing: '.5px' }}>Explore Frames for Every Room</h2>
  </div>
  <div className="flex justify-center gap-3 mb-10">
    {(['All','Rolled','Canvas','Frame'] as const).map(opt => (
      <button
        key={opt}
        onClick={() => setFormatFilter(opt)}
        className="px-6 py-2 rounded-full border text-sm font-semibold"
        style={{
          backgroundColor: formatFilter === opt ? '#14b8a6' : 'white',
          color: formatFilter === opt ? 'white' : '#111827',
          borderColor: '#d1d5db'
        }}
      >
        <span
          className="inline-block w-2 h-2 rounded-full mr-2 align-middle"
          style={{
            backgroundColor: formatFilter === opt ? '#111827' : 'transparent',
            border: '1.5px solid #9ca3af'
          }}
        />
        {opt}
      </button>
    ))}
  </div>

  {loading ? (
    <div className="flex justify-center py-12">
      <div className="animate-spin h-12 w-12 border-b-2 border-teal-500 rounded-full" />
    </div>
  ) : (
    <div className="best-slider">
      
      <div className="best-track">
        {[
          ...featuredProducts.filter((p:any)=> formatFilter==='All' ? true : (p.format===formatFilter)),
          ...featuredProducts.filter((p:any)=> formatFilter==='All' ? true : (p.format===formatFilter))
        ].map((p, index) => {
          
          // Define center every 3 items
          const position = index % 1;
          const isCenter = position === 1; // middle card of 3

          return (
            <div key={index} className="best-item">
              <div className={
                `curve-card curve-reflection fade-up
                 ${isCenter ? "best-center" : "best-side"}`
              }>
                <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '4 / 5' }}>
                  <img src={(p as any).image} alt={(p as any).name} className="w-full h-full object-cover" />
                  <div
                    className="absolute bottom-0 left-0 right-0 flex items-center justify-center text-center"
                    style={{
                      height: '56px',
                      backgroundColor:
                        (():string => {
                          const f = (p as any).format;
                          if (f==='Rolled') return 'rgba(250, 210, 225, 0.65)';
                          if (f==='Canvas') return 'rgba(205, 247, 234, 0.65)';
                          if (f==='Frame') return 'rgba(229, 231, 235, 0.65)';
                          return 'rgba(229, 231, 235, 0.65)';
                        })(),
                      backdropFilter: 'blur(2px)'
                    }}
                  >
                    <span className="text-xl font-serif font-semibold text-gray-800">{(p as any).name}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  )}
</section>




 {/* CUSTOM CANVAS PROMO */}
<section
  className="py-16 lg:py-20 relative bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: `url(${colorImage})` }}

>
  {/* Dark Overlay */}
  <div className="absolute inset-0"
       style={{
         background: "linear-gradient(135deg, rgba(254,243,199,0.85) 0%, rgba(254,215,170,0.85) 50%, )",
         backdropFilter: "blur(2px)"
       }}
  ></div>

  <div className="relative max-w-7xl mx-auto px-4">
    <div className="grid lg:grid-cols-2 gap-12 items-center">

      {/* LEFT */}
      <div className="space-y-8 fade-left">
        <h2 className="text-5xl lg:text-6xl font-bold text-white pb-6 leading-tight">
          Custom <br />
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "4rem",
            }}
          >
            Canvas
          </span>
        </h2>

        <div className="w-14 h-14 border-2 border-gray-300 rounded-full float-circle"></div>

        <Link
          to="/shop?category=Canvas"
          className="inline-block px-6 py-3 rounded-lg premium-btn text-white font-semibold"
          style={{ backgroundColor: "#14b8a6" }}
        >
          Shop Now
        </Link>
      </div>

      {/* RIGHT */}
      <div className="fade-right relative">
        <div className="curved-image-card">
          <img src={canva} alt="Canvas" className="w-full h-auto" />
        </div>
      </div>

    </div>
  </div>
</section>


      {/* FEATURED PRODUCTS */}
      {/* <section className="max-w-7xl mx-auto px-4 py-16 lg:py-20 relative">
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
      </section> */}

      {/* TRUST CENTER */}
      <section className="py-16 lg:py-20 relative" style={{ backgroundColor: "#f5f2e9" }}>
  
  {/* Decorative Boxes */}
  <div className="absolute right-8 top-12 hidden lg:flex flex-col gap-2">
    <div className="w-10 h-10 border-2 rounded" style={{ borderColor: "#cbd5e1" }}></div>
    <div className="w-10 h-10 border-2 rounded" style={{ borderColor: "#cbd5e1" }}></div>
  </div>

  <div className="max-w-7xl mx-auto px-4">

    {/* Heading */}
    <div className="text-center mb-12">
      <h2 className="text-4xl lg:text-5xl mb-3 font-serif font-extrabold">
        Why Choose us
      </h2>
      <p className="text-gray-700 max-w-2xl mx-auto">
        Your confidence in our products is paramount. We stand behind every
        piece with unwavering guarantee and dedication.
      </p>
    </div>

    {/* CURVE CARDS GRID */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        {
          title: "Sourcing",
          desc: "Ethically sourced materials from sustainable forests and trusted artisan partners worldwide.",
        },
        {
          title: "Design",
          desc: "Contemporary and timeless designs crafted to complement any home aesthetic perfectly.",
        },
        {
          title: "Crafting",
          desc: "Handcrafted by skilled artisans using time-honored techniques and precision tools.",
        },
        {
          title: "Quality Assura",
          desc: "Every frame undergoes rigorous quality checks to ensure it meets our standards.",
        },
      ].map((item, idx) => (
        <div
          key={idx}
          className="curve-card curve-reflection fade-up"
          style={{
            background: "white",
            borderRadius: "28px",
            padding: "22px",
            minHeight: "30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
          }}
        >

          {/* Circular Icon */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mb-3 shadow-md"
            style={{
              backgroundColor: "#14b8a6",
              color: "white",
            }}
          >
            <svg
              className="w-12 h-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Title */}
          <h3
            className="text-xl font-bold mb-3"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed">
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* HOME DECOR PREMIUM PROMO */}
<section
  className="relative py-20 bg-cover bg-center bg-no-repeat cover-fit"
  style={{
    backgroundImage:
      `url(${viratImage})`,
  }}
>
  {/* Darker overlay for readability */}
   <div className="absolute inset-0"
       style={{
         background: "linear-gradient(135deg, rgba(254,243,199,0.85) 0%, rgba(254,215,170,0.85) 50%, )",
         backdropFilter: "blur(2px)"
       }}
  ></div>

  <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center z-[5]">

    {/* LEFT CONTENT */}
    <div className="fade-left space-y-8 text-white">

      {/* Decorative boxes */}
      <div className="flex gap-3 opacity-70">
        <div className="w-10 h-10 border-2 rounded float-box border-white/60"></div>
        <div className="w-10 h-10 border-2 rounded float-box border-white/60"></div>
      </div>

      {/* TITLE */}
      <div className="space-y-2">
        <h2 className="text-4xl lg:text-5xl font-serif font-bold">
          Wall
        </h2>
        <h1 className="text-6xl lg:text-7xl font-serif font-extrabold">
          Art
        </h1>
        <h2 className="text-4xl lg:text-5xl font-serif font-bold">
          Collection
        </h2>
      </div>

      {/* DESCRIPTION */}
      <p className="text-gray-100 max-w-md leading-relaxed text-lg">
        Discover our curated collection of premium wall décor frames — 
        from elegant minimalist pieces to luxurious handcrafted artwork.
      </p>

      {/* BUTTON */}
      <Link
        to="/shop"
        className="text-black  inline-block px-8 py-3 rounded-lg font-medium hover:scale-105 hero-btn-outline"
      >
        Explore Collection
      </Link>

      {/* OFFER BADGE */}
      <div className="pt-6 pb-6">
        <div className="promo-badge">
          <div className="inner">
            <div className="up">UP TO</div>
            <div className="num">40%</div>
            <div className="off">OFF</div>
          </div>
        </div>
      </div>

    </div>

    {/* RIGHT IMAGE */}
    <div className="fade-right relative">
      <div className="curved-image-card">
        <img
          src={viratImage}
          className="w-full h-auto object-cover"
          alt="Decor"
        />
      </div>
    </div>

  </div>
</section>


      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-16 lg:py-20 bg-[#faf7f4] relative">

          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl mb-2" style={{ fontWeight: 700 }}>
                What <span style={{ color: '#14b8a6' }}>People </span>Says <span style={{ color: '#14b8a6' }}>About </span>Us
              </h2>
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="w-2 h-2 rounded-full bg-black"></span>
                <span className="w-40 border-t border-black"></span>
                <span className="w-2 h-2 rounded-full bg-black"></span>
              </div>
              <p className="text-gray-600">Real transformations from discerning homeowners who trust Decorizz</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
              {testimonials.map((t) => (
                <div 
                  key={t.id} 
                  className="p-6 rounded-lg transition" 
                  style={{ backgroundColor: '#6ac8bdff' }} 
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
                      <p className="text-black text-base" style={{ fontWeight: 700 }}>{t.name}</p> 
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
                  <p className="text-gray-800 leading-relaxed">{t.text}</p> 
                </div> 
              ))} 
            </div> 

            <div className="text-center"> 
              <Link 
                to="/testimonials" 
                className="inline-block px-6 py-3 rounded-full transition shadow-md" 
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
