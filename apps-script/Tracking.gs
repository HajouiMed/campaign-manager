/**
 * Tracking.gs
 * Open pixel, click redirect, unsubscribe handling.
 * Milestone 3 + 11
 */

var Tracking = {
  
  // ─── Track Open (1x1 transparent pixel) ───
  trackOpen: function(e) {
    try {
      var token = e.parameter.token;
      if (!token) {
        return this._pixelResponse();
      }
      
      var decoded = this._decodeToken(token);
      if (!decoded) {
        return this._pixelResponse();
      }
      
      // Record event
      this._recordEvent(decoded.campaign_id, decoded.contact_id, EVENT_TYPES.OPEN, e);
      
      // Update contact status: fresh -> open
      this._updateContactStatus(decoded.contact_id, CONTACT_STATUS.OPEN, 'last_open_at');
      
      return this._pixelResponse();
    } catch (err) {
      Logger.log('trackOpen error: ' + err.message);
      return this._pixelResponse();
    }
  },
  
  // ─── Track Click (redirect) ───
  trackClick: function(e) {
    try {
      var token = e.parameter.token;
      var url = e.parameter.url;
      
      if (!token) {
        return this._redirectResponse(url || 'about:blank');
      }
      
      var decoded = this._decodeToken(token);
      if (!decoded) {
        return this._redirectResponse(url || 'about:blank');
      }
      
      // Record event
      this._recordEvent(decoded.campaign_id, decoded.contact_id, EVENT_TYPES.CLICK, e);
      
      // Update contact status: open -> click (or fresh -> click)
      this._updateContactStatus(decoded.contact_id, CONTACT_STATUS.CLICK, 'last_click_at');
      
      return this._redirectResponse(url || 'about:blank');
    } catch (err) {
      Logger.log('trackClick error: ' + err.message);
      return this._redirectResponse(url || 'about:blank');
    }
  },
  
  // ─── Unsubscribe ───
  unsubscribe: function(e) {
    try {
      var token = e.parameter.token;
      
      if (!token) {
        return this._htmlResponse('Invalid unsubscribe link');
      }
      
      var decoded = this._decodeToken(token);
      if (!decoded) {
        return this._htmlResponse('Invalid unsubscribe link');
      }
      
      // Record event
      this._recordEvent(decoded.campaign_id, decoded.contact_id, EVENT_TYPES.UNSUBSCRIBE, e);
      
      // Update contact status to unsubscribed
      this._updateContactStatus(decoded.contact_id, CONTACT_STATUS.UNSUBSCRIBED, 'unsubscribe_at');
      
      // Add to unsubscribes sheet
      var contact = findRowById(SHEET_NAMES.CONTACTS, 'contact_id', decoded.contact_id);
      if (contact) {
        appendRow(SHEET_NAMES.UNSUBSCRIBES, {
          contact_id: decoded.contact_id,
          email: contact.data.email,
          campaign_id: decoded.campaign_id,
          unsubscribed_at: nowIso(),
          source: 'tracking_link'
        });
      }
      
      return this._htmlResponse(
        '<h1>Unsubscribed</h1>' +
        '<p>You have been successfully unsubscribed. You will no longer receive emails from us.</p>'
      );
    } catch (err) {
      Logger.log('unsubscribe error: ' + err.message);
      return this._htmlResponse('An error occurred. Please contact support.');
    }
  },
  
  // ─── Generate Tracking Token ───
  generateTrackingToken: function(campaignId, contactId, type) {
    // Simple base64-encoded JSON token (not cryptographically secure JWT,
    // but sufficient for this use case. Upgrade to JWT in M14 if needed.)
    var payload = {
      campaign_id: campaignId,
      contact_id: contactId,
      type: type,
      ts: new Date().getTime()
    };
    return Utilities.base64Encode(JSON.stringify(payload));
  },
  
  // ─── Decode Token ───
  _decodeToken: function(token) {
    try {
      var json = Utilities.base64Decode(token, Utilities.Charset.UTF_8);
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  },
  
  // ─── Record Event ───
  _recordEvent: function(campaignId, contactId, eventType, e) {
    try {
      var ip = e.parameter.ip || '';
      var userAgent = e.parameter.ua || '';
      var countryDetected = e.parameter.country || '';
      
      appendRow(SHEET_NAMES.EVENTS, {
        event_id: generateId('event'),
        campaign_id: campaignId,
        contact_id: contactId,
        event_type: eventType,
        timestamp: nowIso(),
        ip: ip,
        user_agent: userAgent,
        country_detected: countryDetected
      });
    } catch (err) {
      Logger.log('Record event error: ' + err.message);
    }
  },
  
  // ─── Update Contact Status ───
  _updateContactStatus: function(contactId, newStatus, timestampField) {
    try {
      var found = findRowById(SHEET_NAMES.CONTACTS, 'contact_id', contactId);
      if (!found) return;
      
      var currentStatus = found.data.status;
      
      // Don't overwrite unsubscribed
      if (currentStatus === CONTACT_STATUS.UNSUBSCRIBED) return;
      
      // Only upgrade status (fresh -> open -> click -> lead)
      var statusOrder = [CONTACT_STATUS.FRESH, CONTACT_STATUS.OPEN, 
                         CONTACT_STATUS.CLICK, CONTACT_STATUS.LEAD];
      var currentIdx = statusOrder.indexOf(currentStatus);
      var newIdx = statusOrder.indexOf(newStatus);
      
      if (newIdx > currentIdx || currentStatus === CONTACT_STATUS.FRESH) {
        found.data.status = newStatus;
        if (timestampField) {
          found.data[timestampField] = nowIso();
        }
        updateRow(SHEET_NAMES.CONTACTS, found.rowIndex, found.data);
      }
    } catch (err) {
      Logger.log('Update contact status error: ' + err.message);
    }
  },
  
  // ─── 1x1 Pixel Response ───
  _pixelResponse: function() {
    var pixel = Utilities.base64Decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
    return ContentService.createTextOutput(pixel)
      .setMimeType(ContentService.MimeType.IMAGE);
  },
  
  // ─── Redirect Response ───
  _redirectResponse: function(url) {
    return ContentService.createTextOutput('<script>window.location.href="' + url + '";</script>')
      .setMimeType(ContentService.MimeType.HTML);
  },
  
  // ─── HTML Response ───
  _htmlResponse: function(html) {
    return ContentService.createTextOutput(
      '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>' + 
      html + '</body></html>'
    ).setMimeType(ContentService.MimeType.HTML);
  }
};