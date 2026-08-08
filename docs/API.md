# API Reference

> **Status**: In Progress — Milestone 1
> Endpoints documented as they are implemented.

## Base URL

```
https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec
```

## Authentication

All requests must include:

```
Header: X-API-Key: {API_SECRET}
```

## Request Format

```json
{
  "action": "endpointName",
  "payload": { ... }
}
```

## Response Format

```json
{
  "success": true|false,
  "data": { ... },
  "error": "message" // only if success=false
}
```

---

## Endpoints

### Countries

*(Milestone 4)*

| Action | Method | Description |
|--------|--------|-------------|
| `getCountries` | POST | List all countries |
| `createCountry` | POST | Add new country |
| `updateCountry` | POST | Edit country |
| `toggleCountry` | POST | Enable/disable |
| `migrateOthers` | POST | Move OTHERS contacts to new country |

### Contacts

*(Milestone 5)*

| Action | Method | Description |
|--------|--------|-------------|
| `getContacts` | POST | List/filter contacts |
| `importCsv` | POST | Bulk import from CSV |
| `updateContact` | POST | Edit contact |
| `deleteContact` | POST | Remove contact |

### Campaigns

*(Milestone 9)*

| Action | Method | Description |
|--------|--------|-------------|
| `getCampaigns` | POST | List campaigns |
| `createCampaign` | POST | Create new campaign |
| `updateCampaign` | POST | Edit draft campaign |
| `startCampaign` | POST | Begin sending |
| `pauseCampaign` | POST | Pause sending |
| `stopCampaign` | POST | Stop and finalize |
| `getCampaignStats` | POST | Detailed statistics |
| `duplicateCampaign` | POST | Clone existing campaign |
| `deleteCampaign` | POST | Remove campaign |

### SMTP

*(Milestone 7)*

| Action | Method | Description |
|--------|--------|-------------|
| `getSmtps` | POST | List SMTP accounts (no passwords) |
| `createSmtp` | POST | Add SMTP account |
| `updateSmtp` | POST | Edit SMTP account |
| `deleteSmtp` | POST | Remove SMTP account |
| `getPools` | POST | List SMTP pools |
| `createPool` | POST | Create pool |
| `updatePool` | POST | Edit pool |
| `deletePool` | POST | Remove pool |

### Tracking (Public GET)

*(Milestone 11)*

| Action | Method | Description |
|--------|--------|-------------|
| `trackOpen` | GET | 1x1 pixel — records open |
| `trackClick` | GET | Redirect — records click then forwards |
| `unsubscribe` | GET | Unsubscribe page + confirmation |

### Dashboard

*(Milestone 13)*

| Action | Method | Description |
|--------|--------|-------------|
| `getDashboardStats` | POST | Summary cards and charts |
| `getCountrySummary` | POST | Per-country breakdown |

---

## Node.js Connector API

### POST /send

**Auth**: `X-Connector-Key: {SECRET}`

**Request:**
```json
{
  "jobs": [
    {
      "job_id": "uuid",
      "to": "recipient@example.com",
      "from": "Sender <sender@example.com>",
      "subject": "Hello",
      "html": "<html>...</html>",
      "text": "Plain text...",
      "smtp_id": "smtp_001",
      "smtp_config": {
        "host": "smtp.example.com",
        "port": 587,
        "user": "user",
        "pass": "pass",
        "encryption": "tls"
      }
    }
  ]
}
```

**Response:**
```json
{
  "results": [
    {
      "job_id": "uuid",
      "status": "success|temporary_failure|permanent_failure|auth_error|connection_error",
      "smtp_response": "250 OK",
      "error": null
    }
  ]
}
```
