/**
 * Queue.gs
 * Campaign queue creation, job management, status tracking.
 * Milestone 3 + 10
 */

var Queue = {
  
  // ─── Create Jobs for a Campaign ───
  createJobs: function(campaignId, contactIds, smtpPoolId) {
    try {
      var now = nowIso();
      var headers = [
        'job_id', 'campaign_id', 'contact_id', 'smtp_id', 'status',
        'attempts', 'smtp_response', 'created_at', 'started_at', 'completed_at', 'error'
      ];
      
      var batch = [];
      for (var i = 0; i < contactIds.length; i++) {
        batch.push({
          job_id: generateId('job'),
          campaign_id: campaignId,
          contact_id: contactIds[i],
          smtp_id: '', // assigned at send time
          status: JOB_STATUS.PENDING,
          attempts: 0,
          smtp_response: '',
          created_at: now,
          started_at: '',
          completed_at: '',
          error: ''
        });
        
        // Batch append every 50 to avoid timeout
        if (batch.length >= 50 || i === contactIds.length - 1) {
          var sheet = getSheet(SHEET_NAMES.CAMPAIGN_QUEUE);
          for (var j = 0; j < batch.length; j++) {
            appendRow(SHEET_NAMES.CAMPAIGN_QUEUE, batch[j], headers);
          }
          batch = [];
        }
      }
      
      logEvent('info', 'queue', 'Jobs created', { 
        campaign_id: campaignId, 
        count: contactIds.length 
      });
      
      return { success: true, count: contactIds.length };
    } catch (err) {
      logEvent('error', 'queue', 'createJobs failed', { error: err.message });
      return { success: false, error: err.message };
    }
  },
  
  // ─── Get Pending Jobs ───
  getPendingJobs: function(limit) {
    try {
      limit = limit || 50;
      var rows = getSheetData(SHEET_NAMES.CAMPAIGN_QUEUE, {
        filter: function(r) { return r.status === JOB_STATUS.PENDING; },
        limit: limit
      });
      return rows;
    } catch (err) {
      logEvent('error', 'queue', 'getPendingJobs failed', { error: err.message });
      return [];
    }
  },
  
  // ─── Update Job Status ───
  updateJobStatus: function(jobId, status, smtpResponse, error) {
    try {
      var found = findRowById(SHEET_NAMES.CAMPAIGN_QUEUE, 'job_id', jobId);
      if (!found) return false;
      
      found.data.status = status;
      found.data.smtp_response = smtpResponse || '';
      found.data.error = error || '';
      
      if (status === JOB_STATUS.PROCESSING) {
        found.data.started_at = nowIso();
        found.data.attempts = parseInt(found.data.attempts || 0, 10) + 1;
      }
      
      if (status === JOB_STATUS.SENT || status === JOB_STATUS.FAILED) {
        found.data.completed_at = nowIso();
      }
      
      updateRow(SHEET_NAMES.CAMPAIGN_QUEUE, found.rowIndex, found.data);
      return true;
    } catch (err) {
      logEvent('error', 'queue', 'updateJobStatus failed', { error: err.message });
      return false;
    }
  }
};