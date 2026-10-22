/**
 * Types and interfaces for the AK-45 Hi-Fi Amplifier Control System
 */

export type InputSource = 'BLUETOOTH' | 'AUX' | 'USB' | 'SD' | 'FM';

export type EQMode = 
  | 'FLAT' 
  | 'ROCK' 
  | 'POP' 
  | 'JAZZ' 
  | 'VOCAL' 
  | 'BASS_BOOST' 
  | 'ELECTRONIC' 
  | 'ACOUSTIC'
  | 'CUSTOM';

export interface EQBand {
  frequency: number; // in Hz
  label: string;
  gain: number; // in dB (-12 to +12)
}

export interface AudioTrackInfo {
  id: string;
  title: string;
  artist: string;
  duration: number; // seconds
  currentTime: number;
  isPlaying: boolean;
  type: 'synth' | 'uploaded' | 'stream' | 'tone';
}

export type ConnectionStatus = 'DISCONNECTED' | 'SCANNING' | 'CONNECTING' | 'CONNECTED';

export interface AudioEffectsState {
  echo: number; // 0 to 100
  echoDelayMs: number; // 50 to 500 ms
  echoFeedback: number; // 0 to 85%
  reverbDepth: number; // 0 to 100%
  reverbRoomType: 'ROOM' | 'HALL' | 'STAGE' | 'CHAMBER';
  acHumFilter: boolean; // 50Hz/60Hz AC mains hum notch filter
  acHumFrequency: 50 | 60; // 50Hz Europe/Asia or 60Hz Americas
  tubeWarmth: number; // 0 to 100% (harmonic saturation)
  stereoWidth: number; // 0% (Mono) to 200% (Ultra 3D Spatial)
  vocalEnhance: boolean; // Karaoke vocal presence boost
  antiFeedback: boolean; // Mic acoustic feedback eliminator
}

export interface AmplifierState {
  power: boolean;
  masterVolume: number; // 0 to 100
  mute: boolean;
  inputSource: InputSource;
  bass: number; // -12 to +12 dB
  treble: number; // -12 to +12 dB
  balance: number; // -10 (Left) to +10 (Right)
  mic1Volume: number; // 0 to 100
  mic2Volume: number; // 0 to 100
  echo: number; // 0 to 100
  loudness: boolean;
  fmFrequency: number; // MHz (e.g. 101.5)
  eqMode: EQMode;
  eqBands: EQBand[];
  spatializer3D: boolean;
  effects: AudioEffectsState;
  connectedDevice: string | null;
  connectionType: 'BLUETOOTH' | 'NETWORK' | 'SIMULATOR';
  connectionStatus: ConnectionStatus;
  signalStrength: number; // -100 to -30 dBm
  networkIp: string;
  networkPort: number;
}

export interface BluetoothDeviceInfo {
  id: string;
  name: string;
  address: string;
  rssi: number;
  type: 'AK45_AMPLIFIER' | 'BLUETOOTH_SPEAKER' | 'HEADPHONES' | 'AUDIO_RECEIVER' | 'GENERIC';
  paired: boolean;
  connected: boolean;
  batteryLevel?: number;
  codec?: 'SBC' | 'AAC' | 'aptX' | 'LDAC';
}

export interface CommandLog {
  id: string;
  timestamp: string;
  direction: 'TX' | 'RX';
  protocol: 'BLE_GATT' | 'TCP_IP' | 'AT_SERIAL';
  raw: string;
  decoded: string;
}
