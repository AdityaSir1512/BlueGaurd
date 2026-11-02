# BlueGuard Development Plan

## Phase Gate Rule

Work proceeds one phase at a time. At the end of each phase, run the relevant type checks, lint, builds, tests, API checks, and manual client checks. Record changes, files, commands, results, remaining issues, and approval for the next phase.

## Phase 0: Audit and Decisions (current)

Completed findings:

- Existing project is React/Vite plus Express/TypeScript, not Next.js.
- Active frontend and backend entry points identified.
- Existing biodiversity dataset contains 1,113 records and no pollution records.
- No environment files or tracked credentials found.
- No mobile or Python AI project exists.
- Existing map/chart components contain hard-coded demo data.
- Existing upload is client-only.
- Duplicate and legacy files identified.
- Build and frontend lint pass after dependency installation.
- Production audit reports dependency vulnerabilities; no automatic upgrade was applied.

Deliverables:

- `docs/DATABASE_DATA_REQUIREMENTS.md`
- `docs/INFRASTRUCTURE_SETUP.md`
- `docs/ARCHITECTURE.md`
- `docs/DEVELOPMENT_PLAN.md`
- Safe environment templates

Gate: user approves the audit, migration strategy, new infrastructure plan, and scope.

## Phase 1: Branding and Repository Cleanup

- Define BlueGuard terminology and information architecture.
- Update documentation and package metadata.
- Separate active, reusable, legacy, and generated files.
- Preserve useful BlueFusion functionality until replacement is verified.
- Add quality gates and baseline tests.

Gate: website still builds and existing biodiversity flow remains usable.

## Phase 2: New Infrastructure and Environment Configuration

- User creates a new MongoDB Atlas project or approves a local development database.
- Add backend, frontend, mobile, and AI environment templates/configuration.
- Add secret handling and validation without committing credentials.
- Decide image storage and map requirements.

Gate: new development infrastructure is confirmed; no old database dependency remains.

## Phase 3: New Database Architecture and Data Decision

- Finalize schemas and indexes.
- Decide whether to import the biodiversity dataset into a separate reference collection.
- Document source, transformation, accepted/rejected counts, and import date.
- Keep pollution, external historical, biodiversity, and derived data distinct.

Gate: migration mapping and new collection design approved before any migration.

## Phase 4: Authentication and Authorization

- Implement registration, login, profile, secure password hashing, sessions/tokens, and USER/ADMIN roles.
- Add ownership and admin authorization tests.

Gate: protected API behavior is tested.

## Phase 5: Pollution Reporting Backend

- Implement report creation, retrieval, ownership, status transitions, validation, image metadata, and moderation audit trail.
- Preserve biodiversity APIs.

Gate: API tests cover validation, authorization, and lifecycle behavior.

## Phase 6: Website Reporting

- Add website registration/login, image report flow, AI-assistance review, location, severity, and report management.
- Use API-backed state and environment-based API URL.

Gate: a complete website report flow works with real development data.

## Phase 7: Expo Mobile Application

- Create `/mobile` as a separate Expo TypeScript app.
- Share API contracts and branding, not client-specific layout code.
- Implement authentication and report flow.

Gate: mobile app connects to the same backend in development.

## Phase 8: GPS and Maps

- Add permission handling, actual coordinates, manual adjustment, report markers, filters, and detail views.
- Adapt Leaflet for website and use an Expo-compatible map solution for mobile.

Gate: no fabricated coordinates; map data comes from API records.

## Phase 9: AI Image Classification

- Create `/ai` Python service interface.
- Research and approve labeled pollution image data.
- Implement development status honestly before a trained model.
- Add model version, confidence, user correction, and evaluation reporting.

Gate: AI status and metrics are explicit in the UI and documentation.

## Phase 10: Historical Pollution Data

- Research credible public data, beginning with an EEA Marine LitterWatch review.
- Document source, coverage, license, limitations, cleaning, and relevance.
- Import only approved, provenance-tagged data.

Gate: historical data is visibly separate from BlueGuard user reports.

## Phase 11: Analytics

- Add API-backed type, severity, time, status, geographic, and historical/current charts.
- Remove fabricated dashboard statistics.

Gate: every displayed value has a traceable data source.

## Phase 12: Hotspots

- Define a documented spatial aggregation method.
- Require minimum data thresholds and uncertainty/sufficiency labels.
- Expose hotspot levels only from actual records.

Gate: methodology and tests are documented.

## Phase 13: Potential Risk Estimation

- Define inputs, time window, scoring method, limitations, and insufficient-data behavior.
- Use the labels `Potential Risk`, `Risk Estimate`, or `Risk Score`.

Gate: no guaranteed prediction claims.

## Phase 14: Awareness and Conservation

- Add reviewed education content with sources.
- Add conservation activities only from verified information or clearly labeled user-created content.

Gate: no invented partnerships, events, or scientific claims.

## Phase 15: Admin Dashboard

- Add report review, image/AI/coordinate inspection, verification, rejection, resolution, statistics, content, activity, and user management.

Gate: admin actions are protected and audited.

## Phase 16: Testing, Security, and Performance

- Add backend/API tests, frontend tests, mobile tests, validation, rate limits, upload security, accessibility checks, bundle review, and dependency review.
- Reassess reported vulnerabilities and apply upgrades deliberately.

Gate: release checklist passes.

## Phase 17: Documentation and Capstone Preparation

- Update README and setup guides.
- Document architecture, data provenance, AI limits, methodology, privacy, testing, and deployment.
- Prepare demonstration flow and final capstone materials.

## Current Stop Condition

Phase 0 is the only phase authorized by the pasted transformation prompt at this point. No database connection, migration, deployment, paid service, production credential, or full application implementation should occur until the user approves the Phase 0 documents and decisions.
