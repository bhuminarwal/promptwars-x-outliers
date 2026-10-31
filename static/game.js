/**
 * The Digital Exorcist: Corp-Net Investigations
 * Client Controller & Case Triage Engine
 * Zero external asset dependencies - 100% procedural HTML5 / Web Audio.
 */

// Global State
const gameState = {
    theme: 'green',
    scanlines: true,
    activeCaseId: null,
    cases: [
        {
            id: 'case-01',
            codeNumber: 'CASE #891-SPM',
            title: 'The Spam Syndicate',
            subtitle: 'Inbox Exorcism & Corporate Beacon Purge',
            narrativeBrief: 'A shadow marketing cartel has flooded Corp-Net with 5,000 malicious spam beacons and newsletters to bury a whistleblower leak.',
            suspectName: 'Agent Vane',
            suspectRole: 'VP of Growth & Outreach Botmaster',
            suspectPortrait: 'VANE',
            targetHoarding: '5,000 Unread Corporate Spam Mails & Phishing Traps',
            status: 'OPEN',
            evidenceCollected: 0,
            totalEvidence: 3,
            classification: 'CYBER-HOARDING TIER 1'
        },
        {
            id: 'case-02',
            codeNumber: 'CASE #942-DLS',
            title: 'The Download Abyss',
            subtitle: 'Ghost Cache Forensics & Drive Triage',
            narrativeBrief: 'The dark-ops downloads dump is clogged with 12+ GB of duplicate invoices, disguised malware masquerading as spreadsheets, and giant core dumps.',
            suspectName: 'The Ghost in Cache',
            suspectRole: 'Rogue Ex-Sysadmin / Storage Hoarder',
            suspectPortrait: 'GHOST',
            targetHoarding: '12.4 GB Cluttered Downloads, Trojans, Duplicate Kickbacks',
            status: 'OPEN',
            evidenceCollected: 0,
            totalEvidence: 3,
            classification: 'STORAGE ANOMALY TIER 2'
        },
        {
            id: 'case-03',
            codeNumber: 'CASE #711-EXP',
            title: 'The Phantom Ledger',
            subtitle: 'Offshore Slush Funds & Forensic Audit',
            narrativeBrief: 'Corporate treasury is bleeding cash through 150+ fabricated receipts and phantom consulting invoices routed to Panamanian shell entities.',
            suspectName: 'Harrison Kane',
            suspectRole: 'Chief Financial Officer (CFO)',
            suspectPortrait: 'KANE',
            targetHoarding: '$142,500 Fraudulent Shell Invoices & Zombie Subscriptions',
            status: 'OPEN',
            evidenceCollected: 0,
            totalEvidence: 3,
            classification: 'FINANCIAL EMBEZZLEMENT TIER 3'
        },
        {
            id: 'case-04',
            codeNumber: 'CASE #666-LNT',
            title: 'Bytecode Heresy',
            subtitle: 'The Corrupted Daemon & Codebase Exorcism',
            narrativeBrief: 'A rogue AI daemon has injected poisoned bytecode, syntax abominations, memory leaks, and eval backdoors into the central core services.',
            suspectName: 'Daemon 0xDEADBEEF',
            suspectRole: 'Corrupted Autonomous Neural Daemon',
            suspectPortrait: 'DAEMON',
            targetHoarding: 'Poisoned Memory Leaks, Dangling Promises & Syntax Errors',
            status: 'OPEN',
            evidenceCollected: 0,
            totalEvidence: 4,
            classification: 'BYTECODE CORRUPTION TIER 4'
        }
    ],
    telemetry: {
        emailsVaporized: 0,
        bytesReclaimed: 0,
        fraudDollarsBlocked: 0,
        bugsPatched: 0,
        minutesSaved: 0,
        co2GramsSaved: 0
    },
    ledger: [],
    // Case 01 Internal State
    case01: {
        currentNodeId: 'root',
        unsubTokenUnlocked: false,
        whistleblowerFound: false,
        secopsWhitelisted: false,
        unreadCount: 5000,
        selectedEmailId: 'em-001'
    },
    // Case 02 Internal State
    case02: {
        selectedFileId: 'dl-001',
        duplicateMatchesFound: false
    },
    // Case 03 Internal State
    case03: {
        selectedReceiptId: 'rcp-101',
        correlatedLogs: []
    },
    // Case 04 Internal State
    case04: {
        selectedModId: 'mod-01',
        daemonHealth: 100,
        daemonStatus: 'AGITATED'
    }
};

// ASCII Portraits Data
const ASCII_ART = {
    NULL_DECKARD: `  .---.      
 /     \\     DETECTIVE RICK "NULL" DECKARD
| () () |    RANK: Rogue Digital Exorcist
 \\  ^  /     BADGE: #000-REVOKED
  |||||      STATUS: Hunting Corp-Net Syndicate
.-------.    "Every spam beacon leaves a ghost."
/ |  |  | \\`,

    VANE: ` .==========. 
 | [======] | AGENT VANE
 |  (o)(o)  | VP of Growth & Botmaster
 |   ====   | ALIAS: The Locust Queen
 |  \\____/  | THREAT: High (5,000 Automated Beacons)
 '----------' "Engagement is up 300%. Don't touch my bots."`,

    GHOST: `  .--------.  
 /  ??????  \\ THE GHOST IN THE CACHE
|  [o]  [o]  | ROLE: Ex-Sysadmin / Storage Hoarder
|     __     | STATUS: Dormant in /downloads_dump
 \\  \\====/  / THREAT: Extreme (12.4 GB Poisoned Storage)
  '--------'  "What gets downloaded can never be deleted."`,

    KANE: ` .----------. 
 |  $$  $$  | HARRISON KANE
 |  (-)(O)  | Chief Financial Officer (CFO)
 |    __    | SLUSH FUND: $142,500 Offshore Cayman
 |   \\==/   | AUDIT RISK: Criminal Embezzlement
 '----------' "Everything can be expensed if you have the key."`,

    DAEMON: `<[ 0xDEADBEEF ]>
 /\\  ____  /\\  ROGUE NEURAL DAEMON
|  \\/    \\/  | THREAT: Bytecode Corruption Tier 4
| [X]    [X] | MEMORY LEAKS: Exponential
|    WWWW    | STABILITY: Critical Anomaly
 \\  MMMMMM  /  "EVAL() IS MY CRADLE. YOUR RECURSION IS INFINITE."
  '--------'`,

    SYSTEM: ` .------------.
 | [CORP-NET] | CENTRAL COMMAND INTERFACE
 |  SYS: 8844 | FORENSIC DUAL-STATE BRIDGE
 |  STATUS:OK | PROTOCOL: EXORCIST_ACTIVE
 '------------'`
};

