import React from 'react';
import { CaseDossier } from '../types';
import { AsciiPortrait } from './AsciiPortraits';
import { SurveillanceFeed } from './SurveillanceFeed';
import { FolderGit2, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Flame, Database, Bug, Mail } from 'lucide-react';
import { soundtrack } from '../lib/soundtrack';

interface DetectiveCorkboardProps {
  cases: CaseDossier[];
  onSelectCase: (caseId: 'case-01' | 'case-02' | 'case-03' | 'case-04') => void;
}

export const DetectiveCorkboard: React.FC<DetectiveCorkboardProps> = ({ cases, onSelectCase }) => {
  const getCaseIcon = (id: string) => {
    switch (id) {
      case 'case-01': return <Mail size={16} />;
      case 'case-02': return <Database size={16} />;
      case 'case-03': return <Flame size={16} />;
      case 'case-04': return <Bug size={16} />;
      default: return <FolderGit2 size={16} />;
    }
  };

  const handleOpenCase = (id: 'case-01' | 'case-02' | 'case-03' | 'case-04') => {
    soundtrack.playTapeClick();
    soundtrack.playKeypress();
    onSelectCase(id);
  };

  const allExorcised = cases.every(c => c.status === 'EXORCISED');

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto font-mono flex flex-col gap-6">
      {/* Corkboard Top Banner */}
      <div className="border border-[var(--term-border)] bg-[var(--term-panel-bg)] p-4 rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-4">
          <AsciiPortrait name="NULL_DECKARD" className="hidden sm:block text-[10px]" />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-red-600/20 text-red-400 border border-red-500/50 text-[10px] font-bold rounded">
                TOP-SECRET CONSPIRACY DOSSIER
              </span>
              <span className="text-[var(--term-dim)] text-xs">JURISDICTION: CORP-NET MAINFRAME</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-wide mt-1">
              MISSION CORKBOARD: "OPERATION EXORCISM"
            </h1>
            <p className="text-xs text-[var(--term-dim)] max-w-2xl mt-0.5">
              Every narrative interrogation and bytecode triage physically declutters real-world digital hoarding.
              Purge 5,000 spam beacons, incinerate 12GB of orphaned downloads, audit $142K in offshore expense fraud, and refactor corrupted daemon bytecode.
            </p>
          </div>
        </div>

        {allExorcised ? (
          <div className="border border-green-500 bg-green-950/40 p-3 rounded flex items-center gap-3">
            <ShieldCheck size={28} className="text-green-400 animate-bounce" />
            <div>
              <div className="text-green-400 font-bold text-sm">CORP-NET FULLY EXORCISED</div>
              <div className="text-[10px] text-green-300">All 4 anomalies neutralized & decluttered.</div>
            </div>
          </div>
        ) : (
          <div className="text-right">
            <div className="text-xs text-[var(--term-dim)]">ACTIVE THREAT LEVEL</div>
            <div className="text-lg font-black text-amber-400 animate-pulse">DEFCON 2 // HOARDING CRISIS</div>
            <div className="text-[11px] text-[var(--term-main)]">
              {cases.filter(c => c.status === 'EXORCISED').length} OF 4 CASES SOLVED
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: 4 Case Files + Surveillance / Intel Sidebars */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Columns: The 4 Case Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {cases.map((c, idx) => {
            const isExorcised = c.status === 'EXORCISED';
            return (
              <div
                key={c.id}
                onClick={() => handleOpenCase(c.id)}
                className={`group cursor-pointer border rounded-lg p-4 bg-[var(--term-panel-bg)] transition-all flex flex-col justify-between relative overflow-hidden ${
                  isExorcised
                    ? 'border-green-500/60 shadow-[0_0_15px_rgba(0,255,102,0.15)]'
                    : 'border-[var(--term-border)] hover:border-[var(--term-main)] hover:shadow-[0_0_20px_rgba(0,255,102,0.1)]'
                }`}
              >
                {/* Red push-pin graphic */}
                <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-red-600 shadow-[0_0_6px_red] border border-red-300"></div>

                <div>
                  {/* Case Code & Classification */}
                  <div className="flex items-center justify-between text-[11px] mb-2 pr-4">
                    <span className="font-bold text-[var(--term-main)] flex items-center gap-1.5">
                      {getCaseIcon(c.id)}
                      {c.codeNumber}
                    </span>
                    <span className="text-[10px] text-[var(--term-dim)] border border-[var(--term-border)] px-1.5 py-0.5 rounded">
                      {c.classification}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-base font-black text-white group-hover:text-[var(--term-main)] transition-colors">
                    {c.title}
                  </h3>
                  <div className="text-xs text-[var(--term-dim)] mb-3 font-semibold">
                    {c.subtitle}
                  </div>

                  {/* Suspect Polaroid & Narrative Snippet */}
                  <div className="flex items-start gap-3 bg-black/40 p-2.5 rounded border border-[var(--term-border)]/50 mb-3">
                    <AsciiPortrait name={c.suspectPortrait} className="text-[9px] w-28 shrink-0" />
                    <div className="text-xs">
                      <div className="text-[10px] text-[var(--term-dim)]">PRIMARY SUSPECT:</div>
                      <div className="font-bold text-white text-xs">{c.suspectName}</div>
                      <div className="text-[10px] text-[var(--term-main)] mb-1.5">{c.suspectRole}</div>
                      <p className="text-[11px] text-gray-300 line-clamp-3 leading-snug">
                        {c.narrativeBrief}
                      </p>
                    </div>
                  </div>

                  {/* Real-World Digital Hoarding Target */}
                  <div className="bg-[var(--term-main)]/5 border border-[var(--term-main)]/30 rounded p-2 text-xs mb-3">
                    <div className="text-[10px] font-bold text-[var(--term-main)] flex items-center gap-1">
                      <span>CHORE TRANSLATION BRIDGE:</span>
                    </div>
                    <div className="text-[11px] text-gray-200 mt-0.5 font-medium">
                      🎯 {c.targetHoarding}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Progress & Action */}
                <div className="border-t border-[var(--term-border)]/60 pt-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {isExorcised ? (
                      <span className="flex items-center gap-1 text-green-400 font-bold text-xs">
                        <CheckCircle2 size={14} /> EXORCISED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                        <AlertTriangle size={13} /> {c.status}
                      </span>
                    )}
                    <span className="text-[var(--term-dim)] text-[10px]">
                      (Evidence: {c.evidenceCollected}/{c.totalEvidence})
                    </span>
                  </div>

                  <div className="flex items-center gap-1 font-bold text-[var(--term-main)] group-hover:translate-x-1 transition-transform">
                    <span>{isExorcised ? 'REVIEW' : 'COMMENCE'}</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 1 Column: Noir Intel Corkboard, Surveillance & Suspect Web */}
        <div className="flex flex-col gap-4">
          <SurveillanceFeed />

          {/* Conspiratorial Red Yarn Suspect Network */}
          <div className="border border-[var(--term-border)] bg-[var(--term-panel-bg)] p-3 rounded text-xs">
            <div className="font-bold text-[var(--term-main)] border-b border-[var(--term-border)] pb-1 mb-2 flex items-center justify-between">
              <span>SUSPECT CONNECTIONS</span>
              <span className="text-[10px] text-red-500 font-bold">RED YARN ACTIVE</span>
            </div>
            
            <div className="flex flex-col gap-2 text-[11px]">
              <div className="p-2 border border-red-500/30 bg-red-950/20 rounded">
                <span className="font-bold text-white">Agent Vane</span> (Growth VP)
                <div className="text-[10px] text-red-400 font-mono">
                  ──[Masks 5,000 spam beacons]──►
                </div>
                <div className="text-[10px] text-gray-400">Buries Whistleblower Leak</div>
              </div>

              <div className="p-2 border border-red-500/30 bg-red-950/20 rounded">
                <span className="font-bold text-white">The Ghost</span> (Downloads Abyss)
                <div className="text-[10px] text-red-400 font-mono">
                  ──[Stores duplicate invoices & wiretap]──►
                </div>
                <div className="text-[10px] text-gray-400">Cryptographic Hash Match: 0xe3b0...</div>
              </div>

              <div className="p-2 border border-red-500/30 bg-red-950/20 rounded">
                <span className="font-bold text-white">CFO Harrison Kane</span> (Panama Vaults)
                <div className="text-[10px] text-red-400 font-mono">
                  ──[Funds $142,500 malware purchase]──►
                </div>
                <div className="text-[10px] text-gray-400">Purchased Daemon 0xDEADBEEF</div>
              </div>

              <div className="p-2 border border-red-500/30 bg-red-950/20 rounded">
                <span className="font-bold text-white">Daemon 0xDEADBEEF</span> (AI Core)
                <div className="text-[10px] text-red-400 font-mono">
                  ──[Injected memory leaks & syntax traps]──►
                </div>
                <div className="text-[10px] text-gray-400">Mainframe Core Breakdown</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
