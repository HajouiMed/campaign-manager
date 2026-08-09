/**
 * Campaigns.gs
 * Campaign CRUD, lifecycle management, parameter validation.
 * Milestone 3 + 9
 */

var Campaigns = {
  
  // ─── Get All Campaigns ───
  getAll: function(payload) {
    try {
      payload = payload || {};
      var rows = getSheetData(SHEET_NAMES.CAMPAIGNS);
      
      // Filter by status
      if (payload.status) {
        rows = rows.filter(function(r) {
          return r.status === payload.status;
        });
      }
      
      // Sort by created_at desc
      rows.sort(function(a, b) {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      
      // Pagination
      var page = payload.page || 1;
      var limit = payload.limit || 20;
      var total = rows.length;
      var start = (page - 1) * limit;
      var paginated = rows.slice(start, start + limit);
      
      return successResponse({
        campaigns: paginated,
        total: total,
        page: page,
        limit: limit,
        pages: Math.ceil(total / limit)
      });
    } catch (err) {
      logEvent('error', 'campaigns', 'getAll failed', { error: err.message });
      return errorResponse('CAMPAIGNS_FETCH_ERROR', 'Failed to fetch campaigns');
    }
  },
  
  // ─── Create Campaign ───
  create: function(payload) {
    try {
      var required = ['name', 'country', 'state', 'smtp_pool_id', 'subject', 'body'];
      for (var i = 0; i < required.length; i++) {
        if (!payload[required[i]]) {
          return errorResponse('MISSING_FIELD', required[i] + ' is required');
        }
      }
      
      // Validate country exists
      var countries = getSheetData(SHEET_NAMES.COUNTRIES);
      var countryExists = false;
      for (var i = 0; i < countries.length; i++) {
        if (countries[i].name === payload.country) {
          countryExists = true;
          break;
        }
      }
      if (!countryExists) {
        return errorResponse('INVALID_COUNTRY', 'Country not found: ' + payload.country);
      }
      
      // Validate state
      var validStates = [CONTACT_STATUS.FRESH, CONTACT_STATUS.OPEN, CONTACT_STATUS.CLICK];
      if (validStates.indexOf(payload.state) === -1) {
        return errorResponse('INVALID_STATE', 'State must be fresh, open, or click');
      }
      
      // Validate sort based on state
      var validSorts = ['random'];
      if (payload.state === CONTACT_STATUS.OPEN) {
        validSorts = ['random', 'last_opened'];
      } else if (payload.state === CONTACT_STATUS.CLICK) {
        validSorts = ['random', 'last_clicked', 'last_opened'];
      }
      if (payload.sort && validSorts.indexOf(payload.sort) === -1) {
        return errorResponse('INVALID_SORT', 'Invalid sort for state ' + payload.state);
      }
      
      var campaignId = generateId('campaign');
      var now = nowIso();
      
      var rowData = {
        campaign_id: campaignId,
        name: sanitizeString(payload.name),
        country: payload.country,
        state: payload.state,
        smtp_pool_id: payload.smtp_pool_id,
        from_name: sanitizeString(payload.from_name || getSetting('DEFAULT_FROM_NAME') || 'Campaign Manager'),
        from_email: payload.from_email || '',
        reply_to: payload.reply_to || '',
        subject: sanitizeString(payload.subject),
        content_type: payload.content_type || 'html',
        body: sanitizeHtml(payload.body),
        sort: payload.sort || 'random',
        start_from: parseInt(payload.start_from || '0', 10),
        limit: parseInt(payload.limit || '0', 10),
        total_recipients: 0,
        sent: 0,
        delivered: 0,
        failed: 0,
        opens: 0,
        clicks: 0,
        unsubscribes: 0,
        status: CAMPAIGN_STATUS.DRAFT,
        created_at: now,
        started_at: '',
        completed_at: ''
      };
      
      appendRow(SHEET_NAMES.CAMPAIGNS, rowData);
      logEvent('info', 'campaigns', 'Campaign created', { campaign_id: campaignId });
      
      return successResponse({
        campaign: rowData,
        message: 'Campaign created successfully'
      });
    } catch (err) {
      logEvent('error', 'campaigns', 'create failed', { error: err.message });
      return errorResponse('CAMPAIGN_CREATE_ERROR', 'Failed to create campaign');
    }
  },
  
  // ─── Update Campaign (draft only) ───
  update: function(payload) {
    try {
      if (!payload.campaign_id) {
        return errorResponse('MISSING_ID', 'campaign_id is required');
      }
      
      var found = findRowById(SHEET_NAMES.CAMPAIGNS, 'campaign_id', payload.campaign_id);
      if (!found) {
        return errorResponse('NOT_FOUND', 'Campaign not found');
      }
      
      // Only allow editing drafts
      if (found.data.status !== CAMPAIGN_STATUS.DRAFT) {
        return errorResponse('INVALID_STATUS', 'Only draft campaigns can be edited');
      }
      
      var allowedFields = ['name', 'country', 'state', 'smtp_pool_id', 'from_name',
                           'from_email', 'reply_to', 'subject', 'content_type', 
                           'body', 'sort', 'start_from', 'limit'];
      for (var i = 0; i < allowedFields.length; i++) {
        var field = allowedFields[i];
        if (payload[field] !== undefined) {
          found.data[field] = payload[field];
        }
      }
      
      updateRow(SHEET_NAMES.CAMPAIGNS, found.rowIndex, found.data);
      logEvent('info', 'campaigns', 'Campaign updated', { campaign_id: payload.campaign_id });
      
      return successResponse({ campaign: found.data });
    } catch (err) {
      logEvent('error', 'campaigns', 'update failed', { error: err.message });
      return errorResponse('CAMPAIGN_UPDATE_ERROR', 'Failed to update campaign');
    }
  },
  
  // ─── Start Campaign ───
  start: function(payload) {
    try {
      if (!payload.campaign_id) {
        return errorResponse('MISSING_ID', 'campaign_id is required');
      }
      
      var found = findRowById(SHEET_NAMES.CAMPAIGNS, 'campaign_id', payload.campaign_id);
      if (!found) {
        return errorResponse('NOT_FOUND', 'Campaign not found');
      }
      
      if (found.data.status !== CAMPAIGN_STATUS.DRAFT && 
          found.data.status !== CAMPAIGN_STATUS.PAUSED) {
        return errorResponse('INVALID_STATUS', 'Campaign must be draft or paused to start');
      }
      
      found.data.status = CAMPAIGN_STATUS.RUNNING;
      found.data.started_at = nowIso();
      
      updateRow(SHEET_NAMES.CAMPAIGNS, found.rowIndex, found.data);
      logEvent('info', 'campaigns', 'Campaign started', { campaign_id: payload.campaign_id });
      
      return successResponse({ 
        campaign: found.data,
        message: 'Campaign started'
      });
    } catch (err) {
      logEvent('error', 'campaigns', 'start failed', { error: err.message });
      return errorResponse('CAMPAIGN_START_ERROR', 'Failed to start campaign');
    }
  },
  
  // ─── Pause Campaign ───
  pause: function(payload) {
    try {
      if (!payload.campaign_id) {
        return errorResponse('MISSING_ID', 'campaign_id is required');
      }
      
      var found = findRowById(SHEET_NAMES.CAMPAIGNS, 'campaign_id', payload.campaign_id);
      if (!found) {
        return errorResponse('NOT_FOUND', 'Campaign not found');
      }
      
      if (found.data.status !== CAMPAIGN_STATUS.RUNNING) {
        return errorResponse('INVALID_STATUS', 'Only running campaigns can be paused');
      }
      
      found.data.status = CAMPAIGN_STATUS.PAUSED;
      updateRow(SHEET_NAMES.CAMPAIGNS, found.rowIndex, found.data);
      logEvent('info', 'campaigns', 'Campaign paused', { campaign_id: payload.campaign_id });
      
      return successResponse({ campaign: found.data, message: 'Campaign paused' });
    } catch (err) {
      logEvent('error', 'campaigns', 'pause failed', { error: err.message });
      return errorResponse('CAMPAIGN_PAUSE_ERROR', 'Failed to pause campaign');
    }
  },
  
  // ─── Stop Campaign ───
  stop: function(payload) {
    try {
      if (!payload.campaign_id) {
        return errorResponse('MISSING_ID', 'campaign_id is required');
      }
      
      var found = findRowById(SHEET_NAMES.CAMPAIGNS, 'campaign_id', payload.campaign_id);
      if (!found) {
        return errorResponse('NOT_FOUND', 'Campaign not found');
      }
      
      found.data.status = CAMPAIGN_STATUS.COMPLETED;
      found.data.completed_at = nowIso();
      updateRow(SHEET_NAMES.CAMPAIGNS, found.rowIndex, found.data);
      logEvent('info', 'campaigns', 'Campaign stopped', { campaign_id: payload.campaign_id });
      
      return successResponse({ campaign: found.data, message: 'Campaign stopped' });
    } catch (err) {
      logEvent('error', 'campaigns', 'stop failed', { error: err.message });
      return errorResponse('CAMPAIGN_STOP_ERROR', 'Failed to stop campaign');
    }
  },
  
  // ─── Get Campaign Stats ───
  getStats: function(payload) {
    try {
      if (!payload.campaign_id) {
        return errorResponse('MISSING_ID', 'campaign_id is required');
      }
      
      var found = findRowById(SHEET_NAMES.CAMPAIGNS, 'campaign_id', payload.campaign_id);
      if (!found) {
        return errorResponse('NOT_FOUND', 'Campaign not found');
      }
      
      var c = found.data;
      var total = parseInt(c.sent || 0, 10);
      var delivered = parseInt(c.delivered || 0, 10);
      var opens = parseInt(c.opens || 0, 10);
      var clicks = parseInt(c.clicks || 0, 10);
      var unsubscribes = parseInt(c.unsubscribes || 0, 10);
      
      var stats = {
        campaign: c,
        rates: {
          delivery_rate: total > 0 ? ((delivered / total) * 100).toFixed(2) + '%' : '0%',
          open_rate: delivered > 0 ? ((opens / delivered) * 100).toFixed(2) + '%' : '0%',
          click_rate: delivered > 0 ? ((clicks / delivered) * 100).toFixed(2) + '%' : '0%',
          unsubscribe_rate: delivered > 0 ? ((unsubscribes / delivered) * 100).toFixed(2) + '%' : '0%'
        }
      };
      
      return successResponse(stats);
    } catch (err) {
      logEvent('error', 'campaigns', 'getStats failed', { error: err.message });
      return errorResponse('STATS_FETCH_ERROR', 'Failed to fetch campaign stats');
    }
  },
  
  // ─── Duplicate Campaign ───
  duplicate: function(payload) {
    try {
      if (!payload.campaign_id) {
        return errorResponse('MISSING_ID', 'campaign_id is required');
      }
      
      var found = findRowById(SHEET_NAMES.CAMPAIGNS, 'campaign_id', payload.campaign_id);
      if (!found) {
        return errorResponse('NOT_FOUND', 'Campaign not found');
      }
      
      var original = found.data;
      var newId = generateId('campaign');
      var now = nowIso();
      
      var rowData = {
        campaign_id: newId,
        name: original.name + ' (Copy)',
        country: original.country,
        state: original.state,
        smtp_pool_id: original.smtp_pool_id,
        from_name: original.from_name,
        from_email: original.from_email,
        reply_to: original.reply_to,
        subject: original.subject,
        content_type: original.content_type,
        body: original.body,
        sort: original.sort,
        start_from: original.start_from,
        limit: original.limit,
        total_recipients: 0,
        sent: 0,
        delivered: 0,
        failed: 0,
        opens: 0,
        clicks: 0,
        unsubscribes: 0,
        status: CAMPAIGN_STATUS.DRAFT,
        created_at: now,
        started_at: '',
        completed_at: ''
      };
      
      appendRow(SHEET_NAMES.CAMPAIGNS, rowData);
      logEvent('info', 'campaigns', 'Campaign duplicated', { 
        original: payload.campaign_id, 
        new: newId 
      });
      
      return successResponse({
        campaign: rowData,
        message: 'Campaign duplicated'
      });
    } catch (err) {
      logEvent('error', 'campaigns', 'duplicate failed', { error: err.message });
      return errorResponse('CAMPAIGN_DUPLICATE_ERROR', 'Failed to duplicate campaign');
    }
  },
  
  // ─── Remove Campaign ───
  remove: function(payload) {
    try {
      if (!payload.campaign_id) {
        return errorResponse('MISSING_ID', 'campaign_id is required');
      }
      
      var found = findRowById(SHEET_NAMES.CAMPAIGNS, 'campaign_id', payload.campaign_id);
      if (!found) {
        return errorResponse('NOT_FOUND', 'Campaign not found');
      }
      
      var sheet = getSheet(SHEET_NAMES.CAMPAIGNS);
      sheet.deleteRow(found.rowIndex);
      logEvent('info', 'campaigns', 'Campaign deleted', { campaign_id: payload.campaign_id });
      
      return successResponse({ message: 'Campaign deleted' });
    } catch (err) {
      logEvent('error', 'campaigns', 'remove failed', { error: err.message });
      return errorResponse('CAMPAIGN_DELETE_ERROR', 'Failed to delete campaign');
    }
  }
};