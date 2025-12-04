import React, { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { X } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/gallery`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        }
      );
      const data = await response.json();
      setGalleryItems(data.galleryItems || []);
    } catch (error) {
      console.error("Gallery fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", "Events", "Studio", "Outdoor", "Portrait"];

  const filteredItems =
    filter === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === filter);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // 🟢 FIXED PAGINATION LOGIC — ALWAYS 12 ITEMS
  // 1) Group all filtered items by year
  const grouped = filteredItems.reduce((acc, item) => {
    const year = item.year ?? new Date().getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(item);
    return acc;
  }, {});

  const sortedYears = Object.keys(grouped).sort((a, b) => b - a);

  // 2) Flatten (so pagination works across years)
  const flattened = sortedYears.flatMap((year) =>
    grouped[year].map((item) => ({ ...item, __year: year }))
  );

  // 3) Pagination applied ONLY here
  const totalPages = Math.ceil(flattened.length / ITEMS_PER_PAGE);

  const paginatedFlat = flattened.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // 4) Re-group only paginated items by their year
  const itemsByYear = paginatedFlat.reduce((acc, item) => {
    if (!acc[item.__year]) acc[item.__year] = [];
    acc[item.__year].push(item);
    return acc;
  }, {});

  const years = Object.keys(itemsByYear).sort((a, b) => b - a);

  return (
    <div className="min-h-screen about-theme bg-[#f3f1ed] content-offset">
      <Navbar />

      {/* HERO */}
      <section className="w-full py-14 px-4 sm:py-20 mt-6 mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="soft-card p-8 sm:p-12 card-appear">
            <h1 className="text-center text-4xl sm:text-5xl font-bold font-rashi animate-title mb-4">
              Our <span style={{ color: "#14b8a6" }}>Gallery</span>
            </h1>
            <p className="text-center text-gray-600 max-w-3xl mx-auto italic text-base sm:text-lg">
              A curated collection of artwork captured across events, studios,
              outdoor moments and creative visuals — all crafted with passion.
            </p>
          </div>
        </div>
      </section>

      {/* FILTER */}
      <div className="max-w-7xl mx-auto px-4 pb-10">
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full account-tab font-medium shadow-md transition-all whitespace-nowrap text-black
                ${
                  filter === cat
                    ? "bg-[#14b8a6] text-black"
                    : "bg-white text-gray-700 border border-gray-300"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* GALLERY */}
      <div className="max-w-7xl mx-auto px-4 pb-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-12 w-12 border-b-2 border-[#14b8a6] rounded-full"></div>
          </div>
        ) : flattened.length === 0 ? (
          <p className="text-center py-20 text-gray-500 text-lg">
            No items found
          </p>
        ) : (
          <div className="space-y-16">
            {years.map((year) => (
              <div key={year}>
                <h2 className="text-4xl font-rashi font-bold text-[#3b2f27] mb-10 pt-12">
                  {year}
                </h2>

                <div
                  className="
                  grid 
                  grid-cols-1 
                  sm:grid-cols-2 
                  md:grid-cols-4 
                  lg:grid-cols-4 
                  gap-8
                "
                >
                  {itemsByYear[year].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedImage(item)}
                      className="curved-image-card cursor-pointer"
                    >
                      <div className="w-full aspect-[4/3] bg-gray-100">
                        <ImageWithFallback
                          src={item.thumbUrl || item.image}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="p-4">
                        <h3 className="font-rashi font-semibold text-lg text-gray-800">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {flattened.length > ITEMS_PER_PAGE && (
        <div className="max-w-7xl mx-auto px-4 pb-20">
          <div className="flex justify-center gap-3 flex-wrap">

            {/* Prev */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-full border shadow-sm transition-all ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50 text-gray-800"
              }`}
            >
              Prev
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-full border shadow-sm transition-all ${
                  currentPage === i + 1
                    ? "bg-[#14b8a6] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-full border shadow-sm transition-all ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50 text-gray-800"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X className="w-10 h-10" />
          </button>

          <div
            className="max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl p-6 shadow-xl about-theme card-appear"
            onClick={(e) => e.stopPropagation()}
          >
            <ImageWithFallback
              src={selectedImage.image}
              className="w-full max-h-[70vh] object-contain mx-auto rounded-xl"
            />

            <h2 className="text-3xl font-rashi text-center mt-4">
              {selectedImage.title}
            </h2>

            <p className="text-center text-gray-600 mt-2 max-w-2xl mx-auto">
              {selectedImage.description}
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
