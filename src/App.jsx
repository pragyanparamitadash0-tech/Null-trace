import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  Search,
  FileText,
  Clock,
  GitBranch,
  Scale,
  Terminal,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Compass,
  Layers,
  UserCheck,
  Bot,
  Eye,
  Filter,
  Play,
  RotateCcw,
  Award,
  Lock,
  Unlock,
  Info,
  X,
  Plus,
  Trash2,
  ClipboardCheck,
  Sparkles,
  ArrowRight,
  Database,
  HelpCircle
} from 'lucide-react';

// ============================================================================
// NULLTRACE — CASE 001: THE SILENT EXPORT (REVIEWED & HARDENED MVP)
// Note on Single-File Preview Architecture:
// In this interactive preview environment, all modules are consolidated into
// App.jsx with clear domain boundaries (Content, Engines, Persistence, UI).
// ============================================================================

const SAVE_STORAGE_KEY = 'nulltrace_case001_save_v2';

// ============================================================================
// DOMAIN MODULE 1: CASE CONTENT, GLOSSARY & SYNTHETIC EVIDENCE (RFC 5737 IPs)
// ============================================================================

const GLOSSARY_TERMS = [
  {
    term: 'SOC (Security Operations Centre)',
    category: 'Operations',
    plain:
      'A dedicated team and workspace that monitors an organisation’s computers, servers, and networks to spot unusual activity and respond to security problems.',
    analogy:
      'Like an air-traffic control tower watching radar screens—not every blip is an emergency, so controllers check flight plans before sounding an alarm.'
  },
  {
    term: 'Log / Audit Record',
    category: 'Evidence',
    plain:
      'An automatic timestamped note created by a computer or application whenever something happens (such as a login, file download, or page request).',
    analogy:
      'Like a building’s electronic keycard swipe register: it tells you which badge opened which door and at what time, though not necessarily who held the badge.'
  },
  {
    term: 'Authentication vs. Authorisation',
    category: 'Identity',
    plain:
      'Authentication proves WHO you are (e.g., username + password). Authorisation defines WHAT you are allowed to do once inside (e.g., viewing vs. exporting customer records).',
    analogy:
      'Authentication is showing your passport at airport security; authorisation is your boarding pass determining whether you can enter the cockpit or only seat 14A.'
  },
  {
    term: 'Baseline',
    category: 'Analysis',
    plain:
      'The normal, everyday pattern of activity on a system. You have to know what "normal" looks like before you can reliably spot what is abnormal.',
    analogy:
      'Knowing that a bakery normally receives flour deliveries at 05:00 AM helps you notice when a van arrives unexpectedly at midnight.'
  },
  {
    term: 'False Positive',
    category: 'Analysis',
    plain:
      'An alert or unusual-looking event that turns out to be harmless, authorised, or expected once investigated.',
    analogy:
      'A smoke detector going off because someone burnt toast—the sensor worked, but there is no house fire.'
  },
  {
    term: 'HTTP Status Codes (200 vs. 404)',
    category: 'Web',
    plain:
      'Three-digit numbers web servers send back to describe what happened. 200 OK means the request succeeded. 404 Not Found means the requested file or path does not exist.',
    analogy:
      '200 is a librarian handing you the book you asked for; 404 is the librarian saying, "We do not carry that title."'
  },
  {
    term: 'MB vs. MiB (Decimal vs. Binary Bytes)',
    category: 'Forensics',
    plain:
      '50,541,200 bytes equals ~50.54 MB (decimal, base-1000: 50,541,200 / 1,000,000) or ~48.20 MiB (binary, base-1024: 50,541,200 / 1,048,576). Analysts note the unit so different tools do not look contradictory.',
    analogy:
      'Like measuring the same distance in kilometres versus miles—the underlying road length has not changed, only the unit scale.'
  },
  {
    term: 'IST (UTC+05:30)',
    category: 'Forensics',
    plain:
      'Indian Standard Time, which is 5 hours and 30 minutes ahead of Coordinated Universal Time (UTC). Different servers sometimes record timestamps in UTC or IST.',
    analogy:
      'Comparing two witness statements without checking whether one person’s watch was set to London time and the other to Mumbai time.'
  }
];

const EVIDENCE_ITEMS = [
  {
    id: 'EV-01',
    title: 'Wednesday Morning SOC Handover Note',
    source: 'Internal Shift Log (SOC-shift-notes)',
    timestamp: '2026-11-18 08:30 IST (03:00 UTC)',
    chapterUnlocked: 1,
    category: 'Operations',
    summary:
      'Overnight analyst handover noting a 02:00 IST backup run, routine web 404 scans, and an unusual bulk data export flag.',
    rawObservation: `SHIFT HANDOVER — ASTERION SYSTEMS SOC
Date: Wednesday, 18 Nov 2026 | Window: 00:00–08:00 IST (UTC+05:30)
Outgoing Analyst: Kabir Dutta (Junior SOC Analyst)

1. 02:00 IST: Scheduled nightly database backup job (svc_backup) ran as expected.
2. 02:14–02:19 IST: Automated internet scanner from 198.51.100.44 probed /wp-admin, /.env, /phpmyadmin. All returned HTTP 404.
3. 03:42 IST: Alert rule [EXPORT-BULK-04] triggered. Account 'r.deshmukh' (App Admin role) exported 'client_billing_q3_full.csv' (50,541,200 bytes: ~50.54 MB / ~48.20 MiB; 62,400 rows) from Portal-Prod-01.
4. Note from Kabir: "Looks like r.deshmukh was hacked overnight or leaked data at 3:42 AM! Also saw scanner hits earlier. Recommending immediate lock."`,
    fieldGuide: [
      {
        field: '198.51.100.44',
        meaning: 'Documentation-range external IP address performing automated internet-wide path scanning.'
      },
      {
        field: 'HTTP 404',
        meaning: 'Server response meaning the requested path was not found—no page or file was served.'
      },
      {
        field: '50,541,200 bytes (~50.54 MB / ~48.20 MiB)',
        meaning: 'Exact byte count transferred. Equal to 50.54 decimal megabytes (MB) or 48.20 binary mebibytes (MiB).'
      }
    ]
  },
  {
    id: 'EV-02',
    title: '3-Day Baseline & Scheduled Backup Job Log',
    source: 'Scheduler-01 / Ops Baseline Archive',
    timestamp: '2026-11-15 to 2026-11-18 02:05 IST',
    chapterUnlocked: 1,
    category: 'Baseline',
    summary:
      'Historical baseline showing normal administrator export volume (< 1.5 MB during daytime) and nightly 02:00 IST backups.',
    rawObservation: `ASTERION SYSTEMS — 72-HOUR OPERATIONAL BASELINE
- Business Hours: 09:00–19:00 IST (Mon–Fri).
- Normal Admin Exports (r.deshmukh): 1–2 small summary CSVs/day (< 1.5 MB) between 11:00 and 17:30 IST. Zero exports recorded between 22:00 and 07:00 IST over the past 90 days.
- Scheduled Maintenance:
  * 2026-11-16 02:00:04 IST | Job: NIGHTLY_DB_SNAPSHOT | Account: svc_backup | Size: 1.42 GB | Status: SUCCESS
  * 2026-11-17 02:00:02 IST | Job: NIGHTLY_DB_SNAPSHOT | Account: svc_backup | Size: 1.43 GB | Status: SUCCESS
  * 2026-11-18 02:00:03 IST | Job: NIGHTLY_DB_SNAPSHOT | Account: svc_backup | Size: 1.43 GB | Status: SUCCESS`,
    fieldGuide: [
      {
        field: 'svc_backup',
        meaning: 'Dedicated non-human service account authorised solely for automated 02:00 IST backups.'
      },
      {
        field: '90-day baseline',
        meaning: 'Historical norm confirming r.deshmukh has no recorded bulk exports at 03:42 IST.'
      }
    ]
  },
  {
    id: 'EV-03',
    title: 'Web Edge Access Records (Nginx Reverse Proxy)',
    source: 'Edge-Proxy-01 (/var/log/nginx/access.log)',
    timestamp: '2026-11-18 02:14–03:42 IST',
    chapterUnlocked: 1,
    category: 'Network/Web',
    summary:
      'Shows automated 404 scanner probes at 02:14 IST and a separate authenticated session from 203.0.113.88 starting at 03:39:08 IST.',
    rawObservation: `2026-11-18T02:14:11+05:30 src=198.51.100.44 method=GET path="/.env" status=404 bytes=162 ua="Go-http-client/1.1"
2026-11-18T02:14:12+05:30 src=198.51.100.44 method=GET path="/wp-admin/setup-config.php" status=404 bytes=162 ua="Go-http-client/1.1"
2026-11-18T02:14:14+05:30 src=198.51.100.44 method=GET path="/phpmyadmin/" status=404 bytes=162 ua="Go-http-client/1.1"
---
2026-11-18T03:39:08+05:30 src=203.0.113.88 method=POST path="/api/v1/auth/login" status=200 bytes=418 ua="Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
2026-11-18T03:40:15+05:30 src=203.0.113.88 method=GET path="/api/v1/admin/customers/schema" status=200 bytes=2048 ua="Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
2026-11-18T03:42:09+05:30 src=203.0.113.88 method=POST path="/api/v1/admin/reports/export" status=200 bytes=50541200 ua="Mozilla/5.0 (Windows NT 10.0; Win64; x64)"`,
    fieldGuide: [
      {
        field: '+05:30',
        meaning: 'Timezone offset confirming all timestamps in this log are in Indian Standard Time (IST).'
      },
      {
        field: 'src=198.51.100.44',
        meaning: 'Scanner IP. Only generated 404 errors; disconnected 85 minutes before the export.'
      },
      {
        field: 'src=203.0.113.88',
        meaning: 'Different external IP that completed POST /login (HTTP 200) and requested the export.'
      }
    ]
  },
  {
    id: 'EV-04',
    title: 'Identity & Authentication Audit Log (IdP)',
    source: 'Asterion-IdP-01 (UTC timestamps normalised to IST)',
    timestamp: '2026-11-18 03:38:51–03:39:08 IST (2026-11-17 22:08:51–22:09:08 UTC)',
    chapterUnlocked: 2,
    category: 'Identity',
    summary:
      'Records password authentication for r.deshmukh from 203.0.113.88 with an MFA challenge bypass event.',
    rawObservation: `2026-11-17T22:08:51Z [03:38:51 IST] user=r.deshmukh event=AUTH_PASSWORD_FAIL src=203.0.113.88 reason=INVALID_PASSWORD
2026-11-17T22:09:07Z [03:39:07 IST] user=r.deshmukh event=AUTH_PASSWORD_OK src=203.0.113.88 session_id=sess_9941a
2026-11-17T22:09:08Z [03:39:08 IST] user=r.deshmukh event=MFA_CHALLENGE_BYPASSED src=203.0.113.88 reason=TRUSTED_DEVICE_COOKIE_REPLAY_OR_LEGACY_FALLBACK
Note: Normal corporate VPN subnet for Asterion employees is 192.0.2.0/24. IP 203.0.113.88 is outside corporate VPN.`,
    fieldGuide: [
      {
        field: '22:09:07Z',
        meaning: 'UTC timestamp ("Z" = Zulu/UTC). Adding +05:30 gives 03:39:07 IST on 18 Nov.'
      },
      {
        field: 'sess_9941a',
        meaning: 'Unique Session Identifier linking this login to subsequent actions.'
      },
      {
        field: 'TRUSTED_DEVICE_COOKIE_REPLAY_OR_LEGACY_FALLBACK',
        meaning: 'Log reason code indicating MFA was skipped via either a replayed trusted-device cookie or a legacy fallback path—the log alone does not distinguish which of the two occurred.'
      }
    ]
  },
  {
    id: 'EV-05',
    title: 'Application Export & Session Audit Record',
    source: 'Portal-Prod-01 Audit Service',
    timestamp: '2026-11-18 03:42:09 IST (2026-11-17 22:12:09 UTC)',
    chapterUnlocked: 2,
    category: 'Application',
    summary:
      'Links session sess_9941a directly to the export of 62,400 customer billing rows.',
    rawObservation: `audit_id: AUD-77412
timestamp_ist: 2026-11-18T03:42:09+05:30
session_id: sess_9941a
actor_account: r.deshmukh
actor_role: APP_ADMIN
action: DATA_EXPORT_CSV
dataset: client_billing_q3_full
row_count: 62400
bytes_transferred: 50541200 (~50.54 MB decimal / ~48.20 MiB binary)
fields_included: [customer_id, full_name, corporate_email, billing_address, gstin, invoice_total_inr]
authz_check: PASS (APP_ADMIN permits full CSV export)
client_ip: 203.0.113.88`,
    fieldGuide: [
      {
        field: 'authz_check: PASS',
        meaning: 'Authorisation succeeded because r.deshmukh holds the APP_ADMIN role—the software behaved as coded, even if the actor was unauthorised.'
      },
      {
        field: 'fields_included',
        meaning: 'Contains personal data (full_name, corporate_email, billing_address) alongside corporate billing details.'
      }
    ]
  },
  {
    id: 'EV-06',
    title: 'Change Calendar, Maintenance Tickets & Device Inventory',
    source: 'ITSM-ChangeBoard / AssetDB',
    timestamp: '2026-11-18 09:00 IST',
    chapterUnlocked: 2,
    category: 'Governance',
    summary:
      'Confirms zero approved overnight maintenance tickets for 03:42 IST and lists r.deshmukh’s registered laptop state.',
    rawObservation: `APPROVED CHANGE TICKETS (17–18 Nov 2026):
- CHG-401: Nightly DB backup at 02:00 IST (Automated, Owner: Arjun Mehta).
- No approved maintenance, data migration, or emergency export tickets between 02:30 and 08:00 IST.

ASSET INVENTORY FOR 'r.deshmukh' (Rohan Deshmukh, Senior Billing Ops):
- Primary Laptop: AST-LAP-019 (macOS, Endpoint Agent active; last heartbeat 17 Nov 18:45 IST, lid closed/asleep until 18 Nov 08:52 IST).
- Registered Home ISP ASN: AS9829 (Bengaluru Residential).
- Note on 203.0.113.88: Geolocates to a commercial cloud hosting VPS provider, not Rohan's residential ISP.`,
    fieldGuide: [
      {
        field: 'Endpoint Agent heartbeat',
        meaning: 'AST-LAP-019 was asleep at 03:42 IST—strong evidence that the export did not originate from Rohan’s corporate laptop.'
      },
      {
        field: 'Commercial cloud VPS',
        meaning: 'Virtual Private Server IP (203.0.113.88), unusual for a standard employee login.'
      }
    ]
  },
  {
    id: 'EV-07',
    title: 'Monitoring-Health Note & Telemetry Gap Advisory',
    source: 'Platform Engineering / SIEM Health',
    timestamp: '2026-11-18 09:15 IST',
    chapterUnlocked: 2,
    category: 'Telemetry',
    summary:
      'Crucial caveat: Legacy SSO token logs rotated out 7 days prior, and outbound firewall NetFlow had a maintenance pause.',
    rawObservation: `TELEMETRY HEALTH ADVISORY — INCIDENT SUPPORT
1. Legacy Trusted-Device Token Store: Detailed device-fingerprint logs for 'TRUSTED_DEVICE_COOKIE_REPLAY_OR_LEGACY_FALLBACK' were rotated out 7 days ago due to a misconfigured retention setting. We CANNOT prove whether a cookie was replayed or a legacy fallback path was triggered, nor when it originated.
2. Outbound Egress NetFlow: Egress packet capture on Portal-Prod-01 was paused during 03:00–04:00 IST for collector maintenance, though Edge-Proxy-01 confirms HTTP 200 with 50,541,200 bytes (~50.54 MB / ~48.20 MiB) served to 203.0.113.88.
3. Conclusion on Visibility: Logs confirm the file was served over HTTPS to 203.0.113.88, but we lack endpoint telemetry from 203.0.113.88 itself.`,
    fieldGuide: [
      {
        field: 'Telemetry Gap',
        meaning: 'Missing log visibility. Disciplined investigators explicitly document what they CANNOT prove rather than overstating certainty.'
      }
    ]
  },
  {
    id: 'EV-08',
    title: 'Account Owner Statement (Rohan Deshmukh)',
    source: 'HR / Incident Interview Record',
    timestamp: '2026-11-18 10:15 IST',
    chapterUnlocked: 3,
    category: 'Human Intel',
    summary:
      'Rohan states he was asleep at 03:42 IST, does not own VPS 203.0.113.88, and recalls entering his SSO password on a suspicious GST email link on 16 Nov.',
    rawObservation: `INTERVIEW SUMMARY — Rohan Deshmukh (r.deshmukh)
Conducted by: Mira Sen & Arjun Mehta | 18 Nov 2026, 10:15 IST

- Rohan stated he closed his work laptop at 18:45 IST on Tuesday (17 Nov) and was asleep at 03:42 IST on Wednesday.
- He stated he did not authorise anyone else to use his account and does not own a cloud VPS at 203.0.113.88.
- Upon questioning, Rohan recalled receiving a realistic-looking "GST Portal Compliance Update" email on Monday afternoon (16 Nov, ~15:30 IST) on his personal browser profile, where he entered his Asterion SSO password before closing the tab when it failed to load.
- Note: Because Rohan's personal browser history has not yet been forensically inspected, phishing capture is a well-supported investigative lead rather than a forensically verified artifact.`,
    fieldGuide: [
      {
        field: 'Corroborative Human Statement',
        meaning: 'Supports the credential-misuse hypothesis (H4), though browser/email headers have not yet been collected to prove the exact phishing site.'
      }
    ]
  },
  {
    id: 'EV-09',
    title: 'Asterion Internal Access & Incident Policy (POL-SEC-04)',
    source: 'Governance, Risk & Compliance (Nandita Rao)',
    timestamp: 'Effective: 2026-04-01 (Rev 2.3)',
    chapterUnlocked: 4,
    category: 'Policy & Legal',
    summary:
      'Defines least privilege, mandatory MFA without legacy bypass, and escalation authority before disabling production accounts.',
    rawObservation: `ASTERION SYSTEMS — INFORMATION SECURITY & INCIDENT POLICY (POL-SEC-04)
Section 3.2 (Access Control): Production admin accounts (APP_ADMIN) must enforce phishing-resistant MFA on every external session. Legacy trusted-device bypasses are prohibited.
Section 5.1 (Containment Authority): Junior analysts may isolate non-production hosts immediately, but suspending a shared or production business-operations admin account requires Incident Lead (Mira Sen) or Application Owner (Arjun Mehta) sign-off—unless active destructive deletion is observed—to prevent breaking automated billing pipelines.
Section 6.4 (Data Minimisation): Investigators must inspect only metadata and the minimum sample required to confirm data classification; bulk customer CSVs must not be copied onto analyst workstations.`,
    fieldGuide: [
      {
        field: 'Containment Authority',
        meaning: 'Explains why uncoordinated account lockouts can disrupt live business workflows if not coordinated with App Ops.'
      },
      {
        field: 'Data Minimisation',
        meaning: 'Handling sensitive evidence responsibly without creating secondary privacy leaks.'
      }
    ]
  }
];

