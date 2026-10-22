import React, { useState, useEffect } from 'react';
import { BluetoothDeviceInfo, CommandLog } from '../types/amplifier';
import { bluetoothService } from '../services/bluetoothService';
import { 
  Bluetooth, 
  Wifi, 
  Terminal, 
  RefreshCw, 
  Radio, 
  CheckCircle2, 
  Send, 
  Trash2, 
  ExternalLink,
  Signal,
  Cpu,
  Layers
} from 'lucide-react';

interface BluetoothNetworkViewProps {
  currentDevice: string | null;
  onSelectDevice: (device: BluetoothDeviceInfo) => void;
  networkIp: string;
  networkPort: number;
  onUpdateNetwork: (ip: string, port: number) => void;
}

export const BluetoothNetworkView: React.FC<BluetoothNetworkViewProps> = ({
  currentDevice,
  onSelectDevice,
  networkIp,
  networkPort,
  onUpdateNetwork,
}) => {
  const [devices, setDevices] = useState<BluetoothDeviceInfo[]>([]);
  const [logs, setLogs] = useState<CommandLog[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  const [ipInput, setIpInput] = useState(networkIp);
  const [portInput, setPortInput] = useState(networkPort.toString());
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>('12ms (Nominal)');

  useEffect(() => {
    const unsubDevices = bluetoothService.subscribeDevices((devs) => {
      setDevices(devs);
    });
    const unsubLogs = bluetoothService.subscribeLogs((l) => {
      setLogs(l);
    });
    return () => {
      unsubDevices();
      unsubLogs();
    };
  }, []);

  const handleScan = async () => {
    setIsScanning(true);
    await bluetoothService.scanForDevices();
    setIsScanning(false);
  };

  const handleWebBluetooth = async () => {
    if (bluetoothService.isWebBluetoothAvailable()) {
      try {
        const device = await (navigator as any).bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['generic_access', 'battery_service']
        });
        if (device) {
          bluetoothService.sendCustomCommand(`AT+WEB_BLE_ATTACH=${device.name || 'BT_DEVICE'}`);
        }
      } catch (err: any) {
        bluetoothService.sendCustomCommand(`AT+BLE_NOTICE=DIALOG_CANCELLED`);
      }
    } else {
      alert("Web Bluetooth API is supported in Chrome, Edge, and Android browsers via HTTPS. Simulated hardware transceiver is fully active.");
    }
  };

  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    bluetoothService.sendCustomCommand(commandInput.trim());
    setCommandInput('');
  };

  const handlePing = () => {
    setIsTestingPing(true);
    bluetoothService.sendCustomCommand(`AT+PING=${ipInput}:${portInput}`);
    setTimeout(() => {
      setIsTestingPing(false);
      setPingResult(`${Math.floor(Math.random() * 8 + 8)}ms (Loss: 0%)`);
    }, 400);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#121620] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">
              Bluetooth & Network Remote Control Hub
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            GATT wireless BLE telemetry, Ethernet multi-room bridge discovery, and live packet terminal
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Mesh...' : 'Scan Devices'}</span>
          </button>

          <button
            onClick={handleWebBluetooth}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
            title="Scan for real Bluetooth hardware via Web Bluetooth API"
          >
            <Bluetooth className="w-3.5 h-3.5 text-blue-400" />
            <span>Pair Physical BLE</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Discovered Devices & Network IP Bridge */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Discovered Bluetooth Amplifiers */}
          <div className="bg-[#121620] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Bluetooth className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-200">
                  Discovered AK-45 Amplifiers & Audio Nodes
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {devices.length} Devices Online
              </span>
            </div>

            <div className="space-y-3">
              {devices.map((device) => {
                const isSelected = device.connected;

                return (
                  <div
                    key={device.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-900/90 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate mr-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950 shadow-sm'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {device.type === 'AK45_AMPLIFIER' ? 'AK' : 'RX'}
                      </div>

                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-100 truncate">
                            {device.name}
                          </span>
                          {device.codec && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                              {device.codec}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mt-0.5">
                          <span>{device.address}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-emerald-400">
                            <Signal className="w-3 h-3" />
                            {device.rssi} dBm
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected ? (
                        <button
                          onClick={() => bluetoothService.disconnectDevice(device.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/20 transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Connected</span>
                        </button>
                      ) : (
                        <button
                          onClick={async () => {
                            await bluetoothService.connectDevice(device.id);
                            onSelectDevice(device);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Network IP Gateway / Router Bridge (Referencing Photo 4!) */}
          <div className="bg-[#121620] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-200">
                  Local Network / Ethernet Gateway Bridge
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Photo 4 Router Hub
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Connect to an Ethernet or Wi-Fi network streaming bridge (e.g. Raspberry Pi running Snapcast, Wiim, or Hi-Fi streamer) wired directly into the AK-45's RCA auxiliary inputs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">
              <div className="sm:col-span-7">
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Streamer IP Address
                </label>
                <input
                  type="text"
                  value={ipInput}
                  onChange={(e) => setIpInput(e.target.value)}
                  placeholder="192.168.1.145"
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Port
                </label>
                <input
                  type="text"
                  value={portInput}
                  onChange={(e) => setPortInput(e.target.value)}
                  placeholder="8080"
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="sm:col-span-2 flex items-end">
                <button
                  onClick={handlePing}
                  disabled={isTestingPing}
                  className="w-full py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
                >
                  {isTestingPing ? '...' : 'Ping'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400">SUBNET LATENCY:</span>
              <span className="text-emerald-400 font-bold">{pingResult}</span>
            </div>
          </div>

        </div>

        {/* Right Column: Live Protocol Packet Monitor & AT Command Console */}
        <div className="lg:col-span-5 bg-[#121620] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-200">
                  Live AT / BLE Command Terminal
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                <span>115200 BAUD</span>
              </div>
            </div>

            {/* Packet Log Feed */}
            <div className="bg-[#070a10] border border-slate-800 rounded-lg p-3 font-mono text-[11px] h-84 overflow-y-auto space-y-2 select-text">
              {logs.map((log) => (
                <div key={log.id} className="leading-snug">
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="text-slate-500">{log.timestamp}</span>
                    <span
                      className={`font-bold px-1 rounded ${
                        log.direction === 'TX'
                          ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                      }`}
                    >
                      {log.direction}
                    </span>
                    <span className="text-slate-400">{log.protocol}</span>
                  </div>
                  <div className="text-slate-200 font-semibold mt-0.5 pl-1 border-l-2 border-slate-700">
                    {log.raw}
                  </div>
                  <div className="text-[10px] text-slate-500 pl-1">
                    ↳ {log.decoded}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Command Input */}
          <form onSubmit={handleSendCommand} className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="e.g. AT+VOL=85 or AT+QUERY"
              className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1 shadow-sm"
            >
              <Send className="w-3 h-3" />
              <span>Send</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
