/**
 * Civil Construction Service — Netlify Serverless Function
 * Routed from /api/inquiries via netlify.toml.
 */

'use strict';

const {
  parseSubmissionBody,
  validateInquiry,
  buildInquiryRecord,
  forwardEmailIfConfigured,
} = require('../../lib/inquiry-validator');

exports.handler = async function handler(event) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  };

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        message:
          'Civil Construction Service active inquiry endpoint. Submit requests via POST /api/inquiries.',
      }),
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, message: 'Method Not Allowed' }),
    };
  }

  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body || '', 'base64').toString('utf8')
    : event.body || '';
  const ct = (event.headers && (event.headers['content-type'] || event.headers['Content-Type'])) || '';
  const parsed = parseSubmissionBody(rawBody, ct);

  if (!parsed.ok) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        ok: false,
        message: 'Invalid request body. Send JSON or URL-encoded form fields.',
        errors: {},
      }),
    };
  }

  const result = validateInquiry(parsed.data);

  if (result.isBot) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        referenceId: `CC-${new Date().getFullYear()}-0000`,
        message: 'Submission received.',
      }),
    };
  }

  if (Object.keys(result.errors).length > 0) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        ok: false,
        message: 'Please review the highlighted fields before submitting.',
        errors: result.errors,
      }),
    };
  }

  const record = buildInquiryRecord(result.data);
  const delivery = await forwardEmailIfConfigured(record);

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({
      ok: true,
      referenceId: record.referenceId,
      receivedAt: record.receivedAt,
      consent: record.consent,
      emailForwarded: delivery.forwarded,
      message: 'Inquiry received and logged for the Civil Construction Service owners.',
    }),
  };
};
