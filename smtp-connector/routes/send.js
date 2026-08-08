/**
 * routes/send.js
 * /send endpoint — receives job batches from Apps Script.
 * Milestone 8 + 10
 */

const express = require('express');
const router = express.Router();
const sender = require('../services/sender');
const jobSchema = require('../models/jobSchema');

router.post('/', async (req, res) => {
  try {
    const { jobs } = req.body;

    if (!Array.isArray(jobs) || jobs.length === 0) {
      return res.status(400).json({ success: false, error: 'Jobs array required' });
    }

    // Validate all jobs
    const validationErrors = [];
    for (const job of jobs) {
      const err = jobSchema.validate(job);
      if (err) validationErrors.push({ job_id: job.job_id, error: err });
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({ success: false, errors: validationErrors });
    }

    // Execute sends
    const results = await sender.sendBatch(jobs);

    res.json({ success: true, results });
  } catch (err) {
    console.error('Send batch error:', err);
    res.status(500).json({ success: false, error: 'Send failed' });
  }
});

module.exports = router;