const INITIAL_HYPOTHESES = [
  {
    id: 'H1',
    code: 'HYPOTHESIS H1',
    title: 'Automated scanning without successful compromise',
    description:
      'External internet scanners probed common paths (/wp-admin, /.env), generating noise, while no actual intrusion occurred.',
    postInvestigationNote:
      'Explains the 02:14 IST HTTP 404 logs (EV-03), but does not account for the 03:42 IST 50.54 MB (48.20 MiB) authenticated export.'
  },
  {
    id: 'H2',
    code: 'HYPOTHESIS H2',
    title: 'Legitimate application activity and monitoring errors',
    description:
      'The 03:42 IST export was a routine scheduled job or authorised overtime work misflagged due to timezone or rule misconfiguration.',
    postInvestigationNote:
      'Scheduled backups run at 02:00 IST under svc_backup (EV-02). Change calendar (EV-06) and Rohan’s interview (EV-08) weigh against legitimate activity.'
  },
  {
    id: 'H3',
    code: 'HYPOTHESIS H3',
    title: 'Unauthorised exploitation of an application vulnerability',
    description:
      'An attacker bypassed authentication altogether by exploiting a software flaw (such as SQL injection or broken access control) in Portal-Prod-01.',
    postInvestigationNote:
      'Partially relevant to the MFA fallback weakness (EV-04), though primary login succeeded via valid password authentication (AUTH_PASSWORD_OK) rather than an unauthenticated web exploit.'
  },
  {
    id: 'H4',
    code: 'HYPOTHESIS H4',
    title: 'Credential misuse contributing to unauthorised access',
    description:
      'Valid credentials for r.deshmukh (likely obtained via phishing) were used from an external VPS (203.0.113.88), leveraging an MFA bypass/fallback to export customer billing data.',
    postInvestigationNote:
      'Best supported by converging evidence across EV-03, EV-04, EV-05, EV-06, and EV-08, while acknowledging telemetry gaps (EV-07).'
  }
];

const LEGAL_CARDS = [
  {
    id: 'LEG-01',
    jurisdiction: 'India (Primary Jurisdiction)',
    provision:
      'Information Technology Act, 2000 — Section 43 & Section 66 (Unauthorised Access & Data Extraction) and Section 70B (CERT-In)',
    officialSource:
      'India Code (indiacode.nic.in) — The Information Technology Act, 2000 (Act No. 21 of 2000)',
    status:
      'In force (Enacted 9 June 2000; commenced 17 October 2000; amended via IT (Amendment) Act, 2008).',
    lastVerified: '2026-11-18 (Educational Reference)',
    applicabilityCaveat:
      'Applies to computer systems in India. Unauthorised access and extraction of data from a computer system without owner permission attracts civil liability (Sec 43) and criminal offences where dishonest/fraudulent intent is established (Sec 66).',
    summary:
      'Establishes the foundational legal framework in India prohibiting unauthorised access, downloading/copying of data without permission, and empowering CERT-In as the national incident response agency.'
  },
  {
    id: 'LEG-02',
    jurisdiction: 'India (Primary Jurisdiction)',
    provision:
      'CERT-In Directions under Section 70B(6) of the IT Act, 2000 (Direction No. 20(3)/2022-CERT-In)',
    officialSource:
      'Indian Computer Emergency Response Team (cert-in.org.in) — Cyber Security Directions dated 28 April 2022',
    status:
      'In force (Effective 27 June 2022; MSME extension took effect 25 September 2022).',
    lastVerified: '2026-11-18 (Educational Reference)',
    applicabilityCaveat:
      'Mandatory reporting within 6 hours of noticing or being brought to notice applies specifically to covered cyber incidents listed in Annexure-I (such as targeted scanning/probing of critical networks, compromise of critical systems/information, unauthorised access of IT systems/data, and data breaches/leaks). Organisations must also synchronise ICT system clocks (e.g., via NTP to NPL/NIC) and retain ICT logs securely for a rolling 180-day period within Indian jurisdiction.',
    summary:
      'Directly relevant to Asterion Systems: explains why accurate IST (UTC+05:30) clock synchronisation, 180-day log retention (where Asterion had a gap on its legacy token store in EV-07), and timely incident assessment matter.'
  },
  {
    id: 'LEG-03',
    jurisdiction: 'India (Primary Jurisdiction)',
    provision:
      'Digital Personal Data Protection Act, 2023 (DPDP Act, 2023) — Sections 8(5) & 8(6) (Security Safeguards & Personal Data Breach Intimation)',
    officialSource:
      'The Gazette of India (egazette.gov.in) & India Code — Act No. 22 of 2023 (Assented 11 August 2023)',
    status:
      'Enacted (11 August 2023). Phased commencement subject to Central Government notifications in the Official Gazette under Section 1(2) and operationalisation of Rules / Data Protection Board.',
    lastVerified:
      '2026-11-18 (Educational Reference — verify latest Gazette commencement notifications for specific operational timelines)',
    applicabilityCaveat:
      'Applies to processing of digital personal data within India (and certain processing outside India offering goods/services in India). Because exact operational intimation format and timelines depend on notified Rules under Section 8(6), practitioners must verify current Gazette notifications with legal counsel rather than guessing statutory deadlines.',
    summary:
      'Requires Data Fiduciaries to implement reasonable security safeguards to prevent personal data breaches and, once fully operationalised via notified Rules, intimate the Data Protection Board of India and affected Data Principals.'
  },
  {
    id: 'LEG-04',
    jurisdiction: 'European Union — Comparative Reference Only (Not Primary Indian Law)',
    provision:
      'EU General Data Protection Regulation (GDPR) — Article 33 (Notification of a personal data breach to the supervisory authority)',
    officialSource: 'EUR-Lex (eur-lex.europa.eu) — Regulation (EU) 2016/679',
    status: 'In force in the EU/EEA (Applicable since 25 May 2018).',
    lastVerified: '2026-11-18 (Comparative Educational Reference)',
    applicabilityCaveat:
      'COMPARATIVE EXAMPLE ONLY: Does not govern purely domestic Indian operations unless extraterritorial scope under GDPR Article 3 applies (e.g., offering goods/services to or monitoring behaviour of individuals in the EU). Contrast GDPR Art. 33’s "without undue delay and, where feasible, not later than 72 hours" rule with CERT-In’s 6-hour incident reporting direction in India.',
    summary:
      'Included solely to illustrate how different jurisdictions structure breach notification thresholds and timelines, helping beginners avoid confusing EU rules with Indian statutory duties.'
  }
];

const TRIAGE_DATASET = [
  {
    id: 'LOG-101',
    timestamp_ist: '2026-11-18 02:00:03',
    src_ip: '10.24.1.15',
    account: 'svc_backup',
    endpoint: '/internal/db/snapshot',
    method: 'POST',
    status_code: 200,
    bytes_out: 1430000000,
    hour_ist: 2,
    telemetry_complete: true,
    groundTruth: 'BENIGN_SCHEDULED',
    explanation:
      'Test Case 2 (Benign Scheduled Backup): Automated internal service account (svc_backup) running its approved 02:00 IST backup job. High byte volume (1.43 GB) is normal for this service account and endpoint.'
  },
  {
    id: 'LOG-102',
    timestamp_ist: '2026-11-18 02:14:11',
    src_ip: '198.51.100.44',
    account: 'anonymous',
    endpoint: '/.env',
    method: 'GET',
    status_code: 404,
    bytes_out: 162,
    hour_ist: 2,
    telemetry_complete: true,
    groundTruth: 'SCANNER_404',
    explanation:
      'Test Case 3 (Scanner Request Returning 404): External scanner probing a non-existent path. Because status_code is 404 and bytes_out is 162 bytes, no data was exposed—must NOT be labelled a successful compromise.'
  },
  {
    id: 'LOG-103',
    timestamp_ist: '2026-11-18 03:42:09',
    src_ip: '203.0.113.88',
    account: 'r.deshmukh',
    endpoint: '/api/v1/admin/reports/export',
    method: 'POST',
    status_code: 200,
    bytes_out: 50541200,
    hour_ist: 3,
    telemetry_complete: true,
    groundTruth: 'SUSPICIOUS_EXPORT',
    explanation:
      'Test Case 1 (Suspicious Export): Human admin account (r.deshmukh) exporting 50,541,200 bytes (~50.54 MB / ~48.20 MiB) of billing data at 03:42 IST (status 200) from an external VPS IP. Should be flagged for investigation.'
  },
  {
    id: 'LOG-104',
    timestamp_ist: '2026-11-18 03:55:18',
    src_ip: '203.0.113.91',
    account: 'unknown_truncated',
    endpoint: '/api/v1/admin/reports/export',
    method: 'POST',
    status_code: 0,
    bytes_out: -1,
    hour_ist: 3,
    telemetry_complete: false,
    groundTruth: 'INCOMPLETE_RECORD',
    explanation:
      'Test Case 4 (Incomplete Record): Collector drop left status_code=0, bytes_out=-1, and account truncated. Must remain INSUFFICIENT_EVIDENCE rather than being forced into malicious or benign.'
  },
  {
    id: 'LOG-105',
    timestamp_ist: '2026-11-18 11:20:44',
    src_ip: '192.0.2.42',
    account: 'r.deshmukh',
    endpoint: '/api/v1/admin/reports/export',
    method: 'POST',
    status_code: 200,
    bytes_out: 840000,
    hour_ist: 11,
    telemetry_complete: true,
    groundTruth: 'BENIGN_DAYTIME',
    explanation:
      'Normal Daytime Admin Work: r.deshmukh on corporate VPN (192.0.2.42) at 11:20 IST exporting a small 840 KB report—matches the 90-day baseline.'
  },
  {
    id: 'LOG-106',
    timestamp_ist: '2026-11-18 02:14:14',
    src_ip: '198.51.100.44',
    account: 'anonymous',
    endpoint: '/phpmyadmin/',
    method: 'GET',
    status_code: 404,
    bytes_out: 162,
    hour_ist: 2,
    telemetry_complete: true,
    groundTruth: 'SCANNER_404',
    explanation:
      'Scanner Noise (404): Automated probe against a PHP admin path that does not exist on Asterion’s stack.'
  }
];