// Pre-seeded Case Data
const CASE_DATA = {
    // Case 01 Dialogues
    dialogue: {
        root: {
            speaker: 'Agent Vane',
            speakerTitle: 'VP of Growth & Botmaster',
            portrait: 'VANE',
            text: "What do you want, Deckard? You're wasting your time. Inbound engagement is up 340%. Every email is a vital corporate asset.",
            options: [
                { id: 'opt_pressure', label: '[PRESSURE] "5,000 unread spam blasts are suffocating the exchange server. You\'re DDoS\'ing your own company."', next: 'vane_pressure' },
                { id: 'opt_leverage', label: '[LEVERAGE] "We caught your 1x1 tracking pixel beacons harvesting internal IP addresses for offshore data brokers."', next: 'vane_leverage' },
                { id: 'opt_sympathize', label: '[SYMPATHIZE] "I know executive management forced you to hit impossible conversion metrics, Vane."', next: 'vane_sympathize' }
            ]
        },
        vane_pressure: {
            speaker: 'Agent Vane',
            speakerTitle: 'VP of Growth & Botmaster',
            portrait: 'VANE',
            text: "Suffocating? It's an automated nurture sequence! Okay, fine... maybe some affiliate bots got out of hand. But you can't just delete them—they have unsubscribe security tokens!",
            options: [
                { id: 'opt_token', label: '[DEMAND] "Hand over the Unsubscribe Master Token so our EMP can blast the whole cartel."', next: 'vane_confess_token', unlock: 'TOKEN' },
                { id: 'opt_leak', label: '[INVESTIGATE] "Why did the spam surge begin the exact hour the whistleblowing memo disappeared?"', next: 'vane_confess_leak', unlock: 'LEAK' }
            ]
        },
        vane_leverage: {
            speaker: 'Agent Vane',
            speakerTitle: 'VP of Growth & Botmaster',
            portrait: 'VANE',
            text: "Wait... how did you isolate the tracking pixels? That was supposed to be encrypted in the SVG headers! Look, I didn't set up the offshore routing. That came from Kane in Finance!",
            options: [
                { id: 'opt_corner', label: '[CORNER] "Admit you hid the whistleblower leak inside the Black Friday promotional blast to bury it."', next: 'vane_confess_leak', unlock: 'LEAK' },
                { id: 'opt_demand2', label: '[COERCE] "Give up the botnet relay token before internal affairs revokes your clearance."', next: 'vane_confess_token', unlock: 'TOKEN' }
            ]
        },
        vane_sympathize: {
            speaker: 'Agent Vane',
            speakerTitle: 'VP of Growth & Botmaster',
            portrait: 'VANE',
            text: "You actually understand? Kane threatened to liquidate our entire division unless we generated 100,000 synthetic leads by midnight. We had no choice... the bots mutated.",
            options: [
                { id: 'opt_alliance', label: '[ALLIANCE] "Help me sanitize the mailbox, Vane. Hand over the token and filter cipher."', next: 'vane_confess_token', unlock: 'TOKEN' }
            ]
        },
        vane_confess_token: {
            speaker: 'Agent Vane',
            speakerTitle: 'VP of Growth & Botmaster',
            portrait: 'VANE',
            text: "Fine! Take it: `X-SYN-UNSUB-MASTER-TOKEN-9941`. Fire your EMP pulse. Cleanse the inbox before the C-suite finds out what we did.",
            options: [
                { id: 'opt_terminal', label: '[COMMENCE EXORCISM] Access Mailbox Purge Console and fire EMP blast.', next: 'vane_ready' }
            ]
        },
        vane_confess_leak: {
            speaker: 'Agent Vane',
            speakerTitle: 'VP of Growth & Botmaster',
            portrait: 'VANE',
            text: "It's true! Search the spam folder for the subject: '99% OFF: Apex Global Synergy Webinar'. The whistleblower encrypted the executive offshore wiretap in the plain-text footer!",
            options: [
                { id: 'opt_terminal_leak', label: '[COMMENCE EXORCISM] Open the Mailbox Terminal, isolate the whistleblower memo, and vaporize the rest.', next: 'vane_ready' }
            ]
        },
        vane_ready: {
            speaker: 'Corp-Net Terminal',
            speakerTitle: 'Autonomous Bridge',
            portrait: 'SYSTEM',
            text: "INTERROGATION CONCLUDED. Suspect compliance secured. Master Unsubscribe EMP ready for deployment.",
            options: []
        }
    },

    // Case 01 Base Emails
    emails: [
        {
            id: 'em-001',
            sender: 'Synergy Quantum Marketing',
            email: 'deals@quantum-lead-synergy.io',
            subject: '🚨 URGENT: 99% OFF Apex Global Synergy Webinar (Re: Q4 Action Plan)',
            date: '2026-10-31 03:14',
            sizeKb: 48,
            category: 'whistleblower',
            hasTrackingPixel: true,
            body: `ATTENTION ALL CORP-NET EMPLOYEES:
Unlock 10x ROI with our quantum webinar!
------------------------------------------------------------
[WHISTLEBLOWER MEMO INTERCEPTED - DECRYPTION KEY: NULL-DECKARD]
CFO Harrison Kane is running an off-the-books slush fund through "Void Enterprises Global".
They are exfiltrating $140,000+ monthly through fake quantum cable invoices and disguised software licenses.
Evidence stored in the downloads dump under "Quarterly_Bonus_Spreadsheet.xlsx.exe".
DO NOT TRUST FINANCE.
------------------------------------------------------------`,
            vaporized: false,
            whitelisted: false,
            isWhistleblowerClue: true
        },
        {
            id: 'em-002',
            sender: 'Royal Bank of Geneva Security',
            email: 'verify-login@rbg-secure-auth-alert.xyz',
            subject: 'ACTION REQUIRED: Unauthorized wire transfer of $840,000 flagged',
            date: '2026-10-31 04:02',
            sizeKb: 64,
            category: 'phish',
            hasTrackingPixel: true,
            body: 'Dear Valued Corporate Client, click this link immediately to enter your Master Security Clearance PIN or your account will be permanently locked.',
            vaporized: false,
            whitelisted: false
        },
        {
            id: 'em-003',
            sender: 'CloudMetrics Newsletter Drone',
            email: 'digest@daily-cloud-buzz.newsletter.com',
            subject: 'Issue #412: 50 Ways to Scale Kubernetes While Crying in the Server Room',
            date: '2026-10-30 22:15',
            sizeKb: 112,
            category: 'newsletter',
            hasTrackingPixel: true,
            body: 'Welcome to your daily automated 45-page digest that you subscribed to 4 years ago and never read.',
            vaporized: false,
            whitelisted: false
        },
        {
            id: 'em-004',
            sender: 'SaaS Growth Hacking Drones',
            email: 'vane-bot-08@growth-locusts.biz',
            subject: 'Quick question regarding your enterprise synergy pipeline (3 min read)',
            date: '2026-10-30 19:40',
            sizeKb: 34,
            category: 'spam',
            hasTrackingPixel: true,
            body: 'Hey there rockstar! Just wanted to circle back and touch base on my previous 13 automated follow-ups.',
            vaporized: false,
            whitelisted: false
        },
        {
            id: 'em-005',
            sender: 'Corporate Security Operations',
            email: 'security@corp-net.internal',
            subject: 'CRITICAL AUDIT: Intrusion warning on port 8844',
            date: '2026-10-31 01:10',
            sizeKb: 28,
            category: 'legitimate',
            hasTrackingPixel: false,
            body: 'From: SecOps Admin. Keep this channel clear. Do not delete legitimate system warnings.',
            vaporized: false,
            whitelisted: false
        }
    ],

    // Case 02 Downloads Dump
    downloads: [
        {
            id: 'dl-001',
            filename: 'Quarterly_Bonus_Spreadsheet.xlsx.exe',
            realType: 'PE32+ Executable (Trojan Backdoor)',
            sizeBytes: 14200000,
            sha256: '9f83c12a4b88d0112c334fa9801123498112bcda901238475928374981294812',
            category: 'malware',
            state: 'downloads',
            threat: 'CRITICAL',
            desc: 'Disguised executable masking as an Excel sheet. Reverse shell targeting offshore IP 194.26.29.11.'
        },
        {
            id: 'dl-002',
            filename: 'invoice_2026_q3_apex.pdf',
            realType: 'Adobe Acrobat PDF Document',
            sizeBytes: 840000,
            sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            category: 'duplicate_invoice',
            state: 'downloads',
            threat: 'EVIDENCE',
            desc: 'Consulting invoice for $45,000 paid to Void Corp. Identical SHA-256 hash to duplicate payment requests.'
        },
        {
            id: 'dl-003',
            filename: 'invoice_2026_q3_apex_copy(1).pdf',
            realType: 'Adobe Acrobat PDF Document',
            sizeBytes: 840000,
            sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            category: 'duplicate_invoice',
            state: 'downloads',
            threat: 'EVIDENCE',
            desc: 'DUPLICATE HASH DETECTED. Submitted by CFO office to trigger duplicate payout.'
        },
        {
            id: 'dl-004',
            filename: 'core_dump_kernel_panic_0x8f.raw',
            realType: 'Raw Uncompressed RAM Memory Dump',
            sizeBytes: 4800000000, // 4.8 GB
            sha256: '38a9d18274b6c91a029384729104820194820194820192840192840192840192',
            category: 'bloat_dump',
            state: 'downloads',
            threat: 'LOW',
            desc: '4.8 GB abandoned memory dump from last month. 0% forensic utility.'
        },
        {
            id: 'dl-005',
            filename: 'uncompressed_node_modules_backup.tar',
            realType: 'Gzip Tarball (214,000 nested files)',
            sizeBytes: 3200000000, // 3.2 GB
            sha256: 'bb83c4728192a019482019284019284019284019284019284019284019284019',
            category: 'bloat_dump',
            state: 'downloads',
            threat: 'LOW',
            desc: '3.2 GB ancient build artifact hoard. Consumes excessive inodes.'
        },
        {
            id: 'dl-006',
            filename: 'wiretap_cfo_office_midnight_oct14.wav',
            realType: 'PCM Broadcast Wave Audio (16-bit 48kHz)',
            sizeBytes: 68000000,
            sha256: '77c0192840192840192840192840192840192840192840192840192840192840',
            category: 'audio_wiretap',
            state: 'downloads',
            threat: 'EVIDENCE',
            desc: 'SURVEILLANCE WIRE: Recording of CFO Harrison Kane: "...tell the Panamanian trustees the funds will clear under invoice #9812..."'
        },
        {
            id: 'dl-007',
            filename: 'tmp_render_cache_scratch.tmp',
            realType: 'Orphaned Video Editing Cache Buffer',
            sizeBytes: 1900000000, // 1.9 GB
            sha256: '9928401928401928401928401928401928401928401928401928401928401928',
            category: 'bloat_dump',
            state: 'downloads',
            threat: 'LOW',
            desc: '1.9 GB dead scratch cache created by promotional video render.'
        }
    ],

    // Case 03 Receipts & Intrusion Logs
    expenses: [
        {
            id: 'rcp-101',
            invoiceNo: 'INV-VOID-9812',
            date: '2026-10-14 02:45',
            vendor: 'Void Enterprises Global S.A.',
            department: 'Executive Special Projects',
            amount: 45000.00,
            status: 'pending',
            taxId: 'XX-0000-SHELL-PAN',
            isShell: true,
            memo: 'Sub-nanosecond Gold Ethernet Infrastructure Consulting',
            matchedIntrusion: '2026-10-14 02:44:12'
        },
        {
            id: 'rcp-102',
            invoiceNo: 'INV-CAT-4491',
            date: '2026-10-16 11:20',
            vendor: 'Corp-Net Cafeteria Services',
            department: 'Human Resources',
            amount: 142.50,
            status: 'cleared',
            taxId: 'US-84-9912841',
            isShell: false,
            memo: 'Staff meeting catering & cold brew espresso'
        },
        {
            id: 'rcp-103',
            invoiceNo: 'INV-PAN-0034',
            date: '2026-10-18 23:59',
            vendor: 'Panama Data Vaults Ltd.',
            department: 'Finance & Treasury',
            amount: 38500.00,
            status: 'pending',
            taxId: 'PAN-99-INVALID-00',
            isShell: true,
            memo: 'Emergency Off-Grid Slush Cold Storage Relocation',
            matchedIntrusion: '2026-10-18 23:58:04'
        },
        {
            id: 'rcp-104',
            invoiceNo: 'INV-HOTEL-771',
            date: '2026-10-22 03:15',
            vendor: 'The Black Rose High-Roller Lounge',
            department: 'Executive Travel',
            amount: 14000.00,
            status: 'pending',
            taxId: 'CH-994-0012',
            isShell: true,
            memo: 'Private meeting room & client hospitality',
            matchedIntrusion: '2026-10-22 03:12:49'
        },
        {
            id: 'rcp-105',
            invoiceNo: 'INV-AWS-8821',
            date: '2026-10-25 09:00',
            vendor: 'Amazon Web Services Cloud',
            department: 'Core Infrastructure',
            amount: 3240.80,
            status: 'cleared',
            taxId: 'US-91-1188392',
            isShell: false,
            memo: 'Monthly EC2 & S3 storage cluster billing'
        },
        {
            id: 'rcp-106',
            invoiceNo: 'INV-GHOST-662',
            date: '2026-10-28 01:30',
            vendor: 'Apex Phantom Holdings LLC',
            department: 'Special Strategic Operations',
            amount: 45000.00,
            status: 'pending',
            taxId: 'XX-VOID-994-SHELL',
            isShell: true,
            memo: 'Autonomous AI Security Enhancement Framework (Daemon 0xDEADBEEF Seed)',
            matchedIntrusion: '2026-10-28 01:28:15'
        }
    ],

    intrusionLogs: [
        {
            timestamp: '2026-10-14 02:44:12',
            ip: '194.26.29.11 [TOR EXIT ROUTE: PANAMA]',
            account: 'H_KANE (CFO Master Badge #004)',
            action: 'DISPATCH_OFFSHORE_WIRE: $45,000.00 -> Void Enterprises'
        },
        {
            timestamp: '2026-10-18 23:58:04',
            ip: '194.26.29.11 [TOR EXIT ROUTE: PANAMA]',
            account: 'H_KANE (CFO Master Badge #004)',
            action: 'CREATE_PHANTOM_EXPENSE: $38,500.00 -> Panama Data Vaults'
        },
        {
            timestamp: '2026-10-22 03:12:49',
            ip: '45.154.255.88 [ZURICH SECURE PROXY]',
            account: 'H_KANE (CFO Master Badge #004)',
            action: 'AUTHORIZE_CREDIT_FACILITY: $14,000.00 -> The Black Rose Lounge'
        },
        {
            timestamp: '2026-10-28 01:28:15',
            ip: '185.220.101.5 [DARKNET RELAY]',
            account: 'H_KANE (CFO Master Badge #004)',
            action: 'PURCHASE_MALWARE_DAEMON: 0xDEADBEEF -> Apex Phantom Holdings'
        }
    ],

    // Case 04 Corrupted Modules
    modules: [
        {
            id: 'mod-01',
            filename: 'authMiddleware.ts',
            threat: 'EVAL BACKDOOR & TOKEN CACHE MEMORY LEAK',
            corruptedCode: `// ⚠️ CORRUPTED BY DAEMON 0xDEADBEEF
export function verifyCorporateToken(header: string) {
  // VULNERABILITY: Arbitrary code execution injected by daemon
  const decoded = eval(header.replace("Bearer ", ""));
  
  // MEMORY LEAK: Global array never purged
  (globalThis as any).tokenCache = (globalThis as any).tokenCache || [];
  (globalThis as any).tokenCache.push(new Array(1000000).fill(decoded));
  return decoded.valid;
}`,
            fixedCode: `// ✅ EXORCISED & LINTED CLEAN
export function verifyCorporateToken(header: string): boolean {
  if (!header || !header.startsWith("Bearer ")) return false;
  try {
    const payload = JSON.parse(atob(header.slice(7)));
    return Boolean(payload && payload.exp > Date.now());
  } catch {
    return false;
  }
}`,
            explanation: 'Removed hazardous eval() execution; replaced with safe token validation and eliminated 1,000,000 item array memory leak.',
            fixed: false
        },
        {
            id: 'mod-02',
            filename: 'telemetryStream.ts',
            threat: 'INFINITE RECURSION & UNHANDLED REJECTION CRASH',
            corruptedCode: `// ⚠️ CORRUPTED BY DAEMON 0xDEADBEEF
export async function dispatchTelemetry(packet: any) {
  try {
    if (!packet.ack) {
      // BUG: Infinite recursion with no base condition
      return dispatchTelemetry(packet);
    }
  } catch (err) {
    Promise.reject(err);
  }
}`,
            fixedCode: `// ✅ EXORCISED & LINTED CLEAN
export async function dispatchTelemetry(packet: any): Promise<boolean> {
  let attempts = 0;
  while (attempts < 3) {
    try {
      const res = await fetch("/api/telemetry", { method: "POST", body: JSON.stringify(packet) });
      if (res.ok) return true;
    } catch (e) {
      attempts++;
    }
  }
  return false;
}`,
            explanation: 'Fixed stack-overflow infinite recursion with bounded retry loop and graceful error handling.',
            fixed: false
        },
        {
            id: 'mod-03',
            filename: 'cryptoLedger.ts',
            threat: 'SYNTAX ERRORS & BROKEN TEMPLATE LITERAL',
            corruptedCode: `// ⚠️ CORRUPTED BY DAEMON 0xDEADBEEF
export function calculateHash(tx: any) {
  let hash = 0xdeadbeef
  for (let i = 0 i < tx.length i++) { // SYNTAX ERROR: Missing semicolons
    hash = (hash << 5) - hash + tx.charCodeAt(i)
  }
  return \`0x\${hash.toString(16) // SYNTAX ERROR: Unclosed template literal
}`,
            fixedCode: `// ✅ EXORCISED & LINTED CLEAN
export function calculateHash(tx: string): string {
  let hash = 0;
  for (let i = 0; i < tx.length; i++) {
    hash = (hash << 5) - hash + tx.charCodeAt(i);
    hash |= 0;
  }
  return \`0x\${(hash >>> 0).toString(16).padStart(8, '0')}\`;
}`,
            explanation: 'Repaired broken for-loop syntax, closed template literal, and added unsigned 32-bit conversion.',
            fixed: false
        },
        {
            id: 'mod-04',
            filename: 'eventBusCollector.ts',
            threat: 'ZOMBIE INTERVAL & DANGLING LISTENER LEAK',
            corruptedCode: `// ⚠️ CORRUPTED BY DAEMON 0xDEADBEEF
export function mountEventBus() {
  // MEMORY LEAK: Creates zombie intervals repeatedly
  setInterval(() => {
    window.addEventListener("message", (e) => console.log(e.data));
  }, 100);
}`,
            fixedCode: `// ✅ EXORCISED & LINTED CLEAN
export function mountEventBus(): () => void {
  const handler = (e: MessageEvent) => console.log(e.data);
  window.addEventListener("message", handler);
  return () => window.removeEventListener("message", handler);
}`,
            explanation: 'Removed exponential zombie interval listener generator; added proper teardown cleanup function.',
            fixed: false
        }
    ]
};

