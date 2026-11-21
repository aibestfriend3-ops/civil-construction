# Civil Construction Service (`civilconstructionservice.com`)

A responsive, zero-dependency HTML5 / Vanilla CSS / Vanilla JavaScript website and active Node.js inquiry backend for **Civil Construction Service**, a small family-owned civil construction company.

## Features

- **Brand-Matched Design System (`styles.css`)** — Matched directly to the Civil Construction Service logo (`#1A1A1A` obsidian charcoal, `#F5A623` construction gold, and warm concrete neutrals) with crisp vector logo assets (`assets/logo-mark.svg`, `assets/logo.svg`).
- **Interactive Services Switcher (`#disciplines`)** — Covers *Site Prep & Excavation*, *Concrete & Foundations*, *Drainage & Utilities*, and *Driveways & Access Roads*.
- **Filterable Local Project Gallery & Modal (`#projects`)** — Filter local residential, commercial, and township jobs by category and inspect project details.
- **Ballpark Project Cost Calculator (`#estimator`)** — Instant ballpark range and duration calculator with one-click attachment into the quote form.
- **Active Quote Form with License Agreement & Email Opt-In (`#contact` + `server.js`)**:
  - Live 7-criteria validation on both client and server (full name, valid email, 10-digit phone, service, budget range, 20+ character scope description, and required License Agreement acceptance).
  - Readable **License Agreement & Email Opt-In Modal** (`Rev 2026.1`) with explicit email opt-in checkbox and anti-spam honeypot field.
  - Real `POST /api/inquiries` endpoint persisting submissions and timestamped consent records to `data/inquiries.json` (excluded from git via `.gitignore`).

## Project Structure

```text
civil-construction/
├── index.html          # Semantic HTML5 markup, SEO & License Agreement modal
├── styles.css          # Brand-matched Vanilla CSS design system
├── script.js           # Interactive UI, estimator & active fetch form logic
├── server.js           # Zero-dependency Node.js static + POST /api/inquiries server
└── assets/             # Brand vector logos & site photography
    ├── logo.svg
    ├── logo-mark.svg
    ├── logo.png
    ├── hero-sitework.jpg
    ├── project-excavation.jpg
    ├── project-concrete.jpg
    ├── project-drainage.jpg
    └── project-roadway.jpg
```

## Running Locally

Start the active server (serves the website and handles `POST /api/inquiries`):

```bash
node server.js
```

By default, the server listens on `http://127.0.0.1:8080` (configurable via `PORT` and `HOST` environment variables). Submitted quotes and email opt-in consent logs are stored locally in `data/inquiries.json`.
