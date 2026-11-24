# NULLTRACE

**Every anomaly has a story.**

NULLTRACE is a beginner-first, fictional cybersecurity investigation and learning environment. Case 001, **The Silent Export**, places the learner in a simulated incident at Asterion Systems and teaches evidence handling, hypothesis testing, timeline reconstruction, proportionate response, governance, and basic defensive triage.

## MVP scope

- Guest-mode, browser-based experience; no account required.
- Five sequential chapters with replayable unlocked chapters.
- Fully synthetic evidence using documentation-only IP ranges.
- Evidence board, timeline, India-first legal learning cards, deterministic TRACE co-pilot, layered Mira guidance, visual Web Evidence Triage lab, and final report.
- Local browser progress storage. Clearing browser storage removes local progress.
- No external LLM calls, real customer data, live scanning, or code execution in the MVP.

## Run locally

Requirements: Node.js 22+ and npm.

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Safety and learning boundaries

All case evidence and organisations are fictional. This is an educational simulation, not an operational incident-response tool or legal advice. Work only within authorised environments. Do not use the case to access, test, or investigate real systems or accounts.

## Current status

Initial MVP integration branch. Build and usability validation are pending; legal reference cards require a separate official-source review before public release.