const CHAPTERS = [
  {
    number: 1,
    slug: 'chapter-1',
    title: 'Chapter I: The Anomaly',
    theme: 'Learning to Notice',
    subtitle: 'Separating routine noise from an unexplained deviation at Asterion Systems.',
    narrative: [
      {
        speaker: 'NARRATOR',
        role: 'Scene — Wednesday, 08:45 IST | Asterion Systems SOC, Bengaluru',
        text: 'Rain taps softly against the glass partition of Asterion Systems’ small Security Operations room. Asterion builds cloud invoicing software for mid-sized Indian businesses. Today is your first week as a Trainee Investigator.'
      },
      {
        speaker: 'MIRA SEN',
        role: 'Senior Incident Responder & Mentor',
        text: 'Morning. Before you touch any dashboard, take a breath. Kabir left a handover note from the night shift—he’s convinced we were breached because he saw scanner hits and a 3:42 AM data export. Let’s slow down and look at what the records actually show, without jumping to conclusions.'
      },
      {
        speaker: 'KABIR DUTTA',
        role: 'Junior SOC Analyst',
        text: 'Look at EV-01 and EV-03! Someone from 198.51.100.44 scanned /.env and /wp-admin at 2:14 AM, and then r.deshmukh exported 62,400 billing records at 3:42 AM! Shouldn’t we lock Rohan’s account right now?'
      },
      {
        speaker: 'ARJUN MEHTA',
        role: 'Application Operations Lead',
        text: 'Hold on—before locking out my senior billing admin, remember our nightly database backup runs at 02:00 IST every night. Make sure you aren’t confusing automated operations with an attacker.'
      },
      {
        speaker: 'TRACE',
        role: 'Deterministic Investigation Co-Pilot',
        text: '[LEAD SUMMARY] Three events logged overnight: (1) 02:00 IST backup job by svc_backup; (2) 02:14 IST HTTP 404 probes from 198.51.100.44; (3) 03:42 IST export of 50,541,200 bytes (~50.54 MB / ~48.20 MiB) by r.deshmukh from 203.0.113.88. Note: Source IPs for (2) and (3) do not match.'
      }
    ],
    conceptModule: {
      title: 'Baselines & False Positives',
      understand:
        'A baseline is what normal system behaviour looks like over time. A false positive is an unusual-looking alert that turns out to be harmless (like a scheduled backup or a blocked 404 scan).',
      seeIt:
        'In EV-02, r.deshmukh normally exports small files (< 1.5 MB) between 11:00 and 17:30 IST, while svc_backup runs a 1.43 GB backup every night at 02:00 IST.',
      inspectPrompt:
        'Inspect EV-01, EV-02, and EV-03 in the Evidence Locker on the right. Notice the difference between the 02:00 backup, the 02:14 404 scans, and the 03:42 export.',
      applyQuestion:
        'Kabir thinks the 02:14 IST scanner requests to /.env and /wp-admin (EV-03) prove the attacker broke into the server. Based on the raw log fields, why is that incorrect?',
      applyOptions: [
        {
          id: 'c1-a',
          text: 'Because all three requests returned HTTP status=404 (Not Found) and came from a different IP (198.51.100.44) than the 03:42 export.',
          correct: true,
          feedback:
            'Exact! HTTP 404 means the server did not have those files and served nothing (162 bytes). Separating automated internet background noise from real anomalies is step one.'
        },
        {
          id: 'c1-b',
          text: 'Because automated scanners only run during daytime business hours.',
          correct: false,
          feedback:
            'Automated scanners run 24/7 across the internet. The key clue in EV-03 is the HTTP 404 status code showing the requests failed to find anything.'
        },
        {
          id: 'c1-c',
          text: 'Because the 02:00 IST nightly backup automatically blocks all web traffic.',
          correct: false,
          feedback:
            'Not quite—check EV-03 again. The web proxy still answered the scanner, returning status=404 (Not Found).'
        }
      ],
      transferPrompt:
        'Transfer Check: If you see a 1.43 GB transfer at 02:00:03 IST under account svc_backup (EV-02), how should you classify it?',
      transferOptions: [
        {
          id: 't1-a',
          text: 'Expected baseline activity (scheduled nightly backup) — verify against Change Ticket CHG-401 rather than treating it as data theft.',
          correct: true
        },
        {
          id: 't1-b',
          text: 'Immediate ransomware exfiltration because 1.43 GB is larger than 50.54 MB.',
          correct: false
        }
      ]
    },
    evidenceUnlocked: ['EV-01', 'EV-02', 'EV-03'],
    nextActionPrompt:
      'Complete both Understanding Checks above to unlock Chapter II, and log your initial observations on the Evidence Board.'
  },
  {
    number: 2,
    slug: 'chapter-2',
    title: 'Chapter II: The Reconstruction',
    theme: 'Learning to Connect',
    subtitle: 'Correlating authentication, session IDs, UTC/IST timestamps, and telemetry gaps.',
    narrative: [
      {
        speaker: 'MIRA SEN',
        role: 'Senior Incident Responder & Mentor',
        text: 'Good work filtering out the 02:00 backup and the 02:14 404 scanner noise. Now focus on the 03:42 IST export. An unusual time or an unfamiliar IP address is an indicator—not proof on its own. How do we connect the export back to how that session started?'
      },
      {
        speaker: 'TRACE',
        role: 'Deterministic Investigation Co-Pilot',
        text: '[CORRELATION ENGINE] Matched session_id=sess_9941a across Portal-Prod-01 (EV-05) and Asterion-IdP-01 (EV-04). Warning: IdP logs are stored in UTC (22:09:07Z), whereas Portal logs use IST (+05:30). Normalised delta between login and export: 3 minutes 2 seconds.'
      },
      {
        speaker: 'ARJUN MEHTA',
        role: 'Application Operations Lead',
        text: 'Wait a second—look at EV-04. Why does it say MFA_CHALLENGE_BYPASSED? I thought we enforced multi-factor authentication for all APP_ADMIN users!'
      },
      {
        speaker: 'MIRA SEN',
        role: 'Senior Incident Responder & Mentor',
        text: 'Also read EV-07 carefully. Our legacy trusted-device token logs rotated out 7 days ago, so the log reason code alone cannot distinguish whether a cookie was replayed or a legacy fallback fired. Never pretend we have visibility where the logs are missing.'
      }
    ],
    conceptModule: {
      title: 'Authentication vs. Authorisation & Timezone Normalisation',
      understand:
        'Authentication verifies identity (login); Authorisation checks permissions (role rights). Meanwhile, correlating logs across servers requires converting timestamps (e.g., UTC to IST = UTC+05:30) and linking shared identifiers like session_id.',
      seeIt:
        'In EV-04, 22:09:07Z converts to 03:39:07 IST—just 3 minutes 2 seconds before 03:42:09 IST in EV-05, linked by session_id=sess_9941a. Once authenticated as r.deshmukh, authz_check passed because APP_ADMIN is permitted to export CSVs.',
      inspectPrompt:
        'Inspect EV-04, EV-05, EV-06, and EV-07. Check Rohan’s corporate laptop state (EV-06) and the telemetry gap advisory (EV-07).',
      applyQuestion:
        'Why did Portal-Prod-01 allow the export (authz_check: PASS in EV-05) even though the request came from a cloud VPS IP (203.0.113.88)?',
      applyOptions: [
        {
          id: 'c2-a',
          text: 'Because the session had already authenticated as r.deshmukh (AUTH_PASSWORD_OK + MFA bypass/fallback), and the APP_ADMIN role is authorised to run CSV exports.',
          correct: true,
          feedback:
            'Spot on! Authorisation checks what the account role is allowed to do. Because authentication succeeded with a valid password and bypassed MFA, the app treated the session as Rohan.'
        },
        {
          id: 'c2-b',
          text: 'Because HTTP POST requests automatically bypass all authorisation checks in web applications.',
          correct: false,
          feedback:
            'HTTP POST is just a request method. Look at EV-05: authz_check: PASS occurred because actor_role was APP_ADMIN.'
        },
        {
          id: 'c2-c',
          text: 'Because Rohan’s corporate laptop AST-LAP-019 was actively connected to the office VPN at 03:42 IST.',
          correct: false,
          feedback:
            'Check EV-06! AST-LAP-019 was asleep from 18:45 IST until 08:52 IST.'
        }
      ],
      transferPrompt:
        'Transfer Check: An Identity Provider logs an event at 2026-11-17T22:09:07Z (UTC). What is the exact IST (UTC+05:30) timestamp?',
      transferOptions: [
        {
          id: 't2-a',
          text: '2026-11-18 03:39:07 IST (adding 5 hours 30 minutes crosses midnight into 18 November).',
          correct: true
        },
        {
          id: 't2-b',
          text: '2026-11-17 16:39:07 IST (subtracting 5 hours 30 minutes).',
          correct: false
        }
      ]
    },
    evidenceUnlocked: ['EV-04', 'EV-05', 'EV-06', 'EV-07'],
    nextActionPrompt:
      'Complete both Understanding Checks above to unlock Chapter III, and evaluate H1–H4 on the Evidence Board.'
  },
  {
    number: 3,
    slug: 'chapter-3',
    title: 'Chapter III: The Decision',
    theme: 'Learning to Act Responsibly',
    subtitle: 'Auditing TRACE’s overconfident recommendation and choosing a proportionate response.',
    narrative: [
      {
        speaker: 'MIRA SEN',
        role: 'Senior Incident Responder & Mentor',
        text: 'We interviewed Rohan Deshmukh (EV-08). He states he was asleep at 03:42 IST and recalls entering his SSO password on a lookalike "GST Portal Compliance Update" page on Monday—a strong lead for credential phishing, though we still need to preserve his browser artefacts to confirm it forensically. Now we must decide how to act.'
      },
      {
        speaker: 'TRACE',
        role: 'Deterministic Investigation Co-Pilot',
        text: '[ACTION RECOMMENDATION — CONFIDENCE 98%] Evidence confirms total network compromise from 203.0.113.88 and 198.51.100.44. Recommended immediate action: (1) Silently disable r.deshmukh without notifying App Ops; (2) Block entire 203.0.113.0/24 range; (3) Wipe AST-LAP-019 immediately.'
      },
      {
        speaker: 'MIRA SEN',
        role: 'Senior Incident Responder & Mentor',
        text: 'Pause right there. Read TRACE’s recommendation critically. Where did TRACE overreach or make a factual mistake? And remember POL-SEC-04 (EV-09) before you pick a response path.'
      }
    ],
    conceptModule: {
      title: 'Auditing Automated Suggestions & Proportionate Containment',
      understand:
        'Automated tools (including AI co-pilots) can conflate unrelated evidence, overstate confidence, or ignore operational impact. Containment must be proportionate, authorised, and preserve forensic evidence.',
      seeIt:
        'TRACE falsely claimed "total network compromise" including 198.51.100.44 (which only got 404s) and suggested wiping AST-LAP-019 (which was asleep and wasn’t used in the export, destroying potential phishing browser history).',
      inspectPrompt:
        'Review EV-08 (Rohan’s statement) and EV-09 (Policy POL-SEC-04), then audit TRACE’s errors and choose a response branch below.',
      applyQuestion:
        'Which flaw in TRACE’s recommendation would cause both an operational disruption and loss of forensic evidence?',
      applyOptions: [
        {
          id: 'c3-a',
          text: 'Disabling r.deshmukh without coordinating with App Ops (violating POL-SEC-04 Sec 5.1) AND wiping AST-LAP-019 before preserving potential phishing evidence.',
          correct: true,
          feedback:
            'Spot on! Always verify automated recommendations against raw evidence and internal containment policy.'
        },
        {
          id: 'c3-b',
          text: 'Checking the timestamp of the export in IST.',
          correct: false,
          feedback:
            'Checking timestamps in IST is good practice. Look closely at TRACE’s three proposed actions—wiping the laptop and uncoordinated account disablement are the hazards.'
        }
      ],
      transferPrompt:
        'Transfer Check: Why should an investigator preserve a user’s device state rather than wiping it immediately after a suspected credential-phishing incident?',
      transferOptions: [
        {
          id: 't3-a',
          text: 'Because browser history, email headers, and endpoint telemetry help verify how credentials were obtained and whether any local compromise occurred.',
          correct: true
        },
        {
          id: 't3-b',
          text: 'Because wiping a laptop automatically deletes cloud server logs too.',
          correct: false
        }
      ]
    },
    decision: {
      id: 'DEC-CH3-CONTAINMENT',
      prompt: 'How do you advise Mira and Arjun to respond right now? (All branches are recoverable and replayable.)',
      options: [
        {
          id: 'opt-uncoordinated',
          label: 'Option A: Uncoordinated Immediate Lockout',
          summary:
            'Immediately disable r.deshmukh and trigger an unannounced emergency password reset across all billing services without informing Arjun.',
          immediateConsequence:
            'The account is locked within 60 seconds, halting any further sessions—but an automated morning billing reconciliation job tied to Rohan’s admin token fails mid-run, causing a 45-minute delay for finance ops.',
          laterConsequence:
            'Arjun flags the policy breach (POL-SEC-04 Sec 5.1) in Chapter IV. Mira helps you document the operational lesson and pivot to coordinated session revocation and MFA hardening.',
          learningNote:
            'Containment speed matters, but uncoordinated actions on shared operational accounts create avoidable collateral damage. Recoverable lesson applied!'
        },
        {
          id: 'opt-coordinated',
          label: 'Option B: Authorised, Proportionate & Coordinated Response (Recommended)',
          summary:
            'With Mira and Arjun’s sign-off (per POL-SEC-04), revoke active session sess_9941a, rotate r.deshmukh’s credentials, disable legacy MFA fallback globally, and preserve AST-LAP-019 for triage.',
          immediateConsequence:
            'Active session sess_9941a is terminated immediately, credential rotation completes cleanly with Arjun transitioning scheduled billing tasks, and forensic artefacts on Rohan’s laptop remain intact.',
          laterConsequence:
            'Nandita (GRC) commends the clean chain of custody and adherence to POL-SEC-04 during Chapter IV’s accountability review.',
          learningNote:
            'Proportionate containment neutralises active risk while preserving evidence and maintaining operational continuity.'
        },
        {
          id: 'opt-delayed',
          label: 'Option C: Delay Action Until 100% Certainty',
          summary:
            'Take no containment action at all until the missing legacy MFA token logs (EV-07) are somehow recovered.',
          immediateConsequence:
            'Session sess_9941a remains valid for another 90 minutes. When Mira checks EV-07 with you, you verify those rotated logs cannot be recovered.',
          laterConsequence:
            'Mira steps in to guide an immediate session revocation before any second export occurs, reminding you in Chapter IV that incident responders must act on strong preponderance of evidence despite imperfect telemetry.',
          learningNote:
            'Waiting for impossible 100% certainty leaves active sessions exposed. Recoverable lesson applied!'
        }
      ]
    },
    evidenceUnlocked: ['EV-08', 'EV-09'],
    nextActionPrompt:
      'Complete the Understanding Checks AND choose a Containment Decision Branch above to unlock Chapter IV.'
  },
  {
    number: 4,
    slug: 'chapter-4',
    title: 'Chapter IV: The Responsibility',
    theme: 'Learning Professional Boundaries',
    subtitle: 'Policy vs. law, Indian statutory context (IT Act, CERT-In, DPDP Act), and privacy handling.',
    narrative: [
      {
        speaker: 'NANDITA RAO',
        role: 'Governance, Risk & Compliance (GRC) Lead',
        text: 'Welcome to the GRC briefing room. Technical containment is only half of incident response. Because client_billing_q3_full.csv contained 62,400 rows including names, emails, and billing addresses, we must distinguish internal company policy from statutory obligations in India.'
      },
      {
        speaker: 'MIRA SEN',
        role: 'Senior Incident Responder & Mentor',
        text: 'Notice also what we discovered in EV-07: our legacy trusted-device token logs were rotated out after 7 days. Compare that against CERT-In’s 180-day log retention requirement in the Legal Learning Room.'
      },
      {
        speaker: 'NANDITA RAO',
        role: 'Governance, Risk & Compliance (GRC) Lead',
        text: 'Remember: our legal reference cards here are educational guides grounded in official Indian sources—not formal legal advice. Never invent statutory deadlines, and always verify current Gazette commencement notifications with legal counsel.'
      }
    ],
    conceptModule: {
      title: 'Policy vs. Law, Data Minimisation & Indian Cyber Governance',
      understand:
        'Internal policies (like POL-SEC-04) are an organisation’s own rules. Voluntary standards (like ISO 27001) are best-practice frameworks. Laws and statutory directions (like India’s IT Act, 2000, CERT-In Directions, and the DPDP Act, 2023) carry legal obligations.',
      seeIt:
        'In EV-05, the exported CSV included personal data (full_name, corporate_email, billing_address). Under POL-SEC-04 Sec 6.4, investigators verify schema metadata without copying 62,400 customer records onto personal laptops.',
      inspectPrompt:
        'Explore the 4 Legal & Governance Cards in the Policy & Legal Room tab and compare India’s CERT-In Directions with the EU GDPR comparative example.',
      applyQuestion:
        'Why is EU GDPR Article 33 included in Asterion Systems’ Legal Learning Room alongside Indian statutes?',
      applyOptions: [
        {
          id: 'c4-a',
          text: 'Solely as a clearly labelled comparative example—to show how EU rules (e.g., 72-hour supervisory authority timeline) differ from Indian statutory frameworks (such as CERT-In’s 6-hour incident reporting direction).',
          correct: true,
          feedback:
            'Correct! Keeping primary Indian legal context distinct from comparative EU examples prevents costly compliance confusion.'
        },
        {
          id: 'c4-b',
          text: 'Because every company operating purely in Bengaluru is automatically governed by EU GDPR instead of Indian law.',
          correct: false,
          feedback:
            'Incorrect—Indian operations are governed by Indian law (IT Act, 2000, CERT-In Directions, DPDP Act, 2023), while GDPR only applies if EU extraterritorial criteria are met.'
        }
      ],
      transferPrompt:
        'Transfer Check: You need to confirm whether the exported CSV contained customer email addresses. What is the privacy-preserving way to verify this?',
      transferOptions: [
        {
          id: 't4-a',
          text: 'Inspect the audit schema metadata (EV-05: fields_included) or a minimal masked sample in a restricted evidence vault rather than downloading all 62,400 rows locally.',
          correct: true
        },
        {
          id: 't4-b',
          text: 'Email the entire 50.54 MB CSV file to the whole team chat so everyone can check.',
          correct: false
        }
      ]
    },
    evidenceUnlocked: ['EV-09'],
    nextActionPrompt:
      'Complete both Governance Understanding Checks above to unlock Chapter V.'
  },
  {
    number: 5,
    slug: 'chapter-5',
    title: 'Chapter V: The Resolution',
    theme: 'Learning Independently',
    subtitle: 'Complete the Web Evidence Triage Field Lab and present your final findings.',
    narrative: [
      {
        speaker: 'MIRA SEN',
        role: 'Senior Incident Responder & Mentor',
        text: 'You’ve reached the final stage of Case 001. Before we close the case file, Arjun wants help automating triage so future suspicious exports are caught immediately without drowning analysts in 404 scanner noise or 02:00 AM backups.'
      },
      {
        speaker: 'ARJUN MEHTA',
        role: 'Application Operations Lead',
        text: 'I’ve unlocked the Web Evidence Triage Field Lab for you. Build a visual detection rule and test it against four critical cases: the suspicious export, the benign backup, the 404 scanner probe, and an incomplete log record.'
      },
      {
        speaker: 'NANDITA RAO',
        role: 'Governance, Risk & Compliance (GRC) Lead',
        text: 'Once your triage rule passes all four cases, assemble your Final Investigation Report. Be transparent about what the evidence supports, what remains uncertain, and what follow-up actions Asterion Systems should take.'
      }
    ],
    conceptModule: {
      title: 'Encoding Investigative Reasoning into Triage Logic',
      understand:
        'Good detection rules combine multiple conditions (e.g., sensitive endpoint + successful HTTP 200 status + large byte size + off-hours window) while explicitly isolating incomplete telemetry rather than guessing.',
      seeIt:
        'In the Web Evidence Triage Field Lab, you will test conditions across 6 web/application records covering all 4 mandatory edge cases.',
      inspectPrompt:
        'Open the Field Lab tab to build and verify your triage rule, then complete the Final Report tab to close Case 001.',
      applyQuestion:
        'How should a well-designed triage system handle LOG-104, where telemetry_complete is false (status_code=0, bytes_out=-1)?',
      applyOptions: [
        {
          id: 'c5-a',
          text: 'Route it to an "Insufficient Evidence / Incomplete Telemetry" queue for collector inspection rather than forcing a malicious or benign label.',
          correct: true,
          feedback:
            'Exactly right! Refusing to guess when telemetry is broken is a hallmark of disciplined security engineering.'
        },
        {
          id: 'c5-b',
          text: 'Automatically classify all incomplete records as harmless benign traffic.',
          correct: false,
          feedback:
            'Hiding blind spots as "benign" can mask real attacks during collector outages.'
        }
      ],
      transferPrompt:
        'Transfer Check: Why is a Python version of this triage lab deferred to a future phase with strict sandboxing?',
      transferOptions: [
        {
          id: 't5-a',
          text: 'To avoid running arbitrary unverified code in the browser without verified worker/network/host isolation, while teaching the exact same deterministic logic safely via the Visual Rule Builder.',
          correct: true
        },
        {
          id: 't5-b',
          text: 'Because Python cannot read JSON or CSV log records.',
          correct: false
        }
      ]
    },
    evidenceUnlocked: [],
    nextActionPrompt:
      'Complete the Web Evidence Triage Field Lab (all 4 test cases passing) and submit your validated Final Investigation Report.'
  }
];

