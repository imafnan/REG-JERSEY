import { useState, useEffect, useRef } from "react";
import {
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Shirt,
  ZoomIn
} from "lucide-react";

export default function HeroGallery({ galleryImages }) {
  const images = galleryImages && galleryImages.length > 0
    ? galleryImages
    : [
        {
          id: "1",
          title: "Zenith FC Official Home Jersey (Front View)",
          url: "/images/jerseys/jersey-front.jpg",
          tag: "Official Home Kit"
        },
        {
          id: "2",
          title: "Custom Player Name & Number Print (Back View)",
          url: "/images/jerseys/jersey-back.jpg",
          tag: "Customizable Back"
        },
        {
          id: "3",
          title: "Breathable Athletic Weave & High-Density Crest",
          url: "/images/jerseys/jersey-detail.jpg",
          tag: "Badge & Fabric Detail"
        }
      ];

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Touch handling for mobile swipe
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent background scrolling when lightbox is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [lightboxOpen]);

  // Touch swipe handling
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      handleNext(); // Swiped left -> next image
    } else if (distance < -50) {
      handlePrev(); // Swiped right -> prev image
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section id="gallery" className="pt-8 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Official Club Merchandise
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display uppercase tracking-tight text-gray-950 font-bold leading-none mb-3">
            The Official Zenith FC Jersey
          </h1>
          <p className="text-base sm:text-lg text-gray-600 font-medium">
            Designed for performance on the pitch and style on the streets. Tap any image to examine fabric weave, embroidered crest, and custom printing.
          </p>
        </div>

        {/* 3 Prominent Jersey Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {images.slice(0, 3).map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => openLightbox(idx)}
              className="group relative bg-neutral-100 rounded-2xl overflow-hidden border border-gray-200/90 shadow-sm hover:shadow-xl hover:border-emerald-600/40 transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Image Aspect Box */}
              <div className="relative aspect-[3/4] w-full bg-neutral-200/50 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading={idx === 0 ? "eager" : "lazy"}
                  onError={(e) => {
                    // Fallback to generated public images if path differs
                    if (!e.target.src.includes("zenith_jersey")) {
                      e.target.src = idx === 1 ? "/images/zenith_jersey_back.jpg" : "/images/zenith_jersey_home.jpg";
                    }
                  }}
                />

                {/* Badge Tag */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1.5 rounded-lg bg-black/85 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider shadow-md">
                    {item.tag || `View 0${idx + 1}`}
                  </span>
                </div>

                {/* Zoom overlay hint */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="p-3 rounded-full bg-white/95 text-gray-900 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <ZoomIn className="w-6 h-6 text-emerald-800" />
                  </div>
                </div>
              </div>

              {/* Title & Action Footer */}
              <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-sm font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500">Tap to inspect full resolution</p>
                </div>
                <button
                  type="button"
                  className="p-2 rounded-lg bg-gray-50 text-gray-600 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors"
                  aria-label="Enlarge image"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-2 sm:p-6 select-none animate-in fade-in duration-200"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar with Counter and Close Button */}
          <div className="w-full max-w-5xl flex items-center justify-between text-white px-4 py-3 z-10">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold tracking-widest uppercase text-emerald-400">
                Zenith FC Kit Preview
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-white/10 text-gray-300">
                {currentIndex + 1} / {images.length}
              </span>
            </div>

            <button
              onClick={closeLightbox}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
              aria-label="Close image lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Large Image Container */}
          <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center overflow-hidden my-auto">
            {/* Previous Button */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-xl transition-all active:scale-90"
              aria-label="Previous jersey image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Displayed Image */}
            <div className="max-h-[75vh] max-w-full flex items-center justify-center px-8">
              <img
                src={images[currentIndex]?.url}
                alt={images[currentIndex]?.title}
                className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl transition-all duration-300"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-xl transition-all active:scale-90"
              aria-label="Next jersey image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Caption and Thumbnails Bottom Bar */}
          <div className="w-full max-w-5xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left z-10">
            <div>
              <p className="text-base font-bold text-white">
                {images[currentIndex]?.title}
              </p>
              <p className="text-xs text-gray-400">
                Official Zenith FC Specification — Mobile swipe enabled
              </p>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex items-center gap-2">
              {images.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentIndex
                      ? "border-emerald-400 scale-105 shadow-md"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`Switch to image ${idx + 1}`}
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
