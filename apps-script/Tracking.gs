/**
 * Tracking.gs
 * Open pixel, click redirect, unsubscribe handling.
 * Milestone 11
 */

const Tracking = {
  trackOpen: function(e) {
    // TODO: Implement in Milestone 11
    // Return 1x1 transparent GIF
    // Record event, update contact status fresh->open
  },

  trackClick: function(e) {
    // TODO: Implement in Milestone 11
    // Record click event, update contact status open->click
    // Redirect to original URL
  },

  unsubscribe: function(e) {
    // TODO: Implement in Milestone 11
    // Show confirmation page
    // On confirm: set status=unsubscribed, record in UNSUBSCRIBES
  },

  generateTrackingToken: function(campaignId, contactId, type) {
    // TODO: Implement in Milestone 11
    // JWT-style signed token
  }
};
