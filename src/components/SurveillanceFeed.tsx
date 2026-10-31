import React, { useState, useEffect } from 'react';
import { Camera, Radio, ShieldAlert } from 'lucide-react';
import { soundtrack } from '../lib/soundtrack';

const CHANNELS = [
  { id: 'CAM-01', label: 'SERVER ROOM 4B', location: 'EXCHANGE BLDG SUB-3', status: 'ALERT: 5000 SPAM PACKETS/SEC' },
  { id: 'CAM-02', label: 'DOWNLOAD VAULT', location: 'SYSADMIN CACHE DEPOT', status: 'HIGH IOPS: BLOAT BUFFER 12GB' },
  { id: 'CAM-03', label: 'CFO EXECUTIVE STE', location: 'PENTHOUSE 44 - KANE', status: 'UNAUTH TRANSFER IN PROGRESS' },
  { id: 'CAM-04', label: 'INTERROGATION B-1', location: 'INTERNAL AFFAIRS CELL', status: 'CELL SECURE: DECKARD PRESENT' }
];

export const SurveillanceFeed: React.FC = () => {
  const [activeCamIdx, setActiveCamIdx] = useState(0);
  const [timestamp, setTimestamp] = useState('');
  const [staticGlitch, setStaticGlitch] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setTimestamp(
        `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ` +
        `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}.${Math.floor(d.getMilliseconds() / 100)}`
      );
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const switchCam = (idx: number) => {
    soundtrack.playTapeClick();
    soundtrack.playGlitch();
    setStaticGlitch(true);
    setActiveCamIdx(idx);
    setTimeout(() => setStaticGlitch(false), 220);
  };

  const cam = CHANNELS[activeCamIdx];

  return (
    <div className="border border-[var(--term-border)] bg-[var(--term-panel-bg)] p-3 rounded font-mono text-xs flex flex-col gap-2">
      <div className="flex items-center justify-between border-b border-[var(--term-border)] pb-1">
        <div className="flex items-center gap-1.5 text-[var(--term-main)] font-bold">
          <Camera size={14} className="animate-pulse" />
          <span>SURVEILLANCE CCTV // SEC-NET 9</span>
        </div>
        <div className="flex items-center gap-2 text-red-500">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span className="font-bold tracking-wider">● REC</span>
        </div>
      </div>

      {/* Camera Screen */}
      <div className="relative border border-[var(--term-border)] h-28 bg-[#05070a] overflow-hidden flex flex-col justify-between p-2">
        {/* Subtle scanline overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] opacity-40"></div>

        {staticGlitch && (
          <div className="absolute inset-0 bg-white/20 flex items-center justify-center font-bold text-white z-10">
            [SYNCING FREQUENCY...]
          </div>
        )}

        <div className="flex justify-between items-start z-0 text-[10px] text-[var(--term-dim)]">
          <div>
            <span className="font-bold text-[var(--term-main)]">{cam.id}</span> : {cam.label}
            <div className="text-[9px] opacity-80">{cam.location}</div>
          </div>
          <div className="text-right text-[10px]">
            <div>{timestamp}</div>
            <div className="text-red-400 font-semibold">{cam.status}</div>
          </div>
        </div>

        {/* ASCII wireframe surveillance scenery */}
        <div className="my-auto text-center font-mono text-[9px] leading-tight text-[var(--term-dim)] opacity-70 select-none">
          {activeCamIdx === 0 && (
            <pre>
              {` [RACK-01]  |~|~|~|~|~|~|~|  [RACK-02]
 [••••••••]  |  UNREAD SPAM  |  [••••••••]
 ===PACKET INGEST: 5000/s=== `}
            </pre>
          )}
          {activeCamIdx === 1 && (
            <pre>
              {` [/downloads_dump/]  [12.4 GB]
 [!] MALWARE: .xlsx.exe DETECTED
 ===ZERO-FILL INCINERATOR IDLE=== `}
            </pre>
          )}
          {activeCamIdx === 2 && (
            <pre>
              {` [CFO TERMINAL]  [H_KANE LOGGED IN]
 [$$$] PANAMA ROUTING #9812
 ===SLUSH FUND WITHDRAWAL: $45K=== `}
            </pre>
          )}
          {activeCamIdx === 3 && (
            <pre>
              {` [CELL B-1]  [SUSPECT: AGENT VANE]
 [!] PSYCH STABILITY: COMPROMISED
 ===DECKARD INTERROGATION LIVE=== `}
            </pre>
          )}
        </div>

        <div className="flex justify-between text-[9px] text-[var(--term-dim)] z-0">
          <span>IRIS: AUTO</span>
          <span>ENCRYPT: 2048-BIT AES</span>
          <span>FPS: 30.0</span>
        </div>
      </div>

      {/* Cam Switcher Buttons */}
      <div className="grid grid-cols-4 gap-1">
        {CHANNELS.map((c, i) => (
          <button
            key={c.id}
            onClick={() => switchCam(i)}
            className={`py-1 px-1 text-[10px] font-bold border transition-colors ${
              activeCamIdx === i
                ? 'bg-[var(--term-main)] text-black border-[var(--term-main)]'
                : 'border-[var(--term-border)] text-[var(--term-dim)] hover:text-[var(--term-main)] hover:border-[var(--term-main)]'
            }`}
          >
            {c.id}
          </button>
        ))}
      </div>
    </div>
  );
};
