/**
 * Stats.gs
 * Dashboard statistics, campaign analytics, aggregations.
 * Milestone 3 + 13
 */

var Stats = {
  
  // ─── Get Dashboard Stats ───
  getDashboard: function(payload) {
    try {
      var contacts = getSheetData(SHEET_NAMES.CONTACTS);
      var campaigns = getSheetData(SHEET_NAMES.CAMPAIGNS);
      var countries = getSheetData(SHEET_NAMES.COUNTRIES);
      
      // Contact state counts
      var contactStats = {
        total: contacts.length,
        fresh: 0,
        open: 0,
        click: 0,
        lead: 0,
        unsubscribed: 0
      };
      
      for (var i = 0; i < contacts.length; i++) {
        var status = contacts[i].status;
        if (contactStats[status] !== undefined) {
          contactStats[status]++;
        }
      }
      
      // Campaign counts
      var activeCampaigns = 0;
      var completedCampaigns = 0;
      var totalSent = 0;
      var totalDelivered = 0;
      var totalFailed = 0;
      var totalOpens = 0;
      var totalClicks = 0;
      
      for (var i = 0; i < campaigns.length; i++) {
        var c = campaigns[i];
        if (c.status === CAMPAIGN_STATUS.RUNNING) activeCampaigns++;
        if (c.status === CAMPAIGN_STATUS.COMPLETED) completedCampaigns++;
        totalSent += parseInt(c.sent || 0, 10);
        totalDelivered += parseInt(c.delivered || 0, 10);
        totalFailed += parseInt(c.failed || 0, 10);
        totalOpens += parseInt(c.opens || 0, 10);
        totalClicks += parseInt(c.clicks || 0, 10);
      }
      
      return successResponse({
        contacts: contactStats,
        campaigns: {
          active: activeCampaigns,
          completed: completedCampaigns,
          total_sent: totalSent,
          total_delivered: totalDelivered,
          total_failed: totalFailed,
          total_opens: totalOpens,
          total_clicks: totalClicks
        },
        countries: {
          total: countries.length,
          active: countries.filter(function(c) { return c.status === 'active'; }).length
        }
      });
    } catch (err) {
      logEvent('error', 'stats', 'getDashboard failed', { error: err.message });
      return errorResponse('DASHBOARD_ERROR', 'Failed to fetch dashboard stats');
    }
  },
  
  // ─── Get Country Summary ───
  getCountrySummary: function(payload) {
    try {
      var countries = getSheetData(SHEET_NAMES.COUNTRIES);
      var contacts = getSheetData(SHEET_NAMES.CONTACTS);
      var result = [];
      
      for (var i = 0; i < countries.length; i++) {
        var country = countries[i];
        var countryContacts = contacts.filter(function(c) {
          return c.country === country.name;
        });
        
        var counts = { fresh: 0, open: 0, click: 0, lead: 0, unsubscribed: 0 };
        for (var j = 0; j < countryContacts.length; j++) {
          if (counts[countryContacts[j].status] !== undefined) {
            counts[countryContacts[j].status]++;
          }
        }
        
        result.push({
          country_id: country.country_id,
          name: country.name,
          code: country.code,
          status: country.status,
          total_contacts: countryContacts.length,
          counts: counts
        });
      }
      
      return successResponse({ countries: result });
    } catch (err) {
      logEvent('error', 'stats', 'getCountrySummary failed', { error: err.message });
      return errorResponse('COUNTRY_SUMMARY_ERROR', 'Failed to fetch country summary');
    }
  }
};