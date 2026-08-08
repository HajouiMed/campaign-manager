/**
 * Smtps.gs
 * SMTP account & pool management.
 * Passwords are NEVER returned to frontend.
 * Milestone 7
 */

const Smtps = {
  getAll: function() {
    // TODO: Implement in Milestone 7 (exclude passwords)
    return createJsonResponse({ success: true, data: [] });
  },

  create: function(payload) {
    // TODO: Implement in Milestone 7
    return createJsonResponse({ success: true, data: {} });
  },

  update: function(payload) {
    // TODO: Implement in Milestone 7
    return createJsonResponse({ success: true, data: {} });
  },

  remove: function(payload) {
    // TODO: Implement in Milestone 7
    return createJsonResponse({ success: true, data: {} });
  },

  getPools: function() {
    // TODO: Implement in Milestone 7
    return createJsonResponse({ success: true, data: [] });
  },

  createPool: function(payload) {
    // TODO: Implement in Milestone 7
    return createJsonResponse({ success: true, data: {} });
  },

  updatePool: function(payload) {
    // TODO: Implement in Milestone 7
    return createJsonResponse({ success: true, data: {} });
  },

  deletePool: function(payload) {
    // TODO: Implement in Milestone 7
    return createJsonResponse({ success: true, data: {} });
  }
};