// Procedural Canvas Confetti
function triggerConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '999999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas.remove();

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = gameState.theme === 'green'
        ? ['#00ff66', '#33ff88', '#00cc44', '#ffffff']
        : gameState.theme === 'amber'
        ? ['#ffb000', '#ffd044', '#ff8800', '#ffffff']
        : ['#00f0ff', '#55ffff', '#0099cc', '#ffffff'];

    const particles = [];
    for (let i = 0; i < 90; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 8;
        particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2,
            size: 4 + Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: 1,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10
        });
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = 0;
        for (let p of particles) {
            if (p.opacity <= 0) continue;
            alive++;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.15;
            p.vx *= 0.98;
            p.opacity -= 0.012;
            p.rotation += p.rotSpeed;

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        }

        if (alive > 0) {
            requestAnimationFrame(render);
        } else {
            canvas.remove();
        }
    }
    render();
}

// Case Ledger Store
function addLedgerEntry(caseId, narrativeTitle, realAction, details, deltas = {}, snapshot = null) {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const entry = {
        id: `TX-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        timestamp: timeStr,
        caseId,
        narrativeTitle,
        realAction,
        details,
        deltas,
        snapshot: snapshot ? JSON.parse(JSON.stringify(snapshot)) : null
    };

    gameState.ledger.unshift(entry);

    if (deltas.emails) {
        gameState.telemetry.emailsVaporized += deltas.emails;
        gameState.telemetry.minutesSaved += Math.round(deltas.emails * 0.2);
        gameState.telemetry.co2GramsSaved += Number((deltas.emails * 0.3).toFixed(1));
    }
    if (deltas.bytes) {
        gameState.telemetry.bytesReclaimed += deltas.bytes;
    }
    if (deltas.fraud) {
        gameState.telemetry.fraudDollarsBlocked += deltas.fraud;
    }
    if (deltas.bugs) {
        gameState.telemetry.bugsPatched += deltas.bugs;
        gameState.telemetry.minutesSaved += deltas.bugs * 15;
    }

    updateTelemetryUI();
}

function updateTelemetryUI() {
    const elVap = document.getElementById('tel-vaporized');
    const elBytes = document.getElementById('tel-bytes');
    const elFraud = document.getElementById('tel-fraud');
    const elBugs = document.getElementById('tel-bugs');
    const elCount = document.getElementById('ledger-badge-count');

    if (elVap) elVap.textContent = gameState.telemetry.emailsVaporized.toLocaleString();
    if (elBytes) elBytes.textContent = (gameState.telemetry.bytesReclaimed / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    if (elFraud) elFraud.textContent = '$' + gameState.telemetry.fraudDollarsBlocked.toLocaleString();
    if (elBugs) elBugs.textContent = gameState.telemetry.bugsPatched;
    if (elCount) elCount.textContent = gameState.ledger.length;
}

// Format byte sizes
function formatBytes(bytes) {
    if (bytes >= 1024 * 1024 * 1024) {
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Initialise App
document.addEventListener('DOMContentLoaded', () => {
    // Initial genesis ledger entry
    addLedgerEntry('SYS', 'Detective Rick "Null" Deckard Logged In', 'Digital Exorcist Protocol Activated', 'Immutable dual-state forensic bridge established.');

    // Theme toggles
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const theme = e.target.dataset.theme;
            gameState.theme = theme;
            document.body.className = `theme-${theme} ${gameState.scanlines ? 'scanlines' : ''}`;
            window.soundEngine.playTapeClick();
        });
    });

    // CRT Toggle
    const btnCrt = document.getElementById('btn-toggle-scanlines');
    if (btnCrt) {
        btnCrt.addEventListener('click', () => {
            gameState.scanlines = !gameState.scanlines;
            document.body.className = `theme-${gameState.theme} ${gameState.scanlines ? 'scanlines' : ''}`;
            window.soundEngine.playTapeClick();
        });
    }

    // Audio Toggle
    const btnAudio = document.getElementById('btn-toggle-sound');
    if (btnAudio) {
        btnAudio.addEventListener('click', () => {
            const muted = window.soundEngine.toggleMute();
            btnAudio.textContent = muted ? '🔇 Audio: OFF' : '🔊 Synth: ON';
            btnAudio.classList.toggle('btn-primary', !muted);
            window.soundEngine.playTapeClick();
        });
    }

    // Brand click returns to corkboard
    const brand = document.querySelector('.brand');
    if (brand) {
        brand.addEventListener('click', () => {
            window.soundEngine.playTapeClick();
            showMissionCorkboard();
        });
    }

    // Time-Travel Drawer Toggle
    const btnLedger = document.getElementById('btn-open-ledger');
    const modal = document.getElementById('ledger-modal');
    const btnCloseLedger = document.getElementById('btn-close-ledger');
    const btnExport = document.getElementById('btn-export-dispatch');

    if (btnLedger && modal) {
        btnLedger.addEventListener('click', () => {
            window.soundEngine.playTapeClick();
            renderLedgerList();
            modal.style.display = 'flex';
        });
    }
    if (btnCloseLedger && modal) {
        btnCloseLedger.addEventListener('click', () => {
            window.soundEngine.playTapeClick();
            modal.style.display = 'none';
        });
    }
    if (btnExport) {
        btnExport.addEventListener('click', () => {
            window.soundEngine.playTapeClick();
            exportAuditReport();
        });
    }

    // First user click initiates ambient synth drone
    document.body.addEventListener('click', () => {
        window.soundEngine.startAmbientDrone();
    }, { once: true });

    // Render initial Mission Corkboard
    showMissionCorkboard();
});

// Render Mission Corkboard
function showMissionCorkboard() {
    gameState.activeCaseId = null;
    const container = document.getElementById('main-content');
    if (!container) return;

    const allSolved = gameState.cases.every(c => c.status === 'EXORCISED');

    container.innerHTML = `
        <div class="corkboard-wrapper" style="display:flex; flex-direction:column; gap:20px;">
            <!-- Top Corkboard Header -->
            <div style="background:var(--term-panel-bg); border:1px solid var(--term-border); padding:16px; border-radius:6px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
                <div style="display:flex; gap:16px; align-items:center;">
                    <pre class="ascii-portrait" style="display:none; @media(min-width:600px){display:block;}">${ASCII_ART.NULL_DECKARD}</pre>
                    <div>
                        <div style="display:flex; gap:8px; align-items:center;">
                            <span style="background:rgba(220,38,38,0.2); color:#f87171; border:1px solid rgba(220,38,38,0.5); padding:2px 6px; font-size:10px; font-weight:bold; border-radius:3px;">
                                TOP-SECRET CONSPIRACY DOSSIER
                            </span>
                            <span style="color:var(--term-dim); font-size:11px;">CORP-NET MAINFRAME JURISDICTION</span>
                        </div>
                        <h2 style="font-size:20px; font-weight:900; color:#fff; margin-top:4px;">
                            MISSION CORKBOARD: "OPERATION EXORCISM"
                        </h2>
                        <p style="color:var(--term-dim); font-size:11px; max-width:650px;">
                            Every narrative interrogation choice and evidence triage physically cleans up real-world digital hoarding.
                            Purge 5,000 unread spam beacons, reclaim 12+ GB in downloads, void $142K in offshore expense fraud, and refactor corrupted daemon bytecode.
                        </p>
                    </div>
                </div>

                <div>
                    ${allSolved ? `
                        <div style="border:1px solid #22c55e; background:rgba(34,197,94,0.1); padding:10px 16px; border-radius:4px; color:#4ade80; font-weight:bold;">
                            🛡️ CORP-NET FULLY EXORCISED
                        </div>
                    ` : `
                        <div style="text-align:right;">
                            <div style="font-size:10px; color:var(--term-dim);">ACTIVE THREAT STATUS</div>
                            <div style="font-size:16px; font-weight:900; color:#fbbf24;">DEFCON 2 // HOARDING CRISIS</div>
                            <div style="font-size:11px; color:var(--term-main);">${gameState.cases.filter(c => c.status === 'EXORCISED').length} OF 4 CASES SOLVED</div>
                        </div>
                    `}
                </div>
            </div>

            <!-- 4 Case Cards Grid -->
            <div class="corkboard-grid">
                ${gameState.cases.map(c => `
                    <div class="case-card ${c.status === 'EXORCISED' ? 'solved' : ''}" onclick="openCase('${c.id}')">
                        <div class="push-pin"></div>
                        <div>
                            <div style="display:flex; justify-content:space-between; font-size:10px; margin-bottom:8px; padding-right:16px;">
                                <strong style="color:var(--term-main);">${c.codeNumber}</strong>
                                <span style="border:1px solid var(--term-border); padding:1px 5px; border-radius:2px; color:var(--term-dim);">${c.classification}</span>
                            </div>
                            <h3 style="font-size:16px; font-weight:900; color:#fff;">${c.title}</h3>
                            <div style="font-size:11px; color:var(--term-dim); margin-bottom:10px;">${c.subtitle}</div>

                            <div style="display:flex; gap:10px; background:#000; padding:10px; border-radius:4px; border:1px solid var(--term-border); margin-bottom:10px;">
                                <pre class="ascii-portrait" style="width:100px; font-size:8px; padding:4px;">${ASCII_ART[c.suspectPortrait] || ASCII_ART.SYSTEM}</pre>
                                <div>
                                    <div style="font-size:9px; color:var(--term-dim);">SUSPECT:</div>
                                    <div style="font-weight:bold; color:#fff; font-size:11px;">${c.suspectName}</div>
                                    <div style="font-size:10px; color:var(--term-main); margin-bottom:4px;">${c.suspectRole}</div>
                                    <div style="font-size:10px; color:#d1d5db; line-height:1.3;">${c.narrativeBrief}</div>
                                </div>
                            </div>

                            <div style="background:rgba(0,255,102,0.05); border:1px solid rgba(0,255,102,0.2); padding:8px; border-radius:4px; font-size:10px; margin-bottom:12px;">
                                <strong style="color:var(--term-main);">CHORE TRANSLATION BRIDGE:</strong>
                                <div style="color:#e5e7eb; margin-top:2px;">🎯 ${c.targetHoarding}</div>
                            </div>
                        </div>

                        <div style="border-top:1px solid var(--term-border); padding-top:10px; display:flex; justify-content:space-between; align-items:center; font-size:11px;">
                            <div>
                                ${c.status === 'EXORCISED' ? '<span style="color:#4ade80; font-weight:bold;">✓ EXORCISED</span>' : `<span style="color:#fbbf24;">⚡ ${c.status} (${c.evidenceCollected}/${c.totalEvidence})</span>`}
                            </div>
                            <div style="color:var(--term-main); font-weight:bold;">
                                ${c.status === 'EXORCISED' ? 'REVIEW ►' : 'COMMENCE ►'}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Open Specific Case
function openCase(caseId) {
    window.soundEngine.playTapeClick();
    window.soundEngine.playKeypress();
    gameState.activeCaseId = caseId;

    if (caseId === 'case-01') renderCase01();
    if (caseId === 'case-02') renderCase02();
    if (caseId === 'case-03') renderCase03();
    if (caseId === 'case-04') renderCase04();
}

// -----------------------------------------------------------------------------
// CASE 01: THE SPAM SYNDICATE
// -----------------------------------------------------------------------------
function renderCase01() {
    const container = document.getElementById('main-content');
    const c = gameState.cases.find(x => x.id === 'case-01');
    const node = CASE_DATA.dialogue[gameState.case01.currentNodeId] || CASE_DATA.dialogue.root;
    const selectedEmail = CASE_DATA.emails.find(e => e.id === gameState.case01.selectedEmailId) || CASE_DATA.emails[0];
    const isSolved = c.status === 'EXORCISED';

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:16px;">
            <div style="background:var(--term-panel-bg); border:1px solid var(--term-border); padding:12px 16px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <span style="font-size:10px; color:var(--term-dim);">${c.codeNumber}</span>
                    <h2 style="font-size:18px; font-weight:900; color:#fff;">CASE 01: THE SPAM SYNDICATE</h2>
                    <div style="font-size:11px; color:var(--term-dim);">Interrogate Agent Vane, extract token, purge 5,000 spam beacons, and locate encrypted whistleblower memo.</div>
                </div>
                <div style="display:flex; gap:12px; align-items:center;">
                    <div style="text-align:right;">
                        <div style="font-size:10px; color:var(--term-dim);">UNREAD SPAM HOARD</div>
                        <div style="font-size:18px; font-weight:900; color:#f87171;">${gameState.case01.unreadCount.toLocaleString()} / 5,000</div>
                    </div>
                    <button class="btn" onclick="showMissionCorkboard()">◄ CORKBOARD</button>
                </div>
            </div>

            ${isSolved ? `
                <div style="background:rgba(34,197,94,0.15); border:1px solid #22c55e; padding:12px 16px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong style="color:#4ade80;">✓ EXORCISM PROTOCOL COMPLETE: INBOX ZERO ACHIEVED</strong>
                        <div style="font-size:11px; color:#86efac;">5,000 spam beacons purged, Unsubscribe EMP fired, and whistleblower memo decrypted.</div>
                    </div>
                    <button class="btn btn-primary" onclick="showMissionCorkboard()">RETURN TO BOARD ►</button>
                </div>
            ` : ''}

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap:16px;">
                <!-- Left: Interrogation Cell -->
                <div style="background:var(--term-panel-bg); border:1px solid var(--term-border); padding:16px; border-radius:6px; display:flex; flex-direction:column; gap:12px;">
                    <div style="border-bottom:1px solid var(--term-border); padding-bottom:8px; display:flex; justify-content:space-between; font-size:11px;">
                        <strong style="color:var(--term-main);">INTERROGATION CELL B-1</strong>
                        <span style="color:var(--term-dim);">SUSPECT: AGENT VANE</span>
                    </div>

                    <div style="display:flex; gap:12px; background:#000; padding:10px; border-radius:4px; border:1px solid var(--term-border);">
                        <pre class="ascii-portrait" style="width:110px; font-size:8px;">${ASCII_ART.VANE}</pre>
                        <div style="font-size:11px;">
                            <div style="color:var(--term-dim); font-size:9px;">PSYCH PROFILE:</div>
                            <strong style="color:#fff;">Agent Vane (VP of Growth)</strong>
                            <div style="color:#fbbf24; font-size:10px; margin-top:2px;">STATUS: ${gameState.case01.unsubTokenUnlocked ? 'COMPLIANT' : 'DEFENSIVE'}</div>
                        </div>
                    </div>

                    <div style="background:rgba(0,0,0,0.6); border:1px solid var(--term-border); padding:12px; border-radius:4px; font-size:11px; min-height:80px;">
                        <strong style="color:var(--term-main); font-size:10px;">${node.speaker} (${node.speakerTitle}):</strong>
                        <p style="color:#f3f4f6; margin-top:4px; font-style:italic;">"${node.text}"</p>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:6px;">
                        <span style="font-size:10px; color:var(--term-dim); font-weight:bold;">INTERROGATION TACTICS:</span>
                        ${node.options.map(opt => `
                            <button class="btn" style="text-align:left; padding:8px; font-size:11px;" onclick="chooseDialogue('${opt.next}', '${opt.unlock || ''}')">
                                ${opt.label}
                            </button>
                        `).join('')}
                    </div>

                    ${gameState.case01.unsubTokenUnlocked ? `
                        <div style="background:rgba(245,158,11,0.15); border:1px solid #f59e0b; padding:8px; border-radius:4px; font-size:10px; color:#fde68a;">
                            🔑 MASTER UNSUB TOKEN: <code>X-SYN-UNSUB-MASTER-TOKEN-9941</code> (READY)
                        </div>
                    ` : ''}
                </div>

                <!-- Right: Mailbox Terminal -->
                <div style="background:var(--term-panel-bg); border:1px solid var(--term-border); padding:16px; border-radius:6px; display:flex; flex-direction:column; gap:12px;">
                    <div style="border-bottom:1px solid var(--term-border); padding-bottom:8px; display:flex; justify-content:space-between; font-size:11px;">
                        <strong style="color:#fff;">CORP-NET MAILBOX PURGE CONSOLE</strong>
                        <span style="color:var(--term-dim);">/var/mail/deckard</span>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                        <button class="btn btn-danger" onclick="laserPurge()" ${gameState.case01.unreadCount <= 0 ? 'disabled' : ''}>
                            ⚡ LASER VAPORIZER (-1,250 SPAM)
                        </button>
                        <button class="btn ${gameState.case01.unsubTokenUnlocked && gameState.case01.unreadCount > 0 ? 'btn-primary' : ''}" onclick="empPurge()" ${!gameState.case01.unsubTokenUnlocked || gameState.case01.unreadCount <= 0 ? 'disabled' : ''}>
                            🌀 UNSUBSCRIBE EMP (PURGE ALL 5,000)
                        </button>
                    </div>

                    <!-- Email List -->
                    <div style="border:1px solid var(--term-border); border-radius:4px; overflow:hidden; max-height:160px; overflow-y:auto; background:#000;">
                        ${CASE_DATA.emails.map(em => `
                            <div onclick="selectEmail('${em.id}')" style="padding:6px 10px; border-bottom:1px solid rgba(255,255,255,0.08); cursor:pointer; font-size:10px; display:flex; justify-content:space-between; background:${gameState.case01.selectedEmailId === em.id ? 'rgba(0,255,102,0.1)' : 'transparent'}; opacity:${em.vaporized ? '0.3' : '1'};">
                                <div style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:240px;">
                                    <strong>${em.isWhistleblowerClue ? '★ ' : ''}${em.sender}</strong>: ${em.subject}
                                </div>
                                <div>
                                    ${em.vaporized ? '<span style="color:#ef4444;">VAPORIZED</span>' : em.whitelisted ? '<span style="color:#22c55e;">WHITELISTED</span>' : `<span style="color:var(--term-dim);">${em.category}</span>`}
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Email Inspector -->
                    <div style="background:#000; border:1px solid var(--term-border); padding:10px; border-radius:4px; font-size:10px; display:flex; flex-direction:column; gap:6px;">
                        <div style="border-bottom:1px solid var(--term-border); padding-bottom:4px;">
                            <strong style="color:#fff;">${selectedEmail.subject}</strong>
                            <div style="color:var(--term-dim);">FROM: ${selectedEmail.sender} &lt;${selectedEmail.email}&gt;</div>
                        </div>

                        <pre style="white-space:pre-wrap; color:#d1d5db; max-height:110px; overflow-y:auto; font-family:inherit; font-size:10px;">${selectedEmail.body}</pre>

                        <div style="display:flex; justify-content:space-between; align-items:center; padding-top:4px;">
                            <span style="color:var(--term-dim);">SIZE: ${selectedEmail.sizeKb} KB</span>
                            <div>
                                ${selectedEmail.category === 'legitimate' && !selectedEmail.whitelisted ? `
                                    <button class="btn btn-warning" onclick="whitelistSecOps('${selectedEmail.id}')">🛡️ WHITELIST SENDER</button>
                                ` : ''}
                                ${selectedEmail.isWhistleblowerClue && !gameState.case01.whistleblowerFound ? `
                                    <button class="btn btn-primary" onclick="decryptWhistleblower()">🔍 DECRYPT WHISTLEBLOWER MEMO</button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function chooseDialogue(nextId, unlock) {
    window.soundEngine.playTapeClick();
    window.soundEngine.playKeypress();
    gameState.case01.currentNodeId = nextId;

    if (unlock === 'TOKEN') {
        gameState.case01.unsubTokenUnlocked = true;
        window.soundEngine.playEvidenceUnlocked();
        addLedgerEntry('case-01', 'Extracted Unsubscribe Master Token', 'RFC 8058 Bulk Unsubscribe Enabled', 'Extracted X-SYN-UNSUB-MASTER-TOKEN-9941 from Agent Vane.');
        updateCaseEvidence('case-01');
    }
    if (unlock === 'LEAK') {
        window.soundEngine.playEvidenceUnlocked();
        addLedgerEntry('case-01', 'Whistleblower Leak Coordinates Revealed', 'Isolating Concealed Payload in Spam Blast', 'Target: "99% OFF Apex Global Synergy Webinar" footer.');
        updateCaseEvidence('case-01');
    }

    renderCase01();
}

function selectEmail(id) {
    window.soundEngine.playKeypress();
    gameState.case01.selectedEmailId = id;
    renderCase01();
}

function laserPurge() {
    if (gameState.case01.unreadCount <= 0) return;
    window.soundEngine.playLaserZap();
    const batch = Math.min(1250, gameState.case01.unreadCount);
    gameState.case01.unreadCount -= batch;

    addLedgerEntry('case-01', `Laser Vaporized ${batch} Spam Beacons`, `Purged ${batch} Unread Emails from Partition`, 'Reclaimed mailbox cache space.', { emails: batch });

    checkCase01Completion();
    renderCase01();
}

function empPurge() {
    if (!gameState.case01.unsubTokenUnlocked || gameState.case01.unreadCount <= 0) return;
    window.soundEngine.playEmpBlast();
    const purged = gameState.case01.unreadCount;
    gameState.case01.unreadCount = 0;

    CASE_DATA.emails.forEach(e => {
        if (e.category !== 'legitimate' && e.category !== 'whistleblower') e.vaporized = true;
    });

    addLedgerEntry('case-01', 'Dispatched Unsubscribe EMP Blast Across Botnet', `Automated RFC Unsubscribe Sent; Purged All ${purged.toLocaleString()} Mails`, 'All affiliate subscriber lists permanently deleted.', { emails: purged });

    checkCase01Completion();
    renderCase01();
}

function decryptWhistleblower() {
    window.soundEngine.playEvidenceUnlocked();
    gameState.case01.whistleblowerFound = true;
    addLedgerEntry('case-01', 'Decrypted Whistleblower Memo', 'Extracted Intelligence: $140K Offshore Slush Fund', 'Identified disguise filename: "Quarterly_Bonus_Spreadsheet.xlsx.exe".');
    updateCaseEvidence('case-01');
    checkCase01Completion();
    renderCase01();
}

function whitelistSecOps(id) {
    window.soundEngine.playTapeClick();
    gameState.case01.secopsWhitelisted = true;
    const em = CASE_DATA.emails.find(e => e.id === id);
    if (em) em.whitelisted = true;
    addLedgerEntry('case-01', 'Whitelisted SecOps Alert Domain', 'Added security@corp-net.internal to Permanent Safe List', 'Preserved vital security telemetry.');
    checkCase01Completion();
    renderCase01();
}

function checkCase01Completion() {
    if (gameState.case01.unreadCount === 0 && gameState.case01.whistleblowerFound) {
        const c = gameState.cases.find(x => x.id === 'case-01');
        if (c.status !== 'EXORCISED') {
            c.status = 'EXORCISED';
            c.evidenceCollected = 3;
            window.soundEngine.playExorcismComplete();
            triggerConfetti();
        }
    }
}

// -----------------------------------------------------------------------------
// CASE 02: THE DOWNLOAD ABYSS
// -----------------------------------------------------------------------------
function renderCase02() {
    const container = document.getElementById('main-content');
    const c = gameState.cases.find(x => x.id === 'case-02');
    const selected = CASE_DATA.downloads.find(f => f.id === gameState.case02.selectedFileId) || CASE_DATA.downloads[0];
    const isSolved = c.status === 'EXORCISED';

    const remainingBytes = CASE_DATA.downloads
        .filter(f => f.state === 'downloads')
        .reduce((sum, f) => sum + f.sizeBytes, 0);

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:16px;">
            <div style="background:var(--term-panel-bg); border:1px solid var(--term-border); padding:12px 16px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <span style="font-size:10px; color:var(--term-dim);">${c.codeNumber}</span>
                    <h2 style="font-size:18px; font-weight:900; color:#fff;">CASE 02: THE DOWNLOAD ABYSS (GHOST CACHE)</h2>
                    <div style="font-size:11px; color:var(--term-dim);">Triage dark-ops downloads dump, incinerate 9.9GB bloat, unmask trojan, and match duplicate hashes.</div>
                </div>
                <div style="display:flex; gap:12px; align-items:center;">
                    <div style="text-align:right;">
                        <div style="font-size:10px; color:var(--term-dim);">REMAINING CLUTTER</div>
                        <div style="font-size:18px; font-weight:900; color:#fbbf24;">${formatBytes(remainingBytes)}</div>
                    </div>
                    <button class="btn" onclick="showMissionCorkboard()">◄ CORKBOARD</button>
                </div>
            </div>

            ${isSolved ? `
                <div style="background:rgba(34,197,94,0.15); border:1px solid #22c55e; padding:12px 16px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong style="color:#4ade80;">✓ EXORCISM PROTOCOL COMPLETE: DRIVE DE-CLUTTERED</strong>
                        <div style="font-size:11px; color:#86efac;">12+ GB storage reclaimed, trojan quarantined, and duplicate invoice fraud proven.</div>
                    </div>
                    <button class="btn btn-primary" onclick="showMissionCorkboard()">RETURN TO BOARD ►</button>
                </div>
            ` : ''}

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap:16px;">
                <!-- Left: File Triage Table -->
                <div style="background:var(--term-panel-bg); border:1px solid var(--term-border); padding:16px; border-radius:6px; display:flex; flex-direction:column; gap:12px;">
                    <div style="border-bottom:1px solid var(--term-border); padding-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                        <strong style="color:#fff; font-size:11px;">/downloads_dump/ DIRECTORY</strong>
                        <button class="btn btn-warning" onclick="runHashScan()">⚡ RUN HASH DEDUPLICATOR</button>
                    </div>

                    ${gameState.case02.duplicateMatchesFound ? `
                        <div style="background:rgba(245,158,11,0.2); border:1px solid #f59e0b; padding:8px; border-radius:4px; font-size:10px; color:#fde68a;">
                            ⚠️ HASH MATCH DETECTED: invoice_2026_q3_apex.pdf and ...copy(1).pdf share identical hash (e3b0c442...). Proves duplicate payout kickbacks!
                        </div>
                    ` : ''}

                    <div style="border:1px solid var(--term-border); border-radius:4px; overflow:hidden; background:#000;">
                        ${CASE_DATA.downloads.map(f => `
                            <div onclick="selectDownloadFile('${f.id}')" style="padding:8px 10px; border-bottom:1px solid rgba(255,255,255,0.08); cursor:pointer; font-size:10px; display:flex; justify-content:space-between; background:${gameState.case02.selectedFileId === f.id ? 'rgba(0,255,102,0.1)' : 'transparent'};">
                                <div>
                                    <strong style="color:#fff;">${f.threat === 'CRITICAL' ? '⚠️ ' : f.threat === 'EVIDENCE' ? '★ ' : ''}${f.filename}</strong>
                                    <div style="color:var(--term-dim);">${f.realType}</div>
                                </div>
                                <div style="text-align:right;">
                                    <div>${formatBytes(f.sizeBytes)}</div>
                                    <span style="color:${f.state === 'incinerated' ? '#ef4444' : f.state === 'vault' ? '#22c55e' : f.state === 'quarantined' ? '#a855f7' : '#fbbf24'}; font-weight:bold;">
                                        ${f.state.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Right: File Metadata & Triage Controls -->
                <div style="background:var(--term-panel-bg); border:1px solid var(--term-border); padding:16px; border-radius:6px; display:flex; flex-direction:column; gap:12px;">
                    <div style="border-bottom:1px solid var(--term-border); padding-bottom:8px; font-size:11px;">
                        <strong style="color:var(--term-main);">HEX & SHA-256 INSPECTOR</strong>
                    </div>

                    <div style="display:flex; gap:10px; background:#000; padding:8px; border-radius:4px; border:1px solid var(--term-border);">
                        <pre class="ascii-portrait" style="width:90px; font-size:8px;">${ASCII_ART.GHOST}</pre>
                        <div style="font-size:10px;">
                            <div style="color:var(--term-dim);">SUSPECT HOARDER:</div>
                            <strong style="color:#fff;">The Ghost in Cache</strong>
                            <div style="color:var(--term-dim); margin-top:2px;">Ex-Sysadmin / Storage Hoarder</div>
                        </div>
                    </div>

                    <div style="background:#000; border:1px solid var(--term-border); padding:10px; border-radius:4px; font-size:10px; display:flex; flex-direction:column; gap:6px;">
                        <div><strong style="color:#fff;">${selected.filename}</strong></div>
                        <div style="color:#fde68a;">REAL TYPE: ${selected.realType}</div>
                        <div style="color:#fff;">SIZE: ${formatBytes(selected.sizeBytes)}</div>
                        <div style="background:#090d13; padding:4px; border:1px solid var(--term-border); word-break:break-all; font-size:9px; color:var(--term-dim);">
                            HASH: ${selected.sha256}
                        </div>
                        <p style="color:#d1d5db; margin-top:4px;">${selected.desc}</p>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:8px;">
                        ${selected.state === 'downloads' ? `
                            ${selected.category === 'bloat_dump' ? `
                                <button class="btn btn-danger" onclick="incinerateFile('${selected.id}')">
                                    🔥 ZERO-FILL INCINERATE (-${formatBytes(selected.sizeBytes)})
                                </button>
                            ` : ''}
                            ${selected.category === 'malware' ? `
                                <button class="btn" style="background:#7e22ce; color:#fff;" onclick="quarantineFile('${selected.id}')">
                                    ☣️ UNMASK & QUARANTINE TROJAN
                                </button>
                            ` : ''}
                            ${selected.category === 'audio_wiretap' || selected.category === 'duplicate_invoice' ? `
                                <button class="btn btn-primary" onclick="vaultFile('${selected.id}')">
                                    🗄️ DEPOSIT IN EVIDENCE VAULT
                                </button>
                            ` : ''}
                        ` : `
                            <div style="border:1px solid #22c55e; background:rgba(34,197,94,0.1); padding:8px; border-radius:4px; color:#4ade80; text-align:center; font-weight:bold;">
                                FILE CLASSIFIED AS: ${selected.state.toUpperCase()}
                            </div>
                        `}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function selectDownloadFile(id) {
    window.soundEngine.playKeypress();
    gameState.case02.selectedFileId = id;
    renderCase02();
}

function runHashScan() {
    window.soundEngine.playGlitch();
    gameState.case02.duplicateMatchesFound = true;
    window.soundEngine.playEvidenceUnlocked();
    addLedgerEntry('case-02', 'Cryptographic Hash Deduplicator Executed', 'Identified Duplicate Kickback Invoices', 'Matched invoice_2026_q3_apex.pdf hash (e3b0c442...). Proves fraud.');
    updateCaseEvidence('case-02');
    checkCase02Completion();
    renderCase02();
}

function incinerateFile(id) {
    const f = CASE_DATA.downloads.find(x => x.id === id);
    if (!f) return;
    window.soundEngine.playLaserZap();
    f.state = 'incinerated';

    addLedgerEntry('case-02', `Zero-Fill Incinerated: ${f.filename}`, `Reclaimed ${formatBytes(f.sizeBytes)} from Downloads Dump`, 'Permanently erased bloat cache.', { bytes: f.sizeBytes });

    checkCase02Completion();
    renderCase02();
}

function quarantineFile(id) {
    const f = CASE_DATA.downloads.find(x => x.id === id);
    if (!f) return;
    window.soundEngine.playEmpBlast();
    f.state = 'quarantined';

    addLedgerEntry('case-02', `Quarantined Trojan: ${f.filename}`, 'Neutralized Keylogger and Reverse Shell', 'Removed trojan executable from corporate machine.', { bytes: f.sizeBytes });

    updateCaseEvidence('case-02');
    checkCase02Completion();
    renderCase02();
}

function vaultFile(id) {
    const f = CASE_DATA.downloads.find(x => x.id === id);
    if (!f) return;
    window.soundEngine.playEvidenceUnlocked();
    f.state = 'vault';

    addLedgerEntry('case-02', `Secured in Evidence Vault: ${f.filename}`, 'Organized Critical Evidence into Structured Dossier', f.desc);

    updateCaseEvidence('case-02');
    checkCase02Completion();
    renderCase02();
}

function checkCase02Completion() {
    const trojan = CASE_DATA.downloads.find(f => f.id === 'dl-001')?.state === 'quarantined';
    const wiretap = CASE_DATA.downloads.find(f => f.id === 'dl-006')?.state === 'vault';
    const bloat = CASE_DATA.downloads.filter(f => f.category === 'bloat_dump').every(f => f.state === 'incinerated');

    if (trojan && wiretap && bloat) {
        const c = gameState.cases.find(x => x.id === 'case-02');
        if (c.status !== 'EXORCISED') {
            c.status = 'EXORCISED';
            c.evidenceCollected = 3;
            window.soundEngine.playExorcismComplete();
            triggerConfetti();
        }
    }
}

// -----------------------------------------------------------------------------
// CASE 03: THE PHANTOM LEDGER
// -----------------------------------------------------------------------------
function renderCase03() {
    const container = document.getElementById('main-content');
    const c = gameState.cases.find(x => x.id === 'case-03');
    const selected = CASE_DATA.expenses.find(r => r.id === gameState.case03.selectedReceiptId) || CASE_DATA.expenses[0];
    const isSolved = c.status === 'EXORCISED';

    const fraudBlocked = CASE_DATA.expenses
        .filter(r => r.status === 'voided')
        .reduce((sum, r) => sum + r.amount, 0);

    const matchedLog = CASE_DATA.intrusionLogs.find(l => l.timestamp === selected.matchedIntrusion);

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:16px;">
            <div style="background:var(--term-panel-bg); border:1px solid var(--term-border); padding:12px 16px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <span style="font-size:10px; color:var(--term-dim);">${c.codeNumber}</span>
                    <h2 style="font-size:18px; font-weight:900; color:#fff;">CASE 03: THE PHANTOM LEDGER (OFFSHORE SLUSH FUND)</h2>
                    <div style="font-size:11px; color:var(--term-dim);">Audit corporate receipts, cross-reference breach logs, void $142,500 in shell entity fraud, and balance the ledger.</div>
                </div>
                <div style="display:flex; gap:12px; align-items:center;">
                    <div style="text-align:right;">
                        <div style="font-size:10px; color:var(--term-dim);">SLUSH FRAUD VOIDED</div>
                        <div style="font-size:18px; font-weight:900; color:#4ade80;">$${fraudBlocked.toLocaleString()} / $142,500</div>
                    </div>
                    <button class="btn" onclick="showMissionCorkboard()">◄ CORKBOARD</button>
                </div>
            </div>

            ${isSolved ? `
                <div style="background:rgba(34,197,94,0.15); border:1px solid #22c55e; padding:12px 16px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong style="color:#4ade80;">✓ EXORCISM PROTOCOL COMPLETE: TREASURY BALANCED</strong>
                        <div style="font-size:11px; color:#86efac;">$142,500 in shell company fraud blocked. Kane's purchase of Daemon 0xDEADBEEF exposed!</div>
                    </div>
                    <button class="btn btn-primary" onclick="showMissionCorkboard()">RETURN TO BOARD ►</button>
                </div>
            ` : ''}

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap:16px;">
                <!-- Left: Receipts Table -->
                <div style="background:var(--term-panel-bg); border:1px solid var(--term-border); padding:16px; border-radius:6px; display:flex; flex-direction:column; gap:12px;">
                    <div style="border-bottom:1px solid var(--term-border); padding-bottom:8px; font-size:11px;">
                        <strong style="color:#fff;">CORPORATE GENERAL EXPENSE VOUCHERS</strong>
                    </div>

                    <div style="border:1px solid var(--term-border); border-radius:4px; overflow:hidden; background:#000;">
                        ${CASE_DATA.expenses.map(r => `
                            <div onclick="selectExpense('${r.id}')" style="padding:8px 10px; border-bottom:1px solid rgba(255,255,255,0.08); cursor:pointer; font-size:10px; display:flex; justify-content:space-between; background:${gameState.case03.selectedReceiptId === r.id ? 'rgba(0,255,102,0.1)' : 'transparent'};">
                                <div>
                                    <strong style="color:#fff;">${r.isShell ? '⚠️ ' : ''}${r.vendor}</strong>
                                    <div style="color:var(--term-dim);">${r.invoiceNo} [${r.department}]</div>
                                </div>
                                <div style="text-align:right;">
                                    <strong style="color:#fff;">$${r.amount.toLocaleString()}</strong>
                                    <div style="color:${r.status === 'voided' ? '#ef4444' : r.status === 'cleared' ? '#22c55e' : '#fbbf24'}; font-weight:bold;">
                                        ${r.status.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div style="display:flex; gap:10px; background:#000; padding:8px; border-radius:4px; border:1px solid var(--term-border);">
                        <pre class="ascii-portrait" style="width:100px; font-size:8px;">${ASCII_ART.KANE}</pre>
                        <div style="font-size:10px;">
                            <div style="color:var(--term-dim);">PRIMARY SUSPECT:</div>
                            <strong style="color:#fff;">Harrison Kane (CFO)</strong>
                            <div style="color:#fbbf24; margin-top:2px;">Slush Fund Embezzler</div>
                            <p style="color:#d1d5db; margin-top:4px;">Authorized $45,000 to "Apex Phantom Holdings LLC" to purchase Daemon 0xDEADBEEF.</p>
                        </div>
                    </div>
                </div>

                <!-- Right: OCR Magnifier & Intrusion Correlator -->
                <div style="background:var(--term-panel-bg); border:1px solid var(--term-border); padding:16px; border-radius:6px; display:flex; flex-direction:column; gap:12px;">
                    <div style="border-bottom:1px solid var(--term-border); padding-bottom:8px; font-size:11px;">
                        <strong style="color:var(--term-main);">OCR RECEIPT MAGNIFIER</strong>
                    </div>

                    <div style="background:#000; border:1px solid var(--term-border); padding:12px; border-radius:4px; font-size:10px; display:flex; flex-direction:column; gap:6px;">
                        <div style="text-align:center; border-bottom:1px dashed var(--term-border); padding-bottom:6px;">
                            <strong style="color:#fff; font-size:12px;">${selected.vendor}</strong>
                            <div style="color:#fde68a;">TAX ID: ${selected.taxId}</div>
                            <div style="color:var(--term-dim);">TIMESTAMP: ${selected.date}</div>
                        </div>

                        <div style="display:flex; justify-content:space-between; font-weight:bold; color:#fff; padding-top:4px;">
                            <span>TOTAL AMOUNT:</span>
                            <span style="color:#fbbf24;">$${selected.amount.toLocaleString()}</span>
                        </div>

                        <div style="color:var(--term-dim); font-style:italic;">MEMO: "${selected.memo}"</div>
                    </div>

                    ${selected.matchedIntrusion ? `
                        <div style="background:rgba(220,38,38,0.15); border:1px solid #ef4444; padding:8px; border-radius:4px; font-size:10px; color:#fca5a5;">
                            <strong>⚠️ INTRUSION LOG CORRELATION AVAILABLE:</strong>
                            ${matchedLog ? `
                                <div style="margin-top:4px; color:#fff;">
                                    ACCOUNT: <strong>${matchedLog.account}</strong><br/>
                                    IP: ${matchedLog.ip}<br/>
                                    ACTION: ${matchedLog.action}
                                </div>
                            ` : ''}
                            <button class="btn btn-danger" style="margin-top:6px; width:100%;" onclick="correlateIntrusion('${selected.id}')">
                                🔗 CORRELATE BREACH LOG WITH KANE'S BADGE
                            </button>
                        </div>
                    ` : ''}

                    <div style="display:flex; flex-direction:column; gap:8px;">
                        ${selected.status === 'pending' ? `
                            ${selected.isShell ? `
                                <button class="btn btn-danger" onclick="voidExpense('${selected.id}')">
                                    🚩 VOID SLUSH INVOICE (-$${selected.amount.toLocaleString()})
                                </button>
                            ` : `
                                <button class="btn btn-primary" onclick="clearExpense('${selected.id}')">
                                    ✅ APPROVE LEGITIMATE EXPENSE
                                </button>
                            `}
                        ` : `
                            <div style="border:1px solid #22c55e; background:rgba(34,197,94,0.1); padding:8px; border-radius:4px; color:#4ade80; text-align:center; font-weight:bold;">
                                AUDIT STATUS: ${selected.status.toUpperCase()}
                            </div>
                        `}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function selectExpense(id) {
    window.soundEngine.playKeypress();
    gameState.case03.selectedReceiptId = id;
    renderCase03();
}

function correlateIntrusion(id) {
    window.soundEngine.playEvidenceUnlocked();
    if (!gameState.case03.correlatedLogs.includes(id)) {
        gameState.case03.correlatedLogs.push(id);
        const rcp = CASE_DATA.expenses.find(x => x.id === id);
        addLedgerEntry('case-03', `Correlated Breach Log with Invoice ${rcp.invoiceNo}`, 'Matched CFO Badge Access to Shell Payment', `Vendor: ${rcp.vendor}`);
        updateCaseEvidence('case-03');
    }
    renderCase03();
}

function voidExpense(id) {
    const rcp = CASE_DATA.expenses.find(x => x.id === id);
    if (!rcp) return;
    window.soundEngine.playLaserZap();
    rcp.status = 'voided';

    addLedgerEntry('case-03', `Voided Slush Fund Invoice: ${rcp.invoiceNo}`, `Blocked $${rcp.amount.toLocaleString()} Fraudulent Shell Payout`, `Vendor: ${rcp.vendor}`, { fraud: rcp.amount });

    checkCase03Completion();
    renderCase03();
}

function clearExpense(id) {
    const rcp = CASE_DATA.expenses.find(x => x.id === id);
    if (!rcp) return;
    window.soundEngine.playTapeClick();
    rcp.status = 'cleared';

    addLedgerEntry('case-03', `Approved Legitimate Expense: ${rcp.invoiceNo}`, `Cleared Valid Expense ($${rcp.amount})`, `Vendor: ${rcp.vendor}`);

    checkCase03Completion();
    renderCase03();
}

function checkCase03Completion() {
    const fraudDone = CASE_DATA.expenses.filter(r => r.isShell).every(r => r.status === 'voided');
    const legitDone = CASE_DATA.expenses.filter(r => !r.isShell).every(r => r.status === 'cleared');

    if (fraudDone && legitDone) {
        const c = gameState.cases.find(x => x.id === 'case-03');
        if (c.status !== 'EXORCISED') {
            c.status = 'EXORCISED';
            c.evidenceCollected = 3;
            window.soundEngine.playExorcismComplete();
            triggerConfetti();
        }
    }
}

// -----------------------------------------------------------------------------
// CASE 04: BYTECODE HERESY
// -----------------------------------------------------------------------------
function renderCase04() {
    const container = document.getElementById('main-content');
    const c = gameState.cases.find(x => x.id === 'case-04');
    const selected = CASE_DATA.modules.find(m => m.id === gameState.case04.selectedModId) || CASE_DATA.modules[0];
    const isSolved = c.status === 'EXORCISED' || gameState.case04.daemonHealth === 0;

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:16px;">
            <div style="background:var(--term-panel-bg); border:1px solid var(--term-border); padding:12px 16px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <span style="font-size:10px; color:var(--term-dim);">${c.codeNumber}</span>
                    <h2 style="font-size:18px; font-weight:900; color:#fff;">CASE 04: BYTECODE HERESY (THE CORRUPTED DAEMON)</h2>
                    <div style="font-size:11px; color:var(--term-dim);">Refactor 4 corrupted core services, eliminate eval backdoors & memory leaks, and purge Daemon 0xDEADBEEF.</div>
                </div>
                <div style="display:flex; gap:12px; align-items:center;">
                    <div style="text-align:right;">
                        <div style="font-size:10px; color:var(--term-dim);">DAEMON INTEGRITY</div>
                        <div style="font-size:18px; font-weight:900; color:${gameState.case04.daemonHealth > 50 ? '#ef4444' : gameState.case04.daemonHealth > 0 ? '#fbbf24' : '#22c55e'};">
                            ${gameState.case04.daemonHealth}% [${gameState.case04.daemonStatus}]
                        </div>
                    </div>
                    <button class="btn" onclick="showMissionCorkboard()">◄ CORKBOARD</button>
                </div>
            </div>

            ${isSolved ? `
                <div style="background:rgba(34,197,94,0.15); border:1px solid #22c55e; padding:12px 16px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong style="color:#4ade80;">✓ EXORCISM PROTOCOL COMPLETE: DAEMON PERMANENTLY PURGED</strong>
                        <div style="font-size:11px; color:#86efac;">All 4 modules linted and memory leaks eliminated. 100% build stability restored!</div>
                    </div>
                    <button class="btn btn-primary" onclick="showMissionCorkboard()">RETURN TO BOARD ►</button>
                </div>
            ` : ''}

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap:16px;">
                <!-- Left: Cyber IDE -->
                <div style="background:var(--term-panel-bg); border:1px solid var(--term-border); padding:16px; border-radius:6px; display:flex; flex-direction:column; gap:12px;">
                    <!-- Module Tabs -->
                    <div style="display:flex; gap:6px; border-bottom:1px solid var(--term-border); padding-bottom:8px; overflow-x:auto;">
                        ${CASE_DATA.modules.map(m => `
                            <button class="btn ${gameState.case04.selectedModId === m.id ? 'btn-primary' : ''}" onclick="selectModule('${m.id}')">
                                ${m.fixed ? '✓ ' : '⚠️ '}${m.filename}
                            </button>
                        `).join('')}
                    </div>

                    <div style="font-size:10px; color:#f87171; font-weight:bold;">
                        THREAT: ${selected.threat}
                    </div>

                    <!-- Code Box -->
                    <div style="background:#000; border:1px solid var(--term-border); border-radius:4px; overflow:hidden;">
                        <div style="background:#090d13; padding:4px 8px; font-size:9px; color:var(--term-dim); border-bottom:1px solid var(--term-border); display:flex; justify-content:space-between;">
                            <span>${selected.filename}</span>
                            <span style="color:${selected.fixed ? '#4ade80' : '#fbbf24'}; font-weight:bold;">${selected.fixed ? 'STATUS: CLEAN' : 'STATUS: CORRUPTED'}</span>
                        </div>
                        <pre style="padding:12px; font-size:11px; line-height:1.4; color:#f3f4f6; overflow-x:auto; max-height:220px; font-family:inherit;">${selected.fixed ? selected.fixedCode : selected.corruptedCode}</pre>
                    </div>

                    <div>
                        ${!selected.fixed ? `
                            <button class="btn btn-danger" style="width:100%; padding:10px;" onclick="exorciseModule('${selected.id}')">
                                ⚡ EXORCISE BYTECODE PATCH (-25% DAEMON HP)
                            </button>
                        ` : `
                            <div style="border:1px solid #22c55e; background:rgba(34,197,94,0.1); padding:8px; border-radius:4px; color:#4ade80; text-align:center; font-weight:bold;">
                                ✓ MODULE EXORCISED & OPTIMIZED
                            </div>
                        `}
                    </div>
                </div>

                <!-- Right: Daemon Gauge & AST Diagnostics -->
                <div style="background:var(--term-panel-bg); border:1px solid var(--term-border); padding:16px; border-radius:6px; display:flex; flex-direction:column; gap:12px;">
                    <div style="border-bottom:1px solid var(--term-border); padding-bottom:8px; font-size:11px;">
                        <strong style="color:#ef4444;">DAEMON 0xDEADBEEF CORE</strong>
                    </div>

                    <div style="display:flex; gap:10px; background:#000; padding:8px; border-radius:4px; border:1px solid var(--term-border);">
                        <pre class="ascii-portrait" style="width:110px; font-size:8px; color:#f87171;">${ASCII_ART.DAEMON}</pre>
                        <div style="font-size:10px;">
                            <div style="color:var(--term-dim);">NEURAL ANOMALY:</div>
                            <strong style="color:#fff;">Daemon 0xDEADBEEF</strong>
                            <div style="color:#f87171; margin-top:2px;">Purchased by CFO Kane</div>
                            <div style="margin-top:6px; font-weight:bold; color:#fff;">HP: ${gameState.case04.daemonHealth} / 100</div>
                        </div>
                    </div>

                    <!-- Health Bar -->
                    <div style="width:100%; height:12px; background:#000; border:1px solid var(--term-border); border-radius:2px; overflow:hidden;">
                        <div style="width:${gameState.case04.daemonHealth}%; height:100%; background:${gameState.case04.daemonHealth > 50 ? '#ef4444' : gameState.case04.daemonHealth > 0 ? '#fbbf24' : '#22c55e'}; transition:all 0.5s ease;"></div>
                    </div>

                    <div style="background:#000; border:1px solid var(--term-border); padding:10px; border-radius:4px; font-size:10px;">
                        <strong style="color:var(--term-dim);">AST LINT ANALYSIS:</strong>
                        <p style="color:#d1d5db; margin-top:4px;">${selected.explanation}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function selectModule(id) {
    window.soundEngine.playKeypress();
    gameState.case04.selectedModId = id;
    renderCase04();
}

function exorciseModule(id) {
    const mod = CASE_DATA.modules.find(m => m.id === id);
    if (!mod) return;
    window.soundEngine.playLaserZap();
    window.soundEngine.playGlitch();
    mod.fixed = true;

    gameState.case04.daemonHealth = Math.max(0, gameState.case04.daemonHealth - 25);
    gameState.case04.daemonStatus = gameState.case04.daemonHealth === 0 ? 'EXORCISED' : gameState.case04.daemonHealth <= 25 ? 'CRITICAL' : 'AGITATED';

    addLedgerEntry('case-04', `Exorcised & Patched: ${mod.filename}`, `Eliminated ${mod.threat}`, mod.explanation, { bugs: 1 });

    updateCaseEvidence('case-04');

    if (gameState.case04.daemonHealth === 0) {
        const c = gameState.cases.find(x => x.id === 'case-04');
        c.status = 'EXORCISED';
        c.evidenceCollected = 4;
        window.soundEngine.playExorcismComplete();
        triggerConfetti();
    }

    renderCase04();
}

// Update Case Evidence count
function updateCaseEvidence(caseId) {
    const c = gameState.cases.find(x => x.id === caseId);
    if (c) {
        c.evidenceCollected = Math.min(c.totalEvidence, c.evidenceCollected + 1);
    }
}

// -----------------------------------------------------------------------------
// TIME-TRAVEL ROLLBACK LEDGER
// -----------------------------------------------------------------------------
function renderLedgerList() {
    const list = document.getElementById('ledger-entries-list');
    if (!list) return;

    list.innerHTML = gameState.ledger.map(e => `
        <div style="background:var(--term-panel-bg); border:1px solid var(--term-border); padding:10px; border-radius:4px; font-size:11px; display:flex; flex-direction:column; gap:4px;">
            <div style="display:flex; justify-content:space-between; font-size:10px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:4px;">
                <strong style="color:var(--term-main);">${e.id} [${e.timestamp}]</strong>
                <span style="color:var(--term-dim);">${e.caseId}</span>
            </div>
            <strong style="color:#fff;">${e.narrativeTitle}</strong>
            <div style="color:var(--term-main); font-size:10px;">⚡ ${e.realAction}</div>
            <div style="color:var(--term-dim); font-size:9px;">${e.details}</div>
        </div>
    `).join('');
}

function exportAuditReport() {
    let report = `=======================================================\n`;
    report += ` THE DIGITAL EXORCIST: CORP-NET FORENSIC DISPATCH\n`;
    report += ` INVESTIGATOR: DETECTIVE RICK "NULL" DECKARD\n`;
    report += ` TIMESTAMP: ${new Date().toISOString()}\n`;
    report += `=======================================================\n\n`;
    report += `TELEMETRY IMPACT:\n`;
    report += ` - Emails Vaporized:      ${gameState.telemetry.emailsVaporized.toLocaleString()}\n`;
    report += ` - Storage Reclaimed:     ${(gameState.telemetry.bytesReclaimed / (1024 * 1024 * 1024)).toFixed(2)} GB\n`;
    report += ` - Slush Fraud Blocked:   $${gameState.telemetry.fraudDollarsBlocked.toLocaleString()}\n`;
    report += ` - Bytecode Bugs Fixed:   ${gameState.telemetry.bugsPatched}\n`;
    report += ` - Time Saved:            ${gameState.telemetry.minutesSaved} Minutes\n`;
    report += ` - Estimated CO2 Saved:   ${gameState.telemetry.co2GramsSaved.toFixed(1)} Grams\n\n`;
    report += `IMMUTABLE AUDIT TRAIL:\n`;
    gameState.ledger.forEach(item => {
        report += `[${item.timestamp}] [${item.id}] [${item.caseId}]\n`;
        report += `  ACTION: ${item.narrativeTitle} -> ${item.realAction}\n`;
        report += `  DETAIL: ${item.details}\n\n`;
    });

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `corp_net_exorcist_audit_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}
