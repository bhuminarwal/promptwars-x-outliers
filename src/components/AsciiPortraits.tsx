import React from 'react';

export const ASCII_PORTRAITS: Record<string, string> = {
  NULL_DECKARD: `
    .---.      
   /     \\     DETECTIVE RICK "NULL" DECKARD
  | () () |    RANK: Rogue Digital Exorcist
   \\  ^  /     BADGE: #000-REVOKED
    |||||      STATUS: Hunting Corp-Net Syndicate
  .-------.    "Every spam beacon leaves a ghost."
 / |  |  | \\
`,

  VANE: `
  .==========. 
  | [======] | AGENT VANE
  |  (o)(o)  | VP of Growth & Botmaster
  |   ====   | ALIAS: The Locust Queen
  |  \\____/  | THREAT: High (5,000 Automated Beacons)
  '----------' "Engagement is up 300%. Don't touch my bots."
`,

  GHOST: `
   .--------.  
  /  ??????  \\ THE GHOST IN THE CACHE
 |  [o]  [o]  | ROLE: Ex-Sysadmin / Storage Hoarder
 |     __     | STATUS: Dormant in /downloads_dump
  \\  \\====/  / THREAT: Extreme (12.4 GB Poisoned Storage)
   '--------'  "What gets downloaded can never be deleted."
`,

  KANE: `
  .----------. 
  |  $$  $$  | HARRISON KANE
  |  (-)(O)  | Chief Financial Officer (CFO)
  |    __    | SLUSH FUND: $142,500 Offshore Cayman
  |   \\==/   | AUDIT RISK: Criminal Embezzlement
  '----------' "Everything can be expensed if you have the key."
`,

  DAEMON: `
  <[ 0xDEADBEEF ]>
   /\\  ____  /\\  ROGUE NEURAL DAEMON
  |  \\/    \\/  | THREAT: Bytecode Corruption Tier 4
  | [X]    [X] | MEMORY LEAKS: Exponential
  |    WWWW    | STABILITY: Critical Anomaly
   \\  MMMMMM  /  "EVAL() IS MY CRADLE. YOUR RECURSION IS INFINITE."
    '--------'
`,

  SYSTEM: `
  .------------.
  | [CORP-NET] | CENTRAL COMMAND INTERFACE
  |  SYS: 8844 | FORENSIC DUAL-STATE BRIDGE
  |  STATUS:OK | PROTOCOL: EXORCIST_ACTIVE
  '------------'
`
};

interface AsciiPortraitProps {
  name: string;
  className?: string;
  themeColor?: string;
}

export const AsciiPortrait: React.FC<AsciiPortraitProps> = ({ name, className = '', themeColor = 'text-[var(--term-main)]' }) => {
  const art = ASCII_PORTRAITS[name] || ASCII_PORTRAITS.SYSTEM;

  return (
    <pre
      className={`font-mono text-xs leading-[1.15] select-none p-2 border border-[var(--term-border)] bg-[var(--term-panel-bg)] rounded ${themeColor} ${className}`}
      style={{ textShadow: '0 0 5px currentColor' }}
    >
      {art.trim()}
    </pre>
  );
};
