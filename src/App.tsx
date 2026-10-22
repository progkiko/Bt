/**
 * AK-45 Hi-Fi Amplifier Control & Multi-Output Audio Network
 */

import React, { useState, useEffect } from 'react';
import { Radio } from 'lucide-react';
import { AmplifierState, InputSource, EQBand, EQMode, BluetoothDeviceInfo } from './types/amplifier';
import { OutputZone } from './types/multiOutput';
import { USBAudioPortConfig } from './types/usbAudio';
import { audioEngine } from './services/audioEngine';
import { bluetoothService } from './services/bluetoothService';
import { TopNav, ActiveTab } from './components/TopNav';
import { FrontPanel } from './components/FrontPanel';
import { RearPanel } from './components/RearPanel';
import { EqualizerView } from './components/EqualizerView';
import { ACEffectsView } from './components/ACEffectsView';
import { USBAudioEncodingView } from './components/USBAudioEncodingView';
import { MultiOutputView } from './components/MultiOutputView';
import { BluetoothNetworkView } from './components/BluetoothNetworkView';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { WiringGuideModal } from './components/WiringGuideModal';
import { RFRemoteHandset } from './components/RFRemoteHandset';
import { LiveDemoTour } from './components/LiveDemoTour';
import { AndroidEmulatorView } from './components/AndroidEmulatorView';

const initialEQBands: EQBand[] = [
  { frequency: 32, label: '32Hz', gain: 2 },
  { frequency: 64, label: '64Hz', gain: 3 },
  { frequency: 125, label: '125Hz', gain: 1 },
  { frequency: 250, label: '250Hz', gain: 0 },
  { frequency: 500, label: '500Hz', gain: 0 },
  { frequency: 1000, label: '1kHz', gain: 0 },
  { frequency: 2000, label: '2kHz', gain: 1 },
  { frequency: 4000, label: '4kHz', gain: 2 },
  { frequency: 8000, label: '8kHz', gain: 3 },
  { frequency: 16000, label: '16kHz', gain: 2 },
];

