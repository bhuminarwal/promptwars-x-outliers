"""
Neural Sweep: Chronicles of Inbox Zero
Core Background Chore Engine & IMAP Integration Server
Zero external pip dependencies - uses Python 3 standard library:
(imaplib, email, http.server, json, sqlite3, ssl, urllib.request, threading)
"""

import os
import sys
import json
import time
import email
import imaplib
import ssl
import re
import urllib.request
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn
import threading
from email.header import decode_header
from typing import Dict, List, Any, Optional

PORT = 8844
WORKSPACE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(WORKSPACE_DIR, "static")

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass
class ChoreEngine:
    def __init__(self):
        self.lock = threading.Lock()
        self.mode = "simulation"  # "simulation" or "live_imap"
        self.imap_config = {
            "server": "imap.gmail.com",
            "port": 993,
            "username": "",
            "password": "",
            "folder": "INBOX",
            "ssl": True
        }
        self.imap_client: Optional[imaplib.IMAP4_SSL] = None
        self.is_connected = False
        
        # Real-world chore execution telemetry
        self.stats = {
            "emails_vaporized": 0,
            "bytes_reclaimed": 0,
            "unsubscribes_sent": 0,
            "whitelisted_senders": 0,
            "quarantined_count": 0,
            "co2_saved_grams": 0.0,
            "time_saved_minutes": 0.0
        }
        
        self.whitelist = set([
            "security@google.com",
            "no-reply@accounts.google.com",
            "support@github.com",
            "billing@apple.com"
        ])
        
        self.audit_log: List[Dict[str, Any]] = []
        self.action_queue: List[Dict[str, Any]] = []
        self.simulated_emails: List[Dict[str, Any]] = self._generate_simulated_corpus()
        self.live_emails_cache: List[Dict[str, Any]] = []
        self.worker_thread = threading.Thread(target=self._background_worker, daemon=True)
        self.worker_thread.start()

    def _generate_simulated_corpus(self) -> List[Dict[str, Any]]:
        """Rich authentic corpus of simulated spam, phish, and promotional mail."""
        return [
            {
                "id": "sim-101",
                "sender": "prince.ali@royal-heritage-fund.ng",
                "sender_name": "His Highness Prince Ali",
                "subject": "URGENT & CONFIDENTIAL: Transfer of $14.5M USD Inheritance Asset",
                "snippet": "Dear Beloved Friend, I have selected your email address to assist in liberating $14,500,000 USD currently secured in an escrow depository...",
                "size_kb": 42,
                "date": "2026-10-31 08:14",
                "category": "phishing",
                "threat_level": "boss",
                "hp": 220,
                "max_hp": 220,
                "attack": 25,
                "type_label": "The Royal Escrow Phish",
                "unsubscribe_url": None,
                "unsubscribe_mail": None,
                "spf_status": "FAIL",
                "dkim_status": "FAIL",
                "monster_sprite": "hydra",
                "lore": "An ancient cyber-hydra from the early days of Web 1.0. Promises infinite gold, delivers infinite identity theft."
            },
            {
                "id": "sim-102",
                "sender": "flash-deals@ultra-gadgets-direct.biz",
                "sender_name": "Ultra Gadgets Direct",
                "subject": "🚨 FINAL NOTICE: 92% OFF Tactical Drone & Sonic Peeler (Expires in 23 min!)",
                "snippet": "Don't miss our flash blowout clearance! Military grade titanium drone for only $19.99! Limited stock remaining in your zip code!",
                "size_kb": 1840,
                "date": "2026-10-31 09:30",
                "category": "promo",
                "threat_level": "swarm",
                "hp": 160,
                "max_hp": 160,
                "attack": 18,
                "type_label": "Flash-Sale Locust",
                "unsubscribe_url": "https://ultra-gadgets-direct.biz/unsub?id=883192",
                "unsubscribe_mail": "mailto:unsub@ultra-gadgets-direct.biz",
                "spf_status": "PASS",
                "dkim_status": "PASS",
                "monster_sprite": "locust",
                "lore": "Swarming automated sales drone. Cloaked in false urgency countdown timers."
            },
            {
                "id": "sim-103",
                "sender": "security-alert@acc-update-verify-portal92.co",
                "sender_name": "Global Bank Security Dept",
                "subject": "⚠️ Unauthorized access attempt detected on your checking account. Verify identity immediately.",
                "snippet": "We noticed an unrecognized login from Omsk, Russia. Your debit card has been restricted. Click here to confirm credentials.",
                "size_kb": 18,
                "date": "2026-10-31 10:02",
                "category": "phishing",
                "threat_level": "elite",
                "hp": 190,
                "max_hp": 190,
                "attack": 28,
                "type_label": "Spoofed Security Angler",
                "unsubscribe_url": None,
                "unsubscribe_mail": None,
                "spf_status": "FAIL",
                "dkim_status": "NONE",
                "monster_sprite": "angler",
                "lore": "Lures unsuspecting users into dark credential-harvesting waters with alarming red exclamation marks."
            },
            {
                "id": "sim-104",
                "sender": "brad@synergy-growth-accelerators.io",
                "sender_name": "Brad Stevens (Synergy Lead)",
                "subject": "Quick 15-minute sync to explore explosive synergies between our teams?",
                "snippet": "Hey there! I saw you are doing incredible work. Did you see my previous 4 emails? Thought I'd bump this to the very top of your thoughts...",
                "size_kb": 24,
                "date": "2026-10-31 11:15",
                "category": "cold_outreach",
                "threat_level": "minion",
                "hp": 110,
                "max_hp": 110,
                "attack": 12,
                "type_label": "The Relentless Bumper",
                "unsubscribe_url": "https://synergy-growth-accelerators.io/optout",
                "unsubscribe_mail": None,
                "spf_status": "PASS",
                "dkim_status": "PASS",
                "monster_sprite": "drone",
                "lore": "Programmed to never take silence for an answer. Will continue sending 'just bubbling this up' until the heat death of the universe."
            },
            {
                "id": "sim-105",
                "sender": "digest@forgotten-hobby-club-2019.net",
                "sender_name": "Bonsai Enthusiasts Weekly",
                "subject": "Weekly Bonsai Roundup #342: Pruning Juniper Shoots in Autumn",
                "snippet": "Welcome to your weekly digest! You subscribed to this newsletter 6 years, 4 months ago and have not opened an issue since 2019...",
                "size_kb": 620,
                "date": "2026-10-31 06:45",
                "category": "newsletter",
                "threat_level": "zombie",
                "hp": 140,
                "max_hp": 140,
                "attack": 10,
                "type_label": "The Zombie Newsletter",
                "unsubscribe_url": "https://forgotten-hobby-club-2019.net/unsubscribe?user=token9912",
                "unsubscribe_mail": "mailto:leave@forgotten-hobby-club-2019.net",
                "spf_status": "PASS",
                "dkim_status": "PASS",
                "monster_sprite": "zombie",
                "lore": "An undead newsletter shambling into the inbox year after year, feeding on innocent gigabytes."
            },
            {
                "id": "sim-106",
                "sender": "rewards@crypto-vault-airdrop77.xyz",
                "sender_name": "Elon DOGE Moon Giveaway",
                "subject": "You have 450,000 $DOGEX waiting in your claim wallet! Click to claim before expiration",
                "snippet": "Connect Web3 wallet immediately to sign claim transaction. Zero gas fee voucher applied!",
                "size_kb": 35,
                "date": "2026-10-31 11:45",
                "category": "phishing",
                "threat_level": "boss",
                "hp": 240,
                "max_hp": 240,
                "attack": 30,
                "type_label": "Crypto Mirage Behemoth",
                "unsubscribe_url": None,
                "unsubscribe_mail": None,
                "spf_status": "FAIL",
                "dkim_status": "FAIL",
                "monster_sprite": "behemoth",
                "lore": "Radiates false promises of generational wealth. Leaves wallets barren."
            },
            {
                "id": "sim-107",
                "sender": "deals@mattress-discount-warehouse.online",
                "sender_name": "Mattress Warehouse",
                "subject": "😴 Is your back aching? 4th of July in October Mattress Extravaganza!",
                "snippet": "Cloud foam hybrid mattresses starting at $79. Free cooling gel pillow with code SLEEPNOW...",
                "size_kb": 2200,
                "date": "2026-10-30 14:12",
                "category": "promo",
                "threat_level": "swarm",
                "hp": 180,
                "max_hp": 180,
                "attack": 14,
                "type_label": "Foam Mattress Siren",
                "unsubscribe_url": "https://mattress-discount-warehouse.online/unsub",
                "unsubscribe_mail": "mailto:unsubscribe@mattress-discount-warehouse.online",
                "spf_status": "PASS",
                "dkim_status": "PASS",
                "monster_sprite": "locust",
                "lore": "Heavy 2.2 megabyte HTML monstrosity loaded with uncompressed 4K mattress photos."
            },
            {
                "id": "sim-108",
                "sender": "tracker@sneaky-ad-telemetry.trackpix.org",
                "sender_name": "Unknown Pixel Tracker",
                "subject": "[Receipt & Order Confirmation #49281] - Your item has departed warehouse",
                "snippet": "<img src='https://sneaky-ad-telemetry.trackpix.org/1x1.gif?uid=target' width='1' height='1'> Please inspect receipt enclosed.",
                "size_kb": 12,
                "date": "2026-10-30 20:00",
                "category": "tracker",
                "threat_level": "ghost",
                "hp": 85,
                "max_hp": 85,
                "attack": 16,
                "type_label": "Tracking Pixel Banshee",
                "unsubscribe_url": None,
                "unsubscribe_mail": None,
                "spf_status": "NONE",
                "dkim_status": "NONE",
                "monster_sprite": "ghost",
                "lore": "Invisible 1x1 pixel spy beacon silently harvesting your IP address and open rates."
            }
        ]

    def connect_imap(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Attempt connection to real IMAP server."""
        with self.lock:
            self.imap_config.update(config)
            server = self.imap_config.get("server", "imap.gmail.com")
            port = int(self.imap_config.get("port", 993))
            username = self.imap_config.get("username", "")
            password = self.imap_config.get("password", "")
            use_ssl = self.imap_config.get("ssl", True)

            try:
                if use_ssl:
                    context = ssl.create_default_context()
                    client = imaplib.IMAP4_SSL(server, port, ssl_context=context)
                else:
                    client = imaplib.IMAP4(server, port)

                client.login(username, password)
                self.imap_client = client
                self.is_connected = True
                self.mode = "live_imap"
                return {
                    "success": True,
                    "message": f"Successfully connected to {server} as {username}! Live real-world link active."
                }
            except Exception as e:
                self.is_connected = False
                return {
                    "success": False,
                    "error": str(e),
                    "message": f"Could not connect to {server}: {str(e)}. Tip: For Gmail, ensure 2FA is on and use a 16-character App Password (not your main password)."
                }

    def set_simulation_mode(self):
        with self.lock:
            self.mode = "simulation"
            self.is_connected = False
            if self.imap_client:
                try:
                    self.imap_client.logout()
                except Exception:
                    pass
                self.imap_client = None

    def scan_mailbox(self, folder: str = "INBOX", max_count: int = 15) -> List[Dict[str, Any]]:
        """Scans either real IMAP inbox or simulated mailbox."""
        if self.mode == "simulation" or not self.is_connected:
            with self.lock:
                return [m for m in self.simulated_emails if m["hp"] > 0]

        # Live IMAP scanning
        try:
            with self.lock:
                if not self.imap_client:
                    return []
                
                self.imap_client.select(folder)
                # Search for unread or recent spam/promo
                status, messages = self.imap_client.search(None, 'ALL')
                if status != 'OK' or not messages[0]:
                    return []

                msg_ids = messages[0].split()
                # Get the most recent max_count messages
                recent_ids = msg_ids[-max_count:]
                targets = []

                for uid in reversed(recent_ids):
                    res, data = self.imap_client.fetch(uid, '(BODY.PEEK[HEADER.FIELDS (SUBJECT FROM DATE LIST-UNSUBSCRIBE RECEIVED)] RFC822.SIZE)')
                    if res != 'OK':
                        continue

                    raw_header = b""
                    size_bytes = 1024
                    for part in data:
                        if isinstance(part, tuple):
                            raw_header = part[1]
                        elif isinstance(part, bytes) and b"RFC822.SIZE" in part:
                            m = re.search(rb"RFC822\.SIZE (\d+)", part)
                            if m:
                                size_bytes = int(m.group(1))

                    msg = email.message_from_bytes(raw_header)
                    subject = self._decode_header_str(msg.get("Subject", "(No Subject)"))
                    sender = self._decode_header_str(msg.get("From", "Unknown"))
                    unsub = msg.get("List-Unsubscribe", "")
                    
                    sender_email = self._extract_email_address(sender)
                    if sender_email in self.whitelist:
                        continue # Safely skip whitelisted contacts

                    # Heuristic spam & enemy classification
                    classified = self._classify_real_email(uid.decode("utf-8"), sender, sender_email, subject, unsub, size_bytes)
                    targets.append(classified)

                self.live_emails_cache = targets
                return targets

        except Exception as e:
            print(f"Error scanning live IMAP: {e}")
            return []

    def _decode_header_str(self, header_value: str) -> str:
        """Safely decodes RFC 2047 encoded email headers."""
        if not header_value:
            return ""
        try:
            decoded_parts = decode_header(header_value)
            text = ""
            for part, encoding in decoded_parts:
                if isinstance(part, bytes):
                    text += part.decode(encoding or "utf-8", errors="replace")
                else:
                    text += str(part)
            return text
        except Exception:
            return str(header_value)

    def _extract_email_address(self, raw_from: str) -> str:
        match = re.search(r'[\w\.-]+@[\w\.-]+', raw_from)
        return match.group(0).lower() if match else raw_from.lower()

    def _classify_real_email(self, uid: str, raw_sender: str, sender_email: str, subject: str, unsub_header: str, size_bytes: int) -> Dict[str, Any]:
        """Turn a real-world email into a game enemy entity."""
        size_kb = max(1, size_bytes // 1024)
        sub_lower = subject.lower()
        
        # Categorize
        category = "promo"
        threat_level = "minion"
        type_label = "Digital Junk Entity"
        monster_sprite = "locust"
        hp = min(300, max(80, int(size_kb * 0.8) + 50))
        attack = 12

        unsub_url = None
        unsub_mail = None
        if unsub_header:
            url_match = re.search(r'<https?://([^>]+)>', unsub_header)
            mail_match = re.search(r'<mailto:([^>]+)>', unsub_header)
            if url_match:
                unsub_url = "http" + url_match.group(0)[4:-1]
            if mail_match:
                unsub_mail = "mailto:" + mail_match.group(1)

        # Phishing detection heuristics
        phish_keywords = ["urgent", "verify", "suspended", "security alert", "password reset", "claim your", "inheritance", "bitcoin", "crypto", "unauthorized"]
        promo_keywords = ["off", "discount", "deal", "clearance", "sale", "limited time", "exclusive", "coupon", "save $", "% off"]
        newsletter_keywords = ["newsletter", "digest", "weekly", "edition", "daily", "bulletin", "roundup"]

        if any(k in sub_lower for k in phish_keywords):
            category = "phishing"
            threat_level = "boss" if ("inheritance" in sub_lower or "crypto" in sub_lower or "claim" in sub_lower) else "elite"
            type_label = "The Phishing Angler" if threat_level == "elite" else "Malware Leviathan"
            monster_sprite = "angler" if threat_level == "elite" else "hydra"
            hp = 220
            attack = 26
        elif any(k in sub_lower for k in promo_keywords):
            category = "promo"
            threat_level = "swarm"
            type_label = "Flash-Sale Locust"
            monster_sprite = "locust"
            attack = 15
        elif any(k in sub_lower for k in newsletter_keywords) or unsub_url:
            category = "newsletter"
            threat_level = "zombie"
            type_label = "The Zombie Newsletter"
            monster_sprite = "zombie"
            attack = 10
        elif "quick question" in sub_lower or "synergy" in sub_lower or "touch base" in sub_lower:
            category = "cold_outreach"
            threat_level = "drone"
            type_label = "Cold Outreach Drone"
            monster_sprite = "drone"
            attack = 14

        return {
            "id": uid,
            "sender": sender_email,
            "sender_name": raw_sender.split("<")[0].strip() or sender_email,
            "subject": subject,
            "snippet": f"Real message from {sender_email} ({size_kb} KB)",
            "size_kb": size_kb,
            "date": "Live Message",
            "category": category,
            "threat_level": threat_level,
            "hp": hp,
            "max_hp": hp,
            "attack": attack,
            "type_label": type_label,
            "unsubscribe_url": unsub_url,
            "unsubscribe_mail": unsub_mail,
            "spf_status": "UNKNOWN",
            "dkim_status": "UNKNOWN",
            "monster_sprite": monster_sprite,
            "lore": f"Intercepted from your comms port: '{subject}'. Clogging {size_kb} KB of vital bandwidth."
        }

    def queue_action(self, action_type: str, target_id: str, extra: Dict[str, Any] = None) -> Dict[str, Any]:
        """Enqueue an email declutter chore action."""
        with self.lock:
            payload = {
                "action": action_type,
                "target_id": str(target_id),
                "timestamp": time.time(),
                "extra": extra or {}
            }
            self.action_queue.append(payload)
            return {"queued": True, "action": action_type, "target_id": target_id}

    def _background_worker(self):
        """Continuously processes declutter chore queue in background."""
        while True:
            item = None
            with self.lock:
                if self.action_queue:
                    item = self.action_queue.pop(0)

            if item:
                try:
                    self._execute_single_action(item)
                except Exception as e:
                    print(f"Error executing chore action {item}: {e}")
            else:
                time.sleep(0.1)

    def _execute_single_action(self, item: Dict[str, Any]):
        action = item["action"]
        target_id = item["target_id"]
        extra = item.get("extra", {})

        target_info = None
        # Find item in sim or live cache
        with self.lock:
            if self.mode == "simulation":
                for m in self.simulated_emails:
                    if str(m["id"]) == target_id:
                        target_info = dict(m)
                        break
            else:
                for m in self.live_emails_cache:
                    if str(m["id"]) == target_id:
                        target_info = dict(m)
                        break

        if not target_info:
            target_info = {
                "id": target_id,
                "subject": extra.get("subject", "Target Data Packet"),
                "sender": extra.get("sender", "unknown@sender.com"),
                "size_kb": extra.get("size_kb", 50),
                "unsubscribe_url": extra.get("unsubscribe_url")
            }

        size_bytes = target_info.get("size_kb", 50) * 1024

        # Execute according to action type
        if action == "trash" or action == "vaporize":
            # Real IMAP: Flag as \Deleted or move to Trash
            if self.mode == "live_imap" and self.imap_client:
                try:
                    # Mark deleted and expunge
                    self.imap_client.store(target_id, '+FLAGS', '\\Deleted')
                    self.imap_client.expunge()
                except Exception as e:
                    print(f"IMAP delete error on {target_id}: {e}")

            # Telemetry update
            with self.lock:
                self.stats["emails_vaporized"] += 1
                self.stats["bytes_reclaimed"] += size_bytes
                self.stats["co2_saved_grams"] += round(size_bytes * 0.00002, 3) # ~20g per GB/year
                self.stats["time_saved_minutes"] += 1.5 # Avg distraction prevented
                
                log_entry = {
                    "id": f"log-{int(time.time()*1000)}",
                    "action": "VAPORIZED",
                    "icon": "💥",
                    "description": f"Expelled from inbox: '{target_info.get('subject')}' from {target_info.get('sender')}",
                    "space_freed": f"{target_info.get('size_kb', 0)} KB",
                    "timestamp": time.strftime("%H:%M:%S")
                }
                self.audit_log.insert(0, log_entry)

        elif action == "unsubscribe" or action == "emp":
            unsub_url = target_info.get("unsubscribe_url")
            unsub_mail = target_info.get("unsubscribe_mail")
            status_desc = "Unsubscribe signal broadcasted"

            if unsub_url and unsub_url.startswith("http"):
                try:
                    # Safe GET or POST with timeout
                    req = urllib.request.Request(
                        unsub_url,
                        headers={'User-Agent': 'NeuralSweep-InboxZero-Protocol/1.0'}
                    )
                    with urllib.request.urlopen(req, timeout=5) as response:
                        status_desc = f"HTTP {response.getcode()} confirmed at unsubscribe endpoint"
                except Exception as e:
                    status_desc = f"Unsubscribe link triggered (Endpoint returned {e})"

            # Also delete/trash the message as part of the EMP sweep
            if self.mode == "live_imap" and self.imap_client:
                try:
                    self.imap_client.store(target_id, '+FLAGS', '\\Deleted')
                    self.imap_client.expunge()
                except Exception:
                    pass

            with self.lock:
                self.stats["unsubscribes_sent"] += 1
                self.stats["emails_vaporized"] += 1
                self.stats["bytes_reclaimed"] += size_bytes
                self.stats["time_saved_minutes"] += 15.0 # Unsubscribing saves continuous future interruptions!
                
                log_entry = {
                    "id": f"log-{int(time.time()*1000)}",
                    "action": "UNSUBSCRIBED",
                    "icon": "⚡",
                    "description": f"Severed subscription for {target_info.get('sender')}: {status_desc}",
                    "space_freed": f"{target_info.get('size_kb', 0)} KB",
                    "timestamp": time.strftime("%H:%M:%S")
                }
                self.audit_log.insert(0, log_entry)

        elif action == "whitelist" or action == "aegis":
            sender = target_info.get("sender")
            with self.lock:
                self.whitelist.add(sender)
                self.stats["whitelisted_senders"] += 1
                log_entry = {
                    "id": f"log-{int(time.time()*1000)}",
                    "action": "WHITELISTED",
                    "icon": "🛡️",
                    "description": f"Sender {sender} secured in Aegis Whitelist. Will never be targeted.",
                    "space_freed": "0 KB (Protected)",
                    "timestamp": time.strftime("%H:%M:%S")
                }
                self.audit_log.insert(0, log_entry)

        elif action == "quarantine":
            # Real IMAP: Move to quarantine folder
            if self.mode == "live_imap" and self.imap_client:
                try:
                    # Ensure folder exists
                    self.imap_client.create("[Spam_Quarantine]")
                    self.imap_client.copy(target_id, "[Spam_Quarantine]")
                    self.imap_client.store(target_id, '+FLAGS', '\\Deleted')
                    self.imap_client.expunge()
                except Exception as e:
                    print(f"Quarantine move error: {e}")

            with self.lock:
                self.stats["quarantined_count"] += 1
                log_entry = {
                    "id": f"log-{int(time.time()*1000)}",
                    "action": "QUARANTINED",
                    "icon": "📦",
                    "description": f"Transferred to [Spam_Quarantine]: '{target_info.get('subject')}'",
                    "space_freed": f"{target_info.get('size_kb', 0)} KB (Stasis)",
                    "timestamp": time.strftime("%H:%M:%S")
                }
                self.audit_log.insert(0, log_entry)


# Initialize global engine
engine = ChoreEngine()

class NeuralSweepRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=STATIC_DIR, **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        
        if path == "/api/status":
            self.send_json_response({
                "mode": engine.mode,
                "is_connected": engine.is_connected,
                "config": {
                    "server": engine.imap_config.get("server"),
                    "username": engine.imap_config.get("username"),
                    "folder": engine.imap_config.get("folder")
                },
                "stats": engine.stats
            })
        elif path == "/api/scan":
            query = urllib.parse.parse_qs(parsed.query)
            folder = query.get("folder", ["INBOX"])[0]
            targets = engine.scan_mailbox(folder=folder)
            self.send_json_response({
                "mode": engine.mode,
                "count": len(targets),
                "targets": targets
            })
        elif path == "/api/audit-log":
            with engine.lock:
                self.send_json_response({
                    "stats": engine.stats,
                    "logs": engine.audit_log[:40]
                })
        else:
            # Fall back to serving static files
            super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else "{}"
        
        try:
            data = json.loads(body)
        except Exception:
            data = {}

        if path == "/api/connect":
            mode_choice = data.get("mode", "simulation")
            if mode_choice == "simulation":
                engine.set_simulation_mode()
                self.send_json_response({"success": True, "mode": "simulation", "message": "Simulation Holodeck activated."})
            else:
                config = data.get("config", {})
                res = engine.connect_imap(config)
                self.send_json_response(res)

        elif path == "/api/action":
            action_type = data.get("action", "trash")
            target_id = data.get("target_id")
            extra = data.get("extra", {})
            res = engine.queue_action(action_type, target_id, extra)
            self.send_json_response(res)

        elif path == "/api/reset-simulation":
            with engine.lock:
                engine.simulated_emails = engine._generate_simulated_corpus()
            self.send_json_response({"success": True, "message": "Simulated inbox repopulated."})
        else:
            self.send_error(404, "Endpoint not found")

    def send_json_response(self, data: Any):
        body = json.dumps(data).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()


class ThreadedServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True


def start_server():
    os.makedirs(STATIC_DIR, exist_ok=True)
    server_address = ('', PORT)
    httpd = ThreadedServer(server_address, NeuralSweepRequestHandler)
    print(f"============================================================")
    print(f"⚡ THE DIGITAL EXORCIST: CORP-NET INVESTIGATIONS")
    print(f"Branching Cyberpunk Noir Detective RPG & Hacker Sim")
    print(f"Local Console: http://localhost:{PORT}")
    print(f"Detective: Rick 'Null' Deckard // Active Protocol")
    print(f"============================================================", flush=True)
    httpd.serve_forever()

if __name__ == "__main__":
    start_server()
