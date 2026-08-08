/**
 * Setup.gs
 * One-time script to initialize all sheets and headers.
 * 
 * HOW TO USE:
 * 1. Open your "Campaign Manager Database" spreadsheet
 * 2. Go to Extensions → Apps Script
 * 3. Delete any default code
 * 4. Paste this entire file into the editor
 * 5. Click the "Run" button (▶) next to "runSetup"
 * 6. Grant permissions when prompted
 * 7. Check your spreadsheet — all 11 sheets should appear
 * 8. After success, you can delete this script or leave it
 */

function runSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Define all sheets with their headers
  const sheetsConfig = {
    'SETTINGS': {
      headers: ['key', 'value', 'description'],
      data: [
        ['SPREADSHEET_ID', ss.getId(), 'Auto-populated spreadsheet ID'],
        ['API_SECRET', generateSecret(), 'Frontend -> Apps Script auth key (change this!)'],
        ['CONNECTOR_SECRET', generateSecret(), 'Apps Script -> Node.js auth key (change this!)'],
        ['NODE_CONNECTOR_URL', 'https://your-server.com:3000', 'Ubuntu SMTP connector URL'],
        ['TRACKING_DOMAIN', 'https://your-domain.com', 'Domain for tracking pixels/links'],
        ['MAX_BATCH_SIZE', '50', 'Max emails per batch to Node.js'],
        ['DEFAULT_FROM_NAME', 'Campaign Manager', 'Default sender name'],
        ['VERSION', '1.0.0', 'Application version']
      ]
    },
    'COUNTRIES': {
      headers: ['country_id', 'name', 'code', 'status', 'created_at'],
      data: [
        ['country_others', 'OTHERS', 'OT', 'active', nowIso()]
      ]
    },
    'CONTACTS': {
      headers: [
        'contact_id', 'email', 'name', 'country', 'detected_country',
        'status', 'created_at', 'last_sent_at', 'last_open_at',
        'last_click_at', 'lead_at', 'unsubscribe_at', 'campaign_count'
      ],
      data: []
    },
    'SMTPS': {
      headers: [
        'smtp_id', 'provider_name', 'host', 'port', 'username',
        'password', 'encryption', 'daily_limit', 'status', 'created_at'
      ],
      data: []
    },
    'SMTP_POOLS': {
      headers: ['pool_id', 'name', 'smtp_ids', 'created_at'],
      data: []
    },
    'CAMPAIGNS': {
      headers: [
        'campaign_id', 'name', 'country', 'state', 'smtp_pool_id',
        'from_name', 'from_email', 'reply_to', 'subject', 'content_type',
        'body', 'sort', 'start_from', 'limit', 'total_recipients',
        'sent', 'delivered', 'failed', 'opens', 'clicks', 'unsubscribes',
        'status', 'created_at', 'started_at', 'completed_at'
      ],
      data: []
    },
    'CAMPAIGN_QUEUE': {
      headers: [
        'job_id', 'campaign_id', 'contact_id', 'smtp_id', 'status',
        'attempts', 'smtp_response', 'created_at', 'started_at', 'completed_at', 'error'
      ],
      data: []
    },
    'EVENTS': {
      headers: [
        'event_id', 'campaign_id', 'contact_id', 'event_type',
        'timestamp', 'ip', 'user_agent', 'country_detected'
      ],
      data: []
    },
    'UNSUBSCRIBES': {
      headers: ['contact_id', 'email', 'campaign_id', 'unsubscribed_at', 'source'],
      data: []
    },
    'BOUNCES': {
      headers: [
        'contact_id', 'email', 'campaign_id', 'bounce_type',
        'smtp_response', 'timestamp'
      ],
      data: []
    },
    'LOGS': {
      headers: ['timestamp', 'level', 'source', 'message', 'details'],
      data: []
    }
  };

  // Create or clear each sheet
  for (const [sheetName, config] of Object.entries(sheetsConfig)) {
    let sheet = ss.getSheetByName(sheetName);

    if (sheet) {
      // Clear existing data but keep sheet
      sheet.clear();
    } else {
      // Create new sheet
      sheet = ss.insertSheet(sheetName);
    }

    // Set headers
    const headerRange = sheet.getRange(1, 1, 1, config.headers.length);
    headerRange.setValues([config.headers]);

    // Format headers: bold, background color, text color
    headerRange.setFontWeight('bold')
      .setBackground('#4285f4')
      .setFontColor('#ffffff');

    // Freeze header row
    sheet.setFrozenRows(1);

    // Add initial data if any
    if (config.data.length > 0) {
      const dataRange = sheet.getRange(2, 1, config.data.length, config.headers.length);
      dataRange.setValues(config.data);
    }

    // Auto-resize columns
    sheet.autoResizeColumns(1, config.headers.length);

    Logger.log('Sheet created: ' + sheetName);
  }

  // Delete the default "Sheet1" if it exists and is empty
  const defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet) {
    ss.deleteSheet(defaultSheet);
  }

  Logger.log('\nSetup complete! All 11 sheets initialized.');
  Logger.log('Spreadsheet ID: ' + ss.getId());
  Logger.log('\nIMPORTANT: Change the API_SECRET and CONNECTOR_SECRET in SETTINGS sheet!');
}

function generateSecret() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function nowIso() {
  return new Date().toISOString();
}
