/**
 * Sender.gs
 * Communication with Node.js SMTP connector.
 * Sends job batches, receives results.
 * Milestone 3 + 10
 */

var Sender = {
  
  // ─── Send Batch to Node.js ───
  sendBatch: function(jobs) {
    try {
      if (!jobs || jobs.length === 0) {
        return { success: true, results: [] };
      }
      
      var connectorUrl = getScriptProperty('NODE_CONNECTOR_URL') || getSetting('NODE_CONNECTOR_URL');
      var connectorSecret = getConnectorSecret();
      
      if (!connectorUrl || !connectorSecret) {
        throw new Error('Connector not configured. Set NODE_CONNECTOR_URL and CONNECTOR_SECRET.');
      }
      
      // Build payload
      var payload = { jobs: jobs };
      
      var options = {
        method: 'post',
        contentType: 'application/json',
        headers: {
          'X-Connector-Key': connectorSecret
        },
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      };
      
      var response = UrlFetchApp.fetch(connectorUrl + '/send', options);
      var responseCode = response.getResponseCode();
      var responseText = response.getContentText();
      
      if (responseCode !== 200) {
        logEvent('error', 'sender', 'Connector error', { 
          code: responseCode, 
          body: responseText 
        });
        return { success: false, error: 'Connector returned ' + responseCode };
      }
      
      var result = safeJsonParse(responseText, { results: [] });
      return { success: true, results: result.results || [] };
      
    } catch (err) {
      logEvent('error', 'sender', 'sendBatch failed', { error: err.message });
      return { success: false, error: err.message };
    }
  }
};