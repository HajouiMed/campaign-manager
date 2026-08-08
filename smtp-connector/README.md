# SMTP Connector

Authenticated SMTP execution layer for Campaign Manager.

## Responsibilities

- Receive authenticated job batches from Google Apps Script
- Connect to authorized SMTP servers
- Send emails with controlled rotation
- Return structured delivery results
- Handle temporary and permanent failures

## NOT Responsible For

- Campaign management
- Contact management
- Database operations
- Dashboard logic
- Tracking pixel serving

## Setup

```bash
cp .env.example .env
# Edit .env with real values
npm install
npm start
```

## API

### POST /send

Authenticated via `X-Connector-Key` header.

Request body:
```json
{
  "jobs": [
    {
      "job_id": "...",
      "to": "recipient@example.com",
      "from": "Sender <sender@example.com>",
      "subject": "...",
      "html": "...",
      "text": "...",
      "smtp_id": "smtp_001",
      "smtp_config": {
        "host": "smtp.example.com",
        "port": 587,
        "user": "username",
        "pass": "password",
        "encryption": "tls"
      }
    }
  ]
}
```
