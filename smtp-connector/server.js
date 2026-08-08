/**
 * server.js
 * Express API entry point.
 * Milestone 8
 */

require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Authenticated routes
app.use('/send', require('./middleware/auth'));
app.use('/send', require('./routes/send'));

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`SMTP Connector listening on port ${PORT}`);
});
