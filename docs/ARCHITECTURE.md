# Architecture

## Overview

This application is a legitimate, permission-based email campaign management platform built with a strict separation of concerns across four layers.

## Diagram

```
┌─────────────┐      HTTPS       ┌─────────────────────┐
│   NETLIFY   │ ◄──────────────► │   GOOGLE APPS       │
│  Dashboard  │                  │   SCRIPT (Backend)  │
│  (Static)   │                  │   • API Endpoints   │
└─────────────┘                  │   • Auth/Logic      │
                                 │   • Sheet Ops       │
                                 │   • Queue Mgmt      │
                                 │   • Tracking        │
                                 └──────────┬──────────┘
                                            │ HTTPS
                                            ▼
                                 ┌─────────────────────┐
                                 │   GOOGLE SHEETS     │
                                 │   (Database)        │
                                 │   • CONTACTS        │
                                 │   • CAMPAIGNS       │
                                 │   • CAMPAIGN_QUEUE  │
                                 │   • EVENTS          │
                                 │   • SMTPS           │
                                 │   • COUNTRIES       │
                                 └──────────┬──────────┘
                                            │ Send Jobs
                                            ▼
                                 ┌─────────────────────┐
                                 │   UBUNTU 24 SERVER  │
                                 │   Node.js LTS       │
                                 │   SMTP Connector    │
                                 │   • Authenticated   │
                                 │   • Queue Execution │
                                 │   • Retry Logic     │
                                 └──────────┬──────────┘
                                            │
                              ┌─────────────┼─────────────┐
                              ▼             ▼             ▼
                          ┌───────┐    ┌───────┐    ┌───────┐
                          │SMTP 1 │    │SMTP 2 │    │SMTP N │
                          └───────┘    └───────┘    └───────┘
                              │             │             │
                              └─────────────┴─────────────┘
                                            ▼
                                      Recipients
                                            │
                              ┌─────────────┴─────────────┐
                              ▼             ▼             ▼
                         Open Pixel    Click URL    Unsubscribe URL
                              │             │             │
                              └─────────────┴─────────────┘
                                            ▼
                                   Tracking Events → Sheets
```

## Layer Responsibilities

### 1. Frontend (Netlify)
- Static HTML/CSS/JS dashboard
- Desktop-first, mobile-friendly
- Communicates ONLY with Google Apps Script
- Never handles SMTP credentials
- No build step required (vanilla JS)

### 2. Google Apps Script (Main Backend)
- **API Router**: `doGet` / `doPost` Web App
- **Authentication**: API key validation, CORS
- **Business Logic**: Campaign management, contact states, country logic
- **Database Operations**: All Google Sheets CRUD
- **Queue Management**: Creates send jobs in `CAMPAIGN_QUEUE`
- **Tracking Handlers**: Open pixel, click redirect, unsubscribe
- **Statistics**: Dashboard and campaign analytics
- **SMTP Orchestration**: Sends job batches to Node.js connector

### 3. Google Sheets (Database)
Single spreadsheet. All data lives here. Canonical sheets:

| Sheet | Purpose |
|-------|---------|
| SETTINGS | Global configuration (secrets, URLs, limits) |
| COUNTRIES | Configured countries (dynamic) |
| CONTACTS | **Canonical source of truth** for all contacts |
| SMTPS | Authorized SMTP credentials (passwords secured) |
| SMTP_POOLS | Pool definitions (references SMTPS by ID) |
| CAMPAIGNS | Campaign definitions and aggregate stats |
| CAMPAIGN_QUEUE | Send jobs awaiting/processing/completed |
| EVENTS | Tracking events (open, click, unsubscribe, lead) |
| UNSUBSCRIBES | Suppression log |
| BOUNCES | Bounce tracking |
| LOGS | System audit trail |

### 4. Node.js SMTP Connector (Ubuntu 24)
- **ONLY** responsibility: authenticated SMTP execution
- Receives job batches from Apps Script
- Rotates through SMTP pool
- Handles temporary/permanent failures
- Returns structured results
- **NO** database, **NO** campaign logic, **NO** contact management

## Communication Flows

### Frontend → Apps Script
```
POST https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec
Headers:
  X-API-Key: {SECRET}
  Content-Type: application/json
Body:
  { action: "createCampaign", payload: { ... } }
```

### Apps Script → Google Sheets
Direct `SpreadsheetApp` API calls.

### Apps Script → Node.js
```
POST https://{UBUNTU_IP}:3000/send
Headers:
  X-Connector-Key: {SECRET}
  Content-Type: application/json
Body:
  {
    jobs: [
      {
        job_id: "...",
        to: "...",
        from: "...",
        subject: "...",
        html: "...",
        text: "...",
        smtp_id: "...",
        smtp_config: { host, port, user, pass, encryption }
      }
    ]
  }
```

### Tracking → Apps Script
```
GET https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec?action=trackOpen&token={JWT}
GET https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec?action=trackClick&token={JWT}
GET https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec?action=unsubscribe&token={JWT}
```

## Security Model

| Layer | Security Measure |
|-------|-----------------|
| Frontend → Apps Script | API key in header, CORS restricted |
| Apps Script → Sheets | Google-native auth (no exposed credentials) |
| Apps Script → Node.js | API key in header, HTTPS required |
| Node.js → SMTP | Standard SMTP auth (TLS/SSL) |
| SMTP passwords | Stored in Sheets, never exposed to frontend |
| Tracking tokens | JWT-style signed tokens with expiry |
| Input validation | Server-side in Apps Script |
| Rate limiting | Basic per-endpoint limits |

## Contact State Machine

```
Fresh ──open──► Open ──click──► Click ──lead──► Lead
  │
  └── unsubscribe ──► Unsubscribed (terminal, suppress)
```

- States are mutually exclusive (no duplication across states)
- `country` and `status` are completely independent
- `OTHERS` is a fallback country container

## Country / OTHERS Logic

1. Contacts imported with unknown country → `country=OTHERS`, `detected_country={original}`
2. Tracking detects new country:
   - If country exists in COUNTRIES → `country={detected}`
   - If not → `country=OTHERS`, `detected_country={detected}`
3. Status is NEVER modified during country changes
4. Admin can create new country and migrate matching OTHERS contacts

## File Structure

```
campaign-manager/
├── frontend/
│   ├── index.html
│   ├── css/main.css
│   └── js/
│       ├── app.js
│       ├── api.js
│       ├── dashboard.js
│       ├── campaigns.js
│       ├── contacts.js
│       ├── lists.js
│       ├── smtp.js
│       ├── tracking.js
│       └── utils.js
├── apps-script/
│   ├── Code.gs
│   ├── Config.gs
│   ├── Auth.gs
│   ├── Utils.gs
│   ├── Countries.gs
│   ├── Contacts.gs
│   ├── Lists.gs
│   ├── Smtps.gs
│   ├── Campaigns.gs
│   ├── Queue.gs
│   ├── Sender.gs
│   ├── Tracking.gs
│   ├── Stats.gs
│   └── WebApp.gs
├── smtp-connector/
│   ├── package.json
│   ├── .env.example
│   ├── server.js
│   ├── config.js
│   ├── middleware/auth.js
│   ├── routes/send.js
│   ├── services/smtpPool.js
│   ├── services/sender.js
│   ├── services/retry.js
│   └── models/jobSchema.js
└── docs/
    ├── ARCHITECTURE.md
    ├── INSTALLATION.md
    ├── API.md
    ├── PROGRESS.md
    └── CHANGELOG.md
```
