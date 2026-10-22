import React, { useState, useEffect } from 'react';
import { rfRemoteService } from '../services/rfRemoteService';
import { RFTransmissionEvent } from '../types/remote';
import { AmplifierState, InputSource, EQMode } from '../types/amplifier';
import { audioEngine } from '../services/audioEngine';
import { 
  Power, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Zap, 
  Radio, 
  Sliders, 
  X, 
  Sparkles,
  Wifi,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  EyeOff,
  Minimize2
} from 'lucide-react';

interface RFRemoteHandsetProps {
  isOpen: boolean;
  onClose: () => void;
  ampState: AmplifierState;
  onUpdateAmpState: (updates: Partial<AmplifierState>) => void;
  onSelectEQPreset: (mode: EQMode) => void;
}

export const RFRemoteHandset: React.FC<RFRemoteHandsetProps> = ({
  isOpen,
  onClose,
  ampState,
  onUpdateAmpState,
  onSelectEQPreset,
}) => {
  const [lastTx, setLastTx] = useState<RFTransmissionEvent | null>(null);
  const [carrierFreq, setCarrierFreq] = useState<'433.92 MHz' | '315.00 MHz' | '38.0 kHz IR'>('433.92 MHz');
  const [numericBuffer, setNumericBuffer] = useState<string>('');

  useEffect(() => {
    return rfRemoteService.subscribe((tx) => {
      setLastTx(tx);
    });
  }, []);

  if (!isOpen) return null;

  // Remote Action Handlers
  const handlePower = () => {
    rfRemoteService.transmit('POWER', carrierFreq);
    onUpdateAmpState({ power: !ampState.power });
  };

  const handleMute = () => {
    rfRemoteService.transmit('MUTE', carrierFreq);
    onUpdateAmpState({ mute: !ampState.mute });
  };

  const handleModeCycle = () => {
    rfRemoteService.transmit('MODE', carrierFreq);
    const sources: InputSource[] = ['BLUETOOTH', 'AUX', 'USB', 'SD', 'FM'];
    const curIdx = sources.indexOf(ampState.inputSource);
    const nextSrc = sources[(curIdx + 1) % sources.length];
    onUpdateAmpState({ inputSource: nextSrc });
  };

  const handlePlayPause = () => {
    rfRemoteService.transmit('PLAY_PAUSE', carrierFreq);
    if (audioEngine.getIsPlaying()) {
      audioEngine.stopPlayback();
    } else {
      audioEngine.startDemoPlayback('groove');
    }
  };

  const handlePrev = () => {
    rfRemoteService.transmit('PREV', carrierFreq);
    audioEngine.startDemoPlayback('acoustic');
  };

  const handleNext = () => {
    rfRemoteService.transmit('NEXT', carrierFreq);
    audioEngine.startDemoPlayback('bass');
  };

  const handleVolUp = () => {
    rfRemoteService.transmit('VOL_UP', carrierFreq);
    onUpdateAmpState({ masterVolume: Math.min(100, ampState.masterVolume + 3), mute: false });
  };

  const handleVolDown = () => {
    rfRemoteService.transmit('VOL_DOWN', carrierFreq);
    onUpdateAmpState({ masterVolume: Math.max(0, ampState.masterVolume - 3) });
  };

  const handleEQCycle = () => {
    rfRemoteService.transmit('EQ', carrierFreq);
    const modes: EQMode[] = ['FLAT', 'BASS_BOOST', 'ROCK', 'POP', 'JAZZ', 'ELECTRONIC', 'ACOUSTIC'];
    const curIdx = modes.indexOf(ampState.eqMode);
    const nextMode = modes[(curIdx + 1) % modes.length];
    onSelectEQPreset(nextMode);
  };

  const handleLoudness = () => {
    rfRemoteService.transmit('LOUD', carrierFreq);
    onUpdateAmpState({ loudness: !ampState.loudness });
  };

  const handleBassUp = () => {
    rfRemoteService.transmit('BASS_UP', carrierFreq);
    onUpdateAmpState({ bass: Math.min(12, ampState.bass + 1) });
  };

  const handleBassDown = () => {
    rfRemoteService.transmit('BASS_DOWN', carrierFreq);
    onUpdateAmpState({ bass: Math.max(-12, ampState.bass - 1) });
  };

  const handleEchoUp = () => {
    rfRemoteService.transmit('ECHO_UP', carrierFreq);
    onUpdateAmpState({ echo: Math.min(100, ampState.echo + 5) });
  };

  const handleEchoDown = () => {
    rfRemoteService.transmit('ECHO_DOWN', carrierFreq);
    onUpdateAmpState({ echo: Math.max(0, ampState.echo - 5) });
  };

  const handleNumber = (digit: number) => {
    rfRemoteService.transmit(`NUM_${digit}`, carrierFreq);
    const nextBuf = (numericBuffer + digit).slice(-4);
    setNumericBuffer(nextBuf);

    // If 4 digits entered, treat as FM frequency (e.g. 1015 -> 101.5 MHz)
    if (nextBuf.length === 4) {
      const freq = parseInt(nextBuf, 10) / 10;
      if (freq >= 87.5 && freq <= 108.0) {
        onUpdateAmpState({ inputSource: 'FM', fmFrequency: freq });
      }
    }
  };

  return (
    <div className="fixed bottom-20 right-4 sm:right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
      
      {/* Remote Handset Body */}
      <div className="relative w-64 bg-gradient-to-b from-[#1c212c] via-[#141822] to-[#0d1017] rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.85)] border-2 border-slate-700/80 text-slate-100 flex flex-col items-center">
        
        {/* Top IR / RF Emitter Dome */}
        <div className="relative -mt-6 mb-2 flex items-center justify-center">
          <div className="w-8 h-3.5 bg-rose-950/80 rounded-t-full border-t border-rose-600/50 flex items-center justify-center shadow-lg">
            <div
              className={`w-2 h-2 rounded-full transition-all duration-75 ${
                lastTx
                  ? 'bg-rose-500 shadow-[0_0_12px_#f43f5e] scale-125'
                  : 'bg-rose-900/60'
              }`}
            />
          </div>
        </div>

        {/* Handset Header */}
        <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-slate-300 font-bold uppercase">
              AK-45 WIRELESS REMOTE
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400">
              <span className={`w-1.5 h-1.5 rounded-full ${lastTx ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`} />
              <span>{carrierFreq}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold border border-slate-700 transition-colors shadow-sm"
            title="Hide RF Remote Handset"
          >
            <EyeOff className="w-3 h-3 text-cyan-400" />
            <span>Hide</span>
          </button>
        </div>

        {/* Live Signal Packet HUD */}
        <div className="w-full bg-[#080b12] p-2 rounded-lg border border-slate-800 text-[10px] font-mono mb-3 text-center">
          <div className="text-slate-500 text-[9px] uppercase tracking-wider">
            {lastTx ? 'TRANSMITTING NEC CODE' : 'TRANSMITTER IDLE'}
          </div>
          <div className="font-bold text-cyan-400 truncate mt-0.5">
            {lastTx ? `${lastTx.hexCode} (${lastTx.buttonName})` : 'READY (PRESS ANY KEY)'}
          </div>
          {numericBuffer && (
            <div className="text-[9px] text-amber-400 mt-0.5">
              INPUT DIAL: {numericBuffer} {numericBuffer.length === 4 ? 'MHz' : ''}
            </div>
          )}
        </div>

        {/* TOP ROW: POWER, MUTE, MODE */}
        <div className="grid grid-cols-3 gap-2.5 w-full mb-3">
          <button
            onClick={handlePower}
            className="h-10 rounded-xl bg-gradient-to-b from-rose-600 to-rose-700 text-white font-bold text-xs flex flex-col items-center justify-center shadow-md active:scale-95 transition-transform border border-rose-500"
            title="Power"
          >
            <Power className="w-4 h-4" />
          </button>

          <button
            onClick={handleMute}
            className={`h-10 rounded-xl font-bold text-xs flex flex-col items-center justify-center shadow-md active:scale-95 transition-transform border ${
              ampState.mute
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                : 'bg-slate-800 text-slate-200 border-slate-700'
            }`}
            title="Mute"
          >
            {ampState.mute ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleModeCycle}
            className="h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono font-bold text-[11px] flex flex-col items-center justify-center shadow-md active:scale-95 transition-transform border border-slate-700"
            title="Cycle Mode: BT / AUX / USB / SD / FM"
          >
            <span>MODE</span>
            <span className="text-[8px] text-slate-400">{ampState.inputSource}</span>
          </button>
        </div>

        {/* TRANSPORT: PREV, PLAY/PAUSE, NEXT */}
        <div className="grid grid-cols-3 gap-2.5 w-full mb-3">
          <button
            onClick={handlePrev}
            className="h-9 rounded-lg bg-slate-800/90 text-slate-200 hover:bg-slate-700 flex items-center justify-center border border-slate-700/80 active:scale-95"
            title="Previous Track"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handlePlayPause}
            className="h-9 rounded-lg bg-cyan-500 text-slate-950 font-bold flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.5)] active:scale-95"
            title="Play / Pause"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </button>

          <button
            onClick={handleNext}
            className="h-9 rounded-lg bg-slate-800/90 text-slate-200 hover:bg-slate-700 flex items-center justify-center border border-slate-700/80 active:scale-95"
            title="Next Track"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* VOLUME ROCKER / CIRCULAR CONTROLS */}
        <div className="w-full bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800 mb-3 flex items-center justify-around">
          {/* Vol Down */}
          <button
            onClick={handleVolDown}
            className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex flex-col items-center justify-center border border-slate-700 active:scale-90 transition-transform shadow"
          >
            <span className="text-sm font-bold">-</span>
            <span className="text-[8px] font-mono text-slate-400">VOL</span>
          </button>

          {/* Volume Indicator */}
          <div className="text-center">
            <span className="text-[9px] text-slate-400 font-mono block">LEVEL</span>
            <span className="text-base font-mono font-bold text-cyan-400 tabular-nums glow-blue">
              {ampState.masterVolume}%
            </span>
          </div>

          {/* Vol Up */}
          <button
            onClick={handleVolUp}
            className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 flex flex-col items-center justify-center border border-slate-700 active:scale-90 transition-transform shadow"
          >
            <span className="text-sm font-bold">+</span>
            <span className="text-[8px] font-mono text-slate-400">VOL</span>
          </button>
        </div>

        {/* FUNCTION ROW: EQ, LOUDNESS, REPEAT */}
        <div className="grid grid-cols-3 gap-2 w-full mb-3 text-[10px] font-semibold">
          <button
            onClick={handleEQCycle}
            className="py-1.5 px-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex flex-col items-center active:scale-95"
          >
            <Sliders className="w-3 h-3 text-cyan-400 mb-0.5" />
            <span className="truncate w-full text-center">EQ: {ampState.eqMode.slice(0, 4)}</span>
          </button>

          <button
            onClick={handleLoudness}
            className={`py-1.5 px-1 rounded-lg border flex flex-col items-center active:scale-95 ${
              ampState.loudness
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <Zap className="w-3 h-3 text-amber-400 mb-0.5" />
            <span>LOUD</span>
          </button>

          <button
            onClick={() => setNumericBuffer('')}
            className="py-1.5 px-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex flex-col items-center active:scale-95"
          >
            <RotateCcw className="w-3 h-3 text-slate-400 mb-0.5" />
            <span>CLEAR</span>
          </button>
        </div>

        {/* QUICK HARDWARE TRIMMERS: BASS & ECHO */}
        <div className="grid grid-cols-2 gap-2 w-full mb-3 text-[10px]">
          <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="font-mono text-slate-400 pl-1">BASS</span>
            <div className="flex gap-1">
              <button
                onClick={handleBassDown}
                className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold"
              >
                -
              </button>
              <button
                onClick={handleBassUp}
                className="w-5 h-5 rounded bg-slate-800 text-cyan-400 hover:text-white flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="font-mono text-slate-400 pl-1">ECHO</span>
            <div className="flex gap-1">
              <button
                onClick={handleEchoDown}
                className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold"
              >
                -
              </button>
              <button
                onClick={handleEchoUp}
                className="w-5 h-5 rounded bg-slate-800 text-cyan-400 hover:text-white flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* NUMERIC KEYPAD (0-9 for direct track / FM radio entry) */}
        <div className="grid grid-cols-3 gap-1.5 w-full bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumber(num)}
              className="h-7 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-mono text-xs font-semibold flex items-center justify-center active:scale-95 transition-transform"
            >
              {num}
            </button>
          ))}
          <div className="col-start-2">
            <button
              onClick={() => handleNumber(0)}
              className="w-full h-7 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-mono text-xs font-semibold flex items-center justify-center active:scale-95 transition-transform"
            >
              0
            </button>
          </div>
        </div>

        {/* Frequency selector footer */}
        <div className="mt-3 flex items-center justify-between w-full text-[9px] font-mono text-slate-500">
          <span>CARRIER:</span>
          <div className="flex gap-1">
            {(['433.92 MHz', '315.00 MHz', '38.0 kHz IR'] as const).map(freq => (
              <button
                key={freq}
                onClick={() => setCarrierFreq(freq)}
                className={`px-1 rounded ${carrierFreq === freq ? 'text-cyan-400 font-bold' : 'hover:text-slate-300'}`}
              >
                {freq.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Prominent Hide Remote Action Button */}
        <button
          onClick={onClose}
          className="mt-3 w-full py-2 px-3 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-slate-700/80 flex items-center justify-center gap-2 transition-all shadow cursor-pointer active:scale-95"
          title="Hide Remote Control Handset"
        >
          <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
          <span>Hide Remote Control</span>
        </button>

      </div>
    </div>
  );
};
