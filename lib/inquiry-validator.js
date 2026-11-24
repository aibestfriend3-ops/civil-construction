/**
 * Civil Construction Service — Shared Inquiry Validation & Consent Record Builder
 * Used by server.js (Node), api/inquiries.js (Vercel), and netlify/functions/inquiries.js (Netlify).
 */

'use strict';

const crypto = require('node:crypto');

const VALID_SECTORS = new Set([
  'Site & Grading',
  'Concrete',
  'Drainage & Utilities',
  'Roads & Access',
  'General Inquiry',
  'Investment Opportunity',
  'Charity',
  'Charity Program',
  'Crypto Infrastructure',
  'Other',
]);

const VALID_BUDGETS = new Set([
  'Under $15,000',
  '$15,000 – $40,000',
  '$40,000 – $100,000',
  '$100,000+',
  'Not sure yet',
  'Not applicable',
]);

// Normalize hyphen vs en-dash in budget strings just in case a client alters dashes
function normalizeBudget(raw) {
  const s = String(raw || '').trim();
  if (VALID_BUDGETS.has(s)) return s;
  const withEnDash = s.replace(/\s*-\s*/g, ' – ');
  if (VALID_BUDGETS.has(withEnDash)) return withEnDash;
  return s;
}

function parseBoolField(val) {
  if (val === true) return true;
  if (typeof val === 'string') {
    const lower = val.trim().toLowerCase();
    return lower === 'true' || lower === 'on' || lower === '1' || lower === 'yes';
  }
  return false;
}

function parseSubmissionBody(rawBody, contentType = '') {
  if (rawBody && typeof rawBody === 'object' && !Array.isArray(rawBody)) {
    const copy = { ...rawBody };
    copy.licenseAccepted = parseBoolField(copy.licenseAccepted);
    copy.emailOptIn = parseBoolField(copy.emailOptIn);
    return { ok: true, data: copy };
  }

  const ct = String(contentType).toLowerCase();
  const trimmed = String(rawBody || '').trim();

  if (
    ct.includes('application/x-www-form-urlencoded') ||
    (!ct.includes('application/json') && trimmed.includes('=') && !trimmed.startsWith('{'))
  ) {
    const params = new URLSearchParams(rawBody || '');
    const obj = {};
    for (const [key, value] of params.entries()) {
      obj[key] = value;
    }
    obj.licenseAccepted = parseBoolField(obj.licenseAccepted);
    obj.emailOptIn = parseBoolField(obj.emailOptIn);
    return { ok: true, data: obj };
  }

  try {
    const parsed = JSON.parse(trimmed || '{}');
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      parsed.licenseAccepted = parseBoolField(parsed.licenseAccepted);
      parsed.emailOptIn = parseBoolField(parsed.emailOptIn);
      return { ok: true, data: parsed };
    }
    return { ok: false };
  } catch {
    return { ok: false };
  }
}

function validateInquiry(body) {
  const errors = {};
  const clean = (val, maxLen = 500) =>
    typeof val === 'string' ? val.trim().slice(0, maxLen) : '';

  const name = clean(body.name, 120);
  const organization = clean(body.organization, 140) || 'Residential / Local Property';
  const email = clean(body.email, 160).toLowerCase();
  const phone = clean(body.phone, 40);
  const sector = clean(body.sector, 80);
  const otherIntent = clean(body.otherIntent, 120);
  const budget = normalizeBudget(clean(body.budget, 80));
  const notes = clean(body.notes, 2000);
  const estimateSummary = clean(body.estimateSummary, 400);
  const honeypot = clean(body.website, 120);
  const licenseAccepted = parseBoolField(body.licenseAccepted);
  const emailOptIn = parseBoolField(body.emailOptIn);

  if (honeypot) {
    return { isBot: true, errors: {} };
  }

  if (name.length < 2) {
    errors.name = 'Please enter your full name (at least 2 characters).';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) {
    errors.phone = 'Please enter a valid phone number with at least 10 digits.';
  }

  if (!VALID_SECTORS.has(sector)) {
    errors.sector = 'Please select one of our inquiry topics or civil services.';
  }

  if (sector === 'Other' && otherIntent.length < 3) {
    errors.otherIntent = 'Please specify your intent (at least 3 characters).';
  }

  if (!VALID_BUDGETS.has(budget)) {
    errors.budget = 'Please select an approximate project budget range.';
  }

  if (notes.length < 20) {
    errors.notes = 'Please share at least 20 characters describing your location and details.';
  }

  if (!licenseAccepted) {
    errors.licenseAccepted =
      'You must review and accept the License Agreement & Terms before submitting.';
  }

  return {
    isBot: false,
    errors,
    data: {
      name,
      organization,
      email,
      phone,
      sector,
      otherIntent: sector === 'Other' ? otherIntent : '',
      budget,
      notes,
      estimateSummary,
      consent: {
        licenseAccepted,
        emailOptIn,
        agreementVersion: '2026.1',
        consentedAt: new Date().toISOString(),
      },
    },
  };
}

function buildInquiryRecord(validatedData) {
  const referenceId = `CC-${new Date().getFullYear()}-${crypto
    .randomInt(1000, 9999)
    .toString()}`;
  return {
    referenceId,
    receivedAt: new Date().toISOString(),
    ...validatedData,
  };
}

/**
 * Optional email forwarding via Resend if RESEND_API_KEY is configured in environment.
 */
async function forwardEmailIfConfigured(record) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || typeof fetch !== 'function') return { forwarded: false };

  const toEmail = process.env.INQUIRY_TO_EMAIL || 'hello@civilconstructionservice.com';
  const fromEmail = process.env.INQUIRY_FROM_EMAIL || 'inquiries@civilconstructionservice.com';
  const topicLabel =
    record.sector === 'Other' && record.otherIntent
      ? `Other (${record.otherIntent})`
      : record.sector;

  const textBody = [
    `New Website Inquiry — ${record.referenceId}`,
    `Received: ${record.receivedAt}`,
    `Name: ${record.name}`,
    `Homeowner / Organization: ${record.organization}`,
    `Email: ${record.email}`,
    `Phone: ${record.phone}`,
    `Topic / Service: ${topicLabel}`,
    `Budget: ${record.budget}`,
    record.estimateSummary ? `Attached Estimate: ${record.estimateSummary}` : null,
    `License Agreement: Accepted (Rev ${record.consent.agreementVersion})`,
    `Email Opt-In: ${record.consent.emailOptIn ? 'YES — Opted In' : 'No (Estimate reply only)'}`,
    '',
    'Project Details:',
    record.notes,
  ]
    .filter((line) => line !== null)
    .join('\n');

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: record.email,
        subject: `[${record.referenceId}] ${topicLabel} Inquiry from ${record.name}`,
        text: textBody,
      }),
    });
    return { forwarded: resp.ok };
  } catch {
    return { forwarded: false };
  }
}

module.exports = {
  parseBoolField,
  parseSubmissionBody,
  validateInquiry,
  buildInquiryRecord,
  forwardEmailIfConfigured,
};
