import React from 'react';
import { Terminal, Volume2, VolumeX, Eye, Activity, History, Shield, Zap } from 'lucide-react';
import { TerminalTheme, GlobalTelemetry } from '../types';
import { soundtrack } from '../lib/soundtrack';

interface TerminalHeaderProps {
  theme: TerminalTheme;
  setTheme: (t: TerminalTheme) => void;
  scanlines: boolean;
  setScanlines: (s: boolean) => void;
  telemetry: GlobalTelemetry;
  activeCaseId: string | null;
  onOpenLedger: () => void;
  onReturnToCorkboard: () => void;
  ledgerCount: number;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  theme,
  setTheme,
  scanlines,
  setScanlines,
  telemetry,
  activeCaseId,
  onOpenLedger,
  onReturnToCorkboard,
  ledgerCount
}) => {
  const [isMuted, setIsMuted] = React.useState(soundtrack.getMuted());

  const handleToggleMute = () => {
    const muted = soundtrack.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundtrack.startAmbientDrone();
    }
    soundtrack.playTapeClick();
  };

  const handleStartAudio = () => {
    soundtrack.startAmbientDrone();
    soundtrack.playTapeClick();
  };

  const handleThemeChange = (newTheme: TerminalTheme) => {
    setTheme(newTheme);
    soundtrack.playTapeClick();
  };

  const handleScanlineToggle = () => {
    setScanlines(!scanlines);
    soundtrack.playTapeClick();
  };

  return (
    <header className="border-b border-[var(--term-border)] bg-[var(--term-panel-bg)]/90 backdrop-blur font-mono text-xs select-none sticky top-0 z-40">
      {/* Top System Bar */}
      <div className="px-4 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--term-border)]/50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundtrack.playTapeClick();
              onReturnToCorkboard();
            }}
            className="flex items-center gap-2 text-[var(--term-main)] font-black text-sm tracking-widest hover:opacity-80 transition-opacity"
          >
            <Terminal size={18} className="animate-pulse" />
            <span className="glow-text">THE DIGITAL EXORCIST</span>
            <span className="text-[10px] py-0.5 px-1.5 border border-[var(--term-border)] rounded text-[var(--term-dim)]">
              CORP-NET 2.0
            </span>
          </button>

          {activeCaseId && (
            <div className="flex items-center gap-1.5 text-[var(--term-dim)]">
              <span>/</span>
              <button
                onClick={onReturnToCorkboard}
                className="text-[var(--term-main)] hover:underline font-bold"
              >
                MISSION BOARD
              </button>
              <span>/</span>
              <span className="text-white font-bold">{activeCaseId.toUpperCase()}</span>
            </div>
          )}
        </div>

        {/* Global Real-World Telemetry Ticker */}
        <div className="hidden lg:flex items-center gap-4 text-[11px] text-[var(--term-dim)] bg-black/40 px-3 py-1 border border-[var(--term-border)]/60 rounded">
          <div className="flex items-center gap-1">
            <Zap size={12} className="text-[var(--term-main)]" />
            <span>Spam Vaporized:</span>
            <strong className="text-white">{telemetry.emailsVaporized.toLocaleString()}</strong>
          </div>
          <div className="w-px h-3 bg-[var(--term-border)]"></div>
          <div>
            <span>Reclaimed:</span>{' '}
            <strong className="text-white">
              {(telemetry.bytesReclaimed / (1024 * 1024 * 1024)).toFixed(2)} GB
            </strong>
          </div>
          <div className="w-px h-3 bg-[var(--term-border)]"></div>
          <div>
            <span>Fraud Voided:</span>{' '}
            <strong className="text-white">${telemetry.fraudDollarsBlocked.toLocaleString()}</strong>
          </div>
          <div className="w-px h-3 bg-[var(--term-border)]"></div>
          <div>
            <span>Bugs Exorcised:</span>{' '}
            <strong className="text-white">{telemetry.bugsPatched}</strong>
          </div>
        </div>

        {/* Controls: Audio, Themes, Scanlines, Time-Travel */}
        <div className="flex items-center gap-2">
          {/* Audio Engine Button */}
          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute procedural noir synth audio' : 'Mute audio engine'}
            className={`p-1.5 border rounded flex items-center gap-1 transition-colors ${
              isMuted
                ? 'border-[var(--term-border)] text-[var(--term-dim)] hover:text-white'
                : 'border-[var(--term-main)] text-[var(--term-main)] bg-[var(--term-main)]/10'
            }`}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span className="text-[10px] font-bold">{isMuted ? 'AUDIO OFF' : 'SYNTH ON'}</span>
          </button>

          {/* CRT Scanlines Toggle */}
          <button
            onClick={handleScanlineToggle}
            title="Toggle CRT scanline raster overlay"
            className={`p-1.5 border rounded flex items-center gap-1 transition-colors ${
              scanlines
                ? 'border-[var(--term-main)] text-[var(--term-main)] bg-[var(--term-main)]/10'
                : 'border-[var(--term-border)] text-[var(--term-dim)] hover:text-white'
            }`}
          >
            <Eye size={14} />
            <span className="text-[10px] font-bold">CRT</span>
          </button>

          {/* Phosphor Theme Selector */}
          <div className="flex items-center border border-[var(--term-border)] rounded overflow-hidden">
            <button
              onClick={() => handleThemeChange('green')}
              className={`px-2 py-1 text-[10px] font-bold transition-colors ${
                theme === 'green' ? 'bg-[#00ff66] text-black' : 'text-[#00ff66] hover:bg-[#00ff66]/20'
              }`}
              title="Monochrome Phosphor Green P1"
            >
              GRN
            </button>
            <button
              onClick={() => handleThemeChange('amber')}
              className={`px-2 py-1 text-[10px] font-bold transition-colors ${
                theme === 'amber' ? 'bg-[#ffb000] text-black' : 'text-[#ffb000] hover:bg-[#ffb000]/20'
              }`}
              title="Monochrome Amber P3"
            >
              AMB
            </button>
            <button
              onClick={() => handleThemeChange('cyan')}
              className={`px-2 py-1 text-[10px] font-bold transition-colors ${
                theme === 'cyan' ? 'bg-[#00f0ff] text-black' : 'text-[#00f0ff] hover:bg-[#00f0ff]/20'
              }`}
              title="Cyber Cyan Phosphor"
            >
              CYN
            </button>
          </div>

          {/* Time-Travel Ledger Trigger */}
          <button
            onClick={() => {
              soundtrack.playTapeClick();
              onOpenLedger();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 border border-[var(--term-main)] bg-[var(--term-main)] text-black font-black text-[11px] rounded hover:opacity-90 transition-opacity"
            title="Open Immutable Time-Travel Rollback Ledger"
          >
            <History size={13} />
            <span>TIME-TRAVEL</span>
            <span className="bg-black text-[var(--term-main)] text-[10px] px-1 rounded-sm">
              {ledgerCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
