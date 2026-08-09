# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Milestone 3 — Google Apps Script Backend

**Added:**
- `apps-script/Config.gs` — Centralized configuration, sheet names, constants, spreadsheet access, settings reader
- `apps-script/Auth.gs` — API key validation for frontend, connector secret retrieval, CORS headers, basic rate limiting
- `apps-script/Utils.gs` — ID generation, timestamps, logging, email validation, HTML sanitization, JSON response helpers, spreadsheet CRUD helpers, safe JSON parse
- `apps-script/Code.gs` — Central API router with doGet (public tracking + health) and doPost (authenticated actions). Full action dispatch table.
- `apps-script/WebApp.gs` — Deployment documentation, getWebAppUrl helper, syncSettingsToProperties helper
- `apps-script/Countries.gs` — getAll, create, update, toggle, migrateOthers with full validation
- `apps-script/Lists.gs` — getAll with logical list aggregation (country + status counts, grand totals)
- `apps-script/Contacts.gs` — getAll with filtering/pagination, importCsv with duplicate/validation handling, update, remove
- `apps-script/Smtps.gs` — getAll (passwords excluded), create, update, remove, pool CRUD
- `apps-script/Campaigns.gs` — getAll, create, update, start, pause, stop, getStats, duplicate, remove with state/sort validation
- `apps-script/Queue.gs` — createJobs, getPendingJobs, updateJobStatus
- `apps-script/Sender.gs` — sendBatch to Node.js connector via UrlFetchApp
- `apps-script/Tracking.gs` — trackOpen (1x1 pixel), trackClick (redirect), unsubscribe (HTML page), token generation/decoding, event recording, contact status updates
- `apps-script/Stats.gs` — getDashboard (contact counts, campaign aggregates), getCountrySummary
- Consistent API response format: `{ success, data, error }`

**Security:**
- SMTP passwords never returned through API
- API secrets never exposed to frontend
- Safe logging (no credential leaks)
- Input validation on all endpoints
- HTML sanitization on campaign body

### Milestone 2 — Google Sheets Schema

**Added:**
- `apps-script/Setup.gs` — One-time initialization script that auto-creates all 11 database sheets
- Automatic header formatting (bold, blue background, frozen rows)
- Auto-generated `API_SECRET` and `CONNECTOR_SECRET` in SETTINGS
- Pre-populated `OTHERS` country in COUNTRIES sheet
- Auto-resize columns for readability

### Milestone 1 — Architecture + Project Structure

**Added:**
- Complete 4-layer architecture definition
- Project folder structure with all directories
- Comprehensive documentation
- Google Sheets schema definition (11 sheets)
- Contact state machine documentation
- Country/OTHERS fallback logic specification
- SMTP rotation and retry logic specification
- Security requirements checklist
- Development milestone roadmap (M1-M15)

---

## Milestone Roadmap

| Milestone | Status | Target |
|-----------|--------|--------|
| M1 — Architecture | Complete | 2026-08-08 |
| M2 — Google Sheets Schema | Complete | 2026-08-08 |
| M3 — Apps Script Backend | Complete | 2026-08-08 |
| M4 — Country/List Management | Pending | — |
| M5 — Contact Import + States | Pending | — |
| M6 — Netlify Dashboard | Pending | — |
| M7 — SMTP Manager | Pending | — |
| M8 — Node.js SMTP Connector | Pending | — |
| M9 — Campaign Creation | Pending | — |
| M10 — Campaign Queue + Sending | Pending | — |
| M11 — Tracking | Pending | — |
| M12 — Country Tracking + OTHERS | Pending | — |
| M13 — Campaign Statistics | Pending | — |
| M14 — Security + Testing | Pending | — |
| M15 — Production Deployment | Pending | — |