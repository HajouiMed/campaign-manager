/**
 * middleware/auth.js
 * API key authentication for Apps Script → Node.js requests.
 * Milestone 8 + 14
 */

const config = require('../config');

module.exports = (req, res, next) => {
  const key = req.headers['x-connector-key'];

  if (!key || key !== config.connectorSecret) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  // Optional IP whitelist check
  if (config.allowedIps.length > 0) {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (!config.allowedIps.includes(clientIp)) {
      return res.status(403).json({ success: false, error: 'IP not allowed' });
    }
  }

  next();
};
