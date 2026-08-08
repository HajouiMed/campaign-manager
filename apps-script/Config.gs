/**
 * Config.gs
 * Constants, sheet names, and global configuration.
 * Milestone 3
 */

const SHEET_NAMES = {
  SETTINGS: 'SETTINGS',
  COUNTRIES: 'COUNTRIES',
  CONTACTS: 'CONTACTS',
  SMTPS: 'SMTPS',
  SMTP_POOLS: 'SMTP_POOLS',
  CAMPAIGNS: 'CAMPAIGNS',
  CAMPAIGN_QUEUE: 'CAMPAIGN_QUEUE',
  EVENTS: 'EVENTS',
  UNSUBSCRIBES: 'UNSUBSCRIBES',
  BOUNCES: 'BOUNCES',
  LOGS: 'LOGS'
};

const CONTACT_STATUS = {
  FRESH: 'fresh',
  OPEN: 'open',
  CLICK: 'click',
  LEAD: 'lead',
  UNSUBSCRIBED: 'unsubscribed'
};

const CAMPAIGN_STATUS = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  RUNNING: 'running',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

const JOB_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SENT: 'sent',
  FAILED: 'failed'
};

const EVENT_TYPES = {
  OPEN: 'open',
  CLICK: 'click',
  UNSUBSCRIBE: 'unsubscribe',
  LEAD: 'lead'
};

const COUNTRY_OTHERS = 'OTHERS';

function getSpreadsheet() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  return SpreadsheetApp.openById(id);
}

function getSheet(name) {
  return getSpreadsheet().getSheetByName(name);
}
