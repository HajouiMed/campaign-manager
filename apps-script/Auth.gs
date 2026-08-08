/**
 * Auth.gs
 * API key validation, CORS headers, request authentication.
 * Milestone 3 + 14
 */

function validateApiKey(request) {
  const key = request.headers['X-API-Key'] || request.parameter.apiKey;
  const secret = PropertiesService.getScriptProperties().getProperty('API_SECRET');
  if (!key || key !== secret) {
    throw new Error('Unauthorized: Invalid API key');
  }
}

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    'Content-Type': 'application/json'
  };
}

function handleOptions() {
  return ContentService.createTextOutput('')
    .setResponseCode(204)
    .setHeaders(getCorsHeaders());
}
