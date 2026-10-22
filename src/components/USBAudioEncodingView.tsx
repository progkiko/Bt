import React, { useState, useEffect } from 'react';
import { 
  USBEncodingFormat, 
  USBAudioClass, 
  USBSampleRate, 
  USBTransferMode, 
  USBAudioPortConfig,
  USBAudioEncoderTelemetry 
} from '../types/usbAudio';
import { audioEngine } from '../services/audioEngine';
import { bluetoothService } from '../services/bluetoothService';
import { 
  Usb, 
  Binary, 
  Disc, 
  Activity, 
  Download, 
  Play, 
  Square, 
  CheckCircle2, 
  Clock, 
  Layers, 
  FileAudio,
  Radio,
  Cpu,
  Sliders,
  Sparkles
} from 'lucide-react';

interface USBAudioEncodingViewProps {
  portConfig: USBAudioPortConfig;
  onUpdateConfig: (updates: Partial<USBAudioPortConfig>) => void;
}

export const USBAudioEncodingView: React.FC<USBAudioEncodingViewProps> = ({
  portConfig,
  onUpdateConfig,
}) => {
  const [telemetry, setTelemetry] = useState<USBAudioEncoderTelemetry>({
    isEncoding: false,
    isRecording: false,
    recordingSeconds: 0,
    packetsSent: 0,
    droppedFrames: 0,
    bufferUnderruns: 0,
    jitterMs: 0.4,
    measuredLatencyMs: 5.3,
    totalBytesEncoded: 0,
    encodedFileUrl: null,
    recordedFileName: null,
  });

  const [activePortTab, setActivePortTab] = useState<'hub_port_1' | 'hub_port_2' | 'ak45_front'>('hub_port_1');

  // Poll encoder telemetry
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry(audioEngine.getUSBEncoderTelemetry());
    }, 250);
    return () => clearInterval(timer);
  }, []);

  const handleStartEncoding = () => {
    audioEngine.startUSBEncoding(
      portConfig.encodingFormat,
      portConfig.sampleRate,
      portConfig.bitDepth
    );
    bluetoothService.sendCustomCommand(
      `AT+USB_ENCODE_START=PORT:${activePortTab},FMT:${portConfig.encodingFormat},SR:${portConfig.sampleRate}`
    );
  };

  const handleStopEncoding = async () => {
    const res = await audioEngine.stopUSBEncoding();
    if (res) {
      bluetoothService.sendCustomCommand(
        `AT+USB_ENCODE_SAVED=${res.fileName},BYTES:${res.totalBytes}`
      );
    }
  };

  const encodingFormats: { id: USBEncodingFormat; label: string; bitDepth: 16 | 24 | 32; desc: string; standard: string }[] = [
    { 
      id: 'PCM_16BIT', 
      label: 'PCM 16-Bit', 
      bitDepth: 16, 
      desc: 'Standard Redbook CD audio, UAC1 plug-and-play compatible with all USB DACs', 
      standard: '1,411 kbps (44.1kHz) / 1,536 kbps (48kHz)' 
    },
    { 
      id: 'PCM_24BIT', 
      label: 'PCM 24-Bit Studio', 
      bitDepth: 24, 
      desc: 'High-Resolution Studio Master with 144 dB dynamic range (UAC2 Asynchronous)', 
      standard: '4,608 kbps (96kHz) / 9,216 kbps (192kHz)' 
    },
    { 
      id: 'PCM_32BIT_FLOAT', 
      label: 'PCM 32-Bit Float', 
      bitDepth: 32, 
      desc: 'Broadcast Floating-Point format with infinite headroom and zero clipping risk', 
      standard: '6,144 kbps (96kHz) / 12,288 kbps (192kHz)' 
    },
    { 
      id: 'FLAC_LOSSLESS', 
      label: 'FLAC Bitstream', 
      bitDepth: 24, 
      desc: 'Real-time lossless compressed audio stream for USB-A flash drive recording', 
      standard: '~1,150 kbps variable' 
    },
    { 
      id: 'MP3_320KBPS', 
      label: 'MP3 320 kbps CBR', 
      bitDepth: 16, 
      desc: 'Maximum bitrate MPEG Layer III encoding for standard USB MP3 flash drives', 
      standard: '320 kbps constant' 
    },
    { 
      id: 'DSD_DOP', 
      label: 'DSD / DoP (DSD64)', 
      bitDepth: 24, 
      desc: 'Direct Stream Digital 2.8224 MHz bitstream packaged over 24-bit/176.4kHz PCM', 
      standard: '5,645 kbps bitstream' 
    },
  ];

  const sampleRates: USBSampleRate[] = [44100, 48000, 88200, 96000, 192000];

  // Calculate live bitstream bandwidth
  const currentBitrate = Math.round((portConfig.sampleRate * 2 * portConfig.bitDepth) / 1000);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Usb className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">
              USB-A Audio Output Encoding & Protocol Engine
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure real-time PCM/FLAC/DSD bitstream encoding, UAC1/UAC2 isochronous transfer modes, and USB-A flash recording
          </p>
        </div>

        <div className="flex items-center gap-2">
          {telemetry.isRecording ? (
            <button
              onClick={handleStopEncoding}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold rounded-lg transition-colors shadow-[0_0_12px_rgba(244,63,94,0.4)]"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop &amp; Save USB Stream ({telemetry.recordingSeconds}s)</span>
            </button>
          ) : (
            <button
              onClick={handleStartEncoding}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-[0_0_12px_rgba(6,182,212,0.3)]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start USB-A Encoding &amp; Record</span>
            </button>
          )}
        </div>
      </div>

      {/* Target USB-A Port Selector Tabs (Referencing user's USB-C multiport hub Photo 3 and AK-45 Front Port Photo 1!) */}
      <div className="bg-[#121620] border border-slate-800 rounded-xl p-4">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Target Physical USB-A Output Hardware Port
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <button
            onClick={() => setActivePortTab('hub_port_1')}
            className={`p-3 rounded-lg text-left transition-all border ${
              activePortTab === 'hub_port_1'
                ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-sm'
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Hub USB-A Port 1 (Photo 3)</span>
              <span className="text-[10px] font-mono text-cyan-400">UAC 2.0</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Multiport Hub · High-Res 24-bit DAC Output
            </div>
          </button>

          <button
            onClick={() => setActivePortTab('hub_port_2')}
            className={`p-3 rounded-lg text-left transition-all border ${
              activePortTab === 'hub_port_2'
                ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-sm'
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Hub USB-A Port 2 (Photo 3)</span>
              <span className="text-[10px] font-mono text-cyan-400">UAC 1.0</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Multiport Hub · Secondary Headset / DAC Dongle
            </div>
          </button>

          <button
            onClick={() => setActivePortTab('ak45_front')}
            className={`p-3 rounded-lg text-left transition-all border ${
              activePortTab === 'ak45_front'
                ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-sm'
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span>AK-45 Front USB-A Port (Photo 1)</span>
              <span className="text-[10px] font-mono text-amber-400">FAT32 Drive</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Amplifier Front Face · Direct Flash Recording
            </div>
          </button>
        </div>
      </div>

      {/* Grid: Encoding Formats & Bitstream Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Encoding Format & Sample Rate Matrix */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Format Selector */}
          <div className="bg-[#121620] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Binary className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-200">
                  USB Audio Output Encoding Format
                </h3>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {portConfig.bitDepth}-BIT · {currentBitrate} KBPS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {encodingFormats.map((fmt) => {
                const isSelected = portConfig.encodingFormat === fmt.id;

                return (
                  <button
                    key={fmt.id}
                    onClick={() => onUpdateConfig({ 
                      encodingFormat: fmt.id, 
                      bitDepth: fmt.bitDepth,
                      bitrateKbps: Math.round((portConfig.sampleRate * 2 * fmt.bitDepth) / 1000)
                    })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-100">{fmt.label}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed mb-2">
                      {fmt.desc}
                    </p>
                    <div className="text-[9px] font-mono text-cyan-400/80 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      {fmt.standard}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sample Rate Selector */}
            <div className="pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                <span>Sampling Rate (DAC Internal Clock)</span>
                <span className="font-mono text-cyan-400">{portConfig.sampleRate / 1000} kHz</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {sampleRates.map((rate) => (
                  <button
                    key={rate}
                    onClick={() => onUpdateConfig({ 
                      sampleRate: rate,
                      bitrateKbps: Math.round((rate * 2 * portConfig.bitDepth) / 1000)
                    })}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                      portConfig.sampleRate === rate
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {rate / 1000}k
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* USB Audio Class & Transfer Mode */}
          <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-slate-200">
                  USB Audio Class (UAC) & Isochronous Transfer
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* UAC 1.0 vs UAC 2.0 */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  USB Audio Class Protocol
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onUpdateConfig({ audioClass: 'UAC1_LEGACY', bitDepth: 16, sampleRate: 48000 })}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors border ${
                      portConfig.audioClass === 'UAC1_LEGACY'
                        ? 'bg-purple-950/60 border-purple-400 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    UAC 1.0 (Legacy 16/48)
                  </button>
                  <button
                    onClick={() => onUpdateConfig({ audioClass: 'UAC2_HIGH_RES', bitDepth: 24, sampleRate: 96000 })}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors border ${
                      portConfig.audioClass === 'UAC2_HIGH_RES'
                        ? 'bg-purple-950/60 border-purple-400 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    UAC 2.0 (High-Res 24/192)
                  </button>
                </div>
              </div>

              {/* Isochronous Transfer Mode */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Clock Synchronization Mode
                </label>
                <select
                  value={portConfig.transferMode}
                  onChange={(e) => onUpdateConfig({ transferMode: e.target.value as USBTransferMode })}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-cyan-400"
                >
                  <option value="ASYNC_ISOCHRONOUS">Asynchronous (DAC Master Clock)</option>
                  <option value="ADAPTIVE">Adaptive (Host Clock Slaved)</option>
                  <option value="SYNCHRONOUS">Synchronous (SOF 1ms Packets)</option>
                </select>
              </div>
            </div>

            {/* Dither & Buffer Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">TPDF Triangular Dither</span>
                  <span className="text-[10px] text-slate-400">Eliminates truncation distortion</span>
                </div>
                <button
                  onClick={() => onUpdateConfig({ ditherEnabled: !portConfig.ditherEnabled })}
                  className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                    portConfig.ditherEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      portConfig.ditherEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-semibold">Isochronous Buffer Size</span>
                  <span className="font-mono text-cyan-400">{portConfig.bufferSizeSamples} samples</span>
                </div>
                <div className="flex gap-1">
                  {([64, 128, 256, 512] as const).map((buf) => (
                    <button
                      key={buf}
                      onClick={() => onUpdateConfig({ bufferSizeSamples: buf })}
                      className={`flex-1 py-1 rounded text-[10px] font-mono transition-colors ${
                        portConfig.bufferSizeSamples === buf
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {buf}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Live Stream Telemetry & Real-Time WAV Exporter */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Live USB-A Audio Bitstream Monitor */}
          <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-200">
                    Live USB-A Bitstream Telemetry
                  </h3>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  telemetry.isRecording
                    ? 'bg-rose-950/80 text-rose-300 border-rose-800 animate-pulse'
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                }`}>
                  {telemetry.isRecording ? 'STREAMING & RECORDING' : 'DAC ACTIVE'}
                </span>
              </div>

              {/* Bitstream Speedometer */}
              <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 mb-4 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                  Active USB Audio Bitrate
                </span>
                <div className="text-3xl font-mono font-bold text-cyan-400 glow-blue tabular-nums">
                  {currentBitrate.toLocaleString()} kbps
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  {portConfig.channels} Channels · {portConfig.bitDepth}-Bit Integer · {portConfig.sampleRate / 1000} kHz
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs font-mono">
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">PACKETS SENT</span>
                  <span className="text-slate-100 font-bold text-sm tabular-nums">
                    {telemetry.packetsSent.toLocaleString()} pkts
                  </span>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">BUFFER LATENCY</span>
                  <span className="text-emerald-400 font-bold text-sm tabular-nums">
                    {telemetry.measuredLatencyMs.toFixed(2)} ms
                  </span>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">CLOCK JITTER</span>
                  <span className="text-cyan-400 font-bold text-sm tabular-nums">
                    &lt; {telemetry.jitterMs} ms
                  </span>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">DATA ENCODED</span>
                  <span className="text-slate-100 font-bold text-sm tabular-nums">
                    {(telemetry.totalBytesEncoded / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              </div>
            </div>

            {/* Recorded File Ready For Download */}
            {telemetry.encodedFileUrl && (
              <div className="mt-2 bg-cyan-950/40 border border-cyan-500/50 rounded-xl p-4 animate-in fade-in">
                <div className="flex items-start gap-2.5 mb-2">
                  <FileAudio className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 truncate">
                      {telemetry.recordedFileName}
                    </h4>
                    <p className="text-[10px] text-slate-300">
                      Lossless PCM WAV encoded from AK-45 Master output bus
                    </p>
                  </div>
                </div>

                <a
                  href={telemetry.encodedFileUrl}
                  download={telemetry.recordedFileName || 'AK45_USBA_Encoded.wav'}
                  className="w-full mt-2 py-2 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Encoded File to USB-A</span>
                </a>
              </div>
            )}
          </div>

          {/* Quick Hardware Pinout Note */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-1.5">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>USB-A Audio Stream Hardware Routing</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              When playing audio, the encoded PCM bitstream is mirrored through the selected USB-A port on your multiport adapter hub (Photo 3) or AK-45 front port (Photo 1), enabling direct lossless DAC playback and flash drive recording.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
