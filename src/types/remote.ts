/**
 * Types and interfaces for the AK-45 RF/IR Remote Control & Live Demo Engine
 */

export type RFCarrierFrequency = '433.92 MHz' | '315.00 MHz' | '38.0 kHz IR';

export interface RFTransmissionEvent {
  buttonName: string;
  hexCode: string;
  carrier: RFCarrierFrequency;
  timestamp: number;
}

export interface DemoStep {
  id: string;
  title: string;
  description: string;
  action: () => void;
  durationMs: number;
  highlightTarget?: 'deck' | 'knob' | 'eq' | 'effects' | 'zones' | 'remote';
}
