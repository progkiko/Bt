import React from 'react';
import { AudioEffectsState } from '../types/amplifier';
import { KnobControl } from './KnobControl';
import { 
  Sparkles, 
  Volume2, 
  Activity, 
  Waves, 
  Mic2, 
  ShieldAlert, 
  Radio, 
  RotateCcw,
  Zap
} from 'lucide-react';

interface ACEffectsViewProps {
  effects: AudioEffectsState;
  onUpdateEffects: (updates: Partial<AudioEffectsState>) => void;
  echoKnobValue: number;
  onEchoKnobChange: (val: number) => void;
}

export const ACEffectsView: React.FC<ACEffectsViewProps> = ({
  effects,
  onUpdateEffects,
  echoKnobValue,
  onEchoKnobChange,
}) => {
  const roomPresets: { id: AudioEffectsState['reverbRoomType']; label: string; desc: string }[] = [
    { id: 'ROOM', label: 'Studio Room', desc: 'Tight, controlled acoustic reflections' },
    { id: 'HALL', label: 'Concert Hall', desc: 'Lush, expansive reverberation' },
    { id: 'STAGE', label: 'Karaoke Stage', desc: 'High vocal presence and stereo slap' },
    { id: 'CHAMBER', label: 'Acoustic Chamber', desc: 'Warm natural decay for acoustic music' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">
              AC & Acoustic Audio Effects Controller
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time DSP acoustic effects, AC mains hum suppression, analog tube saturation, and karaoke vocal echo
          </p>
        </div>

        <button
          onClick={() => {
            onUpdateEffects({
              echo: 20,
              echoDelayMs: 220,
              echoFeedback: 35,
              reverbDepth: 25,
              reverbRoomType: 'ROOM',
              acHumFilter: true,
              acHumFrequency: 60,
              tubeWarmth: 30,
              stereoWidth: 100,
              vocalEnhance: true,
              antiFeedback: true,
            });
            onEchoKnobChange(20);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Effects to Default</span>
        </button>
      </div>

      {/* Main Grid: 3 Key Effect Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* 1. AC Mains 50Hz/60Hz Hum Suppressor (Crucial for AC Powered Amplifiers!) */}
        <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">AC Hum Suppressor</h3>
                  <span className="text-[10px] text-slate-400">Mains Ground Loop Filter</span>
                </div>
              </div>

              {/* Toggle switch */}
              <button
                onClick={() => onUpdateEffects({ acHumFilter: !effects.acHumFilter })}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                  effects.acHumFilter ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
                aria-label="Toggle AC Hum Filter"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    effects.acHumFilter ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Eliminates the standard 50Hz (EU/Asia) or 60Hz (US/Americas) electromagnetic AC transformer hum and ground loop buzz with a surgical steep-slope notch filter.
            </p>

            <div className="space-y-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
              <div className="text-[11px] font-semibold text-slate-300">Target Mains Frequency</div>
              <div className="grid grid-cols-2 gap-2">
                {[60, 50].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => onUpdateEffects({ acHumFrequency: freq as 50 | 60 })}
                    className={`py-1.5 px-3 rounded text-xs font-mono font-semibold transition-colors ${
                      effects.acHumFrequency === freq
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {freq} Hz {freq === 60 ? '(US/Americas)' : '(EU/Asia)'}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span>ATTENUATION:</span>
                <span className="text-emerald-400 font-bold">-24.5 dB Notch</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
            <span className={`w-2 h-2 rounded-full ${effects.acHumFilter ? 'bg-emerald-400' : 'bg-slate-600'}`} />
            <span>{effects.acHumFilter ? 'Active: AC noise eliminated' : 'Bypassed: Raw audio feed'}</span>
          </div>
        </div>

        {/* 2. Acoustic Echo & Karaoke Chamber (AK-45 Front Panel Echo) */}
        <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Waves className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Acoustic Echo & Delay</h3>
                  <span className="text-[10px] text-slate-400">Mic & Karaoke Chamber</span>
                </div>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-bold">{echoKnobValue}%</span>
            </div>

            <div className="flex justify-center mb-4">
              <KnobControl
                label="ECHO MIX"
                value={echoKnobValue}
                min={0}
                max={100}
                step={1}
                unit="%"
                defaultValue={20}
                size="lg"
                haloGlow={echoKnobValue > 0}
                onChange={(v) => {
                  onEchoKnobChange(v);
                  onUpdateEffects({ echo: v });
                }}
                sublabel="Wet / Dry Ratio"
              />
            </div>

            <div className="space-y-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
              {/* Delay Time Slider */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Echo Delay Time</span>
                  <span className="font-mono text-cyan-400">{effects.echoDelayMs} ms</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={500}
                  step={10}
                  value={effects.echoDelayMs}
                  onChange={(e) => onUpdateEffects({ echoDelayMs: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Feedback Slider */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Echo Feedback Decay</span>
                  <span className="font-mono text-cyan-400">{effects.echoFeedback}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={85}
                  step={5}
                  value={effects.echoFeedback}
                  onChange={(e) => onUpdateEffects({ echoFeedback: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>QUICK PRESETS:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => onUpdateEffects({ echoDelayMs: 120, echoFeedback: 25 })}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px]"
              >
                Slapback
              </button>
              <button
                onClick={() => onUpdateEffects({ echoDelayMs: 260, echoFeedback: 45 })}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px]"
              >
                Karaoke
              </button>
              <button
                onClick={() => onUpdateEffects({ echoDelayMs: 420, echoFeedback: 70 })}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px]"
              >
                Dub Echo
              </button>
            </div>
          </div>
        </div>

        {/* 3. Vacuum Tube Warmth & Analog Saturation */}
        <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Analog Tube Warmth</h3>
                  <span className="text-[10px] text-slate-400">Even Harmonic Saturation</span>
                </div>
              </div>
              <span className="text-xs font-mono text-orange-400 font-bold">{effects.tubeWarmth}%</span>
            </div>

            <div className="flex justify-center mb-4">
              <KnobControl
                label="TUBE DRIVE"
                value={effects.tubeWarmth}
                min={0}
                max={100}
                step={5}
                unit="%"
                defaultValue={30}
                size="lg"
                color="amber"
                onChange={(v) => onUpdateEffects({ tubeWarmth: v })}
                sublabel="2nd Harmonic Exciter"
              />
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Emulates vintage Class-A vacuum tube triode response, adding smooth, musical harmonic overtones to make compressed Bluetooth audio sound organic and full.
            </p>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">HARMONIC PROFILE:</span>
              <span className="text-amber-400 font-bold">Triode 12AX7 Warmth</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>CHARACTER:</span>
            <span className="text-slate-300">Warm Vintage Hi-Fi</span>
          </div>
        </div>

        {/* 4. Room Acoustic Reverb Architecture */}
        <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Reverb Environment</h3>
                  <span className="text-[10px] text-slate-400">Acoustic Space Simulation</span>
                </div>
              </div>
              <span className="text-xs font-mono text-purple-400 font-bold">{effects.reverbDepth}%</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {roomPresets.map((room) => (
                <button
                  key={room.id}
                  onClick={() => onUpdateEffects({ reverbRoomType: room.id })}
                  className={`p-2.5 rounded-lg text-left transition-all border ${
                    effects.reverbRoomType === room.id
                      ? 'bg-purple-950/60 border-purple-500 text-white shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-semibold">{room.label}</div>
                  <div className="text-[10px] text-slate-400 truncate">{room.desc}</div>
                </button>
              ))}
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-2">
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Reverb Space Wet Mix</span>
                <span className="font-mono text-purple-400">{effects.reverbDepth}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={effects.reverbDepth}
                onChange={(e) => onUpdateEffects({ reverbDepth: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>DIFFUSION:</span>
            <span className="text-purple-300 font-mono">Stereo Cross-Feed</span>
          </div>
        </div>

        {/* 5. 3D Stereo Spatializer & Field Width */}
        <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">3D Stereo Field Width</h3>
                  <span className="text-[10px] text-slate-400">Acoustic Stage Imaging</span>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">{effects.stereoWidth}%</span>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Expands or concentrates the soundstage between your left and right passive speakers. Set to 0% for mono summing, 100% for standard stereo, or up to 200% for wide spatial depth.
            </p>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-2">
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Soundstage Width</span>
                <span className="font-mono text-emerald-400">{effects.stereoWidth}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={200}
                step={10}
                value={effects.stereoWidth}
                onChange={(e) => onUpdateEffects({ stereoWidth: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />

              <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-1">
                <span>0% (MONO)</span>
                <span>100% (NATURAL)</span>
                <span>200% (3D WIDE)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>PHASE ALIGNMENT:</span>
            <span className="text-emerald-400 font-semibold font-mono">100% In-Phase</span>
          </div>
        </div>

        {/* 6. Vocal Clarity & Anti-Feedback Microphone Notch */}
        <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <Mic2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Karaoke Vocal Clarity</h3>
                  <span className="text-[10px] text-slate-400">Mic DSP Enhancement</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {/* Vocal Enhance Toggle */}
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">Vocal Presence Boost</span>
                  <span className="text-[10px] text-slate-400">Enhance 3kHz clarity for singers</span>
                </div>
                <button
                  onClick={() => onUpdateEffects({ vocalEnhance: !effects.vocalEnhance })}
                  className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                    effects.vocalEnhance ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      effects.vocalEnhance ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Anti-Feedback Notch */}
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">Anti-Feedback Squelch</span>
                  <span className="text-[10px] text-slate-400">Prevents microphone squeal</span>
                </div>
                <button
                  onClick={() => onUpdateEffects({ antiFeedback: !effects.antiFeedback })}
                  className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                    effects.antiFeedback ? 'bg-rose-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      effects.antiFeedback ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Dual 6.35mm Mic inputs active</span>
          </div>
        </div>

      </div>
    </div>
  );
};
