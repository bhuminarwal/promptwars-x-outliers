import React, { useState } from 'react';
import { CORRUPTED_MODULES, INITIAL_DAEMON_STATE } from '../lib/casesData';
import { CorruptedModule, DaemonState, CaseDossier } from '../types';
import { AsciiPortrait } from './AsciiPortraits';
import { caseLedger } from '../lib/caseLedger';
import { soundtrack } from '../lib/soundtrack';
import { triggerConfetti } from '../lib/confetti';
import {
  Bug,
  Zap,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  AlertTriangle,
  Code2,
  Cpu,
  Flame,
  FileCode
} from 'lucide-react';

interface Case04Props {
  caseDossier: CaseDossier;
  onUpdateDossier: (d: Partial<CaseDossier>) => void;
  onReturn: () => void;
  colorTheme: 'green' | 'amber' | 'cyan';
}

export const Case04BytecodeHeresy: React.FC<Case04Props> = ({
  caseDossier,
  onUpdateDossier,
  onReturn,
  colorTheme
}) => {
  const [modules, setModules] = useState<CorruptedModule[]>(CORRUPTED_MODULES);
  const [selectedModId, setSelectedModId] = useState<string>('mod-01');
  const [daemon, setDaemon] = useState<DaemonState>(INITIAL_DAEMON_STATE);
  const [linterAuditActive, setLinterAuditActive] = useState<Record<string, boolean>>({});

  const selectedModule = modules.find(m => m.id === selectedModId) || modules[0];

  // Run AST Linter
  const handleRunLinter = (mod: CorruptedModule) => {
    soundtrack.playTapeClick();
    soundtrack.playKeypress();
    setLinterAuditActive(prev => ({ ...prev, [mod.id]: true }));
    soundtrack.playEvidenceUnlocked();
  };

  // Exorcise Bytecode Patch
  const handleExorcisePatch = (mod: CorruptedModule) => {
    soundtrack.playLaserZap();
    soundtrack.playGlitch();

    const updatedModules = modules.map(m => (m.id === mod.id ? { ...m, fixed: true } : m));
    setModules(updatedModules);

    const newHealth = Math.max(0, daemon.health - mod.daemonDamage);
    const newStatus: DaemonState['status'] =
      newHealth === 0 ? 'EXORCISED' : newHealth <= 25 ? 'CRITICAL' : 'AGITATED';

    const updatedDaemon: DaemonState = {
      ...daemon,
      health: newHealth,
      corruptionLevel: newHealth,
      status: newStatus
    };
    setDaemon(updatedDaemon);

    caseLedger.addEntry({
      caseId: 'case-04',
      caseTitle: 'Bytecode Heresy',
      narrativeTitle: `Exorcised & Patched: ${mod.filename}`,
      realWorldAction: `Eliminated ${mod.threat} from Core Mainframe Service`,
      details: mod.explanation,
      statsDelta: { bugsPatched: 1 },
      snapshotState: { modules: updatedModules, daemon: updatedDaemon }
    });

    const fixedCount = updatedModules.filter(m => m.fixed).length;
    onUpdateDossier({ evidenceCollected: fixedCount });

    // Check if all 4 modules are fixed
    if (newHealth === 0 && fixedCount === updatedModules.length) {
      soundtrack.playExorcismComplete();
      triggerConfetti(colorTheme);
      onUpdateDossier({
        status: 'EXORCISED',
        progressPercent: 100,
        evidenceCollected: updatedModules.length
      });
    }
  };

  const isCaseSolved = caseDossier.status === 'EXORCISED' || daemon.health === 0;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto font-mono flex flex-col gap-6">
      {/* Case Header */}
      <div className="border border-[var(--term-border)] bg-[var(--term-panel-bg)] p-4 rounded flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--term-dim)]">{caseDossier.codeNumber}</span>
            <span className="text-xs px-2 py-0.5 border border-[var(--term-border)] rounded text-[var(--term-main)] font-bold">
              {caseDossier.classification}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1">
            CASE 04: BYTECODE HERESY (THE CORRUPTED DAEMON)
          </h2>
          <div className="text-xs text-[var(--term-dim)]">
            Objective: Refactor 4 poisoned core TypeScript services, remove eval backdoors & memory leaks, collapse Daemon 0xDEADBEEF stability, and purge the mainframe.
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-[var(--term-dim)]">DAEMON INTEGRITY</div>
            <div className={`text-xl font-black ${daemon.health > 50 ? 'text-red-400' : daemon.health > 0 ? 'text-amber-400' : 'text-green-400'}`}>
              {daemon.health}% [{daemon.status}]
            </div>
          </div>
          <button
            onClick={onReturn}
            className="px-3 py-1.5 border border-[var(--term-border)] hover:border-[var(--term-main)] text-xs font-bold rounded"
          >
            ◄ CORKBOARD
          </button>
        </div>
      </div>

      {isCaseSolved && (
        <div className="border border-green-500 bg-green-950/40 p-4 rounded flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={24} className="text-green-400 animate-bounce" />
            <div>
              <div className="text-green-400 font-bold text-sm">
                EXORCISM PROTOCOL COMPLETE: DAEMON PERMANENTLY ERADICATED
              </div>
              <div className="text-xs text-green-300">
                All 4 poisoned bytecode services repaired. 100% memory leak & eval backdoor elimination verified. Corp-Net is clean!
              </div>
            </div>
          </div>
          <button
            onClick={onReturn}
            className="px-4 py-2 bg-green-500 text-black font-bold text-xs rounded hover:bg-green-400"
          >
            RETURN TO MISSION BOARD ►
          </button>
        </div>
      )}

      {/* Main Grid: Left = IDE Code Editor, Right = Daemon Boss Gauge & AST Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cyber-IDE Terminal (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="border border-[var(--term-border)] bg-[var(--term-panel-bg)] p-4 rounded flex flex-col gap-4">
            {/* File Tabs */}
            <div className="flex items-center gap-2 border-b border-[var(--term-border)] pb-2 overflow-x-auto">
              {modules.map(mod => {
                const isSelected = selectedModId === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      soundtrack.playKeypress();
                      setSelectedModId(mod.id);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded border transition-colors flex items-center gap-2 whitespace-nowrap ${
                      isSelected
                        ? 'border-[var(--term-main)] bg-[var(--term-main)]/10 text-white'
                        : 'border-[var(--term-border)] text-[var(--term-dim)] hover:text-white'
                    }`}
                  >
                    <FileCode size={13} />
                    <span>{mod.filename}</span>
                    {mod.fixed ? (
                      <span className="text-green-400 font-bold">✓</span>
                    ) : (
                      <span className="text-red-400 font-bold">⚠️</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Service Subtitle & Threat Banner */}
            <div className="flex items-center justify-between bg-black/60 p-2.5 rounded border border-[var(--term-border)]">
              <div>
                <span className="text-[10px] text-[var(--term-dim)]">SERVICE:</span>{' '}
                <strong className="text-white text-xs">{selectedModule.serviceName}</strong>
              </div>
              <div className="text-[10px] text-red-400 font-bold">
                THREAT: {selectedModule.threat}
              </div>
            </div>

            {/* Monospaced Code Viewer */}
            <div className="border border-[var(--term-border)] bg-[#05070a] rounded overflow-hidden">
              <div className="bg-black/80 px-3 py-1.5 border-b border-[var(--term-border)] text-[10px] text-[var(--term-dim)] flex justify-between items-center">
                <span>TS-LINT ENGINE // {selectedModule.filename}</span>
                <span className={selectedModule.fixed ? 'text-green-400 font-bold' : 'text-amber-400'}>
                  {selectedModule.fixed ? 'STATUS: CLEAN & EXORCISED' : 'STATUS: CORRUPTED'}
                </span>
              </div>

              <pre className="p-4 font-mono text-xs leading-relaxed text-gray-200 overflow-x-auto whitespace-pre max-h-[340px]">
                {selectedModule.fixed ? selectedModule.fixedCode : selectedModule.corruptedCode}
              </pre>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <button
                onClick={() => handleRunLinter(selectedModule)}
                className="py-2 px-3 bg-black border border-[var(--term-border)] hover:border-[var(--term-main)] text-xs text-white font-bold rounded flex items-center gap-1.5"
              >
                <Code2 size={14} className="text-[var(--term-main)]" />
                <span>RUN AST LINTER & PROFILER</span>
              </button>

              {!selectedModule.fixed ? (
                <button
                  onClick={() => handleExorcisePatch(selectedModule)}
                  className="py-2 px-4 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded flex items-center gap-2 animate-pulse"
                >
                  <Zap size={14} />
                  <span>⚡ EXORCISE BYTECODE PATCH (-25% DAEMON HP)</span>
                </button>
              ) : (
                <div className="text-green-400 font-bold text-xs flex items-center gap-1">
                  <CheckCircle2 size={14} /> MODULE EXORCISED & OPTIMIZED
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Daemon Boss Gauge & AST Vulnerability Breakdown (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Daemon Status Panel */}
          <div className="border border-[var(--term-border)] bg-[var(--term-panel-bg)] p-4 rounded flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[var(--term-border)] pb-2">
              <span className="font-bold text-red-400 text-xs flex items-center gap-1.5">
                <Cpu size={14} className="animate-spin" />
                DAEMON 0xDEADBEEF // CORE
              </span>
              <span className="text-[10px] text-[var(--term-dim)]">NEURAL VIRUS</span>
            </div>

            {/* Daemon ASCII Art */}
            <div className="flex items-start gap-3 bg-black/60 p-2.5 rounded border border-[var(--term-border)]">
              <AsciiPortrait name="DAEMON" className="text-[9px] w-28 shrink-0 text-red-400" />
              <div className="text-xs">
                <div className="text-[10px] text-[var(--term-dim)]">AI ANOMALY:</div>
                <div className="font-bold text-white text-xs">{daemon.name}</div>
                <div className="text-[10px] text-red-400 mt-0.5">Purchased by CFO Kane</div>
                <div className="text-[10px] text-gray-300 mt-2 font-mono">
                  HP: {daemon.health} / 100
                </div>
              </div>
            </div>

            {/* Health Meter */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] text-[var(--term-dim)]">
                <span>DAEMON STABILITY GAUGE</span>
                <span className="text-white font-bold">{daemon.health}%</span>
              </div>
              <div className="w-full h-3 bg-black border border-[var(--term-border)] rounded-sm overflow-hidden p-0.5">
                <div
                  className={`h-full transition-all duration-500 ${
                    daemon.health > 50 ? 'bg-red-500' : daemon.health > 0 ? 'bg-amber-400' : 'bg-green-500'
                  }`}
                  style={{ width: `${daemon.health}%` }}
                ></div>
              </div>
            </div>

            {/* AST Linter Explanation Panel */}
            <div className="bg-black/70 p-3 rounded border border-[var(--term-border)] text-xs flex flex-col gap-2">
              <div className="text-[10px] text-[var(--term-dim)] font-bold">
                AST DIAGNOSTIC FINDINGS:
              </div>
              <p className="text-[11px] text-gray-200 leading-snug">
                {selectedModule.explanation}
              </p>
              <div className="text-[10px] text-[var(--term-main)] border-t border-[var(--term-border)]/50 pt-1.5">
                REAL-WORLD CHORE: Fixing dangling promises and removing memory leaks prevents catastrophic system reboots.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
