import React from 'react';
import { X, CheckCircle2, AlertTriangle, Cable, Speaker, Wifi, Usb, Zap } from 'lucide-react';

interface WiringGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WiringGuideModal: React.FC<WiringGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#121620] border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#161c28] border-b border-slate-800 p-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <Cable className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold text-slate-100">
                AK-45 Hardware Wiring & Multi-Output Setup Guide
              </h2>
              <p className="text-xs text-slate-400">
                Verified instructions matching your amplifier, USB-C hub, and network router photos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-sm text-slate-300">
          
          {/* Step 1: Spring Clip Speaker Terminals (Photo 2) */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Speaker className="w-4 h-4" />
              <span>1. Speaker Output Spring Clips (Photo 2 Connections)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your AK-45 uses 4 spring push clips labeled <strong className="text-white">SPEAKERS OUTPUT</strong>:
            </p>
            <ul className="text-xs space-y-2 list-disc list-inside text-slate-300 pl-1">
              <li>
                <strong className="text-rose-400">Right (+) Red Clip</strong> &amp; <strong className="text-slate-400">Right (-) Black Clip</strong>: Connect to your Right passive loudspeaker.
              </li>
              <li>
                <strong className="text-rose-400">Left (+) Red Clip</strong> &amp; <strong className="text-slate-400">Left (-) Black Clip</strong>: Connect to your Left passive loudspeaker.
              </li>
              <li>
                <strong className="text-amber-300">Wire Safety Note:</strong> Strip 8mm–10mm of bare copper. Press the spring tab down, insert the wire, and release. Verify no stray copper strands touch the adjacent terminal to prevent short-circuit amplifier protection shutdown.
              </li>
              <li>
                <strong className="text-white">Impedance:</strong> Works with 4Ω to 8Ω passive speakers (supports 40W + 40W continuous RMS / 400W peak power).
              </li>
            </ul>
          </div>

          {/* Step 2: RCA Audio Input (Photo 2) */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Cable className="w-4 h-4" />
              <span>2. Audio Input (Braided RCA Jacks)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              The rear RCA jacks labeled <strong className="text-white">AUDIO INPUT</strong> connect to your playback sources:
            </p>
            <ul className="text-xs space-y-1.5 list-disc list-inside text-slate-300 pl-1">
              <li><strong className="text-white">White RCA:</strong> Left Channel Audio line-in.</li>
              <li><strong className="text-rose-400">Red RCA:</strong> Right Channel Audio line-in.</li>
              <li>
                Connect to a 3.5mm headphone jack, TV optical DAC, turntable preamp, or computer audio output.
              </li>
            </ul>
          </div>

          {/* Step 3: USB-C Multiport Hub Routing (Photo 3) */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <Usb className="w-4 h-4" />
              <span>3. Multi-Output USB-C Hub Routing (Photo 3 Integration)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Using the USB-C multiport adapter shown in your photos, you can manage multi-device audio routing:
            </p>
            <ul className="text-xs space-y-1.5 list-disc list-inside text-slate-300 pl-1">
              <li>Plug a high-res USB DAC into one of the USB-A ports on the hub.</li>
              <li>Use the 3.5mm-to-RCA cable from the DAC into the AK-45's RCA inputs.</li>
              <li>In the <strong className="text-cyan-400">Multi-Output Matrix</strong> tab, route independent feeds or mirror audio to external headphones and soundbars simultaneously.</li>
            </ul>
          </div>

          {/* Step 4: Network Router Multi-Room Streaming (Photo 4) */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Wifi className="w-4 h-4" />
              <span>4. Ethernet Network Gateway Multi-Room (Photo 4 Router)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your network gateway provides the backbone for multi-room low-latency synchronized streaming:
            </p>
            <ul className="text-xs space-y-1.5 list-disc list-inside text-slate-300 pl-1">
              <li>Connect an Ethernet audio streamer (e.g., Raspberry Pi HiFiBerry, Wiim, or AirPlay bridge) to LAN Port 1-4.</li>
              <li>Use the <strong className="text-cyan-400">Delay Compensation</strong> slider in the Multi-Output tab to offset acoustic room distance (10-30ms) for perfectly synchronized sound across all rooms.</li>
            </ul>
          </div>

          {/* Step 5: Power Supply Best Practices */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <Zap className="w-4 h-4" />
              <span>5. Dual Power Supply Safety</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              The AK-45 features dual power options. Use <strong>either</strong> AC mains (110V–240V via the figure-8 power cord) <strong>OR</strong> DC 12V 5A barrel jack (for car/boat/battery use). Do not connect both power supplies simultaneously.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#161c28] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
          >
            Got It &amp; Return to Controller
          </button>
        </div>

      </div>
    </div>
  );
};
