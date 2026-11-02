# BlueGuard Infrastructure Setup

## Phase 0 Status

This document records the infrastructure required by the target architecture. No external service was connected, no credential was requested, and no production resource was created during Phase 0.

| Service | Required? | Purpose | Account/Project | Credential/ID | Environment Variable | Location |
|---------|-----------|---------|----------------|---------------|----------------------|----------|
| Node.js and npm | Required for development | Run backend, frontend, scripts, and tests | Local developer machine | None | None | Local toolchain |
| MongoDB Atlas | Required before database implementation | New BlueGuard database | New Atlas project and cluster | Private database user and URI | `MONGODB_URI` | `backend/.env` |
| OpenStreetMap tiles | Suitable for development map display | Website map tiles | No account required for normal attribution-based development use | None | Optional tile URL config | Frontend/mobile configuration |
| Map provider with geocoding | Optional | Search/reverse geocoding if later approved | Decide after requirements | Provider-specific key | Provider-specific private/public variable | Backend or client according to provider |
| Image storage | Required before real image reporting | Store pollution evidence | Choose a university-capstone-appropriate provider or controlled local development storage | Private storage credentials | `STORAGE_URL`, `STORAGE_KEY` or provider-specific variables | `backend/.env` |
| Python runtime | Required for AI service implementation | Run replaceable AI service | Local environment initially | None | `AI_SERVICE_URL` | `ai/.env` and `backend/.env` |
| AI model/dataset | Required for real AI claims; not required for Phase 0 | Classify pollution images | Dataset/model source must be researched and approved | Dataset/model access as applicable | `MODEL_PATH` or service-specific variable | `ai/.env` |
| Expo/EAS | Optional until mobile build/distribution | Develop and package the mobile app | Expo account only if device builds/distribution require it | Expo project ID/token as applicable | `EXPO_PUBLIC_API_URL` is public; EAS secrets remain private | `mobile/.env` or EAS configuration |
| Hosting | Optional until deployment is approved | Host website, API, and AI service | Choose after local implementation | Deployment credentials | Provider-specific variables | Deployment platform |
| Email/notifications | Optional | Account notifications and report updates | Only create if a feature requires it | Private provider credentials | Provider-specific variables | `backend/.env` |

## What Must Be Created Before Dependent Implementation

### New MongoDB Atlas project

**WHY:** BlueGuard requires a new database and must not depend on the old BlueFusion database or its credentials.

**WHERE:** Official MongoDB Atlas website: `https://www.mongodb.com/atlas`

**CREATE:** A new project, a development cluster, a dedicated database user, and network access appropriate for development.

**I NEED FROM YOU:** The new BlueGuard MongoDB connection URI after replacing any password placeholder with the database user's password. Do not paste the URI into chat if it contains a credential; put it directly in `backend/.env`.

**PUT IT HERE:** `backend/.env`

**VARIABLE:** `MONGODB_URI=`

**SECURITY:** Private. Never commit it or place it in frontend/mobile code.

No Atlas project is needed to review or document Phase 0.

### Image storage decision

**WHY:** Real pollution reports include images, but the current repository has no image storage implementation.

**DECISION NEEDED:** Approve local-only development storage first, or select a cloud object/image provider after comparing cost, privacy, retention, and university-project practicality.

**DO NOT CREATE YET:** No paid storage account or production bucket should be created during Phase 0.

### AI service decision

**WHY:** The target architecture includes a Python service, but the repository contains no model or labeled image data.

**DECISION NEEDED:** Approve a development-only Python service interface first. A real model and dataset must be researched and evaluated separately.

**DO NOT CLAIM:** No accuracy, classification quality, or trained model exists yet.

## Environment Variable Policy

- Private values belong only in ignored `.env` files or deployment secret stores.
- Frontend and mobile variables with `VITE_` or `EXPO_PUBLIC_` are public and must never contain secrets.
- Backend secrets include `MONGODB_URI`, `JWT_SECRET`, storage credentials, and AI-provider credentials.
- The AI service must receive only the configuration it needs.
- `.env.example` files contain names and safe placeholders only.

## Not Required for Phase 0

Authentication providers, paid map APIs, email, push notifications, production hosting, and paid AI APIs are not required to audit or plan the repository. They should be added only when a specific approved feature needs them.
