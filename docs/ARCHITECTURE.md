# BlueGuard Architecture

## Current BlueFusion Architecture Audit

```text
React + Vite frontend
        |
        | environment-configured API URL (local default: localhost:5001)
        v
Express + TypeScript backend
        |
        | Mongoose
        v
MongoDB fallback URI: mongodb://localhost:27017/bluefusion
```

The frontend entry point is `frontend/src/main.tsx`. The active dashboard is `frontend/src/App.tsx`. The backend entry point is `backend/src/index.ts`. The backend connects to MongoDB before listening, uses global CORS, and exposes root, health, and biodiversity routes.

The repository has no authentication, image storage, AI service, mobile application, historical pollution data, pollution-report model, admin authorization, production deployment configuration, or environment files.

## Target BlueGuard Architecture

```text
                    BlueGuard ecosystem
                 /                      \
       React + Vite website       Expo + React Native mobile
                 \                      /
                  Shared REST API
                Node + Express + TypeScript
                   /       |        \
             MongoDB    Python AI    Image storage
             (new)       service      (approved later)
```

Both clients must use the same BlueGuard backend and new MongoDB database. The old BlueFusion fallback URI is not a BlueGuard dependency.

## Proposed Boundaries

### Website

A React + Vite application optimized for exploration, maps, reporting, analytics, historical data, awareness, conservation, and administration. Reuse of existing Leaflet and Recharts code is possible after replacing hard-coded demo data with API-backed values.

### Mobile

A separate Expo + React Native + TypeScript application optimized for camera capture, GPS reporting, nearby reports, maps, awareness, and participation. It should consume the same REST API rather than duplicate business logic.

### Backend

A shared Express API responsible for authentication, authorization, validation, report lifecycle, upload handling, map queries, analytics, and coordination with the AI service. Existing biodiversity routes should be preserved under a clearly separated namespace.

### Database

A new MongoDB database with separate collections for users, pollution reports, external historical pollution, biodiversity observations, awareness content, conservation activities, and derived risk assessments. Exact schemas require approval based on `docs/DATABASE_DATA_REQUIREMENTS.md`.

### AI Service

A replaceable Python HTTP service. It must return a classification, confidence, model version, and development/evaluation status. It must not be represented as a trained or accurate model until an evaluation exists.

## Data Flow: Pollution Report

```text
User captures/selects image and location
        |
        v
Client validates input and sends report
        |
        v
Backend authenticates user and validates payload
        |
        +--> image storage (approved implementation)
        +--> Python AI service (development or evaluated model)
        |
        v
MongoDB PollutionReport with source and audit metadata
        |
        v
Admin verification and status transition
        |
        v
Map, statistics, hotspot methodology, and risk estimate
```

AI is advisory. The user can correct the predicted type, and moderation status remains independent from AI confidence.

## API Direction

The prompt's proposed API groups are suitable as a starting point:

- `/api/auth`
- `/api/users`
- `/api/reports`
- `/api/ai`
- `/api/statistics`
- `/api/hotspots`
- `/api/risk`
- `/api/awareness`
- `/api/conservation`
- `/api/admin`
- Existing `/api/biodiversity`

The final contract should be written before implementation and should specify authentication, validation, pagination, error format, status transitions, and ownership rules.

## Reuse and Replacement Map

| Existing asset | Decision | Reason |
|----------------|----------|--------|
| Biodiversity schema and route | Reuse selectively | Useful contextual data, but keep separate from pollution reports |
| Biodiversity JSON | Preserve as source/reference | It contains real checked-in biodiversity observations, not pollution data |
| Biodiversity charts/page | Reuse and adapt | Existing functionality supports the biodiversity section |
| Leaflet dependency and map component | Reuse technically, replace data | Current stations/protected areas are hard-coded demo values |
| Recharts dependency and chart components | Reuse technically, replace data | Current charts contain hard-coded dummy values |
| Data upload component | Reuse ideas, redesign | Current uploads are client-only and parser is simplistic |
| Existing MongoDB URI fallback | Replace | It is old infrastructure and must not be used for BlueGuard |
| Existing inline dashboard styling | Reuse selectively | Branding and UX require a deliberate BlueGuard redesign |
| Duplicate files outside `backend/src` | Keep as audit reference initially | They are not compiled by current `tsconfig`; cleanup requires approval |
| `App_ocean.tsx` and unused page components | Audit then selectively reuse | They are not in the active render path |

## Security and Privacy Boundaries

- Passwords must be hashed; never store plaintext passwords.
- JWT or session secrets remain backend-only.
- Validate ownership before users read or modify their reports.
- Protect admin routes by role.
- Validate image type, size, and content before storage.
- Avoid exposing precise reporter location unless product/privacy policy allows it.
- Keep external data, user reports, and derived analytics labeled separately.
- Never commit real secrets.

## Phase 0 Non-Goals

This document does not authorize database creation, migration, deployment, production credentials, full API implementation, mobile scaffolding, AI model training, or deletion of existing files.
