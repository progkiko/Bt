import React from 'react';
import { Power, HelpCircle, Bluetooth, Radio, Sparkles, EyeOff } from 'lucide-react';

export type ActiveTab = 'deck' | 'equalizer' | 'effects' | 'usb' | 'multioutput' | 'bluetooth' | 'android';

interface TopNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenWiringGuide: () => void;
  isConnected: boolean;
  power: boolean;
  onTogglePower: () => void;
  isRemoteOpen: boolean;
  onToggleRemote: () => void;
  isDemoRunning: boolean;
  onToggleDemo: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenWiringGuide,
  isConnected,
  power,
  onTogglePower,
  isRemoteOpen,
  onToggleRemote,
  isDemoRunning,
  onToggleDemo,
}) => {
  const navLinks: { id: ActiveTab; label: string }[] = [
    { id: 'deck', label: 'Amplifier Deck' },
    { id: 'equalizer', label: 'Graphic Equalizer' },
    { id: 'effects', label: 'AC Effects' },
    { id: 'usb', label: 'USB-A Encoding' },
    { id: 'multioutput', label: 'Multi-Output Matrix' },
    { id: 'bluetooth', label: 'Bluetooth & Network' },
    { id: 'android', label: 'Android Emulation' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0c101a]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <button
            onClick={() => onSelectTab('deck')}
            className="text-base sm:text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
            <span>AK-45 HI-FI CONTROLLER</span>
          </button>
        </div>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-300">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectTab(link.id)}
                className={`whitespace-nowrap shrink-0 py-1 transition-colors relative ${
                  isActive
                    ? 'text-cyan-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_6px_#38bdf8]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary actions (Live Demo, RF Remote, Power) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Live Demo Trigger */}
          <button
            onClick={onToggleDemo}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm ${
              isDemoRunning
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
            }`}
            title="Start automated interactive live working demo"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>{isDemoRunning ? 'Demo Active' : 'Live Working Demo'}</span>
          </button>

          {/* RF Remote Handset Toggle */}
          <button
            onClick={onToggleRemote}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 border ${
              isRemoteOpen
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/80 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
            title={isRemoteOpen ? 'Hide wireless RF Remote' : 'Show wireless RF Remote'}
          >
            {isRemoteOpen ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Hide Remote</span>
              </>
            ) : (
              <>
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Show Remote</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenWiringGuide}
            className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors whitespace-nowrap shrink-0"
            title="Hardware Terminal Wiring Guide"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Wiring</span>
          </button>

          <button
            onClick={onTogglePower}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm ${
              power
                ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-500'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{power ? 'ON' : 'OFF'}</span>
          </button>
        </div>

      </div>

      {/* Mobile Sub-Navigation Bar (for smaller viewports) */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 border-t border-slate-800/80 bg-[#090d16] text-xs">
        {navLinks.map((link) => {
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onSelectTab(link.id)}
              className={`whitespace-nowrap shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
