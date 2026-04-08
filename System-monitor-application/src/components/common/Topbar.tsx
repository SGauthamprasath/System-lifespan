// Topbar.tsx - no declare global needed, electron.d.ts already covers it

import { useEffect, useState } from 'react';
import { Minus, Square, X } from 'lucide-react';

// WebkitAppRegion is an Electron-specific CSS property React doesn't know about.
// We define a small helper type just for these two style objects.
type ElectronStyle = React.CSSProperties & { WebkitAppRegion: 'drag' | 'no-drag' };

export function Topbar() {
  const [time, setTime] = useState(new Date());
  const [uptimeStr, setUptimeStr] = useState('00:00:00');

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setTime(new Date());
      const diff = Math.floor((Date.now() - startTime) / 1000);
      const h = String(Math.floor(diff / 3600)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
      const s = String(diff % 60).padStart(2, '0');
      setUptimeStr(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleWindowControl = (action: 'minimize' | 'maximize' | 'close') => {
    if (window.electron) {
      window.electron.windowControls[action]();
    }
  };

  const dragStyle:   ElectronStyle = { WebkitAppRegion: 'drag' };
  const noDragStyle: ElectronStyle = { WebkitAppRegion: 'no-drag' };

  return (
    <header
      className="absolute top-0 left-0 right-0 h-14 bg-kronos-card/50 backdrop-blur-md border-b border-b-kronos-primary/20 flex items-center justify-between px-6 z-20"
      style={dragStyle}
    >
      {/* Brand */}
      <div className="flex items-center gap-4">
        <div className="text-kronos-primary font-display font-bold text-2xl tracking-widest drop-shadow-[0_0_8px_rgba(0,255,209,0.5)]">
          KRONOS
        </div>
        <div className="text-gray-500 text-xs tracking-wider uppercase mt-1 hidden sm:block">
          Always watching. Always ahead.
        </div>
      </div>

      {/* Center/Right Items */}
      <div className="flex items-center gap-8 font-mono text-sm">
        <div className="flex flex-col text-right">
          <span className="text-gray-500 text-[10px] uppercase">Sys Uptime</span>
          <span className="text-kronos-secondaryLight">{uptimeStr}</span>
        </div>

        <div className="text-kronos-primary text-xl drop-shadow-[0_0_5px_rgba(0,255,209,0.4)]">
          {time.toLocaleTimeString([], { hour12: false })}
        </div>

        <div
          className="flex items-center gap-4 ml-4 text-gray-500"
          style={noDragStyle}
        >
          <button
            onClick={() => handleWindowControl('minimize')}
            className="hover:text-kronos-primary transition-colors hover:shadow-[0_0_5px_rgba(0,255,209,0.5)]"
          >
            <Minus size={16} />
          </button>
          <button
            onClick={() => handleWindowControl('maximize')}
            className="hover:text-kronos-primary transition-colors hover:shadow-[0_0_5px_rgba(0,255,209,0.5)]"
          >
            <Square size={14} />
          </button>
          <button
            onClick={() => handleWindowControl('close')}
            className="hover:text-kronos-critical transition-colors hover:shadow-[0_0_5px_rgba(255,69,96,0.5)]"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}