# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Milestone 1 — Architecture + Project Structure

**Added:**
- Complete 4-layer architecture definition (Netlify → Apps Script → Sheets → Node.js)
- Project folder structure with all directories
- Comprehensive documentation:
  - `README.md` — Project overview and quick links
  - `docs/ARCHITECTURE.md` — Full architecture, communication flows, security model
  - `docs/INSTALLATION.md` — Phase-by-phase installation guide (in progress)
  - `docs/API.md` — API endpoint reference (in progress)
  - `docs/PROGRESS.md` — Live project status tracker
  - `docs/CHANGELOG.md` — This file
- Google Sheets schema definition (11 sheets)
- Contact state machine documentation
- Country/OTHERS fallback logic specification
- SMTP rotation and retry logic specification
- Security requirements checklist
- Development milestone roadmap (M1-M15)

**Defined:**
- 15 development milestones with clear deliverables
- API request/response formats
- Environment variable requirements
- File structure for frontend, apps-script, and smtp-connector

---

## Milestone Roadmap

| Milestone | Status | Target |
|-----------|--------|--------|
| M1 — Architecture | ✅ Complete | 2026-08-08 |
| M2 — Google Sheets Schema | ⬜ Pending | — |
| M3 — Apps Script Backend | ⬜ Pending | — |
| M4 — Country/List Management | ⬜ Pending | — |
| M5 — Contact Import + States | ⬜ Pending | — |
| M6 — Netlify Dashboard | ⬜ Pending | — |
| M7 — SMTP Manager | ⬜ Pending | — |
| M8 — Node.js SMTP Connector | ⬜ Pending | — |
| M9 — Campaign Creation | ⬜ Pending | — |
| M10 — Campaign Queue + Sending | ⬜ Pending | — |
| M11 — Tracking | ⬜ Pending | — |
| M12 — Country Tracking + OTHERS | ⬜ Pending | — |
| M13 — Campaign Statistics | ⬜ Pending | — |
| M14 — Security + Testing | ⬜ Pending | — |
| M15 — Production Deployment | ⬜ Pending | — |
