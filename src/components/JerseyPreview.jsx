import { Shirt, Sparkles } from "lucide-react";

export default function JerseyPreview({ jerseyName, jerseyNumber, jerseySize }) {
  const displayName = (jerseyName || "PLAYER").trim().toUpperCase();
  const displayNumber = jerseyNumber !== "" && jerseyNumber !== undefined ? jerseyNumber : "10";
  const displaySize = jerseySize || "L";

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-sm bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden">
        
        {/* Subtle field texture */}
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Shirt className="w-32 h-32 text-emerald-400" />
        </div>

        {/* Card Header */}
        <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Live Customizer
            </span>
          </div>
          <span className="text-[11px] font-semibold text-gray-400 bg-gray-800/80 px-2.5 py-0.5 rounded-full">
            Size: {displaySize}
          </span>
        </div>

        {/* Realistic Jersey Canvas */}
        <div className="relative aspect-[4/5] w-full rounded-2xl bg-gradient-to-b from-[#02331b] via-[#044e29] to-[#012211] p-4 flex flex-col items-center justify-between border-2 border-emerald-700/50 shadow-inner overflow-hidden">
          
          {/* Subtle Fabric Weave Pattern */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_0.8px,transparent_0.8px)] [background-size:6px_6px]"></div>

          {/* Athletic Collar Graphic */}
          <div className="relative z-10 flex flex-col items-center pt-2">
            <div className="w-24 h-4 rounded-b-full border-b-4 border-l-2 border-r-2 border-black bg-white/90 flex items-center justify-center">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-900">
                ZENITH FC
              </span>
            </div>
            {/* Small Club Monogram */}
            <div className="mt-2 w-6 h-6 rounded-full bg-amber-400/90 text-black flex items-center justify-center font-bold text-[9px] shadow-sm">
              ★
            </div>
          </div>

          {/* Player Custom Name and Number (Center Stage) */}
          <div className="relative z-10 flex flex-col items-center my-auto w-full text-center px-2">
            {/* Player Name */}
            <div className="w-full flex justify-center mb-1 overflow-hidden">
              <span
                className="font-display font-black text-2xl sm:text-3xl tracking-widest text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] truncate max-w-full"
                style={{ letterSpacing: "0.15em" }}
              >
                {displayName}
              </span>
            </div>

            {/* Jersey Number */}
            <div className="flex items-center justify-center">
              <span
                className="font-display font-black text-8xl sm:text-9xl leading-none tracking-tight text-white select-none"
                style={{
                  textShadow:
                    "0 0 1px #d4af37, 2px 2px 0px #000, 3px 3px 0px #d4af37, 5px 5px 12px rgba(0,0,0,0.8)"
                }}
              >
                {displayNumber}
              </span>
            </div>
          </div>

          {/* Jersey Bottom Details */}
          <div className="relative z-10 w-full flex items-center justify-between text-[10px] font-bold text-emerald-300/80 px-2 pt-2 border-t border-emerald-900/40">
            <span className="tracking-widest uppercase">AUTHENTIC 26</span>
            <span className="bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/60 text-[9px] text-emerald-200">
              HEAT-PRESSED
            </span>
          </div>

          {/* Athletic side panels */}
          <div className="absolute left-0 top-1/4 bottom-1/4 w-2 bg-gradient-to-r from-black to-transparent"></div>
          <div className="absolute right-0 top-1/4 bottom-1/4 w-2 bg-gradient-to-l from-black to-transparent"></div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-3 font-medium">
          Official heat-pressed vinyl font & authentic Zenith FC gold outline
        </p>
      </div>
    </div>
  );
}
