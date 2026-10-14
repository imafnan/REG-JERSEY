import React from "react";
import { Sparkles, CheckCircle2, ShieldCheck, Tag } from "lucide-react";

export default function PriceBanner({ settings }) {
  const price = settings?.jerseyPrice || 450;
  const currency = settings?.currency || "৳";

  return (
    <section className="bg-neutral-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-y border-neutral-800 relative overflow-hidden">
      {/* Subtle athletic pattern accent */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-950/20 -skew-x-12 pointer-events-none hidden md:block"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Left: Prominent Price Title & Subtitle */}
        <div className="text-center md:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Tag className="w-3.5 h-3.5" />
            <span>Official Club Pricing</span>
          </div>
          
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-athletic tracking-wide uppercase text-white">
            Zenith FC Official Jersey — <span className="text-emerald-400">{currency}{price}</span>
          </h2>
          
          <p className="mt-2 text-sm sm:text-base text-neutral-300 max-w-xl">
            Register your name and preferred jersey number. Personalized custom player printing included at no extra cost.
          </p>
        </div>

        {/* Right: Guarantee badges & Call to Action */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex flex-col space-y-1.5 text-xs text-neutral-300">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Free Custom Name & Number Print</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Embroidered Club Crest & High-Tech Fabric</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Guaranteed Unique Number Reservation</span>
            </div>
          </div>

          <a
            href="#register"
            className="w-full sm:w-auto text-center px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide uppercase rounded-xl transition-all shadow-lg hover:shadow-emerald-600/30 flex-shrink-0"
          >
            Claim Your Kit Now
          </a>
        </div>

      </div>
    </section>
  );
}
