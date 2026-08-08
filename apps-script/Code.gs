/**
 * Code.gs
 * Main entry point and API router.
 * doGet / doPost dispatch to appropriate handlers.
 * Milestone 3
 */

function doGet(e) {
  try {
    const action = e.parameter.action;

    // Public tracking endpoints (no API key required)
    if (action === 'trackOpen') {
      return Tracking.trackOpen(e);
    }
    if (action === 'trackClick') {
      return Tracking.trackClick(e);
    }
    if (action === 'unsubscribe') {
      return Tracking.unsubscribe(e);
    }

    return createJsonResponse({ success: false, error: 'Unknown action' }, 400);
  } catch (err) {
    logEvent('error', 'apps-script', 'doGet error', { error: err.message });
    return createJsonResponse({ success: false, error: 'Internal error' }, 500);
  }
}

function doPost(e) {
  try {
    if (e.parameter.action === undefined && e.postData) {
      const payload = JSON.parse(e.postData.contents);
      e.parameter = payload;
    }

    const request = JSON.parse(e.postData.contents);
    validateApiKey(request);

    const action = request.action;
    const payload = request.payload || {};

    // Router
    switch (action) {
      // Countries (Milestone 4)
      case 'getCountries': return Countries.getAll();
      case 'createCountry': return Countries.create(payload);
      case 'updateCountry': return Countries.update(payload);
      case 'toggleCountry': return Countries.toggle(payload);
      case 'migrateOthers': return Countries.migrateOthers(payload);

      // Contacts (Milestone 5)
      case 'getContacts': return Contacts.getAll(payload);
      case 'importCsv': return Contacts.importCsv(payload);
      case 'updateContact': return Contacts.update(payload);
      case 'deleteContact': return Contacts.remove(payload);

      // SMTP (Milestone 7)
      case 'getSmtps': return Smtps.getAll();
      case 'createSmtp': return Smtps.create(payload);
      case 'updateSmtp': return Smtps.update(payload);
      case 'deleteSmtp': return Smtps.remove(payload);
      case 'getPools': return Smtps.getPools();
      case 'createPool': return Smtps.createPool(payload);
      case 'updatePool': return Smtps.updatePool(payload);
      case 'deletePool': return Smtps.deletePool(payload);

      // Campaigns (Milestone 9)
      case 'getCampaigns': return Campaigns.getAll(payload);
      case 'createCampaign': return Campaigns.create(payload);
      case 'updateCampaign': return Campaigns.update(payload);
      case 'startCampaign': return Campaigns.start(payload);
      case 'pauseCampaign': return Campaigns.pause(payload);
      case 'stopCampaign': return Campaigns.stop(payload);
      case 'getCampaignStats': return Campaigns.getStats(payload);
      case 'duplicateCampaign': return Campaigns.duplicate(payload);
      case 'deleteCampaign': return Campaigns.remove(payload);

      // Dashboard (Milestone 13)
      case 'getDashboardStats': return Stats.getDashboard();
      case 'getCountrySummary': return Stats.getCountrySummary();

      default:
        return createJsonResponse({ success: false, error: 'Unknown action: ' + action }, 400);
    }
  } catch (err) {
    logEvent('error', 'apps-script', 'doPost error', { error: err.message });
    return createJsonResponse({ success: false, error: 'Internal error' }, 500);
  }
}
