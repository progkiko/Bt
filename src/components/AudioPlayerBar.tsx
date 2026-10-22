import React, { useState, useEffect, useRef } from 'react';
import { audioEngine } from '../services/audioEngine';
import { 
  Play, 
  Pause, 
  Square, 
  Upload, 
  Volume2, 
  VolumeX, 
  Music, 
  Radio, 
  Waves, 
  Disc,
  Disc3
} from 'lucide-react';

interface AudioPlayerBarProps {
  masterVolume: number;
  isMuted: boolean;
  onVolumeChange: (vol: number) => void;
  onMuteToggle: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  masterVolume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('AK-45 Groove Session (Hi-Fi Demo)');
  const [demoType, setDemoType] = useState<'groove' | 'bass' | 'acoustic' | 'tone1k'>('groove');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const togglePlayback = () => {
    if (isPlaying) {
      audioEngine.stopPlayback();
      setIsPlaying(false);
    } else {
      audioEngine.startDemoPlayback(demoType);
      setIsPlaying(true);
      setCurrentTrack(audioEngine.getCurrentTrackName());
    }
  };

  const handleSelectDemo = (type: 'groove' | 'bass' | 'acoustic' | 'tone1k') => {
    setDemoType(type);
    audioEngine.startDemoPlayback(type);
    setIsPlaying(true);
    setCurrentTrack(audioEngine.getCurrentTrackName());
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const trackName = await audioEngine.loadUserAudioFile(file);
      setCurrentTrack(trackName || file.name);
      setIsPlaying(true);
    } catch (err) {
      console.error('Failed to load user audio', err);
    }
  };

  // Real-time mini spectrum bar animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let active = true;

    const renderSpectrum = () => {
      if (!active) return;
      const data = audioEngine.getSpectrumData();
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const barCount = 28;
      const barWidth = (width / barCount) - 1.5;

      for (let i = 0; i < barCount; i++) {
        const val = isPlaying && !isMuted ? (data[i * 2] || 0) / 255 : 0.05;
        const barHeight = Math.max(3, val * height);
        const x = i * (barWidth + 1.5);
        const y = height - barHeight;

        // Gradient from cyan to blue
        const grad = ctx.createLinearGradient(0, height, 0, 0);
        grad.addColorStop(0, '#06b6d4');
        grad.addColorStop(0.7, '#38bdf8');
        grad.addColorStop(1, '#a855f7');

        ctx.fillStyle = isPlaying ? grad : '#1e293b';
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      animFrameRef.current = requestAnimationFrame(renderSpectrum);
    };

    animFrameRef.current = requestAnimationFrame(renderSpectrum);

    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, isMuted]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c101a]/95 backdrop-blur-md border-t border-slate-800 shadow-2xl px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Left: Track Information & Audio Spectrum */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Animated vinyl / disc icon */}
          <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
            <Disc3 className={`w-5 h-5 text-cyan-400 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          </div>

          <div className="truncate max-w-[200px] md:max-w-[260px]">
            <div className="text-xs font-bold text-slate-200 truncate flex items-center gap-1.5">
              <span>{currentTrack}</span>
            </div>
            <div className="text-[10px] text-cyan-400 font-mono flex items-center gap-2">
              <span>Web Audio DSP Active</span>
              <span>·</span>
              <span>24-bit 48kHz</span>
            </div>
          </div>

          {/* Mini Spectrum Canvas */}
          <div className="hidden md:block">
            <canvas
              ref={canvasRef}
              width={100}
              height={32}
              className="w-24 h-8 rounded bg-black/40 border border-slate-800"
            />
          </div>
        </div>

        {/* Center: Playback Controls & Demo Feed Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
          <button
            onClick={togglePlayback}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isPlaying
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.6)]'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          {/* Demo track selector menu */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => handleSelectDemo('groove')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                demoType === 'groove' && isPlaying ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Hi-Fi Groove
            </button>
            <button
              onClick={() => handleSelectDemo('bass')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                demoType === 'bass' && isPlaying ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Sub-Bass
            </button>
            <button
              onClick={() => handleSelectDemo('acoustic')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                demoType === 'acoustic' && isPlaying ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Acoustic
            </button>
            <button
              onClick={() => handleSelectDemo('tone1k')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                demoType === 'tone1k' && isPlaying ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              1kHz Tone
            </button>
          </div>

          {/* User File Uploader */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
            title="Upload your own local audio file (.mp3, .wav, .flac)"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Play Local File</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            className="hidden"
          />
        </div>

        {/* Right: Master Output Volume slider */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={onMuteToggle}
            className={`p-2 rounded-lg transition-colors ${
              isMuted ? 'text-rose-400 bg-rose-950/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={isMuted ? 0 : masterVolume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-24 md:w-32 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />

          <span className="font-mono text-xs text-cyan-400 font-bold w-9 text-right tabular-nums">
            {isMuted ? 'MUTE' : `${masterVolume}%`}
          </span>
        </div>

      </div>
    </div>
  );
};
