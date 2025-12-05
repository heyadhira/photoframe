import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { projectId } from '../utils/supabase/info';

type VideoItem = {
  id: string;
  title: string;
  url: string;
  caption?: string;
  thumbnail?: string;
};

export default function ShopByVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<VideoItem | null>(null);

  useEffect(() => { fetchVideos(); }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-52d68140/videos`);
      const data = await res.json();
      setVideos(data.videos || []);
    } finally { setLoading(false); }
  };

  const isYouTube = (url: string) => /youtube\.com|youtu\.be/.test(url);

  return (
    <div className="min-h-screen about-theme content-offset">
      <Navbar />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="section-title"><span className="text-[#3b2f27]">Shop by</span> <span style={{ color: '#14b8a6' }}>Videos</span></h1>
          <p className="text-gray-600 mt-2">Explore wall art and frames through short videos — tap to play.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="skeleton skeleton-img" style={{ aspectRatio: '16 / 9' }} />
                <div className="p-4 space-y-2">
                  <div className="skeleton skeleton-line lg w-3/4" />
                  <div className="skeleton skeleton-line sm w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map(v => (
              <button key={v.id} className="text-left bg-white rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden" onClick={() => setOpen(v)}>
                <div className="relative" style={{ aspectRatio: '16 / 9' }}>
                  {v.thumbnail ? (
                    <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="skeleton skeleton-img w-full h-full" />
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-white/70 backdrop-blur-sm px-4 py-2">
                    <h3 className="text-gray-900 font-semibold">{v.title}</h3>
                    {v.caption && <p className="text-sm text-gray-700">{v.caption}</p>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-12">No videos available yet.</p>
        )}
      </section>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setOpen(null)}>
          <div className="bg-white rounded-xl shadow-xl w-[94vw] md:w-[900px] overflow-hidden" onClick={(e)=>e.stopPropagation()}>
            <div className="relative" style={{ aspectRatio: '16 / 9' }}>
              {isYouTube(open.url) ? (
                <iframe
                  src={open.url.replace('watch?v=', 'embed/')}
                  title={open.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={open.url} controls className="w-full h-full" />
              )}
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-900">{open.title}</h3>
              {open.caption && <p className="text-gray-700 mt-1">{open.caption}</p>}
              <div className="mt-4 flex justify-end">
                <button className="premium-btn-white" onClick={()=>setOpen(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

