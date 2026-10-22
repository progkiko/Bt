/**
 * USB-A Audio Output Encoding & Protocol Types
 */

export type USBEncodingFormat = 
  | 'PCM_16BIT'      // Standard Redbook CD / UAC1 16-bit Integer (1411 kbps)
  | 'PCM_24BIT'      // Studio High-Res 24-bit Integer (4608 kbps)
  | 'PCM_32BIT_FLOAT'// 32-bit Floating Point Broadcast Master
  | 'FLAC_LOSSLESS'  // Lossless Compression Bitstream
  | 'MP3_320KBPS'    // High-Bitrate MPEG-1 Audio Layer III
  | 'AAC_256KBPS'    // Advanced Audio Coding for USB Stream
  | 'DSD_DOP';       // Direct Stream Digital over PCM (DSD64/128)

export type USBAudioClass = 'UAC1_LEGACY' | 'UAC2_HIGH_RES';

export type USBSampleRate = 44100 | 48000 | 88200 | 96000 | 192000;

export type USBTransferMode = 'ASYNC_ISOCHRONOUS' | 'ADAPTIVE' | 'SYNCHRONOUS';

export interface USBAudioPortConfig {
  id: string;
  name: string;
  hardwareLocation: string; // e.g. "USB-C Multiport Hub - Port A1 (Photo 3)"
  connectedDevice: string; // e.g. "Realtek Hi-Res 24-Bit USB Audio DAC"
  audioClass: USBAudioClass;
  encodingFormat: USBEncodingFormat;
  sampleRate: USBSampleRate;
  bitDepth: 16 | 24 | 32;
  channels: 2; // Stereo
  transferMode: USBTransferMode;
  bufferSizeSamples: 64 | 128 | 256 | 512;
  bitrateKbps: number;
  ditherEnabled: boolean; // TPDF Dither for 24-bit to 16-bit truncation
  clockSource: 'INTERNAL_CRYSTAL' | 'USB_SOF_SYNC' | 'DAC_WORD_CLOCK';
  isStreamActive: boolean;
  volume: number; // 0-100%
  mute: boolean;
}

export interface USBAudioEncoderTelemetry {
  isEncoding: boolean;
  isRecording: boolean;
  recordingSeconds: number;
  packetsSent: number;
  droppedFrames: number;
  bufferUnderruns: number;
  jitterMs: number;
  measuredLatencyMs: number;
  totalBytesEncoded: number;
  encodedFileUrl: string | null;
  recordedFileName: string | null;
}
