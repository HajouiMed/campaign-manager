/**
 * services/retry.js
 * Retry logic with exponential backoff.
 * Milestone 8
 */

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000;

function shouldRetry(status) {
  return status === 'temporary_failure' || status === 'connection_error';
}

function getDelay(attempt) {
  return BASE_DELAY_MS * Math.pow(2, attempt - 1);
}

module.exports = {
  MAX_RETRIES,
  shouldRetry,
  getDelay
};
