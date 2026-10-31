import React, { useState } from 'react';
import { EXPENSE_RECEIPTS, INTRUSION_LOGS } from '../lib/casesData';
import { ExpenseReceipt, CaseDossier, IntrusionLog } from '../types';
import { AsciiPortrait } from './AsciiPortraits';
import { caseLedger } from '../lib/caseLedger';
import { soundtrack } from '../lib/soundtrack';
import { triggerConfetti } from '../lib/confetti';
import {
  DollarSign,
  ShieldAlert,
  CheckCircle2,
  FileCheck,
  Search,
  Scale,
  Building,
  Terminal,
  AlertTriangle
} from 'lucide-react';

interface Case03Props {
  caseDossier: CaseDossier;
  onUpdateDossier: (d: Partial<CaseDossier>) => void;
  onReturn: () => void;
  colorTheme: 'green' | 'amber' | 'cyan';
}

export const Case03PhantomLedger: React.FC<Case03Props> = ({
  caseDossier,
  onUpdateDossier,
  onReturn,
  colorTheme
}) => {
  const [receipts, setReceipts] = useState<ExpenseReceipt[]>(EXPENSE_RECEIPTS);
  const [selectedReceiptId, setSelectedReceiptId] = useState<string>('rcp-101');
  const [correlatedLogs, setCorrelatedLogs] = useState<string[]>([]);

  const selectedReceipt = receipts.find(r => r.id === selectedReceiptId) || receipts[0];

  // Calculate current fraud blocked
  const totalFraudBlocked = receipts
    .filter(r => r.status === 'flagged_fraud' || r.status === 'voided')
    .reduce((acc, r) => acc + r.amount, 0);

  // Correlate Intrusion Log with current receipt
  const handleCorrelateLog = (receipt: ExpenseReceipt) => {
    if (!receipt.matchedIntrusionTimestamp) {
      soundtrack.playErrorBuzz();
      return;
    }

    soundtrack.playEvidenceUnlocked();
    if (!correlatedLogs.includes(receipt.id)) {
      const updated = [...correlatedLogs, receipt.id];
      setCorrelatedLogs(updated);

      caseLedger.addEntry({
        caseId: 'case-03',
        caseTitle: 'The Phantom Ledger',
        narrativeTitle: `Correlated Breach Log with Invoice ${receipt.invoiceNo}`,
        realWorldAction: `Matched CFO H_KANE Master Badge Access Timestamp to Shell Invoice`,
        details: `Timestamp: ${receipt.matchedIntrusionTimestamp} - IP: 194.26.29.11 (Panama Tor Exit). Vendor: ${receipt.vendor}`,
        statsDelta: {},
        snapshotState: { receipts, correlatedLogs: updated }
      });

      onUpdateDossier({ evidenceCollected: Math.min(3, caseDossier.evidenceCollected + 1) });
    }
  };

  // Flag Fraud & Void Slush Invoice
  const handleVoidFraud = (receipt: ExpenseReceipt) => {
    soundtrack.playLaserZap();
    const updated = receipts.map(r => (r.id === receipt.id ? { ...r, status: 'voided' as const } : r));
    setReceipts(updated);

    caseLedger.addEntry({
      caseId: 'case-03',
      caseTitle: 'The Phantom Ledger',
      narrativeTitle: `Voided Slush Fund Invoice: ${receipt.invoiceNo}`,
      realWorldAction: `Blocked $${receipt.amount.toLocaleString()} Fraudulent Shell Company Payout`,
      details: `Vendor: ${receipt.vendor}. Memo: "${receipt.memo}". Tax ID ${receipt.taxId} revoked.`,
      statsDelta: { fraudDollarsBlocked: receipt.amount },
      snapshotState: { receipts: updated }
    });

    checkCompletion(updated);
  };

  // Verify Legitimate Expense
  const handleVerifyLegitimate = (receipt: ExpenseReceipt) => {
    soundtrack.playTapeClick();
    const updated = receipts.map(r => (r.id === receipt.id ? { ...r, status: 'cleared' as const } : r));
    setReceipts(updated);

    caseLedger.addEntry({
      caseId: 'case-03',
      caseTitle: 'The Phantom Ledger',
      narrativeTitle: `Audited & Approved Legitimate Expense: ${receipt.invoiceNo}`,
      realWorldAction: `Cleared Valid Corporate Expense ($${receipt.amount.toFixed(2)})`,
      details: `Vendor: ${receipt.vendor}. Tax ID verified valid.`,
      statsDelta: {},
      snapshotState: { receipts: updated }
    });

    checkCompletion(updated);
  };

  // Check Completion
  const checkCompletion = (currentReceipts: ExpenseReceipt[]) => {
    const allFraudVoided = currentReceipts
      .filter(r => r.isShellCompany)
      .every(r => r.status === 'voided' || r.status === 'flagged_fraud');
    const allLegitCleared = currentReceipts
      .filter(r => !r.isShellCompany)
      .every(r => r.status === 'cleared');

    if (allFraudVoided && allLegitCleared) {
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
  const matchedLog = INTRUSION_LOGS.find(l => l.timestamp === selectedReceipt.matchedIntrusionTimestamp);

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
            CASE 03: THE PHANTOM LEDGER (OFFSHORE SLUSH FUND)
          </h2>
          <div className="text-xs text-[var(--term-dim)]">
            Objective: Audit 6 suspicious corporate invoices, cross-reference mainframe intrusion logs, void $142,500 in shell entity fraud, and balance the ledger.
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-[var(--term-dim)]">SLUSH FRAUD VOIDED</div>
            <div className="text-xl font-black text-green-400">
              ${totalFraudBlocked.toLocaleString()} / $142,500
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
                EXORCISM PROTOCOL COMPLETE: TREASURY AUDITED
              </div>
              <div className="text-xs text-green-300">
                $142,500 in offshore fraud voided. CFO Harrison Kane's embezzlement warrant generated. Discovered purchase receipt for DAEMON 0xDEADBEEF! Case 04 unlocked!
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

      {/* Grid: Left = Expense Receipt Table, Right = OCR Inspector & Mainframe Intrusion Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Receipts Ledger (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="border border-[var(--term-border)] bg-[var(--term-panel-bg)] p-4 rounded flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[var(--term-border)] pb-2">
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-[var(--term-main)]" />
                <span className="font-bold text-white text-xs">
                  CORPORATE TREASURY // GENERAL EXPENSE LEDGER
                </span>
              </div>
              <span className="text-[10px] text-[var(--term-dim)]">AUDIT CYCLE: Q4 2026</span>
            </div>

            {/* Receipt Table */}
            <div className="border border-[var(--term-border)] rounded overflow-hidden">
              <div className="bg-black/60 px-3 py-1.5 border-b border-[var(--term-border)] text-[10px] text-[var(--term-dim)] grid grid-cols-12">
                <span className="col-span-4">INVOICE & VENDOR</span>
                <span className="col-span-3">DEPARTMENT</span>
                <span className="col-span-2 text-right">AMOUNT</span>
                <span className="col-span-3 text-right">STATUS</span>
              </div>

              <div className="divide-y divide-[var(--term-border)]">
                {receipts.map(rcp => {
                  const isSelected = selectedReceiptId === rcp.id;
                  const isCorrelated = correlatedLogs.includes(rcp.id);

                  return (
                    <div
                      key={rcp.id}
                      onClick={() => {
                        soundtrack.playKeypress();
                        setSelectedReceiptId(rcp.id);
                      }}
                      className={`p-2.5 cursor-pointer text-xs transition-colors grid grid-cols-12 items-center ${
                        isSelected
                          ? 'bg-[var(--term-main)]/15 text-white'
                          : 'hover:bg-white/5 text-gray-300'
                      }`}
                    >
                      <div className="col-span-4 flex flex-col min-w-0 pr-2">
                        <div className="flex items-center gap-1 font-bold text-white text-[11px] truncate">
                          {rcp.isShellCompany && (
                            <span className="text-red-400 font-bold shrink-0">⚠️</span>
                          )}
                          <span>{rcp.vendor}</span>
                        </div>
                        <div className="text-[10px] text-[var(--term-dim)] font-mono">
                          {rcp.invoiceNo}
                        </div>
                      </div>

                      <div className="col-span-3 text-[10px] text-[var(--term-dim)] truncate">
                        {rcp.department}
                      </div>

                      <div className="col-span-2 text-right text-[11px] font-mono font-bold text-white">
                        ${rcp.amount.toLocaleString()}
                      </div>

                      <div className="col-span-3 text-right text-[10px]">
                        {rcp.status === 'voided' && (
                          <span className="text-red-400 font-bold">VOIDED (FRAUD)</span>
                        )}
                        {rcp.status === 'cleared' && (
                          <span className="text-green-400 font-bold">CLEARED (VALID)</span>
                        )}
                        {rcp.status === 'pending' && (
                          <span className="text-amber-400 font-semibold animate-pulse">PENDING AUDIT</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Suspect Polaroid & Intelligence Banner */}
            <div className="flex items-start gap-3 bg-black/50 p-3 rounded border border-[var(--term-border)]">
              <AsciiPortrait name="KANE" className="text-[9px] w-28 shrink-0" />
              <div className="text-xs">
                <div className="text-[10px] text-[var(--term-dim)]">TARGET PROFILE:</div>
                <div className="font-bold text-white text-xs">Harrison Kane (CFO)</div>
                <div className="text-[10px] text-amber-400 mt-0.5">Slush Fund Architect</div>
                <p className="text-[11px] text-gray-300 mt-1 leading-snug">
                  Kane authorized payment to "Apex Phantom Holdings LLC" for $45,000 to purchase the rogue AI daemon `0xDEADBEEF`. Cross-reference the breach timestamp below.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: OCR Receipt Magnifier & Mainframe Intrusion Logs (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="border border-[var(--term-border)] bg-[var(--term-panel-bg)] p-4 rounded flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[var(--term-border)] pb-2">
              <span className="font-bold text-[var(--term-main)] text-xs flex items-center gap-1">
                <Search size={14} />
                OCR FORENSIC MAGNIFIER
              </span>
              <span className="text-[10px] text-[var(--term-dim)] font-mono">
                {selectedReceipt.invoiceNo}
              </span>
            </div>

            {/* Receipt Digital Paper Slip */}
            <div className="bg-[#05070a] border border-[var(--term-border)] p-3 rounded text-xs flex flex-col gap-2 font-mono">
              <div className="text-center border-b border-dashed border-[var(--term-border)] pb-2">
                <div className="text-[10px] text-[var(--term-dim)]">CORP-NET EXPENSE VOUCHER</div>
                <div className="text-sm font-black text-white">{selectedReceipt.vendor}</div>
                <div className="text-[10px] text-amber-300">TAX ID: {selectedReceipt.taxId}</div>
                <div className="text-[9px] text-[var(--term-dim)]">TIMESTAMP: {selectedReceipt.date}</div>
              </div>

              {/* Line Items */}
              <div className="py-2 border-b border-dashed border-[var(--term-border)] flex flex-col gap-1 text-[11px]">
                {selectedReceipt.lineItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-gray-200">
                    <span>
                      {item.desc} (x{item.qty})
                    </span>
                    <span className="font-bold">${(item.qty * item.unitCost).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-xs font-bold pt-1 text-white">
                <span>TOTAL BILLED:</span>
                <span className="text-amber-300">${selectedReceipt.amount.toLocaleString()}</span>
              </div>

              <div className="text-[10px] text-[var(--term-dim)] italic bg-black/40 p-1.5 rounded">
                MEMO: "{selectedReceipt.memo}"
              </div>
            </div>

            {/* Mainframe Intrusion Log Correlation Box */}
            {selectedReceipt.matchedIntrusionTimestamp && (
              <div className="border border-red-500/60 bg-red-950/20 p-2.5 rounded text-xs flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-red-400 font-bold text-[10px]">
                  <span className="flex items-center gap-1">
                    <ShieldAlert size={12} /> INTRUSION LOG MATCH AVAILABLE
                  </span>
                  <span>TIME: {selectedReceipt.matchedIntrusionTimestamp}</span>
                </div>

                {matchedLog && (
                  <div className="text-[10px] text-gray-300 bg-black/60 p-2 rounded font-mono">
                    <div>USER: <strong className="text-white">{matchedLog.executiveAccount}</strong></div>
                    <div>IP: <span className="text-red-300">{matchedLog.ip}</span></div>
                    <div className="text-[9px] text-amber-300 mt-1">{matchedLog.action}</div>
                  </div>
                )}

                <button
                  onClick={() => handleCorrelateLog(selectedReceipt)}
                  className="py-1 px-2 bg-red-600/30 border border-red-500 text-red-200 rounded text-[11px] font-bold hover:bg-red-600/40 text-center"
                >
                  🔗 CORRELATE INTRUSION WITH KANE'S BADGE
                </button>
              </div>
            )}

            {/* Audit Decision Buttons */}
            <div className="flex flex-col gap-2 pt-1">
              {selectedReceipt.status === 'pending' ? (
                <>
                  {selectedReceipt.isShellCompany ? (
                    <button
                      onClick={() => handleVoidFraud(selectedReceipt)}
                      className="py-2.5 px-3 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded flex items-center justify-center gap-2 transition-colors animate-pulse"
                    >
                      <ShieldAlert size={14} />
                      <span>🚩 VOID SLUSH INVOICE (-${selectedReceipt.amount.toLocaleString()})</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleVerifyLegitimate(selectedReceipt)}
                      className="py-2.5 px-3 bg-green-600 hover:bg-green-500 text-black font-black text-xs rounded flex items-center justify-center gap-2 transition-colors"
                    >
                      <CheckCircle2 size={14} />
                      <span>✅ APPROVE LEGITIMATE EXPENSE</span>
                    </button>
                  )}
                </>
              ) : (
                <div className="p-2 border border-green-500/40 bg-green-950/20 text-xs text-green-300 rounded text-center font-bold">
                  AUDIT STATUS: {selectedReceipt.status.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
