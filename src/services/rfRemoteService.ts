/**
 * RF / IR Wireless Remote Control Service for AK-45 Hi-Fi Amplifier
 * Simulates 433.92MHz / 315MHz ASK and 38kHz NEC Infrared packet transmission
 * with acoustic button click feedback and hardware command execution.
 */

import { RFCarrierFrequency, RFTransmissionEvent } from '../types/remote';
import { bluetoothService } from './bluetoothService';

type RFListener = (event: RFTransmissionEvent | null) => void;

class RFRemoteService {
  private listeners: RFListener[] = [];
  private lastEvent: RFTransmissionEvent | null = null;
  private audioCtx: AudioContext | null = null;

  // NEC IR / RF Command Code Table for AK-45 Remote
  public static readonly NEC_CODES: Record<string, string> = {
    POWER: '0x00FFA25D',
    MODE: '0x00FF629D',
    MUTE: '0x00FFE21D',
    PLAY_PAUSE: '0x00FF22DD',
    PREV: '0x00FF02FD',
    NEXT: '0x00FFC23D',
    EQ: '0x00FF906F',
    VOL_UP: '0x00FF807F',
    VOL_DOWN: '0x00FF10EF',
    LOUD: '0x00FFB04F',
    NUM_0: '0x00FF6897',
    NUM_1: '0x00FF30CF',
    NUM_2: '0x00FF18E7',
    NUM_3: '0x00FF7A85',
    NUM_4: '0x00FF10EF',
    NUM_5: '0x00FF38C7',
    NUM_6: '0x00FF5AA5',
    NUM_7: '0x00FF42BD',
    NUM_8: '0x00FF4AB5',
    NUM_9: '0x00FF52AD',
    REPEAT: '0x00FF9867',
    BASS_UP: '0x00FFA857',
    BASS_DOWN: '0x00FFB847',
    ECHO_UP: '0x00FFC837',
    ECHO_DOWN: '0x00FFD827',
  };

  public subscribe(listener: RFListener) {
    this.listeners.push(listener);
    listener(this.lastEvent);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public transmit(buttonName: string, carrier: RFCarrierFrequency = '433.92 MHz') {
    const hex = RFRemoteService.NEC_CODES[buttonName] || '0x00FFFFFF';
    const event: RFTransmissionEvent = {
      buttonName,
      hexCode: hex,
      carrier,
      timestamp: Date.now(),
    };

    this.lastEvent = event;
    this.playKeyClickTone();

    // Log RF packet in serial console
    bluetoothService.sendCustomCommand(`[RF_${carrier.replace(' ', '')}] NEC:${hex} [${buttonName}]`);

    this.notify();

    // Automatically clear transmitting active state after 350ms
    setTimeout(() => {
      if (this.lastEvent && Date.now() - this.lastEvent.timestamp >= 340) {
        this.lastEvent = null;
        this.notify();
      }
    }, 350);
  }

  private notify() {
    this.listeners.forEach(l => l(this.lastEvent));
  }

  // Soft tactile acoustic beep click
  private playKeyClickTone() {
    try {
      if (!this.audioCtx) {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        this.audioCtx = new AudioCtxClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, this.audioCtx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.04);
    } catch {
      // ignore
    }
  }
}

export const rfRemoteService = new RFRemoteService();
