/**
 * models/jobSchema.js
 * Job validation for /send endpoint.
 * Milestone 8
 */

function validate(job) {
  if (!job.job_id) return 'job_id required';
  if (!job.to || !job.to.includes('@')) return 'valid to email required';
  if (!job.from) return 'from required';
  if (!job.subject) return 'subject required';
  if (!job.smtp_id) return 'smtp_id required';
  if (!job.smtp_config) return 'smtp_config required';
  if (!job.smtp_config.host) return 'smtp_config.host required';
  if (!job.smtp_config.port) return 'smtp_config.port required';
  if (!job.smtp_config.user) return 'smtp_config.user required';
  if (!job.smtp_config.pass) return 'smtp_config.pass required';
  return null;
}

module.exports = { validate };
