# Installation Guide

> **Status**: In Progress — Milestone 1
> This document is updated incrementally as milestones complete.

## Prerequisites

- Google Account (for Sheets + Apps Script)
- Netlify Account (free tier sufficient)
- Ubuntu 24 Server (VPS or local)
- Domain name (for tracking URLs — optional but recommended)
- Git

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
| 12 | Connect Netlify → Apps Script | M6 |
| 13 | Connect Apps Script → Node.js | M8 |
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

## Phase 1: Project Structure

### Step 1.1 — Clone Repository

```bash
git clone <repository-url>
cd campaign-manager
```

### Step 1.2 — Verify Structure

```bash
find . -type f | sort
```

Expected output should show all directories and placeholder files.

---

## Phase 2: Google Spreadsheet (Milestone 2)

> **Next**: See Milestone 2 instructions.

1. Open [Google Sheets](https://sheets.new)
2. Name it: `Campaign Manager Database`
3. Note the Spreadsheet ID from URL

---

## Phase 3: Create Sheets (Milestone 2)

> **Next**: See Milestone 2 instructions.

Create sheets with exact headers as defined in ARCHITECTURE.md.

---

*(Remaining phases documented as milestones complete)*

---

## Environment Variables Reference

### Google Apps Script (Script Properties)

| Property | Description |
|----------|-------------|
| `API_SECRET` | Frontend → Apps Script auth key |
| `CONNECTOR_SECRET` | Apps Script → Node.js auth key |
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
