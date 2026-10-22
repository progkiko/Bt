import React, { useState, useEffect } from 'react';
import { OutputZone } from '../types/multiOutput';
import { audioEngine } from '../services/audioEngine';
import { 
  Speaker, 
  Volume2, 
  VolumeX, 
  Radio, 
  Layers, 
  Cable, 
  Share2, 
  Clock, 
  Headphones, 
  SlidersHorizontal,
  Wifi,
  Usb,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface MultiOutputViewProps {
  zones: OutputZone[];
  onUpdateZone: (zoneId: string, updates: Partial<OutputZone>) => void;
  onSyncAllZones: () => void;
  onMuteAllZones: () => void;
  onOpenUSBAudio?: () => void;
  activeUSBEncodingLabel?: string;
}

export const MultiOutputView: React.FC<MultiOutputViewProps> = ({
  zones,
  onUpdateZone,
  onSyncAllZones,
  onMuteAllZones,
  onOpenUSBAudio,
  activeUSBEncodingLabel = 'PCM 24-Bit / 96kHz (UAC2)',
}) => {
  const [hardwareOutputs, setHardwareOutputs] = useState<MediaDeviceInfo[]>([]);
  const [activeSoloZone, setActiveSoloZone] = useState<string | null>(null);

  useEffect(() => {
    audioEngine.getAvailableHardwareOutputs().then(devices => {
      setHardwareOutputs(devices);
    });
  }, []);

  const handleSolo = (zoneId: string) => {
    if (activeSoloZone === zoneId) {
      // De-solo
      setActiveSoloZone(null);
      zones.forEach(z => onUpdateZone(z.id, { mute: false }));
    } else {
      // Solo this zone
      setActiveSoloZone(zoneId);
      zones.forEach(z => {
        onUpdateZone(z.id, { mute: z.id !== zoneId });
      });
    }
  };

  const getZoneIcon = (type: OutputZone['type']) => {
    switch (type) {
      case 'WIRED_SPRING_TERMINAL':
        return <Speaker className="w-4 h-4 text-cyan-400" />;
      case 'RCA_LINE':
        return <Cable className="w-4 h-4 text-amber-400" />;
      case 'BLUETOOTH':
        return <Radio className="w-4 h-4 text-blue-400" />;
      case 'USB_DAC':
        return <Usb className="w-4 h-4 text-purple-400" />;
      case 'NETWORK_STREAM':
        return <Wifi className="w-4 h-4 text-emerald-400" />;
      case 'HEADPHONES':
        return <Headphones className="w-4 h-4 text-rose-400" />;
      default:
        return <Speaker className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Banner & Multi-Zone Master Operations */}
      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">
              Multi-Output Zone Matrix & Audio Device Router
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Seamless multi-room output distribution across AK-45 spring terminals, USB-C hub DAC, Bluetooth, and Ethernet streamers
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSyncAllZones}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Party Mode (Sync All)</span>
          </button>
          <button
            onClick={onMuteAllZones}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            <span>Mute All</span>
          </button>
        </div>
      </div>

      {/* Grid of 6 Configured Audio Output Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {zones.map((zone) => {
          const isSoloed = activeSoloZone === zone.id;

          return (
            <div
              key={zone.id}
              className={`bg-[#121620] rounded-xl p-5 border transition-all flex flex-col justify-between ${
                zone.enabled && !zone.mute
                  ? 'border-slate-700/80 shadow-lg'
                  : 'border-slate-800/60 opacity-75'
              }`}
            >
              {/* Zone Header */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center">
                      {getZoneIcon(zone.type)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-200 tracking-tight">
                        {zone.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {zone.hardwarePort}
                      </span>
                    </div>
                  </div>

                  {/* Enable / Disable toggle */}
                  <button
                    onClick={() => onUpdateZone(zone.id, { enabled: !zone.enabled })}
                    className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                      zone.enabled ? 'bg-cyan-500' : 'bg-slate-700'
                    }`}
                    title={zone.enabled ? 'Zone Active' : 'Zone Disabled'}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        zone.enabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 mb-4 line-clamp-1">
                  {zone.description}
                </div>

                {/* Volume Slider & Controls */}
                <div className="space-y-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">Zone Level</span>
                    <span className="font-mono text-cyan-400 font-bold tabular-nums">
                      {zone.mute ? 'MUTED' : `${zone.volume}%`}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={zone.mute ? 0 : zone.volume}
                    disabled={!zone.enabled}
                    onChange={(e) => {
                      const vol = Number(e.target.value);
                      onUpdateZone(zone.id, { volume: vol, mute: false });
                      audioEngine.updateZoneVolume(zone.id, vol, false);
                    }}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-40"
                  />

                  {/* Mute and Solo Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        const nextMute = !zone.mute;
                        onUpdateZone(zone.id, { mute: nextMute });
                        audioEngine.updateZoneVolume(zone.id, zone.volume, nextMute);
                      }}
                      className={`flex-1 py-1 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border ${
                        zone.mute
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                      }`}
                    >
                      {zone.mute ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                      <span>{zone.mute ? 'Muted' : 'Mute'}</span>
                    </button>

                    <button
                      onClick={() => handleSolo(zone.id)}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-colors border ${
                        isSoloed
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                      }`}
                      title="Solo this zone (mutes all others)"
                    >
                      Solo
                    </button>
                  </div>
                </div>

                {/* Delay & Acoustic Latency Compensation */}
                <div className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/80 space-y-1.5 mb-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>Delay Compensation</span>
                    </span>
                    <span className="font-mono text-cyan-400 font-bold">{zone.delayMs} ms</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={250}
                    step={5}
                    value={zone.delayMs}
                    disabled={!zone.enabled}
                    onChange={(e) => onUpdateZone(zone.id, { delayMs: Number(e.target.value) })}
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>0ms (Direct)</span>
                    <span>125ms</span>
                    <span>250ms (Wireless)</span>
                  </div>
                </div>

                {/* Routing Feed & Channel Mode */}
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-500 block mb-1 uppercase font-semibold">Source Feed</span>
                    <select
                      value={zone.source}
                      onChange={(e) => onUpdateZone(zone.id, { source: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-1 focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      <option value="MASTER">Master + EQ</option>
                      <option value="AUX">AUX Direct</option>
                      <option value="BLUETOOTH">Bluetooth</option>
                      <option value="USB">USB Media</option>
                      <option value="FM">FM Radio</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-slate-500 block mb-1 uppercase font-semibold">Channel Mode</span>
                    <select
                      value={zone.channelMode}
                      onChange={(e) => onUpdateZone(zone.id, { channelMode: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-1 focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      <option value="STEREO">Stereo (L/R)</option>
                      <option value="MONO_SUM">Mono Sum (L+R)</option>
                      <option value="LEFT_ONLY">Left Channel</option>
                      <option value="RIGHT_ONLY">Right Channel</option>
                    </select>
                  </div>
                </div>

                {/* USB-A Audio Output Encoding Details */}
                {zone.type === 'USB_DAC' && (
                  <div className="mt-3 bg-purple-950/30 border border-purple-800/40 rounded-lg p-2 flex items-center justify-between text-[10px]">
                    <span className="font-mono text-purple-300 font-semibold truncate mr-2">
                      ENCODING: {activeUSBEncodingLabel}
                    </span>
                    {onOpenUSBAudio && (
                      <button
                        onClick={onOpenUSBAudio}
                        className="px-2 py-0.5 bg-purple-900/60 hover:bg-purple-800 text-purple-200 rounded font-semibold text-[9px] shrink-0"
                      >
                        Config
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Zone Specs & Hardware Status Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-cyan-400/90">{zone.impedanceOrSpecs}</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>SYNCHRONIZED</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Discovered Physical Hardware Interfaces Section */}
      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Cable className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-200">
              Host Physical Audio Output Sinks & USB-C Adapters
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {hardwareOutputs.length} Output Drivers Detected
          </span>
        </div>

        {hardwareOutputs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {hardwareOutputs.map((hw, i) => (
              <div
                key={hw.deviceId || i}
                className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="truncate mr-2">
                  <div className="font-semibold text-slate-200 truncate">
                    {hw.label || `Audio Sink Device #${i + 1}`}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">
                    ID: {hw.deviceId ? hw.deviceId.slice(0, 16) + '...' : 'Default System Sink'}
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono px-2 py-0.5 bg-emerald-950/60 border border-emerald-800/40 rounded">
                  READY
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-400">
            Standard Web Audio default sink bound to system DAC. Connected USB hubs and Bluetooth A2DP headsets will seamlessly route through your active zone outputs.
          </div>
        )}
      </div>
    </div>
  );
};
