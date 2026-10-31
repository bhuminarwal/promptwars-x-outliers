import { LedgerEntry, GlobalTelemetry } from '../types';

class CaseLedgerStore {
  private history: LedgerEntry[] = [];
  private telemetry: GlobalTelemetry = {
    emailsVaporized: 0,
    bytesReclaimed: 0,
    fraudDollarsBlocked: 0,
    bugsPatched: 0,
    minutesSaved: 0,
    co2GramsSaved: 0
  };

  private listeners: Array<() => void> = [];

  constructor() {
    // Pre-seed an initial Genesis ledger block
    this.addEntry({
      caseId: 'SYSTEM',
      caseTitle: 'Corp-Net Terminal Initialization',
      narrativeTitle: 'Detective Rick "Null" Deckard Logged In',
      realWorldAction: 'Digital Exorcist Protocol Activated',
      details: 'Audit logging initialized. Zero-tamper forensic ledger engaged.',
      statsDelta: {},
      snapshotState: null
    });
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  public getHistory(): LedgerEntry[] {
    return [...this.history];
  }

  public getTelemetry(): GlobalTelemetry {
    return { ...this.telemetry };
  }

  public addEntry(entryData: Omit<LedgerEntry, 'id' | 'timestamp'>): LedgerEntry {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const entry: LedgerEntry = {
      id: `TX-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      timestamp: timeStr,
      ...entryData
    };

    this.history.unshift(entry); // newest first

    // Accumulate telemetry
    if (entryData.statsDelta) {
      if (entryData.statsDelta.emailsVaporized) {
        this.telemetry.emailsVaporized += entryData.statsDelta.emailsVaporized;
        this.telemetry.minutesSaved += Math.round(entryData.statsDelta.emailsVaporized * 0.2); // ~12 sec saved per email
        this.telemetry.co2GramsSaved += Number((entryData.statsDelta.emailsVaporized * 0.3).toFixed(1)); // ~0.3g CO2 per unread spam stored
      }
      if (entryData.statsDelta.bytesReclaimed) {
        this.telemetry.bytesReclaimed += entryData.statsDelta.bytesReclaimed;
      }
      if (entryData.statsDelta.fraudDollarsBlocked) {
        this.telemetry.fraudDollarsBlocked += entryData.statsDelta.fraudDollarsBlocked;
      }
      if (entryData.statsDelta.bugsPatched) {
        this.telemetry.bugsPatched += entryData.statsDelta.bugsPatched;
        this.telemetry.minutesSaved += entryData.statsDelta.bugsPatched * 15; // 15 mins saved per debugged bug
      }
    }

    this.notify();
    return entry;
  }

  /**
   * Time-Travel Rollback:
   * Restores state to the selected ledger point and truncates subsequent history
   */
  public rollbackTo(entryId: string): any | null {
    const targetIndex = this.history.findIndex(e => e.id === entryId);
    if (targetIndex === -1) return null;

    const targetEntry = this.history[targetIndex];
    if (!targetEntry.snapshotState) {
      console.warn('Selected entry does not contain a restorable snapshot');
      return null;
    }

    // Keep entries from target onwards (since history is descending)
    this.history = this.history.slice(targetIndex);

    // Recalculate telemetry from remaining history
    this.telemetry = {
      emailsVaporized: 0,
      bytesReclaimed: 0,
      fraudDollarsBlocked: 0,
      bugsPatched: 0,
      minutesSaved: 0,
      co2GramsSaved: 0
    };

    for (let i = this.history.length - 1; i >= 0; i--) {
      const e = this.history[i];
      if (e.statsDelta) {
        if (e.statsDelta.emailsVaporized) {
          this.telemetry.emailsVaporized += e.statsDelta.emailsVaporized;
          this.telemetry.minutesSaved += Math.round(e.statsDelta.emailsVaporized * 0.2);
          this.telemetry.co2GramsSaved += Number((e.statsDelta.emailsVaporized * 0.3).toFixed(1));
        }
        if (e.statsDelta.bytesReclaimed) {
          this.telemetry.bytesReclaimed += e.statsDelta.bytesReclaimed;
        }
        if (e.statsDelta.fraudDollarsBlocked) {
          this.telemetry.fraudDollarsBlocked += e.statsDelta.fraudDollarsBlocked;
        }
        if (e.statsDelta.bugsPatched) {
          this.telemetry.bugsPatched += e.statsDelta.bugsPatched;
          this.telemetry.minutesSaved += e.statsDelta.bugsPatched * 15;
        }
      }
    }

    this.notify();
    return targetEntry.snapshotState;
  }

  public exportAuditReport(): string {
    let report = `=======================================================\n`;
    report += ` CORP-NET FORENSIC AUDIT & DECLUTTERING DISPATCH\n`;
    report += ` INVESTIGATOR: DETECTIVE RICK "NULL" DECKARD\n`;
    report += ` TIMESTAMP: ${new Date().toISOString()}\n`;
    report += `=======================================================\n\n`;
    report += `TELEMETRY METRICS:\n`;
    report += ` - Emails Vaporized:      ${this.telemetry.emailsVaporized.toLocaleString()}\n`;
    report += ` - Storage Reclaimed:     ${(this.telemetry.bytesReclaimed / (1024 * 1024 * 1024)).toFixed(2)} GB\n`;
    report += ` - Slush Fraud Blocked:   $${this.telemetry.fraudDollarsBlocked.toLocaleString()}\n`;
    report += ` - Bytecode Bugs Fixed:   ${this.telemetry.bugsPatched}\n`;
    report += ` - Time Saved:            ${this.telemetry.minutesSaved} Minutes\n`;
    report += ` - Estimated CO2 Saved:   ${this.telemetry.co2GramsSaved.toFixed(1)} Grams\n\n`;
    report += `TIMELINE AUDIT TRAIL:\n`;
    this.history.forEach(item => {
      report += `[${item.timestamp}] [${item.id}] [${item.caseId}]\n`;
      report += `  ACTION: ${item.narrativeTitle} -> ${item.realWorldAction}\n`;
      report += `  DETAIL: ${item.details}\n\n`;
    });
    return report;
  }
}

export const caseLedger = new CaseLedgerStore();
