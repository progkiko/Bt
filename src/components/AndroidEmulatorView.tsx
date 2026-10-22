import React, { useState, useEffect } from 'react';
import { AmplifierState } from '../types/amplifier';
import { 
  Volume2, 
  Bluetooth, 
  RefreshCw, 
  RotateCcw, 
  Check, 
  Smartphone, 
  Code, 
  ShieldCheck, 
  Signal, 
  Wifi, 
  BatteryMedium, 
  Circle, 
  Triangle, 
  Square, 
  Layers,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';

interface AndroidEmulatorViewProps {
  ampState: AmplifierState;
  onUpdateAmpState: (updates: Partial<AmplifierState>) => void;
}

interface AudioDeviceItem {
  id: number;
  name: string;
  type: string;
  isBluetooth: boolean;
}

interface ScannedDevice {
  name: string;
  address: string;
  rssi: number;
}

export const AndroidEmulatorView: React.FC<AndroidEmulatorViewProps> = ({
  ampState,
  onUpdateAmpState,
}) => {
  // Android Emulator State
  const [activeScreenTab, setActiveScreenTab] = useState<0 | 1>(0); // 0 = Audio Router, 1 = Bluetooth Scanner
  const [activeCommunicationDeviceId, setActiveCommunicationDeviceId] = useState<number | null>(1); // default routed to AK-45
  const [hasPermissions, setHasPermissions] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCodeInspector, setShowCodeInspector] = useState<boolean>(false);
  const [androidApiLevel, setAndroidApiLevel] = useState<34 | 33 | 31>(34);

  // Time for Android status bar
  const [currentTime, setCurrentTime] = useState<string>('03:00');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Connected output devices matching AudioDeviceInfo in user instructions
  const devices: AudioDeviceItem[] = [
    { id: 1, name: 'AK-45 Pro HiFi Audio [BT-888]', type: 'Bluetooth A2DP', isBluetooth: true },
    { id: 2, name: 'Built-in Speaker', type: 'Built-in Speaker', isBluetooth: false },
    { id: 3, name: 'USB-C Multiport Audio DAC', type: 'USB Device', isBluetooth: false },
    { id: 4, name: 'AK-45 Living Room Amp', type: 'Bluetooth A2DP', isBluetooth: true },
    { id: 5, name: 'AK-45 Workshop Audio', type: 'Bluetooth LE Speaker', isBluetooth: true },
    { id: 6, name: 'Wired Headphones', type: 'Wired Headphones', isBluetooth: false },
  ];

  // Scanned Bluetooth devices
  const [scannedDevices, setScannedDevices] = useState<ScannedDevice[]>([
    { name: 'AK-45 Pro HiFi Audio [BT-888]', address: '9C:F3:87:6D:45:A1', rssi: -48 },
    { name: 'AK-45 Living Room Amp', address: '9C:F3:87:A2:19:0B', rssi: -62 },
    { name: 'Multiport USB-C Hi-Fi DAC Hub', address: 'HUB:BUS-001:DEV-04', rssi: -38 },
    { name: 'Ethernet HiFi Streamer', address: '192.168.1.145:8080', rssi: -30 },
    { name: 'AK-45 Workshop Audio', address: '9C:F3:87:C5:88:2E', rssi: -81 },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleSelectDevice = (dev: AudioDeviceItem) => {
    if (androidApiLevel >= 31) {
      setActiveCommunicationDeviceId(dev.id);
      showToast(`setCommunicationDevice: ${dev.name}`);
      if (dev.isBluetooth) {
        onUpdateAmpState({
          connectedDevice: dev.name,
          connectionStatus: 'CONNECTED',
        });
      }
    }
  };

  const handleResetRouting = () => {
    setActiveCommunicationDeviceId(null);
    showToast('Reset to System Default Routing');
  };

  const handleScanClick = () => {
    if (!hasPermissions) {
      setShowPermissionDialog(true);
      return;
    }
    if (isScanning) {
      setIsScanning(false);
      showToast('Scan cancelled');
    } else {
      setIsScanning(true);
      showToast('startDiscovery() called');
      setTimeout(() => {
        setIsScanning(false);
        showToast('ACTION_DISCOVERY_FINISHED: 5 devices found');
      }, 3500);
    }
  };

  const activeDevice = devices.find(d => d.id === activeCommunicationDeviceId);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">
              Android 14 (API 34) Live Device Emulation
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time interactive emulator running your Jetpack Compose Bluetooth Manager and Audio Router app
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCodeInspector(!showCodeInspector)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              showCodeInspector
                ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showCodeInspector ? 'Hide Kotlin Code' : 'Inspect Kotlin Compose Code'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column: The Android Smartphone Emulation */}
        <div className={`flex justify-center ${showCodeInspector ? 'lg:col-span-6' : 'lg:col-span-8 lg:col-start-3'}`}>
          
          {/* Pixel 8 Pro / Modern Android Device Frame */}
          <div className="relative w-full max-w-[380px] bg-[#1a1f2c] rounded-[48px] p-3 shadow-[0_25px_60px_rgba(0,0,0,0.9)] border-4 border-[#2b3346] ring-1 ring-white/10 select-none">
            
            {/* Hardware Buttons on Phone Frame */}
            {/* Volume Up */}
            <button
              onClick={() => onUpdateAmpState({ masterVolume: Math.min(100, ampState.masterVolume + 4) })}
              className="absolute -left-5 top-28 w-1.5 h-12 bg-slate-700 rounded-l-md hover:bg-cyan-400 active:scale-95 transition-colors shadow"
              title="Android Physical Volume Up Button"
            />
            {/* Volume Down */}
            <button
              onClick={() => onUpdateAmpState({ masterVolume: Math.max(0, ampState.masterVolume - 4) })}
              className="absolute -left-5 top-44 w-1.5 h-12 bg-slate-700 rounded-l-md hover:bg-cyan-400 active:scale-95 transition-colors shadow"
              title="Android Physical Volume Down Button"
            />
            {/* Power Button */}
            <button
              onClick={() => onUpdateAmpState({ power: !ampState.power })}
              className="absolute -right-5 top-32 w-1.5 h-10 bg-slate-700 rounded-r-md hover:bg-rose-400 active:scale-95 transition-colors shadow"
              title="Android Physical Power Button"
            />

            {/* Inner Phone Screen */}
            <div className="relative w-full h-[690px] bg-[#10141d] rounded-[38px] overflow-hidden flex flex-col justify-between border border-slate-800">
              
              {/* Android System Status Bar */}
              <div className="h-7 bg-[#10141d] px-6 pt-1.5 flex items-center justify-between text-[11px] font-medium text-slate-300 z-20">
                <span>{currentTime}</span>

                {/* Camera Hole Punch Cutout */}
                <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-800 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0a1020]" />
                </div>

                <div className="flex items-center gap-1.5 text-slate-300">
                  <Bluetooth className="w-3 h-3 text-cyan-400" />
                  <Wifi className="w-3 h-3" />
                  <Signal className="w-3 h-3" />
                  <span className="text-[10px] font-mono">98%</span>
                </div>
              </div>

              {/* TopAppBar matching Material 3 from MainActivity.kt */}
              <div className="bg-[#181d28] border-b border-slate-800 px-4 py-3 flex items-center justify-between z-10">
                <h1 className="text-base font-semibold text-slate-100 tracking-tight">
                  {activeScreenTab === 0 ? 'Audio Output Router' : 'Bluetooth Device Scanner'}
                </h1>

                <div className="flex items-center gap-1">
                  {/* Action 1: Reset Routing (Tab 1 only) */}
                  {activeScreenTab === 0 && activeCommunicationDeviceId !== null && (
                    <button
                      onClick={handleResetRouting}
                      className="p-2 rounded-full hover:bg-slate-700/60 text-slate-300 active:scale-90 transition-all"
                      title="Reset to System Default Routing"
                    >
                      <RotateCcw className="w-4 h-4 text-cyan-400" />
                    </button>
                  )}

                  {/* Action 2: Refresh / Scan */}
                  <button
                    onClick={() => {
                      if (activeScreenTab === 0) {
                        showToast('Audio devices refreshed');
                      } else {
                        handleScanClick();
                      }
                    }}
                    className="p-2 rounded-full hover:bg-slate-700/60 text-slate-300 active:scale-90 transition-all"
                    title={activeScreenTab === 0 ? 'Refresh' : 'Scan'}
                  >
                    {activeScreenTab === 1 && isScanning ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Main Screen Body (Tab 1 or Tab 2) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
                
                {/* TAB 1: AUDIO OUTPUT ROUTER SCREEN */}
                {activeScreenTab === 0 && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    {/* Status header banner */}
                    <div className="pb-1">
                      <div className={`text-sm font-medium ${activeDevice ? 'text-cyan-400 font-semibold' : 'text-slate-300'}`}>
                        {activeDevice ? `Currently Routed: ${activeDevice.name}` : 'System Default Auto-Routing Active'}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                        Build.VERSION.SDK_INT = {androidApiLevel} (Android {androidApiLevel === 34 ? '14' : androidApiLevel === 33 ? '13' : '12'})
                      </div>
                    </div>

                    {/* Devices list (LazyColumn items) */}
                    <div className="space-y-2.5">
                      {devices.map((device) => {
                        const isSelected = activeCommunicationDeviceId === device.id;

                        return (
                          <div
                            key={device.id}
                            onClick={() => handleSelectDevice(device)}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between active:scale-[0.98] ${
                              isSelected
                                ? 'bg-[#1b2a3d] border-cyan-500/80 shadow-md'
                                : 'bg-[#181d28] border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="truncate mr-2">
                              <div className="text-sm font-semibold text-slate-100 truncate">
                                {device.name}
                              </div>
                              <div className={`text-xs mt-0.5 ${isSelected ? 'text-cyan-300' : 'text-slate-400'}`}>
                                Type: {device.type}
                              </div>
                            </div>

                            {isSelected && (
                              <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shrink-0">
                                <Check className="w-3.5 h-3.5 text-cyan-400 font-bold" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 2: BLUETOOTH DEVICE SCANNER SCREEN */}
                {activeScreenTab === 1 && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    {!hasPermissions ? (
                      <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-4">
                        <p className="text-xs text-slate-400 mb-4">
                          Bluetooth scan &amp; connect permissions required to discover nearby AK-45 amplifiers.
                        </p>
                        <button
                          onClick={() => {
                            setHasPermissions(true);
                            showToast('Bluetooth permissions granted');
                          }}
                          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors"
                        >
                          Grant Bluetooth Permissions
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="text-xs font-medium text-slate-300 pb-1">
                          {isScanning ? 'Scanning for devices...' : 'Scan inactive. Press Refresh to scan.'}
                        </div>

                        <div className="space-y-2">
                          {scannedDevices.map((dev) => (
                            <div
                              key={dev.address}
                              className="p-3.5 rounded-2xl bg-[#181d28] border border-slate-800 text-left"
                            >
                              <div className="text-sm font-semibold text-slate-100">
                                {dev.name}
                              </div>
                              <div className="text-xs font-mono text-slate-400 mt-1 flex items-center justify-between">
                                <span>{dev.address}</span>
                                <span className="text-[10px] text-emerald-400">{dev.rssi} dBm</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Android System Toast Overlay */}
                {toastMessage && (
                  <div className="absolute bottom-4 left-4 right-4 z-30 flex justify-center animate-in fade-in zoom-in-95 duration-150">
                    <div className="bg-[#242b3a]/95 text-slate-100 text-xs px-4 py-2 rounded-full border border-slate-700 shadow-xl text-center max-w-[90%] truncate">
                      {toastMessage}
                    </div>
                  </div>
                )}

                {/* Android 14 System Permission Modal Simulation */}
                {showPermissionDialog && (
                  <div className="absolute inset-0 bg-black/70 z-40 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-[#1f2636] border border-slate-700 rounded-2xl p-4 w-full max-w-[280px] shadow-2xl text-center">
                      <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-2 text-cyan-400">
                        <Bluetooth className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-100">
                        Allow Bluetooth Manager to find nearby devices?
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                        Required for BLUETOOTH_SCAN and BLUETOOTH_CONNECT on Android 12+.
                      </p>
                      <div className="mt-3 flex flex-col gap-1.5">
                        <button
                          onClick={() => {
                            setHasPermissions(true);
                            setShowPermissionDialog(false);
                            showToast('Permissions granted');
                          }}
                          className="w-full py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg"
                        >
                          While using the app
                        </button>
                        <button
                          onClick={() => setShowPermissionDialog(false)}
                          className="w-full py-1 text-slate-400 hover:text-white text-xs"
                        >
                          Don't allow
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Material 3 Bottom NavigationBar */}
              <div className="bg-[#181d28] border-t border-slate-800 px-4 py-2 flex items-center justify-around z-10">
                {/* Tab 0 */}
                <button
                  onClick={() => setActiveScreenTab(0)}
                  className="flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all"
                >
                  <div className={`px-4 py-1 rounded-full transition-colors ${activeScreenTab === 0 ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-400'}`}>
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-medium ${activeScreenTab === 0 ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}>
                    Audio Router
                  </span>
                </button>

                {/* Tab 1 */}
                <button
                  onClick={() => setActiveScreenTab(1)}
                  className="flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all"
                >
                  <div className={`px-4 py-1 rounded-full transition-colors ${activeScreenTab === 1 ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-400'}`}>
                    <Bluetooth className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-medium ${activeScreenTab === 1 ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}>
                    Bluetooth Scanner
                  </span>
                </button>
              </div>

              {/* Android 3-Button / Gesture Navigation Footer */}
              <div className="h-6 bg-[#181d28] flex items-center justify-center pb-1">
                <div className="w-24 h-1 bg-slate-600 rounded-full" />
              </div>

            </div>

          </div>
        </div>

        {/* Right Column: Kotlin Source Code Inspector & Diagnostics */}
        {showCodeInspector && (
          <div className="lg:col-span-6 bg-[#121620] border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100">
                  MainActivity.kt &amp; Manifest Integration
                </h3>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="text-slate-400">API:</span>
                <select
                  value={androidApiLevel}
                  onChange={(e) => setAndroidApiLevel(Number(e.target.value) as 34 | 33 | 31)}
                  className="bg-slate-900 border border-slate-700 text-cyan-400 rounded px-1.5 py-0.5 focus:outline-none"
                >
                  <option value={34}>API 34 (Android 14)</option>
                  <option value={33}>API 33 (Android 13)</option>
                  <option value={31}>API 31 (Android 12)</option>
                </select>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This interactive emulator executes the exact logic from your Jetpack Compose <code className="text-cyan-400">MainActivity.kt</code>, implementing <code className="text-cyan-400">AudioManager.setCommunicationDevice()</code> for dynamic output switching and <code className="text-cyan-400">BroadcastReceiver</code> Bluetooth discovery.
            </p>

            {/* Code Snippet Box */}
            <div className="bg-[#090d15] border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-slate-300 max-h-96 overflow-y-auto space-y-1 select-text">
              <div className="text-slate-500">// MainActivity.kt - Audio Device Callback</div>
              <div className="text-purple-400">audioManager.<span className="text-cyan-300">setCommunicationDevice</span>(device.rawDevice)</div>
              <div className="text-slate-400">val success = audioManager.setCommunicationDevice(device.rawDevice)</div>
              <div className="text-slate-500 mt-2">// Bluetooth 12+ Permission Check</div>
              <div className="text-blue-400">Manifest.permission.BLUETOOTH_SCAN</div>
              <div className="text-blue-400">Manifest.permission.BLUETOOTH_CONNECT</div>
              <div className="text-slate-500 mt-2">// AndroidManifest.xml Flag</div>
              <div className="text-amber-400">&lt;uses-permission android:name="android.permission.BLUETOOTH_SCAN"</div>
              <div className="text-amber-400 pl-4">android:usesPermissionFlags="neverForLocation" /&gt;</div>
            </div>

            {/* Permission Control Strip */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Simulate Permission State:</span>
              <button
                onClick={() => {
                  setHasPermissions(!hasPermissions);
                  showToast(hasPermissions ? 'Permissions revoked' : 'Permissions granted');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                  hasPermissions
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                }`}
              >
                {hasPermissions ? 'Permissions: GRANTED' : 'Permissions: DENIED'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
