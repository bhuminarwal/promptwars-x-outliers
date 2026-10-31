import React, { useState } from 'react';
import { DOWNLOAD_FILES } from '../lib/casesData';
import { DownloadArtifact, CaseDossier } from '../types';
import { AsciiPortrait } from './AsciiPortraits';
import { caseLedger } from '../lib/caseLedger';
import { soundtrack } from '../lib/soundtrack';
import { triggerConfetti } from '../lib/confetti';
import {
  Database,
  Flame,
  ShieldAlert,
  Archive,
  Fingerprint,
  CheckCircle2,
  FileCode,
  AlertTriangle,
  HardDrive
} from 'lucide-react';

interface Case02Props {
  caseDossier: CaseDossier;
  onUpdateDossier: (d: Partial<CaseDossier>) => void;
  onReturn: () => void;
  colorTheme: 'green' | 'amber' | 'cyan';
}

export const Case02DownloadAbyss: React.FC<Case02Props> = ({
  caseDossier,
  onUpdateDossier,
  onReturn,
  colorTheme
}) => {
  const [files, setFiles] = useState<DownloadArtifact[]>(DOWNLOAD_FILES);
  const [selectedFileId, setSelectedFileId] = useState<string>('dl-001');
  const [hashAnalysisActive, setHashAnalysisActive] = useState(false);
  const [duplicateMatchesFound, setDuplicateMatchesFound] = useState(false);

  const selectedFile = files.find(f => f.id === selectedFileId) || files[0];

  // Calculate current clutter size
  const remainingClutterBytes = files
    .filter(f => f.state === 'downloads')
    .reduce((acc, f) => acc + f.sizeBytes, 0);

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Run Hash Deduplication Scan
  const handleRunHashScan = () => {
    soundtrack.playTapeClick();
    soundtrack.playGlitch();
    setHashAnalysisActive(true);

    setTimeout(() => {
      soundtrack.playEvidenceUnlocked();
      setDuplicateMatchesFound(true);

      caseLedger.addEntry({
        caseId: 'case-02',
        caseTitle: 'The Download Abyss',
        narrativeTitle: 'Cryptographic Hash Deduplicator Executed',
        realWorldAction: 'Identified Identical SHA-256 Hashes Across Duplicate Invoices',
        details: 'Matched invoice_2026_q3_apex.pdf and invoice_2026_q3_apex_copy(1).pdf (Hash: e3b0c442...). Proves duplicate payout scheme.',
        statsDelta: {},
        snapshotState: { files, duplicateMatchesFound: true }
      });

      onUpdateDossier({ evidenceCollected: Math.min(3, caseDossier.evidenceCollected + 1) });
    }, 700);
  };

  // Incinerate Bloat File
  const handleIncinerate = (file: DownloadArtifact) => {
    soundtrack.playLaserZap();
    const updated = files.map(f => (f.id === file.id ? { ...f, state: 'incinerated' as const } : f));
    setFiles(updated);

    caseLedger.addEntry({
      caseId: 'case-02',
      caseTitle: 'The Download Abyss',
      narrativeTitle: `Zero-Fill Incinerated: ${file.filename}`,
      realWorldAction: `Reclaimed ${formatSize(file.sizeBytes)} of Drive Space from Downloads Dump`,
      details: `Vaporized orphaned bloat cache. File system zero-fill verified.`,
      statsDelta: { bytesReclaimed: file.sizeBytes },
      snapshotState: { files: updated }
    });

    checkCompletion(updated, duplicateMatchesFound);
  };

  // Vault File into Evidence Locker
  const handleVaultEvidence = (file: DownloadArtifact) => {
    soundtrack.playEvidenceUnlocked();
    const updated = files.map(f => (f.id === file.id ? { ...f, state: 'vault' as const } : f));
    setFiles(updated);

    caseLedger.addEntry({
      caseId: 'case-02',
      caseTitle: 'The Download Abyss',
      narrativeTitle: `Secured in Evidence Vault: ${file.filename}`,
      realWorldAction: 'Organized Critical Forensic Evidence into Structured Investigation Dossier',
      details: `Preserved: ${file.description}`,
      statsDelta: {},
      snapshotState: { files: updated }
    });

    onUpdateDossier({ evidenceCollected: Math.min(3, caseDossier.evidenceCollected + 1) });
    checkCompletion(updated, duplicateMatchesFound);
  };

  // Quarantine Disguised Trojan
  const handleQuarantineTrojan = (file: DownloadArtifact) => {
    soundtrack.playEmpBlast();
    const updated = files.map(f => (f.id === file.id ? { ...f, state: 'quarantined' as const } : f));
    setFiles(updated);

    caseLedger.addEntry({
      caseId: 'case-02',
      caseTitle: 'The Download Abyss',
      narrativeTitle: `Unmasked and Quarantined Trojan: ${file.filename}`,
      realWorldAction: 'Neutralized Disguised .xlsx.exe Keylogger from Corporate Drive',
      details: 'Stripped reverse-shell payload targeting offshore server 194.26.29.11.',
      statsDelta: { bytesReclaimed: file.sizeBytes },
      snapshotState: { files: updated }
    });

    onUpdateDossier({ evidenceCollected: Math.min(3, caseDossier.evidenceCollected + 1) });
    checkCompletion(updated, duplicateMatchesFound);
  };

  // Check Completion
  const checkCompletion = (currentFiles: DownloadArtifact[], hashDone: boolean) => {
    const trojanQuarantined = currentFiles.find(f => f.id === 'dl-001')?.state === 'quarantined';
    const wiretapVaulted = currentFiles.find(f => f.id === 'dl-006')?.state === 'vault';
    const bloatIncinerated = currentFiles.filter(f => f.category === 'bloat_dump').every(f => f.state === 'incinerated');

    if (trojanQuarantined && wiretapVaulted && bloatIncinerated) {
      if (caseDossier.status !== 'EXORCISED') {
        soundtrack.playExorcismComplete();
        triggerConfetti(colorTheme);
        onUpdateDossier({
          status: 'EXORCISED',
          progressPercent: 100,
          evidenceCollected: 3
        });
      }
    }
  };

  const isCaseSolved = caseDossier.status === 'EXORCISED';

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
            CASE 02: THE DOWNLOAD ABYSS (GHOST CACHE)
          </h2>
          <div className="text-xs text-[var(--term-dim)]">
            Objective: Triage dark-ops downloads dump, incinerate 9.9GB bloat, unmask disguised trojan, match duplicate invoice hashes, and secure wiretap audio.
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-[var(--term-dim)]">REMAINING CLUTTER</div>
            <div className="text-xl font-black text-amber-400">
              {formatSize(remainingClutterBytes)}
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
                EXORCISM PROTOCOL COMPLETE: DRIVE DE-CLUTTERED
              </div>
              <div className="text-xs text-green-300">
                12+ GB storage reclaimed, trojan quarantined, duplicate invoice fraud proven, and wiretap secured. Case 03 unlocked!
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

      {/* Main Grid: Left = Forensic File Triage Table, Right = File Inspector & Suspect Art */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Triage Matrix (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="border border-[var(--term-border)] bg-[var(--term-panel-bg)] p-4 rounded flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[var(--term-border)] pb-2">
              <div className="flex items-center gap-2">
                <HardDrive size={16} className="text-[var(--term-main)]" />
                <span className="font-bold text-white text-xs">
                  STORAGE DIRECTORY // /var/tmp/downloads_dump/
                </span>
              </div>

              {/* Hash Deduplicator Button */}
              <button
                onClick={handleRunHashScan}
                className="px-2.5 py-1 bg-amber-500/20 border border-amber-500 text-amber-300 rounded text-xs font-bold hover:bg-amber-500/30 flex items-center gap-1.5"
              >
                <Fingerprint size={13} />
                <span>RUN HASH DEDUPLICATOR</span>
              </button>
            </div>

            {duplicateMatchesFound && (
              <div className="p-2.5 border border-amber-500 bg-amber-950/40 rounded text-xs text-amber-200 flex items-center justify-between">
                <span>
                  ⚠️ HASH MATCH DETECTED: <code>invoice_2026_q3_apex.pdf</code> and <code>...copy(1).pdf</code> share identical hash <code>e3b0c442...</code>
                </span>
                <span className="font-bold text-amber-300">[EVIDENCE UNLOCKED]</span>
              </div>
            )}

            {/* File Table */}
            <div className="border border-[var(--term-border)] rounded overflow-hidden">
              <div className="bg-black/60 px-3 py-1.5 border-b border-[var(--term-border)] text-[10px] text-[var(--term-dim)] grid grid-cols-12">
                <span className="col-span-5">FILENAME & PATH</span>
                <span className="col-span-3">DETECTED REAL TYPE</span>
                <span className="col-span-2">SIZE</span>
                <span className="col-span-2 text-right">STATE</span>
              </div>

              <div className="divide-y divide-[var(--term-border)] max-h-96 overflow-y-auto">
                {files.map(file => {
                  const isSelected = selectedFileId === file.id;
                  const isDuplicate = file.matchedDuplicateId && duplicateMatchesFound;

                  return (
                    <div
                      key={file.id}
                      onClick={() => {
                        soundtrack.playKeypress();
                        setSelectedFileId(file.id);
                      }}
                      className={`p-2.5 cursor-pointer text-xs transition-colors grid grid-cols-12 items-center ${
                        isSelected
                          ? 'bg-[var(--term-main)]/15 text-white'
                          : 'hover:bg-white/5 text-gray-300'
                      }`}
                    >
                      <div className="col-span-5 flex items-center gap-1.5 min-w-0 pr-2">
                        {file.threatLevel === 'CRITICAL' && (
                          <ShieldAlert size={13} className="text-red-400 shrink-0" />
                        )}
                        {file.threatLevel === 'EVIDENCE' && (
                          <span className="text-amber-400 font-bold shrink-0">★</span>
                        )}
                        <span className="font-bold truncate text-[11px]">
                          {file.filename}
                        </span>
                      </div>

                      <div className="col-span-3 text-[10px] text-[var(--term-dim)] truncate">
                        {file.realType}
                      </div>

                      <div className="col-span-2 text-[10px] font-mono">
                        {formatSize(file.sizeBytes)}
                      </div>

                      <div className="col-span-2 text-right text-[10px]">
                        {file.state === 'incinerated' && (
                          <span className="text-red-400 font-bold">INCINERATED</span>
                        )}
                        {file.state === 'vault' && (
                          <span className="text-green-400 font-bold">IN VAULT</span>
                        )}
                        {file.state === 'quarantined' && (
                          <span className="text-purple-400 font-bold">QUARANTINED</span>
                        )}
                        {file.state === 'downloads' && (
                          <span className="text-amber-400 font-semibold">CLUTTERED</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: File Inspector & Actions (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="border border-[var(--term-border)] bg-[var(--term-panel-bg)] p-4 rounded flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[var(--term-border)] pb-2">
              <span className="font-bold text-[var(--term-main)] text-xs">
                HEX & METADATA INSPECTOR
              </span>
              <span className="text-[10px] text-[var(--term-dim)]">
                SHA-256 HASH VERIFIER
              </span>
            </div>

            {/* Suspect Polaroid */}
            <div className="flex items-start gap-3 bg-black/50 p-2.5 rounded border border-[var(--term-border)]">
              <AsciiPortrait name="GHOST" className="text-[9px] w-24 shrink-0" />
              <div className="text-xs">
                <div className="text-[10px] text-[var(--term-dim)]">TARGET PROFILE:</div>
                <div className="font-bold text-white text-xs">The Ghost in Cache</div>
                <div className="text-[10px] text-[var(--term-main)] mt-0.5">Ex-Sysadmin Hoarder</div>
              </div>
            </div>

            {/* File Details */}
            {selectedFile && (
              <div className="bg-black/70 p-3 rounded border border-[var(--term-border)] flex flex-col gap-2 text-xs">
                <div>
                  <div className="text-[10px] text-[var(--term-dim)]">FILENAME:</div>
                  <div className="font-bold text-white text-xs break-all">{selectedFile.filename}</div>
                </div>

                <div>
                  <div className="text-[10px] text-[var(--term-dim)]">REAL MIME & TYPE:</div>
                  <div className="text-[11px] text-amber-300 font-mono">{selectedFile.realType}</div>
                </div>

                <div>
                  <div className="text-[10px] text-[var(--term-dim)]">FILE SIZE:</div>
                  <div className="text-[11px] text-white font-mono">{formatSize(selectedFile.sizeBytes)}</div>
                </div>

                <div>
                  <div className="text-[10px] text-[var(--term-dim)]">SHA-256 CHECKSUM:</div>
                  <div className="text-[9px] text-[var(--term-dim)] font-mono break-all bg-black p-1 rounded border border-[var(--term-border)]">
                    {selectedFile.sha256}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-[var(--term-dim)]">FORENSIC BRIEF:</div>
                  <p className="text-[11px] text-gray-200 mt-0.5 leading-snug">
                    {selectedFile.description}
                  </p>
                </div>

                {/* Triage Decision Buttons */}
                <div className="flex flex-col gap-2 pt-2 border-t border-[var(--term-border)]/60">
                  {selectedFile.state === 'downloads' ? (
                    <>
                      {/* Incinerate button for bloat / temp files */}
                      {(selectedFile.category === 'bloat_dump' || selectedFile.category === 'temp_junk') && (
                        <button
                          onClick={() => handleIncinerate(selectedFile)}
                          className="py-2 px-3 bg-red-600/30 border border-red-500 hover:bg-red-600/40 text-red-200 font-bold text-xs rounded flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Flame size={14} />
                          <span>🔥 ZERO-FILL INCINERATE (-{formatSize(selectedFile.sizeBytes)})</span>
                        </button>
                      )}

                      {/* Quarantine button for malware */}
                      {selectedFile.category === 'malware' && (
                        <button
                          onClick={() => handleQuarantineTrojan(selectedFile)}
                          className="py-2 px-3 bg-purple-600/30 border border-purple-500 hover:bg-purple-600/40 text-purple-200 font-bold text-xs rounded flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <ShieldAlert size={14} />
                          <span>☣️ UNMASK & QUARANTINE TROJAN</span>
                        </button>
                      )}

                      {/* Vault button for evidence & duplicate invoices & wiretap */}
                      {(selectedFile.category === 'audio_wiretap' || selectedFile.category === 'duplicate_invoice') && (
                        <button
                          onClick={() => handleVaultEvidence(selectedFile)}
                          className="py-2 px-3 bg-amber-500 text-black hover:bg-amber-400 font-bold text-xs rounded flex items-center justify-center gap-1.5 transition-colors animate-pulse"
                        >
                          <Archive size={14} />
                          <span>🗄️ DEPOSIT IN EVIDENCE VAULT</span>
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="p-2 border border-green-500/40 bg-green-950/20 text-xs text-green-300 rounded text-center font-bold">
                      FILE STATE: {selectedFile.state.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