const initialZones: OutputZone[] = [
  {
    id: 'zone-spring-terminals',
    name: 'AK-45 Spring Terminals (L/R)',
    type: 'WIRED_SPRING_TERMINAL',
    description: 'Direct passive stereo speakers wired to rear spring clips (Photo 2)',
    enabled: true,
    volume: 75,
    mute: false,
    delayMs: 0,
    source: 'MASTER',
    channelMode: 'STEREO',
    impedanceOrSpecs: '4 - 8 Ω (40W + 40W)',
    hardwarePort: 'Rear Spring Terminals [CH1/CH2]',
    isHardwareActive: true,
  },
  {
    id: 'zone-rca-line',
    name: 'RCA Line Out / Active Sub',
    type: 'RCA_LINE',
    description: 'Line-level analog feed via braided RCA cables (Photo 2)',
    enabled: true,
    volume: 70,
    mute: false,
    delayMs: 0,
    source: 'MASTER',
    channelMode: 'STEREO',
    impedanceOrSpecs: '2.1V RMS Line Level',
    hardwarePort: 'Rear RCA Audio Output',
    isHardwareActive: true,
  },
  {
    id: 'zone-usb-hub',
    name: 'USB-C Multiport Audio DAC',
    type: 'USB_DAC',
    description: 'High-resolution external DAC connected to USB-C multiport hub (Photo 3)',
    enabled: true,
    volume: 80,
    mute: false,
    delayMs: 0,
    source: 'MASTER',
    channelMode: 'STEREO',
    impedanceOrSpecs: '24-bit 96kHz Lossless',
    hardwarePort: 'USB-C Multiport Hub',
    isHardwareActive: true,
  },
  {
    id: 'zone-bluetooth-soundbar',
    name: 'Living Room Soundbar (BT A2DP)',
    type: 'BLUETOOTH',
    description: 'Secondary wireless Bluetooth audio receiver',
    enabled: false,
    volume: 65,
    mute: false,
    delayMs: 35,
    source: 'MASTER',
    channelMode: 'STEREO',
    impedanceOrSpecs: 'aptX LL (48kHz)',
    hardwarePort: 'BT-MESH-NODE-2',
    isHardwareActive: true,
  },
  {
    id: 'zone-network-streamer',
    name: 'Network Streamer (Ethernet)',
    type: 'NETWORK_STREAM',
    description: 'LAN Port audio streamer endpoint via gateway router (Photo 4)',
    enabled: true,
    volume: 70,
    mute: false,
    delayMs: 15,
    source: 'MASTER',
    channelMode: 'STEREO',
    impedanceOrSpecs: 'IP: 192.168.1.145:8080',
    hardwarePort: 'LAN Port 2 / RJ-45',
    isHardwareActive: true,
  },
  {
    id: 'zone-front-headphones',
    name: 'Front Headphone Monitor',
    type: 'HEADPHONES',
    description: 'Front 3.5mm monitor jack for personal acoustic monitoring',
    enabled: false,
    volume: 60,
    mute: false,
    delayMs: 0,
    source: 'MASTER',
    channelMode: 'STEREO',
    impedanceOrSpecs: '32 Ω - 300 Ω Drive',
    hardwarePort: 'Front Panel 3.5mm Jack',
    isHardwareActive: false,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('deck');
  const [showRearPanel, setShowRearPanel] = useState(false);
  const [isWiringGuideOpen, setIsWiringGuideOpen] = useState(false);
  const [isRemoteOpen, setIsRemoteOpen] = useState(true);
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  // Core Amplifier Hardware State
  const [ampState, setAmpState] = useState<AmplifierState>({
    power: true,
    masterVolume: 75,
    mute: false,
    inputSource: 'AUX',
    bass: 2,
    treble: 3,
    balance: 0,
    mic1Volume: 50,
    mic2Volume: 50,
    echo: 20,
    loudness: true,
    fmFrequency: 101.5,
    eqMode: 'CUSTOM',
    eqBands: initialEQBands,
    spatializer3D: true,
    effects: {
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
    },
    connectedDevice: 'AK-45 Pro HiFi Audio [BT-888]',
    connectionType: 'BLUETOOTH',
    connectionStatus: 'CONNECTED',
    signalStrength: -48,
    networkIp: '192.168.1.145',
    networkPort: 8080,
  });

  // Multi-Output Zones
  const [zones, setZones] = useState<OutputZone[]>(initialZones);

  // USB-A Audio Output Encoding Configuration
  const [usbPortConfig, setUsbPortConfig] = useState<USBAudioPortConfig>({
    id: 'hub-port-1',
    name: 'USB-C Multiport Hub - Port A1 (Photo 3)',
    hardwareLocation: 'Hub Port 1',
    connectedDevice: 'Realtek High-Res 24-Bit USB Audio DAC',
    audioClass: 'UAC2_HIGH_RES',
    encodingFormat: 'PCM_24BIT',
    sampleRate: 96000,
    bitDepth: 24,
    channels: 2,
    transferMode: 'ASYNC_ISOCHRONOUS',
    bufferSizeSamples: 256,
    bitrateKbps: 4608,
    ditherEnabled: true,
    clockSource: 'INTERNAL_CRYSTAL',
    isStreamActive: true,
    volume: 80,
    mute: false,
  });

  const updateUSBConfig = (updates: Partial<USBAudioPortConfig>) => {
    setUsbPortConfig(prev => {
      const next = { ...prev, ...updates };
      bluetoothService.sendCustomCommand(
        `AT+USB_ENCODE_SET=FMT:${next.encodingFormat},SR:${next.sampleRate},BD:${next.bitDepth}`
      );
      return next;
    });
  };

  // Sync state changes with Web Audio Engine & Bluetooth remote packets
  const updateAmpState = (updates: Partial<AmplifierState>) => {
    setAmpState(prev => {
      const next = { ...prev, ...updates };

      if (updates.masterVolume !== undefined || updates.mute !== undefined) {
        audioEngine.setMasterVolume(next.masterVolume, next.mute || !next.power);
        bluetoothService.sendVolumeCommand(next.masterVolume);
        if (updates.mute !== undefined) bluetoothService.sendMuteCommand(next.mute);
      }

      if (updates.power !== undefined) {
        audioEngine.setMasterVolume(next.masterVolume, next.mute || !next.power);
      }

      if (updates.bass !== undefined) {
        audioEngine.setBass(updates.bass);
        bluetoothService.sendBassCommand(updates.bass);
      }

      if (updates.treble !== undefined) {
        audioEngine.setTreble(updates.treble);
        bluetoothService.sendTrebleCommand(updates.treble);
      }

      if (updates.balance !== undefined) {
        audioEngine.setBalance(updates.balance);
      }

      if (updates.loudness !== undefined) {
        audioEngine.setLoudness(updates.loudness);
      }

      if (updates.inputSource !== undefined) {
        bluetoothService.sendSourceCommand(updates.inputSource);
      }

      if (updates.echo !== undefined) {
        audioEngine.setEcho(updates.echo, next.effects.echoDelayMs, next.effects.echoFeedback);
      }

      return next;
    });
  };

  const updateEffects = (effectsUpdate: Partial<AmplifierState['effects']>) => {
    setAmpState(prev => {
      const nextEffects = { ...prev.effects, ...effectsUpdate };
      
      if (effectsUpdate.echo !== undefined || effectsUpdate.echoDelayMs !== undefined || effectsUpdate.echoFeedback !== undefined) {
        audioEngine.setEcho(nextEffects.echo, nextEffects.echoDelayMs, nextEffects.echoFeedback);
      }
      if (effectsUpdate.acHumFilter !== undefined || effectsUpdate.acHumFrequency !== undefined) {
        audioEngine.setACHumFilter(nextEffects.acHumFilter, nextEffects.acHumFrequency);
      }
      if (effectsUpdate.tubeWarmth !== undefined) {
        audioEngine.setTubeWarmth(nextEffects.tubeWarmth);
      }
      if (effectsUpdate.stereoWidth !== undefined) {
        audioEngine.setStereoWidth(nextEffects.stereoWidth);
      }

      return {
        ...prev,
        effects: nextEffects,
      };
    });
  };

  // Equalizer Updates
  const updateEQBand = (index: number, gain: number) => {
    setAmpState(prev => {
      const newBands = [...prev.eqBands];
      if (newBands[index]) {
        newBands[index] = { ...newBands[index], gain };
      }
      audioEngine.setEQBands(newBands);
      return { ...prev, eqBands: newBands, eqMode: 'CUSTOM' };
    });
  };

  const selectEQPreset = (mode: EQMode) => {
    let presetGains: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    switch (mode) {
      case 'FLAT':
        presetGains = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        break;
      case 'BASS_BOOST':
        presetGains = [6, 7, 5, 2, 0, -1, 0, 1, 2, 2];
        break;
      case 'ROCK':
        presetGains = [4, 3, 1, -1, -2, 0, 2, 3, 4, 3];
        break;
      case 'POP':
        presetGains = [-1, 2, 3, 2, 1, 0, 2, 3, 2, 1];
        break;
      case 'JAZZ':
        presetGains = [3, 2, 1, 2, 2, 1, 0, 1, 2, 3];
        break;
      case 'VOCAL':
        presetGains = [-3, -2, -1, 1, 3, 4, 3, 2, 1, 0];
        break;
      case 'ELECTRONIC':
        presetGains = [5, 6, 3, 0, -2, 1, 2, 3, 4, 5];
        break;
      case 'ACOUSTIC':
        presetGains = [2, 3, 2, 1, 2, 2, 3, 3, 2, 1];
        break;
      default:
        return;
    }

    setAmpState(prev => {
      const newBands = prev.eqBands.map((b, i) => ({
        ...b,
        gain: presetGains[i] ?? 0,
      }));
      audioEngine.setEQBands(newBands);
      bluetoothService.sendEQModeCommand(mode);
      return { ...prev, eqBands: newBands, eqMode: mode };
    });
  };

  const resetEQFlat = () => {
    selectEQPreset('FLAT');
  };

  // Multi-Output Operations
  const updateZone = (zoneId: string, updates: Partial<OutputZone>) => {
    setZones(prev => prev.map(z => z.id === zoneId ? { ...z, ...updates } : z));
  };

  const handleSyncAllZones = () => {
    setZones(prev => prev.map(z => ({ ...z, enabled: true, mute: false, volume: 70 })));
    bluetoothService.sendCustomCommand('AT+ZONE_SYNC_PARTY_MODE');
  };

  const handleMuteAllZones = () => {
    setZones(prev => prev.map(z => ({ ...z, mute: true })));
    bluetoothService.sendCustomCommand('AT+ZONE_MUTE_ALL');
  };

  // Initial audio setup on first user click
  useEffect(() => {
    audioEngine.setMasterVolume(ampState.masterVolume, ampState.mute || !ampState.power);
    audioEngine.setBass(ampState.bass);
    audioEngine.setTreble(ampState.treble);
    audioEngine.setBalance(ampState.balance);
    audioEngine.setLoudness(ampState.loudness);
    audioEngine.setEQBands(ampState.eqBands);
    audioEngine.setEcho(ampState.effects.echo, ampState.effects.echoDelayMs, ampState.effects.echoFeedback);
    audioEngine.setACHumFilter(ampState.effects.acHumFilter, ampState.effects.acHumFrequency);
    audioEngine.setTubeWarmth(ampState.effects.tubeWarmth);
  }, []);

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col pb-28">
      {/* Top Bar Navigation */}
      <TopNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'deck') setShowRearPanel(false);
        }}
        onOpenWiringGuide={() => setIsWiringGuideOpen(true)}
        isConnected={ampState.connectionStatus === 'CONNECTED'}
        power={ampState.power}
        onTogglePower={() => updateAmpState({ power: !ampState.power })}
        isRemoteOpen={isRemoteOpen}
        onToggleRemote={() => setIsRemoteOpen(!isRemoteOpen)}
        isDemoRunning={isDemoRunning}
        onToggleDemo={() => setIsDemoRunning(!isDemoRunning)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
        
        {/* TAB 1: AMPLIFIER RACK DECK (Front Faceplate & Rear Wiring) */}
        {activeTab === 'deck' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {showRearPanel ? (
              <RearPanel
                onFlipToFront={() => setShowRearPanel(false)}
                masterVolume={ampState.masterVolume}
              />
            ) : (
              <FrontPanel
                state={ampState}
                onUpdateState={updateAmpState}
                onFlipToRear={() => setShowRearPanel(true)}
                onOpenACEffects={() => setActiveTab('effects')}
                onOpenUSBAudio={() => setActiveTab('usb')}
              />
            )}
          </div>
        )}

        {/* TAB 2: 10-BAND GRAPHIC EQUALIZER */}
        {activeTab === 'equalizer' && (
          <div className="animate-in fade-in duration-200">
            <EqualizerView
              eqBands={ampState.eqBands}
              eqMode={ampState.eqMode}
              onUpdateBand={updateEQBand}
              onSelectPreset={selectEQPreset}
              onResetFlat={resetEQFlat}
            />
          </div>
        )}

        {/* TAB 3: AC AUDIO EFFECTS CONTROL */}
        {activeTab === 'effects' && (
          <div className="animate-in fade-in duration-200">
            <ACEffectsView
              effects={ampState.effects}
              onUpdateEffects={updateEffects}
              echoKnobValue={ampState.echo}
              onEchoKnobChange={(v) => updateAmpState({ echo: v })}
            />
          </div>
        )}

        {/* TAB 4: USB-A AUDIO OUTPUT ENCODING */}
        {activeTab === 'usb' && (
          <div className="animate-in fade-in duration-200">
            <USBAudioEncodingView
              portConfig={usbPortConfig}
              onUpdateConfig={updateUSBConfig}
            />
          </div>
        )}

        {/* TAB 5: MULTI-OUTPUT ZONE MATRIX */}
        {activeTab === 'multioutput' && (
          <div className="animate-in fade-in duration-200">
            <MultiOutputView
              zones={zones}
              onUpdateZone={updateZone}
              onSyncAllZones={handleSyncAllZones}
              onMuteAllZones={handleMuteAllZones}
              onOpenUSBAudio={() => setActiveTab('usb')}
              activeUSBEncodingLabel={`${usbPortConfig.encodingFormat === 'PCM_24BIT' ? '24-Bit / 96k' : usbPortConfig.encodingFormat === 'PCM_16BIT' ? '16-Bit / 48k' : '32-Bit Float'} (${usbPortConfig.audioClass === 'UAC2_HIGH_RES' ? 'UAC2' : 'UAC1'})`}
            />
          </div>
        )}

        {/* TAB 5: BLUETOOTH & NETWORK HUB */}
        {activeTab === 'bluetooth' && (
          <div className="animate-in fade-in duration-200">
            <BluetoothNetworkView
              currentDevice={ampState.connectedDevice}
              onSelectDevice={(device: BluetoothDeviceInfo) => {
                updateAmpState({
                  connectedDevice: device.name,
                  connectionStatus: 'CONNECTED',
                  signalStrength: device.rssi,
                });
              }}
              networkIp={ampState.networkIp}
              networkPort={ampState.networkPort}
              onUpdateNetwork={(ip, port) => updateAmpState({ networkIp: ip, networkPort: port })}
            />
          </div>
        )}

        {/* TAB 6: ANDROID LIVE DEVICE EMULATION (JETPACK COMPOSE RUNTIME) */}
        {activeTab === 'android' && (
          <div className="animate-in fade-in duration-200">
            <AndroidEmulatorView
              ampState={ampState}
              onUpdateAmpState={updateAmpState}
            />
          </div>
        )}

      </main>

      {/* Persistent Bottom Audio Player Bar */}
      <AudioPlayerBar
        masterVolume={ampState.masterVolume}
        isMuted={ampState.mute || !ampState.power}
        onVolumeChange={(vol) => updateAmpState({ masterVolume: vol, mute: false })}
        onMuteToggle={() => updateAmpState({ mute: !ampState.mute })}
      />

      {/* Hardware Wiring Modal */}
      <WiringGuideModal
        isOpen={isWiringGuideOpen}
        onClose={() => setIsWiringGuideOpen(false)}
      />

      {/* Live Working Demo Tour Controller */}
      <LiveDemoTour
        isRunning={isDemoRunning}
        onStop={() => setIsDemoRunning(false)}
        ampState={ampState}
        onUpdateAmpState={updateAmpState}
        onSelectEQPreset={selectEQPreset}
        onSwitchTab={setActiveTab}
        onOpenRemote={() => setIsRemoteOpen(true)}
      />

      {/* Tactile AK-45 RF / IR Remote Control Handset */}
      <RFRemoteHandset
        isOpen={isRemoteOpen}
        onClose={() => setIsRemoteOpen(false)}
        ampState={ampState}
        onUpdateAmpState={updateAmpState}
        onSelectEQPreset={selectEQPreset}
      />

      {/* Floating Restore Remote Button (Shown when remote is hidden) */}
      {!isRemoteOpen && (
        <button
          onClick={() => setIsRemoteOpen(true)}
          className="fixed bottom-20 right-4 sm:right-6 z-40 py-2.5 px-4 bg-gradient-to-r from-slate-900 to-[#121620] hover:from-slate-800 hover:to-[#181d28] text-slate-100 border border-cyan-500/60 rounded-full shadow-[0_4px_25px_rgba(0,0,0,0.7)] flex items-center gap-2.5 text-xs font-bold transition-all hover:scale-105 active:scale-95 group cursor-pointer"
          title="Show AK-45 Wireless RF Remote Control"
        >
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] group-hover:animate-ping" />
          <Radio className="w-4 h-4 text-cyan-400" />
          <span>Show RF Remote</span>
        </button>
      )}
    </div>
  );
}
