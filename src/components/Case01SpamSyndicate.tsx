import React, { useState } from 'react';
import { VANE_DIALOGUE_TREE, BASE_EMAILS } from '../lib/casesData';
import { EmailArtifact, CaseDossier } from '../types';
import { AsciiPortrait } from './AsciiPortraits';
import { caseLedger } from '../lib/caseLedger';
import { soundtrack } from '../lib/soundtrack';
import { triggerConfetti } from '../lib/confetti';
import {
  Zap,
  Radio,
  ShieldCheck,
  Package,
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Trash2,
  Key,
  ShieldAlert
} from 'lucide-react';

interface Case01Props {
  caseDossier: CaseDossier;
  onUpdateDossier: (d: Partial<CaseDossier>) => void;
  onReturn: () => void;
  colorTheme: 'green' | 'amber' | 'cyan';
}

export const Case01SpamSyndicate: React.FC<Case01Props> = ({
  caseDossier,
  onUpdateDossier,
  onReturn,
  colorTheme
}) => {
  // Interrogation State
  const [currentNodeId, setCurrentNodeId] = useState('root');
  const [unsubTokenUnlocked, setUnsubTokenUnlocked] = useState(false);
  const [whistleblowerFound, setWhistleblowerFound] = useState(false);
  const [secopsWhitelisted, setSecopsWhitelisted] = useState(false);

  // Mailbox State
  const [unreadCount, setUnreadCount] = useState(5000);
  const [emails, setEmails] = useState<EmailArtifact[]>(BASE_EMAILS);
  const [selectedEmailId, setSelectedEmailId] = useState<string>('em-001');

  const currentNode = VANE_DIALOGUE_TREE[currentNodeId] || VANE_DIALOGUE_TREE.root;
  const selectedEmail = emails.find(e => e.id === selectedEmailId) || emails[0];

  // Handle Dialogue Decision
  const handleSelectOption = (option: any) => {
    soundtrack.playTapeClick();
    soundtrack.playKeypress();

    if (option.unlockEvidence === 'UNSUB_MASTER_TOKEN') {
      setUnsubTokenUnlocked(true);
      soundtrack.playEvidenceUnlocked();
      caseLedger.addEntry({
        caseId: 'case-01',
        caseTitle: 'The Spam Syndicate',
        narrativeTitle: 'Extracted Unsubscribe Master Token',
        realWorldAction: 'Enabled RFC 8058 EMP Bulk Unsubscribe Protocol',
        details: 'Secured master token X-SYN-UNSUB-MASTER-TOKEN-9941 from Agent Vane.',
        statsDelta: { emailsVaporized: 0 },
        snapshotState: { currentNodeId: option.response, unsubTokenUnlocked: true, unreadCount }
      });
      onUpdateDossier({ evidenceCollected: Math.min(3, caseDossier.evidenceCollected + 1) });
    }

    if (option.unlockEvidence === 'WHISTLEBLOWER_LOC_CLUE') {
      soundtrack.playEvidenceUnlocked();
      caseLedger.addEntry({
        caseId: 'case-01',
        caseTitle: 'The Spam Syndicate',
        narrativeTitle: 'Located Whistleblower Memo Coordinates',
        realWorldAction: 'Isolating Concealed Payload in Spam Traffic',
        details: 'Target: "99% OFF Apex Global Synergy Webinar" plain-text footer.',
        statsDelta: {},
        snapshotState: { currentNodeId: option.response, unreadCount }
      });
      onUpdateDossier({ evidenceCollected: Math.min(3, caseDossier.evidenceCollected + 1) });
    }

    if (option.response) {
      setCurrentNodeId(option.response);
      soundtrack.playTensionChord();
    }
  };

  // Laser Vaporize Batch
  const handleLaserVaporize = () => {
    if (unreadCount <= 0) return;
    soundtrack.playLaserZap();

    const batchSize = Math.min(unreadCount, 1250);
    const newCount = Math.max(0, unreadCount - batchSize);
    setUnreadCount(newCount);

    // Vaporize selected email if it is spam or phish
    if (selectedEmail && (selectedEmail.category === 'spam' || selectedEmail.category === 'newsletter')) {
      setEmails(prev => prev.map(e => (e.id === selectedEmail.id ? { ...e, vaporized: true } : e)));
    }

    caseLedger.addEntry({
      caseId: 'case-01',
      caseTitle: 'The Spam Syndicate',
      narrativeTitle: `Laser Vaporized ${batchSize} Corporate Spam Beacons`,
      realWorldAction: `Purged ${batchSize} Unread Junk Mails from Mailbox Partition`,
      details: `Reclaimed 3.8 MB mailbox cache. Neutralized tracking pixels. Remaining: ${newCount}`,
      statsDelta: { emailsVaporized: batchSize },
      snapshotState: { unreadCount: newCount, emails }
    });

    checkCompletion(newCount, whistleblowerFound, secopsWhitelisted);
  };

  // Unsubscribe EMP Blast (Vaporizes all remaining thousands)
  const handleUnsubscribeEmpBlast = () => {
    if (!unsubTokenUnlocked) {
      soundtrack.playErrorBuzz();
      return;
    }
    soundtrack.playEmpBlast();

    const purged = unreadCount;
    setUnreadCount(0);
    setEmails(prev =>
      prev.map(e => (e.category !== 'legitimate' && e.category !== 'whistleblower' ? { ...e, vaporized: true } : e))
    );

    caseLedger.addEntry({
      caseId: 'case-01',
      caseTitle: 'The Spam Syndicate',
      narrativeTitle: 'Dispatched Unsubscribe EMP Blast Across Cartel Botnet',
      realWorldAction: `Automated RFC 2369 / 8058 Unsubscribe Sent; Purged All ${purged.toLocaleString()} Unread Mails`,
      details: 'Master Token verified. 100% affiliate subscriber lists permanently eradicated. Server load normalized.',
      statsDelta: { emailsVaporized: purged },
      snapshotState: { unreadCount: 0 }
    });

    checkCompletion(0, whistleblowerFound, secopsWhitelisted);
  };

  // Decrypt Whistleblower Memo
  const handleDecryptWhistleblower = (email: EmailArtifact) => {
    soundtrack.playEvidenceUnlocked();
    setWhistleblowerFound(true);

    caseLedger.addEntry({
      caseId: 'case-01',
      caseTitle: 'The Spam Syndicate',
      narrativeTitle: 'Decrypted Secret Whistleblower Payload',
      realWorldAction: 'Extracted Fraud Intelligence: $140K Offshore Slush Fund',
      details: 'Identified disguise filename: "Quarterly_Bonus_Spreadsheet.xlsx.exe" in Downloads folder.',
      statsDelta: {},
      snapshotState: { whistleblowerFound: true, unreadCount }
    });

    onUpdateDossier({ evidenceCollected: Math.min(3, caseDossier.evidenceCollected + 1) });
    checkCompletion(unreadCount, true, secopsWhitelisted);
  };

  // Whitelist SecOps
  const handleWhitelistSecOps = (email: EmailArtifact) => {
    soundtrack.playTapeClick();
    setSecopsWhitelisted(true);
    setEmails(prev => prev.map(e => (e.id === email.id ? { ...e, whitelisted: true } : e)));

    caseLedger.addEntry({
      caseId: 'case-01',
      caseTitle: 'The Spam Syndicate',
      narrativeTitle: 'Whitelisted SecOps Alert Domain',
      realWorldAction: 'Added security@corp-net.internal to Permanent Safe List',
      details: 'Preserved vital security intrusion telemetry from being accidentally purged.',
      statsDelta: {},
      snapshotState: { secopsWhitelisted: true, unreadCount }
    });

    checkCompletion(unreadCount, whistleblowerFound, true);
  };

  // Check if Case 01 is completed
  const checkCompletion = (remSpam: number, leakFound: boolean, secWhitelisted: boolean) => {
    if (remSpam === 0 && leakFound) {
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
            CASE 01: THE SPAM SYNDICATE
          </h2>
          <div className="text-xs text-[var(--term-dim)]">
            Objective: Interrogate Agent Vane, extract Unsubscribe Token, purge 5,000 spam beacons, and locate the encrypted whistleblower memo.
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-[var(--term-dim)]">UNREAD SPAM HOARD</div>
            <div className="text-xl font-black text-red-400">
              {unreadCount.toLocaleString()} / 5,000
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
                EXORCISM PROTOCOL COMPLETE: INBOX ZERO ACHIEVED
              </div>
              <div className="text-xs text-green-300">
                5,000 spam beacons purged, Unsubscribe EMP fired, and whistleblower memo decrypted. Case 02 unlocked!
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

      {/* Split Interface: Left = Interrogation Cell, Right = Mailbox Exorcism Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interrogation Cell (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="border border-[var(--term-border)] bg-[var(--term-panel-bg)] p-4 rounded flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[var(--term-border)] pb-2">
              <span className="font-bold text-[var(--term-main)] text-xs flex items-center gap-1.5">
                <Radio size={14} className="animate-pulse" />
                INTERROGATION CELL B-1 // AUDIO TAPE LOG
              </span>
              <span className="text-[10px] text-[var(--term-dim)]">
                SUSPECT: AGENT VANE
              </span>
            </div>

            {/* Suspect ASCII Portrait & Mood */}
            <div className="flex items-start gap-3 bg-black/50 p-3 rounded border border-[var(--term-border)]">
              <AsciiPortrait name="VANE" className="text-[10px] w-32 shrink-0" />
              <div className="text-xs">
                <div className="text-[10px] text-[var(--term-dim)]">PSYCH-EVALUATION:</div>
                <div className="text-xs font-bold text-white">Agent Vane (VP Growth)</div>
                <div className="text-[10px] text-amber-400 mt-0.5">
                  TONE: {currentNode.audioTone?.toUpperCase() || 'HOSTILE'}
                </div>
                <div className="text-[10px] text-[var(--term-dim)] mt-2">
                  STATUS: {unsubTokenUnlocked ? 'COMPLIANT (TOKEN REVEALED)' : 'DEFENSIVE'}
                </div>
              </div>
            </div>

            {/* Dialogue Dialogue Box */}
            <div className="p-3 bg-black/60 border border-[var(--term-border)] rounded text-xs min-h-[90px] flex flex-col justify-between">
              <div className="text-[10px] text-[var(--term-main)] font-bold mb-1">
                {currentNode.speaker} ({currentNode.speakerTitle}):
              </div>
              <p className="text-gray-100 leading-relaxed text-xs italic">
                "{currentNode.text}"
              </p>
              <div className="text-right text-[9px] text-[var(--term-dim)] mt-2">
                RECORDER: TAPE-INDEX #041
              </div>
            </div>

            {/* Interactive Interrogation Choices */}
            <div className="flex flex-col gap-2">
              <div className="text-[10px] font-bold text-[var(--term-dim)]">
                SELECT INTERROGATION TACTIC:
              </div>
              {currentNode.options.length > 0 ? (
                currentNode.options.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt)}
                    className="p-2.5 text-left border border-[var(--term-border)] bg-black/30 hover:bg-[var(--term-main)]/10 hover:border-[var(--term-main)] text-xs text-white rounded transition-colors"
                  >
                    {opt.label}
                  </button>
                ))
              ) : (
                <div className="p-3 border border-green-500/40 bg-green-950/20 text-xs text-green-300 rounded">
                  Suspect has yielded. Proceed to Mailbox Terminal on the right to complete the purge.
                </div>
              )}
            </div>

            {/* Unlocked Master Token Badge */}
            {unsubTokenUnlocked && (
              <div className="p-2.5 border border-amber-500/60 bg-amber-950/30 rounded text-xs flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300">
                  <Key size={14} />
                  <span className="font-bold">UNSUB TOKEN:</span>
                  <code className="bg-black px-1.5 py-0.5 rounded text-[10px] text-amber-200">
                    X-SYN-UNSUB-MASTER-TOKEN-9941
                  </code>
                </div>
                <span className="text-[10px] text-amber-400 font-bold">READY</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Corp-Net Mailbox Exorcism Terminal (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="border border-[var(--term-border)] bg-[var(--term-panel-bg)] p-4 rounded flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[var(--term-border)] pb-2">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-[var(--term-main)]" />
                <span className="font-bold text-white text-xs">
                  CORP-NET EXCHANGE PARTITION // /var/mail/deckard
                </span>
              </div>
              <div className="text-xs text-[var(--term-dim)]">
                SIMULATED LIVE IMAP REPOSITORY
              </div>
            </div>

            {/* Tactical Exorcism Action Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={handleLaserVaporize}
                disabled={unreadCount <= 0}
                className="py-2.5 px-3 bg-red-600/20 border border-red-500/50 hover:bg-red-600/30 text-red-300 font-bold text-xs rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
              >
                <Zap size={14} className="text-red-400" />
                <span>⚡ LASER VAPORIZER (-1,250 SPAM)</span>
              </button>

              <button
                onClick={handleUnsubscribeEmpBlast}
                disabled={!unsubTokenUnlocked || unreadCount <= 0}
                className={`py-2.5 px-3 border font-bold text-xs rounded flex items-center justify-center gap-2 transition-colors ${
                  unsubTokenUnlocked && unreadCount > 0
                    ? 'bg-[var(--term-main)] text-black border-[var(--term-main)] animate-pulse'
                    : 'border-[var(--term-border)] text-[var(--term-dim)] opacity-40 cursor-not-allowed'
                }`}
              >
                <Radio size={14} />
                <span>🌀 UNSUBSCRIBE EMP (PURGE ALL 5,000)</span>
              </button>
            </div>

            {/* Email List Table */}
            <div className="border border-[var(--term-border)] rounded overflow-hidden">
              <div className="bg-black/60 px-3 py-1.5 border-b border-[var(--term-border)] text-[10px] text-[var(--term-dim)] flex justify-between">
                <span>INCOMING PACKETS & HEADERS</span>
                <span>STATUS / CLASSIFICATION</span>
              </div>
              <div className="divide-y divide-[var(--term-border)] max-h-52 overflow-y-auto">
                {emails.map(em => (
                  <div
                    key={em.id}
                    onClick={() => {
                      soundtrack.playKeypress();
                      setSelectedEmailId(em.id);
                    }}
                    className={`p-2.5 cursor-pointer text-xs transition-colors flex items-center justify-between ${
                      selectedEmailId === em.id
                        ? 'bg-[var(--term-main)]/15 text-white'
                        : 'hover:bg-white/5 text-gray-300'
                    } ${em.vaporized ? 'opacity-30 line-through' : ''}`}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <div className="flex items-center gap-1.5 font-bold text-white text-[11px] truncate">
                        {em.isWhistleblowerClue && (
                          <span className="text-amber-400 font-black">★</span>
                        )}
                        <span>{em.sender}</span>
                        <span className="text-[10px] text-[var(--term-dim)] font-normal">
                          &lt;{em.email}&gt;
                        </span>
                      </div>
                      <div className="text-[11px] text-[var(--term-dim)] truncate">
                        {em.subject}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-[10px]">
                      {em.vaporized ? (
                        <span className="text-red-400 font-bold">VAPORIZED</span>
                      ) : em.whitelisted ? (
                        <span className="text-green-400 font-bold">WHITELISTED</span>
                      ) : (
                        <span className="px-1.5 py-0.5 border border-[var(--term-border)] rounded text-[var(--term-dim)] uppercase">
                          {em.category}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Inspection & Forensic Decoder Panel */}
            {selectedEmail && (
              <div className="border border-[var(--term-border)] bg-black/60 p-3 rounded text-xs flex flex-col gap-2">
                <div className="flex items-start justify-between border-b border-[var(--term-border)]/50 pb-2">
                  <div>
                    <div className="text-[10px] text-[var(--term-dim)]">INSPECTING HEADERS:</div>
                    <div className="font-bold text-white text-xs">{selectedEmail.subject}</div>
                    <div className="text-[10px] text-[var(--term-main)]">
                      FROM: {selectedEmail.sender} ({selectedEmail.email}) | {selectedEmail.date}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedEmail.hasTrackingPixel && (
                      <span className="text-[10px] bg-red-950/60 border border-red-500/40 text-red-300 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <ShieldAlert size={10} /> 1x1 TRACKING PIXEL DETECTED
                      </span>
                    )}
                  </div>
                </div>

                {/* Email Body */}
                <pre className="font-mono text-[11px] text-gray-200 bg-black/80 p-2.5 rounded border border-[var(--term-border)]/60 whitespace-pre-wrap max-h-36 overflow-y-auto">
                  {selectedEmail.body}
                </pre>

                {/* Email Action Buttons */}
                <div className="flex items-center justify-between pt-1">
                  <div className="text-[10px] text-[var(--term-dim)]">
                    SIZE: {selectedEmail.sizeKb} KB
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedEmail.category === 'legitimate' && !selectedEmail.whitelisted && (
                      <button
                        onClick={() => handleWhitelistSecOps(selectedEmail)}
                        className="px-2.5 py-1 bg-green-600/20 border border-green-500 text-green-300 rounded text-xs font-bold hover:bg-green-600/30"
                      >
                        🛡️ WHITELIST SENDER
                      </button>
                    )}

                    {selectedEmail.isWhistleblowerClue && !whistleblowerFound && (
                      <button
                        onClick={() => handleDecryptWhistleblower(selectedEmail)}
                        className="px-3 py-1 bg-amber-500 text-black rounded text-xs font-bold hover:bg-amber-400 animate-pulse"
                      >
                        🔍 DECRYPT WHISTLEBLOWER PAYLOAD
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
