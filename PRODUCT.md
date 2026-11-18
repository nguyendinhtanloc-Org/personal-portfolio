# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: technical recruiters and hiring leads for Data Engineering / Data Analytics / Computer Vision internships in Ho Chi Minh City & Dong Nai (Vietnam). They read the page in roughly 2–5 minutes while screening an application, then either shortlist for an interview or move on. The page is judged by credibility of claims, not by feature count.

## Product Purpose

A static personal portfolio for Nguyễn Đình Tân Lộc (Data Engineering, HCMUTE, graduating 2027) that proves — not merely states — his DE/DA/CV capabilities. Success means: a recruiter can verify the three featured projects, read real references, and reach the owner (email/phone/resume PDF) without friction. It actively supports the job search for internships across DE, DA, and CV.

## Positioning

Evidence-first data engineering. The site's different mechanism: quantitative claims carry their proof inline (reconciliation logs, kill-test run output, verified-result lines), and anything not yet demonstrated is labeled *estimate* — never presented as a result. This is stated as a design rule on the page itself ("One source of truth per layer — if a number disagrees, the disagreement is findable").

## Operating Context

Static site, no build step, no framework, no npm. Deployed to Vercel (primary) and GitHub Pages (fallback) — both must keep working, so all asset paths are relative and `vercel.json` carries headers/caching. Bilingual EN/VI via a zero-dependency i18n module; English is the source of truth in markup, Vietnamese strings live in `js/i18n.js`. A4 print stylesheet exists for PDF export.

## Capabilities and Constraints

- Confirmed: vanilla HTML/CSS/JS modules in `js/` (i18n, theme, navigation, modal, contact form, spotlight, project filter, terminal runner, clock, command palette, endorsements); CSS split into 5 files under `css/` imported via `styles.css`; EN/VI toggle persisted in `localStorage`.
- Hard constraint (user-confirmed): **evidence-first**. Every number on the page must be real. Project evidence blocks (`index.html` lines ~430, ~503) are currently *sample data* per their own comments and must be replaced with real output or removed before the site is treated as recruiter-facing. Endorsement author names in `js/endorsements.js` are still placeholders (`[Advisor Name]`, `[Mentor Name]`, `[Supervisor Name]`) and must not be presented as real references until real names/quotes exist.
- Constraint: no new runtime dependencies; no build step; keeps both deploy targets working.
- Open decision: canonical URL / `og:url` are intentionally absent until the final domain is chosen (noted in `index.html` comment).

## Brand Commitments

- Visual system: "Warm Sand & Champagne Bronze" — light mode warm sand `#faf8f5`, dark mode warm charcoal `#121110`, accent champagne bronze `#b4833e`/`#d4a359` (defined in `css/variables.css`).
- Typography: Inter (sans) + IBM Plex Mono, tabular numerals for KPIs/real-time figures; serif fonts are explicitly excluded by design decision.
- Stated anti-tropes (from project design philosophy): no decorative squiggles, no meaningless ordinal labels, no fake seals/ornamental arrows; UI labels in sentence case.
- Voice: honest, technical, first-person; claims separated from estimates.

## Evidence on Hand

- `assets/docs/NguyenDinhTanLoc_Resume.pdf` — downloadable résumé.
- `assets/images/bd-certificate.jpg` — Samsung Innovation Campus Big Data certificate (real, shown in lightbox).
- JTE research paper: co-authored, published — live link `https://jte.edu.vn/index.php/jte/article/view/2148` (DOI 10.54644/jte.2026.2148).
- Internships claimed: AWS FCAJ (cloud & data, 10–12/2026), QT-Data VN (data, 10–11/2026).
- Absent, and future work must NOT fabricate: real project run logs (current evidence blocks are marked samples), named mentors/supervisors (current endorsements are placeholders), deployment URL (canonical/og:url pending).

## Product Principles

1. Evidence over assertion: a claim without a verifiable artifact is marked estimate or removed.
2. Static simplicity: no framework, no build step; every interaction is a small self-contained module.
3. Bilingual by construction: EN and VI stay in lockstep; adding a string without both languages is a defect.
4. Restraint in motion: motion must earn its place (prefers-reduced-motion is honored everywhere it's implemented).
5. Credibility is the product: the page sells the person's reliability, so every visible detail (name spelling, fonts actually loaded, real numbers) must be true.

## Accessibility & Inclusion

Respects `prefers-reduced-motion` in i18n, navigation reveal, and spotlight; modals and the command palette use dialog semantics with Escape-to-close. Bilingual support is a core user need (VI native, EN working language). No additional product-specific requirement established.
