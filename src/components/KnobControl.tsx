import React, { useRef, useState, useCallback, useEffect } from 'react';

interface KnobControlProps {
  label: string;
  value: number; // current value
  min: number;
  max: number;
  step?: number;
  unit?: string;
  defaultValue?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  haloGlow?: boolean; // intense blue halo for AK-45 volume knob
  showTicks?: boolean;
  color?: 'cyan' | 'blue' | 'amber' | 'emerald';
  onChange: (value: number) => void;
  sublabel?: string;
}

export const KnobControl: React.FC<KnobControlProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  defaultValue,
  size = 'md',
  haloGlow = false,
  showTicks = true,
  color = 'cyan',
  onChange,
  sublabel,
}) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const dragStartVal = useRef(0);

  // Map value to angle (-135 deg to +135 deg)
  const range = max - min;
  const normalized = Math.max(0, Math.min(1, (value - min) / range));
  const angle = -135 + normalized * 270;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartVal.current = value;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaY = dragStartY.current - e.clientY;
    const sensitivity = (max - min) / 200; // 200px drag for full scale
    const rawVal = dragStartVal.current + deltaY * sensitivity;
    const steppedVal = Math.round(rawVal / step) * step;
    const clampedVal = Math.max(min, Math.min(max, steppedVal));
    if (clampedVal !== value) {
      onChange(clampedVal);
    }
  }, [isDragging, max, min, step, value, onChange]);

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const handleDoubleClick = () => {
    if (defaultValue !== undefined) {
      onChange(defaultValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault();
      onChange(Math.min(max, value + step));
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault();
      onChange(Math.max(min, value - step));
    } else if (e.key === 'Home') {
      e.preventDefault();
      onChange(min);
    } else if (e.key === 'End') {
      e.preventDefault();
      onChange(max);
    }
  };

  // Dimensions based on size
  const sizeMap = {
    sm: { diameter: 'w-12 h-12', knob: 'w-9 h-9', stroke: 2 },
    md: { diameter: 'w-16 h-16', knob: 'w-12 h-12', stroke: 3 },
    lg: { diameter: 'w-24 h-24', knob: 'w-18 h-18', stroke: 4 },
    xl: { diameter: 'w-32 h-32', knob: 'w-24 h-24', stroke: 5 }, // AK-45 Master Volume
  };

  const currentSize = sizeMap[size];

  // Tick marks around perimeter
  const tickCount = 11;
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const tickAngle = -135 + (i / (tickCount - 1)) * 270;
    const isPastCurrent = tickAngle <= angle;
    return { angle: tickAngle, active: isPastCurrent };
  });

  return (
    <div className="flex flex-col items-center select-none group">
      <span className="text-[11px] font-semibold tracking-wider text-slate-300 uppercase mb-1">
        {label}
      </span>

      <div
        ref={knobRef}
        role="slider"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        onKeyDown={handleKeyDown}
        className={`relative flex items-center justify-center cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-full ${currentSize.diameter}`}
      >
        {/* Glowing Halo (AK-45 volume dial ring backlight as seen in user's photo!) */}
        {haloGlow && (
          <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md pointer-events-none animate-pulse" />
        )}

        {/* Ticks ring */}
        {showTicks && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none rotate-90" viewBox="0 0 100 100">
            {ticks.map((tick, i) => {
              // polar coordinates
              const rad = ((tick.angle - 90) * Math.PI) / 180;
              const r1 = 44;
              const r2 = 49;
              const x1 = 50 + r1 * Math.cos(rad);
              const y1 = 50 + r1 * Math.sin(rad);
              const x2 = 50 + r2 * Math.cos(rad);
              const y2 = 50 + r2 * Math.sin(rad);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={tick.active ? (haloGlow ? '#38bdf8' : '#94a3b8') : '#334155'}
                  strokeWidth={i === 0 || i === Math.floor(tickCount / 2) || i === tickCount - 1 ? 2.5 : 1.5}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        )}

        {/* Outer Bezel */}
        <div
          className={`relative rounded-full flex items-center justify-center transition-all duration-75 ${currentSize.knob} ${
            haloGlow ? 'glow-knob-halo border-2 border-cyan-400/80 bg-slate-900' : 'border border-slate-700/80'
          }`}
          style={{
            background: 'radial-gradient(circle at 35% 35%, #333f52 0%, #1e2634 50%, #0d121c 100%)',
            boxShadow: haloGlow
              ? '0 0 20px rgba(56, 189, 248, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.25), inset 0 -3px 6px rgba(0, 0, 0, 0.8)'
              : '0 3px 6px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.8)',
          }}
        >
          {/* Rotating Indicator */}
          <div
            className="w-full h-full absolute inset-0 rounded-full pointer-events-none"
            style={{ transform: `rotate(${angle}deg)` }}
          >
            {/* Notch / pointer line */}
            <div
              className={`absolute top-1 left-1/2 -translate-x-1/2 rounded-full ${
                haloGlow ? 'w-1 h-3 bg-cyan-300 shadow-[0_0_8px_#38bdf8]' : 'w-0.5 h-2.5 bg-slate-200'
              }`}
            />
          </div>

          {/* Center cap with metallic brushed radial rings */}
          <div className="w-1/2 h-1/2 rounded-full bg-gradient-to-tr from-slate-950 via-slate-800 to-slate-900 border border-slate-700/40 pointer-events-none shadow-inner" />
        </div>
      </div>

      {/* Numeric readout */}
      <div className="mt-1 flex items-baseline gap-0.5 font-mono text-[11px] text-cyan-400 font-medium">
        <span>{value > 0 && unit.includes('dB') ? `+${value}` : value}</span>
        {unit && <span className="text-[10px] text-slate-400">{unit}</span>}
      </div>

      {sublabel && (
        <span className="text-[9px] text-slate-400 tracking-tight mt-0.5">
          {sublabel}
        </span>
      )}
    </div>
  );
};
