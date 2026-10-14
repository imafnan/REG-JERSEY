import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function JerseyGallery() {
  const images = [
    { id: 1, src: "/jer1.jpeg" },
    { id: 2, src: "/jer2.jpeg" },
    { id: 3, src: "/jer3.jpeg" }
  ];

  const [activeImageIndex, setActiveImageIndex] = useState(null);

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="w-full">
      {/* Three images in a clean row on desktop, responsive stack on mobile */}
      {/* No cards, no borders, no backgrounds, no captions/tags */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-center justify-center">
        {images.map((item, index) => (
          <div key={item.id} className="flex items-center justify-center">
            <img
              src={item.src}
              alt="Zenith FC Jersey"
              onClick={() => setActiveImageIndex(index)}
              className="w-full max-h-72 sm:max-h-80 object-contain cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
            />
          </div>
        ))}
      </div>

      {/* Lightbox Preview Modal */}
      {activeImageIndex !== null && (
        <div
          onClick={() => setActiveImageIndex(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center justify-center"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveImageIndex(null)}
              className="absolute -top-10 right-0 p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
              aria-label="Close preview"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Large Full Image */}
            <img
              src={images[activeImageIndex].src}
              alt="Zenith FC Jersey Preview"
              className="max-h-[85vh] max-w-full object-contain rounded-lg"
            />

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
