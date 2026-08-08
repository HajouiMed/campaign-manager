# Campaign Manager

A professional, permission-based email campaign management platform.

## Architecture

```
Netlify (Frontend) → Google Apps Script (Backend) → Google Sheets (Database)
                                                          ↓
                                              Ubuntu 24 + Node.js (SMTP Connector)
```

- **Frontend**: Lightweight HTML/CSS/JS dashboard hosted on Netlify
- **Backend**: Google Apps Script (API, business logic, orchestration)
- **Database**: Google Sheets (canonical source of truth)
- **SMTP Layer**: Ubuntu 24 + Node.js LTS (authenticated SMTP execution only)

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Installation Guide](docs/INSTALLATION.md)
- [API Reference](docs/API.md)
- [Progress](docs/PROGRESS.md)
- [Changelog](docs/CHANGELOG.md)

## Status

**Current Milestone**: M1 — Architecture + Project Structure

See [docs/PROGRESS.md](docs/PROGRESS.md) for detailed status.

## License

Private — For authorized use only.
