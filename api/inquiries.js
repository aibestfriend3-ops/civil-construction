/**
 * Civil Construction Service — Vercel Serverless Function
 * Handles GET / POST /api/inquiries automatically when deployed to Vercel.
 */

'use strict';

const {
  parseSubmissionBody,
  validateInquiry,
  buildInquiryRecord,
  forwardEmailIfConfigured,
} = require('../lib/inquiry-validator');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    res.status(200).json({
      ok: true,
      message:
        'Civil Construction Service active inquiry endpoint. Submit requests via POST /api/inquiries.',
    });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, message: 'Method Not Allowed' });
    return;
  }

  const parsed = parseSubmissionBody(req.body, req.headers['content-type']);
  if (!parsed.ok) {
    res.status(400).json({
      ok: false,
      message: 'Invalid request body. Send JSON or URL-encoded form fields.',
      errors: {},
    });
    return;
  }

  const result = validateInquiry(parsed.data);

  if (result.isBot) {
    res.status(200).json({
      ok: true,
      referenceId: `CC-${new Date().getFullYear()}-0000`,
      message: 'Submission received.',
    });
    return;
  }

  if (Object.keys(result.errors).length > 0) {
    res.status(400).json({
      ok: false,
      message: 'Please review the highlighted fields before submitting.',
      errors: result.errors,
    });
    return;
  }

  const record = buildInquiryRecord(result.data);
  const delivery = await forwardEmailIfConfigured(record);

  res.status(201).json({
    ok: true,
    referenceId: record.referenceId,
    receivedAt: record.receivedAt,
    consent: record.consent,
    emailForwarded: delivery.forwarded,
    message: 'Inquiry received and logged for the Civil Construction Service owners.',
  });
};
