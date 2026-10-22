import React, { useState } from 'react';
import { ArrowRightLeft, CheckCircle2, AlertTriangle, ShieldCheck, Zap, Info } from 'lucide-react';

interface RearPanelProps {
  onFlipToFront: () => void;
  masterVolume: number;
}

export const RearPanel: React.FC<RearPanelProps> = ({ onFlipToFront, masterVolume }) => {
  const [speakerImpedance, setSpeakerImpedance] = useState<4 | 6 | 8>(4);
  const [isBananaPlugTight, setIsBananaPlugTight] = useState(true);

  // Compute calculated wattage based on volume and impedance
  const calculatedWatts = Math.round(((masterVolume / 100) ** 1.8) * (speakerImpedance === 4 ? 40 : speakerImpedance === 6 ? 30 : 25));

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 bg-[#121620]">
      {/* Top Header */}
      <div className="bg-[#181d28] border-b border-slate-800 px-6 py-2 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-600 shadow-inner" />
          <span className="font-mono text-[11px] tracking-widest text-slate-300 font-bold uppercase">
            AK-45 REAR I/O & PHYSICAL TERMINAL DECK
          </span>
          <span className="text-[10px] text-slate-400">CLASS D / 4Ω–8Ω LOAD</span>
        </div>

        <button
          onClick={onFlipToFront}
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded transition-colors border border-slate-700"
        >
          <ArrowRightLeft className="w-3 h-3 text-cyan-400" />
          <span>Flip to Front Controls</span>
        </button>
      </div>

      {/* Main Rear Faceplate */}
      <div className="p-6 md:p-8 bg-gradient-to-b from-[#181d26] via-[#131720] to-[#0f1219]">
        
        {/* Terminal Blocks Grid matching user's photo 2! */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* 1. SPEAKERS OUTPUT SPRING CLIPS (Centerpiece of Photo 2) */}
          <div className="lg:col-span-6 bg-slate-900/80 border-2 border-slate-800 rounded-xl p-5 relative">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
              <div>
                <h3 className="font-mono text-sm font-bold text-slate-200 tracking-wider">
                  SPEAKERS OUTPUT
                </h3>
                <p className="text-[11px] text-slate-400">
                  4-Terminal Spring Push Clips (Left & Right Channels)
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                <CheckCircle2 className="w-3 h-3" />
                <span>LOAD SECURE</span>
              </div>
            </div>

            {/* Interactive Spring Terminal Representation matching user's wiring */}
            <div className="grid grid-cols-2 gap-4 bg-black/60 p-4 rounded-lg border border-slate-800">
              
              {/* Right Channel Terminals */}
              <div className="flex flex-col items-center">
                <span className="font-mono text-xs font-bold text-slate-300 mb-2">RIGHT (R)</span>
                <div className="flex items-center gap-3">
                  {/* R (+) Red tab */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-10 bg-rose-600 rounded-t border-t border-rose-400 flex items-center justify-center shadow">
                      <span className="text-white font-bold text-xs">+</span>
                    </div>
                    <div className="w-8 h-6 bg-slate-900 rounded-b border-b border-slate-700 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-200 animate-pulse" title="Yellow/Red Wire Connected" />
                    </div>
                    <span className="text-[9px] font-mono text-rose-400 mt-1">RED (+)</span>
                  </div>

                  {/* R (-) Black tab */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-10 bg-slate-800 rounded-t border-t border-slate-600 flex items-center justify-center shadow">
                      <span className="text-slate-300 font-bold text-xs">-</span>
                    </div>
                    <div className="w-8 h-6 bg-slate-900 rounded-b border-b border-slate-700 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-slate-300 border border-slate-100" title="White/Bare Wire Connected" />
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 mt-1">BLK (-)</span>
                  </div>
                </div>
              </div>

              {/* Left Channel Terminals */}
              <div className="flex flex-col items-center border-l border-slate-800 pl-4">
                <span className="font-mono text-xs font-bold text-slate-300 mb-2">LEFT (L)</span>
                <div className="flex items-center gap-3">
                  {/* L (+) Red tab */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-10 bg-rose-600 rounded-t border-t border-rose-400 flex items-center justify-center shadow">
                      <span className="text-white font-bold text-xs">+</span>
                    </div>
                    <div className="w-8 h-6 bg-slate-900 rounded-b border-b border-slate-700 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-rose-500 border border-rose-300 animate-pulse" title="Red Core Wire Connected" />
                    </div>
                    <span className="text-[9px] font-mono text-rose-400 mt-1">RED (+)</span>
                  </div>

                  {/* L (-) Black tab */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-10 bg-slate-800 rounded-t border-t border-slate-600 flex items-center justify-center shadow">
                      <span className="text-slate-300 font-bold text-xs">-</span>
                    </div>
                    <div className="w-8 h-6 bg-slate-900 rounded-b border-b border-slate-700 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-slate-300 border border-slate-100" title="White Core Wire Connected" />
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 mt-1">BLK (-)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Live Impedance & Load Metrics */}
            <div className="mt-4 flex items-center justify-between bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">SELECTED IMPEDANCE</span>
                <div className="flex gap-2 mt-1">
                  {([4, 6, 8] as const).map(imp => (
                    <button
                      key={imp}
                      onClick={() => setSpeakerImpedance(imp)}
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        speakerImpedance === imp
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {imp}Ω
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">ESTIMATED OUTPUT</span>
                <span className="text-cyan-400 font-bold text-sm tabular-nums">
                  {calculatedWatts}W + {calculatedWatts}W RMS
                </span>
              </div>
            </div>
          </div>

          {/* 2. AUDIO INPUT (RCA Jacks) & FM ANTENNA */}
          <div className="lg:col-span-3 bg-slate-900/80 border-2 border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="border-b border-slate-800 pb-2 mb-3">
                <h3 className="font-mono text-sm font-bold text-slate-200 tracking-wider">
                  AUDIO INPUT
                </h3>
                <p className="text-[11px] text-slate-400">RCA Line-Level (Photo 2)</p>
              </div>

              {/* RCA Sockets */}
              <div className="flex items-center justify-around bg-black/60 p-4 rounded-lg border border-slate-800 my-2">
                {/* RCA White / Left */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-200 border-4 border-slate-400 flex items-center justify-center shadow-inner">
                    <div className="w-2.5 h-2.5 rounded-full bg-black" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-300 mt-1">L (WHITE)</span>
                </div>

                {/* RCA Red / Right */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-rose-600 border-4 border-rose-800 flex items-center justify-center shadow-inner">
                    <div className="w-2.5 h-2.5 rounded-full bg-black" />
                  </div>
                  <span className="text-[9px] font-mono text-rose-400 mt-1">R (RED)</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Braided RCA Cable Connected</span>
              </div>
            </div>

            {/* FM Antenna Terminal */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-300">FM ANTENNA</span>
                  <span className="block text-[10px] text-slate-400">75Ω Coaxial Screw Terminal</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-500 flex items-center justify-center shadow-inner">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#38bdf8]" />
                </div>
              </div>
            </div>
          </div>

          {/* 3. POWER MAINS: AC 110-240V & DC 12V 5A */}
          <div className="lg:col-span-3 bg-slate-900/80 border-2 border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="border-b border-slate-800 pb-2 mb-3">
                <h3 className="font-mono text-sm font-bold text-slate-200 tracking-wider">
                  DUAL POWER INPUT
                </h3>
                <p className="text-[11px] text-slate-400">AC Mains / DC 12V 5A</p>
              </div>

              {/* AC Mains Socket */}
              <div className="bg-black/60 p-3 rounded-lg border border-slate-800 mb-3 flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-slate-200 font-semibold block">AC 110V–240V</span>
                  <span className="text-[10px] text-slate-400">50/60 Hz Internal Transformer</span>
                </div>
                <div className="w-8 h-8 rounded bg-slate-800 border border-slate-600 flex flex-col items-center justify-center gap-1 shadow-inner">
                  <div className="w-3 h-1 bg-black rounded-xs" />
                  <div className="w-3 h-1 bg-black rounded-xs" />
                </div>
              </div>

              {/* DC 12V 5A Jack */}
              <div className="bg-black/60 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-slate-200 font-semibold block">DC 12V 5A</span>
                  <span className="text-[10px] text-slate-400">5.5mm x 2.1mm Center Positive</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center shadow-inner">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>CE / FCC COMPLIANT</span>
              <span className="text-emerald-400 font-semibold">THERMAL: OK (32°C)</span>
            </div>
          </div>

        </div>

        {/* Wiring Warning & Guidance Box */}
        <div className="mt-6 bg-slate-900/90 border border-cyan-900/60 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300">
            <span className="font-semibold text-slate-100 block mb-0.5">
              AK-45 Spring Terminal Wiring Verification
            </span>
            <span>
              As pictured in your setup photo, ensure the bare conductor wires (yellow, red, white) are fully seated into the red (+) and black (-) push clips without stray copper strands touching each other to avoid short-circuit protection tripping.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
