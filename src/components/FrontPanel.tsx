import React from 'react';
import { KnobControl } from './KnobControl';
import { VUMeter } from './VUMeter';
import { AmplifierState, InputSource } from '../types/amplifier';
import { 
  Power, 
  Volume2, 
  VolumeX, 
  Radio, 
  Bluetooth, 
  Disc, 
  Mic, 
  Sliders, 
  RotateCw,
  Sparkles,
  Zap,
  ArrowRightLeft
} from 'lucide-react';

interface FrontPanelProps {
  state: AmplifierState;
  onUpdateState: (updates: Partial<AmplifierState>) => void;
  onFlipToRear: () => void;
  onOpenACEffects: () => void;
  onOpenUSBAudio: () => void;
}

export const FrontPanel: React.FC<FrontPanelProps> = ({
  state,
  onUpdateState,
  onFlipToRear,
  onOpenACEffects,
  onOpenUSBAudio,
}) => {
  const sources: { id: InputSource; label: string; icon: React.ReactNode; displayCode: string }[] = [
    { id: 'BLUETOOTH', label: 'Bluetooth', icon: <Bluetooth className="w-3.5 h-3.5" />, displayCode: 'bt' },
    { id: 'AUX', label: 'AUX / RCA', icon: <Radio className="w-3.5 h-3.5" />, displayCode: 'AUX' },
    { id: 'USB', label: 'USB Audio', icon: <Disc className="w-3.5 h-3.5" />, displayCode: 'USB' },
    { id: 'SD', label: 'SD Card', icon: <Disc className="w-3.5 h-3.5" />, displayCode: 'Sd' },
    { id: 'FM', label: 'FM Tuner', icon: <Radio className="w-3.5 h-3.5" />, displayCode: `${state.fmFrequency.toFixed(1)}` },
  ];

  const currentDisplaySource = sources.find(s => s.id === state.inputSource)?.displayCode || 'AUX';

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 bg-[#121620]">
      {/* Top chassis ventilation and screws header */}
      <div className="bg-[#181d28] border-b border-slate-800 px-6 py-2 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-600 shadow-inner" title="Hex Machine Screw" />
          <span className="font-mono text-[11px] tracking-widest text-slate-300 font-bold uppercase">
            AK-45 PRO STEREO AUDIO AMPLIFIER
          </span>
          <span className="text-[10px] text-slate-400">2.0 CH / 400W PEAK / BLUETOOTH 5.0</span>
        </div>

        {/* Chassis Ventilation Grill Slits */}
        <div className="flex gap-1.5 opacity-60">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-1.5 h-3 bg-black/60 rounded-xs border-r border-slate-800" />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onFlipToRear}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded transition-colors border border-slate-700"
            title="Inspect rear panel speaker spring clips and RCA inputs"
          >
            <ArrowRightLeft className="w-3 h-3 text-cyan-400" />
            <span>Rear Panel & Wiring</span>
          </button>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-600 shadow-inner" />
        </div>
      </div>

      {/* Main Front Faceplate (Brushed Metal) */}
      <div className="brushed-metal p-6 md:p-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Section: Power, Mic Inputs & Echo Controls */}
          <div className="lg:col-span-3 flex flex-col justify-between h-full space-y-5 border-r border-slate-800/80 pr-4">
            
            {/* Power Toggle Switch */}
            <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateState({ power: !state.power })}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    state.power
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.8)]'
                      : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                  aria-label="Toggle Power"
                >
                  <Power className="w-5 h-5" />
                </button>
                <div>
                  <div className="text-[11px] font-bold tracking-wider uppercase text-slate-200">
                    POWER
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {state.power ? 'ACTIVE ON' : 'STANDBY'}
                  </div>
                </div>
              </div>

              {/* Status LED */}
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-3 h-3 rounded-full transition-all ${
                    state.power
                      ? 'bg-cyan-400 shadow-[0_0_8px_#38bdf8]'
                      : 'bg-red-900/50'
                  }`}
                />
                <span className="text-[8px] font-mono text-slate-400">LED</span>
              </div>
            </div>

            {/* Karaoke Dual Mic Inputs & Echo (AC Effects) */}
            <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <Mic className="w-3.5 h-3.5 text-cyan-400" />
                  <span>MIC & AC EFFECTS</span>
                </div>
                <button
                  onClick={onOpenACEffects}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 underline underline-offset-2 flex items-center gap-1 font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  DSP Panel
                </button>
              </div>

              {/* 6.35mm Jack visual sockets */}
              <div className="flex items-center justify-around py-1">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-slate-950 border-2 border-slate-700 flex items-center justify-center shadow-inner">
                    <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-600" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 mt-1">MIC 1</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-slate-950 border-2 border-slate-700 flex items-center justify-center shadow-inner">
                    <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-600" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 mt-1">MIC 2</span>
                </div>
              </div>

              {/* Knobs for Mic Vol & Echo */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
                <KnobControl
                  label="MIC VOL"
                  value={state.mic1Volume}
                  min={0}
                  max={100}
                  step={1}
                  unit="%"
                  defaultValue={50}
                  size="sm"
                  onChange={(v) => onUpdateState({ mic1Volume: v })}
                />
                <KnobControl
                  label="ECHO"
                  value={state.echo}
                  min={0}
                  max={100}
                  step={1}
                  unit="%"
                  defaultValue={20}
                  size="sm"
                  onChange={(v) => onUpdateState({ echo: v })}
                  sublabel="AC Delay"
                />
              </div>
            </div>

            {/* Quick Presets / Loudness */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateState({ loudness: !state.loudness })}
                className={`flex-1 py-1.5 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border ${
                  state.loudness
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
                title="Loudness dynamic contour for low volume bass boost"
              >
                <Zap className="w-3 h-3" />
                <span>LOUDNESS</span>
              </button>

              <button
                onClick={() => onUpdateState({ mute: !state.mute })}
                className={`flex-1 py-1.5 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border ${
                  state.mute
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {state.mute ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                <span>{state.mute ? 'MUTED' : 'MUTE'}</span>
              </button>
            </div>
          </div>

          {/* Center Section: Authentic Blue LED Digital Display + Source Selector */}
          <div className="lg:col-span-5 flex flex-col items-center justify-between space-y-5 px-2">
            
            {/* The Authentic AK-45 Blue LED Segmented Display (Exact look from Photo 1!) */}
            <div className="w-full bg-[#03060c] border-2 border-slate-800 rounded-xl p-4 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[160px]">
              {/* Subtle glass reflection overlay */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

              {/* Display Header Indicators */}
              <div className="flex items-center justify-between border-b border-cyan-950/60 pb-2 text-[10px] font-digital tracking-widest text-cyan-400/80">
                <span className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${state.power ? 'bg-cyan-400' : 'bg-slate-700'}`} />
                  {state.connectedDevice ? 'CONNECTED [BT-888]' : 'REMOTE READY'}
                </span>
                <span>STEREO HI-FI 24-BIT</span>
                <span className={state.loudness ? 'text-amber-300' : 'text-cyan-900'}>LOUD</span>
              </div>

              {/* Main Glowing LED Segment Centerpiece */}
              <div className="my-auto py-2 flex items-center justify-around">
                {state.power ? (
                  <>
                    {/* Source display: "AUX", "bt", "FM 101.5", etc. */}
                    <div className="text-center">
                      <div className="text-4xl md:text-5xl font-digital font-bold text-cyan-300 glow-blue tracking-wider">
                        {currentDisplaySource}
                      </div>
                      <div className="text-[10px] font-digital text-cyan-500/70 tracking-widest uppercase mt-1">
                        INPUT SOURCE
                      </div>
                    </div>

                    {/* Volume or Frequency */}
                    <div className="text-center border-l border-cyan-950/60 pl-6">
                      <div className="text-3xl md:text-4xl font-digital font-bold text-cyan-400 glow-blue tabular-nums">
                        {state.mute ? 'MUTE' : `VOL ${state.masterVolume}`}
                      </div>
                      <div className="text-[10px] font-digital text-cyan-500/70 tracking-widest uppercase mt-1">
                        LEVEL 0-100
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-slate-800 text-3xl font-digital tracking-widest">
                    --- OFF ---
                  </div>
                )}
              </div>

              {/* Sub-display: EQ preset and connection */}
              <div className="flex items-center justify-between text-[10px] font-digital text-cyan-400/80 border-t border-cyan-950/60 pt-2">
                <span>DSP EQ: {state.eqMode}</span>
                <span>BASS: {state.bass > 0 ? `+${state.bass}` : state.bass}dB</span>
                <span>TREBLE: {state.treble > 0 ? `+${state.treble}` : state.treble}dB</span>
              </div>
            </div>

            {/* Source Selector Push-Buttons */}
            <div className="w-full bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">
                Audio Input Source Selector
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {sources.map(src => {
                  const isActive = state.inputSource === src.id;
                  return (
                    <button
                      key={src.id}
                      onClick={() => onUpdateState({ inputSource: src.id })}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[10px] font-medium transition-all ${
                        isActive
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <div className="mb-1">{src.icon}</div>
                      <span className="truncate w-full text-center">{src.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stereo VU Meter Bar */}
            <div className="w-full">
              <VUMeter isMuted={state.mute} power={state.power} />
            </div>
          </div>

          {/* Right Section: Large Glowing Master Volume & Tone Controls */}
          <div className="lg:col-span-4 flex flex-col justify-between items-center space-y-4 border-l border-slate-800/80 pl-4">
            
            {/* The Signature AK-45 Large Volume Knob with Blue Neon Halo! */}
            <div className="flex flex-col items-center">
              <KnobControl
                label="MASTER VOLUME"
                value={state.masterVolume}
                min={0}
                max={100}
                step={1}
                unit="%"
                defaultValue={70}
                size="xl"
                haloGlow={state.power && !state.mute}
                onChange={(v) => onUpdateState({ masterVolume: v })}
                sublabel="Rotate to Adjust"
              />

              {/* Volume quick presets */}
              <div className="flex items-center gap-1.5 mt-2">
                {[25, 50, 75, 100].map(pct => (
                  <button
                    key={pct}
                    onClick={() => onUpdateState({ masterVolume: pct })}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                      state.masterVolume === pct
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Control Knobs (Bass, Treble, Balance) */}
            <div className="w-full bg-slate-900/50 p-3 rounded-xl border border-slate-800 grid grid-cols-3 gap-2">
              <KnobControl
                label="BASS"
                value={state.bass}
                min={-12}
                max={12}
                step={1}
                unit="dB"
                defaultValue={0}
                size="sm"
                onChange={(v) => onUpdateState({ bass: v })}
                sublabel="100 Hz"
              />
              <KnobControl
                label="TREBLE"
                value={state.treble}
                min={-12}
                max={12}
                step={1}
                unit="dB"
                defaultValue={0}
                size="sm"
                onChange={(v) => onUpdateState({ treble: v })}
                sublabel="10 kHz"
              />
              <KnobControl
                label="BALANCE"
                value={state.balance}
                min={-10}
                max={10}
                step={1}
                defaultValue={0}
                size="sm"
                onChange={(v) => onUpdateState({ balance: v })}
                sublabel="L / R"
              />
            </div>

            {/* USB Media Port & SD Reader (Hardware sockets) */}
            <div className="w-full flex items-center justify-between bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-slate-400">
              <button
                onClick={onOpenUSBAudio}
                className="flex items-center gap-2 hover:text-cyan-400 transition-colors group cursor-pointer"
                title="Configure USB-A Output Audio Encoding & Bitstream"
              >
                <div className="w-6 h-3.5 bg-black border border-slate-700 group-hover:border-cyan-400 rounded-xs shadow-inner flex items-center justify-center transition-colors">
                  <div className="w-3.5 h-1 bg-cyan-400/80 rounded-2xs shadow-[0_0_4px_#38bdf8]" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-200 group-hover:text-cyan-400">
                  USB-A ENCODER
                </span>
              </button>

              <div className="flex items-center gap-2">
                <div className="w-5 h-2 bg-black border border-slate-700 rounded-xs shadow-inner" />
                <span className="text-[10px] font-mono">SD / TF</span>
              </div>

              <button
                onClick={onOpenUSBAudio}
                className="text-[9px] font-mono text-cyan-400 font-semibold bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40 hover:bg-cyan-900/60 transition-colors"
              >
                24-BIT / 96k
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
