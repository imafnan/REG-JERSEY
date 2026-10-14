import { Tag, Check, Clock, AlertTriangle, ShieldCheck, Flame } from "lucide-react";

export default function PriceSection({ settings }) {
  const price = settings?.jerseyPrice ?? 450;
  const currency = settings?.currencySymbol || "৳";
  const isOpen = settings?.registrationOpen !== false;
  const subtitle = settings?.subtitle || "Register your name and preferred jersey number.";

  return (
    <section id="pricing" className="py-10 bg-neutral-900 text-white relative overflow-hidden">
      {/* Subtle athletic diagonal pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-emerald-950 via-neutral-900 to-black rounded-3xl p-6 sm:p-10 border border-emerald-800/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left Text / Info */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-emerald-400" />
              Official 2026 Season Kit
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display uppercase tracking-wide text-white">
              Zenith FC Official Jersey
            </h2>

            <p className="text-gray-300 text-base sm:text-lg font-medium max-w-xl">
              {subtitle}
            </p>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-y-2 gap-x-4 pt-2 text-xs sm:text-sm text-gray-300">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Custom Name & Number</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Embroidered Club Crest</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Moisture-Wicking DryFit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Authentic Club Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Price Card */}
          <div className="w-full md:w-auto shrink-0 flex flex-col items-center">
            <div className="w-full sm:w-72 bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-emerald-500/30 text-center shadow-xl">
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 block mb-1">
                Official Club Price
              </span>
              
              <div className="flex items-center justify-center gap-1 my-2">
                <span className="text-3xl font-extrabold text-emerald-400">{currency}</span>
                <span className="text-5xl sm:text-6xl font-black font-display tracking-tight text-white">
                  {price}
                </span>
              </div>

              <p className="text-xs text-gray-400 mb-4">
                All-inclusive • Name & Number Heat-Press Included
              </p>

              {isOpen ? (
                <a
                  href="#register"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide uppercase transition-all shadow-lg shadow-emerald-950 active:scale-95"
                >
                  <Tag className="w-4 h-4" />
                  Order Your Jersey
                </a>
              ) : (
                <div className="w-full py-3 px-4 rounded-xl bg-red-950/80 border border-red-700/60 text-red-300 font-bold text-xs uppercase flex items-center justify-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  Registration Closed
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
