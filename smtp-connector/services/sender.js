/**
 * services/sender.js
 * Nodemailer execution engine.
 * Milestone 8 + 10
 */

const nodemailer = require('nodemailer');
const smtpPool = require('./smtpPool');
const retry = require('./retry');

async function sendSingle(job) {
  const { smtp_config, to, from, subject, html, text } = job;

  const transporter = nodemailer.createTransport({
    host: smtp_config.host,
    port: smtp_config.port,
    secure: smtp_config.encryption === 'ssl',
    auth: {
      user: smtp_config.user,
      pass: smtp_config.pass
    },
    tls: smtp_config.encryption === 'tls' ? { rejectUnauthorized: true } : undefined
  });

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text
    });

    return {
      job_id: job.job_id,
      status: 'success',
      smtp_response: info.response,
      error: null
    };
  } catch (err) {
    // Classify error
    let status = 'temporary_failure';
    if (err.code === 'EAUTH') status = 'authentication_error';
    else if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') status = 'connection_error';
    else if (err.responseCode >= 500) status = 'permanent_failure';

    return {
      job_id: job.job_id,
      status,
      smtp_response: null,
      error: err.message
    };
  }
}

async function sendBatch(jobs) {
  // TODO: Implement controlled concurrency in Milestone 8
  // For now, sequential execution
  const results = [];
  for (const job of jobs) {
    const result = await sendSingle(job);
    results.push(result);
  }
  return results;
}

module.exports = { sendSingle, sendBatch };