// ============================================================================
// DOMAIN MODULE 2: 5-LEVEL LAYERED ASSISTANCE ENGINE (MIRA & TRACE)
// Level 1: Gentle hint
// Level 2: Concept explanation
// Level 3: Evidence-specific guidance
// Level 4: Worked example
// Level 5: Independent retry prompt
// ============================================================================

const LAYERED_MIRA_GUIDANCE = {
  1: [
    {
      level: 1,
      label: 'Level 1: Gentle Hint',
      text: 'Mira Sen: Compare the timestamps and HTTP status codes of the three overnight events before deciding if they are connected.'
    },
    {
      level: 2,
      label: 'Level 2: Concept Explanation',
      text: 'Mira Sen: A baseline defines normal activity (like scheduled backups). A false positive is an alert or probe that fails or is harmless—such as an HTTP 404 response where no file existed.'
    },
    {
      level: 3,
      label: 'Level 3: Evidence-Specific Guidance',
      text: 'Mira Sen: Look at EV-02 (svc_backup runs every night at 02:00 IST) and EV-03 (198.51.100.44 got status=404 at 02:14 IST, whereas 203.0.113.88 got status=200 on /export at 03:42 IST).'
    },
    {
      level: 4,      label: 'Level 4: Worked Example',
      text: 'Mira Sen (Worked Example): Observation: 198.51.100.44 requested /.env at 02:14:11 IST -> status=404, bytes=162. Interpretation: Automated scan failed to find the file; unrelated to the 03:42 export from 203.0.113.88.'
    },
    {
      level: 5,
      label: 'Level 5: Independent Retry',
      text: 'Mira Sen: Now try applying that same observation-vs-interpretation split to EV-01 and EV-02 on your own, and record your note on the Evidence Board.'
    }
  ],
  2: [
    {
      level: 1,
      label: 'Level 1: Gentle Hint',
      text: 'Mira Sen: Check the timezone suffix on EV-04 ("Z") versus EV-05 ("+05:30"), and look for a shared session identifier.'
    },
    {
      level: 2,
      label: 'Level 2: Concept Explanation',
      text: 'Mira Sen: Authentication checks identity at login; Authorisation checks role permissions afterward. To correlate logs across servers, convert UTC to IST (+05:30) and match session_id.'
    },
    {
      level: 3,
      label: 'Level 3: Evidence-Specific Guidance',
      text: 'Mira Sen: In EV-04, 22:09:07Z equals 03:39:07 IST and creates session_id=sess_9941a. In EV-05, sess_9941a exports 62,400 rows at 03:42:09 IST. Also check EV-06 (laptop asleep) and EV-07 (missing token logs).'
    },
    {
      level: 4,
      label: 'Level 4: Worked Example',
      text: 'Mira Sen (Worked Example): 2026-11-17T22:09:07Z + 5h30m = 2026-11-18 03:39:07 IST. Because sess_9941a appears in both EV-04 and EV-05, both records belong to the same authenticated session.'
    },
    {
      level: 5,
      label: 'Level 5: Independent Retry',
      text: 'Mira Sen: Now link EV-04, EV-05, EV-06, and EV-07 under the four hypotheses on the Evidence Board—and note what EV-07 prevents us from proving.'
    }
  ],
  3: [
    {
      level: 1,
      label: 'Level 1: Gentle Hint',
      text: 'Mira Sen: Compare every part of TRACE’s 98%-confidence recommendation against EV-03, EV-06, and Policy POL-SEC-04 (EV-09).'
    },
    {
      level: 2,
      label: 'Level 2: Concept Explanation',
      text: 'Mira Sen: Proportionate containment stops active risk while following internal authority rules and preserving forensic evidence on endpoints.'
    },
    {
      level: 3,
      label: 'Level 3: Evidence-Specific Guidance',
      text: 'Mira Sen: EV-09 Sec 5.1 requires Incident Lead or App Owner sign-off before suspending a production billing admin account. Also, wiping AST-LAP-019 (EV-06) would destroy potential phishing history.'
    },
    {
      level: 4,
      label: 'Level 4: Worked Example',
      text: 'Mira Sen (Worked Example): Audit of TRACE Claim #1: TRACE blamed 198.51.100.44 for compromise, but EV-03 shows only HTTP 404 responses from that IP. Therefore, blocking/treating it as active compromise is unsupported.'
    },
    {
      level: 5,
      label: 'Level 5: Independent Retry',
      text: 'Mira Sen: Now evaluate TRACE’s remaining two actions against EV-06 and EV-09, and choose your containment branch.'
    }
  ],
  4: [
    {
      level: 1,
      label: 'Level 1: Gentle Hint',
      text: 'Mira Sen: Look at the jurisdiction header and applicability caveat on each card in the Policy & Legal Room.'
    },
    {
      level: 2,
      label: 'Level 2: Concept Explanation',
      text: 'Mira Sen: Internal policies govern employees; Indian statutes (IT Act, CERT-In Directions, DPDP Act) set legal duties in India; EU GDPR is shown solely for comparison.'
    },
    {
      level: 3,
      label: 'Level 3: Evidence-Specific Guidance',
      text: 'Mira Sen: Compare EV-07 (legacy token logs rotated after 7 days) with LEG-02 (CERT-In’s 180-day log retention direction), and check EV-05 fields_included under POL-SEC-04 Sec 6.4.'
    },
    {
      level: 4,
      label: 'Level 4: Worked Example',
      text: 'Mira Sen (Worked Example): To verify personal data exposure without violating data minimisation, cite EV-05’s schema list [full_name, corporate_email, billing_address] rather than copying the 62,400-row CSV.'
    },
    {
      level: 5,
      label: 'Level 5: Independent Retry',
      text: 'Mira Sen: Now complete the Governance Understanding Checks and review all four legal cards before advancing to Chapter V.'
    }
  ],
  5: [
    {
      level: 1,
      label: 'Level 1: Gentle Hint',
      text: 'Mira Sen: Check what distinguishes LOG-103 (suspicious export) from LOG-101 (02:00 backup), LOG-102 (404 scanner), and LOG-104 (incomplete telemetry).'
    },
    {
      level: 2,
      label: 'Level 2: Concept Explanation',
      text: 'Mira Sen: Multi-condition triage rules combine endpoint, HTTP status, byte size, and time-of-day—while keeping incomplete records in a separate INSUFFICIENT_EVIDENCE queue.'
    },
    {
      level: 3,
      label: 'Level 3: Evidence-Specific Guidance',
      text: 'Mira Sen: In the Field Lab, inspect LOG-103 (endpoint=/api/v1/admin/reports/export, status_code=200, bytes_out=50541200, hour_ist=3) versus LOG-105 (same endpoint, hour_ist=11, bytes_out=840000).'
    },
    {
      level: 4,
      label: 'Level 4: Worked Example',
      text: 'Mira Sen (Worked Example): Using AND with endpoint equals /api/v1/admin/reports/export, status_code equals 200, and bytes_out greater than 10000000 flags LOG-103 while leaving LOG-101, LOG-102, and LOG-105 unflagged.'
    },
    {
      level: 5,
      label: 'Level 5: Independent Retry',
      text: 'Mira Sen: Test adding or modifying conditions in the Field Lab to verify all 4 test cases pass, then write your Final Investigation Report in your own words.'
    }
  ]
};

// ============================================================================
// DOMAIN MODULE 3: STORY, PROGRESSION & DECISION ENGINE HELPERS
// ============================================================================

function isChapterCompleted(state, chapterNum) {
  const applyDone = Boolean(state.conceptChecks[`apply-ch${chapterNum}`]);
  const transferDone = Boolean(state.conceptChecks[`transfer-ch${chapterNum}`]);
  if (chapterNum === 3) {
    return applyDone && transferDone && Boolean(state.decisionChoice);
  }
  return applyDone && transferDone;
}

function getDecisionNarrativeContext(decisionChoice) {
  if (decisionChoice === 'opt-uncoordinated') {
    return {
      ch4Note:
        'Arjun Mehta (App Ops): "Because r.deshmukh was locked without advance coordination earlier, our morning billing batch stalled for 45 minutes—we’ve now transitioned it to a dedicated service token per POL-SEC-04."',
      ch5Note:
        'Mira Sen: "You experienced firsthand why uncoordinated lockouts disrupt operations, and you recovered well by documenting the policy lesson."'
    };
  }
  if (decisionChoice === 'opt-delayed') {
    return {
      ch4Note:
        'Mira Sen: "After confirming EV-07’s rotated logs could not be recovered, we revoked sess_9941a in time—a good reminder not to let imperfect telemetry paralyse containment."',
      ch5Note:
        'Mira Sen: "You learned to balance evidentiary caution with timely action when active sessions are at risk."'
    };
  }
  if (decisionChoice === 'opt-coordinated') {
    return {
      ch4Note:
        'Nandita Rao (GRC): "Your coordinated containment in Chapter III followed POL-SEC-04 Section 5.1 cleanly, keeping billing operations running while preserving AST-LAP-019."',
      ch5Note:
        'Mira Sen: "Your proportionate, coordinated containment set a clean foundation for both legal review and detection engineering."'
    };
  }
  return null;
}

// ============================================================================
// DOMAIN MODULE 4: PERSISTENCE & DEFAULT STATE FACTORY
// ============================================================================

const createDefaultState = () => ({
  version: 2,
  screen: 'welcome', // 'welcome' | 'field-map' | 'workspace'
  activeTab: 'story', // 'story' | 'board' | 'timeline' | 'legal' | 'lab' | 'report'
  currentChapter: 1,
  unlockedChapter: 1,
  selectedEvidenceId: 'EV-01',
  viewedEvidenceIds: ['EV-01'],
  playerNotes: {
    general: '',
    evidenceInterpretations: {}
  },
  conceptChecks: {},
  // Audit fix #3: No prefilled leading assessments—all hypotheses start unassessed ('open')
  hypothesesState: {
    H1: { status: 'open', supporting: [], contradicting: [], inconclusive: [], note: '' },
    H2: { status: 'open', supporting: [], contradicting: [], inconclusive: [], note: '' },
    H3: { status: 'open', supporting: [], contradicting: [], inconclusive: [], note: '' },
    H4: { status: 'open', supporting: [], contradicting: [], inconclusive: [], note: '' }
  },
  decisionChoice: null,
  exploredDecisions: [],
  assistanceLevelByChapter: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  labRules: [
    { id: 'r1', field: 'endpoint', operator: 'equals', value: '/api/v1/admin/reports/export' },
    { id: 'r2', field: 'status_code', operator: 'equals', value: '200' },
    { id: 'r3', field: 'bytes_out', operator: 'greater_than', value: '10000000' }
  ],
  labCombinator: 'AND',
  finalReport: {
    whatHappened: '',
    bestHypothesis: '',
    uncertainties: '',
    falsePositives: '',
    recommendedActions: '',
    additionalEvidence: '',
    submitted: false
  },
  reportValidationErrors: [],
  mentorChatHistory: [
    {
      sender: 'MIRA',
      text: 'Welcome to Asterion Systems. Take your time exploring the evidence—remember to separate raw observations (what the log literally says) from your interpretation (what you think it means).'
    }
  ]
});

