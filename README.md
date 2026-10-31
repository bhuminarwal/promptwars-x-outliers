# ⚡ THE DIGITAL EXORCIST: CORP-NET INVESTIGATIONS
### *Branching Cyberpunk Noir Detective RPG & Hacker Sim*
> *"Every narrative interrogation choice, evidence triage puzzle, and bytecode exorcism physically cleans up real-world digital hoarding."*

---

## 🕶️ Concept & Setting

In the hyper-conglomerate mainframe of **Apex Global Corp-Net**, you operate as **Detective Rick "Null" Deckard**—a rogue digital investigator equipped with forensic bytecode analysis tools. 

A shadowy corporate syndicate is suffocating company servers under the weight of **digital hoarding**: 5,000 unread spam beacons masking an internal whistleblower memo, 12+ GB of disguised malware and duplicate kickback invoices in the dark-ops downloads dump, $142,500 in Panamanian shell company expense fraud, and a poisoned autonomous AI daemon (`0xDEADBEEF`) injecting memory leaks and eval backdoors into core services.

---

## 🛠️ System Architecture & Tech Stack

- **Framework**: Vite + React + TypeScript (Minimal footprint: `react`, `react-dom`, `lucide-react`, `canvas-confetti`).
- **Aesthetic**: 90s Cyberpunk Noir / Police Terminal (Monochrome phosphor green `#00ff66`, amber `#ffb000`, and cyan `#00f0ff` on charcoal `#090d13`, typewriter reveals, ASCII art character portraits, wireframe CCTV surveillance).
- **Procedural Audio Engine** (`/src/lib/soundtrack.ts` & `/static/audio.js`): 100% procedural Web Audio API with zero external audio assets:
  - Moody low-fi noir synth drone with tape-flutter LFO
  - Mechanical typewriter keypress clatter (pitch-randomized)
  - Tape-deck motor clicks & mechanical relays
  - Static radio glitch bursts
  - Interrogation tension chords & evidence discovery stingers
  - Laser zaps, EMP pulses, and exorcism victory fanfares
- **Dual-State Execution Bridge & Time-Travel Ledger** (`/src/lib/caseLedger.ts`):
  - Every dialogue branch, spam purge, file incineration, expense flag, and bytecode patch is recorded in an immutable ledger.
  - **Instant Time-Travel / Rollback**: Scrub backward or click "Rewind to this state" to restore previous game states.
  - **Forensic Dispatch Export**: One-click download of the complete ASCII investigation audit report.
- **Zero-Setup Demo Data**: 500+ pre-seeded realistic digital artifacts (shady corporate newsletters, cluttered downloads, mysterious expense receipts, and buggy JavaScript files).

---

## 📋 The 4 Interactive Cases (Mission Board)

### 1. Case 01: "The Spam Syndicate" (Inbox Exorcism — Interrogation Sim)
- **Suspect**: Agent Vane (VP of Growth & Botmaster)
- **Hoarding Target**: 5,000 Unread Corporate Spam Beacons & Phishing Traps
- **Gameplay**:
  - Interrogate Agent Vane in cell B-1 using Pressure, Leverage, Sympathize, and Corner tactics.
  - Extract the Unsubscribe Master Token: `X-SYN-UNSUB-MASTER-TOKEN-9941`.
  - Laser Vaporize unread email batches or fire the **Unsubscribe EMP Blast** to purge all 5,000 spam beacons in one strike.
  - Whitelist SecOps alerts (`security@corp-net.internal`) and decrypt the hidden whistleblower memo inside the promotional synergy blast.

### 2. Case 02: "The Download Abyss" (Ghost Cache — Storage Forensics)
- **Suspect**: The Ghost in the Cache (Ex-Sysadmin Hoarder)
- **Hoarding Target**: 12.4 GB Cluttered Downloads, Disguised Trojans, Duplicate Invoices
- **Gameplay**:
  - Triage the dark-ops downloads dump: deposit evidence in the Vault, quarantine malware, and incinerate bloat.
  - Unmask `Quarterly_Bonus_Spreadsheet.xlsx.exe` (PE32+ Trojan Keylogger).
  - Run the **Cryptographic Hash Deduplicator** to match identical SHA-256 hashes (`e3b0c442...`) between duplicate invoices used for kickbacks.
  - Zero-fill incinerate 4.8 GB memory crash dumps, 3.2 GB node_modules tarballs, and scratch video cache to reclaim over 12 GB of drive space.
  - Secure the surveillance audio wiretap recording of CFO Harrison Kane.

### 3. Case 03: "The Phantom Ledger" (Offshore Protocol — Forensic Expense Audit)
- **Suspect**: Harrison Kane (Chief Financial Officer)
- **Hoarding Target**: $142,500 Fraudulent Shell Company Invoices
- **Gameplay**:
  - Audit corporate expense vouchers with an interactive OCR magnifying glass.
  - Correlate invoice timestamps against mainframe server intrusion logs matching CFO Kane's master badge and Panama Tor exit relays.
  - Flag shell entities ("Void Enterprises Global", "Panama Data Vaults Ltd.", "The Black Rose Lounge", "Apex Phantom Holdings LLC") and void $142,500 in slush fund payouts.
  - Approve legitimate cafeteria and AWS hosting expenses to balance corporate books.
  - Uncover the purchase voucher for the poisoned malware daemon `0xDEADBEEF`.

### 4. Case 04: "Bytecode Heresy" (The Corrupted Daemon — Interactive Code Linter)
- **Suspect**: Daemon `0xDEADBEEF` (Autonomous Corrupted Neural Daemon)
- **Hoarding Target**: Poisoned Memory Leaks, Dangling Promises & Syntax Errors
- **Gameplay**:
  - Access the Cyber-IDE hacker terminal with monospaced TypeScript editor.
  - Inspect 4 corrupted core services (`authMiddleware.ts`, `telemetryStream.ts`, `cryptoLedger.ts`, `eventBusCollector.ts`).
  - Run the AST Linter & Security Profiler to pinpoint vulnerabilities (`eval()` arbitrary code execution, 1,000,000 item array memory leak, infinite recursion, unclosed template literals, zombie intervals).
  - Exorcise bytecode patches to repair each service, dealing 25% damage to Daemon 0xDEADBEEF per module.
  - Collapse daemon stability from 100% to 0% for the grand finale exorcism and phosphor confetti burst!

---

## 🚀 Quick Launch (Zero External Dependencies)

### Option A: Instant Python Server (Zero pip install required!)
The application ships with a built-in Python 3 server:
```powershell
python server.py
```
Open your browser to:
```
http://localhost:8844
```

### Option B: Vite + React Development (Node 18+)
```powershell
npm install
npm run dev
```

---

## 🎮 Controls & Interface
- **Theme Switcher**: Top navigation buttons `GRN` (Phosphor Green), `AMB` (Phosphor Amber), `CYN` (Cyber Cyan).
- **CRT Filter Toggle**: Click `📺 CRT Filter` to toggle scanline raster overlay.
- **Audio Engine**: Click `🔊 Synth: ON` to toggle the procedural noir synth drone and mechanical sound effects.
- **Time-Travel Ledger**: Click `📜 TIME-TRAVEL [X]` in the header to view the audit history, rewind state, or export forensic dispatches.
- **Mission Board**: Click the `THE DIGITAL EXORCIST` brand logo or `◄ CORKBOARD` anytime to return to the mission board.
