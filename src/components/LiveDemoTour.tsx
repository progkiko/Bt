import React, { useState, useEffect, useRef } from 'react';
import { AmplifierState, EQMode } from '../types/amplifier';
import { audioEngine } from '../services/audioEngine';
import { rfRemoteService } from '../services/rfRemoteService';
import { ActiveTab } from './TopNav';
import { 
  Sparkles, 
  Play, 
  Pause, 
  Square, 
  SkipForward, 
  Radio, 
  CheckCircle2, 
  Volume2, 
  Sliders, 
  Zap, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface LiveDemoTourProps {
  isRunning: boolean;
  onStop: () => void;
  ampState: AmplifierState;
  onUpdateAmpState: (updates: Partial<AmplifierState>) => void;
  onSelectEQPreset: (mode: EQMode) => void;
  onSwitchTab: (tab: ActiveTab) => void;
  onOpenRemote: () => void;
}

interface DemoStepConfig {
  id: number;
  tab: ActiveTab;
  title: string;
  subtitle: string;
  action: () => void;
  durationSeconds: number;
}

export const LiveDemoTour: React.FC<LiveDemoTourProps> = ({
  isRunning,
  onStop,
  ampState,
  onUpdateAmpState,
  onSelectEQPreset,
  onSwitchTab,
  onOpenRemote,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(6);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps: DemoStepConfig[] = [
    {
      id: 1,
      tab: 'deck',
      title: 'Power-On & Blue LED Display Activation',
      subtitle: 'Transmitting RF 433MHz Power packet. Blue LED matrix and volume halo illuminated.',
      action: () => {
        rfRemoteService.transmit('POWER');
        onUpdateAmpState({ power: true, mute: false, inputSource: 'BLUETOOTH', masterVolume: 70 });
        audioEngine.startDemoPlayback('groove');
        onOpenRemote();
      },
      durationSeconds: 5,
    },
    {
      id: 2,
      tab: 'deck',
      title: 'RF Remote Volume Stepping & Potentiometer Sync',
      subtitle: 'Stepping master volume up to 85% via simulated NEC RF frames. Observe halo & VU meter deflection.',
      action: () => {
        rfRemoteService.transmit('VOL_UP');
        onUpdateAmpState({ masterVolume: 82 });
      },
      durationSeconds: 6,
    },
    {
      id: 3,
      tab: 'equalizer',
      title: '10-Band Graphic Equalizer: AK-45 Bass Punch',
      subtitle: 'Sculpting low-end frequencies (+6dB at 32Hz, +7dB at 64Hz) with real biquad filter DSP.',
      action: () => {
        onSwitchTab('equalizer');
        rfRemoteService.transmit('EQ');
        onSelectEQPreset('BASS_BOOST');
        audioEngine.startDemoPlayback('bass');
      },
      durationSeconds: 7,
    },
    {
      id: 4,
      tab: 'effects',
      title: 'AC Mains Hum Suppressor & Acoustic Echo',
      subtitle: 'Engaging steep 60Hz notch filter to remove transformer hum, plus karaoke acoustic chamber.',
      action: () => {
        onSwitchTab('effects');
        onUpdateAmpState({
          effects: {
            ...ampState.effects,
            acHumFilter: true,
            acHumFrequency: 60,
            echo: 35,
            echoDelayMs: 240,
            echoFeedback: 45,
            tubeWarmth: 40,
          },
          echo: 35,
        });
        audioEngine.startDemoPlayback('groove');
      },
      durationSeconds: 7,
    },
    {
      id: 5,
      tab: 'usb',
      title: 'USB-A Audio Output 24-Bit / 96kHz Encoding',
      subtitle: 'Routing master audio to USB-A hub DAC with 4,608 kbps UAC2 isochronous bitstream.',
      action: () => {
        onSwitchTab('usb');
      },
      durationSeconds: 6,
    },
    {
      id: 6,
      tab: 'multioutput',
      title: 'Multi-Output Zone Matrix & Whole-House Sync',
      subtitle: 'Party Mode active: simultaneous synchronized routing across AK-45 spring clips, USB DAC, and LAN.',
      action: () => {
        onSwitchTab('multioutput');
      },
      durationSeconds: 8,
    },
  ];

  // Execute step action on step change
  useEffect(() => {
    if (!isRunning) return;
    const step = steps[currentStep];
    if (step) {
      step.action();
      setSecondsRemaining(step.durationSeconds);
    }
  }, [currentStep, isRunning]);

  // Countdown timer
  useEffect(() => {
    if (!isRunning || isPaused) return;

    timerRef.current = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Advance to next step
          if (currentStep < steps.length - 1) {
            setCurrentStep((c) => c + 1);
            return steps[currentStep + 1]?.durationSeconds || 6;
          } else {
            // Loop back to step 1
            setCurrentStep(0);
            return steps[0].durationSeconds;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isPaused, currentStep]);

  if (!isRunning) return null;

  const activeStep = steps[currentStep] || steps[0];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(c => c + 1);
    } else {
      setCurrentStep(0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(c => c - 1);
    }
  };

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4 animate-in slide-in-from-top-4 duration-200">
      <div className="bg-[#121620]/95 backdrop-blur-md border-2 border-cyan-500/70 rounded-2xl p-4 shadow-[0_10px_35px_rgba(6,182,212,0.25)] flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Step Indicator & Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 font-bold flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.6)]">
            <Sparkles className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                LIVE DEMO · STEP {currentStep + 1}/{steps.length}
              </span>
              <span className="text-xs font-mono text-slate-400">
                ({secondsRemaining}s)
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-100 tracking-tight mt-0.5">
              {activeStep.title}
            </h3>
            <p className="text-xs text-slate-300 line-clamp-1">
              {activeStep.subtitle}
            </p>
          </div>
        </div>

        {/* Tour Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1 transition-colors"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <button
            onClick={handleNext}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1 transition-colors"
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onStop}
            className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-xs font-bold border border-rose-500/50 flex items-center gap-1 transition-colors"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>Exit Demo</span>
          </button>
        </div>

      </div>
    </div>
  );
};