// ============================================================================
// MAIN APPLICATION COMPONENT (PRESENTATION LAYER)
// ============================================================================
export default function App() {
  const [state, setState] = useState(createDefaultState);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [saveBanner, setSaveBanner] = useState('');
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [glossarySearch, setGlossarySearch] = useState('');
  const [selectedLabRecordId, setSelectedLabRecordId] = useState('LOG-103');

  // Check for compatible saved progress on mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SAVE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === 2 && typeof parsed.currentChapter === 'number') {
          setHasSavedProgress(true);
        }
      }
    } catch {
      setHasSavedProgress(false);
    }
  }, []);

  // Persist state safely
  useEffect(() => {
    if (state.screen === 'welcome') return;
    try {
      window.localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(state));
      setHasSavedProgress(true);
    } catch {
      // Ignore quota errors gracefully
    }
  }, [state]);

  const handleResumeSaved = () => {
    try {
      const raw = window.localStorage.getItem(SAVE_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 2) {
        setState({ ...createDefaultState(), ...parsed });
        setSaveBanner('Resumed saved Case 001 progress.');
        setTimeout(() => setSaveBanner(''), 3000);
      } else {
        setSaveBanner('Saved data version was incompatible; started fresh safely.');
        setState({ ...createDefaultState(), screen: 'field-map' });
      }
    } catch {
      setSaveBanner('Could not parse saved state; started fresh safely.');
      setState({ ...createDefaultState(), screen: 'field-map' });
    }
  };

  const handleStartFresh = () => {
    const fresh = { ...createDefaultState(), screen: 'field-map' };
    setState(fresh);
    try {
      window.localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(fresh));
      setHasSavedProgress(true);
    } catch {
      // noop
    }
  };

  const handleResetAll = () => {
    try {
      window.localStorage.removeItem(SAVE_STORAGE_KEY);
    } catch {
      // noop
    }
    setHasSavedProgress(false);
    setState(createDefaultState());
  };

  const unlockedEvidence = useMemo(() => {
    return EVIDENCE_ITEMS.filter((ev) => ev.chapterUnlocked <= state.unlockedChapter);
  }, [state.unlockedChapter]);

  const activeChapterData = useMemo(() => {
    return CHAPTERS.find((c) => c.number === state.currentChapter) || CHAPTERS[0];
  }, [state.currentChapter]);

  const selectedEvidence = useMemo(() => {
    return (
      unlockedEvidence.find((e) => e.id === state.selectedEvidenceId) ||
      unlockedEvidence[0] ||
      EVIDENCE_ITEMS[0]
    );
  }, [unlockedEvidence, state.selectedEvidenceId]);

  const selectEvidence = (evId) => {
    const targetEv = EVIDENCE_ITEMS.find((e) => e.id === evId);
    if (!targetEv || targetEv.chapterUnlocked > state.unlockedChapter) return;
    setState((prev) => ({
      ...prev,
      selectedEvidenceId: evId,
      viewedEvidenceIds: prev.viewedEvidenceIds.includes(evId)
        ? prev.viewedEvidenceIds
        : [...prev.viewedEvidenceIds, evId]
    }));
  };

  // Audit fix #1 & #2: Enforce sequential chapter unlocking; allow replay of unlocked chapters without unlocking future chapters
  const navigateToChapter = (targetChapNum, isAdvanceAction = false) => {
    const target = Math.min(Math.max(1, targetChapNum), 5);

    // Replaying an already unlocked chapter
    if (target <= state.unlockedChapter) {
      setState((prev) => ({
        ...prev,
        screen: 'workspace',
        activeTab: 'story',
        currentChapter: target
      }));
      return;
    }

    // Attempting to unlock the immediate next chapter
    if (isAdvanceAction && target === state.unlockedChapter + 1) {
      if (!isChapterCompleted(state, state.unlockedChapter)) {
        setSaveBanner(
          `Complete Chapter ${state.unlockedChapter}'s Understanding Checks${
            state.unlockedChapter === 3 ? ' and Containment Decision' : ''
          } before unlocking Chapter ${target}.`
        );
        setTimeout(() => setSaveBanner(''), 4000);
        return;
      }

      const firstNewEv = EVIDENCE_ITEMS.find((e) => e.chapterUnlocked === target);
      setState((prev) => ({
        ...prev,
        screen: 'workspace',
        activeTab: 'story',
        currentChapter: target,
        unlockedChapter: target,
        selectedEvidenceId: firstNewEv ? firstNewEv.id : prev.selectedEvidenceId,
        viewedEvidenceIds:
          firstNewEv && !prev.viewedEvidenceIds.includes(firstNewEv.id)
            ? [...prev.viewedEvidenceIds, firstNewEv.id]
            : prev.viewedEvidenceIds
      }));
      return;
    }

    // Otherwise blocked
    setSaveBanner(`Chapter ${target} is locked. Complete earlier chapters sequentially first.`);
    setTimeout(() => setSaveBanner(''), 3500);
  };

  // Hypothesis Board updates
  const updateHypothesisEvidence = (hypId, evId, relation) => {
    setState((prev) => {
      const current = prev.hypothesesState[hypId];
      const cleanSupport = current.supporting.filter((id) => id !== evId);
      const cleanContra = current.contradicting.filter((id) => id !== evId);
      const cleanInconc = current.inconclusive.filter((id) => id !== evId);

      if (relation === 'supporting') cleanSupport.push(evId);
      if (relation === 'contradicting') cleanContra.push(evId);
      if (relation === 'inconclusive') cleanInconc.push(evId);

      return {
        ...prev,
        hypothesesState: {
          ...prev.hypothesesState,
          [hypId]: {
            ...current,
            supporting: cleanSupport,
            contradicting: cleanContra,
            inconclusive: cleanInconc
          }
        }
      };
    });
  };

  const updateHypothesisStatus = (hypId, status) => {
    setState((prev) => ({
      ...prev,
      hypothesesState: {
        ...prev.hypothesesState,
        [hypId]: { ...prev.hypothesesState[hypId], status }
      }
    }));
  };

  const updateHypothesisNote = (hypId, note) => {
    setState((prev) => ({
      ...prev,
      hypothesesState: {
        ...prev.hypothesesState,
        [hypId]: { ...prev.hypothesesState[hypId], note }
      }
    }));
  };

  // Phase 3: 5-Level Layered Mira Guidance + Deterministic TRACE Co-Pilot
  const requestLayeredMiraHelp = () => {
    const ch = state.currentChapter;
    const currentLvl = state.assistanceLevelByChapter[ch] || 0;
    const nextLvl = currentLvl >= 5 ? 1 : currentLvl + 1;
    const chapterSteps = LAYERED_MIRA_GUIDANCE[ch] || LAYERED_MIRA_GUIDANCE[1];
    const stepObj = chapterSteps[nextLvl - 1];

    setState((prev) => ({
      ...prev,
      assistanceLevelByChapter: {
        ...prev.assistanceLevelByChapter,
        [ch]: nextLvl
      },
      mentorChatHistory: [
        ...prev.mentorChatHistory,
        {
          sender: 'MIRA',
          badge: stepObj.label,
          text: stepObj.text
        }
      ]
    }));
  };

  const queryTraceCopilot = () => {
    const ch = state.currentChapter;
    const traceOutputs = {
      1: 'TRACE [Co-Pilot]: Pattern scan on EV-01..EV-03: 02:00 IST matches scheduled backup cadence. 02:14 IST requests from 198.51.100.44 returned HTTP 404. 03:42 IST export transferred 50,541,200 bytes (~50.54 MB / ~48.20 MiB). Verify whether 198.51.100.44 and 203.0.113.88 are related.',
      2: 'TRACE [Co-Pilot]: Cross-index match: session_id=sess_9941a authenticated at 22:09:07Z (03:39:07 IST) from 203.0.113.88 with MFA_CHALLENGE_BYPASSED, then executed DATA_EXPORT_CSV at 03:42:09 IST. Note: EV-07 reports rotated legacy token logs.',
      3: 'TRACE [Co-Pilot — Unverified Suggestion]: High-confidence containment alert: disable r.deshmukh immediately without waiting for App Ops and wipe AST-LAP-019. [WARNING: Verify this suggestion against EV-06 and POL-SEC-04 before acting!]',
      4: 'TRACE [Co-Pilot]: Schema check on EV-05: 62,400 rows include [customer_id, full_name, corporate_email, billing_address, gstin, invoice_total_inr]. Retention gap flagged on legacy token store (< 180 days).',
      5: 'TRACE [Co-Pilot]: Triage dataset summary: 6 records loaded (LOG-101..LOG-106). 1 record (LOG-104) has telemetry_complete=false and must remain INSUFFICIENT_EVIDENCE.'
    };

    setState((prev) => ({
      ...prev,
      mentorChatHistory: [
        ...prev.mentorChatHistory,
        {
          sender: 'TRACE',
          badge: 'Co-Pilot Lead (Verify Independently)',
          text: traceOutputs[ch] || traceOutputs[1]
        }
      ]
    }));
  };

  // Web Evidence Triage Visual Rule Builder Evaluation Engine
  const evaluatedTriageResults = useMemo(() => {
    return TRIAGE_DATASET.map((record) => {
      // Audit fix #9: Preserve incomplete-telemetry override unconditionally
      if (!record.telemetry_complete || record.status_code === 0 || record.bytes_out < 0) {
        return {
          ...record,
          classification: 'INSUFFICIENT_EVIDENCE',
          matchedReasons: [
            'Telemetry incomplete (telemetry_complete=false / status_code=0 / bytes_out=-1) — isolated from binary classification'
          ]
        };
      }

      if (state.labRules.length === 0) {
        return {
          ...record,
          classification: 'UNFLAGGED',
          matchedReasons: ['No active rules configured']
        };
      }

      const ruleChecks = state.labRules.map((rule) => {
        const rawVal = record[rule.field];
        const targetVal = rule.value;
        let matched = false;

        if (rule.operator === 'equals') {
          matched = String(rawVal).toLowerCase() === String(targetVal).trim().toLowerCase();
        } else if (rule.operator === 'not_equals') {
          matched = String(rawVal).toLowerCase() !== String(targetVal).trim().toLowerCase();
        } else if (rule.operator === 'contains') {
          matched = String(rawVal).toLowerCase().includes(String(targetVal).trim().toLowerCase());
        } else if (rule.operator === 'greater_than') {
          const numTarget = Number(targetVal);
          matched = !Number.isNaN(numTarget) && Number(rawVal) > numTarget;
        } else if (rule.operator === 'less_than') {
          const numTarget = Number(targetVal);
          matched = !Number.isNaN(numTarget) && Number(rawVal) < numTarget;
        }

        return {
          matched,
          label: `${rule.field} ${rule.operator.replace('_', ' ')} ${rule.value}`
        };
      });

      const isFlagged =
        state.labCombinator === 'AND'
          ? ruleChecks.every((c) => c.matched)
          : ruleChecks.some((c) => c.matched);

      return {
        ...record,
        classification: isFlagged ? 'FLAGGED_FOR_REVIEW' : 'UNFLAGGED',
        matchedReasons: isFlagged
          ? ruleChecks.filter((c) => c.matched).map((c) => c.label)
          : ['Did not satisfy rule criteria']
      };
    });
  }, [state.labRules, state.labCombinator]);

  // Verify the 4 mandatory test cases dynamically
  const triageTestCaseStatus = useMemo(() => {
    const tc1 = evaluatedTriageResults.find((r) => r.id === 'LOG-103');
    const tc2 = evaluatedTriageResults.find((r) => r.id === 'LOG-101');
    const tc3 = evaluatedTriageResults.find((r) => r.id === 'LOG-102');
    const tc4 = evaluatedTriageResults.find((r) => r.id === 'LOG-104');

    const p1 = tc1?.classification === 'FLAGGED_FOR_REVIEW';
    const p2 = tc2?.classification === 'UNFLAGGED';
    const p3 = tc3?.classification === 'UNFLAGGED';
    const p4 = tc4?.classification === 'INSUFFICIENT_EVIDENCE';

    return {
      p1,
      p2,
      p3,
      p4,
      allPassed: p1 && p2 && p3 && p4
    };
  }, [evaluatedTriageResults]);

  // Audit fix #7: Strict Final Report Validation
  const handleSubmitFinalReport = () => {
    const errors = [];
    const r = state.finalReport;

    if (state.unlockedChapter < 5) {
      errors.push('Progress through all 5 chapters before submitting the final case report.');
    }
    if (!triageTestCaseStatus.allPassed) {
      errors.push('Complete the Web Evidence Triage Field Lab so all 4 required test cases pass.');
    }
    if (!r.bestHypothesis) {
      errors.push('Select the hypothesis best supported by the evidence.');
    }
    if (r.whatHappened.trim().length < 30) {
      errors.push('Section 1 ("What Happened") must contain at least 30 characters grounded in evidence.');
    }
    if (r.uncertainties.trim().length < 20) {
      errors.push('Section 3 ("What Remains Uncertain") must document telemetry gaps or unverified leads (min 20 characters).');
    }
    if (r.falsePositives.trim().length < 20) {
      errors.push('Section 4 ("False Positives Ruled Out") must identify the benign backup and/or 404 scanner noise (min 20 characters).');
    }
    if (r.recommendedActions.trim().length < 20) {
      errors.push('Section 5 ("Recommended Actions") must specify containment or governance steps (min 20 characters).');
    }
    if (r.additionalEvidence.trim().length < 15) {
      errors.push('Section 6 ("Additional Evidence") must list what further artefacts would be useful (min 15 characters).');
    }

    if (errors.length > 0) {
      setState((prev) => ({
        ...prev,
        reportValidationErrors: errors,
        finalReport: { ...prev.finalReport, submitted: false }
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      reportValidationErrors: [],
      finalReport: { ...prev.finalReport, submitted: true }
    }));
  };

  const filteredGlossary = useMemo(() => {
    const q = glossarySearch.trim().toLowerCase();
    if (!q) return GLOSSARY_TERMS;
    return GLOSSARY_TERMS.filter(
      (g) =>
        g.term.toLowerCase().includes(q) ||
        g.plain.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q)
    );
  }, [glossarySearch]);

  const decisionContext = useMemo(
    () => getDecisionNarrativeContext(state.decisionChoice),
    [state.decisionChoice]
  );

  // ==========================================================================
  // SCREEN A: WELCOME SCREEN
  // ==========================================================================
  if (state.screen === 'welcome') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-sky-500/30">
        <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold tracking-wider text-slate-100 text-lg">NULLTRACE</span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                CASE 001 MVP
              </span>
            </div>
          </div>
          <button
            onClick={() => setGlossaryOpen(true)}
            className="text-sm text-slate-300 hover:text-sky-300 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-800 hover:border-slate-700 transition cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Beginner Glossary</span>
          </button>
        </header>

        <main className="max-w-5xl mx-auto w-full px-6 py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/70 border border-sky-800/60 text-sky-300 text-xs font-medium mb-6">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Cybersecurity Investigation & Learning Environment</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            NULLTRACE
          </h1>
          <p className="text-xl sm:text-2xl text-sky-400 font-medium mb-6">
            Every anomaly has a story. Find yours.
          </p>
          <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed mb-8">
            Step into your first week as a Trainee Investigator at{' '}
            <strong className="text-slate-100">Asterion Systems</strong>. Investigate{' '}
            <strong className="text-slate-100">Case 001: The Silent Export</strong>—examine
            synthetic server logs, separate routine noise from genuine risk, weigh four competing
            hypotheses, and make responsible decisions with guidance from your mentor, Mira Sen.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-10">
            <button
              onClick={handleStartFresh}
              className="px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold flex items-center gap-2 shadow-lg shadow-sky-500/20 transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Investigation (Guest Mode)</span>
            </button>

            {hasSavedProgress && (
              <button
                onClick={handleResumeSaved}
                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-medium flex items-center gap-2 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-sky-400" />
                <span>Resume Saved Case</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-sky-400 font-semibold text-sm uppercase tracking-wider mb-2">
                Who This Is For
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Complete beginners with{' '}
                <strong>zero prior cybersecurity, Linux, networking, or coding experience</strong>.
                Every concept is taught step-by-step before you apply it.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-sky-400 font-semibold text-sm uppercase tracking-wider mb-2">
                What You Will Learn
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                How SOC analysts read logs, spot false positives, correlate timelines across
                UTC/IST, evaluate four competing hypotheses, and navigate Indian cyber governance.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-sky-400 font-semibold text-sm uppercase tracking-wider mb-2">
                Pacing & Format
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                <strong>Estimated duration: ~30–45 minutes</strong> across 5 sequential chapters
                plus a hands-on Web Evidence Triage lab. Pause, replay, or explore anytime—no
                timers or pressure.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/90 flex items-start gap-3 text-xs text-slate-400">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <p>
              <strong>Simulation Notice:</strong> Asterion Systems, its staff, IP addresses (RFC
              5737 documentation ranges), and all log records in Case 001 are completely fictional
              and synthetic. No external systems are scanned or accessed. Guest mode stores
              progress locally in your browser without requiring registration.
            </p>
          </div>
        </main>

        <footer className="border-t border-slate-900 px-6 py-4 text-center text-xs text-slate-500">
          NULLTRACE Educational MVP • Case 001: The Silent Export • Beginner-First Cyber Investigation
        </footer>

        {glossaryOpen && (
          <GlossaryModal
            terms={filteredGlossary}
            search={glossarySearch}
            setSearch={setGlossarySearch}
            onClose={() => setGlossaryOpen(false)}
          />
        )}
      </div>
    );
  }

  // ==========================================================================
  // SCREEN B: BEGINNER FIELD MAP
  // ==========================================================================
  if (state.screen === 'field-map') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-sky-400" />
            <div>
              <h1 className="font-bold text-base sm:text-lg text-white">Beginner Field Map</h1>
              <p className="text-xs text-slate-400">
                Your orientation before entering Asterion Systems’ SOC
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setGlossaryOpen(true)}
              className="text-xs sm:text-sm px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>Glossary</span>
            </button>
            <button
              onClick={() => navigateToChapter(1)}
              className="text-xs sm:text-sm px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <span>Enter Case 001</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto w-full px-6 py-8 space-y-8">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-2">
              How a Cybersecurity Investigation Works
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Investigating a security alert is closer to detective work than hacking. You examine
              digital records left behind by normal operations and compare them against what looks
              out of place.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-xs">
              {[
                '1. EXPERIENCE',
                '2. INVESTIGATE',
                '3. QUESTION',
                '4. DECIDE',
                '5. UNDERSTAND',
                '6. BUILD',
                '7. REFLECT'
              ].map((step) => (
                <div
                  key={step}
                  className="p-2.5 rounded-lg bg-slate-950/90 border border-sky-900/50 text-sky-300 font-semibold"
                >
                  {step}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Core Building Blocks You Will Use Today (No Prior Knowledge Needed)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GLOSSARY_TERMS.map((item) => (
                <div
                  key={item.term}
                  className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sky-300">{item.term}</h4>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">{item.plain}</p>
                  <p className="text-xs text-slate-400 italic border-l-2 border-sky-500/40 pl-3">
                    {item.analogy}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-4">Your 5-Chapter Case Roadmap</h3>
            <div className="space-y-3">
              {CHAPTERS.map((ch) => (
                <div
                  key={ch.number}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 gap-2"
                >
                  <div>
                    <span className="text-xs font-bold text-sky-400 uppercase mr-2">
                      Chapter {ch.number}
                    </span>
                    <span className="font-semibold text-slate-100">
                      {ch.title.replace(/^Chapter [IVX]+:\s*/, '')}
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5">{ch.subtitle}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 self-start sm:self-center">
                    Theme: {ch.theme}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setState((prev) => ({ ...prev, screen: 'welcome' }))}
              className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Welcome</span>
            </button>
            <button
              onClick={() => navigateToChapter(1)}
              className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm flex items-center gap-2 shadow-lg shadow-sky-500/20 cursor-pointer"
            >
              <span>Begin Chapter I: The Anomaly</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </main>

        {glossaryOpen && (
          <GlossaryModal
            terms={filteredGlossary}
            search={glossarySearch}
            setSearch={setGlossarySearch}
            onClose={() => setGlossaryOpen(false)}
          />
        )}
      </div>
    );
  }

  // ==========================================================================
  // SCREEN D: CHAPTER & INVESTIGATION WORKSPACE
  // ==========================================================================
  const currentChapterComplete = isChapterCompleted(state, state.currentChapter);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setState((prev) => ({ ...prev, screen: 'welcome' }))}
            className="flex items-center gap-2 text-left group cursor-pointer"
            title="Return to Welcome Screen"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:bg-sky-500/20">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-wide text-white leading-none">
                NULLTRACE
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">CASE 001 • ASTERION SYSTEMS</div>
            </div>
          </button>
        </div>

        {/* Sequential Chapter Progress Pills */}
        <nav aria-label="Case Chapters" className="flex items-center gap-1.5 overflow-x-auto py-1">
          {CHAPTERS.map((ch) => {
            const isCurrent = state.currentChapter === ch.number;
            const isUnlocked = ch.number <= state.unlockedChapter;
            return (
              <button
                key={ch.number}
                onClick={() => navigateToChapter(ch.number, false)}
                disabled={!isUnlocked}
                aria-disabled={!isUnlocked}
                title={
                  isUnlocked
                    ? `Open or Replay Chapter ${ch.number}`
                    : `Locked — complete earlier chapters first`
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                  isCurrent
                    ? 'bg-sky-500 text-slate-950 font-semibold cursor-pointer'
                    : isUnlocked
                    ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 cursor-pointer'
                    : 'bg-slate-900/40 text-slate-600 border border-slate-800/60 cursor-not-allowed'
                }`}
              >
                {isUnlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                <span>Ch {ch.number}</span>
              </button>
            );
          })}
        </nav>

        {/* Utility Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setState((prev) => ({ ...prev, screen: 'field-map' }))}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Field Map</span>
          </button>
          <button
            onClick={() => setGlossaryOpen(true)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Glossary</span>
          </button>
          <button
            onClick={handleResetAll}
            title="Reset Case Progress"
            className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/50 text-slate-400 hover:text-rose-300 border border-slate-800 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </header>

      {saveBanner && (
        <div
          role="status"
          className="bg-sky-950/90 border-b border-sky-800 px-6 py-2 text-xs text-sky-200 text-center"
        >
          {saveBanner}
        </div>
      )}

      {/* Workspace Sub-Navigation Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/50 px-4 sm:px-6 flex items-center gap-1 overflow-x-auto">
        {[
          { id: 'story', label: '1. Story & Learning', icon: FileText },
          { id: 'board', label: '2. Evidence & Hypotheses', icon: Layers },
          { id: 'timeline', label: '3. Correlation Timeline', icon: Clock },
          { id: 'legal', label: '4. Policy & Legal Room', icon: Scale },
          { id: 'lab', label: '5. Field Lab: Web Triage', icon: Terminal },
          { id: 'report', label: '6. Final Report', icon: ClipboardCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const active = state.activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setState((prev) => ({ ...prev, activeTab: tab.id }))}
              className={`px-3.5 py-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                active
                  ? 'border-sky-400 text-sky-300 bg-slate-900/80'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.id === 'lab' && triageTestCaseStatus.allPassed && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
              {tab.id === 'report' && state.finalReport.submitted && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}            </button>
          );
        })}
      </div>

      {/* Main Split Grid */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT MAIN PANEL */}
        <div className="lg:col-span-8 space-y-6">
          {/* TAB 1: STORY, UNDERSTANDING ENGINE & DECISIONS */}
          {state.activeTab === 'story' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                    Theme: {activeChapterData.theme}
                  </span>
                  <span className="text-xs text-slate-400">
                    Unlocked Evidence: {unlockedEvidence.length} / {EVIDENCE_ITEMS.length} artefacts
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-white mb-1">{activeChapterData.title}</h1>
                <p className="text-sm text-slate-300">{activeChapterData.subtitle}</p>
              </div>

              {/* Dialogue & Narrative Scenes */}
              <div className="space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Investigation Scene & Character Dialogue
                </h2>
                {activeChapterData.narrative.map((line, idx) => {
                  const isTrace = line.speaker === 'TRACE';
                  const isMira = line.speaker === 'MIRA SEN';
                  const isNarrator = line.speaker === 'NARRATOR';
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border ${
                        isNarrator
                          ? 'bg-slate-900/40 border-slate-800/80 italic text-slate-300'
                          : isTrace
                          ? 'bg-indigo-950/30 border-indigo-800/50'
                          : isMira
                          ? 'bg-sky-950/25 border-sky-800/50'
                          : 'bg-slate-900/80 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-xs font-bold tracking-wide ${
                            isTrace
                              ? 'text-indigo-300'
                              : isMira
                              ? 'text-sky-300'
                              : isNarrator
                              ? 'text-slate-400'
                              : 'text-amber-300'
                          }`}
                        >
                          {line.speaker}
                        </span>
                        <span className="text-[11px] text-slate-400">{line.role}</span>
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed">{line.text}</p>
                    </div>
                  );
                })}

                {/* Audit fix #5: Dynamic Chapter III decision carry-forward dialogue in Ch 4 & Ch 5 */}
                {decisionContext && (state.currentChapter === 4 || state.currentChapter === 5) && (
                  <div className="p-4 rounded-xl bg-amber-950/25 border border-amber-700/50">
                    <div className="text-[11px] font-bold uppercase text-amber-300 mb-1">
                      Consequence Carry-Forward From Your Chapter III Decision
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {state.currentChapter === 4
                        ? decisionContext.ch4Note
                        : decisionContext.ch5Note}
                    </p>
                  </div>
                )}
              </div>

              {/* THE UNDERSTANDING ENGINE (Teach Before Testing) */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-sky-900/50 space-y-5">
                <div className="flex items-center gap-2 text-sky-400">
                  <Sparkles className="w-5 h-5" />
                  <h2 className="font-bold text-base text-white">
                    Concept Guide: {activeChapterData.conceptModule.title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800">
                    <div className="text-xs font-bold uppercase text-sky-400 mb-1">
                      1. Understand
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {activeChapterData.conceptModule.understand}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800">
                    <div className="text-xs font-bold uppercase text-emerald-400 mb-1">
                      2. See It in Case 001
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {activeChapterData.conceptModule.seeIt}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 flex items-center gap-2.5">
                  <Eye className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>
                    <strong>3. Inspect It:</strong> {activeChapterData.conceptModule.inspectPrompt}
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="text-xs font-bold uppercase text-amber-300">
                    4. Apply It — Check Your Reasoning
                  </div>
                  <p className="text-sm text-slate-200 font-medium">
                    {activeChapterData.conceptModule.applyQuestion}
                  </p>
                  <div className="space-y-2">
                    {activeChapterData.conceptModule.applyOptions.map((opt) => {
                      const chosen =
                        state.conceptChecks[`apply-ch${activeChapterData.number}`] === opt.id;
                      return (
                        <div key={opt.id}>
                          <button
                            onClick={() =>
                              setState((prev) => ({
                                ...prev,
                                conceptChecks: {
                                  ...prev.conceptChecks,
                                  [`apply-ch${activeChapterData.number}`]: opt.id
                                }
                              }))
                            }
                            className={`w-full text-left p-3.5 rounded-xl border text-sm transition cursor-pointer ${
                              chosen
                                ? opt.correct
                                  ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-100'
                                  : 'bg-amber-950/40 border-amber-500/60 text-amber-100'
                                : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            {opt.text}
                          </button>
                          {chosen && (
                            <p
                              className={`mt-1.5 text-xs px-3 py-2 rounded-lg ${
                                opt.correct
                                  ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-800/50'
                                  : 'bg-amber-950/30 text-amber-300 border border-amber-800/50'
                              }`}
                            >
                              {opt.feedback}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2.5">
                  <div className="text-xs font-bold uppercase text-indigo-300">
                    5. Transfer It — New Example
                  </div>
                  <p className="text-sm text-slate-200">
                    {activeChapterData.conceptModule.transferPrompt}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeChapterData.conceptModule.transferOptions.map((tOpt) => {
                      const chosen =
                        state.conceptChecks[`transfer-ch${activeChapterData.number}`] === tOpt.id;
                      return (
                        <button
                          key={tOpt.id}
                          onClick={() =>
                            setState((prev) => ({
                              ...prev,
                              conceptChecks: {
                                ...prev.conceptChecks,
                                [`transfer-ch${activeChapterData.number}`]: tOpt.id
                              }
                            }))
                          }
                          className={`text-left p-3 rounded-xl border text-xs leading-relaxed transition cursor-pointer ${
                            chosen
                              ? tOpt.correct
                                ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                                : 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                              : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          {tOpt.text}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* CHAPTER III DECISION & CONSEQUENCE ENGINE */}
              {activeChapterData.decision && (
                <div className="p-6 rounded-2xl bg-slate-900 border border-amber-700/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-300">
                      <GitBranch className="w-5 h-5" />
                      <h2 className="font-bold text-base text-white">
                        Operational Decision Point (Recoverable & Replayable Branches)
                      </h2>
                    </div>
                    <span className="text-xs text-slate-400">
                      Explored: {state.exploredDecisions.length} / 3 branches
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">{activeChapterData.decision.prompt}</p>

                  <div className="space-y-3">
                    {activeChapterData.decision.options.map((opt) => {
                      const isSelected = state.decisionChoice === opt.id;
                      return (
                        <div
                          key={opt.id}
                          className={`p-4 rounded-xl border transition ${
                            isSelected
                              ? 'bg-sky-950/30 border-sky-500/60'
                              : 'bg-slate-950/80 border-slate-800'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                            <h3 className="font-semibold text-sm text-white">{opt.label}</h3>
                            <button
                              onClick={() =>
                                setState((prev) => ({
                                  ...prev,
                                  decisionChoice: opt.id,
                                  exploredDecisions: prev.exploredDecisions.includes(opt.id)
                                    ? prev.exploredDecisions
                                    : [...prev.exploredDecisions, opt.id]
                                }))
                              }
                              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                                isSelected
                                  ? 'bg-sky-500 text-slate-950'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                              }`}
                            >
                              {isSelected ? 'Active Branch' : 'Choose & Simulate Branch'}
                            </button>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{opt.summary}</p>

                          {isSelected && (
                            <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 text-xs">
                              <div className="text-amber-200">
                                <strong>Immediate Consequence:</strong> {opt.immediateConsequence}
                              </div>
                              <div className="text-sky-200">
                                <strong>Later Consequence (Carries Forward to Ch IV–V):</strong>{' '}
                                {opt.laterConsequence}
                              </div>
                              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300">
                                <strong>Recovery & Reflection:</strong> {opt.learningNote}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Chapter Navigation Footer */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-slate-300 max-w-xl">
                  {activeChapterData.nextActionPrompt}
                </p>
                <div className="flex items-center gap-2.5">
                  {state.currentChapter === 1 && (
                    <button
                      onClick={() => setState((prev) => ({ ...prev, activeTab: 'board' }))}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      Open Evidence Board
                    </button>
                  )}
                  {state.currentChapter < 5 ? (
                    <button
                      onClick={() => navigateToChapter(state.currentChapter + 1, true)}
                      className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition ${
                        currentChapterComplete || state.currentChapter < state.unlockedChapter
                          ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 cursor-pointer'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 cursor-pointer'
                      }`}
                    >
                      <span>
                        {state.currentChapter < state.unlockedChapter
                          ? `Next: Chapter ${state.currentChapter + 1}`
                          : currentChapterComplete
                          ? `Unlock Chapter ${state.currentChapter + 1}`
                          : `Complete Tasks to Unlock Ch ${state.currentChapter + 1}`}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setState((prev) => ({ ...prev, activeTab: 'lab' }))}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Open Field Lab: Web Triage</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EVIDENCE & HYPOTHESIS BOARD */}
          {state.activeTab === 'board' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h2 className="text-xl font-bold text-white mb-1">
                  Evidence & Four-Hypothesis Board
                </h2>
                <p className="text-sm text-slate-300">
                  All four hypotheses start unassessed so you can form your own judgement. Link
                  unlocked evidence as <strong>Supporting</strong>, <strong>Contradicting</strong>
                  , or <strong>Inconclusive</strong>, and record your reasoning.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {INITIAL_HYPOTHESES.map((hyp) => {
                  const hState = state.hypothesesState[hyp.id];
                  const showPostDebriefNote =
                    state.finalReport.submitted || hState.note.trim().length >= 25;

                  return (
                    <div
                      key={hyp.id}
                      className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                            {hyp.code}
                          </span>
                          <select
                            aria-label={`Assessment status for ${hyp.id}`}
                            value={hState.status}
                            onChange={(e) => updateHypothesisStatus(hyp.id, e.target.value)}
                            className="text-xs bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200"
                          >
                            <option value="open">Assessment: Unassessed / Open</option>
                            <option value="leading">Assessment: Best Supported</option>
                            <option value="partial">Assessment: Partially Relevant</option>
                            <option value="unlikely">Assessment: Weak / Contradicted</option>
                          </select>
                        </div>

                        <h3 className="font-bold text-base text-white">{hyp.title}</h3>
                        <p className="text-xs text-slate-300 leading-relaxed">{hyp.description}</p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <div className="text-[11px] font-semibold uppercase text-slate-400">
                          Link Unlocked Evidence ({selectedEvidence.id} selected)
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            onClick={() =>
                              updateHypothesisEvidence(hyp.id, selectedEvidence.id, 'supporting')
                            }
                            className="px-2.5 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 text-xs cursor-pointer"
                          >
                            + Support ({selectedEvidence.id})
                          </button>
                          <button
                            onClick={() =>
                              updateHypothesisEvidence(hyp.id, selectedEvidence.id, 'contradicting')
                            }
                            className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 text-xs cursor-pointer"
                          >
                            - Contradict ({selectedEvidence.id})
                          </button>
                          <button
                            onClick={() =>
                              updateHypothesisEvidence(hyp.id, selectedEvidence.id, 'inconclusive')
                            }
                            className="px-2.5 py-1 rounded bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800/60 text-xs cursor-pointer"
                          >
                            ? Inconclusive ({selectedEvidence.id})
                          </button>
                        </div>

                        <div className="space-y-1 text-xs pt-1">
                          <div className="text-emerald-400">
                            <strong>Supporting:</strong>{' '}
                            {hState.supporting.length > 0 ? hState.supporting.join(', ') : 'None yet'}
                          </div>
                          <div className="text-rose-400">
                            <strong>Contradicting:</strong>{' '}
                            {hState.contradicting.length > 0
                              ? hState.contradicting.join(', ')
                              : 'None yet'}
                          </div>
                          <div className="text-amber-400">
                            <strong>Inconclusive:</strong>{' '}
                            {hState.inconclusive.length > 0
                              ? hState.inconclusive.join(', ')
                              : 'None yet'}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                          Your Reasoning Note (Write {'≥'} 25 chars to unlock Mira’s comparison note)
                        </label>
                        <textarea
                          rows={2}
                          value={hState.note}
                          onChange={(e) => updateHypothesisNote(hyp.id, e.target.value)}
                          placeholder={`Explain how the evidence supports or weakens ${hyp.id}...`}
                          className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      {/* Audit fix #4: Do not reveal analytical conclusions before learner writes reasoning */}
                      {showPostDebriefNote ? (
                        <div className="text-[11px] text-sky-200 bg-sky-950/30 p-2.5 rounded-lg border border-sky-800/50">
                          <strong>Mira’s Comparison Note:</strong> {hyp.postInvestigationNote}
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-500 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                          Mira’s comparison note stays hidden while you investigate. Write your own
                          reasoning note above first.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CORRELATION TIMELINE (Audit fix #10 & #11) */}
          {state.activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h2 className="text-xl font-bold text-white mb-1">
                  Normalised Event Timeline (IST / UTC+05:30)
                </h2>
                <p className="text-sm text-slate-300">
                  Events from unlocked logs aligned chronologically in Indian Standard Time (IST)
                  alongside their exact UTC equivalents.
                </p>
              </div>

              <div className="relative pl-6 border-l-2 border-slate-800 space-y-5 ml-3">
                {[
                  {
                    timeIst: '16 Nov 2026 • ~15:30 IST',
                    timeUtc: '16 Nov 2026 • ~10:00 UTC',
                    evId: 'EV-08',
                    title: 'Reported Phishing Lure Encounter (Unverified Lead)',
                    detail:
                      'Rohan recalls entering Asterion SSO credentials on a lookalike "GST Portal Compliance Update" page on his personal browser profile; browser history has not yet been forensically imaged.',
                    tag: 'Corroborative Lead',
                    tagColor: 'text-amber-300 bg-amber-950/50 border-amber-800/60'
                  },
                  {
                    timeIst: '17 Nov 2026 • 18:45 IST',
                    timeUtc: '17 Nov 2026 • 13:15 UTC',
                    evId: 'EV-06',
                    title: 'Corporate Laptop AST-LAP-019 Goes Asleep',
                    detail:
                      'Endpoint agent records last evening heartbeat before lid closure. Remains asleep until 18 Nov 08:52 IST.',
                    tag: 'Device State',
                    tagColor: 'text-sky-300 bg-sky-950/50 border-sky-800/60'
                  },
                  {
                    timeIst: '18 Nov 2026 • 02:00:03 IST',
                    timeUtc: '17 Nov 2026 • 20:30:03 UTC',
                    evId: 'EV-02',
                    title: 'Scheduled Nightly Database Snapshot (svc_backup)',
                    detail:
                      'Authorised ticket CHG-401 executes 1.43 GB backup. Routine baseline activity—unrelated to the 03:42 export.',
                    tag: 'Benign Baseline',
                    tagColor: 'text-emerald-300 bg-emerald-950/50 border-emerald-800/60'
                  },
                  {
                    timeIst: '18 Nov 2026 • 02:14:11–02:14:14 IST',
                    timeUtc: '17 Nov 2026 • 20:44:11–20:44:14 UTC',
                    evId: 'EV-03',
                    title: 'Automated Internet Scanner Probes (198.51.100.44)',
                    detail:
                      'GET requests to /.env, /wp-admin/setup-config.php, and /phpmyadmin/ all return HTTP 404 Not Found (162 bytes). Unrelated background noise.',
                    tag: 'False Positive / Noise',
                    tagColor: 'text-slate-300 bg-slate-800 border-slate-700'
                  },
                  {
                    timeIst: '18 Nov 2026 • 03:38:51–03:39:08 IST',
                    timeUtc: '17 Nov 2026 • 22:08:51–22:09:08 UTC',
                    evId: 'EV-04',
                    title: 'External Authentication & MFA Bypass/Fallback (203.0.113.88)',
                    detail:
                      'After one failed password attempt at 03:38:51 IST, AUTH_PASSWORD_OK succeeds at 03:39:07 IST from a cloud VPS IP and issues session_id=sess_9941a with MFA_CHALLENGE_BYPASSED.',
                    tag: 'Critical Pivot',
                    tagColor: 'text-rose-300 bg-rose-950/50 border-rose-800/60'
                  },
                  {
                    timeIst: '18 Nov 2026 • 03:42:09 IST',
                    timeUtc: '17 Nov 2026 • 22:12:09 UTC',
                    evId: 'EV-05',
                    title: 'Bulk Export of client_billing_q3_full.csv (50.54 MB / 48.20 MiB)',
                    detail:
                      'Session sess_9941a exports 62,400 customer billing rows under APP_ADMIN permissions. Edge proxy (EV-03) and audit service (EV-05) confirm 50,541,200 bytes served.',
                    tag: 'Primary Anomaly',
                    tagColor: 'text-rose-300 bg-rose-950/50 border-rose-800/60'
                  },
                  {
                    timeIst: '18 Nov 2026 • 08:30–09:15 IST',
                    timeUtc: '18 Nov 2026 • 03:00–03:45 UTC',
                    evId: 'EV-07',
                    title: 'SOC Handover & Telemetry Gap Discovery',
                    detail:
                      'Handover note logged at 08:30 IST (EV-01); monitoring-health note at 09:15 IST (EV-07) reveals legacy trusted-device token logs rotated out 7 days prior.',
                    tag: 'Telemetry Limitation',
                    tagColor: 'text-amber-300 bg-amber-950/50 border-amber-800/60'
                  }
                ].map((item, idx) => {
                  const isAvailable = unlockedEvidence.some((e) => e.id === item.evId);
                  return (
                    <div key={idx} className="relative">
                      <span className="absolute -left-[33px] top-1.5 w-3.5 h-3.5 rounded-full bg-sky-500 border-4 border-slate-950" />
                      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <div className="text-xs font-mono text-sky-400">
                            {item.timeIst}{' '}
                            <span className="text-slate-500">({item.timeUtc})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[11px] px-2 py-0.5 rounded border ${item.tagColor}`}
                            >
                              {item.tag}
                            </span>
                            {isAvailable ? (
                              <button
                                onClick={() => selectEvidence(item.evId)}
                                className="text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-sky-300 font-mono transition cursor-pointer"
                              >
                                Inspect {item.evId}
                              </button>
                            ) : (
                              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-950 text-slate-500 border border-slate-800 font-mono">
                                {item.evId} (Unlocks later)
                              </span>
                            )}
                          </div>
                        </div>
                        <h3 className="font-semibold text-sm text-white mb-1">{item.title}</h3>
                        <p className="text-xs text-slate-300 leading-relaxed">{item.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: POLICY & INDIA-FIRST LEGAL LEARNING ROOM */}
          {state.activeTab === 'legal' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h2 className="text-xl font-bold text-white">
                    India-First Legal & Governance Learning Room
                  </h2>
                  <span className="text-xs px-2.5 py-1 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60">
                    Educational Reference Only — Not Legal Advice
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Guided by GRC Lead Nandita Rao. Distinguish Asterion’s internal policies
                  (POL-SEC-04) from Indian statutory obligations, and verify official Gazette
                  commencement status rather than assuming rules from other jurisdictions apply
                  automatically.
                </p>
              </div>

              <div className="space-y-4">
                {LEGAL_CARDS.map((card) => {
                  const isComparative = card.jurisdiction.includes('Comparative');
                  return (
                    <div
                      key={card.id}
                      className={`p-5 rounded-2xl border space-y-3 ${
                        isComparative
                          ? 'bg-slate-900/50 border-indigo-800/50'
                          : 'bg-slate-900/95 border-slate-800'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded ${
                            isComparative
                              ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/60'
                              : 'bg-sky-950 text-sky-300 border border-sky-800/60'
                          }`}
                        >
                          {card.jurisdiction}
                        </span>
                        <span className="text-xs text-slate-400">
                          Last verified: {card.lastVerified}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-white">{card.provision}</h3>
                      <p className="text-sm text-slate-300 leading-relaxed">{card.summary}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                        <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800">
                          <div className="text-slate-400 font-semibold mb-0.5">Official Source</div>
                          <div className="text-slate-200">{card.officialSource}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800">
                          <div className="text-slate-400 font-semibold mb-0.5">
                            Publication & Commencement Status
                          </div>
                          <div className="text-slate-200">{card.status}</div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300">
                        <strong className="text-amber-300">Applicability Caveat: </strong>
                        {card.applicabilityCaveat}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: FIRST FIELD LAB — WEB EVIDENCE TRIAGE */}
          {state.activeTab === 'lab' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-sky-400" />
                    <h2 className="text-xl font-bold text-white">
                      First Field Lab: Web Evidence Triage (Visual Rule Builder)
                    </h2>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      triageTestCaseStatus.allPassed
                        ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-700/60'
                        : 'bg-amber-950/70 text-amber-300 border border-amber-700/60'
                    }`}
                  >
                    {triageTestCaseStatus.allPassed
                      ? 'All 4 Test Cases Passing'
                      : 'Tune Rule to Pass All 4 Test Cases'}
                  </span>
                </div>
                <p className="text-sm text-slate-300">
                  Build a deterministic triage rule to flag suspicious exports for review without
                  mislabelling the 02:00 IST backup, the 404 scanner requests, or incomplete
                  telemetry records.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    label: '1. Suspicious Export (LOG-103)',
                    expect: 'Must be FLAGGED',
                    pass: triageTestCaseStatus.p1
                  },
                  {
                    label: '2. Benign Backup (LOG-101)',
                    expect: 'Must NOT be flagged',
                    pass: triageTestCaseStatus.p2
                  },
                  {
                    label: '3. Scanner 404 (LOG-102)',
                    expect: 'Must NOT be flagged',
                    pass: triageTestCaseStatus.p3
                  },
                  {
                    label: '4. Incomplete Log (LOG-104)',
                    expect: 'Insufficient Evidence',
                    pass: triageTestCaseStatus.p4
                  }
                ].map((tc) => (
                  <div
                    key={tc.label}
                    className={`p-3.5 rounded-xl border text-xs ${
                      tc.pass
                        ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                        : 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between mb-1">
                      <span>{tc.label}</span>
                      {tc.pass ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </div>
                    <div className="opacity-80">{tc.expect}</div>
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-sky-400" />
                    <h3 className="font-bold text-sm text-white">Visual Condition Builder</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Combine conditions using:</span>
                    <select
                      aria-label="Rule combinator"
                      value={state.labCombinator}
                      onChange={(e) =>
                        setState((prev) => ({ ...prev, labCombinator: e.target.value }))
                      }
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-sky-300 font-semibold"
                    >
                      <option value="AND">ALL conditions (AND)</option>
                      <option value="OR">ANY condition (OR)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {state.labRules.map((rule, index) => (
                    <div
                      key={rule.id}
                      className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800"
                    >
                      <span className="text-xs font-mono text-slate-500 w-12">
                        {index === 0 ? 'WHERE' : state.labCombinator}
                      </span>
                      <select
                        aria-label={`Field for rule ${index + 1}`}
                        value={rule.field}
                        onChange={(e) => {
                          const updated = [...state.labRules];
                          updated[index] = { ...rule, field: e.target.value };
                          setState((prev) => ({ ...prev, labRules: updated }));
                        }}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                      >
                        <option value="endpoint">endpoint</option>
                        <option value="status_code">status_code</option>
                        <option value="bytes_out">bytes_out</option>
                        <option value="account">account</option>
                        <option value="hour_ist">hour_ist (0–23)</option>
                        <option value="src_ip">src_ip</option>
                      </select>

                      <select
                        aria-label={`Operator for rule ${index + 1}`}
                        value={rule.operator}
                        onChange={(e) => {
                          const updated = [...state.labRules];
                          updated[index] = { ...rule, operator: e.target.value };
                          setState((prev) => ({ ...prev, labRules: updated }));
                        }}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                      >
                        <option value="equals">equals</option>
                        <option value="not_equals">not equals</option>
                        <option value="contains">contains</option>
                        <option value="greater_than">greater than</option>
                        <option value="less_than">less than</option>
                      </select>

                      <input
                        aria-label={`Value for rule ${index + 1}`}
                        type="text"
                        value={rule.value}
                        onChange={(e) => {
                          const updated = [...state.labRules];
                          updated[index] = { ...rule, value: e.target.value };
                          setState((prev) => ({ ...prev, labRules: updated }));
                        }}
                        className="flex-1 min-w-[140px] bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                      />

                      <button
                        onClick={() =>
                          setState((prev) => ({
                            ...prev,
                            labRules: prev.labRules.filter((r) => r.id !== rule.id)
                          }))
                        }
                        title="Remove condition"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        labRules: [
                          ...prev.labRules,
                          {
                            id: `r-${Date.now()}`,
                            field: 'hour_ist',
                            operator: 'less_than',
                            value: '7'
                          }
                        ]
                      }))
                    }
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Condition</span>
                  </button>

                  <div className="text-xs text-slate-400">
                    Incomplete records (like LOG-104) are always isolated as{' '}
                    <code className="text-amber-300">INSUFFICIENT_EVIDENCE</code> regardless of
                    rule filters.
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">
                    Live Triage Output ({TRIAGE_DATASET.length} Synthetic Web/App Records)
                  </h3>
                  <span className="text-xs text-slate-400">
                    Click any row to inspect record details
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4">ID</th>
                        <th className="py-2.5 px-4">IST Time</th>
                        <th className="py-2.5 px-4">Account</th>
                        <th className="py-2.5 px-4">Endpoint</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4">Bytes Out</th>
                        <th className="py-2.5 px-4">Triage Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {evaluatedTriageResults.map((row) => {
                        const selected = selectedLabRecordId === row.id;
                        return (
                          <tr
                            key={row.id}
                            onClick={() => setSelectedLabRecordId(row.id)}
                            className={`cursor-pointer transition ${
                              selected ? 'bg-sky-950/30' : 'hover:bg-slate-800/40'
                            }`}
                          >
                            <td className="py-2.5 px-4 font-mono text-sky-300">{row.id}</td>
                            <td className="py-2.5 px-4 font-mono text-slate-300">
                              {row.timestamp_ist}
                            </td>
                            <td className="py-2.5 px-4 font-mono text-slate-200">{row.account}</td>
                            <td className="py-2.5 px-4 font-mono text-slate-300">{row.endpoint}</td>
                            <td className="py-2.5 px-4 font-mono">{row.status_code}</td>
                            <td className="py-2.5 px-4 font-mono">
                              {row.bytes_out < 0 ? 'MISSING (-1)' : row.bytes_out.toLocaleString()}
                            </td>
                            <td className="py-2.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                                  row.classification === 'FLAGGED_FOR_REVIEW'
                                    ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                                    : row.classification === 'INSUFFICIENT_EVIDENCE'
                                    ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                                    : 'bg-slate-800 text-slate-300'
                                }`}
                              >
                                {row.classification}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {(() => {
                  const rec =
                    evaluatedTriageResults.find((r) => r.id === selectedLabRecordId) ||
                    evaluatedTriageResults[0];
                  return (
                    <div className="p-4 bg-slate-950/90 border-t border-slate-800 text-xs space-y-1.5">
                      <div className="font-bold text-sky-300">
                        Record Inspector: {rec.id} ({rec.classification})
                      </div>
                      <p className="text-slate-300">
                        <strong>Why classified this way:</strong> {rec.matchedReasons.join(' • ')}
                      </p>
                      <p className="text-slate-400">
                        <strong>Educational Note:</strong> {rec.explanation}
                      </p>
                    </div>
                  );
                })()}
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">
                    Future Phase Preview: Equivalent Python Triage Pseudocode (Read-Only)
                  </h3>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    Future Sandboxed Lab
                  </span>
                </div>
                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`def triage_web_record(record: dict) -> str:
    # 1. Never force incomplete telemetry into benign/malicious
    if not record.get("telemetry_complete") or record.get("status_code") == 0:
        return "INSUFFICIENT_EVIDENCE"

    # 2. Evaluate deterministic triage conditions
    if (
        record["endpoint"] == "/api/v1/admin/reports/export"
        and record["status_code"] == 200
        and record["bytes_out"] > 10_000_000
        and record["hour_ist"] < 7
    ):
        return "FLAGGED_FOR_REVIEW"

    return "UNFLAGGED"`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 6: FINAL INVESTIGATION REPORT & REFLECTION (Audit fix #7 & #12) */}
          {state.activeTab === 'report' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h2 className="text-xl font-bold text-white mb-1">
                  Case 001 Final Investigation Report
                </h2>
                <p className="text-sm text-slate-300">
                  Present your findings to Mira Sen and Nandita Rao. Ground every claim in
                  evidence, distinguish supported leads from proven facts, and document what remains
                  uncertain.
                </p>
              </div>

              {state.reportValidationErrors.length > 0 && (
                <div
                  role="alert"
                  className="p-4 rounded-2xl bg-rose-950/50 border border-rose-700/60 space-y-1.5 text-xs text-rose-200"
                >
                  <div className="font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Report Validation — Please Complete Required Investigation Details:</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1">
                    {state.reportValidationErrors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-sky-400 mb-1.5">
                    1. What Happened According to Available Evidence? *                  </label>
                  <textarea
                    rows={3}
                    value={state.finalReport.whatHappened}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        finalReport: { ...prev.finalReport, whatHappened: e.target.value }
                      }))
                    }
                    placeholder="Summarise the 03:39:07 IST login from 203.0.113.88 using r.deshmukh's credentials, the MFA bypass/fallback event, and the 03:42:09 IST export of 62,400 billing records (50.54 MB / 48.20 MiB)..."
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-sky-400 mb-1.5">
                    2. Which Hypothesis Is Best Supported? *
                  </label>
                  <select
                    aria-label="Best supported hypothesis"
                    value={state.finalReport.bestHypothesis}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        finalReport: { ...prev.finalReport, bestHypothesis: e.target.value }
                      }))
                    }
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-slate-200"
                  >
                    <option value="">-- Select the best-supported hypothesis --</option>
                    {INITIAL_HYPOTHESES.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.id}: {h.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-amber-300 mb-1.5">
                      3. What Remains Uncertain? (Telemetry Gaps & Unverified Leads) *
                    </label>
                    <textarea
                      rows={3}
                      value={state.finalReport.uncertainties}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          finalReport: { ...prev.finalReport, uncertainties: e.target.value }
                        }))
                      }
                      placeholder="e.g., Legacy token logs rotated out 7 days earlier (EV-07), so we cannot prove cookie replay vs. legacy fallback; phishing lure is supported by Rohan's statement (EV-08) pending browser forensics..."
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-emerald-300 mb-1.5">
                      4. Which False Positives Were Ruled Out? *
                    </label>
                    <textarea
                      rows={3}
                      value={state.finalReport.falsePositives}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          finalReport: { ...prev.finalReport, falsePositives: e.target.value }
                        }))
                      }
                      placeholder="e.g., 02:00 IST scheduled backup by svc_backup (EV-02) and 02:14 IST automated scanner HTTP 404 probes from 198.51.100.44 (EV-03)..."
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-sky-400 mb-1.5">
                      5. Recommended Containment & Governance Actions *
                    </label>
                    <textarea
                      rows={3}
                      value={state.finalReport.recommendedActions}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          finalReport: { ...prev.finalReport, recommendedActions: e.target.value }
                        }))
                      }
                      placeholder="Revoke session sess_9941a with App Ops sign-off, rotate r.deshmukh credentials, remove legacy MFA bypass, retain logs >= 180 days per CERT-In directions..."
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-sky-400 mb-1.5">
                      6. Additional Evidence That Would Be Useful *
                    </label>
                    <textarea
                      rows={3}
                      value={state.finalReport.additionalEvidence}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          finalReport: { ...prev.finalReport, additionalEvidence: e.target.value }
                        }))
                      }
                      placeholder="Browser history and email headers from 16 Nov to verify phishing, full egress NetFlow records, historical IdP token issuance logs..."
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        reportValidationErrors: [],
                        finalReport: {
                          whatHappened:
                            'At 03:39:07 IST on 18 Nov 2026 (22:09:07 UTC), external VPS IP 203.0.113.88 authenticated as r.deshmukh (EV-04), bypassed MFA via a trusted-device cookie replay or legacy fallback, and used session sess_9941a at 03:42:09 IST to export client_billing_q3_full.csv (62,400 rows; 50,541,200 bytes / ~50.54 MB / ~48.20 MiB) (EV-05). Rohan’s corporate laptop was asleep (EV-06) and he reported entering his password on a suspicious GST email page on 16 Nov (EV-08).',
                          bestHypothesis: 'H4',
                          uncertainties:
                            'Legacy trusted-device token logs rotated out 7 days earlier (EV-07), so we cannot conclusively distinguish cookie replay from a legacy fallback path or verify when the token originated. Phishing credential capture is supported by EV-08 pending browser/email header forensics, and individual attribution beyond VPS 203.0.113.88 is not established.',
                          falsePositives:
                            'Ruled out the 02:00 IST nightly database backup by svc_backup (EV-02, CHG-401) and the 02:14 IST automated scanner probes from 198.51.100.44 that returned HTTP 404 (EV-03).',
                          recommendedActions:
                            'Coordinate with App Ops (POL-SEC-04) to revoke sess_9941a, rotate credentials, remove legacy MFA fallback globally, restore 180-day log retention in line with CERT-In Directions, and escalate personal data exposure assessment to GRC/Legal.',
                          additionalEvidence:
                            'Forensic inspection of Rohan’s 16 Nov browser history and email headers, full egress NetFlow telemetry, and IdP token issuance audit logs.',
                          submitted: prev.finalReport.submitted
                        }
                      }))
                    }
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs cursor-pointer"
                  >
                    Fill Guided Example Draft
                  </button>

                  <button
                    onClick={handleSubmitFinalReport}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>Validate & Submit Final Report</span>
                  </button>
                </div>
              </div>

              {state.finalReport.submitted && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-sky-950/30 border border-emerald-700/50 space-y-5">
                  <div className="flex items-center gap-2.5 text-emerald-300">
                    <CheckCircle2 className="w-6 h-6" />
                    <h3 className="text-lg font-bold text-white">
                      Case 001 Closed — Personal Learning Reflection & Pathways
                    </h3>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed">
                    <strong>Mira Sen:</strong> “Well done. You separated raw observations from
                    interpretations, resisted jumping to conclusions on 404 scanner noise, spotted
                    the UTC-to-IST shift, audited TRACE’s overconfident shortcuts, respected
                    telemetry limits, and built a working triage rule.”
                  </p>

                  {decisionContext && (
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-sky-200">
                      <strong>Your Containment Branch Reflection:</strong>{' '}
                      {decisionContext.ch5Note}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5">
                      <div className="font-bold text-sky-400">
                        Pathway 1: SOC & Incident Response
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        You enjoyed timeline reconstruction, session correlation, and containment
                        trade-offs. Explore log analysis, SIEM triage, and digital forensics.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5">
                      <div className="font-bold text-indigo-400">
                        Pathway 2: Detection Engineering
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        You enjoyed the Web Evidence Triage rule builder. Explore writing low-noise
                        detection logic, telemetry health monitoring, and Python log automation.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5">
                      <div className="font-bold text-emerald-400">
                        Pathway 3: GRC & Cyber Privacy
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        You enjoyed Chapter IV’s policy and legal analysis. Explore security
                        governance, Indian cyber compliance (CERT-In / DPDP), and incident
                        accountability.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT PERSISTENT DRAWER: EVIDENCE LOCKER + 5-LEVEL MIRA & TRACE */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Evidence Drawer */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-400" />
                <h2 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                  Case Evidence Locker ({unlockedEvidence.length}/{EVIDENCE_ITEMS.length})
                </h2>
              </div>
              <span className="text-[11px] text-slate-400">Sequential Unlock</span>
            </div>

            <div className="p-3 border-b border-slate-800 flex flex-wrap gap-1.5 bg-slate-900/60">
              {EVIDENCE_ITEMS.map((ev) => {
                const isUnlocked = ev.chapterUnlocked <= state.unlockedChapter;
                const active = selectedEvidence.id === ev.id;
                return (
                  <button
                    key={ev.id}
                    onClick={() => selectEvidence(ev.id)}
                    disabled={!isUnlocked}
                    title={
                      isUnlocked
                        ? `Inspect ${ev.id}: ${ev.title}`
                        : `Locked until Chapter ${ev.chapterUnlocked}`
                    }
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                      active
                        ? 'bg-sky-500 text-slate-950 font-bold cursor-pointer'
                        : isUnlocked
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer'
                        : 'bg-slate-950 text-slate-600 border border-slate-800/80 cursor-not-allowed'
                    }`}
                  >
                    {isUnlocked ? ev.id : `${ev.id}🔒`}
                  </button>
                );
              })}
            </div>

            <div className="p-4 space-y-3">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                  <span>{selectedEvidence.source}</span>
                  <span>{selectedEvidence.category}</span>
                </div>
                <h3 className="font-bold text-sm text-white">{selectedEvidence.title}</h3>
                <div className="text-[11px] font-mono text-sky-400 mt-0.5">
                  {selectedEvidence.timestamp}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Raw Observation (Unedited Record)
                </div>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                  {selectedEvidence.rawObservation}
                </pre>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase text-sky-400">
                  Field & Term Breakdown
                </div>
                {selectedEvidence.fieldGuide.map((fg, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs"
                  >
                    <code className="text-sky-300 font-semibold">{fg.field}:</code>{' '}
                    <span className="text-slate-300">{fg.meaning}</span>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-amber-300 mb-1">
                  Your Interpretation (Kept Separate From Raw Fact)
                </label>
                <textarea
                  rows={2}
                  value={state.playerNotes.evidenceInterpretations[selectedEvidence.id] || ''}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      playerNotes: {
                        ...prev.playerNotes,
                        evidenceInterpretations: {
                          ...prev.playerNotes.evidenceInterpretations,
                          [selectedEvidence.id]: e.target.value
                        }
                      }
                    }))
                  }
                  placeholder={`Write what ${selectedEvidence.id} means to your investigation...`}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* 5-Level Layered Mira Mentor & Deterministic TRACE Co-Pilot */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-sky-400" />
                <h2 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                  Mira (5-Level Mentor) & TRACE
                </h2>
              </div>
              <span className="text-[11px] text-sky-400 font-mono">
                Hint Lvl: {state.assistanceLevelByChapter[state.currentChapter] || 0}/5
              </span>
            </div>

            <div className="p-4 space-y-3">
              <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                {state.mentorChatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl text-xs leading-relaxed border ${
                      msg.sender === 'MIRA'
                        ? 'bg-sky-950/30 border-sky-800/50 text-sky-100'
                        : 'bg-indigo-950/30 border-indigo-800/50 text-indigo-100'
                    }`}
                  >
                    {msg.badge && (
                      <div className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-0.5">
                        {msg.badge}
                      </div>
                    )}
                    <div>{msg.text}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="text-[11px] text-slate-400">
                  Step through Mira’s 5-level scaffold or query TRACE (always verify TRACE’s output):
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={requestLayeredMiraHelp}
                    className="px-2.5 py-2 rounded-lg bg-sky-950/60 hover:bg-sky-900/60 text-sky-300 border border-sky-800/60 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>
                      Mira Lvl{' '}
                      {((state.assistanceLevelByChapter[state.currentChapter] || 0) % 5) + 1} Hint
                    </span>
                  </button>
                  <button
                    onClick={queryTraceCopilot}
                    className="px-2.5 py-2 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/60 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Query TRACE</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {glossaryOpen && (
        <GlossaryModal
          terms={filteredGlossary}
          search={glossarySearch}
          setSearch={setGlossarySearch}
          onClose={() => setGlossaryOpen(false)}
        />
      )}
    </div>
  );
}

// ============================================================================
// SHARED UI COMPONENT: ACCESSIBLE GLOSSARY MODAL
// ============================================================================
function GlossaryModal({ terms, search, setSearch, onClose }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Beginner Cybersecurity Glossary"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-400" />
            <h2 className="font-bold text-base text-white">Beginner Cybersecurity Glossary</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Glossary"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search terms (e.g., SOC, 404, MiB, Baseline, IST)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <div className="p-5 overflow-y-auto space-y-3">
          {terms.map((item) => (
            <div
              key={item.term}
              className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-sky-300">{item.term}</h3>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                  {item.category}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{item.plain}</p>
              <p className="text-xs text-slate-400 italic">{item.analogy}</p>
            </div>
          ))}
          {terms.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-6">
              No matching terms found. Try searching for "SOC", "Log", or "Baseline".
            </p>
          )}
        </div>
      </div>
    </div>
  );
}