# BlueGuard

Marine pollution awareness, reporting, biodiversity visualization, and public participation platform.

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8%2B-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

## About the project

Marine pollution is difficult to monitor consistently because observations are distributed across locations and communities. I am developing BlueGuard as a solo project to provide a place where authenticated users can submit location-based pollution reports with image evidence, while administrators review reports before they become publicly visible. The project also presents awareness content, biodiversity reference data, historical marine-litter assessments, maps, analytics, and a prototype risk estimate. Real AI/ML image classification is not implemented yet; the repository currently contains an explicit development-only AI service interface.

## SDG alignment

- **SDG 14 — Life Below Water:** Supports marine-pollution awareness and collection of location-based observations related to marine environments.
- **SDG 12 — Responsible Consumption and Production:** Provides awareness content about reducing waste and preventing marine litter.

## Features

- [x] Email/password registration and login with JWT authentication
- [x] User roles for `USER` and `ADMIN`
- [x] Authenticated pollution-report submission
- [x] Local-development image upload with JPEG, PNG, and WebP validation
- [x] Manual latitude/longitude entry in the web reporting flow
- [x] GPS capture in the Expo mobile reporting flow
- [x] Admin review with verify, reject, and resolve report actions
- [x] Public map showing verified and resolved reports
- [x] Pollution statistics by type, severity, status, and month
- [x] Prototype geographic hotspot calculation
- [x] Marine-awareness content with cited public sources
- [x] Biodiversity dataset retrieval, upload, and visualization
- [x] Historical EEA marine-litter assessment retrieval and display
- [x] Prototype potential-risk estimate based on available report and historical-assessment evidence
- [x] Web client
- [x] Expo/React Native mobile client
- [ ] Real AI/ML pollution-image classification
- [ ] AI training dataset, training pipeline, and evaluation metrics
- [ ] Cloud or production image storage
- [ ] Clean-up event management
- [ ] Production deployment configuration

## Tech stack

| Layer | Technology | Purpose |
|---|---|---|
| Web frontend | React, Vite, TypeScript | Browser application and page-level workflows |
| Web maps | Leaflet, React Leaflet, OpenStreetMap tiles | Display verified pollution reports |
| Web charts | Recharts | Biodiversity and data visualizations |
| Mobile frontend | Expo, React Native, TypeScript | Mobile reporting flow |
| Mobile location | `expo-location` | Capture the device's foreground GPS location |
| Mobile image selection | `expo-image-picker` | Select pollution evidence images |
| Mobile maps | `react-native-maps` | Display verified reports in the mobile app |
| Backend | Node.js, Express, TypeScript | REST API and server middleware |
| Database | MongoDB, Mongoose | Store users, pollution reports, biodiversity records, and historical assessments |
| Authentication | `bcryptjs`, `jsonwebtoken` | Password hashing and JWT authentication |
| File handling | `multer` | Validate and save local image uploads |
| Backend security | `helmet`, `cors`, `express-rate-limit` | Security headers, cross-origin configuration, and authentication rate limiting |
| Historical geospatial preparation | Python, GeoPandas | Prepare the historical EEA assessment data |
| AI service interface | Python standard library HTTP server | Development-only `/health` and `/classify` endpoints; no model is included |

## Project structure

```text
BlueGuard/
├── .github/
│   └── copilot-instructions.md       # Workspace-specific development instructions
├── ai/
│   ├── README.md                     # AI service limitations and run instructions
│   └── service.py                    # Dependency-free development AI service stub
├── backend/
│   ├── src/
│   │   ├── app.ts                    # Express app, middleware, and route mounting
│   │   ├── index.ts                  # MongoDB connection and server startup
│   │   ├── middleware/               # JWT authentication and admin authorization
│   │   ├── models/                   # Mongoose models
│   │   └── routes/                   # REST API route handlers
│   ├── scripts/                      # Biodiversity, historical-data, and admin utilities
│   ├── data/                         # Historical EEA marine-litter source data
│   ├── Biodiveristy.json             # Biodiversity reference dataset
│   ├── requirements-geo.txt           # GeoPandas dependency constraint
│   └── package.json                  # Backend scripts and dependencies
├── docs/                             # Architecture, schema, infrastructure, and audit documents
├── frontend/
│   ├── src/
│   │   ├── App.tsx                   # Active web application shell and navigation
│   │   ├── components/               # Shared web components
│   │   └── pages/                    # Web feature pages
│   └── package.json                  # Frontend scripts and dependencies
├── mobile/
│   ├── App.tsx                       # Expo mobile reporting and map flow
│   └── package.json                  # Mobile scripts and dependencies
├── package.json                      # Workspace scripts for the repository
└── package-lock.json                 # Root npm dependency lockfile
```

