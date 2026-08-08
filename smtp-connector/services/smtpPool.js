/**
 * services/smtpPool.js
 * SMTP pool rotation and health tracking.
 * Milestone 8
 */

class SmtpPool {
  constructor() {
    this.pools = new Map();
    this.health = new Map(); // smtp_id -> { failures, lastUsed }
  }

  getNextSmtp(poolId, smtpConfigs) {
    // TODO: Implement round-robin rotation in Milestone 8
    // TODO: Implement health-based skipping
    return smtpConfigs[0];
  }

  recordResult(smtpId, success) {
    // TODO: Implement health tracking in Milestone 8
  }
}

module.exports = new SmtpPool();
