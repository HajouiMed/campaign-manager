/**
 * Countries.gs
 * Country CRUD, OTHERS fallback, migration logic.
 * Milestone 4
 */

const Countries = {
  getAll: function() {
    // TODO: Implement in Milestone 4
    return createJsonResponse({ success: true, data: [] });
  },

  create: function(payload) {
    // TODO: Implement in Milestone 4
    return createJsonResponse({ success: true, data: {} });
  },

  update: function(payload) {
    // TODO: Implement in Milestone 4
    return createJsonResponse({ success: true, data: {} });
  },

  toggle: function(payload) {
    // TODO: Implement in Milestone 4
    return createJsonResponse({ success: true, data: {} });
  },

  migrateOthers: function(payload) {
    // TODO: Implement in Milestone 4 + 12
    return createJsonResponse({ success: true, data: {} });
  }
};
