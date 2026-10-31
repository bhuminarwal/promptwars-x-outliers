import React from 'react';
import { LedgerEntry, GlobalTelemetry } from '../types';
import { caseLedger } from '../lib/caseLedger';
import { soundtrack } from '../lib/soundtrack';
import {
  History,
  RotateCcw,
  Download,
  X,
  Zap,
  HardDrive,
  DollarSign,
  Bug,
  Clock,
  Leaf
} from 'lucide-react';

interface TimeTravelLedgerProps {
  isOpen: boolean;
  onClose: () => void;
  history: LedgerEntry[];
  telemetry: GlobalTelemetry;
  onRollback: (snapshot: any) => void;
}

export const TimeTravelLedger: React.FC<TimeTravelLedgerProps> = ({
  isOpen,
  onClose,
  history,
  telemetry,
  onRollback
}) => {
  if (!isOpen) return null;

  const handleRollback = (entry: LedgerEntry) => {
    if (!entry.snapshotState) {
      soundtrack.playErrorBuzz();
      alert('This genesis block has no prior mutable state.');
      return;
    }

    soundtrack.playTimeTravelRewind();
    const restored = caseLedger.rollbackTo(entry.id);
    if (restored) {
      onRollback(restored);
    }
  };

  const handleExportReport = () => {
    soundtrack.playTapeClick();
    const report = caseLedger.exportAuditReport();
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `corp_net_exorcist_audit_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end font-mono select-none">
      <div className="w-full max-w-2xl bg-[#090d13] border-l border-[var(--term-border)] h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[var(--term-border)] bg-[var(--term-panel-bg)] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[var(--term-main)] font-black text-sm">
            <History size={18} className="animate-spin" />
            <span>CHRONOS DUAL-STATE TIME-TRAVEL LEDGER</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportReport}
              className="p-1.5 px-2.5 border border-[var(--term-border)] hover:border-[var(--term-main)] text-xs text-white rounded flex items-center gap-1.5"
              title="Download forensic dispatch text audit"
            >
              <Download size={13} />
              <span>EXPORT DISPATCH</span>
            </button>

            <button
              onClick={() => {
                soundtrack.playTapeClick();
                onClose();
              }}
              className="p-1.5 border border-[var(--term-border)] hover:border-red-400 text-gray-400 hover:text-white rounded"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Global Telemetry Metrics Banner */}
        <div className="p-4 bg-black/60 border-b border-[var(--term-border)] grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-2 border border-[var(--term-border)] bg-[var(--term-panel-bg)] rounded flex flex-col">
            <span className="text-[10px] text-[var(--term-dim)] flex items-center gap-1">
              <Zap size={10} className="text-yellow-400" /> SPAM PURGED
            </span>
            <strong className="text-white text-sm font-black mt-0.5">
              {telemetry.emailsVaporized.toLocaleString()}
            </strong>
          </div>

          <div className="p-2 border border-[var(--term-border)] bg-[var(--term-panel-bg)] rounded flex flex-col">
            <span className="text-[10px] text-[var(--term-dim)] flex items-center gap-1">
              <HardDrive size={10} className="text-blue-400" /> SPACE RECLAIMED
            </span>
            <strong className="text-white text-sm font-black mt-0.5">
              {(telemetry.bytesReclaimed / (1024 * 1024 * 1024)).toFixed(2)} GB
            </strong>
          </div>

          <div className="p-2 border border-[var(--term-border)] bg-[var(--term-panel-bg)] rounded flex flex-col">
            <span className="text-[10px] text-[var(--term-dim)] flex items-center gap-1">
              <DollarSign size={10} className="text-green-400" /> FRAUD VOIDED
            </span>
            <strong className="text-white text-sm font-black mt-0.5">
              ${telemetry.fraudDollarsBlocked.toLocaleString()}
            </strong>
          </div>

          <div className="p-2 border border-[var(--term-border)] bg-[var(--term-panel-bg)] rounded flex flex-col">
            <span className="text-[10px] text-[var(--term-dim)] flex items-center gap-1">
              <Bug size={10} className="text-red-400" /> BUGS PATCHED
            </span>
            <strong className="text-white text-sm font-black mt-0.5">
              {telemetry.bugsPatched}
            </strong>
          </div>

          <div className="p-2 border border-[var(--term-border)] bg-[var(--term-panel-bg)] rounded flex flex-col">
            <span className="text-[10px] text-[var(--term-dim)] flex items-center gap-1">
              <Clock size={10} className="text-purple-400" /> TIME SAVED
            </span>
            <strong className="text-white text-sm font-black mt-0.5">
              {telemetry.minutesSaved} Mins
            </strong>
          </div>

          <div className="p-2 border border-[var(--term-border)] bg-[var(--term-panel-bg)] rounded flex flex-col">
            <span className="text-[10px] text-[var(--term-dim)] flex items-center gap-1">
              <Leaf size={10} className="text-emerald-400" /> CO2 REDUCTION
            </span>
            <strong className="text-white text-sm font-black mt-0.5">
              {telemetry.co2GramsSaved.toFixed(1)}g
            </strong>
          </div>
        </div>

        {/* Timeline Entries List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          <div className="text-[10px] text-[var(--term-dim)] font-bold tracking-wider">
            IMMUTABLE FORENSIC AUDIT BLOCKS ({history.length} TRANSACTIONS):
          </div>

          {history.map((entry, idx) => (
            <div
              key={entry.id}
              className="border border-[var(--term-border)] bg-[var(--term-panel-bg)] p-3 rounded text-xs flex flex-col gap-2 relative group hover:border-[var(--term-main)] transition-colors"
            >
              <div className="flex items-center justify-between text-[10px] border-b border-[var(--term-border)]/40 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[var(--term-main)]">{entry.id}</span>
                  <span className="text-[var(--term-dim)]">[{entry.timestamp}]</span>
                </div>
                <span className="px-1.5 py-0.5 border border-[var(--term-border)] rounded text-[var(--term-dim)]">
                  {entry.caseId}
                </span>
              </div>

              <div>
                <div className="font-black text-white text-xs">{entry.narrativeTitle}</div>
                <div className="text-[11px] text-[var(--term-main)] mt-0.5">
                  ⚡ {entry.realWorldAction}
                </div>
                <p className="text-[10px] text-gray-400 mt-1 leading-snug">
                  {entry.details}
                </p>
              </div>

              {/* Rollback Trigger Button */}
              {entry.snapshotState && (
                <div className="pt-2 border-t border-[var(--term-border)]/40 flex justify-end">
                  <button
                    onClick={() => handleRollback(entry)}
                    className="py-1 px-2.5 bg-amber-500/20 border border-amber-500/60 hover:bg-amber-500 text-amber-200 hover:text-black rounded text-[10px] font-bold flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw size={11} />
                    <span>REWIND TO THIS STATE</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-[var(--term-border)] bg-[var(--term-panel-bg)] text-center text-[10px] text-[var(--term-dim)]">
          DUAL-STATE EXECUTION BRIDGE: CHANGES ARE IMMUTABLY BOUND TO CORP-NET DISK VOLUMES
        </div>
      </div>
    </div>
  );
};
