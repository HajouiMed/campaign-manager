/**
 * Utils.gs
 * Helpers, validators, formatters, and shared utilities.
 * Milestone 3
 */

function generateId(prefix) {
  return prefix + '_' + Utilities.getUuid().replace(/-/g, '').substring(0, 16);
}

function nowIso() {
  return new Date().toISOString();
}

function logEvent(level, source, message, details) {
  const sheet = getSheet(SHEET_NAMES.LOGS);
  sheet.appendRow([nowIso(), level, source, message, JSON.stringify(details || {})]);
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function sanitizeHtml(html) {
  // Basic sanitization — expand in Milestone 14
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

function createJsonResponse(data, statusCode) {
  statusCode = statusCode || 200;
  const output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  // Note: setResponseCode requires advanced handling in doPost/doGet
  return output;
}