## AI/ML component

- **Model:** Not implemented yet. No trained classifier, model weights, inference library, or model architecture was found.
- **Dataset:** Not found for pollution-image classification.
- **Classes:** Not implemented yet. The report form contains manually selected categories such as plastic waste, fishing waste, oil/chemical-like pollution, general waste, and other/unknown, but these are not trained model classes.
- **Accuracy and metrics:** Not found.
- **Current interface:** `POST /api/ai/classify` forwards an `imageUrl` to the configured AI service. The current Python service returns `status: "unavailable"` with no prediction or confidence.
- **Existing non-image datasets:** The repository contains 1,113 biodiversity records and 7,083 historical EEA assessment features. These are not image-classification training data.

## Getting started

### Prerequisites

- Node.js 18 or newer
- npm
- A configured MongoDB database
- Python 3 for the development AI service

### Installation

From the repository root:

```bash
npm install
```

The repository also includes a workspace installation script:

```bash
npm run install:all
```

### Environment variables

Create `backend/.env` from `backend/.env.example`:

```bash
cp backend/.env.example backend/.env
```

The backend environment variable names are:

- `NODE_ENV`
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `AI_SERVICE_URL`
- `CORS_ORIGIN`
- `AUTH_RATE_LIMIT_WINDOW_MS`
- `AUTH_RATE_LIMIT_MAX`
- `STORAGE_URL`
- `STORAGE_KEY`

The mobile app reads:

- `EXPO_PUBLIC_API_URL`

No secret values are included in this README.

### Run the project

Run the web frontend and backend together:

```bash
npm run dev
```

Run them separately:

```bash
npm run dev:frontend
npm run dev:backend
```

Run the mobile app:

```bash
npm run dev:mobile
```

Run the development AI service:

```bash
python3 ai/service.py
```

The configured local ports are:

- Web frontend: `http://localhost:5173`
- Backend: `http://localhost:5001` when `PORT=5001` is set in `backend/.env`
- Development AI service: `http://localhost:8000`

### Validation commands

```bash
npm run build
npm run lint --prefix frontend
npm test --prefix backend
```

## Usage

1. Open the web application or start the Expo mobile application.
2. Register or sign in with an email address and password.
3. Choose or capture an image of the pollution evidence.
4. Enter pollution type, severity, and an optional description.
5. Enter coordinates in the web app, or capture the current GPS location in the mobile app.
6. Submit the report.
7. The report is stored as `PENDING`.
8. An administrator reviews the report and can verify, reject, or resolve it.
9. Verified and resolved reports become available to the public report list, map, and analytics endpoints.

## API endpoints

