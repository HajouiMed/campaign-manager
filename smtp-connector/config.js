/**
 * config.js
 * Environment configuration loader.
 * Milestone 8
 */

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  connectorSecret: process.env.CONNECTOR_SECRET,
  allowedIps: process.env.ALLOWED_IPS ? process.env.ALLOWED_IPS.split(',') : []
};
