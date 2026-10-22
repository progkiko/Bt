import React, { useEffect, useState, useRef } from 'react';
import { audioEngine, VUMeterData } from '../services/audioEngine';

interface VUMeterProps {
  isMuted?: boolean;
  power?: boolean;
}

export const VUMeter: React.FC<VUMeterProps> = ({ isMuted = false, power = true }) => {
  const [levels, setLevels] = useState<VUMeterData>({
    leftLevel: 0,
    rightLevel: 0,
    leftPeak: 0,
    rightPeak: 0,
    leftDb: -60,
    rightDb: -60,
  });

  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;

    const updateMeter = () => {
      if (!active) return;
      if (!power || isMuted) {
        setLevels({
          leftLevel: 0,
          rightLevel: 0,
          leftPeak: 0,
          rightPeak: 0,
          leftDb: -60,
          rightDb: -60,
        });
      } else {
        const current = audioEngine.getVULevels();
        setLevels(current);
      }
      animFrameRef.current = requestAnimationFrame(updateMeter);
    };

    animFrameRef.current = requestAnimationFrame(updateMeter);

    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [power, isMuted]);

  // Total LED segments per channel
  const segmentCount = 20;

  const renderChannelBar = (level: number, peak: number) => {
    const activeSegments = Math.round(level * segmentCount);
    const peakSegmentIndex = Math.min(segmentCount - 1, Math.round(peak * segmentCount));

    return (
      <div className="flex gap-0.5 items-center bg-slate-950 p-1 rounded border border-slate-800/80">
        {Array.from({ length: segmentCount }).map((_, idx) => {
          const isActive = idx < activeSegments;
          const isPeak = idx === peakSegmentIndex && peak > 0.05;

          // Color scale: first 14 green, next 4 amber, last 2 red
          let colorClass = 'bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.7)]';
          let inactiveColor = 'bg-emerald-950/40 border-t border-emerald-900/30';
          if (idx >= 18) {
            colorClass = 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.9)]';
            inactiveColor = 'bg-rose-950/40 border-t border-rose-900/30';
          } else if (idx >= 14) {
            colorClass = 'bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.8)]';
            inactiveColor = 'bg-amber-950/40 border-t border-amber-900/30';
          }

          return (
            <div
              key={idx}
              className={`h-4.5 w-1.5 rounded-2xs transition-all duration-75 ${
                isActive
                  ? colorClass
                  : isPeak
                  ? 'bg-cyan-300 shadow-[0_0_6px_#38bdf8]'
                  : inactiveColor
              }`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-1.5 bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs">
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span className="font-semibold text-slate-300 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          STEREO VU LEVEL (RMS / PEAK)
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-emerald-400">-40dB</span>
          <span className="text-[10px] text-amber-400">0dB</span>
          <span className="text-[10px] text-rose-400 font-semibold">+6dB CLIP</span>
        </div>
      </div>

      {/* Left Channel */}
      <div className="flex items-center gap-2">
        <span className="w-4 font-mono font-bold text-slate-300 text-center">L</span>
        <div className="flex-1">{renderChannelBar(levels.leftLevel, levels.leftPeak)}</div>
        <span className="w-12 text-right font-mono text-[11px] text-cyan-400 tabular-nums">
          {levels.leftDb > -60 ? `${levels.leftDb} dB` : '-INF'}
        </span>
      </div>

      {/* Right Channel */}
      <div className="flex items-center gap-2">
        <span className="w-4 font-mono font-bold text-slate-300 text-center">R</span>
        <div className="flex-1">{renderChannelBar(levels.rightLevel, levels.rightPeak)}</div>
        <span className="w-12 text-right font-mono text-[11px] text-cyan-400 tabular-nums">
          {levels.rightDb > -60 ? `${levels.rightDb} dB` : '-INF'}
        </span>
      </div>
    </div>
  );
};