| Method | Route | Purpose | Authentication |
|---|---|---|---|
| GET | `/` | Return an API welcome message | Public |
| GET | `/health` | Return service status and timestamp | Public |
| POST | `/api/auth/register` | Register a user | Public |
| POST | `/api/auth/login` | Authenticate a user and return a JWT | Public |
| GET | `/api/auth/me` | Return the authenticated user's profile | JWT |
| POST | `/api/uploads` | Upload one local image | JWT |
| POST | `/api/ai/classify` | Forward an image URL to the AI service interface | JWT |
| GET | `/api/reports` | List public verified/resolved reports | Public |
| GET | `/api/reports/map` | Return verified/resolved reports for maps | Public |
| GET | `/api/reports/my` | List the authenticated user's reports | JWT |
| POST | `/api/reports` | Create a pending pollution report | JWT |
| GET | `/api/reports/:id` | Get one report owned by the authenticated user | JWT |
| PATCH | `/api/reports/:id` | Edit an owned pending report | JWT |
| GET | `/api/admin/reports` | List reports for moderation | Admin JWT |
| PATCH | `/api/admin/reports/:id/verify` | Verify a pending report | Admin JWT |
| PATCH | `/api/admin/reports/:id/reject` | Reject a pending report | Admin JWT |
| PATCH | `/api/admin/reports/:id/resolve` | Resolve a verified report | Admin JWT |
| GET | `/api/biodiversity` | Retrieve biodiversity records | Public |
| POST | `/api/biodiversity/import` | Import a biodiversity array | Public |
| GET | `/api/statistics` | Return verified-report statistics | Public |
| GET | `/api/hotspots` | Return prototype verified-report hotspots | Public |
| GET | `/api/awareness` | Return awareness items | Public |
| GET | `/api/conservation` | Return the current conservation-activity response | Public |
| GET | `/api/historical-assessments` | Retrieve historical EEA assessment records | Public |
| GET | `/api/risk` | Calculate the prototype potential-risk estimate | Public |

The AI service also exposes:

| Method | Route | Purpose |
|---|---|---|
| GET | `/health` | Report that the model is unavailable |
| POST | `/classify` | Validate an image URL and return an explicit unavailable response |

## Current status and roadmap

### Works now

- React/Vite web application builds successfully.
- Express/TypeScript backend builds successfully.
- Backend tests cover health, security headers, request-size handling, authentication requirements, and basic validation.
- Frontend linting is configured.
- Registration, login, JWT-protected reporting, local image upload, admin moderation, public verified-report maps, awareness content, biodiversity views, historical assessment views, and prototype analytics/risk endpoints are implemented in code.

### In progress or incomplete

- The AI service is only an interface and does not classify images.
- Image files are stored locally for development rather than in a production storage service.
- The risk calculation is a prototype heuristic and is not scientifically validated.
- Conservation activities currently return an empty list and an explanatory message.
- The project has no production deployment configuration.
- Frontend automated tests were not found.

### Roadmap

1. Add and document a properly licensed, labeled pollution-image dataset.
2. Implement and evaluate a replaceable pollution-image classification model.
3. Connect validated predictions to the report lifecycle without presenting unavailable results as classifications.
4. Replace local image storage with an appropriate persistent storage solution.
5. Add automated end-to-end coverage for report submission and moderation.
6. Implement clean-up event data and participation workflows.
7. Add deployment configuration after the local workflows are stable.

## Limitations

- AI/ML prediction is not available.
- No image dataset, training process, accuracy report, or model version is included.
- Local uploads are not a production storage solution.
- Public pollution data is limited to reports with `VERIFIED` or `RESOLVED` status.
- The risk score is a prototype estimate based on nearby verified/resolved reports and historical assessment intersections.
- Historical assessment data is external/contextual data and is kept separate from user reports.
- MongoDB configuration and required environment variables are needed for the backend to start.
- No hosting provider or deployment target is configured.
- Clean-up events are not implemented.

## Author

| Name | Role |
|---|---|
| Not specified in the repository | Solo developer |

## License

License: Not specified in the repository. Add the project's license before distribution.

## Acknowledgements

- Biodiversity reference data stored in `backend/Biodiveristy.json`.
- Historical marine-litter assessment data from the European Environment Agency, stored under `backend/data/eea-marine-litter/`.
- Awareness references from the United Nations Environment Programme, the European Environment Agency, and the United Nations Sustainable Development Goals.
- React, Vite, TypeScript, Express, MongoDB/Mongoose, Expo, React Native, Leaflet, Recharts, and the other libraries listed in the project package manifests.
- OpenStreetMap contributors for the web map tile layer.
