/**
 * Types and interfaces for Multi-Output Zone Routing and Audio Device Management
 */

import { InputSource } from './amplifier';

export type OutputZoneType = 
  | 'WIRED_SPRING_TERMINAL'  // AK-45 Rear Panel Spring Clips (Left/Right passive speakers)
  | 'RCA_LINE'              // RCA Stereo line out / active subwoofer
  | 'BLUETOOTH'             // Secondary Bluetooth receiver/speaker
  | 'USB_DAC'               // USB-C Hub / External DAC (from user's multiport adapter photo)
  | 'NETWORK_STREAM'        // Network stream / Wi-Fi audio endpoint (from user's router photo)
  | 'HEADPHONES';           // Front 3.5mm monitor jack

export type ChannelRoutingMode = 'STEREO' | 'MONO_SUM' | 'LEFT_ONLY' | 'RIGHT_ONLY';

export interface OutputZone {
  id: string;
  name: string;
  type: OutputZoneType;
  description: string;
  enabled: boolean;
  volume: number; // 0 to 100
  mute: boolean;
  delayMs: number; // 0 to 300 ms for room latency compensation
  source: InputSource | 'MASTER'; // Which audio feed this zone receives
  channelMode: ChannelRoutingMode;
  impedanceOrSpecs: string; // e.g. "4 - 8 Ω (40W + 40W)", "Line Level 2.1V", "A2DP 48kHz"
  hardwarePort: string; // e.g. "Rear Spring Clips [CH1/CH2]", "USB-C Audio Out", "192.168.1.189"
  isHardwareActive: boolean;
  actualDeviceId?: string; // Real browser media device sink ID if available
}

export interface PhysicalPortMap {
  springClips: {
    leftPositive: string;
    leftNegative: string;
    rightPositive: string;
    rightNegative: string;
    connectedWireColor: string;
    status: 'ACTIVE_LOAD' | 'NO_LOAD';
  };
  rcaInputs: {
    leftChannel: 'CONNECTED' | 'DISCONNECTED';
    rightChannel: 'CONNECTED' | 'DISCONNECTED';
    signalLevelDbu: number;
  };
  powerSupply: {
    mode: 'AC_MAINS_110V_240V' | 'DC_12V_5A';
    voltage: number;
    currentAmps: number;
  };
}
