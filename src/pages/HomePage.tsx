import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ProductCard } from "../components/ProductCard";
import { Star, Leaf, Palette, Brush, ShieldCheck } from "lucide-react";
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
  profileImage?: string;
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
  const [bestApi, setBestApi] = useState<CarouselApi | null>(null);
  const [bestSelected, setBestSelected] = useState(0);
  const [viewportW, setViewportW] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [faqsLoading, setFaqsLoading] = useState(true);
  const [testApi, setTestApi] = useState<CarouselApi | null>(null);
  const computeTags = () => {
    const words = new Set<string>();
    featuredProducts.forEach((p:any) => {
      (p.name || '').split(/\s+/).forEach((w:string) => {
        const clean = w.replace(/[^A-Za-z]/g, '');
        const pick = clean.toLowerCase();
        const allow = ['lion','zebra','owl','rama','virat','horses','canvas','frame','black'];
        if (allow.includes(pick)) words.add(clean.charAt(0).toUpperCase()+clean.slice(1).toLowerCase());
      });
    });
    const list = Array.from(words);
    return list.length ? list.slice(0, 6) : ['Lion','Black','Rama','Owl','Virat','Horses'];
  };
  const tags = computeTags();

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

  useEffect(() => {
    const onResize = () => setViewportW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, []);

  useEffect(() => {
    if (!testApi) return;
    const id = setInterval(() => {
      try { testApi.scrollNext(); } catch {}
    }, 2500);
    return () => clearInterval(id);
  }, [testApi]);

  const fetchFaqs = async () => {
    try {
      setFaqsLoading(true);
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-52d68140/faqs`);
      const data = await res.json();
      setFaqs(data.faqs || []);
    } catch {}
    finally { setFaqsLoading(false); }
  };

  const slidesPerView = viewportW >= 1024 ? 3 : viewportW >= 640 ? 2 : 1;

useEffect(() => {
  if (!bestApi) return;

  const onSelect = () => {
    setBestSelected(bestApi.selectedScrollSnap());
  };

  bestApi.on("select", onSelect);

  // Auto slide
  const interval = setInterval(() => {
    try { bestApi.scrollNext(); } catch {}
  }, 2000);

  return () => {
    bestApi.off("select", onSelect);
    clearInterval(interval);
  };
}, [bestApi]);


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
    <div className="min-h-screen about-theme content-offset">
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
      <h1 className="hero-title"><span className="text-white">Discover</span> <span className="accent">300+</span> <span className="text-white">Modern</span></h1>
      <h2 className="hero-subtitle"><span className="text-white">Wall Frames</span></h2>
      <div className="hero-buttons">
        <Link to="/shop" className="premium-btn-white">Shop Now</Link>
        <Link to="/contact" className="premium-btn-white">Contact us</Link>
      </div>
      <div className="hero-caption">300+ Collection of premium frame</div>
    </div>
  </div>
</section>








{/* BEST SELLERS */}
<section className="best-section max-w-7xl mx-auto px-4 py-16 lg:py-20 relative overflow-hidden">

  {/* Heading */}
  <div className="text-center mb-8 fade-up">
    <h2 className="section-title">
      <span className="text-[#3b2f27]">Explore</span>
      <span style={{ color: '#14b8a6' }}> Frames</span> for Every Room
    </h2>
  </div>

  {/* Filter Pills */}
  <div className="flex justify-center gap-3 mb-12">
    {(['All', 'Rolled', 'Canvas', 'Frame'] as const).map(opt => (
      <button
        key={opt}
        onClick={() => setFormatFilter(opt)}
        className={`pill ${formatFilter === opt ? 'active' : ''}`}
      >
        {opt}
      </button>
    ))}
  </div>

  {/* SLIDER */}
  {loading ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="skeleton skeleton-img" style={{ aspectRatio: '4 / 5' }} />
          <div className="p-4">
            <div className="skeleton skeleton-line lg w-2/3" />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="relative mb-12">

      <Carousel
        opts={{ loop: true, align: "center", slidesToScroll: 1 }}
        setApi={setBestApi}
        className="w-full overflow-hidden"
      >
        <CarouselContent className="gap-6">

          {featuredProducts
            .filter((p: any) => formatFilter === "All" ? true : p.format === formatFilter)
            .map((p: any, idx: number) => {

              const total = featuredProducts.filter((x: any) =>
                formatFilter === "All" ? true : x.format === formatFilter
              ).length;

              const leftIndex = (bestSelected - 1 + total) % total;
              const rightIndex = (bestSelected + 1) % total;

              const isCenter = idx === bestSelected;
              const isLeft = idx === leftIndex;
              const isRight = idx === rightIndex;

              let positionClass = "best-item-side";
              if (isCenter) positionClass = "best-item-center";
              else if (isLeft) positionClass = "best-item-left";
              else if (isRight) positionClass = "best-item-right";

              return (
                <CarouselItem
  key={p.id || idx}
  className="best-carousel-item basis-full sm:basis-1/2 lg:basis-1/3 flex justify-center"
>
  <Link 
    to={`/product/${p.id}`} 
    className={`best-item ${positionClass}`}
    style={{ textDecoration: "none" }}
  >
    <div
      className="best-card cursor-pointer"
      style={{ aspectRatio: isCenter ? "4 / 5" : "4 / 4" }}
    >
      <img src={p.image} alt={p.name} />
      <div className="best-caption">{p.name}</div>
    </div>
  </Link>
</CarouselItem>

              );

            })}

        </CarouselContent>

        <CarouselPrevious className="hidden lg:flex" />
        <CarouselNext className="hidden lg:flex" />
      </Carousel>

      {/* GIANT CLICK AREAS */}
      <div className="best-click-left" onClick={() => bestApi?.scrollPrev()}></div>
      <div className="best-click-right" onClick={() => bestApi?.scrollNext()}></div>

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
          <span className="text-white">Custom</span> <br />
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "4rem",
            }}
          >
           <span className="text-white">Canvas</span> 
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
          icon: Leaf,
        },
        {
          title: "Design",
          desc: "Contemporary and timeless designs crafted to complement any home aesthetic perfectly.",
          icon: Palette,
        },
        {
          title: "Crafting",
          desc: "Handcrafted by skilled artisans using time-honored techniques and precision tools.",
          icon: Brush,
        },
        {
          title: "Quality Assurance",
          desc: "Every frame undergoes rigorous quality checks to ensure it meets our standards.",
          icon: ShieldCheck,
        },
      ].map((item, idx) => (
        <div
          key={idx}
          className="curve-card curve-reflection fade-up"
          style={{
            background: "white",
            borderRadius: "50px",
            padding: "22px",
            minHeight: "30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
            border: "2px solid #14b8a6",
          }}
        >

          {/* Circular Icon */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-3"
            style={{
              backgroundColor: "#14b8a6",
              boxShadow: "inset 0 2px 6px rgba(0,0,0,.06), 0 6px 12px rgba(0,0,0,.08)",
            }}
          >
            {(() => {
              const Icon = (item as any).icon;
              return <Icon className="w-10 h-10" color="#ffffff" />;
            })()}
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
          <span className="text-white">Wall</span>
        </h2>
        <h1 className="text-6xl lg:text-7xl font-serif font-extrabold">
          Art
        </h1>
        <h2 className="text-4xl lg:text-5xl font-serif font-bold">
         <span className="text-white">Collection</span> 
        </h2>
      </div>

      {/* DESCRIPTION */}
      <p className="text-gray-100 max-w-md leading-relaxed text-lg"><span className="text-white">
        Discover our curated collection of premium wall décor frames — 
        from elegant minimalist pieces to luxurious handcrafted artwork.
      </span></p>

      {/* BUTTON */}
      <Link
        to="/shop"
        className="premium-btn-white inline-block"
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
      {loading ? (
        <section className="py-16 lg:py-20 bg-[#faf7f4]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-6 rounded-lg bg-white shadow-sm">
                  <div className="flex items-start mb-4 gap-3">
                    <div className="skeleton rounded-full w-12 h-12" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton skeleton-line lg w-1/2" />
                      <div className="skeleton skeleton-line sm w-1/3" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="skeleton skeleton-line lg w-full" />
                    <div className="skeleton skeleton-line lg w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : testimonials.length > 0 && (
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

            <div className="mb-12">
              <Carousel opts={{ loop: true, align: "center", slidesToScroll: 1 }} setApi={setTestApi} className="w-full overflow-hidden testimonial-carousel">
                <CarouselContent className="ml-0 gap-6">
                  {testimonials.map((t) => (
                    <CarouselItem className="pl-0 flex-none w-1/3">

                      <div className="soft-card p-6 rounded-2xl bg-white border hover:shadow-lg transition mx-2" data-aos="fade-up">
                        <div className="flex items-start mb-4">
                          <img src={t.profileImage || ''} alt={t.name} className="w-12 h-12 rounded-full object-cover mr-3 bg-gray-100 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-gray-900 text-base font-semibold">{t.name}</p>
                            <div className="flex mt-1">
                              {Array.from({ length: t.rating }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400" style={{ fill: '#facc15' }} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{(t.text || '').length > 160 ? (t.text || '').slice(0, 160).replace(/\s+\S*$/, '') + '…' : (t.text || '')}</p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden lg:flex" />
                <CarouselNext className="hidden lg:flex" />
              </Carousel>
            </div>

            <div className="text-center"> 
              <Link 
                to="/testimonials" 
                className="inline-block px-6 py-3 rounded-full transition shadow-md" 
                style={{ 
                  backgroundColor: '#14b8a6', 
                  color: 'black', 
                  fontWeight: 500 
                }} 
                
              > 
                View Customer Gallery 
              </Link> 
            </div> 
          </div> 
        </section> 
      )}


      {/* FAQ Section */}
{faqsLoading ? (
  <section className="max-w-7xl mx-auto px-4 py-16">
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-white shadow-sm p-4">
          <div className="skeleton skeleton-line lg w-2/3 mb-2" />
          <div className="skeleton skeleton-line lg w-full mb-2" />
          <div className="skeleton skeleton-line lg w-5/6" />
        </div>
      ))}
    </div>
  </section>
) : faqs.length > 0 && (
  <section className="faq-dark">
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="faq-title">FAQs</h2>
      <div className="faq-list">
        {faqs.map((f) => (
          <details key={f.id} className="faq-item group">
            <summary className="faq-summary">
              <span className="faq-icon">
                <span className="plus group-open:hidden">+</span>
                <span className="minus hidden group-open:inline">−</span>
              </span>
              <span className="faq-question">{String(f.question).toUpperCase()}</span>
            </summary>
            <div className="faq-answer">
              {f.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  </section>
)}

      <Footer />
     

    </div>
  );
}
