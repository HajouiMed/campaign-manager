# Installation Guide

> **Status**: In Progress — Milestone 2
> This document is updated incrementally as milestones complete.

## Prerequisites

- Google Account (for Sheets + Apps Script)
- Netlify Account (free tier sufficient)
- Ubuntu 24 Server (VPS or local)
- Domain name (for tracking URLs — optional but recommended)

---

## Phase Overview

| Phase | Task | Milestone |
|-------|------|-----------|
| 1 | Create project structure | M1 |
| 2 | Create Google Spreadsheet | M2 |
| 3 | Create all sheets/headers | M2 |
| 4 | Create Google Apps Script | M3 |
| 5 | Deploy Apps Script Web App | M3 |
| 6 | Prepare Ubuntu 24 | M8 |
| 7 | Install Node.js LTS | M8 |
| 8 | Install SMTP connector | M8 |
| 9 | Configure environment variables | M8 |
| 10 | Configure Node.js API auth | M8 |
| 11 | Deploy Netlify frontend | M6 |
| 12 | Connect Netlify -> Apps Script | M6 |
| 13 | Connect Apps Script -> Node.js | M8 |
| 14 | Add first authorized SMTP | M7 |
| 15 | Create first country | M4 |
| 16 | Import test CSV | M5 |
| 17 | Create test campaign | M9 |
| 18 | Send small authorized test | M10 |
| 19 | Verify SMTP response | M10 |
| 20 | Verify campaign statistics | M13 |
| 21 | Verify open tracking | M11 |
| 22 | Verify click tracking | M11 |
| 23 | Verify unsubscribe | M11 |
| 24 | Verify state transitions | M11 |
| 25 | Verify country tracking | M12 |
| 26 | Verify OTHERS behavior | M12 |
| 27 | Create Morocco + migrate | M12 |
| 28 | Production configuration | M15 |

---

## Phase 1: Project Structure (M1) — COMPLETE

Done. Repository created at: https://github.com/HajouiMed/campaign-manager

---

## Phase 2: Create Google Spreadsheet (M2)

### Step 2.1 — Create the Spreadsheet

1. Open [sheets.new](https://sheets.new) in your browser
2. Name it: **Campaign Manager Database**
3. Note the Spreadsheet ID from the URL:
   - URL looks like: `https://docs.google.com/spreadsheets/d/1ABC123xyz.../edit`
   - Copy the long string between `/d/` and `/edit`
   - **Save this ID** — you will need it in Milestone 3

### Step 2.2 — Run the Setup Script

1. In your spreadsheet, click **Extensions -> Apps Script**
2. A new tab opens with the Apps Script editor
3. Delete any default code in the editor
4. Open the file `apps-script/Setup.gs` from this repository
5. Copy the entire contents
6. Paste into the Apps Script editor
7. Click the **Run** button (▶) next to `runSetup`
8. When prompted, click **Review Permissions** and allow
9. Wait for execution to complete
10. Return to your spreadsheet — all 11 sheets should now appear

### Step 2.3 — Verify the Sheets

Your spreadsheet should now contain these sheets:

| Sheet | Headers | Initial Data |
|-------|---------|-------------|
| SETTINGS | key, value, description | SPREADSHEET_ID, API_SECRET, CONNECTOR_SECRET, etc. |
| COUNTRIES | country_id, name, code, status, created_at | OTHERS (system fallback) |
| CONTACTS | contact_id, email, name, country, detected_country, status, created_at, last_sent_at, last_open_at, last_click_at, lead_at, unsubscribe_at, campaign_count | Empty |
| SMTPS | smtp_id, provider_name, host, port, username, password, encryption, daily_limit, status, created_at | Empty |
| SMTP_POOLS | pool_id, name, smtp_ids, created_at | Empty |
| CAMPAIGNS | campaign_id, name, country, state, smtp_pool_id, from_name, from_email, reply_to, subject, content_type, body, sort, start_from, limit, total_recipients, sent, delivered, failed, opens, clicks, unsubscribes, status, created_at, started_at, completed_at | Empty |
| CAMPAIGN_QUEUE | job_id, campaign_id, contact_id, smtp_id, status, attempts, smtp_response, created_at, started_at, completed_at, error | Empty |
| EVENTS | event_id, campaign_id, contact_id, event_type, timestamp, ip, user_agent, country_detected | Empty |
| UNSUBSCRIBES | contact_id, email, campaign_id, unsubscribed_at, source | Empty |
| BOUNCES | contact_id, email, campaign_id, bounce_type, smtp_response, timestamp | Empty |
| LOGS | timestamp, level, source, message, details | Empty |

### Step 2.4 — Secure Your Secrets

1. Open the **SETTINGS** sheet
2. Find the row with `API_SECRET`
3. Replace the auto-generated value with your own strong secret (min 32 characters)
4. Find the row with `CONNECTOR_SECRET`
5. Replace with a different strong secret (min 32 characters)
6. **Never share these secrets**

### Step 2.5 — Save the Spreadsheet ID

- The Spreadsheet ID is already in SETTINGS
- Also save it somewhere safe — you need it for M3

---

## Phase 3: Create Google Apps Script (M3)

> **Next**: See Milestone 3 instructions.

*(Remaining phases documented as milestones complete)*

---

## Environment Variables Reference

### Google Apps Script (Script Properties)

| Property | Description |
|----------|-------------|
| `API_SECRET` | Frontend -> Apps Script auth key |
| `CONNECTOR_SECRET` | Apps Script -> Node.js auth key |
| `SPREADSHEET_ID` | Google Sheets database ID |
| `NODE_CONNECTOR_URL` | Ubuntu server URL |
| `TRACKING_DOMAIN` | Domain for tracking URLs |

### Node.js SMTP Connector (.env)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `CONNECTOR_SECRET` | Must match Apps Script |
| `NODE_ENV` | `development` or `production` |

### Netlify (Build Environment)

| Variable | Description |
|----------|-------------|
| `APPS_SCRIPT_URL` | Deployed Apps Script Web App URL |
| `API_SECRET` | Must match Apps Script |
