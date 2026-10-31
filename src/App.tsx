import React, { useState, useEffect } from 'react';
import { TerminalTheme, CaseDossier, LedgerEntry, GlobalTelemetry } from './types';
import { INITIAL_DOSSIERS } from './lib/casesData';
import { caseLedger } from './lib/caseLedger';
import { soundtrack } from './lib/soundtrack';
import { TerminalHeader } from './components/TerminalHeader';
import { DetectiveCorkboard } from './components/DetectiveCorkboard';
import { Case01SpamSyndicate } from './components/Case01SpamSyndicate';
import { Case02DownloadAbyss } from './components/Case02DownloadAbyss';
import { Case03PhantomLedger } from './components/Case03PhantomLedger';
import { Case04BytecodeHeresy } from './components/Case04BytecodeHeresy';
import { TimeTravelLedger } from './components/TimeTravelLedger';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<TerminalTheme>('green');
  const [scanlines, setScanlines] = useState<boolean>(true);
  const [activeCaseId, setActiveCaseId] = useState<'case-01' | 'case-02' | 'case-03' | 'case-04' | null>(null);
  const [cases, setCases] = useState<CaseDossier[]>(INITIAL_DOSSIERS);
  const [isLedgerOpen, setIsLedgerOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<LedgerEntry[]>(caseLedger.getHistory());
  const [telemetry, setTelemetry] = useState<GlobalTelemetry>(caseLedger.getTelemetry());

  // Subscribe to immutable case ledger
  useEffect(() => {
    const unsubscribe = caseLedger.subscribe(() => {
      setHistory(caseLedger.getHistory());
      setTelemetry(caseLedger.getTelemetry());
    });
    return unsubscribe;
  }, []);

  // Update specific dossier
  const handleUpdateDossier = (caseId: string, updates: Partial<CaseDossier>) => {
    setCases(prev =>
      prev.map(c => (c.id === caseId ? { ...c, ...updates } : c))
    );
  };

  // Rollback state from Time-Travel Ledger
  const handleRollback = (snapshot: any) => {
    if (!snapshot) return;
    if (snapshot.cases) {
      setCases(snapshot.cases);
    }
    // Update local state if needed
    setIsLedgerOpen(false);
  };

  const activeCase = cases.find(c => c.id === activeCaseId);

  return (
    <div
      className={`min-h-screen font-mono transition-colors duration-300 theme-${theme} ${
        scanlines ? 'crt-scanlines' : ''
      } bg-[#090d13] text-gray-200 flex flex-col`}
    >
      {/* Top Header */}
      <TerminalHeader
        theme={theme}
        setTheme={setTheme}
        scanlines={scanlines}
        setScanlines={setScanlines}
        telemetry={telemetry}
        activeCaseId={activeCaseId}
        onOpenLedger={() => setIsLedgerOpen(true)}
        onReturnToCorkboard={() => setActiveCaseId(null)}
        ledgerCount={history.length}
      />

      {/* Main Viewport */}
      <main className="flex-1 pb-10">
        {!activeCaseId && (
          <DetectiveCorkboard
            cases={cases}
            onSelectCase={id => setActiveCaseId(id)}
          />
        )}

        {activeCaseId === 'case-01' && activeCase && (
          <Case01SpamSyndicate
            caseDossier={activeCase}
            onUpdateDossier={u => handleUpdateDossier('case-01', u)}
            onReturn={() => setActiveCaseId(null)}
            colorTheme={theme}
          />
        )}

        {activeCaseId === 'case-02' && activeCase && (
          <Case02DownloadAbyss
            caseDossier={activeCase}
            onUpdateDossier={u => handleUpdateDossier('case-02', u)}
            onReturn={() => setActiveCaseId(null)}
            colorTheme={theme}
          />
        )}

        {activeCaseId === 'case-03' && activeCase && (
          <Case03PhantomLedger
            caseDossier={activeCase}
            onUpdateDossier={u => handleUpdateDossier('case-03', u)}
            onReturn={() => setActiveCaseId(null)}
            colorTheme={theme}
          />
        )}

        {activeCaseId === 'case-04' && activeCase && (
          <Case04BytecodeHeresy
            caseDossier={activeCase}
            onUpdateDossier={u => handleUpdateDossier('case-04', u)}
            onReturn={() => setActiveCaseId(null)}
            colorTheme={theme}
          />
        )}
      </main>

      {/* Time-Travel Rollback Drawer */}
      <TimeTravelLedger
        isOpen={isLedgerOpen}
        onClose={() => setIsLedgerOpen(false)}
        history={history}
        telemetry={telemetry}
        onRollback={handleRollback}
      />

      {/* Cyberpunk Footer */}
      <footer className="border-t border-[var(--term-border)]/60 bg-[var(--term-panel-bg)]/80 py-2.5 px-4 text-center text-[10px] text-[var(--term-dim)] select-none">
        THE DIGITAL EXORCIST v1.0.0 // ZERO-ASSET PROCEDURAL NOIR ENGINE // CORP-NET PROTOCOL // DETECTIVE RICK "NULL" DECKARD
      </footer>
    </div>
  );
};

export default App;
