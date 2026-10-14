import React from "react";
import { Shield } from "lucide-react";

export default function JerseyCardPreview({ jerseyName, jerseyNumber, jerseySize }) {
  const displayNum = jerseyNumber !== "" && !isNaN(jerseyNumber) ? jerseyNumber : "10";
  const displayName = jerseyName.trim() ? jerseyName.trim().toUpperCase() : "YOUR NAME";
  const displaySize = jerseySize || "L";

  return (
    <div className="relative w-full max-w-sm mx-auto select-none">
      {/* Outer Card Frame */}
      <div className="relative bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 rounded-3xl p-6 sm:p-7 shadow-2xl border border-neutral-800 text-white overflow-hidden group">
        
        {/* Subtle Athletic Grid Lines & Light Glare */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80 relative z-10">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-7">
              <img src="/favicon.svg" alt="Crest" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-xs font-black tracking-widest text-white uppercase font-athletic">ZENITH FC</span>
              <p className="text-[10px] text-emerald-400 font-semibold tracking-wider">OFFICIAL MATCH KIT</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-300 text-[11px] font-bold">
            SIZE: {displaySize}
          </span>
        </div>

        {/* Jersey Graphic Container */}
        <div className="relative my-6 flex flex-col items-center justify-center min-h-[220px]">
          
          {/* Stylized Jersey Back Graphic */}
          <div className="relative w-56 h-64 bg-emerald-900 rounded-2xl border-4 border-neutral-900 shadow-xl overflow-hidden flex flex-col items-center justify-between py-6 px-4">
            
            {/* Jersey Collar & Shoulder Ribbing */}
            <div className="absolute top-0 inset-x-0 h-4 bg-neutral-950 border-b border-white/20"></div>
            <div className="absolute top-0 w-16 h-3 bg-neutral-900 rounded-b-xl border-x border-b border-white/30"></div>
            
            {/* Fabric texture subtle lines */}
            <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(45deg,#000_0,#000_2px,transparent_0,transparent_8px)] pointer-events-none"></div>

            {/* Custom Printed Player Name */}
            <div className="relative z-10 w-full text-center mt-3">
              <span className="block font-athletic font-black text-base sm:text-lg tracking-widest text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] truncate px-1">
                {displayName}
              </span>
            </div>

            {/* Custom Printed Player Number */}
            <div className="relative z-10 flex items-center justify-center my-auto">
              <span className="font-athletic font-black text-7xl sm:text-8xl tracking-normal text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] scale-y-110">
                {displayNum}
              </span>
            </div>

            {/* Jersey Bottom Tag */}
            <div className="relative z-10 w-full flex items-center justify-between text-[9px] text-emerald-200/60 font-semibold uppercase tracking-wider pt-2 border-t border-emerald-800/40">
              <span>EST. 1921</span>
              <span>AUTHENTIC KIT</span>
            </div>
          </div>

        </div>

        {/* Live Preview Footer Note */}
        <div className="text-center pt-2 relative z-10">
          <p className="text-[11px] text-neutral-400 font-medium">
            Live Print Preview • Direct Heat-Pressed Vinyl Transfer
          </p>
        </div>

      </div>
    </div>
  );
}
