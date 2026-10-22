import React, { useRef, useEffect } from 'react';
import { EQBand, EQMode } from '../types/amplifier';
import { Sliders, RotateCcw, Bookmark, Sparkles, Check } from 'lucide-react';

interface EqualizerViewProps {
  eqBands: EQBand[];
  eqMode: EQMode;
  onUpdateBand: (index: number, gain: number) => void;
  onSelectPreset: (mode: EQMode) => void;
  onResetFlat: () => void;
}

export const EqualizerView: React.FC<EqualizerViewProps> = ({
  eqBands,
  eqMode,
  onUpdateBand,
  onSelectPreset,
  onResetFlat,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const presets: { id: EQMode; label: string; desc: string }[] = [
    { id: 'FLAT', label: 'Flat Reference', desc: '0 dB neutral curve' },
    { id: 'BASS_BOOST', label: 'AK-45 Bass Punch', desc: 'Max low-end energy' },
    { id: 'ROCK', label: 'Rock & Metal', desc: 'Punchy kick, crisp lead' },
    { id: 'POP', label: 'Pop & Radio', desc: 'Smooth highs, tight bass' },
    { id: 'JAZZ', label: 'Jazz Club', desc: 'Warm mids, open air' },
    { id: 'VOCAL', label: 'Vocal / Speech', desc: 'Intelligible clarity' },
    { id: 'ELECTRONIC', label: 'Club EDM', desc: 'Sub-bass rumble & sweep' },
    { id: 'ACOUSTIC', label: 'Acoustic Guitar', desc: 'Rich natural resonance' },
  ];

  // Draw Spline Frequency Response Curve on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Background grid lines (-12dB, -6dB, 0dB, +6dB, +12dB)
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 1;
    [-12, -6, 0, 6, 12].forEach(db => {
      const y = height / 2 - (db / 12) * (height / 2 - 16);
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(width - 15, y);
      ctx.stroke();

      ctx.fillStyle = db === 0 ? '#38bdf8' : '#64748b';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`${db > 0 ? '+' : ''}${db}dB`, 4, y + 3);
    });

    // Compute curve points
    const points = eqBands.map((band, idx) => {
      const x = 40 + (idx / (eqBands.length - 1)) * (width - 60);
      const y = height / 2 - (band.gain / 12) * (height / 2 - 16);
      return { x, y };
    });

    // Draw Smooth Gradient Fill under curve
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
    gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.1)');
    gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, height / 2);
    ctx.lineTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      ctx.bezierCurveTo(cx, p0.y, cx, p1.y, p1.x, p1.y);
    }

    ctx.lineTo(points[points.length - 1].x, height / 2);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw glowing stroke line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      ctx.bezierCurveTo(cx, p0.y, cx, p1.y, p1.x, p1.y);
    }
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw point circles
    points.forEach((p, idx) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#0891b2';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [eqBands]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">
              10-Band Graphic Equalizer & DSP Studio
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time biquad peak & shelf audio sculpting with spline frequency curve modeling
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetFlat}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Flat (0 dB)</span>
          </button>
        </div>
      </div>

      {/* Frequency Response Spline Curve Canvas */}
      <div className="bg-[#0b0e17] border border-slate-800 rounded-xl p-4 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2 px-2 text-xs font-mono text-slate-400">
          <span className="text-slate-300 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
            LIVE FREQUENCY RESPONSE CURVE (20 Hz – 20 kHz)
          </span>
          <span className="text-cyan-400 font-semibold">PRESET: {eqMode}</span>
        </div>

        <canvas
          ref={canvasRef}
          width={880}
          height={160}
          className="w-full h-40 rounded-lg block"
        />
      </div>

      {/* Preset Selector Chips */}
      <div className="bg-[#121620] border border-slate-800 rounded-xl p-4">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Acoustic & Genre Target Presets
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {presets.map(preset => {
            const isSelected = eqMode === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset.id)}
                className={`py-2 px-2 rounded-lg text-left transition-all border ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="text-xs font-bold truncate flex items-center justify-between">
                  <span>{preset.label.split(' ')[0]}</span>
                  {isSelected && <Check className="w-3 h-3 text-cyan-400" />}
                </div>
                <div className="text-[9px] text-slate-400 truncate mt-0.5">
                  {preset.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 10 Vertical Sliders Rack */}
      <div className="bg-[#121620] border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="text-xs font-semibold text-slate-300 mb-6 flex items-center justify-between">
          <span>GRAPHIC BAND GAIN GAUGES (-12 dB to +12 dB)</span>
          <span className="font-mono text-[11px] text-slate-400">DOUBLE-CLICK SLIDER TO CENTER (0dB)</span>
        </div>

        <div className="grid grid-cols-10 gap-2 sm:gap-4 items-end justify-items-center">
          {eqBands.map((band, idx) => {
            return (
              <div key={band.frequency} className="flex flex-col items-center group w-full">
                {/* dB Readout */}
                <span className="font-mono text-[11px] text-cyan-400 font-bold tabular-nums mb-2">
                  {band.gain > 0 ? `+${band.gain}` : band.gain}
                </span>

                {/* Vertical Slider Track Container */}
                <div className="relative h-48 w-8 flex items-center justify-center bg-slate-950/80 rounded-lg border border-slate-800 py-3 shadow-inner">
                  {/* Center 0dB Reference Guideline */}
                  <div className="absolute top-1/2 left-1 right-1 h-0.5 bg-slate-700 pointer-events-none" />

                  {/* Vertical HTML Input Range */}
                  <input
                    type="range"
                    min={-12}
                    max={12}
                    step={1}
                    value={band.gain}
                    onChange={(e) => onUpdateBand(idx, Number(e.target.value))}
                    onDoubleClick={() => onUpdateBand(idx, 0)}
                    aria-label={`${band.label} frequency gain`}
                    className="h-40 w-4 appearance-none bg-transparent cursor-pointer [writing-mode:vertical-lr] [direction:rtl] accent-cyan-400 focus:outline-none"
                  />
                </div>

                {/* Frequency Label */}
                <span className="font-mono text-xs font-bold text-slate-300 mt-3">
                  {band.label}
                </span>
                <span className="text-[9px] text-slate-500 uppercase mt-0.5">
                  {idx < 3 ? 'BASS' : idx < 7 ? 'MID' : 'TREBLE'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
