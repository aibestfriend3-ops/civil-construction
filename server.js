/**
 * Civil Construction — Lightweight Static & Active Inquiry API Server
 * Zero external dependencies (Node.js 18+ / 24 LTS).
 * Serves website assets and handles validated POST /api/inquiries submissions
 * with License Agreement & Email Opt-In audit persistence.
 */

'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || '127.0.0.1';
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

const VALID_SECTORS = new Set([
  'Site & Grading',
  'Concrete',
  'Drainage & Utilities',
  'Roads & Access',
]);

const VALID_BUDGETS = new Set([
  'Under $15,000',
  '$15,000 – $40,000',
  '$40,000 – $100,000',
  '$100,000+',
  'Not sure yet',
]);

function ensureDataStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(INQUIRIES_FILE)) {
    fs.writeFileSync(INQUIRIES_FILE, '[]\n', 'utf8');
  }
}

function readInquiries() {
  ensureDataStore();
  try {
    const raw = fs.readFileSync(INQUIRIES_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function appendInquiry(record) {
  const existing = readInquiries();
  existing.push(record);
  fs.writeFileSync(INQUIRIES_FILE, `${JSON.stringify(existing, null, 2)}\n`, 'utf8');
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function readRequestBody(req, maxBytes = 64 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error('PAYLOAD_TOO_LARGE'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
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
  const budget = clean(body.budget, 80);
  const notes = clean(body.notes, 2000);
  const estimateSummary = clean(body.estimateSummary, 400);
  const honeypot = clean(body.website, 120);
  const licenseAccepted = body.licenseAccepted === true;
  const emailOptIn = body.emailOptIn === true;

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
    errors.sector = 'Please select one of our civil service categories.';
  }

  if (!VALID_BUDGETS.has(budget)) {
    errors.budget = 'Please select an approximate project budget range.';
  }

  if (notes.length < 20) {
    errors.notes = 'Please share at least 20 characters describing your location and project scope.';
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

function serveStatic(req, res, urlPath) {
  const safePath = urlPath === '/' ? 'index.html' : decodeURIComponent(urlPath).replace(/^[/\\]+/, '');
  const normalized = path.normalize(safePath).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.resolve(ROOT_DIR, normalized);
  const relPath = path.relative(ROOT_DIR, filePath);

  // Prevent escaping workspace root or reading server/data/dot files directly
  if (
    relPath.startsWith('..') ||
    path.isAbsolute(relPath) ||
    relPath === 'server.js' ||
    relPath === 'data' ||
    relPath.startsWith(`data${path.sep}`) ||
    relPath.split(path.sep).some((seg) => seg.startsWith('.'))
  ) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const isCode = ext === '.html' || ext === '.css' || ext === '.js';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Cache-Control': isCode ? 'no-cache' : 'public, max-age=300',
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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
  const ct = String(contentType).toLowerCase();
  const trimmed = String(rawBody || '').trim();

  if (ct.includes('application/x-www-form-urlencoded') || (!ct.includes('application/json') && trimmed.includes('=') && !trimmed.startsWith('{'))) {
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

function wantsHtmlResponse(req) {
  const accept = String(req.headers.accept || '').toLowerCase();
  const ct = String(req.headers['content-type'] || '').toLowerCase();
  if (accept.includes('application/json') && !accept.includes('text/html')) return false;
  return ct.includes('application/x-www-form-urlencoded') || accept.includes('text/html');
}

function sendHtmlResponse(res, statusCode, title, heading, bodyHtml) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)} — Civil Construction</title>
  <link rel="stylesheet" href="/styles.css?v=4" />
</head>
<body style="min-height:100vh;display:grid;place-items:center;padding:2rem;background:var(--surface-canvas);">
  <main style="max-width:620px;width:100%;background:var(--surface-elevated);border:1px solid var(--rule-light);border-top:4px solid var(--accent-ochre);padding:2.25rem;box-shadow:var(--shadow-card);">
    <img src="/assets/logo.svg" alt="Civil Construction" style="width:210px;height:auto;margin-bottom:1.5rem;" />
    <h1 style="font-family:var(--font-display);font-size:1.75rem;margin-bottom:0.75rem;">${escapeHtml(heading)}</h1>
    ${bodyHtml}
    <div style="margin-top:1.75rem;">
      <a href="/#contact" class="btn btn--primary btn--sm">&larr; Back to Civil Construction</a>
    </div>
  </main>
</body>
</html>`;
  res.writeHead(statusCode, {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Length': Buffer.byteLength(html),
    'Cache-Control': 'no-store',
  });
  res.end(html);
}

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && reqUrl.pathname === '/api/health') {
    const count = readInquiries().length;
    sendJson(res, 200, { status: 'ok', inquiriesLogged: count });
    return;
  }

  if (req.method === 'GET' && reqUrl.pathname === '/api/inquiries') {
    const count = readInquiries().length;
    sendJson(res, 200, {
      ok: true,
      message: 'Civil Construction active inquiry endpoint. Submit requests via POST /api/inquiries.',
      inquiriesLogged: count,
    });
    return;
  }

  if (req.method === 'POST' && reqUrl.pathname === '/api/inquiries') {
    const htmlMode = wantsHtmlResponse(req);
    try {
      const rawBody = await readRequestBody(req);
      const parsedBody = parseSubmissionBody(rawBody, req.headers['content-type']);

      if (!parsedBody.ok) {
        if (htmlMode) {
          sendHtmlResponse(
            res,
            400,
            'Invalid Submission',
            'We could not read your form submission.',
            '<p style="color:var(--ink-secondary);">Please return to the quote form and try submitting again.</p>'
          );
          return;
        }
        sendJson(res, 400, {
          ok: false,
          message: 'Invalid request body. Send JSON or URL-encoded form fields.',
          errors: {},
        });
        return;
      }

      const result = validateInquiry(parsedBody.data);

      if (result.isBot) {
        const botRef = `CC-${new Date().getFullYear()}-0000`;
        if (htmlMode) {
          sendHtmlResponse(res, 200, 'Received', 'Inquiry received.', `<p>Reference #: ${botRef}</p>`);
          return;
        }
        sendJson(res, 200, { ok: true, referenceId: botRef, message: 'Submission received.' });
        return;
      }

      if (Object.keys(result.errors).length > 0) {
        if (htmlMode) {
          const items = Object.values(result.errors)
            .map((msg) => `<li style="margin-bottom:0.4rem;">${escapeHtml(msg)}</li>`)
            .join('');
          sendHtmlResponse(
            res,
            400,
            'Missing Required Criteria',
            'Please complete all required fields.',
            `<p style="color:var(--ink-secondary);margin-bottom:0.75rem;">Your inquiry could not be submitted because the following criteria were not met:</p><ul style="padding-left:1.25rem;color:var(--status-error);">${items}</ul>`
          );
          return;
        }
        sendJson(res, 400, {
          ok: false,
          message: 'Please review the highlighted fields before submitting.',
          errors: result.errors,
        });
        return;
      }

      const referenceId = `CC-${new Date().getFullYear()}-${crypto
        .randomInt(1000, 9999)
        .toString()}`;

      const record = {
        referenceId,
        receivedAt: new Date().toISOString(),
        ...result.data,
      };

      appendInquiry(record);

      if (htmlMode) {
        const optInLabel = record.consent.emailOptIn
          ? 'Opted in to Civil Construction email updates'
          : 'Estimate reply only';
        sendHtmlResponse(
          res,
          201,
          'Estimate Request Received',
          'Thank you — your inquiry is logged.',
          `<p style="color:var(--ink-secondary);margin-bottom:1rem;">One of our owners will contact you within one business day to schedule your free site walk-through.</p>
           <div class="form-confirmation__meta">
             REFERENCE #: ${escapeHtml(referenceId)}<br />
             CONTACT: ${escapeHtml(record.name)} (${escapeHtml(record.email)})<br />
             SERVICE: ${escapeHtml(record.sector)} | BUDGET: ${escapeHtml(record.budget)}<br />
             LICENSE AGREEMENT: Accepted (Rev ${escapeHtml(record.consent.agreementVersion)})<br />
             EMAIL CONSENT: ${escapeHtml(optInLabel)}
           </div>`
        );
        return;
      }

      sendJson(res, 201, {
        ok: true,
        referenceId,
        receivedAt: record.receivedAt,
        consent: record.consent,
        message: 'Inquiry saved and routed to the Civil Construction owners.',
      });
    } catch (err) {
      if (err && err.message === 'PAYLOAD_TOO_LARGE') {
        sendJson(res, 413, { ok: false, message: 'Submission payload is too large.' });
        return;
      }
      sendJson(res, 500, {
        ok: false,
        message: 'Unexpected server error while saving your request. Please call (555) 234-8910.',
      });
    }
    return;
  }

  if (req.method === 'GET' || req.method === 'HEAD') {
    serveStatic(req, res, reqUrl.pathname);
    return;
  }

  res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Method Not Allowed');
});

ensureDataStore();
server.listen(PORT, HOST, () => {
  console.log(`Civil Construction active server running on http://${HOST}:${PORT}`);
});
