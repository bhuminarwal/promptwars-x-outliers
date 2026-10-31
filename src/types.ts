export type TerminalTheme = 'green' | 'amber' | 'cyan';

export type CaseStatus = 'OPEN' | 'INVESTIGATING' | 'EXORCISED';

export interface CaseDossier {
  id: 'case-01' | 'case-02' | 'case-03' | 'case-04';
  codeNumber: string;
  title: string;
  subtitle: string;
  narrativeBrief: string;
  suspectName: string;
  suspectRole: string;
  suspectPortrait: string; // ASCII or key
  targetHoarding: string;
  realWorldImpact: string;
  status: CaseStatus;
  evidenceCollected: number;
  totalEvidence: number;
  progressPercent: number;
  classification: string;
}

// Case 01: Spam Syndicate
export interface DialogueOption {
  id: string;
  label: string;
  response: string;
  nextDialogId?: string;
  actionType?: 'pressure' | 'leverage' | 'entrap' | 'sympathize';
  unlockEvidence?: string;
  realChoreTrigger?: string;
  ledgerMessage?: string;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  speakerTitle: string;
  portrait: string;
  text: string;
  audioTone?: 'neutral' | 'nervous' | 'hostile' | 'defeated';
  options: DialogueOption[];
}

export interface EmailArtifact {
  id: string;
  sender: string;
  email: string;
  subject: string;
  date: string;
  sizeKb: number;
  category: 'spam' | 'phish' | 'newsletter' | 'whistleblower' | 'legitimate';
  unread: boolean;
  hasTrackingPixel: boolean;
  unsubUrl: string;
  snippet: string;
  body: string;
  vaporized: boolean;
  quarantined: boolean;
  whitelisted: boolean;
  isWhistleblowerClue?: boolean;
}

// Case 02: Download Abyss
export interface DownloadArtifact {
  id: string;
  filename: string;
  disguisedExtension?: string;
  realType: string;
  sizeBytes: number;
  sha256: string;
  dateDownloaded: string;
  category: 'malware' | 'duplicate_invoice' | 'bloat_dump' | 'audio_wiretap' | 'whistleblower_doc' | 'temp_junk';
  state: 'downloads' | 'vault' | 'incinerated' | 'quarantined';
  matchedDuplicateId?: string;
  threatLevel: 'NONE' | 'LOW' | 'CRITICAL' | 'EVIDENCE';
  description: string;
}

// Case 03: Phantom Ledger
export interface ExpenseReceipt {
  id: string;
  invoiceNo: string;
  date: string;
  vendor: string;
  department: string;
  amount: number;
  status: 'pending' | 'flagged_fraud' | 'cleared' | 'voided';
  taxId: string;
  isShellCompany: boolean;
  memo: string;
  matchedIntrusionTimestamp?: string;
  lineItems: Array<{ desc: string; qty: number; unitCost: number }>;
}

export interface IntrusionLog {
  timestamp: string;
  ip: string;
  executiveAccount: string;
  action: string;
  exfiltratedHash: string;
}

// Case 04: Bytecode Heresy
export interface CorruptedModule {
  id: string;
  filename: string;
  serviceName: string;
  threat: string;
  errorType: 'syntax_poison' | 'memory_leak' | 'eval_backdoor' | 'infinite_recursion' | 'dangling_promise';
  corruptedCode: string;
  fixedCode: string;
  explanation: string;
  fixed: boolean;
  daemonDamage: number;
}

export interface DaemonState {
  name: string;
  health: number;
  maxHealth: number;
  corruptionLevel: number;
  status: 'DORMANT' | 'AGITATED' | 'CRITICAL' | 'EXORCISED';
}

// Case Ledger & Dual-State Time-Travel
export interface LedgerEntry {
  id: string;
  timestamp: string;
  caseId: string;
  caseTitle: string;
  narrativeTitle: string;
  realWorldAction: string;
  details: string;
  statsDelta: {
    emailsVaporized?: number;
    bytesReclaimed?: number;
    fraudDollarsBlocked?: number;
    bugsPatched?: number;
    co2GramsSaved?: number;
  };
  snapshotState: any; // snapshot of entire game store for full rollback
}

export interface GlobalTelemetry {
  emailsVaporized: number;
  bytesReclaimed: number;
  fraudDollarsBlocked: number;
  bugsPatched: number;
  minutesSaved: number;
  co2GramsSaved: number;
}
